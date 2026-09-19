"""add_extended_employer_fields

Revision ID: b9e30a54f221
Revises: a8d29f43e110
Create Date: 2026-09-19 13:46:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b9e30a54f221'
down_revision: Union[str, Sequence[str], None] = 'a8d29f43e110'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to add 5 extended employer profile fields."""
    op.add_column('employer_profiles', sa.Column('registration_number', sa.String(length=100), nullable=True))
    op.add_column('employer_profiles', sa.Column('official_email', sa.String(length=255), nullable=True))
    op.add_column('employer_profiles', sa.Column('website_url', sa.String(length=500), nullable=True))
    op.add_column('employer_profiles', sa.Column('tax_id', sa.String(length=100), nullable=True))
    op.add_column('employer_profiles', sa.Column('registration_date', sa.String(length=100), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('employer_profiles', 'registration_date')
    op.drop_column('employer_profiles', 'tax_id')
    op.drop_column('employer_profiles', 'website_url')
    op.drop_column('employer_profiles', 'official_email')
    op.drop_column('employer_profiles', 'registration_number')
