import uuid

from fastapi import APIRouter, Depends, HTTPException

from app.db.client import get_unit_of_work
from app.middleware.auth import require_auth
from app.models.schemas import Candidate, CandidateCreateRequest
from app.utils.time import now_iso

router = APIRouter()


@router.post("", response_model=Candidate)
def create_candidate(payload: CandidateCreateRequest, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  candidate = Candidate(
    id=f"cand_{uuid.uuid4().hex[:8]}",
    full_name=payload.full_name,
    email=payload.email,
    role_applied=payload.role_applied,
    created_at=now_iso(),
  )
  uow.candidates.create(candidate)
  return candidate


@router.get("", response_model=list[Candidate])
def list_candidates(_user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  return uow.candidates.list_all()


@router.get("/{candidate_id}", response_model=Candidate)
def get_candidate(candidate_id: str, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  candidate = uow.candidates.get(candidate_id)
  if not candidate:
    raise HTTPException(status_code=404, detail="Candidate not found")
  return candidate
