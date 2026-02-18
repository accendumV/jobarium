# Lifecycle State Machines (v1)

## Owns
- Valid states, transitions, guards, and invariants for core lifecycle entities.

## Excludes
- UI copy for state rendering (see `../03_user_experience/ui_specification.md`).
- Alerting policies (see `../05_operations/incident_response.md`).

## Global Rules
- Invalid transitions are rejected and audited.
- Transition side effects are idempotent.
- Async transition handlers use idempotency keys.

## Entities and States
- `candidate_profile_bootstrap`: `not_started|uploading|parsing|review_required|manual_builder|ready|failed`
- `job_posting`: `draft|active|paused|closed|archived`
- `invite`: `queued|sent|opened|started|submitted|expired|cancelled|failed`
- `qa_session`: `created|in_progress|submitted|expired|abandoned`
- `candidate_packet`: `building|ready|reviewed|actioned|superseded|failed`

## Candidate Profile Bootstrap Rules
- `not_started -> uploading` when candidate selects file upload.
- `uploading -> parsing` when upload finalizes successfully.
- `parsing -> review_required` when parse succeeds with confirmation-needed fields.
- `parsing -> manual_builder` when parse fails or candidate chooses builder-first path.
- `manual_builder -> review_required` when required fields become complete.
- `review_required -> ready` when high-impact required fields are confirmed.
- `parsing -> failed` when parser permanently fails and fallback is unavailable.
- `failed -> manual_builder` on explicit retry/fallback to manual builder.

## Cross-Entity Invariants
- Q&A session must map to an invite.
- Packet cannot be `ready` unless linked Q&A is `submitted`.
- Closing a job resolves all non-terminal invites.
- Candidate/job pair has one active packet unless superseded policy applies.

## Stable Error Codes
- `INVALID_STATE_TRANSITION`
- `GUARD_CONDITION_FAILED`
- `ENTITY_TERMINAL_STATE`
