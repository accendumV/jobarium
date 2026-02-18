# User Stories (Implementation Contract)

## Owns
- Story inventory with implementation-grade acceptance criteria.
- Story-level traceability to slices, endpoints, and state machines.

## Excludes
- Sprint calendar sequencing (see `../04_implementation/sprint_plan.md`).
- Payload schemas (see `../04_implementation/api_contracts.md`).

## Story Format
- Story statement: `As <persona>, I want <capability>, so that <outcome>.`
- Traceability: `Slice`, `Endpoints`, `States`.
- Acceptance: Given/When/Then.
- Error/edge: minimum negative-path checks.

## Employer Stories (P0)

### E-01 Job setup from template
- Story: As an employer, I want to start from a role template, so that I can launch jobs quickly.
- Slice: `S4`
- Endpoints: `EMP-002`, `EMP-003`, `EMP-006`
- States: `job_posting: draft`
- Acceptance:
  - Given I select a template, when job draft is created, then requirements/question kit are prefilled and editable.
  - Given I edit draft fields, when autosave runs, then `draft_version` increments and data persists.
  - Given required fields are missing, when I attempt activation, then request is rejected.
- Error/edge:
  - unknown template id -> `404 NOT_FOUND`
  - invalid field value -> `400 VALIDATION_FAILED`

### E-02 Dealbreaker control
- Story: As an employer, I want hard dealbreakers, so that unqualified candidates are filtered early.
- Slice: `S4` then `S6` validation in packet
- Endpoints: `EMP-003`, `EMP-004`, `PKT-002`
- States: `job_posting: draft -> active`
- Acceptance:
  - Given dealbreakers are configured, when job activates, then dealbreakers are stored and versioned.
  - Given a candidate packet is generated, when employer opens packet, then dealbreaker outcomes are visible.
  - Given no dealbreakers configured, when activating where required policy applies, then activation is blocked.

### E-03 Automation guardrails
- Story: As an employer, I want caps/cooldowns/expiry controls, so that candidates are not spammed.
- Slice: `S4`, enforced in `S5`
- Endpoints: `EMP-005`, `INV-001`
- States: `invite: queued|sent|expired|cancelled`
- Acceptance:
  - Given automation settings are saved, when shortlist triggers invites, then daily cap and cooldown are enforced.
  - Given invite expiry is reached, when candidate has not started, then invite transitions to `expired`.
  - Given settings are invalid (negative or out-of-range), then save is rejected.

### E-04 Packet-first review
- Story: As an employer, I want packet-first inbox, so that I review only completed candidates.
- Slice: `S6`
- Endpoints: `PKT-001`, `PKT-002`
- States: `candidate_packet: ready|reviewed`
- Acceptance:
  - Given packets exist, when inbox loads, then default list shows completed packets ordered by `ready_at desc`.
  - Given packet opens, then summary, evidence snippets, and transcript are available.
  - Given packet build failed, then packet is excluded from ready list and surfaced via ops flow.

### E-05 One-click decisioning
- Story: As an employer, I want one-click packet actions, so that hiring cycle time is reduced.
- Slice: `S6`
- Endpoints: `PKT-003`
- States: `candidate_packet: reviewed -> actioned`
- Acceptance:
  - Given packet is reviewable, when I choose `interview|clarify|reject`, then action is stored with actor and timestamp.
  - Given action succeeds, then packet transitions to `actioned`.
  - Given unauthorized actor, action request is denied.

### E-06 Authenticity insight
- Story: As an employer, I want authenticity signals, so that I can verify candidate involvement.
- Slice: `S5` + `S6`
- Endpoints: `PKT-002`
- States: `qa_session: submitted`; `candidate_packet: ready`
- Acceptance:
  - Given Q&A is submitted, when packet is ready, then trust label + reason codes + confidence are displayed.
  - Given authenticity score is high-risk, then no automatic rejection is applied.
  - Given reason codes are unavailable, then packet shows neutral fallback message.

## Candidate Stories (P0)

