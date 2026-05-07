from fastapi import APIRouter, Depends, HTTPException

from app.db.client import get_unit_of_work
from app.middleware.auth import require_admin
from app.models.schemas import ApplicantDetail
from app.services.applicant_queries import build_applicant_detail, list_applicant_summaries

router = APIRouter()


@router.get("/applicants", response_model=list[ApplicantDetail])
def list_applicants(_user: dict = Depends(require_admin)):
  uow = get_unit_of_work()
  return list_applicant_summaries(uow)


@router.get("/applicants/{candidate_id}", response_model=ApplicantDetail)
def get_applicant_detail(candidate_id: str, _user: dict = Depends(require_admin)):
  uow = get_unit_of_work()
  detail = build_applicant_detail(uow, candidate_id)
  if not detail:
    raise HTTPException(status_code=404, detail="Applicant not found")
  return detail
