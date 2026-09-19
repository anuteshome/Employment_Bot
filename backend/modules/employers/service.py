import uuid
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from modules.employers.models import EmployerProfile
from modules.employers.schemas import EmployerProfileCreate, EmployerProfileResponse
from modules.users.models import User


async def get_employer_profile_by_user_id(
    db: AsyncSession, user_id: uuid.UUID
) -> Optional[EmployerProfile]:
    """Fetches EmployerProfile by user_id."""
    stmt = select(EmployerProfile).where(EmployerProfile.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_or_update_employer_profile(
    db: AsyncSession, user: User, payload: EmployerProfileCreate
) -> EmployerProfileResponse:
    """Creates or updates employer profile and sets user role to EMPLOYER."""
    profile = await get_employer_profile_by_user_id(db, user.id)

    if not profile:
        profile = EmployerProfile(
            user_id=user.id,
            business_name=payload.business_name,
            business_type=payload.business_type,
            registration_number=payload.registration_number,
            official_email=payload.official_email,
            website_url=payload.website_url,
            tax_id=payload.tax_id,
            registration_date=payload.registration_date,
            description=payload.description,
            phone=payload.phone,
            location=payload.location,
            verification_status="PENDING",
        )
        db.add(profile)
    else:
        profile.business_name = payload.business_name
        profile.business_type = payload.business_type
        profile.registration_number = payload.registration_number
        profile.official_email = payload.official_email
        profile.website_url = payload.website_url
        profile.tax_id = payload.tax_id
        profile.registration_date = payload.registration_date
        profile.description = payload.description
        profile.phone = payload.phone
        profile.location = payload.location

    # Ensure user role is set to EMPLOYER
    if user.role != "EMPLOYER":
        user.role = "EMPLOYER"

    await db.commit()
    await db.refresh(profile)

    return EmployerProfileResponse.model_validate(profile)
