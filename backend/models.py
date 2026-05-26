import uuid
import enum
from datetime import datetime
from typing import Optional, List

from sqlalchemy import (
    String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum,
    Float, JSON, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel, EmailStr, field_validator

from database import Base


# ── SQLAlchemy ORM ────────────────────────────────────────────────────────────

class MatchStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class OAuthProvider(str, enum.Enum):
    github = "github"
    google = "google"
    local = "local"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    oauth_provider: Mapped[str] = mapped_column(SAEnum(OAuthProvider), default=OAuthProvider.local)
    oauth_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Profile fields
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    skills: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    interests: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    looking_for: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    startup_stage: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    sent_matches: Mapped[List["Match"]] = relationship("Match", foreign_keys="Match.requester_id", back_populates="requester")
    received_matches: Mapped[List["Match"]] = relationship("Match", foreign_keys="Match.target_id", back_populates="target")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="sender")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requester_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(SAEnum(MatchStatus), default=MatchStatus.pending)
    compatibility_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    requester: Mapped["User"] = relationship("User", foreign_keys=[requester_id], back_populates="sent_matches")
    target: Mapped["User"] = relationship("User", foreign_keys=[target_id], back_populates="received_matches")
    conversation: Mapped[Optional["Conversation"]] = relationship("Conversation", back_populates="match", uselist=False)


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("matches.id"), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    match: Mapped["Match"] = relationship("Match", back_populates="conversation")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="conversation", order_by="Message.created_at")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    sender_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
    sender: Mapped["User"] = relationship("User", back_populates="messages")


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    looking_for: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    startup_stage: Optional[str] = None
    industry: Optional[str] = None


class UserOut(UserBase):
    id: uuid.UUID
    avatar_url: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    skills: Optional[List[str]]
    interests: Optional[List[str]]
    looking_for: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    startup_stage: Optional[str]
    industry: Optional[str]
    oauth_provider: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class MatchOut(BaseModel):
    id: uuid.UUID
    requester_id: uuid.UUID
    target_id: uuid.UUID
    status: str
    compatibility_score: Optional[float]
    ai_summary: Optional[str]
    created_at: datetime
    requester: UserOut
    target: UserOut

    model_config = {"from_attributes": True}


class MatchCreate(BaseModel):
    target_id: uuid.UUID


class MatchStatusUpdate(BaseModel):
    status: MatchStatus


class MessageOut(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    created_at: datetime
    sender: UserOut

    model_config = {"from_attributes": True}


class MessageCreate(BaseModel):
    content: str


class ConversationOut(BaseModel):
    id: uuid.UUID
    match_id: uuid.UUID
    created_at: datetime
    messages: List[MessageOut] = []

    model_config = {"from_attributes": True}
