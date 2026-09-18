from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.connection import get_db
from modules.auth.dependencies import get_current_user
from modules.employees.schemas import EmployeeProfileCreate, EmployeeProfileResponse
from modules.employees.service import (
    create_or_update_employee_profile,
    get_employee_profile_by_user_id,
    build_employee_profile_response,
)
from modules.users.models import User

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post(
    "/profile",
    response_model=EmployeeProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Create or Update Candidate Employee Profile",
    description="Registers or updates candidate employee personal info, skills, work history, education, and calculates profile completeness score.",
)
async def upsert_employee_profile(
    payload: EmployeeProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Creates or updates current user's employee profile."""
    return await create_or_update_employee_profile(db, current_user, payload)


@router.get(
    "/me",
    response_model=EmployeeProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Logged-in Candidate Employee Profile",
    description="Retrieves current logged-in employee profile, attached skills, work experiences, and educational background.",
)
async def get_my_employee_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns current user's employee profile."""
    profile = await get_employee_profile_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_444_PROFILE_NOT_FOUND if hasattr(status, 'HTTP_444_PROFILE_NOT_FOUND') else status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found. Please complete profile registration first.",
        )
    return build_employee_profile_response(profile)
