import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EmployerProfileCreate(BaseModel):
    """Request model for creating or updating employer business profile."""
    business_name: str = Field(..., description="Business or company name", example="Acme Corporation PLC")
    business_type: str = Field(..., description="Company type (PLC, Share Company, etc.)", example="PLC")
    description: Optional[str] = Field(None, description="Business description / mission", example="Leading tech company...")
    phone: Optional[str] = Field(None, description="Contact phone number", example="+251911000000")
    location: Optional[str] = Field(None, description="City/Location", example="Addis Ababa, Ethiopia")


class EmployerProfileResponse(BaseModel):
    """Response model for employer business profile."""
    id: uuid.UUID
    user_id: uuid.UUID
    business_name: str
    business_type: str
    description: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    verification_status: str = Field(..., description="Status (PENDING, UNDER_REVIEW, VERIFIED, REJECTED)")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
