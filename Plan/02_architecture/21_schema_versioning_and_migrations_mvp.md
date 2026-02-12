# Jobarium Schema Versioning and Migration Policy (MVP)

## Purpose
Define how database schema and event-schema changes are versioned, migrated, rolled out, and rolled back safely.

This closes item 7 in the system completeness gate.

## Versioning Principles
1. Backward-compatible first.
2. Expand -> migrate -> contract pattern.
3. No breaking schema + code deploy in one irreversible step.
4. Every migration has rollback or containment strategy.

## Database Migration Policy (Postgres)

### Migration Types
- `expand`:
  - add nullable columns
  - add new tables/indexes
  - add non-blocking constraints
- `migrate`:
  - backfill data in controlled batches
  - dual-write when needed
- `contract`:
  - remove legacy columns/tables after code cutover and validation

### Required Metadata per Migration
- migration id
- owner
- category (`expand|migrate|contract`)
- estimated runtime
- rollback plan
- verification query checklist

### Rollout Rules
- Apply `expand` before app code that reads new fields.
- Release app code supporting both old and new representations.
- Execute backfill jobs with throttling.
- Remove legacy fields only after stability window (minimum 2 releases).

## Event Schema Versioning Policy
- Additive optional fields: same `v1`.
- Breaking change: new version (`v2`) with dual-consume period.
- Producers must emit declared `event_version`.
- Consumers must validate version and reject unknown when strict.

## Backward Compatibility Rules
- App must tolerate missing optional fields.
- New required DB columns must be nullable until backfill complete.
- Never repurpose existing field semantics silently.

## Rollback Strategy
- For failed app deploy:
  - roll back app image first.
- For failed backfill:
  - pause backfill job, keep dual-read compatibility.
- For migration causing impact:
  - use feature flag to disable dependent feature path.

## Migration Testing Requirements
- Staging dry-run with realistic data volumes.
- Check index creation impact and lock behavior.
- Verify read/write behavior before and after migration.
- Validate rollback path at least once for major changes.

## Operational Checklist (Per Migration)
- [ ] Migration reviewed by CTO.
- [ ] Rollback/containment documented.
- [ ] Alert thresholds for DB errors prepared.
- [ ] Post-deploy verification queries executed.
- [ ] Decision log entry added for breaking changes.

## Ownership
- CTO owns migration execution.
- CEO approves high-risk migration windows during pilot.
