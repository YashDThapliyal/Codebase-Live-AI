from fastapi import APIRouter, Depends

from app.db.client import get_unit_of_work
from app.middleware.auth import require_auth
from app.models.schemas import Scorecard
from app.services.grading_flow import run_grading

router = APIRouter()


@router.post("/{session_id}", response_model=Scorecard)
def grade_session(session_id: str, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  return run_grading(uow, session_id)
