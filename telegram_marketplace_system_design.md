# Telegram Bot + Mini App Marketplace
## Scalable System Design

**Status:** Draft  
**Version:** 0.1  
**Date:** 2026-09-16

---

# 1. Project Overview

The platform is a Telegram-based employment marketplace connecting employers and employees.

The system allows:

- Employers to register their businesses.
- Employers to submit licenses and verification documents.
- Employees to create professional profiles and upload CVs.
- Employers to discover and evaluate employees.
- Employees to evaluate employers.
- Employers to create jobs and select candidates.
- The platform to manage hiring relationships.
- Employers to make payments through Chapa.
- Both sides to build reputation through verified ratings and reviews.

The primary client is a **Telegram Mini App**, supported by a **Telegram Bot** for notifications and lightweight interactions.

The architecture must support high growth while remaining simple enough to develop and operate during the initial stage.

---

# 2. Architecture Strategy

## 2.1 Recommended Starting Architecture

Start with a **modular monolith**.

Do not start with many microservices.

The backend should be internally divided into independent business modules with clear boundaries:

```text
tele-bot/
├── backend/
│   └── src/
│       ├── modules/
│       │   ├── admin/
│       │   ├── applications/
│       │   ├── auth/
│       │   ├── documents/
│       │   ├── employees/
│       │   ├── employers/
│       │   ├── hiring/
│       │   ├── jobs/
│       │   ├── notifications/
│       │   ├── payments/
│       │   ├── ratings/
│       │   └── users/
│       ├── infrastructure/
│       │   ├── chapa/
│       │   ├── database/
│       │   ├── queue/
│       │   ├── redis/
│       │   ├── storage/
│       │   └── telegram/
│       └── shared/
│           ├── errors/
│           ├── logging/
│           ├── validation/
│           └── utils/
│
└── frontend/
    └── src/
        ├── assets/
        ├── components/
        │   ├── common/
        │   └── ui/
        ├── features/
        │   ├── applications/
        │   ├── auth/
        │   ├── hiring/
        │   ├── jobs/
        │   ├── payments/
        │   ├── profile/
        │   └── ratings/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── types/
        └── utils/

```

This provides clean boundaries while avoiding the operational complexity of microservices.

Individual modules can later be extracted into separate services if scale or team structure requires it.

---

# 3. High-Level System Architecture

```text
                         ┌─────────────────────┐
                         │      Telegram       │
                         │       Users         │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ Telegram Bot +      │
                         │ Mini App            │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │          API Backend          │
                    │                               │
                    │ Auth                          │
                    │ Users                         │
                    │ Employers                     │
                    │ Employees                     │
                    │ Jobs                          │
                    │ Applications                  │
                    │ Hiring                        │
                    │ Ratings                       │
                    │ Payments                      │
                    │ Documents                     │
                    │ Notifications                 │
                    │ Admin                         │
                    └───────┬───────────┬───────────┘
                            │           │
              ┌─────────────┘           └─────────────┐
              ▼                                       ▼
      ┌───────────────┐                       ┌───────────────┐
      │ PostgreSQL    │                       │ Redis         │
      │               │                       │               │
      │ Source of     │                       │ Cache         │
      │ truth         │                       │ Queues        │
      │ Transactions  │                       │ Rate limits   │
      └───────────────┘                       └───────┬───────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │ Background      │
                                             │ Workers         │
                                             └────────┬────────┘
                                                      │
                              ┌───────────────────────┼───────────────────┐
                              ▼                       ▼                   ▼
                       Telegram Bot              Chapa             Object Storage
                       Notifications             Payments           CVs/Documents
```

---

# 4. Core Architectural Principles

## 4.1 PostgreSQL is the source of truth

Critical business data must live in PostgreSQL.

Redis must never become the authoritative database.

## 4.2 Strong consistency for critical operations

The following require strong consistency:

- Payments
- Hiring
- Application state
- Permissions
- Verification state
- Financial transactions

