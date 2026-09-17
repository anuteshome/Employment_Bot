# Telegram Reverse Employment Marketplace (Ethiopia)

[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://t.me/employee_hiring_bot)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://postgresql.org)

An innovative Telegram-native reverse employment marketplace tailored for Ethiopia. Unlike traditional job boards where employers post jobs and wait, this platform empowers employers to **search, filter, and discover candidates by verified skills**, while allowing candidates to **inspect verified employer credentials, trade licenses, ratings, and hiring history**.

---

## 📌 Interactive Table of Contents & Documentation Menu

Click any link below to jump directly to the specific topic or documentation file:

### 🚀 Quick Navigation
- [1. Project Overview & Reverse Marketplace Concept](#1-project-overview--reverse-marketplace-concept)
- [2. System Architecture & Tech Stack](#2-system-architecture--tech-stack)
- [3. Documentation Index](#3-documentation-index)
- [4. Sprint 1 Scope & Developer Roles](#4-sprint-1-scope--developer-roles)
- [5. System Design & Architectural Principles](#5-system-design--architectural-principles)
- [6. Setup & Directory Structure](#6-setup--directory-structure)

---

### 📖 Detailed Topic Navigation Links

#### 🛠️ Technical Stack & Database Design
- 📄 [Technical Stack Summary](Documentation.md#1-technical-stack)
- 📊 [Entity-Relationship (ER) Diagram](Documentation.md#2-entity-relationship-er-diagram)
- 🗃️ [Database Schemas & Entities](Documentation.md#3-entity-descriptions--relationships-summary)

#### 🔐 Authentication, Security & APIs
- 🔑 [Telegram Authentication Mechanism (`initData` validation)](Documentation.md#4-telegram-authentication-mechanism)
- 🔌 [FastAPI Registration & Profile APIs](Documentation.md#5-registration--core-api-specifications)
- 📈 [Registration Status Tracking State Machine](Documentation.md#6-registration-status-tracking--state-machine)
- 🛡️ [Security, RBAC & Ownership Model](Documentation.md#7-basic-security--authorization-model)

#### 🏃 Sprint Planning & Team Allocation
- 🎯 [Sprint 1 Execution Document](sprint_1_doc.md)
- 👤 [Developer 1 Scope (Backend, DB & Auth)](sprint_1_doc.md#21--developer-1--backend-infrastructure-database--authentication)
- 👤 [Developer 2 Scope (Employee Mini App)](sprint_1_doc.md#22--developer-2--employee-registration--profile-experience)
- 👤 [Developer 3 Scope (Employer Mini App & Documents)](sprint_1_doc.md#23--developer-3--employer-registration--document-verification-experience)
- 🏗️ [Full System Design Specifications](telegram_marketplace_system_design.md)

---

## 1. Project Overview & Reverse Marketplace Concept

Traditional job boards operate with high friction: employers post ads, receive hundreds of mismatched applications, and manually sift through them.

This platform flips the model (**Reverse Employment Marketplace**):
- **Employer Discovery:** Employers filter candidates directly by skills, years of experience, availability, and location.
- **Candidate Empowerment:** Employees verify employer legitimacy by reviewing company trade licenses, business TIN certificates, verified badges, and historical rating reviews.
- **Telegram Native:** Runs directly inside Telegram as a high-performance **Telegram Mini App** supported by a **Telegram Bot** for notifications.

---

## 2. System Architecture & Tech Stack

```text
               ┌─────────────────────────────────────┐
               │         Telegram Mini App           │
               │   (React / TypeScript / HTML5)      │
               └──────────────────┬──────────────────┘
                                  │
                                  ▼
               ┌─────────────────────────────────────┐
               │          FastAPI Backend            │
               │   (Python 3.11+, Pydantic, JWT)     │
               └─────────┬───────────────────┬───────┘
                         │                   │
                         ▼                   ▼
               ┌───────────────────┐ ┌───────────────┐
               │ PostgreSQL (v15+) │ │ Object Storage│
               │ Source of Truth   │ │ (CVs, Licenses│
               └───────────────────┘ └───────────────┘
```

| Layer | Technology | Status |
|---|---|---|
| **Backend Language** | Python 3.11+ | Selected |
| **Framework** | FastAPI | Selected |
| **Database** | PostgreSQL | Selected |
| **ORM / Migration** | SQLAlchemy 2.0 (Async) + Alembic | Selected |
| **Object Storage** | S3 / R2 / GCS / MinIO | Pending Evaluation |
| **Bot & Mini App** | `@telegram-apps/sdk` + Python Telegram Bot | Selected |

---

## 3. Documentation Index

The codebase contains full modular documentation for developers:

1. [Documentation.md](Documentation.md) — Comprehensive technical specification containing ER diagrams, API specs, auth workflows, and security models.
2. [sprint_1_doc.md](sprint_1_doc.md) — Sprint 1 operational plan, team role assignments, acceptance criteria, and SQL schemas.
3. [Telegram Bot Plan.md](Telegram%20Bot%20Plan.md) — Initial developer responsibilities outline.
4. [telegram_marketplace_system_design.md](telegram_marketplace_system_design.md) — Scalable modular monolith architectural overview.

---

## 4. Sprint 1 Scope & Developer Roles

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
│ • Presigned Storage URLs  │ • Employee Profile View │ • License & Doc   │
│ • Security & RBAC         │ • API Integration (Dev1)│   Upload UI       │
│                           │                         │ • Verification    │
│                           │                         │   Status Screen   │
└───────────────────────────┴─────────────────────────┴───────────────────┘
```

---

## 5. System Design & Architectural Principles

1. **Modular Monolith First:** Scalable internal module separation (`auth`, `users`, `employees`, `employers`, `documents`) without premature microservice overhead.
2. **PostgreSQL as Source of Truth:** All identity, state, and business relationships are transactions in PostgreSQL.
3. **Cryptographic Telegram Verification:** All Mini App requests pass cryptographic HMAC-SHA256 signatures derived from the Bot Token.

---

## 6. Setup & Directory Structure

```text
tele-bot/
├── README.md                              # Main Landing & Interactive Menu
├── Documentation.md                        # ER Diagram, APIs & Auth Specs
├── sprint_1_doc.md                         # Sprint 1 Developer Plan
├── Telegram Bot Plan.md                    # Role Division Overview
├── telegram_marketplace_system_design.md   # Architectural Blueprint
├── backend/                                # FastAPI Monolith Backend
│   ├── infrastructure/                     # DB, Storage, Telegram clients
│   ├── modules/                            # Auth, Users, Employees, Employers, Documents
│   └── shared/                             # Utils, Security, Errors
└── frontend/                               # Telegram Mini App Frontend
    └── src/
        ├── components/
        ├── features/
        └── pages/
```