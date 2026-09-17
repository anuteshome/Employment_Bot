# Sprint 1 Document — System Foundation, Authentication & Dual Registration

**Project:** Telegram Reverse Employment Marketplace (Ethiopia)  
**Sprint:** Sprint 1  
**Focus:** Infrastructure Setup, Telegram Authentication, Employee Onboarding & Employer Verification Onboarding  
**Status:** Draft / Discussion Phase  

---

## 1. Executive Summary & Sprint Goal

### 1.1 Concept Refinement
Unlike traditional job boards (like Aferiwork) where employers post jobs and wait for applicants, this platform operates on a **reverse-marketplace model**:
1. **Employer-Driven Discovery:** Employers search, filter, and discover employees based on verified skills, experience, location, and CVs.
2. **Transparency & Trust for Employees:** Employees can evaluate employers by viewing their verified business status, uploaded licenses/documents, hiring history, and ratings before engaging.
3. **Telegram Mini App + Bot First:** Low-friction user experience integrated natively into Telegram.

### 1.2 Sprint 1 Goal
Deliver a fully functional **User Onboarding and Registration Pipeline** for both Employees and Employers, backed by a solid modular monolith architecture, Telegram authentication, and secure document storage.

> **Note for Sprint 1:** No job creation or hiring logic is included in Sprint 1. The focus is 100% on registration, user identity, profile setup, document uploads, and foundational infrastructure.

---

## 2. Developer Role & Scope Breakdown

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                              SPRINT 1                                   │
├───────────────────────────┬─────────────────────────┬───────────────────┤
│    Developer 1 (Backend)  │ Developer 2 (Employee)  │Developer 3 (Employer)│
├───────────────────────────┼─────────────────────────┼───────────────────┤
│ • PostgreSQL Schema       │ • Employee Mini App UI  │ • Employer Mini   │
│ • Modular Monolith Core   │ • Personal/Work Info UI │   App UI          │
│ • Telegram Auth & Session │ • Skills Tagging UI     │ • Business Info   │
│ • Profile & Doc APIs      │ • CV Upload & Preview   │   Form            │
│ • S3 Presigned URL Svc    │ • Employee Profile View │ • License & Doc   │
│ • Security & Validation   │ • API Integration (Dev1)│   Upload UI       │
│                           │                         │ • Verification    │
│                           │                         │   Status Screen   │
│                           │                         │ • API Integration │
└───────────────────────────┴─────────────────────────┴───────────────────┘
```

---

### 2.1 👤 Developer 1 — Backend Infrastructure, Database & Authentication

**Responsibilities:**
1. **Repository Structure & Monolith Setup:**
   - Initialize Node.js/TypeScript (or Python/FastAPI) modular backend in `backend/src/modules/` (`auth`, `users`, `employees`, `employers`, `documents`).
2. **Database Modeling & Migrations (PostgreSQL):**
   - Implement relational schemas for `users`, `employee_profiles`, `skills`, `employee_skills`, `employee_experiences`, `employee_educations`, `employer_profiles`, and `documents`.
3. **Telegram Authentication (`auth` module):**
   - Validate Telegram Mini App `initData` cryptographically using the Bot Token secret key.
   - Issue JWT/Session tokens for API authorization.
4. **Core Registration & Profile APIs:**
   - `POST /api/v1/auth/telegram`: Authenticate Telegram user & return session.
   - `GET /api/v1/users/me`: Fetch user identity & assigned roles (`EMPLOYEE`, `EMPLOYER`).
   - `POST /api/v1/employees/profile`: Create/update employee profile data.
   - `GET /api/v1/employees/me`: Retrieve logged-in employee profile.
   - `POST /api/v1/employers/profile`: Create/update employer business profile.
   - `GET /api/v1/employers/me`: Retrieve logged-in employer profile and status.
5. **Document Management & Storage Infrastructure:**
   - Integration with Object Storage (S3 / GCS / R2) for private file uploads (CVs, Business Licenses).
   - Pnresigned URL API endpoints: `POST /api/v1/documents/upload-url` and confirmation `POST /api/v1/documents/confirm`.
6. **Data Validation & Security:**
   - Input validation schemas (e.g. Zod/Joi) for phone numbers (+251...), file types (PDF, PNG, JPG), and size limits (max 10MB).

---

### 2.2 👤 Developer 2 — Employee Registration & Profile Experience

**Responsibilities:**
1. **Employee Mini App Flow Design & Navigation:**
   - Build a smooth, step-by-step registration wizard optimized for Telegram Mini App screens.
2. **Step 1: Personal Information Screen:**
   - First Name, Last Name, Phone Number (pre-filled from Telegram if authorized, or manually entered), Bio, Location/City in Ethiopia.
3. **Step 2: Professional Details & Skills Tagging:**
   - Primary Job Title / Category (e.g., Software Engineer, Accountant, Graphic Designer, Driver).
   - Interactive Skills selector/tagger with search.
   - Work experience history (Company name, title, date range, description).
   - Education history (Institution, degree/qualification).
4. **Step 3: CV & Document Upload UI:**
   - Upload component supporting PDF/DOCX.
   - Direct-to-storage upload using Developer 1's presigned URL endpoint.
   - Progress bar, retry state, and success validation.
5. **Step 4: Profile Review & Submission:**
   - Final review screen displaying all entered information.
   - Profile completeness score indicator (e.g. 85% complete).
6. **Step 5: Employee Profile Dashboard:**
   - "My Profile" view allowing editing of info and re-uploading CV.
7. **Backend API Integration:**
   - Connect all form screens to Developer 1's authentication and employee APIs.

---

### 2.3 👤 Developer 3 — Employer Registration & Document Verification Experience

**Responsibilities:**
1. **Employer Mini App Flow Design & Navigation:**
   - Step-by-step registration wizard tailored for businesses/employers.
2. **Step 1: Business Profile Form:**
   - Business/Company Name, Business Type (PLC, Share Company, Sole Proprietorship, Individual Employer).
   - Industry sector, Business Location, Contact Phone Number, Brief Company Bio.
3. **Step 2: Business Verification & Document Upload:**
   - Upload required verification documents:
     - Trade License / Business Registration Certificate.
     - TIN (Tax Identification Number) Certificate or Representative ID.
   - Upload UI supporting image scans (PNG/JPG) and PDF documents via presigned storage URLs.
4. **Step 3: Verification Status Screen:**
   - Dashboard displaying current verification state:
     - 🟡 `PENDING` / `UNDER_REVIEW` (documents submitted, waiting admin review).
     - 🟢 `VERIFIED` (badge visible to candidates).
     - 🔴 `REJECTED` (with reason & option to re-upload corrected documents).
5. **Step 4: Public Employer Profile Preview:**
   - Preview of how candidates will see the employer profile:
     - Company Info & Location.
     - Verified Business Badge & Uploaded Document Status.
     - Placeholder slots for Future Ratings & Hiring History (Sprint 2/3).
6. **Backend API Integration:**
   - Connect business profile forms and verification document uploads to Developer 1's backend endpoints.

---

## 3. Data Models & API Specifications for Sprint 1

### 3.1 Database Schema (PostgreSQL)

```sql
-- Identity & Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_user_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Profile
CREATE TABLE employee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    bio TEXT,
    location VARCHAR(100),
    availability_status VARCHAR(50) DEFAULT 'AVAILABLE',
    profile_completion INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills & Employee Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100)
);

