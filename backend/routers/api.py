import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    UserOut, UserUpdate, MatchOut, MatchCreate, MatchStatusUpdate,
    MessageCreate, MessageOut, ConversationOut, MatchStatus, Match, Conversation
)
from routers.auth import get_current_user
from models import User
from services import core

router = APIRouter(prefix="/api", tags=["api"])


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[UserOut])
async def list_users(
    industry: Optional[str] = Query(None),
    startup_stage: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.list_users(db, current_user.id, industry, startup_stage, skill, limit, offset)


@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user = await core.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/users/me", response_model=UserOut)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.update_user(db, current_user, payload.model_dump(exclude_none=True))


# ── AI Suggestions ────────────────────────────────────────────────────────────

@router.get("/suggestions", response_model=List[dict])
async def get_suggestions(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    suggestions = await core.get_ai_suggestions(db, current_user, limit)
    return [
        {
            "user": UserOut.model_validate(s["user"]).model_dump(),
            "compatibility_score": s["score"],
            "ai_summary": s["summary"],
        }
        for s in suggestions
    ]


# ── Matches ───────────────────────────────────────────────────────────────────

@router.get("/matches", response_model=List[MatchOut])
async def list_matches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.get_matches_for_user(db, current_user.id)


@router.post("/matches", response_model=MatchOut, status_code=status.HTTP_201_CREATED)
async def create_match(
    payload: MatchCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if payload.target_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot match with yourself")
    target = await core.get_user_by_id(db, payload.target_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")
    return await core.create_match(db, current_user, payload.target_id)


@router.get("/matches/{match_id}", response_model=MatchOut)
async def get_match(
    match_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    match = await core.get_match_by_id(db, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if match.requester_id != current_user.id and match.target_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return match


@router.patch("/matches/{match_id}", response_model=MatchOut)
async def update_match(
    match_id: uuid.UUID,
    payload: MatchStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    match = await core.get_match_by_id(db, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    # Only the target can accept/reject
    if match.target_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the target user can respond to a match")
    return await core.update_match_status(db, match, payload.status, current_user)


# ── Conversations ─────────────────────────────────────────────────────────────

@router.get("/conversations", response_model=List[ConversationOut])
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.get_conversations_for_user(db, current_user.id)


@router.get("/conversations/{conversation_id}", response_model=ConversationOut)
async def get_conversation(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conversation = await core.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    match = conversation.match
    if match.requester_id != current_user.id and match.target_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return conversation


@router.post("/conversations/{conversation_id}/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: uuid.UUID,
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conversation = await core.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    match = conversation.match
    if match.requester_id != current_user.id and match.target_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if match.status != MatchStatus.accepted:
        raise HTTPException(status_code=400, detail="Match must be accepted before messaging")
    return await core.create_message(db, conversation_id, current_user.id, payload.content)
