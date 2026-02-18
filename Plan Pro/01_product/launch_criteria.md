# Launch Criteria (Go/No-Go)

## Owns
- MVP launch gates and sign-off rules.

## Excludes
- Incident procedures (see `../05_operations/incident_response.md`).
- Test implementation detail (see `../04_implementation/test_strategy.md`).

## Slice Completion Gates (P0)
- All slices `S1..S6` from `../04_implementation/vertical_slices.md` are complete in staging.
- Each slice passed its own DoD without open blocker defects.
- No new scope added inside in-flight slice without explicit approval.

## Product Flow Gates (P0)
- Candidate path works end-to-end: sign-up -> consent -> profile bootstrap -> invite -> Q&A -> confirmation.
- Employer path works end-to-end: org setup -> job setup -> automation -> packet review -> action.
- Candidate supports both entry modes:
  - resume upload (`pdf|doc|docx`)
  - no-resume builder from zero
- Packet-first inbox is default.
- Dealbreaker outcomes are visible in packet.
- Authenticity is advisory only (no auto-reject).
- Autosave is active for:
  - candidate profile builder
  - employer job setup wizard
  - Q&A session

## Quality Gates (P0)
- No known blocker defects in candidate/employer P0 flows.
- Parse failures degrade to manual entry path.
- Packet build retry path works and failures are observable.
- Required story coverage:
  - all `P0` stories in `../01_product/user_stories.md`
  - all `Priority=P0` tests in `../04_implementation/test_case_matrix.md` pass.

## Security/Compliance Gates (P0)
- OWASP baseline controls in place.
- Consent/export/delete/retention workflows functioning.
- Sensitive/admin actions audited.
- Cross-tenant access checks validated for all admin and employer endpoints.

## Operational Gates (P0)
- On-call and severity matrix active.
- Alerting active for API 5xx spike, parse failure spike, invite dispatch failure, packet build delay/failure.
- DLQ inspection + replay validated in staging.
- Operational rehearsal completed for at least:
  - parse failure spike
  - invite dispatch failure
  - packet build delay/failure

## Data/SLO Gates (P0)
- Core events emitted and consumable.
- Dashboards available for time-to-first-packet, invite->completion, packet->interview-action.
- Initial SLO targets met:
  - parse p95 < 3m
  - match refresh p95 < 10m
  - invite dispatch p95 < 2m
  - packet build p95 < 90s

## Contract Consistency Gates (P0)
- Story IDs, endpoint IDs, state transitions, and slice IDs are consistent across:
  - `../01_product/user_stories.md`
  - `../04_implementation/api_contracts.md`
  - `../02_architecture/state_machines.md`
  - `../04_implementation/vertical_slices.md`
- No unresolved naming drift in critical entities or endpoint IDs.

## Decision Process
- Outcomes: `go`, `go_with_exceptions`, `no_go`
- `go_with_exceptions` requires owner, due date, and risk note in `../00_navigation/decisions_log.md`.
- All launch gate statuses and proof links must be recorded in `../05_operations/readiness_evidence.md`.
