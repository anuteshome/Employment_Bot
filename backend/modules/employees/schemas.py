import uuid
from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class SkillInput(BaseModel):
    """Input model for skills attached to employee profile."""
    name: str = Field(..., description="Skill name", example="Python")
    category: Optional[str] = Field(None, description="Skill category", example="Software Engineering")
    years_experience: int = Field(0, description="Years of experience", example=4)


class SkillResponse(BaseModel):
    """Response model for employee skill."""
    id: uuid.UUID = Field(..., description="Skill UUID")
    name: str = Field(..., description="Skill name")
    category: Optional[str] = Field(None, description="Skill category")
    years_experience: int = Field(0, description="Years of experience")

    class Config:
        from_attributes = True


class ExperienceInput(BaseModel):
    """Input model for candidate work history."""
    company_name: str = Field(..., description="Company name", example="Tech Corp Ethiopia")
    position: str = Field(..., description="Job position", example="Backend Developer")
    description: Optional[str] = Field(None, description="Work summary", example="Built scalable APIs")
    start_date: Optional[date] = Field(None, description="Start date")
    end_date: Optional[date] = Field(None, description="End date")


class ExperienceResponse(BaseModel):
    """Response model for work history."""
    id: uuid.UUID
    company_name: str
    position: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    class Config:
        from_attributes = True


class EducationInput(BaseModel):
    """Input model for candidate educational background."""
    institution: str = Field(..., description="School/University name", example="Addis Ababa University")
    qualification: str = Field(..., description="Degree/Certificate", example="BSc")
    field: Optional[str] = Field(None, description="Field of study", example="Computer Science")
    start_date: Optional[date] = Field(None, description="Start date")
    end_date: Optional[date] = Field(None, description="End date")


class EducationResponse(BaseModel):
    """Response model for educational background."""
    id: uuid.UUID
    institution: str
    qualification: str
    field: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    class Config:
        from_attributes = True


class EmployeeProfileCreate(BaseModel):
    """Request model for creating or updating candidate employee profile."""
    first_name: str = Field(..., description="First name", example="Abebe")
    last_name: str = Field(..., description="Last name", example="Bikila")
    bio: Optional[str] = Field(None, description="Personal bio summary", example="Experienced developer...")
    location: Optional[str] = Field(None, description="City/Location", example="Addis Ababa, Ethiopia")
    availability_status: str = Field("AVAILABLE", description="Availability status", example="AVAILABLE")
    skills: List[SkillInput] = Field(default_factory=list, description="Candidate skills list")
    experiences: List[ExperienceInput] = Field(default_factory=list, description="Work history list")
    educations: List[EducationInput] = Field(default_factory=list, description="Educational background list")


class EmployeeProfileResponse(BaseModel):
    """Response model for candidate employee profile."""
    id: uuid.UUID
    user_id: uuid.UUID
    first_name: str
    last_name: str
    bio: Optional[str] = None
    location: Optional[str] = None
    availability_status: str
    profile_completion: int
    skills: List[SkillResponse] = Field(default_factory=list)
    experiences: List[ExperienceResponse] = Field(default_factory=list)
    educations: List[EducationResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
