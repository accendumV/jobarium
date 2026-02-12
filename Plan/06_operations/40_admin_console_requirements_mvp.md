# Jobarium Admin Console Requirements (MVP)

## Purpose
Define minimum admin console capabilities required for pilot operations and dispute handling.

This closes item 40 in the system completeness gate.

## User Role
- `platform_admin` only (MVP)

## Core Functional Areas

### 1) Pipeline Operations
- View failed jobs by pipeline:
  - parse
  - enrichment
  - invite dispatch
  - authenticity assessment
  - packet build
- See failure reason and last retry attempt.
- Trigger safe retry for eligible failed jobs.

### 2) Event/DLQ Operations
- List DLQ events with filters:
  - event name
  - age
  - error reason
- Replay event batch with dry-run preview metadata.
- Track replay job status and completion.

### 3) Support Case Operations
- Open and manage authenticity appeal cases.
- Link candidate, session, packet, and relevant signals.
- Apply case outcomes with mandatory reason notes.

### 4) Privacy Operations
- View GDPR request queue.
- Process export/delete workflow steps with status tracking.
- Capture audit trail for each step.

### 5) Observability Snapshot
- show key health indicators:
  - invite success
  - Q&A submit success
  - packet build latency
  - parse failure rate
- link to detailed logs/traces for incident triage.

## Data Access and Safety
- No direct raw PII dumps in default list views.
- Every admin action must be audit-logged.
- High-risk actions require confirmation modal + reason input:
  - replay large batch
  - override authenticity label
  - manual state correction

## MVP Non-Goals
- Full feature-flag management UI.
- Arbitrary SQL/query console.
- Cross-role delegation workflow.

## Technical Requirements
- secure admin route with strict RBAC.
- pagination and filtering for all large tables.
- immutable action history for each support case.

## UX Requirements
- clear status badges for job/event/case lifecycle.
- one-click path from alert to affected entities.
- bulk actions only where idempotency is guaranteed.

## Acceptance Criteria
- Admin can resolve common pilot incidents without DB-level manual intervention.
- Replay operations are observable and auditable.
- Appeal and GDPR workflows are executable end-to-end from console.
