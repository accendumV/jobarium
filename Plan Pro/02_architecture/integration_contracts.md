# Integration Contracts (Interfaces + Events)

## Owns
- BC interaction contracts and async event registry.

## Excludes
- Transition lifecycle logic (see `state_machines.md`).
- DB schema specifics (see `../04_implementation/database_schema.md`).

## Global Event Envelope
- Required: `event_id`, `event_name`, `event_version`, `occurred_at`, `producer`, `trace_id`, `idempotency_key`.
- Optional: `tenant_id`, `correlation_id`, `schema_ref`.
- Delivery: at-least-once; consumers must be idempotent and stale-aware.

## Event Registry (v1)
- `profile.updated`
- `job.updated`
- `candidate.document.uploaded`
- `candidate.document.parsed`
- `candidate.enrichment.requested`
- `candidate.enrichment.completed`
- `matching.shortlist.changed`
- `invite.created`
- `invite.expired`
- `qa.submitted`
- `qa.authenticity.assessed`
- `packet.ready`
- `billing.usage.updated`

## Contract Rules
- TODO: clarify versioning strategy across HTTP vs events. HTTP API is currently unversioned (single deployment), while events require `event_version`. Decide and document the unified versioning approach later.
- Non-breaking additive fields stay on same version.
- Breaking change requires new version + migration note + deprecation window.
- Invalid payloads go to DLQ; no partial processing.
- Replay preserves `event_id` and `occurred_at`.
