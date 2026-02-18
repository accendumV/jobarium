# Deployment Pipeline

## Owns
- CI/CD stages, environment promotion, rollout/rollback method.

## Excludes
- Live incident escalation paths (see `../05_operations/incident_response.md`).

## Environments
- `dev` -> `staging` -> `prod`

## CI Stages
1. Lint and static checks.
2. Unit + integration tests.
3. Migration validation.
4. Build and image scan.
5. Artifact publish.

## CD Stages
1. Deploy to staging.
2. Run smoke tests and contract checks.
3. Manual approval gate.
4. Progressive rollout to prod.

## Rollback Rules
- Fast rollback by previous stable image.
- DB rollback only via pre-approved compatible migration strategy.
- Incident note required for all rollbacks.
