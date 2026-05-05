from fastapi import APIRouter, HTTPException

from app.models.schemas import ApplicantDetail
from app.repositories.memory import get_unit_of_work
from app.services.applicant_queries import build_applicant_detail, list_applicant_summaries

router = APIRouter()


@router.get("/applicants", response_model=list[ApplicantDetail])
def list_applicants():
  uow = get_unit_of_work()
  return list_applicant_summaries(uow)


@router.get("/applicants/{candidate_id}", response_model=ApplicantDetail)
def get_applicant_detail(candidate_id: str):
  uow = get_unit_of_work()
  detail = build_applicant_detail(uow, candidate_id)
  if not detail:
    raise HTTPException(status_code=404, detail="Applicant not found")
  return detail
