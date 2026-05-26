import uuid
import os
import math
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import User, Match, Conversation, Message, MatchStatus

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Auth helpers ──────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: uuid.UUID) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


# ── User CRUD ─────────────────────────────────────────────────────────────────

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, email: str, full_name: str, password: str) -> User:
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hash_password(password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def update_user(db: AsyncSession, user: User, data: dict) -> User:
    for key, value in data.items():
        if value is not None:
            setattr(user, key, value)
    await db.commit()
    await db.refresh(user)
    return user


async def list_users(
    db: AsyncSession,
    current_user_id: uuid.UUID,
    industry: Optional[str] = None,
    startup_stage: Optional[str] = None,
    skill: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
) -> List[User]:
    stmt = select(User).where(User.id != current_user_id, User.is_active == True)
    if industry:
        stmt = stmt.where(User.industry == industry)
    if startup_stage:
        stmt = stmt.where(User.startup_stage == startup_stage)
    if skill:
        stmt = stmt.where(User.skills.contains([skill]))
    stmt = stmt.limit(limit).offset(offset)
    result = await db.execute(stmt)
    return list(result.scalars().all())


# ── AI matchmaking ────────────────────────────────────────────────────────────

def _score_compatibility(user_a: User, user_b: User) -> float:
    score = 0.0

    if user_a.industry and user_b.industry:
        score += 20.0 if user_a.industry == user_b.industry else 0.0

    if user_a.startup_stage and user_b.startup_stage:
        score += 15.0 if user_a.startup_stage == user_b.startup_stage else 0.0

    skills_a = set(user_a.skills or [])
    skills_b = set(user_b.skills or [])
    if skills_a and skills_b:
        overlap = len(skills_a & skills_b)
        union = len(skills_a | skills_b)
        score += 40.0 * (overlap / union) if union else 0.0

    interests_a = set(user_a.interests or [])
    interests_b = set(user_b.interests or [])
    if interests_a and interests_b:
        overlap = len(interests_a & interests_b)
        union = len(interests_a | interests_b)
        score += 25.0 * (overlap / union) if union else 0.0

    return round(min(score, 100.0), 2)


def _generate_ai_summary(user_a: User, user_b: User, score: float) -> str:
    skills_a = user_a.skills or []
    skills_b = user_b.skills or []
    shared = list(set(skills_a) & set(skills_b))
    complementary = list((set(skills_a) | set(skills_b)) - set(shared))

    parts = [f"Compatibility score: {score}/100."]
    if shared:
        parts.append(f"Shared skills: {', '.join(shared[:3])}.")
    if complementary:
        parts.append(f"Complementary skills: {', '.join(complementary[:3])}.")
    if user_a.industry == user_b.industry and user_a.industry:
        parts.append(f"Both focused on {user_a.industry}.")
    return " ".join(parts)


async def get_ai_suggestions(db: AsyncSession, user: User, limit: int = 10) -> List[dict]:
    already_matched_stmt = select(Match.target_id).where(Match.requester_id == user.id)
    already_matched = {row for row in (await db.execute(already_matched_stmt)).scalars()}

    candidates_stmt = (
        select(User)
        .where(User.id != user.id, User.is_active == True, User.id.not_in(already_matched))
        .limit(100)
    )
    candidates = list((await db.execute(candidates_stmt)).scalars())

    scored = []
    for candidate in candidates:
        score = _score_compatibility(user, candidate)
        summary = _generate_ai_summary(user, candidate, score)
        scored.append({"user": candidate, "score": score, "summary": summary})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:limit]


# ── Match CRUD ────────────────────────────────────────────────────────────────

async def create_match(
    db: AsyncSession, requester: User, target_id: uuid.UUID
) -> Match:
    score = 0.0
    summary = ""
    target = await get_user_by_id(db, target_id)
    if target:
        score = _score_compatibility(requester, target)
        summary = _generate_ai_summary(requester, target, score)

    match = Match(
        requester_id=requester.id,
        target_id=target_id,
        compatibility_score=score,
        ai_summary=summary,
    )
    db.add(match)
    await db.commit()
    await db.refresh(match)

    result = await db.execute(
        select(Match)
        .options(selectinload(Match.requester), selectinload(Match.target))
        .where(Match.id == match.id)
    )
    return result.scalar_one()


async def get_matches_for_user(db: AsyncSession, user_id: uuid.UUID) -> List[Match]:
    stmt = (
        select(Match)
        .options(selectinload(Match.requester), selectinload(Match.target))
        .where(or_(Match.requester_id == user_id, Match.target_id == user_id))
        .order_by(Match.created_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def update_match_status(
    db: AsyncSession, match: Match, status: MatchStatus, current_user: User
) -> Match:
    match.status = status
    # Auto-create conversation when match is accepted
    if status == MatchStatus.accepted:
        existing = await db.execute(
            select(Conversation).where(Conversation.match_id == match.id)
        )
        if not existing.scalar_one_or_none():
            conversation = Conversation(match_id=match.id)
            db.add(conversation)
    await db.commit()
    await db.refresh(match)

    result = await db.execute(
        select(Match)
        .options(selectinload(Match.requester), selectinload(Match.target))
        .where(Match.id == match.id)
    )
    return result.scalar_one()


async def get_match_by_id(db: AsyncSession, match_id: uuid.UUID) -> Optional[Match]:
    result = await db.execute(
        select(Match)
        .options(selectinload(Match.requester), selectinload(Match.target))
        .where(Match.id == match_id)
    )
    return result.scalar_one_or_none()


# ── Conversation / Message CRUD ───────────────────────────────────────────────

async def get_conversation(db: AsyncSession, conversation_id: uuid.UUID) -> Optional[Conversation]:
    result = await db.execute(
        select(Conversation)
        .options(
            selectinload(Conversation.messages).selectinload(Message.sender)
        )
        .where(Conversation.id == conversation_id)
    )
    return result.scalar_one_or_none()


async def get_conversations_for_user(db: AsyncSession, user_id: uuid.UUID) -> List[Conversation]:
    stmt = (
        select(Conversation)
        .join(Match, Conversation.match_id == Match.id)
        .options(
            selectinload(Conversation.messages).selectinload(Message.sender),
            selectinload(Conversation.match).selectinload(Match.requester),
            selectinload(Conversation.match).selectinload(Match.target),
        )
        .where(or_(Match.requester_id == user_id, Match.target_id == user_id))
        .order_by(Conversation.created_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_message(
    db: AsyncSession, conversation_id: uuid.UUID, sender_id: uuid.UUID, content: str
) -> Message:
    message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        content=content,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)

    result = await db.execute(
        select(Message)
        .options(selectinload(Message.sender))
        .where(Message.id == message.id)
    )
    return result.scalar_one()
