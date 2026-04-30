# Realtime Plan

## Current MVP Voice Architecture

The current MVP introduces browser-based voice interview support using OpenAI Realtime API with WebRTC.

Flow:
1. Browser requests ephemeral realtime session from backend via `POST /realtime/session`
2. Backend uses server-side `OPENAI_API_KEY` to mint ephemeral session
3. Browser receives ephemeral client secret (never receives real API key)
4. Browser creates `RTCPeerConnection`, adds local mic track, opens data channel
5. Browser performs SDP exchange with OpenAI Realtime endpoint
6. Remote AI audio is played locally in browser
7. Realtime events/transcript snippets are shown in local UI panel first

## Turn Detection Tuning

- We use `server_vad` turn detection for interview audio turns.
- `silence_duration_ms` is set to `1000` ms by default.
- This prevents the AI from responding too aggressively during short candidate pauses.
- Recommended tuning range is `900-1600` ms depending on interview pacing.

## Security and Scope

- No `OPENAI_API_KEY` is exposed to frontend
- Voice only (no camera/video)
- No custom backend WebSocket relay in this MVP
- Text interview remains fallback if realtime setup fails or key is missing

## Next Work (Later)

- Persist transcript to Supabase
- Connect transcript output to grading pipeline
- Improve reconnect/resume behavior and partial turn recovery
- Add analytics + monitoring for realtime quality
