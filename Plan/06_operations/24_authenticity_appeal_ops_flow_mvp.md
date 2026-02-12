# Jobarium Authenticity Appeal Operations Flow (MVP)

## Purpose
Define end-to-end operations workflow for candidate appeals on authenticity assessments.

This closes item 24 in the system completeness gate.

## Policy Baseline
- Authenticity labels are advisory for employers in MVP.
- No automatic rejection based solely on authenticity score.
- Candidates can submit appeal requests for flagged sessions.

## Actors
- Candidate (appeal submitter)
- Platform admin reviewer
- CTO (technical escalation)
- Employer reviewer (receives status updates, not raw internals)

## Appeal Lifecycle States
- `submitted`
- `in_review`
- `resolved_upheld` (original label kept)
- `resolved_adjusted` (label corrected/downgraded)
- `closed`

## Workflow
1. Candidate submits appeal with context.
2. System creates `appeal_case_id` and sets status `submitted`.
3. Admin triage sets `in_review`.
4. Reviewer inspects:
   - confidence score,
   - reason codes,
   - telemetry completeness,
   - parser/session anomalies.
5. Reviewer decides:
   - uphold label, or
   - adjust label + reason.
6. Candidate and employer receive outcome notification.
7. Case transitions to `closed`.

## SLA Targets
- Acknowledge appeal: within 24 hours.
- Initial review outcome: within 3 business days.
- Escalated technical review: within 5 business days.

## Decision Criteria
- Downgrade/adjust if:
  - low confidence,
  - missing/incomplete telemetry,
  - detected pipeline anomaly,
  - clear mismatch between reason codes and observed behavior.
- Uphold if:
  - high confidence and consistent multi-signal evidence.

## Employer Communication Rule
- During active appeal:
  - packet shows "authenticity under review" marker.
- On resolved adjustment:
  - update badge and reason codes in packet view.

## Audit and Compliance
- Every appeal action is audit logged:
  - reviewer id
  - decision
  - rationale
  - timestamps
- Keep appeal records per retention policy.

## Required Admin UI Capabilities
- list/filter appeals by status/date/confidence
- open case detail with linked session and signals
- apply outcome (`uphold`/`adjust`) with required reason note
- trigger candidate/employer notification

## Metrics
- appeal volume per 100 submitted Q&A sessions
- appeal uphold vs adjust rate
- median time to resolve
- repeat appeals for same role/company
