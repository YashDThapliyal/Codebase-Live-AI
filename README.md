# Codebase Live-Screen

## Project Overview

**Codebase Live-Screen** is a Mercor-style AI interview portal for Codebase applicants. The goal is to create a natural, voice-to-voice interview experience where an AI interviewer can evaluate a candidate’s technical depth, project ownership, problem-solving ability, communication style, and fit with Codebase’s mission.

The platform currently includes a **Next.js frontend**, a **FastAPI backend**, and an implemented **OpenAI Realtime voice interview MVP** using WebRTC. The product is currently mock-first in several areas, but the core realtime voice path is functional: the browser can connect to the OpenAI Realtime API through backend-minted ephemeral credentials, conduct a live voice session, and display session/debug information in the frontend.

The current project state is best described as:

> A polished mock-first interview platform with a real realtime voice interview MVP.  
> The next phase is persistence, live data wiring, auth, resume ingestion, and production hardening.

---

## TODOs

### Completed

- [x] Created a clean monorepo structure
  - `apps/web` for the frontend
  - `apps/api` for the backend
  - `supabase/migrations` for database schema scaffolding
  - `docs` for project documentation

- [x] Built the FastAPI backend foundation
  - Added app bootstrap and route registration
  - Added CORS support for local frontend development
  - Added backend configuration through environment variables
  - Added shared schema models for candidates, sessions, messages, scorecards, notes, and resume summaries

- [x] Added mock in-memory backend data layer
  - Created mock dictionaries for candidates
  - Created mock interview sessions
  - Created mock messages
  - Created mock scorecards
  - Created mock reviewer notes

- [x] Implemented core backend API route scaffolding
  - Candidate create/list/get endpoints
  - Interview start/message/end endpoints
  - Grading endpoint
  - Admin applicant detail/list endpoints
  - Realtime voice endpoints

- [x] Implemented OpenAI Realtime session creation
  - Added backend endpoint to mint ephemeral OpenAI Realtime client secrets
  - Avoided exposing the real OpenAI API key to the browser
  - Added model fallback handling for realtime session creation

- [x] Implemented realtime voice interview MVP
  - Browser microphone access
  - WebRTC peer connection setup
  - Realtime data channel setup
  - Direct SDP exchange with OpenAI Realtime API
  - Backend SDP relay fallback
  - Live voice interaction with the AI interviewer

- [x] Added realtime voice session state handling
  - Idle state
  - Connecting state
  - Live state
  - Error state
  - Ended state

- [x] Added frontend realtime debugging support
  - Debug tab in interview UI
  - Frontend error capture
  - Backend `/realtime/debug-log` endpoint
  - Debug payload forwarding from frontend to backend

- [x] Added language-aware interview support
  - Candidate language selector
  - Preferred language passed into realtime session creation
  - Language-specific instructions included in realtime session setup

- [x] Added configurable VAD tuning
  - `REALTIME_VAD_THRESHOLD`
  - `REALTIME_VAD_PREFIX_PADDING_MS`
  - `REALTIME_VAD_SILENCE_DURATION_MS`
  - Injected VAD settings into realtime session configuration

- [x] Built candidate-facing frontend flow
  - Candidate login page
  - Candidate lobby page
  - Candidate interview page
  - Candidate completion page

- [x] Built polished voice interview UI
  - Microphone permission flow
  - Live connection status
  - AI speaking/listening/thinking states
  - Conversation display
  - Debug display
  - Voice failure handling

- [x] Built text interview fallback UI
  - Text-based interview component
  - Mock transcript display
  - Candidate input box
  - Fallback path when voice is unavailable

- [x] Built admin review UI
  - Applicant list page
  - Candidate detail page
  - Transcript component
  - Scorecard component
  - Reviewer notes component
  - Red flags component

- [x] Added polished shared UI components
  - Card component
  - Button component
  - AI orb component
  - Step indicator component
  - Admin display components

- [x] Added mock frontend data
  - Mock candidates
  - Mock transcripts
  - Mock scorecards
  - Mock red flags
  - Mock reviewer notes

- [x] Added mock interview intelligence layer
  - Basic interview phase controller
  - Phase progression logic
  - Mock interviewer questions by phase
  - Short-answer follow-up logic
  - Mock grader output
  - Mock resume summary

- [x] Added Supabase database scaffolding
  - Initial schema migration
  - RLS migration scaffold
  - Scorecard migration scaffold

- [x] Added documentation scaffolding
  - Project specification
  - Team split documentation
  - API contract documentation
  - Realtime planning documentation

---

## Open TODOs — Need to Have

- [ ] Wire frontend candidate flow to real backend data
  - Replace remaining mock-only candidate flow behavior
  - Create real interview sessions through the backend
  - Fetch real interview/session state from the API
  - Handle session lifecycle from backend state

- [ ] Connect backend runtime to Supabase
  - Replace in-memory mock database with Supabase queries
  - Persist candidates
  - Persist interview sessions
  - Persist messages/transcripts
  - Persist scorecards
  - Persist reviewer notes

- [ ] Persist realtime voice transcripts
  - Capture user speech transcript events
  - Capture assistant response transcript events
  - Normalize realtime events into the `InterviewMessage` schema
  - Send transcript messages to backend
  - Store transcript messages in Supabase

- [ ] Connect admin UI to live backend data
  - Replace frontend `mockData` usage in admin pages
  - Fetch applicant list from backend
  - Fetch candidate detail from backend
  - Fetch transcript from backend
  - Fetch scorecard from backend
  - Fetch reviewer notes/red flags from backend

