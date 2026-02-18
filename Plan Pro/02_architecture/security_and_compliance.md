# Security and Compliance (MVP)

## Owns
- RBAC policy baseline, audit logging rules, GDPR control set.

## Excludes
- Incident escalation workflow (see `../05_operations/incident_response.md`).
- Deployment controls (see `../04_implementation/deployment_pipeline.md`).

## RBAC Roles
- `candidate`
- `employer_admin`
- `hiring_manager`
- `platform_admin`

## RBAC Global Rules
- Deny by default.
- Strict tenant isolation.
- Cross-tenant `platform_admin` actions require explicit audit trace.

## Sensitive Operations (Audit Reason Required)
- Authenticity override.
- Manual packet state correction.
- GDPR delete execution.
- Cross-tenant admin reads.
- Manual billing adjustments.

## GDPR Controls
- Consent capture and versioning.
- Data export workflow.
- Delete/anonymize workflow.
- Retention policy by category.

## Security Baseline
- Auth/session hardening, input validation, rate limiting.
- PII minimization and access scoping.
- Encryption at rest + in transit.
