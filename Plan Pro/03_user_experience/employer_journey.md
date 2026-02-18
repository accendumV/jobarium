# Employer Journey (MVP)

## Owns
- Employer-facing lifecycle flow and stage objectives.

## Excludes
- Admin/Ops procedures (see `../05_operations/*`).
- Detailed component behavior (see `ui_specification.md`).

## Stages
1. Organization onboarding and team access.
2. Job setup (requirements, dealbreakers, question kit).
3. Automation settings (caps, cooldown, expiry).
4. Packet inbox and packet detail review.
5. Decision actions (`interview|clarify|reject`).
6. Performance/status monitoring.

## Stage Exit Rules
- Job cannot activate until required setup fields and question kit are valid.
- Decision actions require authorized employer role and auditable actor context.
