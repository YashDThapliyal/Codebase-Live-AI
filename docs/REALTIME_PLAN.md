# Realtime Plan (Future)

## Goal
Add voice-to-voice interview support using OpenAI Realtime APIs after text MVP stabilizes.

## Planned Workstreams

1. WebSocket session creation and token flow
2. Audio input streaming and output playback
3. Voice activity detection and turn boundaries
4. Transcript event handling + persistence
5. Reconnect/resume behavior during unstable networks

## Constraints

- Do not block text MVP milestones
- Keep feature-flagged until reliability criteria are met
