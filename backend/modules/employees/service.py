import uuid
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from modules.employees.models import (
    EmployeeProfile,
    Skill,
    EmployeeSkill,
    EmployeeExperience,
    EmployeeEducation,
)
from modules.employees.schemas import (
    EmployeeProfileCreate,
    EmployeeProfileResponse,
    SkillResponse,
    ExperienceResponse,
    EducationResponse,
)
from modules.users.models import User


def calculate_profile_completion(payload: EmployeeProfileCreate) -> int:
    """Calculates weighted profile completeness score (0% to 100%)."""
    score = 0

    # Personal info completeness (30%)
    if payload.first_name and payload.last_name and payload.location and payload.bio:
        score += 30
    elif payload.first_name and payload.last_name:
        score += 15

    # Skills tagging (30%)
    if payload.skills and len(payload.skills) > 0:
        score += 30

    # Work experience (20%)
    if payload.experiences and len(payload.experiences) > 0:
        score += 20

    # Educational background (20%)
    if payload.educations and len(payload.educations) > 0:
        score += 20

    return min(100, score)


async def get_employee_profile_by_user_id(
    db: AsyncSession, user_id: uuid.UUID
) -> Optional[EmployeeProfile]:
    """Fetches EmployeeProfile by user_id with preloaded relationships."""
    stmt = (
        select(EmployeeProfile)
        .options(
            selectinload(EmployeeProfile.employee_skills).selectinload(EmployeeSkill.skill),
            selectinload(EmployeeProfile.experiences),
            selectinload(EmployeeProfile.educations),
        )
        .where(EmployeeProfile.user_id == user_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_or_update_employee_profile(
    db: AsyncSession, user: User, payload: EmployeeProfileCreate
) -> EmployeeProfileResponse:
    """Creates or updates employee profile, skills, work history, and education."""
    completion_score = calculate_profile_completion(payload)

    # Check for existing profile
    profile = await get_employee_profile_by_user_id(db, user.id)

    if not profile:
        profile = EmployeeProfile(
            user_id=user.id,
            first_name=payload.first_name,
            last_name=payload.last_name,
            bio=payload.bio,
            location=payload.location,
            availability_status=payload.availability_status,
            profile_completion=completion_score,
        )
        db.add(profile)
        await db.flush()  # Ensures profile.id is generated
    else:
        profile.first_name = payload.first_name
        profile.last_name = payload.last_name
        profile.bio = payload.bio
        profile.location = payload.location
        profile.availability_status = payload.availability_status
        profile.profile_completion = completion_score

    # Synchronize Skills
    await db.execute(
        delete(EmployeeSkill).where(EmployeeSkill.employee_id == profile.id)
    )

    skill_responses: list[SkillResponse] = []
    for skill_input in payload.skills:
        # Check or create Skill entity in directory
        stmt = select(Skill).where(Skill.name.ilike(skill_input.name))
        result = await db.execute(stmt)
        skill_entity = result.scalar_one_or_none()

        if not skill_entity:
            skill_entity = Skill(
                name=skill_input.name,
                category=skill_input.category,
            )
            db.add(skill_entity)
            await db.flush()

        emp_skill = EmployeeSkill(
            employee_id=profile.id,
            skill_id=skill_entity.id,
            years_experience=skill_input.years_experience,
        )
        db.add(emp_skill)

        skill_responses.append(
            SkillResponse(
                id=skill_entity.id,
                name=skill_entity.name,
                category=skill_entity.category,
                years_experience=skill_input.years_experience,
            )
        )

    # Synchronize Experiences
    await db.execute(
        delete(EmployeeExperience).where(EmployeeExperience.employee_id == profile.id)
    )
    exp_responses: list[ExperienceResponse] = []
    for exp_input in payload.experiences:
        exp_entity = EmployeeExperience(
            employee_id=profile.id,
            company_name=exp_input.company_name,
            position=exp_input.position,
            description=exp_input.description,
            start_date=exp_input.start_date,
            end_date=exp_input.end_date,
        )
        db.add(exp_entity)
        await db.flush()
        exp_responses.append(ExperienceResponse.model_validate(exp_entity))

    # Synchronize Educations
    await db.execute(
        delete(EmployeeEducation).where(EmployeeEducation.employee_id == profile.id)
    )
    edu_responses: list[EducationResponse] = []
    for edu_input in payload.educations:
        edu_entity = EmployeeEducation(
            employee_id=profile.id,
            institution=edu_input.institution,
            qualification=edu_input.qualification,
            field=edu_input.field,
            start_date=edu_input.start_date,
            end_date=edu_input.end_date,
        )
        db.add(edu_entity)
        await db.flush()
        edu_responses.append(EducationResponse.model_validate(edu_entity))

    await db.commit()

    # Re-fetch profile to ensure all relationships are loaded
    updated_profile = await get_employee_profile_by_user_id(db, user.id)
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve updated profile.",
        )

    return build_employee_profile_response(updated_profile)


def build_employee_profile_response(profile: EmployeeProfile) -> EmployeeProfileResponse:
    """Constructs EmployeeProfileResponse from model instance."""
    skills_list = [
        SkillResponse(
            id=es.skill.id,
            name=es.skill.name,
            category=es.skill.category,
            years_experience=es.years_experience,
        )
        for es in profile.employee_skills
        if es.skill
    ]

    exp_list = [ExperienceResponse.model_validate(exp) for exp in profile.experiences]
    edu_list = [EducationResponse.model_validate(edu) for edu in profile.educations]

    return EmployeeProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        first_name=profile.first_name,
        last_name=profile.last_name,
        bio=profile.bio,
        location=profile.location,
        availability_status=profile.availability_status,
        profile_completion=profile.profile_completion,
        skills=skills_list,
        experiences=exp_list,
        educations=edu_list,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )
