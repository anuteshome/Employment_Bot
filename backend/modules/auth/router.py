from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.connection import get_db
from shared.config import settings
from modules.auth.schemas import TelegramAuthRequest, TokenResponse, UserAuthResponse
from modules.auth.service import (
    validate_telegram_init_data,
    authenticate_or_create_telegram_user,
    create_access_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/telegram",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate Telegram Mini App User",
    description="Validates cryptographic HMAC-SHA256 signature of Telegram initData, upserts user in PostgreSQL, and issues JWT access token.",
)
async def authenticate_telegram(
    request: TelegramAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    """Authenticates Telegram Mini App user using initData string."""
    # Validate Telegram cryptographic signature
    user_data = validate_telegram_init_data(request.init_data, settings.BOT_TOKEN)

    # Upsert user in database
    user = await authenticate_or_create_telegram_user(db, user_data)

    # Generate JWT session token
    token_payload = {
        "sub": str(user.id),
        "telegram_user_id": user.telegram_user_id,
        "role": user.role,
    }
    access_token = create_access_token(token_payload)

    user_summary = UserAuthResponse(
        id=user.id,
        telegram_user_id=user.telegram_user_id,
        username=user.username,
        phone=user.phone,
        role=user.role,
        status=user.status,
        has_employee_profile=user.employee_profile is not None,
        has_employer_profile=user.employer_profile is not None,
        created_at=user.created_at,
    )

    return TokenResponse(access_token=access_token, user=user_summary)
