import uuid
from datetime import date
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from infrastructure.database.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from modules.users.models import User


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
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    availability_status: Mapped[str] = mapped_column(
        String(50), default="AVAILABLE", nullable=False
    )
    profile_completion: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="employee_profile")
    employee_skills: Mapped[List["EmployeeSkill"]] = relationship(
        "EmployeeSkill", back_populates="employee", cascade="all, delete-orphan"
    )
    experiences: Mapped[List["EmployeeExperience"]] = relationship(
        "EmployeeExperience", back_populates="employee", cascade="all, delete-orphan"
    )
    educations: Mapped[List["EmployeeEducation"]] = relationship(
        "EmployeeEducation", back_populates="employee", cascade="all, delete-orphan"
    )


class Skill(Base, UUIDMixin):
    """Predefined skills directory entity."""
    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    employee_skills: Mapped[List["EmployeeSkill"]] = relationship(
        "EmployeeSkill", back_populates="skill", cascade="all, delete-orphan"
    )


class EmployeeSkill(Base):
    """Junction table mapping Employee Profiles to Skills with years of experience."""
    __tablename__ = "employee_skills"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employee_profiles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    )
    years_experience: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    employee: Mapped["EmployeeProfile"] = relationship(
        "EmployeeProfile", back_populates="employee_skills"
    )
    skill: Mapped["Skill"] = relationship("Skill", back_populates="employee_skills")


class EmployeeExperience(Base, UUIDMixin):
    """Candidate work experience history entry."""
    __tablename__ = "employee_experiences"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employee_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    position: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Relationships
    employee: Mapped["EmployeeProfile"] = relationship(
        "EmployeeProfile", back_populates="experiences"
    )


class EmployeeEducation(Base, UUIDMixin):
    """Candidate educational qualification entry."""
    __tablename__ = "employee_educations"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employee_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    institution: Mapped[str] = mapped_column(String(255), nullable=False)
    qualification: Mapped[str] = mapped_column(String(255), nullable=False)
    field: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Relationships
    employee: Mapped["EmployeeProfile"] = relationship(
        "EmployeeProfile", back_populates="educations"
    )