## 4.3 Eventual consistency where appropriate

The following can be eventually consistent:

- Search indexes
- Notification delivery
- Analytics
- Cached rating summaries
- Profile view counters

## 4.4 Asynchronous processing

Slow or non-critical work should run in background workers.

Examples:

- Telegram notifications
- Email/SMS if added later
- Document processing
- Search indexing
- Analytics
- Payment reconciliation

## 4.5 Telegram is a client, not the backend

Telegram should not contain business logic.

The backend owns:

- Users
- Profiles
- Jobs
- Applications
- Hiring
- Payments
- Ratings
- Permissions

---

# 5. Main Actors

The initial system has four major actor types.

## 5.1 Employee

An individual looking for employment.

Capabilities:

- Register
- Create profile
- Upload CV
- Add skills
- Add experience
- Search jobs
- Apply for jobs
- View employer profiles
- View employer reputation
- Accept/reject hiring offers
- Rate employers after eligible employment

## 5.2 Employer

A business or organization looking for employees.

Capabilities:

- Register business
- Upload verification documents
- Create jobs
- Search employees
- Review applications
- Select candidates
- Pay required platform fees
- Manage hiring
- Rate employees

## 5.3 Admin

Platform operator.

Capabilities:

- Verify employers
- Review documents
- Moderate users
- Moderate jobs
- Review reports
- Manage disputes
- Review payments
- Manage platform settings
- View audit logs

## 5.4 System

Automated backend processes.

Responsibilities:

- Process payments
- Handle webhooks
- Send notifications
- Update caches
- Process queues
- Calculate aggregates
- Run scheduled tasks

---

# 6. Domain Model

The main domains are:

```text
Identity
Employer
Employee
Jobs
Applications
Hiring
Payments
Ratings
Documents
Notifications
Administration
```

---

# 7. Identity Domain

## User

Represents the platform account.

```text
User
- id
- telegram_user_id
- username
- phone
- status
- created_at
- updated_at
```

Telegram identity is mapped to an internal user ID.

Internal business entities should reference `user.id`, not Telegram IDs directly.

## User Roles

A user may have one or more roles.

```text
USER
├── EMPLOYEE
├── EMPLOYER
└── ADMIN
```

The architecture should allow a user to have both employee and employer roles in the future.

---

# 8. Employee Domain

## EmployeeProfile

```text
EmployeeProfile
- id
- user_id
- first_name
- last_name
- bio
- date_of_birth
- gender
- location
- availability_status
- visibility_status
- profile_completion
- created_at
- updated_at
```

Sensitive fields should only be stored if genuinely required by the business.

## EmployeeSkill

```text
EmployeeSkill
- employee_id
- skill_id
- level
- years_experience
```

## Skill

```text
Skill
- id
- name
- category
```

## EmployeeExperience

```text
EmployeeExperience
- id
- employee_id
- company_name
- position
- description
- start_date
- end_date
```

## EmployeeEducation

```text
EmployeeEducation
- id
- employee_id
- institution
- qualification
- field
- start_date
- end_date
```

---

# 9. Employer Domain

## EmployerProfile

```text
EmployerProfile
- id
- user_id
- business_name
- business_type
- description
- phone
- location
- verification_status
- created_at
- updated_at
```

## EmployerDocument

```text
EmployerDocument
- id
- employer_id
- document_type
- storage_key
- verification_status
- rejection_reason
- uploaded_at
- reviewed_at
```

Possible verification states:

```text
PENDING
UNDER_REVIEW
VERIFIED
REJECTED
EXPIRED
```

---

# 10. Documents

Files such as CVs, licenses, certificates and other documents should be stored in object storage.

PostgreSQL stores metadata only.

```text
Object Storage
├── employee-cvs/
├── employee-certificates/
├── employer-licenses/
└── employer-documents/
```

Example:

```text
Document
- id
- owner_id
- type
- storage_key
- original_filename
- mime_type
- size
- status
- created_at
```

Private documents must not be publicly accessible.

Access should use authorization plus temporary signed URLs.

---

# 11. Job Domain

Employers create jobs.

```text
Job
- id
- employer_id
- title
- description
- employment_type
- location
- salary_min
- salary_max
- currency
- status
- expires_at
- created_at
- updated_at
```

Possible job states:

```text
DRAFT
PUBLISHED
PAUSED
CLOSED
EXPIRED
CANCELLED
```

---

# 12. Application Domain

An employee applies to a job.

```text
Application
- id
- job_id
- employee_id
- cover_message
- cv_document_id
- status
- created_at
- updated_at
```

Possible states:

```text
SUBMITTED
REVIEWING
SHORTLISTED
REJECTED
WITHDRAWN
SELECTED
```

The system should prevent invalid transitions.

For example:

```text
REJECTED -> SELECTED
```

should not be allowed without an explicit administrative/business rule.

---

# 13. Hiring Domain

Hiring should be separate from applications.

A candidate can be selected from an application, after which a hiring relationship is created.

```text
Application
     │
     ▼
Candidate Selected
     │
     ▼
Hiring
     │
     ▼
Payment
     │
     ▼
Employment
```

## Hiring

```text
Hiring
- id
- employer_id
- employee_id
- job_id
- application_id
- status
- start_date
- end_date
- agreed_terms
- created_at
- updated_at
```

Possible states:

```text
PENDING_PAYMENT
PAYMENT_PROCESSING
ACTIVE
COMPLETED
CANCELLED
DISPUTED
```

---

# 14. Payment Domain

Chapa is an external payment provider.

Our system owns the business payment record.

```text
Payment
- id
- hiring_id
- provider
- provider_reference
- amount
- currency
- status
- initiated_at
- completed_at
```

Payment states:

```text
PENDING
PROCESSING
SUCCESS
FAILED
CANCELLED
REFUNDED
```

## Payment Flow

```text
Employer selects employee
        │
        ▼
Create Hiring
        │
        ▼
Create Payment
        │
        ▼
Initialize Chapa transaction
        │
        ▼
User completes payment
        │
        ▼
Chapa webhook
        │
        ▼
Verify transaction
        │
        ▼
Update Payment
        │
        ▼
Complete/activate Hiring
```

The frontend redirect must not be treated as proof of successful payment.

Payment confirmation should be based on backend verification and verified webhook events.

---

# 15. Payment Idempotency

Payment operations must be idempotent.

A webhook can arrive more than once.

Example:

```text
Webhook #1
Payment SUCCESS

Webhook #2
Payment SUCCESS

Webhook #3
Payment SUCCESS
```

The result should still be:

```text
Payment = SUCCESS
Hiring = ACTIVE
```

not three separate business operations.

Use unique provider references and payment event records.

---

# 16. Rating and Reputation Domain

Ratings should be tied to legitimate interactions.

## Review

```text
Review
- id
- reviewer_user_id
- target_user_id
- hiring_id
- rating
- comment
- status
- created_at
```

A review should normally require a completed or otherwise eligible hiring relationship.

This prevents arbitrary users from creating reviews.

## Rating Summary

For fast reads:

```text
RatingSummary
- user_id
- average_rating
- total_reviews
- updated_at
```

The review records remain the source of truth.

The summary is an optimization.

---

# 17. Reputation

Employer reputation may include:

```text
Employer
├── Average rating
├── Number of reviews
├── Completed hires
├── Hiring history
├── Verification status
└── Other approved reputation metrics
```

Employee reputation may include:

```text
Employee
├── Average rating
├── Number of reviews
├── Completed jobs
├── Experience
└── Verified information
```

Only metrics with clear business definitions should be publicly displayed.

---

# 18. Notifications

Notifications should be asynchronous.

Bad:

```text
API Request
   ↓
Database
   ↓
Telegram API
   ↓
Response
```

Preferred:

```text
API Request
   ↓
Database
   ↓
Event
   ↓
Queue
   ↓
Notification Worker
   ↓
Telegram
```

Examples:

```text
ApplicationSubmitted
CandidateSelected
PaymentSucceeded
HiringActivated
JobClosed
ReviewAvailable
DocumentVerified
```

---

# 19. Redis

Redis can be used for:

- API caching
- Rate limiting
- Temporary session state
- Distributed locks
- Background queues
- Frequently accessed aggregates

Example:

```text
GET employee profile

        │
        ▼
      Redis
        │
   ┌────┴────┐
   │ Cached? │
   └────┬────┘
        │
     yes│
        ▼
     Return

        no
        │
        ▼
   PostgreSQL
        │
        ▼
      Redis
        │
        ▼
      Return
```

Cache invalidation should happen whenever important underlying data changes.

---

# 20. Search Architecture

The first version can use PostgreSQL search and indexes.

Potential filters:

```text
Employee
├── Skills
├── Location
├── Experience
├── Rating
├── Availability
└── Profile status
```

Employer:

```text
Employer
├── Location
├── Business type
├── Rating
├── Verification
└── Hiring history
```

If search volume and dataset size grow significantly, introduce a search engine:

```text
PostgreSQL
    │
    ▼
Search Index
    │
    ▼
OpenSearch / Elasticsearch
```

Search indexes should be treated as derived data, not the source of truth.

---

# 21. Caching Strategy

Cache candidates should be identified based on read frequency.

Possible cache keys:

```text
employee:{id}
employer:{id}
employee:{id}:rating
employer:{id}:rating
job:{id}
jobs:list:{filter_hash}
employees:list:{filter_hash}
```

Use TTLs where appropriate.

For important updates, explicitly invalidate affected keys.

Example:

```text
Review created
    │
    ├── Save Review
    ├── Update RatingSummary
    └── Invalidate employer:{id}:rating
```

---

# 22. API Architecture

The API should be versioned.

Example:

```text
/api/v1/auth
/api/v1/users
/api/v1/employees
/api/v1/employers
/api/v1/jobs
/api/v1/applications
/api/v1/hirings
/api/v1/payments
/api/v1/reviews
/api/v1/documents
/api/v1/notifications
/api/v1/admin
```

API responsibilities:

- Authentication
- Authorization
- Validation
- Business operation orchestration
- Transaction management
- Response formatting

Business rules should live in application/domain services, not controllers.

---

# 23. Authorization

Authorization must be enforced server-side.

Examples:

```text
Employee
 ├── Edit own profile
 ├── Upload own CV
 ├── Apply to jobs
 ├── Withdraw own application
 └── Review eligible employers

Employer
 ├── Edit own business profile
 ├── Upload own documents
 ├── Create own jobs
 ├── Review applications to own jobs
 ├── Select candidates
 └── Review eligible employees
```

Never trust role information supplied by the frontend.

---

# 24. Admin Architecture

Admin functions should be separate from normal user capabilities.

```text
Admin
├── Employer verification
├── Document verification
├── User moderation
├── Job moderation
├── Review moderation
├── Payment inspection
├── Disputes
└── Audit logs
```

Important admin operations should create audit records.

```text
AuditLog
- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata
- created_at
```

---

# 25. Database Design

Initial core tables:

```text
users
user_roles

employee_profiles
employee_skills
employee_experiences
employee_education

skills

employer_profiles
employer_documents

documents

jobs
applications

hirings
employment_history

reviews
rating_summaries

payments
payment_events

notifications

audit_logs
```

Important unique constraints:

```text
users.telegram_user_id UNIQUE
payments.provider_reference UNIQUE
applications(job_id, employee_id) UNIQUE
reviews(hiring_id, reviewer_user_id, target_user_id) UNIQUE
```

Exact constraints will be refined during ERD design.

---

# 26. Important Indexes

Examples:

```text
users.telegram_user_id

employees.location
employees.availability_status

jobs.employer_id
jobs.status
jobs.created_at

applications.job_id
applications.employee_id
applications.status

hirings.employer_id
hirings.employee_id
hirings.status

reviews.target_user_id
reviews.hiring_id

payments.provider_reference
payments.status
```

Indexes should be based on actual query patterns and measured performance.

---

# 27. Transaction Boundaries

Operations that modify multiple related records should use database transactions.

Example candidate selection:

```text
BEGIN

Update application
Create hiring
Create payment

COMMIT
```

If any critical operation fails:

```text
ROLLBACK
```

Payment confirmation should also carefully define its transaction boundaries.

---

# 28. Background Jobs

Recommended queue jobs:

```text
send_telegram_notification
process_document
index_employee
index_employer
index_job
recalculate_rating
payment_reconciliation
cleanup_expired_data
generate_analytics
```

Workers should be horizontally scalable.

```text
Queue
 ├── Worker 1
 ├── Worker 2
 ├── Worker 3
 └── Worker N
```

---

# 29. Scalability Architecture

Initial deployment:

```text
                Load Balancer
                     │
             ┌───────┴───────┐
             ▼               ▼
          API #1           API #2
             │               │
             └───────┬───────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     PostgreSQL               Redis
          │                     │
          │                     ▼
          │                 Workers
          │
          ▼
     Object Storage
```

Because API instances are stateless, more instances can be added horizontally.

---

# 30. Database Scaling

Start with one PostgreSQL primary.

As traffic grows:

```text
                PostgreSQL
                    │
              ┌─────┴─────┐
              ▼           ▼
           Primary      Replica
              │           │
           Writes       Reads
```

Read replicas should only be introduced when measurements show they are needed.

Other future options:

- Connection pooling
- Query optimization
- Partitioning
- Read replicas
- Database sharding if truly necessary

---

# 31. Object Storage Scaling

Documents and CVs should use object storage.

Application servers should not permanently store uploaded files locally.

```text
Client
  │
  ▼
Backend
  │
  ▼
Object Storage
```

For large files, direct-to-storage uploads using temporary upload URLs can reduce backend load.

---

# 32. Security Requirements

Minimum requirements:

- Telegram authentication validation
- Server-side authorization
- Input validation
- Rate limiting
- Secure file uploads
- Private document storage
- Signed URLs
- Audit logging
- Secrets stored outside source code
- HTTPS
- Database backups
- Payment webhook verification
- Idempotency
- Protection against duplicate operations

---

# 33. Observability

The system should provide:

## Logs

Structured logs containing:

```text
timestamp
request_id
user_id
operation
status
duration
error
```

## Metrics

Track:

```text
API latency
API errors
Database latency
Redis latency
Queue size
Worker failures
Payment success rate
Payment failures
Webhook failures
```

## Health checks

```text
/health
/ready
```

Health checks should verify required dependencies appropriately.

---

# 34. Failure Handling

External systems can fail.

Examples:

```text
Telegram unavailable
Chapa unavailable
Redis unavailable
Object storage unavailable
Database temporarily unavailable
```

The application should:

- Use retries where safe.
- Use exponential backoff.
- Avoid retrying non-idempotent operations blindly.
- Record failed jobs.
- Provide dead-letter/retry handling for queues.
- Keep critical business state in PostgreSQL.

---

# 35. Core User Flows

## Employee registration

```text
Telegram
   ↓
Open Mini App
   ↓
Authenticate
   ↓
Create User
   ↓
Choose Employee
   ↓
Create Employee Profile
   ↓
Upload CV
   ↓
Add Skills
   ↓
Profile Complete
```

## Employer registration

```text
Telegram
   ↓
Open Mini App
   ↓
Authenticate
   ↓
Choose Employer
   ↓
Create Business Profile
   ↓
Upload License/Documents
   ↓
Submit Verification
   ↓
Admin Review
   ↓
Verified / Rejected
```

## Job application

