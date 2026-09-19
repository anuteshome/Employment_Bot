import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EmployerProfileCreate(BaseModel):
    """Request model for creating or updating employer business profile."""
    business_name: str = Field(..., description="Business or company name", example="Acme Corporation PLC")
    business_type: str = Field("PLC", description="Company type (PLC, Share Company, etc.)", example="PLC")
    registration_number: Optional[str] = Field(None, description="Registration number", example="REG-0001234")
    official_email: Optional[str] = Field(None, description="Official domain email", example="hello@acme.com")
    website_url: Optional[str] = Field(None, description="Website URL", example="https://acme.com")
    tax_id: Optional[str] = Field(None, description="Business Tax ID / TIN", example="12-3456789")
    registration_date: Optional[str] = Field(None, description="Registration date", example="01 / 15 / 2023")
    description: Optional[str] = Field(None, description="Business description / mission", example="Leading tech company...")
    phone: Optional[str] = Field(None, description="Contact phone number", example="+251911000000")
    location: Optional[str] = Field(None, description="City/Location", example="Addis Ababa, Ethiopia")


class EmployerProfileResponse(BaseModel):
    """Response model for employer business profile."""
    id: uuid.UUID
    user_id: uuid.UUID
    business_name: str
    business_type: str
    registration_number: Optional[str] = None
    official_email: Optional[str] = None
    website_url: Optional[str] = None
    tax_id: Optional[str] = None
    registration_date: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    verification_status: str = Field(..., description="Status (PENDING, UNDER_REVIEW, VERIFIED, REJECTED)")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
