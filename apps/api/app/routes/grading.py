from fastapi import APIRouter

from app.models.schemas import Scorecard
from app.repositories.memory import get_unit_of_work
from app.services.grading_flow import run_grading

router = APIRouter()


@router.post("/{session_id}", response_model=Scorecard)
def grade_session(session_id: str):
  uow = get_unit_of_work()
  return run_grading(uow, session_id)