- [ ] Implement real candidate authentication/session management
  - Replace UI-only login
  - Add candidate identity tracking
  - Add secure interview session links or candidate codes
  - Prevent candidates from accessing other candidates’ interviews

- [ ] Implement admin authentication
  - Add protected admin login
  - Restrict access to applicant dashboard
  - Restrict access to transcripts, scorecards, and notes

- [ ] Implement real resume upload
  - Upload resume file from frontend
  - Store resume file in Supabase Storage or equivalent
  - Associate resume file with candidate record
  - Validate supported file types

- [ ] Implement real resume parsing
  - Extract text from PDF/DOCX resumes
  - Generate structured resume summary
  - Store parsed resume summary
  - Feed resume summary into interview instructions

- [ ] Replace mock interviewer logic with real LLM-driven logic
  - Use candidate resume context
  - Ask project-specific follow-up questions
  - Probe technical depth
  - Probe ownership and decision-making
  - Maintain interview phase/state

- [ ] Replace mock grading with real grading pipeline
  - Use final transcript and resume summary
  - Generate structured scorecard
  - Include evidence snippets from transcript
  - Generate red flags
  - Generate strengths
  - Generate final recommendation
  - Persist grading output to Supabase

- [ ] Add deterministic interview ending policy
  - Define required phases
  - Define minimum/maximum interview length
  - Define stop conditions
  - Ensure voice sessions end cleanly
  - Ensure partial sessions are saved

- [ ] Harden realtime voice reliability
  - Improve reconnect behavior
  - Handle failed WebRTC setup more gracefully
  - Handle OpenAI session creation failures
  - Handle mic permission denial
  - Handle dropped sessions
  - Save partial transcript on failure

- [ ] Update README/docs to match current implementation
  - Remove outdated claim that realtime voice is deferred/scaffold-only
  - Document that realtime voice MVP is implemented
  - Clearly mark persistence, auth, and grading as remaining work

- [ ] Add environment variable documentation
  - `OPENAI_API_KEY`
  - `OPENAI_REALTIME_MODEL`
  - `REALTIME_VAD_THRESHOLD`
  - `REALTIME_VAD_PREFIX_PADDING_MS`
  - `REALTIME_VAD_SILENCE_DURATION_MS`
  - Supabase URL/key variables once runtime integration is added

- [ ] Add local development setup instructions
  - Backend setup
  - Frontend setup
  - Environment variables
  - Running both services locally
  - Testing realtime voice locally

---

## Open TODOs — Nice to Haves

- [ ] Add recruiter/admin analytics dashboard
  - Candidate funnel view
  - Average interview scores
  - Strong signal candidates
  - Red flag summary
  - Interview completion rate

- [ ] Add richer scorecard visualizations
  - Radar chart for evaluation dimensions
  - Timeline of interview phases
  - Evidence-linked scoring
  - Confidence indicators

- [ ] Add interview playback support
  - Store audio recordings if allowed
  - Replay candidate responses
  - Jump from scorecard evidence to transcript/audio timestamp

- [ ] Add better candidate onboarding
  - Interview instructions page
  - Mic test page
  - Sample question
  - Expected duration
  - Privacy notice

- [ ] Add interviewer persona configuration
  - Codebase-specific interviewer behavior
  - Technical depth level
  - More friendly vs more rigorous modes
  - Role-specific interviews

- [ ] Add role-specific question banks
  - Frontend engineer track
  - Backend engineer track
  - Full-stack track
  - AI/ML track
  - Product/design track

- [ ] Add structured rubric editor
  - Admin-editable evaluation criteria
  - Weighting per category
  - Custom Codebase fit dimensions
  - Versioned rubrics

- [ ] Add better transcript tooling
  - Search transcript
  - Filter by interview phase
  - Highlight strong/weak answers
  - Add inline reviewer comments

- [ ] Add candidate email notifications
  - Interview invitation email
  - Reminder email
  - Completion confirmation
  - Admin notification after completion

- [ ] Add calendar/scheduling support
  - Interview availability windows
  - Deadline reminders
  - Admin scheduling dashboard

- [ ] Add multi-language polish
  - More robust language-specific prompts
  - Localized candidate UI text
  - Language-specific grading caveats

- [ ] Add observability
  - Structured backend logs
  - Request tracing
  - Realtime session logs
  - Error dashboard
  - Metrics for connection failures and session duration

- [ ] Add automated tests
  - Backend route tests
  - Realtime session creation tests
  - Interview state machine tests
  - Grading schema validation tests
  - Frontend component tests

- [ ] Add CI/CD
  - Lint frontend
  - Type-check frontend
  - Test backend
  - Build frontend
  - Validate migrations

- [ ] Add deployment setup
  - Frontend deployment
  - Backend deployment
  - Supabase production configuration
  - Environment variable management
  - Production CORS configuration

- [ ] Add security hardening
  - Rate limiting
  - Input validation
  - File upload scanning
  - Admin role permissions
  - Safer debug log handling

- [ ] Add candidate experience polish
  - Better loading animations
  - Better end-of-interview transition
  - Clearer error recovery
  - Better mobile responsiveness
  - Accessibility improvements

- [ ] Add export functionality
  - Export transcript as PDF/CSV
  - Export scorecard as PDF
  - Export candidate package for reviewers
