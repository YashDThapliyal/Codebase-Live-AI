"""Database access: in-memory unit of work by default; swap for Supabase-backed UoW later."""

from app.repositories.memory import get_unit_of_work

__all__ = ["get_unit_of_work"]
