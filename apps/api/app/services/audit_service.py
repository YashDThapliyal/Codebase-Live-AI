import uuid

from app.models.schemas import AuditLogEntry
from app.repositories.memory import InMemoryUnitOfWork
from app.utils.time import now_iso


def log_audit(
  uow: InMemoryUnitOfWork,
  *,
  action: str,
  entity_type: str,
  entity_id: str,
  detail: str | None = None,
) -> AuditLogEntry:
  entry = AuditLogEntry(
    id=f"aud_{uuid.uuid4().hex[:10]}",
    action=action,
    entity_type=entity_type,
    entity_id=entity_id,
    created_at=now_iso(),
    detail=detail,
  )
  return uow.audit_logs.append(entry)
