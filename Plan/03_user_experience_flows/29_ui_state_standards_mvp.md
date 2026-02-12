# Jobarium UI State Standards (MVP)

## Purpose
Define mandatory UX behavior for loading, empty, error, and success states across all P0 screens.

This closes item 29 in the system completeness gate.

## Scope
- Candidate portal
- Employer portal
- Shared components

## Global Standard
Every P0 screen must implement these states:
1. `loading`
2. `empty`
3. `error_recoverable`
4. `error_blocking`
5. `success_feedback`

## 1) Loading State Standard
- Show skeleton or spinner within 200ms if content not ready.
- Preserve page structure to prevent layout shift.
- Include contextual label:
  - "Loading invite details..."
  - "Preparing your packet..."

## 2) Empty State Standard
- Explain why data is empty.
- Provide one clear next action.
- Example patterns:
  - candidate timeline: "No active invites yet."
  - employer inbox: "No completed packets yet."

## 3) Recoverable Error State Standard
- User can retry without leaving screen.
- Show concise message + retry button.
- If action was idempotent, indicate safe retry.
- Example:
  - "We couldn't load your packet. Please retry."

## 4) Blocking Error State Standard
- Used only when user cannot proceed meaningfully.
- Provide support path and reference id.
- Example:
  - "This invite has expired. Request a new invite if available."

## 5) Success Feedback Standard
- Show confirmation for mutations:
  - profile saved
  - Q&A submitted
  - packet action recorded
- Use transient toast + persistent confirmation where needed.

## State UX Copy Guidelines
- Be specific, not generic ("Failed").
- Avoid blaming language.
- Always suggest the next step.
- Keep messages short (< 140 chars preferred).

## Technical/Design Requirements
- Each state must be represented in component library stories.
- Each P0 screen test plan must include state coverage.
- Analytics events required:
  - `ui_error_shown`
  - `ui_retry_clicked`
  - `ui_empty_state_viewed`
  - `ui_success_feedback_shown`

## Candidate-Specific Standards
- Mobile-first readability for all state messages.
- Preserve draft data when recoverable errors occur.
- Do not lose Q&A input on transient failures.

## Employer-Specific Standards
- Keep decision actions disabled until required data is loaded.
- If packet summary unavailable, allow transcript fallback with clear notice.

## Accessibility Requirements
- Error and success messages must be screen-reader announced.
- Actionable controls must be keyboard reachable.
- Color is never the only signal; include icon/text labels.

## Verification Checklist
- [ ] All P0 screens have 5 required states.
- [ ] Retry behavior tested for recoverable failures.
- [ ] Blocking errors include support path/reference id.
- [ ] Candidate draft-preservation validated for Q&A.
