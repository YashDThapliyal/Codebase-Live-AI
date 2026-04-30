# API Contract

Base URL: `http://localhost:8000`

## GET /health
Response:
```json
{ "status": "ok" }
```

## POST /candidates
Create candidate.

Request:
```json
{
  "full_name": "Avery Chen",
  "email": "avery@example.com",
  "role_applied": "Backend Engineer"
}
```

## GET /candidates
List candidates.

## GET /candidates/{candidate_id}
Get one candidate by ID.

## POST /interviews/start
Start interview session.

Request:
```json
{
  "candidate_id": "cand_xxx",
  "resume_text": "optional raw resume text"
}
```

## POST /interviews/{session_id}/message
Submit candidate message and get next AI interviewer turn.

Request:
```json
{
  "message": "Candidate answer"
}
```

Response:
```json
{
  "message": "Next AI prompt",
  "phase": "technical_probe",
  "should_continue": true
}
```

## POST /interviews/{session_id}/end
Mark interview as completed.

## POST /grading/{session_id}
Generate mock structured scorecard for session.

## GET /admin/applicants
List applicant review objects (candidate + session + transcript + scorecard + notes).

## GET /admin/applicants/{candidate_id}
Get full review details for a candidate.
