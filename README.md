# Tech Vision Telegram Bot — Reverse Employment Marketplace

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docker.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0_Async-red)](https://sqlalchemy.org)
[![Alembic](https://img.shields.io/badge/Alembic-Migrations-orange)](https://alembic.sqlalchemy.org)

An innovative Telegram-native **Reverse Employment Marketplace** tailored for Ethiopia. Unlike traditional job boards where employers post ads and sift through applications, this platform flips the model: **employers search, filter, and discover candidates by verified skills**, while **candidates review verified employer credentials, trade licenses, ratings, and business history**.

---

## 📋 Navigation Menu

- [1. System & Architecture Guide](#1-system--architecture-guide)
- [2. How to Run Guide](#2-how-to-run-guide)
  - [Prerequisites](#prerequisites)
  - [Option A: Running with Docker (Recommended)](#option-a-running-with-docker-recommended)
  - [Option B: Running Database in Docker + Backend Locally](#option-b-running-database-in-docker--backend-locally)
  - [Connecting Database GUIs (Beekeeper Studio / DBeaver)](#connecting-database-guis-beekeeper-studio--dbeaver--tableplus)
  - [Database Migrations with Alembic](#database-migrations-with-alembic)
- [3. Folder Structure](#3-folder-structure)
- [4. API & Swagger Documentation Reference](#4-api--swagger-documentation-reference)
- [5. Detailed Design Documents](#5-detailed-design-documents)

---

## 1. System & Architecture Guide

### 💡 Core Concept: Reverse Employment Marketplace
- **Employer Discovery:** Employers filter candidates directly by skill keywords, years of experience, availability status, and location.
- **Candidate Empowerment:** Employees verify employer legitimacy by inspecting trade licenses, business TIN certificates, verified badges, and historical reviews.
- **Telegram Native:** Runs directly inside Telegram as a high-performance **Telegram Mini App** supported by a **Telegram Bot** for instant notifications.

### 🏗️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                 Telegram Mini App (UI)                  │
│       (React / TypeScript / Telegram WebApp SDK)        │
└────────────────────────────┬────────────────────────────┘
                             │
                             │ REST API + Telegram initData Header
                             ▼
┌─────────────────────────────────────────────────────────┐
│               FastAPI Backend (Python 3.11+)            │
│   • HMAC-SHA256 initData Auth  • JWT Session Tokens    │
│   • Pydantic v2 Validation     • Async SQLAlchemy 2.0   │
└───────────────┬─────────────────────────┬───────────────┘
                │                         │
                ▼                         ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│      PostgreSQL (v16)         │ │        Object Storage         │
│   • Primary Source of Truth   │ │   • CV Documents & Resumes    │
│   • Users, Profiles, Skills   │ │   • Trade Licenses & TINs     │
└───────────────────────────────┘ └───────────────────────────────┘
```

### 🛠️ Technical Stack Summary

| Layer | Technology Choice | Function / Notes |
|---|---|---|
| **Backend Language** | Python 3.11+ | High-performance async support |
| **Framework** | FastAPI | Async REST APIs, OpenAPI docs & Pydantic v2 validation |
| **Database** | PostgreSQL 16 | Relational store, source of truth |
| **ORM & Migrations** | SQLAlchemy 2.0 (Async) + Alembic | Async ORM session management & schema migrations |
| **Containerization** | Docker & Docker Compose | Multi-container environment for database & API |
| **Client Interface** | Telegram Mini App + Bot | WebApp interface for candidates/employers & notification bot |

---

## 2. How to Run Guide

### Prerequisites
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) installed.
- (Optional for local non-Docker development) Python 3.11+ and `uv` or `pip`.

---

### Option A: Running with Docker (Recommended)

Running with Docker launches both PostgreSQL 16 and the FastAPI Backend with a single command. **No local Python or Postgres installation is needed.**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dagmawi122/tele-bot.git
   cd tele-bot
   ```

2. **Setup Environment File**:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Launch Containers**:
   ```bash
   docker compose up --build
   ```

4. **Access Applications**:
   - **Swagger UI Interactive API Docs:** `http://localhost:8000/docs`
   - **ReDoc API Documentation:** `http://localhost:8000/redoc`
   - **System Health Endpoint:** `http://localhost:8000/api/v1/health`

5. **Stop Containers**:
   ```bash
   docker compose down
   ```

---

### Option B: Running Database in Docker + Backend Locally

If you prefer executing Python directly on your host machine for debugging:

1. **Start only the PostgreSQL Database container**:
   ```bash
   docker compose up -d db
   ```

2. **Initialize Local Virtual Environment & Install Dependencies**:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Start FastAPI Backend with Hot Reload**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

---

### Connecting Database GUIs (Beekeeper Studio / DBeaver / TablePlus)

To inspect database tables using a GUI tool like **Beekeeper Studio**, use the following connection settings:

| Setting | Value to Enter |
|---|---|
| **Connection Type** | `Postgres` |
| **Host** | `localhost` *(or `127.0.0.1`)* |
| **Port** | `5432` |
| **User / Username** | `postgres` |
| **Password** | `postgres` |
| **Default Database** | `tele_bot` |
| **SSL Mode** | **`Disable`** (or toggle OFF) ⚠️ |

> [!IMPORTANT]
> **SSL Mode**: You MUST set SSL to **`Disable`** in Beekeeper Studio because local Docker PostgreSQL runs without SSL certificates.

---

### Database Migrations with Alembic

Alembic tracks and executes schema changes in PostgreSQL:

- **Generate a new migration script**:
  ```bash
  cd backend
  .venv/bin/alembic revision --autogenerate -m "describe_migration"
  ```
- **Apply migrations to database**:
  ```bash
  cd backend
  .venv/bin/alembic upgrade head
  ```
- **Rollback last migration**:
  ```bash
  cd backend
  .venv/bin/alembic downgrade -1
  ```

---

## 3. Folder Structure

```text
tele-bot/
├── docker-compose.yml              # Multi-container orchestration (Postgres 16 + FastAPI)
├── .gitignore                      # Excludes secrets (.env), virtualenv, bytecode, IDE files
├── README.md                       # Main Developer Guide, Run Instructions & API Specs
├── Docs/                           # Architecture & Design Documents
│   ├── Documentation.md            # Technical specifications, ER diagrams & API designs
│   ├── sprint_1_doc.md             # Sprint 1 task allocation & SQL schemas
│   └── telegram_marketplace_system_design.md # Architectural monolith system design
└── backend/                        # FastAPI Backend Service
    ├── Dockerfile                  # Container build recipe
    ├── .dockerignore              # Exclusions for Docker context
    ├── requirements.txt            # Python package dependencies
    ├── main.py                     # FastAPI application entrypoint & Swagger setup
    ├── .env                        # Local secret environment variables (Git-ignored)
    ├── .env.example                # Template environment configuration
    ├── alembic.ini                 # Alembic migration configuration
    ├── alembic/                    # Database migration environment
    │   ├── env.py                  # Migration runner (loads settings & Base.metadata)
    │   └── versions/               # Migration revision scripts
    ├── infrastructure/             # Core Infrastructure layer
    │   ├── database/               # Async engine, sessionmaker, Base class & mixins
    │   │   ├── base.py             # Declarative Base, UUIDMixin, TimestampMixin
    │   │   └── connection.py       # Async engine & get_db FastAPI dependency
    │   ├── storage/                # Object storage integration (S3/MinIO)
    │   ├── redis/                  # Caching & session store
    │   └── telegram/               # Telegram bot client integration
    ├── modules/                    # Modular Monolith Domain Modules
    │   ├── auth/                   # Telegram initData verification & JWT generation
    │   ├── users/                  # User identity, status & role management
    │   ├── employees/              # Employee candidate profiles, skills, experience, education
    │   ├── employers/              # Employer business profiles & verification status
    │   ├── documents/              # File upload & document verification metadata
    │   ├── applications/           # Job applications domain
    │   ├── jobs/                   # Job listings domain
    │   └── notifications/          # Telegram notification dispatch
    └── shared/                     # Shared cross-cutting concerns
        ├── config.py               # Pydantic Settings configuration loader
        ├── errors/                 # Global exception handlers
        ├── utils/                  # Helper utilities
        └── validation/             # Validation logic
```

---

## 4. API & Swagger Documentation Reference

The backend features auto-generated, interactive OpenAPI documentation via Swagger UI.

### Interactive API Documentation Links
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc UI:** `http://localhost:8000/redoc`
- **OpenAPI Schema (JSON):** `http://localhost:8000/api/v1/openapi.json`

### Core API Endpoint Specifications

Base URL Path: `/api/v1`

| Category | HTTP Method | Endpoint Path | Description | Auth Required |
|---|---|---|---|---|
| **System** | `GET` | `/api/v1/health` | Service operational status & database connectivity check | No |
| **Auth** | `POST` | `/api/v1/auth/telegram` | Validates Telegram `initData` HMAC signature and issues JWT bearer token | No |
| **Users** | `GET` | `/api/v1/users/me` | Fetches authenticated user identity details & profile flags | Yes (JWT) |
| **Employees** | `POST` | `/api/v1/employees/profile` | Creates/updates candidate employee profile, skills, education & experience | Yes (JWT) |
| **Employees** | `GET` | `/api/v1/employees/me` | Retrieves current candidate employee profile details | Yes (JWT) |
| **Employers** | `POST` | `/api/v1/employers/profile` | Registers/updates employer business details & TIN info | Yes (JWT) |
| **Employers** | `GET` | `/api/v1/employers/me` | Retrieves current employer business profile & verification status | Yes (JWT) |
| **Documents** | `POST` | `/api/v1/documents/upload` | Generates presigned URL for document upload (CVs, Trade Licenses) | Yes (JWT) |

### System Health Check API Specification (`GET /api/v1/health`)

#### Response Example (`200 OK`):
```json
{
  "status": "online",
  "project": "Tech Vision Telegram Bot",
  "version": "1.0.0",
  "database": "healthy"
}
```

---

## 5. Detailed Design Documents

For deep-dive architectural specifications, ER diagrams, and design details, check the following documents in the `Docs/` directory:

- 📄 [Documentation.md](Docs/Documentation.md) — Comprehensive technical specification containing ER diagrams, API payload schemas, Telegram `initData` HMAC validation algorithms, and state machines.
- 🎯 [sprint_1_doc.md](Docs/sprint_1_doc.md) — Sprint 1 operational plan, team developer allocations, and acceptance criteria.
- 🏗️ [telegram_marketplace_system_design.md](Docs/telegram_marketplace_system_design.md) — System design architecture blueprint.