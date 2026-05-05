# API Contract

Base URL: `http://localhost:8000` (or `NEXT_PUBLIC_API_URL` from the web app)

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

Start an interview session for a candidate. Creates a session in **`lobby`** lifecycle (no AI line yet until `begin` or first message).

Request:

```json
{
  "candidate_id": "cand_xxx",
  "resume_text": "optional raw resume text"
}
```

Response: `InterviewSession` including `lifecycle_status`.

## POST /interviews/{session_id}/begin

Move **`lobby` → `active`** and append the first AI interviewer prompt (intro phase).

## GET /interviews/{session_id}

Return session metadata (phase, `lifecycle_status`, timestamps).

## GET /interviews/{session_id}/transcript

List `InterviewMessage` rows for the session (AI + candidate), in order.

## POST /interviews/{session_id}/message

Submit a candidate message. If the session is still in **`lobby`**, the server begins the session (same as `/begin`) and then records the answer.

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

Mark interview as **`completed`** (candidate finished). Required before grading.

## POST /grading/{session_id}

Run heuristic grading, persist `Scorecard`, set lifecycle to **`reviewed`**. Idempotent if a scorecard already exists.

## GET /admin/applicants

List applicant review objects: one row per candidate who has a session (latest session). `scorecard` may be **`null`** until grading has run.

## GET /admin/applicants/{candidate_id}

Full review detail for a candidate (latest session): candidate, session, transcript, optional scorecard, reviewer notes.

## Interview lifecycle (`InterviewSession.lifecycle_status`)

- `created` — reserved
- `lobby` — session started; opening prompt not yet committed (or use `/begin`)
- `active` — Q&A in progress
- `completed` — candidate ended; grading may be pending
- `grading` — transient while grading runs (sync in MVP)
- `reviewed` — scorecard stored and ready for human review

## POST /realtime/session

Create an ephemeral OpenAI Realtime session for browser WebRTC voice interview.

Behavior:

- Reads `OPENAI_API_KEY` from backend env
- Uses `OPENAI_REALTIME_MODEL` if provided, else defaults to a realtime-capable model string
- Injects interviewer instructions into session creation
- Returns OpenAI session JSON including ephemeral client secret
- If key is missing, returns:

```json
{ "error": "OPENAI_API_KEY is not configured" }
```

Voice is **progressive enhancement**; the primary MVP path is the text interview above.
