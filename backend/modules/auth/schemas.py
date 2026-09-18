import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TelegramAuthRequest(BaseModel):
    """Request model for Telegram Mini App initData authentication."""
    init_data: str = Field(
        ...,
        description="Raw initData query string provided by Telegram WebApp SDK",
        example="query_id=AAHd...&user=%7B%22id%22%3A987654321%2C...%7D&auth_date=1726650000&hash=d8248c...",
    )


class UserAuthResponse(BaseModel):
    """User summary included in authentication response."""
    id: uuid.UUID = Field(..., description="Internal system User UUID")
    telegram_user_id: int = Field(..., description="Telegram platform user ID")
    username: Optional[str] = Field(None, description="Telegram username")
    phone: Optional[str] = Field(None, description="User phone number")
    role: str = Field(..., description="Assigned system role (EMPLOYEE, EMPLOYER, ADMIN)")
    status: str = Field(..., description="Account status")
    has_employee_profile: bool = Field(False, description="Flag indicating if candidate employee profile exists")
    has_employer_profile: bool = Field(False, description="Flag indicating if employer business profile exists")
    created_at: datetime = Field(..., description="Account creation timestamp")

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Authentication response payload containing JWT access token and user metadata."""
    access_token: str = Field(..., description="JWT Bearer access token")
    token_type: str = Field("bearer", description="Token authorization type")
    user: UserAuthResponse = Field(..., description="Authenticated user metadata")