CREATE TABLE employee_skills (
    employee_id UUID REFERENCES employee_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    years_experience INTEGER DEFAULT 0,
    PRIMARY KEY (employee_id, skill_id)
);

-- Employer Profile
CREATE TABLE employer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    description TEXT,
    phone VARCHAR(50),
    location VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, VERIFIED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Metadata
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- EMPLOYEE_CV, EMPLOYER_LICENSE, EMPLOYER_TIN
    storage_key VARCHAR(512) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 3.2 API Contract Endpoints

| Method | Endpoint | Auth | Handled By | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/telegram` | Public | Dev 1 | Validates Telegram `initData`, creates/fetches user, returns JWT |
| `GET` | `/api/v1/users/me` | JWT | Dev 1 | Returns current user details & role statuses |
| `POST` | `/api/v1/employees/profile` | JWT | Dev 1 & Dev 2 | Creates or updates employee profile & skills |
| `GET` | `/api/v1/employees/me` | JWT | Dev 1 & Dev 2 | Gets employee profile and attached CV details |
| `POST` | `/api/v1/employers/profile` | JWT | Dev 1 & Dev 3 | Creates or updates employer profile |
| `GET` | `/api/v1/employers/me` | JWT | Dev 1 & Dev 3 | Gets employer profile & verification status |
| `POST` | `/api/v1/documents/upload-url` | JWT | Dev 1, 2, 3 | Returns presigned URL for direct object storage upload |
| `POST` | `/api/v1/documents/confirm` | JWT | Dev 1, 2, 3 | Confirms document upload completion & records metadata |

---

## 4. Key Decisions & Technical Alignment Points

Before starting code implementation, the team should align on the following technical choices:

1. **Backend Tech Stack:**
   - *Option A:* Node.js (TypeScript) + Express/Fastify + Prisma / Drizzle ORM.
   - *Option B:* Python + FastAPI + SQLAlchemy / Alembic.
2. **Object Storage Provider:**
   - AWS S3, Cloudflare R2, Google Cloud Storage, or MinIO (local dev).
3. **Telegram Integration Method:**
   - WebApp (`initData` validation in header `Authorization: Bearer tma <initData>`).
4. **Validation Rules for Ethiopia:**
   - Phone format: `^(\+251|0)[97]\d{8}$`
   - Allowed document types: PDF, PNG, JPG (Max size: 10MB).

---

## 5. Sprint 1 Acceptance Criteria & Definition of Done

- [ ] **Auth:** Users opening the Mini App inside Telegram are automatically authenticated securely.
- [ ] **Employee Flow:** An employee can sign up, select skills, enter work experience, upload a CV, and view their complete profile.
- [ ] **Employer Flow:** An employer can sign up with business details, upload a trade license / verification document, and view their verification status.
- [ ] **Document Security:** Files uploaded to object storage are private and accessible only via signed URLs.
- [ ] **Integration:** Frontend views created by Developer 2 and Developer 3 successfully communicate with Developer 1's backend APIs without schema mismatches.

---

## 6. Next Steps & Team Discussion

Let's discuss and confirm:
1. Are all tasks for **Developer 1**, **Developer 2**, and **Developer 3** clear and aligned with your team's current setup?
2. Which backend language/framework (Node.js/TypeScript vs Python/FastAPI) and storage provider do you prefer to use?
3. Would you like to adjust any step in the registration wizards or document verification logic?
