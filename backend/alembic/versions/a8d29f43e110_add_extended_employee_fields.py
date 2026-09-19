"""add_extended_employee_fields

Revision ID: a8d29f43e110
Revises: 7f241cc280e8
Create Date: 2026-09-19 13:12:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8d29f43e110'
down_revision: Union[str, Sequence[str], None] = '7f241cc280e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to add 9 extended employee profile fields."""
    op.add_column('employee_profiles', sa.Column('email', sa.String(length=255), nullable=True))
    op.add_column('employee_profiles', sa.Column('phone', sa.String(length=50), nullable=True))
    op.add_column('employee_profiles', sa.Column('avatar_url', sa.String(length=500), nullable=True))
    op.add_column('employee_profiles', sa.Column('emergency_contact_name', sa.String(length=100), nullable=True))
    op.add_column('employee_profiles', sa.Column('emergency_contact_phone', sa.String(length=50), nullable=True))
    op.add_column('employee_profiles', sa.Column('current_job_title', sa.String(length=255), nullable=True))
    op.add_column('employee_profiles', sa.Column('years_experience', sa.String(length=50), nullable=True))
    op.add_column('employee_profiles', sa.Column('portfolio_url', sa.String(length=500), nullable=True))
    op.add_column('employee_profiles', sa.Column('cv_file_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('employee_profiles', 'cv_file_url')
    op.drop_column('employee_profiles', 'portfolio_url')
    op.drop_column('employee_profiles', 'years_experience')
    op.drop_column('employee_profiles', 'current_job_title')
    op.drop_column('employee_profiles', 'emergency_contact_phone')
    op.drop_column('employee_profiles', 'emergency_contact_name')
    op.drop_column('employee_profiles', 'avatar_url')
    op.drop_column('employee_profiles', 'phone')
    op.drop_column('employee_profiles', 'email')
