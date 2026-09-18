from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from infrastructure.database.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from modules.employees.models import EmployeeProfile
    from modules.employers.models import EmployerProfile
    from modules.documents.models import Document


class User(Base, UUIDMixin, TimestampMixin):
    """User entity representing Telegram identity and account status."""
    __tablename__ = "users"

    telegram_user_id: Mapped[int] = mapped_column(
        BigInteger, unique=True, nullable=False, index=True
    )
    username: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    role:Mapped[str]=mapped_column(String(50),nullable=False,default="Employee")
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)
    
    # Relationships
    employee_profile: Mapped[Optional["EmployeeProfile"]] = relationship(
        "EmployeeProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    employer_profile: Mapped[Optional["EmployerProfile"]] = relationship(
        "EmployerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    documents: Mapped[List["Document"]] = relationship(
        "Document", back_populates="owner", cascade="all, delete-orphan"
    )
