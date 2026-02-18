# Readiness Evidence (Launch Gates)

## Owns
- Pass/fail evidence for launch gates defined in `../01_product/launch_criteria.md`.

## Excludes
- Gate definitions themselves (see launch criteria).

## Evidence Rules
- Every P0 gate must include explicit status and evidence link.
- `go_with_exceptions` requires linked decision entry in `../00_navigation/decisions_log.md`.
- Evidence links can point to CI runs, dashboards, reports, runbooks, or test artifacts.

## Gate Evidence Table

| Gate Area | Gate ID | Status (`pass|fail|exception`) | Evidence Link | Owner | Reviewed At | Notes |
|---|---|---|---|---|---|---|
| Slice completion | `LC-SLICE-001` | `TBD` | `TBD` | `TBD` | `TBD` | All S1..S6 completed in staging |
| Product flow | `LC-PROD-001` | `TBD` | `TBD` | `TBD` | `TBD` | Candidate and employer E2E paths |
| Product flow | `LC-PROD-002` | `TBD` | `TBD` | `TBD` | `TBD` | Resume upload + no-resume builder both pass |
| Product flow | `LC-PROD-003` | `TBD` | `TBD` | `TBD` | `TBD` | Autosave policy validated across all editable flows |
| Quality | `LC-QUAL-001` | `TBD` | `TBD` | `TBD` | `TBD` | No blocker defects in P0 stories |
| Quality | `LC-QUAL-002` | `TBD` | `TBD` | `TBD` | `TBD` | All P0 tests from test matrix pass |
| Security/compliance | `LC-SEC-001` | `TBD` | `TBD` | `TBD` | `TBD` | OWASP baseline + tenant isolation checks |
| Security/compliance | `LC-SEC-002` | `TBD` | `TBD` | `TBD` | `TBD` | GDPR export/delete/retention and audit validations |
| Operations | `LC-OPS-001` | `TBD` | `TBD` | `TBD` | `TBD` | On-call + alerting + DLQ/replay rehearsal |
| Data/SLO | `LC-SLO-001` | `TBD` | `TBD` | `TBD` | `TBD` | Parse/match/invite/packet SLO targets met |
| Contract consistency | `LC-CON-001` | `TBD` | `TBD` | `TBD` | `TBD` | Stories/API/states/slices naming consistency audit |

## Exception Log Linkage
- For every `exception` status, include:
  - exception decision ID from `decisions_log.md`
  - owner
  - due date
  - mitigation note
