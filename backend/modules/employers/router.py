from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.connection import get_db
from modules.auth.dependencies import get_current_user
from modules.employers.schemas import EmployerProfileCreate, EmployerProfileResponse
from modules.employers.service import (
    create_or_update_employer_profile,
    get_employer_profile_by_user_id,
)
from modules.users.models import User

router = APIRouter(prefix="/employers", tags=["Employers"])


@router.post(
    "/profile",
    response_model=EmployerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Register or Update Employer Business Profile",
    description="Registers or updates employer business details, company type, contact info, and sets user role to EMPLOYER.",
)
async def upsert_employer_profile(
    payload: EmployerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Creates or updates current user's employer profile."""
    return await create_or_update_employer_profile(db, current_user, payload)


@router.get(
    "/me",
    response_model=EmployerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Logged-in Employer Profile & Verification Status",
    description="Retrieves current logged-in employer business details and verification status (PENDING, UNDER_REVIEW, VERIFIED, REJECTED).",
)
async def get_my_employer_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns current user's employer profile."""
    profile = await get_employer_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found. Please complete employer registration first.",
        )
    return EmployerProfileResponse.model_validate(profile)
