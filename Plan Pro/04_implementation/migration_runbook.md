# Migration Runbook

## Owns
- Operational procedure for applying and validating SQL migrations.

## Excludes
- Migration content (see `sql_migrations/`).
- Product launch gate definitions (see `../01_product/launch_criteria.md`).

## Canonical Migration Order
1. `001_extensions.sql`
2. `002_enums.sql`
3. `010_identity.sql`
4. `020_organization.sql`
5. `030_candidate.sql`
6. `040_job.sql`
7. `050_matching_and_invites.sql`
8. `060_qa_and_packet.sql`
9. `070_ops.sql`
10. `080_indexes.sql`

## Apply Procedure (Per Environment)
1. Confirm target DB and backup status.
2. Run pending migrations in canonical order.
3. Run schema smoke checks:
   - expected tables exist
   - expected enum values present
   - critical indexes present
4. Run contract/integration smoke tests for touched endpoints.
5. Record run artifact link and outcome.

## Rollback Strategy
- Preferred approach: forward-fix migration.
- Emergency rollback only if:
  - migration causes blocking outage,
  - no safe forward-fix exists in target window.
- Rollback prep requirements:
  - DB backup snapshot timestamp recorded,
  - affected services put in maintenance-safe mode,
  - rollback command reviewed by owner.

## Failure Handling
- If migration step fails:
  1. stop remaining steps,
  2. capture error output and failed step ID,
  3. assess partial-apply impact,
  4. choose forward-fix or rollback path,
  5. log decision in `../00_navigation/decisions_log.md`.

## Evidence Logging
- Every migration run must append:
  - environment
  - migration range
  - operator
  - start/end timestamps
  - result (`pass|fail`)
  - artifact link