```text
Employee
   ↓
Search Jobs
   ↓
Open Job
   ↓
Apply
   ↓
Application Created
   ↓
Employer Notification
```

## Hiring

```text
Employer
   ↓
Review Applications
   ↓
Select Candidate
   ↓
Create Hiring
   ↓
Payment
   ↓
Chapa
   ↓
Webhook
   ↓
Verify
   ↓
Hiring Activated
```

## Rating

```text
Hiring Completed
       ↓
Review Eligibility
       ↓
Employee reviews Employer
       +
Employer reviews Employee
       ↓
Review stored
       ↓
Rating summary updated
```

---

# 36. State Machine Principle

Every important workflow should have an explicit state machine.

Examples:

```text
Job:
DRAFT → PUBLISHED → PAUSED → PUBLISHED
                      ↓
                    CLOSED

Application:
SUBMITTED → REVIEWING → SHORTLISTED → SELECTED
                  └──────────────→ REJECTED

Hiring:
PENDING_PAYMENT → PAYMENT_PROCESSING → ACTIVE
                                      ↓
                                  COMPLETED
                                      ↓
                                   REVIEW
```

Invalid state transitions must be rejected by the backend.

---

# 37. Future Microservice Extraction

If scale eventually requires microservices, likely extraction candidates are:

```text
API Core
Payment Service
Notification Service
Search Service
Document Service
Analytics Service
```

Possible future architecture:

```text
                 API Gateway
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
     Core         Payments       Search
       │             │             │
       └──────┬──────┴──────┬──────┘
              ▼             ▼
          PostgreSQL       Redis
              │
              ▼
        Event Bus / Queue
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
 Notifications Docs Analytics
```

Do not implement this architecture until there is a real reason to do so.

---

# 38. Recommended Technology Stack

A practical initial stack:

## Frontend

```text
Telegram Mini App
React
TypeScript
```

## Backend

```text
Node.js
TypeScript
NestJS or Fastify
```

## Database

```text
PostgreSQL
```

## Cache / Queue

```text
Redis
BullMQ
```

## Storage

```text
S3-compatible object storage
```

## Payment

```text
Chapa
```

## Messaging

```text
Telegram Bot API
```

## Deployment

```text
Docker
Load Balancer
CI/CD
```

Technology choices can be finalized after the domain and API design.

---

# 39. Development Phases

## Phase 1: Domain Design

- Actors
- Entities
- Business rules
- Permissions
- State machines

## Phase 2: Database

- ERD
- Tables
- Relationships
- Constraints
- Indexes
- Migrations

## Phase 3: Backend Architecture

- Module structure
- API structure
- Authentication
- Authorization
- Error handling
- Validation

## Phase 4: Telegram

- Bot
- Mini App authentication
- Webhook handling
- Notifications

## Phase 5: Employer

- Registration
- Documents
- Verification
- Jobs

## Phase 6: Employee

- Registration
- Profile
- CV
- Skills
- Applications

## Phase 7: Hiring

- Candidate selection
- Hiring state machine
- Employment history

## Phase 8: Payments

- Chapa integration
- Payment initialization
- Webhooks
- Verification
- Idempotency

## Phase 9: Reputation

- Reviews
- Rating aggregation
- Reputation rules

## Phase 10: Scalability

- Redis
- Queues
- Workers
- Caching
- Search

## Phase 11: Operations

- Monitoring
- Logging
- Backups
- Security
- CI/CD

---

# 40. Immediate Next Design Documents

After this architecture document, the recommended design order is:

```text
01-domain-model.md
02-business-rules.md
03-state-machines.md
04-erd.md
05-database-schema.md
06-api-specification.md
07-authentication.md
08-telegram-architecture.md
09-payment-architecture.md
10-caching-and-queue.md
11-security.md
12-deployment.md
13-scalability.md
```

The next document to produce should be **01-domain-model.md**, where we define every entity, relationship, ownership rule, and business concept in detail before writing database migrations or backend code.
