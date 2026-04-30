# Next Steps

## Person 1 (AI Interview Engine) Next Tasks
- Tune phase-specific follow-up logic
- Add transcript-grounded evidence extraction for grader outputs
- Define deterministic rubric mapping in grader
- Draft Realtime API contract details for future phase

## Person 2 (Backend / Data / Supabase) Next Tasks
- Add seed endpoints for repeatable demo setup
- Implement repository layer abstraction over mock DB
- Harden request/response validation and error typing
- Prepare Supabase migration test workflow

## Person 3 (Product Integration / Admin Review / QA) Next Tasks
- Wire frontend to live API endpoints behind fallback-to-mock behavior
- Add admin filtering/search and session state indicators
- Define QA scripts for end-to-end candidate-to-admin flow
- Add integration test checklist per release candidate

## Integration Checklist
- Backend schemas match frontend TypeScript models
- Interview routes produce expected phase progression
- Grading output includes evidence text
- Admin views render transcript, scorecard, red flags, and notes

## Demo Checklist
- Candidate can move from login -> lobby -> interview -> completion
- Admin applicants table loads and sorts by match score
- Candidate detail displays transcript and scorecard evidence
- Mock flow works locally without Supabase or OpenAI credentials
