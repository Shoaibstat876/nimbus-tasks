# Bonus: Urdu Multi-Language Support (Chatbot) - ur-01

## Goal
Add a language toggle (EN/UR) that makes the chatbot respond in Urdu when UR is selected, without breaking Phase III behavior.

## Non-Negotiable Laws
- No DB/schema changes.
- No refactor of existing endpoints or owner-only rules.
- Tool behavior must remain identical; only the response language changes.
- Must remain spec-driven and evidence-backed.

## User Story
As a user, I can select Urdu mode and then chat naturally, receiving responses in Urdu while the bot still manages my tasks correctly via MCP tools.

## Scope

### In Scope
- Frontend: EN/UR toggle saved in localStorage (key: `nimbus.language`)
- Frontend: Send selected language with chat request (preferred: `language: "en" | "ur"`)
- Backend: Agent system instruction routes response language based on selected language
- Evidence: screenshots + short demo script

### Out of Scope
- Full UI translation of the entire site (only minimal labels OK)
- Voice input
- Streaming responses
- Any DB migration

## Acceptance Criteria
1. Language toggle exists on chat UI and persists across refresh.
2. When language=UR:
   - The assistant replies in Urdu.
   - Task operations still work (add/list/update/complete/delete).
3. When language=EN:
   - Behavior matches current Phase III.
4. No DB/schema changes were made.

## Implementation Notes
- Preferred API method: include `language` in chat request JSON.
- If `language` is missing/invalid: fallback to English.
- Agent prompt must instruct: Respond in Urdu but keep tool calls unchanged.

## Proof Checklist
- Terminal: git branch --show-current shows phase3-bonus
- Screenshot: chat UI showing language toggle set to UR
- Screenshot: Urdu assistant reply after a task operation request
- Screenshot: tasks page showing the result
- Screenshot: code showing language passed frontend -> backend
- Demo (<=90 sec): EN -> UR toggle -> Urdu command -> Urdu response -> tasks list
