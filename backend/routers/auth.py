import os
import uuid
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    UserCreate, UserOut, Token, LoginRequest, OAuthProvider
)
from services.core import (
    create_user, get_user_by_email, get_user_by_id,
    verify_password, create_access_token, decode_token
)
from models import User

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = await get_user_by_id(db, uuid.UUID(user_id))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = await create_user(db, payload.email, payload.full_name, payload.password)
    return Token(access_token=create_access_token(user.id))


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, payload.email)
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return Token(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


# ── GitHub OAuth ──────────────────────────────────────────────────────────────

@router.get("/github")
async def github_oauth_redirect():
    client_id = os.getenv("GITHUB_CLIENT_ID", "")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/auth/github/callback")
    return {
        "url": f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=user:email"
    }


@router.get("/github/callback", response_model=Token)
async def github_callback(code: str, db: AsyncSession = Depends(get_db)):
    client_id = os.getenv("GITHUB_CLIENT_ID", "")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET", "")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            json={"client_id": client_id, "client_secret": client_secret, "code": code},
            headers={"Accept": "application/json"},
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="GitHub OAuth failed")

        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        gh_user = user_resp.json()

        emails_resp = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        emails = emails_resp.json()
        primary_email = next(
            (e["email"] for e in emails if e.get("primary") and e.get("verified")),
            gh_user.get("email"),
        )
        if not primary_email:
            raise HTTPException(status_code=400, detail="No verified email from GitHub")

    user = await get_user_by_email(db, primary_email)
    if not user:
        from sqlalchemy import select
        from models import User as UserModel
        result = await db.execute(
            select(UserModel).where(
                UserModel.oauth_provider == OAuthProvider.github,
                UserModel.oauth_id == str(gh_user["id"]),
            )
        )
        user = result.scalar_one_or_none()

    if not user:
        user = User(
            email=primary_email,
            full_name=gh_user.get("name") or gh_user.get("login", ""),
            avatar_url=gh_user.get("avatar_url"),
            oauth_provider=OAuthProvider.github,
            oauth_id=str(gh_user["id"]),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return Token(access_token=create_access_token(user.id))


# ── Google OAuth ──────────────────────────────────────────────────────────────

@router.get("/google")
async def google_oauth_redirect():
    client_id = os.getenv("GOOGLE_CLIENT_ID", "")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")
    scope = "openid email profile"
    return {
        "url": (
            f"https://accounts.google.com/o/oauth2/v2/auth"
            f"?client_id={client_id}&redirect_uri={redirect_uri}"
            f"&response_type=code&scope={scope}"
        )
    }


@router.get("/google/callback", response_model=Token)
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID", "")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Google OAuth failed")

        userinfo_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        goog_user = userinfo_resp.json()

    email = goog_user.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email from Google")

    user = await get_user_by_email(db, email)
    if not user:
        from sqlalchemy import select
        from models import User as UserModel
        result = await db.execute(
            select(UserModel).where(
                UserModel.oauth_provider == OAuthProvider.google,
                UserModel.oauth_id == str(goog_user["id"]),
            )
        )
        user = result.scalar_one_or_none()

    if not user:
        user = User(
            email=email,
            full_name=goog_user.get("name", ""),
            avatar_url=goog_user.get("picture"),
            oauth_provider=OAuthProvider.google,
            oauth_id=str(goog_user["id"]),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return Token(access_token=create_access_token(user.id))
