"""Central database models registry for Alembic metadata auto-discovery."""
from infrastructure.database.base import Base
from modules.users.models import User
from modules.employees.models import (
    EmployeeProfile,
    Skill,
    EmployeeSkill,
    EmployeeExperience,
    EmployeeEducation,
)
from modules.employers.models import EmployerProfile
from modules.documents.models import Document

__all__ = [
    "Base",
    "User",
    "EmployeeProfile",
    "Skill",
    "EmployeeSkill",
    "EmployeeExperience",
    "EmployeeEducation",
    "EmployerProfile",
    "Document",
]
