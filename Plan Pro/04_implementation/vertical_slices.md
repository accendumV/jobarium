# Vertical Slices (Canonical Build Units)

## Owns
- End-to-end implementation slices used for execution.
- Slice-level dependency order, scope, and Definition of Done.

## Excludes
- Calendar scheduling by week (see `sprint_plan.md`).
- Endpoint payload definitions (see `api_contracts.md`).

## Slice Rules
- Each slice must be user-outcome complete (UI + API + DB + events + tests).
- No horizontal-only work can be marked done as a slice.
- Do not start the next slice until current slice DoD passes.

## S1 - Candidate Account, Consent, and Builder Draft
- Goal: candidate can sign up, consent, start builder, and retain progress.
- Stories: `C-07`, `C-09` (partial), baseline for `C-01`
- Screens: `CAND-001`, `CAND-002`, `CAND-003`, `CAND-004`
- States: `candidate_profile_bootstrap: not_started -> manual_builder -> review_required`
- Endpoint IDs: `AUTH-001`, `AUTH-002`, `AUTH-003`, `CAND-001`, `CAND-006`, `CAND-007`, `CAND-005`
- Events: `profile.updated`
- Core tables: `app_user`, `user_role`, `consent_record`, `candidate_profile`, `candidate_preference`
- DoD:
  - Candidate can resume draft after refresh/re-login.
  - Matchability endpoint returns required/missing fields.
  - Contract tests for auth/consent/profile draft pass.

## S2 - Resume Upload, Parse, and Fallback Builder
- Goal: candidate can upload resume or recover via builder when parsing fails.
- Stories: `C-06`, `C-10`
- Screens: `CAND-003`, `CAND-004`, `SHARED-002`
- States: `not_started -> uploading -> parsing -> review_required|failed -> manual_builder`
- Endpoint IDs: `CAND-003`, `CAND-008`, `CAND-006`, `CAND-005`
- Events: `candidate.document.uploaded`, `candidate.document.parsed`, `profile.updated`
- Core tables: `candidate_document`, `document_parse_job`, `document_parse_result`, `candidate_profile`
- DoD:
  - `.pdf|.doc|.docx` accepted with validation and clear failures.
  - Parse retry works and is auditable.
  - Manual fallback path is one-click and non-destructive.

## S3 - Matchability Completion and Candidate Match Visibility
- Goal: candidate reaches matchable status and sees match list/invite context.
- Stories: `C-02`, `C-03`, `C-09`, `C-11`
- Screens: `CAND-004`, `CAND-005`, `CAND-006`
- States: `review_required -> ready`; invite state visibility `queued|sent|opened`
- Endpoint IDs: `CAND-002`, `CAND-004`, `CAND-005`, `INV-001`
- Events: `profile.updated`, `matching.shortlist.changed`, `invite.created`
- Core tables: `match_score`, `job_shortlist`, `invite`
- DoD:
  - Candidate sees up-to-date matchability and match list.
  - Invite transparency card includes role/company/pay/location/time estimate.
  - Ranking explainability snippet available on match cards.

## S4 - Employer Org/Job Setup and Automation Settings
- Goal: employer can create org, configure job, and activate automation.
- Stories: `E-01`, `E-02`, `E-03`
- Screens: `EMP-001`, `EMP-002`, `EMP-003`
- States: `job_posting: draft -> active`
- Endpoint IDs: `EMP-001`, `EMP-002`, `EMP-003`, `EMP-004`, `EMP-005`, `EMP-006`
- Events: `job.updated`
- Core tables: `organization`, `organization_member`, `job_posting`, `job_requirement`, `job_question_kit`, `job_question`
- DoD:
  - Job activation enforces required setup and valid question kit.
  - Draft autosave works in job wizard.
  - Automation guardrails persist and validate caps/cooldowns/expiry.

## S5 - Invite to Q&A Submission
- Goal: candidate receives invite, starts Q&A, autosaves, and submits.
- Stories: `C-03`, `C-04`, `C-05`
- Screens: `CAND-006`, `CAND-007`, `CAND-008`
- States: `invite: sent|opened|started|submitted`; `qa_session: created|in_progress|submitted`
- Endpoint IDs: `INV-001`, `QA-001`, `QA-002`, `QA-003`
- Events: `invite.created`, `qa.submitted`, `qa.authenticity.assessed`
- Core tables: `invite`, `invite_delivery`, `qa_session`, `qa_answer`, `qa_response_signal`, `qa_authenticity_assessment`
- DoD:
  - Q&A autosave survives network interruptions.
  - Submit enforces required answers and transitions state correctly.
  - Authenticity output is advisory-only and includes reason codes.

## S6 - Packet Delivery, Employer Review, and Decisioning + Hardening Gate
- Goal: packet is produced, reviewed, actioned; ops baseline is launch-ready.
- Stories: `E-04`, `E-05`, `E-06`, `A-01`, `A-02`
- Screens: `EMP-004`, `EMP-005`, `SHARED-002`, `ADMIN-001`
- States: `candidate_packet: building|ready|reviewed|actioned|failed`
- Endpoint IDs: `PKT-001`, `PKT-002`, `PKT-003`, `ADM-001`, `ADM-002`, `ADM-003`, `ADM-004`
- Events: `packet.ready`, `billing.usage.updated`
- Core tables: `candidate_packet`, `packet_action`, `usage_counter`, `audit_log`, `outbox_event`, `inbox_event`
- DoD:
  - Employer can action packet in one click with actor/audit trace.
  - DLQ/replay and GDPR operations are operational.
  - Launch criteria P0 readiness evidence is complete.

## Dependency Order
`S1 -> S2 -> S3 -> S4 -> S5 -> S6`

## Exit to Hardening
- All slice DoD checks passed in staging.
- Contract tests and migration checks green for all touched endpoints/tables.
- No unresolved blocker defects in P0 flows.