### C-01 Fast profile bootstrap
- Story: As a candidate, I want profile bootstrap from CV or builder, so that I can become matchable quickly.
- Slice: `S1`, `S2`
- Endpoints: `CAND-003`, `CAND-006`, `CAND-007`
- States: `candidate_profile_bootstrap: not_started|uploading|parsing|manual_builder|review_required`
- Acceptance:
  - Given I upload a supported file, when parse completes, then core fields are prefilled for review.
  - Given I choose builder mode, when starter template is created, then required sections are initialized.
  - Given draft exists, when I return later, then previous progress is restored.

### C-02 Matchability guidance
- Story: As a candidate, I want high-impact missing field guidance, so that I know what to complete first.
- Slice: `S3`
- Endpoints: `CAND-005`, `CAND-002`
- States: `candidate_profile_bootstrap: review_required -> ready`
- Acceptance:
  - Given incomplete profile, when status is requested, then required and missing fields are returned.
  - Given required fields are completed, when status refreshes, then profile becomes `ready`.
  - Given required fields regress, then profile returns to non-ready status.

### C-03 Invite transparency
- Story: As a candidate, I want clear invite context, so that I can decide whether to proceed.
- Slice: `S3`, `S5`
- Endpoints: `INV-001`
- States: `invite: sent|opened|started|expired`
- Acceptance:
  - Given invite exists, when opened, then role/company/pay/location/time estimate are visible.
  - Given invite is expired, when candidate opens it, then start action is blocked with clear message.
  - Given candidate declines, invite is terminal for candidate flow.

### C-04 Mobile-first Q&A completion
- Story: As a candidate, I want mobile-friendly autosave Q&A, so that I can complete in short sessions.
- Slice: `S5`
- Endpoints: `QA-001`, `QA-002`, `QA-003`
- States: `qa_session: created -> in_progress -> submitted`
- Acceptance:
  - Given session started, when answers change, then autosave persists answers with server revision.
  - Given required answers are complete, when submit is triggered, then state becomes `submitted`.
  - Given network interruption, then unsaved-state indicator appears and recovery is possible.

### C-05 Fair authenticity policy
- Story: As a candidate, I want transparent authenticity policy, so that I understand acceptable assistance.
- Slice: `S5`
- Endpoints: `QA-003`, `PKT-002`
- States: `qa_session: in_progress|submitted`
- Acceptance:
  - Given pre-submit step, when candidate submits, then policy notice has been shown.
  - Given authenticity assessment flags risk, then human-review path remains available.
  - Given low-confidence assessment, result defaults to neutral/advisory handling.

## Early-Stage Candidate Stories (Resume Builder Path)

### C-06 Resume upload format support
- Story: As an early-stage candidate, I want PDF/DOC/DOCX upload, so that I avoid manual entry where possible.
- Slice: `S2`
- Endpoints: `CAND-003`, `CAND-008`
- States: `not_started -> uploading -> parsing -> review_required|failed`
- Acceptance:
  - Given file type is `pdf|doc|docx`, when upload starts, then request is accepted.
  - Given file type unsupported, then upload is rejected with clear reason.
  - Given parsing fails, then fallback path is presented.

### C-07 Start-from-zero resume builder
- Story: As an early-stage candidate without a resume, I want guided starter sections, so that I can build a profile from zero.
- Slice: `S1`
- Endpoints: `CAND-007`, `CAND-006`
- States: `not_started -> manual_builder -> review_required`
- Acceptance:
  - Given no resume path selected, when builder starts, then Summary/Experience/Education/Skills sections exist.
  - Given edits occur, autosave persists draft and updates timestamp.
  - Given page reload, draft is restored.

### C-08 Progressive prompts and examples
- Story: As an early-stage candidate, I want examples for high-impact fields, so that I can write better content confidently.
- Slice: `S3` (enhancement)
- Endpoints: `CAND-001`, `CAND-006`
- States: `manual_builder|review_required`
- Acceptance:
  - Given high-impact field is focused, when helper opens, then at least one contextual example is shown.
  - Given candidate ignores examples, submission remains allowed.
  - Given prompt copy update, existing candidate drafts remain unaffected.

### C-09 High-impact minimum set
- Story: As an early-stage candidate, I want minimum required fields shown, so that I can become matchable quickly.
- Slice: `S1`, `S3`
- Endpoints: `CAND-005`, `CAND-002`
- States: `review_required -> ready`
- Acceptance:
  - Given profile is incomplete, then missing required fields are link-navigable.
  - Given minimum set is complete, then status becomes `ready`.
  - Given one required field removed, then status reverts from `ready`.

