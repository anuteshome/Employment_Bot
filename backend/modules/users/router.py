from fastapi import APIRouter, Depends, status

from modules.auth.dependencies import get_current_user
from modules.auth.schemas import UserAuthResponse
from modules.users.models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserAuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Authenticated User Profile Summary",
    description="Retrieves current logged-in user details, assigned system role, account status, and profile presence flags.",
)
async def get_me(current_user: User = Depends(get_current_user)):
    """Returns currently authenticated user information."""
    return UserAuthResponse(
        id=current_user.id,
        telegram_user_id=current_user.telegram_user_id,
        username=current_user.username,
        phone=current_user.phone,
        role=current_user.role,
        status=current_user.status,
        has_employee_profile=current_user.employee_profile is not None,
        has_employer_profile=current_user.employer_profile is not None,
        created_at=current_user.created_at,
    )
