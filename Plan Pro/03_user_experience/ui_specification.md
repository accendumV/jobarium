# UI Specification (MVP)

## Owns
- Screen inventory, global state standards, and readiness gates.

## Excludes
- Product rationale (see `../01_product/*`).
- Backend transition rules (see `../02_architecture/state_machines.md`).

## P0 Screen Inventory
- `SHARED-000` Role intent selection.
- `CAND-001..011` Candidate account, consent, upload, matching, invite, Q&A, status, interview, offers.
- `EMP-001..005` Employer onboarding, job wizard, automation settings, packet inbox/detail.
- `SHARED-002` Error and retry surface.

## Global State Standard (All P0 Screens)
- Loading: clear progress affordance.
- Empty: actionable next step.
- Recoverable error: retry + preserved input where possible.
- Blocking error: support path and incident-safe message.
- Success feedback: explicit completion state.

## Global Draft and Autosave Policy (All Editable Flows)
- Autosave is required for all multi-step or high-input flows:
  - candidate profile/resume builder
  - employer job setup wizard
  - candidate Q&A session
- Autosave interval target: 5-10 seconds after last input change.
- Autosave conflict behavior:
  - latest revision wins for same device/session
  - conflicting concurrent edits show non-blocking merge/review notice
- UX requirements:
  - last-saved timestamp visible
  - clear unsaved-state indicator on network failure
  - manual "Save now" remains available as fallback

## Readiness Gate Per P0 Screen
- Data contract mapped to API endpoint.
- Loading/empty/error/success states implemented.
- Role access rules enforced in UI.
- Analytics events emitted.
- Accessibility baseline checked.
- Draft/autosave behavior implemented where screen allows input.
