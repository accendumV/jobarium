# Jobarium Audit Logging and Retention Policy (MVP)

## Purpose
Define what must be audit-logged, who can access logs, and how long logs are retained.

This policy supports:
- security accountability,
- GDPR obligations,
- incident investigation,
- dispute handling (including authenticity disputes).

## Scope
- User actions (candidate/employer/admin)
- System actions affecting workflow state
- Security-relevant events
- GDPR request processing lifecycle

## Audit Log Event Schema (Minimum)
- `audit_id` (uuid)
- `timestamp` (ISO-8601 UTC)
- `actor_type` (`user|service`)
- `actor_id` (user id or service account id)
- `actor_role` (if user)
- `tenant_id` (nullable for platform-wide ops)
- `action` (verb)
- `object_type`
- `object_id`
- `result` (`success|failure`)
- `reason` (required for sensitive overrides/manual admin actions)
- `source_ip` (if user-triggered)
- `metadata_json` (non-PII by default)

## What Must Be Logged (P0)

### Authentication and Access
- login success/failure
- session revoke/expire
- password reset and auth method changes
- authorization denials for protected endpoints

### Candidate/Employer Critical Actions
- job activate/pause/close
- invite policy changes
- manual invite actions
- packet action decisions (interview/clarify/reject)
- Q&A submission event linkage

### Admin/Ops Actions
- DLQ replay execution
- manual state override actions
- authenticity label override/review decision
- cross-tenant data access by `platform_admin`
- billing manual adjustments

### Privacy/Compliance
- consent accepted/revoked
- GDPR export request received/completed
- GDPR delete/anonymize request received/completed
- retention job execution outcomes

## Access Control for Audit Logs
- Read access:
  - `platform_admin` only (default).
- Write access:
  - application services through centralized logging pipeline only.
- No direct mutation/deletion of historical audit records by application roles.

## Retention Policy (MVP Defaults)

### Retention by Category
- Security/auth events: 365 days
- Core workflow actions (job/invite/packet decisions): 365 days
- Admin override actions: 730 days
- GDPR processing records: 730 days
- Telemetry-derived authenticity raw aggregates: 90 days
- Final authenticity assessment records: 365 days

### Deletion/Archive Rules
- On retention expiry:
  - move to archive tier if needed for legal hold,
  - otherwise delete permanently.
- Legal hold flag prevents deletion while active.

## Data Minimization Rules
- Do not store raw secrets/tokens in audit metadata.
- Avoid full answer text in audit logs; store references/IDs.
- Mask contact data in logs where feasible.

## Integrity and Tamper Resistance
- Audit stream should be append-only.
- Enable immutable retention control where supported.
- Log pipeline failures must raise alerts.

## Operational Monitoring
- Alert on:
  - missing audit events for critical actions,
  - audit pipeline ingestion failures,
  - unusual spikes in `platform_admin` cross-tenant reads.
- Weekly review:
  - sensitive admin action report,
  - failed authorization trends.

## GDPR Interaction Rules
- Audit entries about GDPR actions are retained as compliance evidence.
- For data deletion requests:
  - user content is deleted/anonymized per policy,
  - audit records keep minimal, lawful evidence fields.

## Implementation Responsibilities
- CTO:
  - enforce technical controls and retention jobs.
- CEO:
  - approve policy exceptions and legal-hold decisions.

## Validation Checklist
- [ ] All P0 actions mapped to audit events.
- [ ] RBAC enforced for audit log access.
- [ ] Retention jobs tested in staging.
- [ ] GDPR workflow and audit linkage verified.
- [ ] Alerting on audit pipeline failure configured.
