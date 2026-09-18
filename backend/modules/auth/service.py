import hashlib
import hmac
import json
import time
import urllib.parse
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, status
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from shared.config import settings
from modules.users.models import User


def validate_telegram_init_data(init_data: str, bot_token: str) -> Dict[str, Any]:
    """
    Validates Telegram Mini App initData query string cryptographically using HMAC-SHA256.

    :param init_data: Raw initData query string from window.Telegram.WebApp.initData
    :param bot_token: Telegram Bot Token secret
    :return: Parsed user JSON dictionary from initData
    :raises HTTPException: If signature is invalid, missing hash, or auth_date is expired (>24h)
    """
    if not init_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Initialization data (init_data) is required.",
        )

    try:
        parsed_data = dict(urllib.parse.parse_qsl(init_data, keep_blank_values=True))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse init_data: {str(e)}",
        )

    received_hash = parsed_data.pop("hash", None)
    if not received_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid init_data: missing hash signature.",
        )

    # Sort remaining key-value pairs lexicographically
    data_check_arr = [f"{k}={v}" for k, v in sorted(parsed_data.items())]
    data_check_string = "\n".join(data_check_arr)

    # Compute secret key: HMAC-SHA256("WebAppData", bot_token)
    secret_key = hmac.new(
        b"WebAppData", bot_token.encode("utf-8"), hashlib.sha256
    ).digest()

    # Compute hash over data_check_string
    calculated_hash = hmac.new(
        secret_key, data_check_string.encode("utf-8"), hashlib.sha256
    ).hexdigest()

    # Verify signature using constant-time comparison
    if not hmac.compare_digest(calculated_hash.lower(), received_hash.lower()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telegram init_data signature verification failed.",
        )

    # Check auth_date timestamp freshness (max 24 hours / 86400 seconds)
    auth_date_str = parsed_data.get("auth_date")
    if not auth_date_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid init_data: missing auth_date timestamp.",
        )

    try:
        auth_date = int(auth_date_str)
        current_time = int(time.time())
        if current_time - auth_date > 86400:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Telegram authentication data has expired (older than 24 hours).",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid auth_date format.",
        )

    # Extract user JSON object
    user_json_str = parsed_data.get("user")
    if not user_json_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid init_data: missing user parameter.",
        )

    try:
        user_data = json.loads(user_json_str)
        return user_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse user JSON payload: {str(e)}",
        )


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates a signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": now})

    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decodes and validates JWT access token."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def authenticate_or_create_telegram_user(
    db: AsyncSession, telegram_user_data: dict
) -> User:
    """
    Finds an existing User by telegram_user_id or registers a new User in PostgreSQL.
    """
    telegram_id = telegram_user_data.get("id")
    if not telegram_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User data does not contain a valid Telegram ID.",
        )

    username = telegram_user_data.get("username")

    # Query existing user with preloaded profiles
    stmt = (
        select(User)
        .options(
            selectinload(User.employee_profile),
            selectinload(User.employer_profile),
        )
        .where(User.telegram_user_id == telegram_id)
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user:
        # Update username if changed
        if username and user.username != username:
            user.username = username
            await db.commit()
            await db.refresh(user)
    else:
        # Create new user
        user = User(
            telegram_user_id=telegram_id,
            username=username,
            role="EMPLOYEE",
            status="ACTIVE",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Re-fetch with relationship options
        stmt = (
            select(User)
            .options(
                selectinload(User.employee_profile),
                selectinload(User.employer_profile),
            )
            .where(User.id == user.id)
        )
        result = await db.execute(stmt)
        user = result.scalar_one()

    return user
