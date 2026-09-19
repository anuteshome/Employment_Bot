# Comprehensive Data Models Documentation (Employee & Employer)

## Overview
This document specifies the technical design and database schema changes required for both **Employee** and **Employer** profiles in the `tele-bot` platform. The goal is to ensure that **100% of frontend fields** collected in both registration wizards (`EmployeeWizard.tsx` and `EmployerWizard.tsx`) are explicitly stored as dedicated columns in PostgreSQL and returned via the REST API.

---

## 1. Employee Profile Schema Mapping

### Field Mapping: Frontend to Database
| Step | Frontend Form Field | Input Type | Database Column (`employee_profiles`) | Data Type | Notes |
|---|---|---|---|---|---|
| **Step 1** | Full Name | Text | `first_name`, `last_name` | `VARCHAR(100)` | Split from `fullName` string |
| **Step 1** | Email Address | Email | `email` | `VARCHAR(255)` | Dedicated email field |
| **Step 1** | Phone Number | Tel | `phone` | `VARCHAR(50)` | Candidate contact phone |
| **Step 1** | Location | Text | `location` | `VARCHAR(100)` | City/Country |
| **Step 1** | Profile Photo | Upload | `avatar_url` | `VARCHAR(500)` | Image storage link |
| **Step 1** | Emergency Contact Name | Text | `emergency_contact_name` | `VARCHAR(100)` | Emergency contact name |
| **Step 1** | Emergency Contact Phone | Tel | `emergency_contact_phone` | `VARCHAR(50)` | Emergency contact phone |
| **Step 2** | Current Job Title | Text | `current_job_title` | `VARCHAR(255)` | Primary job role |
| **Step 2** | Years of Experience | Select | `years_experience` | `VARCHAR(50)` | Selection (e.g., `5–7 years`) |
| **Step 2** | Skills Array | Tag List | `skills` (Junction Table) | `employee_skills` | Linked to `skills` directory table |
| **Step 2** | Portfolio Link | URL | `portfolio_url` | `VARCHAR(500)` | Personal site/GitHub URL |
| **Step 3** | Upload CV File | Upload | `cv_file_url` | `VARCHAR(500)` | Resume document URL |
| **Step 4** | Bio / Summary | Text | `bio` | `TEXT` | Summary text |
| **System** | Availability Status | Enum/Text | `availability_status` | `VARCHAR(50)` | Default: `AVAILABLE` |
| **System** | Profile Completeness | Integer | `profile_completion` | `INTEGER` | Computed score (0-100%) |

---

## 2. Employer Profile Schema Mapping

### Field Mapping: Frontend to Database
| Step | Frontend Form Field | Input Type | Proposed Database Column (`employer_profiles`) | Data Type | Notes |
|---|---|---|---|---|---|
| **Step 1** | Company Legal Name | Text | `business_name` | `VARCHAR(255)` | Legal business title |
| **Step 1** | Registration Number | Text | `registration_number` | `VARCHAR(100)` | **NEW** Official reg number (e.g. `REG-0001234`) |
| **Step 1** | Official Domain Email | Email | `official_email` | `VARCHAR(255)` | **NEW** Company domain email |
| **Step 1** | Website URL | URL | `website_url` | `VARCHAR(500)` | **NEW** Company website link |
| **Step 2** | Business Tax ID / TIN | Text | `tax_id` | `VARCHAR(100)` | **NEW** TIN certificate number |
| **Step 2** | Issuing City / Region | Text | `location` | `VARCHAR(100)` | Primary location |
| **Step 2** | Registration Date | Text | `registration_date` | `VARCHAR(100)` | **NEW** Date of registration |
| **System** | Company Type | Select | `business_type` | `VARCHAR(100)` | Default: `PLC` |
| **System** | Phone Number | Tel | `phone` | `VARCHAR(50)` | Contact phone |
| **System** | Verification Status | Enum | `verification_status` | `VARCHAR(50)` | `PENDING`, `UNDER_REVIEW`, `VERIFIED` |

---

## 3. Updated SQLAlchemy Models

### `EmployerProfile` (`backend/modules/employers/models.py`)
```python
class EmployerProfile(Base, UUIDMixin, TimestampMixin):
    """Employer profile entity storing business details and verification status."""
    __tablename__ = "employer_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    business_name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_type: Mapped[str] = mapped_column(String(100), nullable=False, default="PLC")
    registration_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    official_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    registration_date: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    verification_status: Mapped[str] = mapped_column(
        String(50), default="PENDING", nullable=False
    )
```

---

## 4. Migration & API Update Plan

1. **Alembic Migration**: Generate a new revision `add_extended_fields_to_employer_profiles` adding columns: `registration_number`, `official_email`, `website_url`, `tax_id`, `registration_date`.
2. **Backend Pydantic & Service Update**: Update `EmployerProfileCreate` and `EmployerProfileResponse` schemas, and update `create_or_update_employer_profile()` service function to populate all new fields.
3. **Frontend Integration**: Update `EmployerWizard.tsx` payload to pass all `formData` fields directly to `saveEmployerProfile()`.
