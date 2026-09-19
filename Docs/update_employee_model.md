# Update Employee Model Documentation

## Overview
This document specifies the technical design and database schema changes required to update the **Employee Profile** model in the `tele-bot` platform. The goal is to ensure that **100% of frontend fields** collected in the 4-step candidate registration wizard (`EmployeeWizard.tsx`) are explicitly stored as dedicated columns in PostgreSQL and returned via the REST API.

---

## 1. Field Mapping: Frontend to Database

The table below details every frontend form field, its current status, and the proposed database column in the `employee_profiles` table.

| Step | Frontend Form Field | Input Type | Proposed Database Column (`employee_profiles`) | Data Type | Notes |
|---|---|---|---|---|---|
| **Step 1** | Full Name | Text | `first_name`, `last_name` | `VARCHAR(100)` | Split from `fullName` string |
| **Step 1** | Email Address | Email | `email` | `VARCHAR(255)` | **NEW** Dedicated email field |
| **Step 1** | Phone Number | Tel | `phone` | `VARCHAR(50)` | **NEW** Candidate contact phone |
| **Step 1** | Location | Text | `location` | `VARCHAR(100)` | City/Country |
| **Step 1** | Profile Photo | Upload | `avatar_url` | `VARCHAR(500)` | **NEW** Image storage link |
| **Step 1** | Emergency Contact Name | Text | `emergency_contact_name` | `VARCHAR(100)` | **NEW** Emergency contact name |
| **Step 1** | Emergency Contact Phone | Tel | `emergency_contact_phone` | `VARCHAR(50)` | **NEW** Emergency contact phone |
| **Step 2** | Current Job Title | Text | `current_job_title` | `VARCHAR(255)` | **NEW** Primary job role |
| **Step 2** | Years of Experience | Select | `years_experience` | `VARCHAR(50)` | **NEW** Selection (e.g., `5–7 years`) |
| **Step 2** | Skills Array | Tag List | `skills` (Junction Table) | `employee_skills` | Linked to `skills` directory table |
| **Step 2** | Portfolio Link | URL | `portfolio_url` | `VARCHAR(500)` | **NEW** Personal site/GitHub URL |
| **Step 3** | Upload CV File | Upload | `cv_file_url` | `VARCHAR(500)` | **NEW** Resume document URL |
| **Step 4** | Bio / Summary | Text | `bio` | `TEXT` | Summary text |
| **System** | Availability Status | Enum/Text | `availability_status` | `VARCHAR(50)` | Default: `AVAILABLE` |
| **System** | Profile Completeness | Integer | `profile_completion` | `INTEGER` | Computed score (0-100%) |

---

## 2. Updated SQLAlchemy Model (`backend/modules/employees/models.py`)

```python
class EmployeeProfile(Base, UUIDMixin, TimestampMixin):
    """Employee profile representing candidate details, availability, and skills."""
    __tablename__ = "employee_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    emergency_contact_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    emergency_contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    current_job_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    years_experience: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    portfolio_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    cv_file_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    availability_status: Mapped[str] = mapped_column(
        String(50), default="AVAILABLE", nullable=False
    )
    profile_completion: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
```

---

## 3. Pydantic Schemas (`backend/modules/employees/schemas.py`)

### Input DTO (`EmployeeProfileCreate`)
```python
class EmployeeProfileCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    current_job_title: Optional[str] = None
    years_experience: Optional[str] = None
    portfolio_url: Optional[str] = None
    cv_file_url: Optional[str] = None
    bio: Optional[str] = None
    availability_status: str = "AVAILABLE"
    skills: List[SkillInput] = Field(default_factory=list)
    experiences: List[ExperienceInput] = Field(default_factory=list)
    educations: List[EducationInput] = Field(default_factory=list)
```

---

## 4. Migration Plan

1. **Alembic Migration**: Generate a new revision `add_extended_fields_to_employee_profiles` adding columns: `email`, `phone`, `avatar_url`, `emergency_contact_name`, `emergency_contact_phone`, `current_job_title`, `years_experience`, `portfolio_url`, `cv_file_url`.
2. **Backend Service Update**: Update `create_or_update_employee_profile` service method to populate all new fields.
3. **Frontend Integration**: Update `EmployeeWizard.tsx` payload to pass all state variables directly to `saveEmployeeProfile()`.
