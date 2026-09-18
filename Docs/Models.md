Database Schemas & Models Overview
We will create 8 core tables organized cleanly within our modular architecture:

1. users Table (backend/modules/users/models.py)
id: UUID (PK, default uuid4)
telegram_user_id: BigInteger (UNIQUE, NOT NULL, indexed)
username: String(255), nullable
phone: String(50), nullable
status: String(50), default 'ACTIVE'
created_at, updated_at: DateTime(timezone=True)
Relationships: employee_profile (1-to-1), employer_profile (1-to-1), documents (1-to-many).
2. employee_profiles Table (backend/modules/employees/models.py)
id: UUID (PK)
user_id: UUID (FK -> users.id, UNIQUE, ON DELETE CASCADE, NOT NULL)
first_name: String(100), NOT NULL
last_name: String(100), NOT NULL
bio: Text, nullable
location: String(100), nullable
availability_status: String(50), default 'AVAILABLE'
profile_completion: Integer, default 0
created_at, updated_at: DateTime(timezone=True)
Relationships: user (back_populates), employee_skills, experiences, educations.
3. skills & employee_skills Tables (backend/modules/employees/models.py)
skills:
id: UUID (PK)
name: String(100), UNIQUE, NOT NULL, indexed
category: String(100), nullable
employee_skills (Junction Table):
employee_id: UUID (FK -> employee_profiles.id, PK, ON DELETE CASCADE)
skill_id: UUID (FK -> skills.id, PK, ON DELETE CASCADE)
years_experience: Integer, default 0
4. employee_experiences Table (backend/modules/employees/models.py)
id: UUID (PK)
employee_id: UUID (FK -> employee_profiles.id, ON DELETE CASCADE, NOT NULL)
company_name: String(255), NOT NULL
position: String(255), NOT NULL
description: Text, nullable
start_date: Date, nullable
end_date: Date, nullable
5. employee_educations Table (backend/modules/employees/models.py)
id: UUID (PK)
employee_id: UUID (FK -> employee_profiles.id, ON DELETE CASCADE, NOT NULL)
institution: String(255), NOT NULL
qualification: String(255), NOT NULL
field: String(255), nullable
start_date: Date, nullable
end_date: Date, nullable
6. employer_profiles Table (backend/modules/employers/models.py)
id: UUID (PK)
user_id: UUID (FK -> users.id, UNIQUE, ON DELETE CASCADE, NOT NULL)
business_name: String(255), NOT NULL
business_type: String(100), NOT NULL
description: Text, nullable
phone: String(50), nullable
location: String(100), nullable
verification_status: String(50), default 'PENDING' (PENDING, UNDER_REVIEW, VERIFIED, REJECTED)
created_at, updated_at: DateTime(timezone=True)
7. documents Table (backend/modules/documents/models.py)
id: UUID (PK)
owner_user_id: UUID (FK -> users.id, ON DELETE CASCADE, NOT NULL)
document_type: String(50), NOT NULL (EMPLOYEE_CV, EMPLOYER_LICENSE, EMPLOYER_TIN)
storage_key: String(512), NOT NULL
original_filename: String(255), nullable
mime_type: String(100), nullable
file_size_bytes: BigInteger, nullable
verification_status: String(50), default 'PENDING' (PENDING, VERIFIED, REJECTED)
rejection_reason: Text, nullable
created_at: DateTime(timezone=True)