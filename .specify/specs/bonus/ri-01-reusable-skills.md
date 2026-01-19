# Bonus: Reusable Intelligence (Skills) - ri-01

## Goal
Add a small, reusable "skills" layer that the chat agent uses, without changing Phase III behavior.
This should be additive and safe, and clearly demonstrate reusable intelligence.

## Non-Negotiable Laws
- No DB/schema changes.
- No refactor of existing endpoints/tool behavior.
- Skills must be pure + reusable (small functions, deterministic outputs).
- Agent behavior must remain correct; skills only assist routing/prompting.

## Definition of "Reusable Intelligence"
A skill is a reusable module/function that can be imported and used by the agent (or other parts of the system)
to perform a common decision task (e.g., language routing, intent detection).

## Scope

### In Scope
- Create skills package:
  - `app/services/skills/language_router_skill.py`
  - `app/services/skills/task_intent_skill.py`
- Integrate skills into chat agent:
  - Language resolution for system prompt
  - Optional intent detection as a hint (must not break tool calling)
- Minimal proof that skills are used (code + demo)

### Out of Scope
- New tools/endpoints
- Major agent refactor
- New databases, queues, or deployments (Phase IV/V)

## Skill Interfaces (Contract)

### language_router_skill
- `resolve_language(preferred: str | None, message: str) -> str`
Rules:
- If preferred is "en" or "ur": return it
- Else, detect Urdu characters in message -> "ur"
- Else "en"

### task_intent_skill
- `detect_intent(message: str) -> str`
Returns one of:
- "add" | "list" | "update" | "complete" | "delete" | "unknown"

## Acceptance Criteria
1. Skills modules exist under `app/services/skills/` and are importable.
2. Chat agent calls `resolve_language(...)` and uses result to set response language.
3. (Optional) Agent calls `detect_intent(...)` for hinting only.
4. All existing Phase III behavior still works unchanged.
5. No DB/schema changes.

## Proof Checklist
- Screenshot: folder tree showing `app/services/skills/` and files
- Screenshot: code showing chat agent importing and calling skills
- Demo: show Urdu selection + a command; mention skills are reusable and used
