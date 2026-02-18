# Test Strategy (MVP)

## Owns
- Required test levels, release gates, and acceptance thresholds.

## Excludes
- Incident diagnostics during production events (see `../05_operations/runbook.md`).

## Test Levels
- Unit:
  - state transitions, scoring logic, policy evaluators, validators.
- Integration:
  - API + DB behavior, event producer/consumer idempotency, retry/DLQ paths.
- End-to-end:
  - candidate golden path and employer golden path.

## Mandatory Contract Tests
- Event schema validation for all v1 events.
- API error shape and status code consistency.
- RBAC and tenant isolation checks.

## Release Gates
- 0 blocker failures in P0 E2E suite.
- 100% pass for contract tests.
- Migration smoke test pass on staging snapshot.
- SLO smoke tests pass for parse/match/invite/packet latencies.
