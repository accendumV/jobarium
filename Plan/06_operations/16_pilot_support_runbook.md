# Jobarium Pilot Support Runbook (MVP)

## Purpose
Provide an operational playbook for pilot incidents, service degradation, and user-facing support issues.

This runbook is designed for a small team (CEO/CTO) operating without a dedicated SRE function.

## Scope
- Candidate and employer support incidents during pilot.
- Async pipeline failures (parsing, enrichment, invites, Q&A, packet generation).
- Authenticity dispute handling.
- GDPR support requests routing.

## Support Model and Ownership
- Primary on-call:
  - CTO (technical incident lead)
- Secondary on-call:
  - CEO (communications + prioritization)
- Escalation:
  - If incident exceeds SLA or impacts hiring outcomes, CEO + CTO jointly decide mitigation path and stakeholder updates.

## Severity Classification

### SEV-1 (Critical)
- Definition:
  - Core hiring flow unavailable or corrupted for most users.
- Examples:
  - Packet generation down for all jobs.
  - Invite dispatch halted platform-wide.
  - Data loss risk.
- Initial response SLA:
  - acknowledge within 15 minutes.
- Target recovery:
  - mitigate within 2 hours.

### SEV-2 (Major)
- Definition:
  - Major feature degraded for a subset of users.
- Examples:
  - CV parse failures spike.
  - Delayed invites for one region/tenant.
  - Q&A submit errors affecting a cohort.
- Initial response SLA:
  - acknowledge within 1 hour.
- Target recovery:
  - mitigate within 8 hours.

### SEV-3 (Minor)
- Definition:
  - Limited issue, workaround available, low business impact.
- Examples:
  - Dashboard metric lag.
  - Non-critical UI rendering bugs.
- Initial response SLA:
  - acknowledge within 1 business day.
- Target recovery:
  - fix in next planned release window.

## Incident Response Workflow
1. Detect
   - alert, user ticket, or manual observation.
2. Triage
   - classify severity and affected scope.
3. Stabilize
   - apply mitigation/workaround to stop impact growth.
4. Resolve
   - identify root cause and implement fix.
5. Communicate
   - update affected users/internal stakeholders.
6. Review
   - complete postmortem for SEV-1/SEV-2.

## Core Operational Dashboards to Watch
- Invite dispatch latency and failure rate.
- Q&A submission success rate.
- Packet build latency and error rate.
- CV parse success/failure ratio.
- DLQ backlog size by topic.
- API error rate (`5xx`) by service.

## Common Incident Playbooks

### Playbook A: CV Parsing Failure Spike
- Trigger:
  - parse failure rate > 15% over 15 minutes.
- Checks:
  1. Validate storage access and parser service health.
  2. Check mime/type rejection and scanner logs.
  3. Inspect provider dependency (OCR fallback).
- Mitigation:
  - switch to deterministic parser only mode if OCR is degraded.
  - queue retries with capped concurrency.
  - allow manual profile entry path immediately.
- User communication:
  - candidate-facing notice: parsing delayed, manual entry available.

### Playbook B: Invite Dispatch Failure
- Trigger:
  - invite send success < 90% over 10 minutes.
- Checks:
  1. notification provider API status.
  2. Cloud Tasks backlog and retry configuration.
  3. invalid contact data rate.
- Mitigation:
  - fail over to alternate channel (email <-> SMS) where possible.
  - pause new invite generation if queue saturation risks cascade.
  - replay failed tasks after provider recovery.

### Playbook C: Q&A Submission Errors
- Trigger:
  - `qa.submit` errors > 5% over 10 minutes.
- Checks:
  1. session expiry logic and clock skew.
  2. payload validation failures by question type.
  3. database write latency/errors.
- Mitigation:
  - temporarily extend session TTL.
  - relax non-critical validation if safe.
  - preserve draft and notify candidates not to re-enter answers.

### Playbook D: Packet Build Delays/Failures
- Trigger:
  - packet readiness p95 > 5 minutes or failure spike.
- Checks:
  1. packet builder queue depth.
  2. authenticity assessment dependency status.
  3. summary generation provider latency.
- Mitigation:
  - degrade to "transcript-first packet" while summary retries.
  - prioritize oldest submitted sessions first.
  - batch retry failed jobs with backoff.

### Playbook E: Authenticity Dispute Escalation
- Trigger:
  - candidate disputes "heavy assistance suspected" label.
- Checks:
  1. confirm confidence score and reason codes.
  2. verify telemetry completeness.
  3. check model/rules version active at assessment time.
- Mitigation:
  - mark assessment "under review."
  - provide employer neutral note pending review.
  - re-score if data pipeline issue detected.
- Policy:
  - no automated rejection based solely on authenticity signal in MVP.

### Playbook F: GDPR Request Handling
- Trigger:
  - data export or deletion request.
- Checks:
  1. verify requester identity.
  2. identify all related records and artifacts.
- Mitigation:
  - execute approved export/delete workflow.
  - log all actions in audit trail.
- SLA:
  - acknowledge within 72 hours; complete within legal policy window.

## DLQ and Replay Procedure
1. Inspect DLQ message metadata (`event_name`, `event_version`, error reason).
2. Classify root cause:
   - transient infra
   - schema mismatch
   - code defect
   - bad source data
3. Apply fix or temporary filter.
4. Replay from DLQ in controlled batches.
5. Confirm idempotent processing and side-effect safety.
6. Record replay job ID in incident notes.

## Manual Fallback Procedures (Pilot)
- If packet builder is down:
  - allow transcript-only review mode.
- If notifications provider is degraded:
  - route critical notices through backup channel or manual outreach.
- If matching is delayed:
  - display "refresh in progress" and prioritize active roles.

## Communication Templates

### Internal Incident Update
- Incident ID:
- Severity:
- Impact:
- Current mitigation:
- Next update ETA:
- Owner:

### Employer-Facing Message
- "We are currently experiencing a delay in [feature]. Your existing data is safe. We expect [ETA] for recovery and will notify you once complete."

### Candidate-Facing Message
- "We are experiencing a temporary issue with [feature]. Your progress has been saved. Please retry in [ETA] or use [fallback option]."

## Postmortem Template (SEV-1/SEV-2)
- Incident ID:
- Timeline (UTC):
- Root cause:
- Customer impact:
- Detection gap:
- What worked:
- What failed:
- Corrective actions:
- Preventive actions:
- Owner and due dates:

## Tooling Requirements (Minimum)
- Centralized logs with trace IDs.
- Alerting on key SLO breaches.
- DLQ visibility and replay command.
- Admin notes/ticket tracking for support cases.

## Pilot Readiness Checklist
- [ ] On-call rotation documented and reachable.
- [ ] Alert channels tested.
- [ ] DLQ replay tested in staging.
- [ ] Support communication templates approved.
- [ ] GDPR workflow tested end-to-end.
- [ ] Authenticity dispute review workflow validated.

## Review Cadence
- Review runbook weekly during pilot.
- Update after every SEV-1/SEV-2 incident.
