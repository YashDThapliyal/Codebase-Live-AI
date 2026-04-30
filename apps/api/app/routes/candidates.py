import uuid

from fastapi import APIRouter, Depends, HTTPException

from app.db.client import get_db
from app.db.mock_db import now_iso
from app.middleware.auth import require_auth
from app.models.schemas import Candidate, CandidateCreateRequest

router = APIRouter()


@router.post("", response_model=Candidate)
def create_candidate(payload: CandidateCreateRequest, _user: dict = Depends(require_auth)):
  db = get_db()
  candidate = Candidate(
    id=f"cand_{uuid.uuid4().hex[:8]}",
    full_name=payload.full_name,
    email=payload.email,
    role_applied=payload.role_applied,
    created_at=now_iso(),
  )
  db.candidates[candidate.id] = candidate
  return candidate


@router.get("", response_model=list[Candidate])
def list_candidates(_user: dict = Depends(require_auth)):
  db = get_db()
  return list(db.candidates.values())


@router.get("/{candidate_id}", response_model=Candidate)
def get_candidate(candidate_id: str, _user: dict = Depends(require_auth)):
  db = get_db()
  candidate = db.candidates.get(candidate_id)
  if not candidate:
    raise HTTPException(status_code=404, detail="Candidate not found")
  return candidate