### C-10 Manual fallback when parsing fails
- Story: As an early-stage candidate, I want one-click fallback to manual builder, so that parse failure does not block me.
- Slice: `S2`
- Endpoints: `CAND-008`, `CAND-007`, `CAND-006`
- States: `parsing -> failed -> manual_builder`
- Acceptance:
  - Given parse job fails, when candidate chooses fallback, then builder opens with partial extracted data when available.
  - Given fallback chosen, uploaded file remains linked for retry.
  - Given retry succeeds later, candidate can review suggested updates before applying.

### C-11 Education/portfolio-first support
- Story: As an early-stage candidate, I want project/course/certificate blocks, so that limited work history does not prevent matchability.
- Slice: `S3` (enhancement)
- Endpoints: `CAND-006`, `CAND-002`, `CAND-005`
- States: `manual_builder -> review_required -> ready`
- Acceptance:
  - Given no work-experience items, profile can still become ready if required non-experience fields are complete.
  - Given project/course/certificate data exists, matching signals include those blocks.
  - Given blocks are empty, required-field validator still behaves deterministically.

### C-12 Mobile draft completion
- Story: As an early-stage candidate, I want cross-session mobile draft completion, so that I can finish onboarding incrementally.
- Slice: `S1` then `S3` hardening
- Endpoints: `CAND-006`, `CAND-001`
- States: `uploading|manual_builder|review_required`
- Acceptance:
  - Given mobile session ends, when user returns, then latest draft is restored.
  - Given concurrent device edit conflict, then non-blocking merge notice appears.
  - Given autosave fails, unsaved indicator is visible and manual save is available.

## Ops/Admin Stories (P1)

### A-01 Failed-job observability and replay
- Story: As an admin, I want failed job visibility and replay, so that workflow failures are recoverable.
- Slice: `S6`
- Endpoints: `ADM-001`, `ADM-002`
- States: async failure/replay lifecycle
- Acceptance:
  - Failed parse/enrichment/authenticity jobs are filterable and replayable.
  - Replay action is audited with reason and actor.

### A-02 GDPR workflow
- Story: As an admin, I want export/delete workflows, so that compliance requests are fulfilled and auditable.
- Slice: `S6`
- Endpoints: `ADM-003`, `ADM-004`
- States: request queued -> processed
- Acceptance:
  - Export/delete requests are accepted asynchronously and tracked.
  - Only authorized roles can perform cross-user GDPR actions.

## Prioritization
- P0: `E-01..E-06`, `C-01..C-05`, `C-06`, `C-07`, `C-09`, `C-10`
- P1: `C-08`, `C-11`, `C-12`, `A-01`, `A-02`

## Story to Persona/JTBD Mapping (Explicit)

| Story ID | Primary Persona | JTBD ID |
|---|---|---|
| `E-01` | Persona 1 | `JTBD-P1-01` |
| `E-02` | Persona 1 | `JTBD-P1-02` |
| `E-03` | Persona 2 | `JTBD-P2-01` |
| `E-04` | Persona 2 | `JTBD-P2-01` |
| `E-05` | Persona 2 | `JTBD-P2-01` |
| `E-06` | Persona 2 | `JTBD-P2-02` |
| `C-01` | Persona 3 | `JTBD-P3-01` |
| `C-02` | Persona 3 | `JTBD-P3-01` |
| `C-03` | Persona 3 | `JTBD-P3-02` |
| `C-04` | Persona 5 | `JTBD-P5-02` |
| `C-05` | Persona 3 | `JTBD-P3-02` |
| `C-06` | Persona 7 | `JTBD-P7-01` |
| `C-07` | Persona 7 | `JTBD-P7-01` |
| `C-08` | Persona 7 | `JTBD-P7-02` |
| `C-09` | Persona 7 | `JTBD-P7-02` |
| `C-10` | Persona 7 | `JTBD-P7-01` |
| `C-11` | Persona 7 | `JTBD-P7-02` |
| `C-12` | Persona 5 | `JTBD-P5-02` |
| `A-01` | Persona 6 | `JTBD-P6-01` |
| `A-02` | Persona 6 | `JTBD-P6-02` |
