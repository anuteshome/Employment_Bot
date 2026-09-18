# Candidate Employee Registration & Profile Specifications

This document defines the complete technical specifications for Candidate Employee Registration, Skills Tagging, Work History, Educational Background, Profile Completeness Calculation, and API Endpoints.

---

## 📋 Table of Contents
- [1. Data Schemas & Models Overview](#1-data-schemas--models-overview)
- [2. API Specifications](#2-api-specifications)
- [3. Profile Completeness Algorithm](#3-profile-completeness-algorithm)
- [4. Frontend Integration Specifications](#4-frontend-integration-specifications)

---

## 1. Data Schemas & Models Overview

The Employee domain manages candidate profiles, skills directory, work experience history, and educational background across 5 PostgreSQL tables:

```text
┌───────────────────────┐
│        USERS          │
└───────────┬───────────┘
            │ 1-to-1 (user_id)
            ▼
┌───────────────────────┐ 1-to-many ┌────────────────────────┐
│   EMPLOYEE_PROFILES   ├──────────►│  EMPLOYEE_EXPERIENCES  │
└─────┬───────────┬─────┘           └────────────────────────┘
      │           │       1-to-many ┌────────────────────────┐
      │           └────────────────►│  EMPLOYEE_EDUCATIONS   │
      │                             └────────────────────────┘
      │ Many-to-Many
      ▼
┌───────────────────────┐           ┌────────────────────────┐
│    EMPLOYEE_SKILLS    ├──────────►│        SKILLS          │
└───────────────────────┘           └────────────────────────┘
```

### Table Definitions & Field Attributes

1. **`employee_profiles`**:
   - `id`: UUID Primary Key
   - `user_id`: UUID Foreign Key -> `users.id` (UNIQUE, ON DELETE CASCADE)
   - `first_name`: String(100), Required
   - `last_name`: String(100), Required
   - `bio`: Text, Optional
   - `location`: String(100), Optional (City/Region in Ethiopia)
   - `availability_status`: String(50), Default `'AVAILABLE'` (`AVAILABLE`, `BUSY`, `NOT_AVAILABLE`)
   - `profile_completion`: Integer, Default `0` (Calculated percentage 0% - 100%)
   - `created_at`, `updated_at`: DateTime(timezone=True)

2. **`skills` & `employee_skills`**:
   - `skills`: Directory of unique skill names (`id`, `name` UNIQUE, `category`).
   - `employee_skills`: Junction table (`employee_id`, `skill_id`, `years_experience`).

3. **`employee_experiences`**:
   - Candidate work history (`id`, `employee_id`, `company_name`, `position`, `description`, `start_date`, `end_date`).

4. **`employee_educations`**:
   - Educational background (`id`, `employee_id`, `institution`, `qualification`, `field`, `start_date`, `end_date`).

---

## 2. API Specifications

Base URL Path: `/api/v1/employees`

### 2.1 Create or Update Employee Profile (`POST /api/v1/employees/profile`)

Creates or updates the authenticated candidate's employee profile, skills, work history, and education entries.

* **Authorization Header**: `Authorization: Bearer <access_token>`
* **Required Role**: `EMPLOYEE`
* **Request Payload**:
  ```json
  {
    "first_name": "Abebe",
    "last_name": "Bikila",
    "bio": "Experienced software engineer specializing in Python, FastAPI, and web apps.",
    "location": "Addis Ababa, Ethiopia",
    "availability_status": "AVAILABLE",
    "skills": [
      { "name": "Python", "category": "Software Engineering", "years_experience": 4 },
      { "name": "FastAPI", "category": "Backend", "years_experience": 3 },
      { "name": "React", "category": "Frontend", "years_experience": 2 }
    ],
    "experiences": [
      {
        "company_name": "Tech Corp Ethiopia",
        "position": "Backend Developer",
        "description": "Built high-performance APIs",
        "start_date": "2023-01-01",
        "end_date": "2025-12-31"
      }
    ],
    "educations": [
      {
        "institution": "Addis Ababa University",
        "qualification": "BSc Degree",
        "field": "Computer Science",
        "start_date": "2019-09-01",
        "end_date": "2023-07-01"
      }
    ]
  }
  ```

* **Response Payload (`200 OK`)**:
  ```json
  {
    "id": "e4f8a123-0000-4000-8000-123456789abc",
    "user_id": "a3b8c9d1-0000-4000-8000-123456789abc",
    "first_name": "Abebe",
    "last_name": "Bikila",
    "bio": "Experienced software engineer...",
    "location": "Addis Ababa, Ethiopia",
    "availability_status": "AVAILABLE",
    "profile_completion": 90,
    "skills": [
      { "id": "...", "name": "Python", "category": "Software Engineering", "years_experience": 4 },
      { "id": "...", "name": "FastAPI", "category": "Backend", "years_experience": 3 }
    ],
    "experiences": [
      { "id": "...", "company_name": "Tech Corp Ethiopia", "position": "Backend Developer" }
    ],
    "educations": [
      { "id": "...", "institution": "Addis Ababa University", "qualification": "BSc Degree" }
    ],
    "created_at": "2026-09-19T00:00:00Z",
    "updated_at": "2026-09-19T00:00:00Z"
  }
  ```

---

### 2.2 Get Current Employee Profile (`GET /api/v1/employees/me`)

Retrieves current candidate employee profile details, attached skills, work history, education, and CV metadata.

* **Authorization Header**: `Authorization: Bearer <access_token>`
* **Response Payload (`200 OK`)**: Returns complete `EmployeeProfileResponse`.

---

## 3. Profile Completeness Algorithm

The `profile_completion` metric (0% - 100%) is automatically computed on each profile update based on weighted criteria:

| Section | Required Attributes | Weight |
|---|---|---|
| **Personal Info** | `first_name`, `last_name`, `location`, `bio` | **30%** |
| **Skills Tagging** | At least 1 skill tagged in `skills` array | **30%** |
| **Work Experience** | At least 1 work history entry | **20%** |
| **Education History** | At least 1 educational entry | **20%** |

---

## 4. Frontend Integration Specifications

In `frontend/services/employeeService.ts`:
- **`saveEmployeeProfile(payload)`**: Posts candidate onboarding data to `POST /api/v1/employees/profile`.
- **`getEmployeeProfile()`**: Fetches profile data from `GET /api/v1/employees/me`.
- **Form State Sync**: Connects `EmployeeWizard.tsx` form submit to `saveEmployeeProfile()` and displays `EmployeeDashboard.tsx` upon success.
