# Employer Business Verification & Registration Specifications

This document defines the complete technical specifications for Employer Business Registration, Company Information, Verification Status State Machine, and API Endpoints.

---

## 📋 Table of Contents
- [1. Verification Status State Machine](#1-verification-status-state-machine)
- [2. Data Model & Field Attributes](#2-data-model--field-attributes)
- [3. API Specifications](#3-api-specifications)
- [4. Frontend Integration Specifications](#4-frontend-integration-specifications)

---

## 1. Verification Status State Machine

Employer profiles undergo a strict verification pipeline before candidate search & direct messaging privileges are unlocked:

```text
 ┌───────────────┐        Submitted Credentials        ┌──────────────────┐
 │    PENDING    ├────────────────────────────────────►│   UNDER_REVIEW   │
 └───────┬───────┘                                     └────────┬─────────┘
         │                                                      │
         │ Re-uploaded Documents                                │ Manual Admin Review
         │                                                      │
         │             ┌──────────────────┐                     │
         └─────────────┤     REJECTED     │◄────────────────────┤
                       └──────────────────┘  License Invalid    │ License Verified
                                                                ▼
                                                       ┌──────────────────┐
                                                       │     VERIFIED     │
                                                       └──────────────────┘
```

- **`PENDING`**: Business profile created; waiting for required document uploads (Trade License, TIN Certificate).
- **`UNDER_REVIEW`**: Documents submitted; currently queued for admin compliance review.
- **`VERIFIED`**: Business verified; blue verification badge displayed to candidates; full search unlocked.
- **`REJECTED`**: Documents invalid or rejected; rejection reason provided with option to re-upload.

---

## 2. Data Model & Field Attributes

The `employer_profiles` table stores business credentials and verification metadata:

- `id`: UUID Primary Key
- `user_id`: UUID Foreign Key -> `users.id` (UNIQUE, ON DELETE CASCADE)
- `business_name`: String(255), Required
- `business_type`: String(100), Required (`PLC`, `Share Company`, `Sole Proprietorship`, `Individual Employer`)
- `description`: Text, Optional (Company bio / mission)
- `phone`: String(50), Optional (Business contact phone)
- `location`: String(100), Optional (City/Region in Ethiopia)
- `verification_status`: String(50), Default `'PENDING'` (`PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`)
- `created_at`, `updated_at`: DateTime(timezone=True)

---

## 3. API Specifications

Base URL Path: `/api/v1/employers`

### 3.1 Create or Update Employer Profile (`POST /api/v1/employers/profile`)

Registers or updates employer business details. Updates user role to `EMPLOYER`.

* **Authorization Header**: `Authorization: Bearer <access_token>`
* **Request Payload**:
  ```json
  {
    "business_name": "Acme Corporation PLC",
    "business_type": "PLC",
    "description": "Leading tech & innovation firm in Ethiopia.",
    "phone": "+251911000000",
    "location": "Addis Ababa, Ethiopia"
  }
  ```

* **Response Payload (`200 OK`)**:
  ```json
  {
    "id": "b7e2c345-0000-4000-8000-123456789abc",
    "user_id": "a3b8c9d1-0000-4000-8000-123456789abc",
    "business_name": "Acme Corporation PLC",
    "business_type": "PLC",
    "description": "Leading tech & innovation firm in Ethiopia.",
    "phone": "+251911000000",
    "location": "Addis Ababa, Ethiopia",
    "verification_status": "PENDING",
    "created_at": "2026-09-19T00:00:00Z",
    "updated_at": "2026-09-19T00:00:00Z"
  }
  ```

---

### 3.2 Get Current Employer Profile (`GET /api/v1/employers/me`)

Retrieves current logged-in employer business profile and verification status.

* **Authorization Header**: `Authorization: Bearer <access_token>`
* **Response Payload (`200 OK`)**: Returns `EmployerProfileResponse`.

---

## 4. Frontend Integration Specifications

In `frontend/services/employerService.ts`:
- **`saveEmployerProfile(payload)`**: Posts business data to `POST /api/v1/employers/profile`.
- **`getEmployerProfile()`**: Fetches business profile from `GET /api/v1/employers/me`.
- **Form State Sync**: Connects `EmployerWizard.tsx` form submit to `saveEmployerProfile()` and updates user role to `EMPLOYER`.
