# Pilot Runbook

## Owns
- Step-by-step procedures for common incidents and operational recovery.

## Excludes
- Architecture decisions and schema design.

## Playbooks
- Parse failure spike.
- Invite dispatch failure.
- Q&A submission outage.
- Packet build delays/failures.
- GDPR request processing issue.

## Standard Procedure
1. Detect and classify severity.
2. Stabilize user-facing impact.
3. Contain and recover (retry/replay/fallback).
4. Validate recovery.
5. Communicate status.
6. Record post-incident notes.

## DLQ/Replay Rules
- Replay with original identifiers where possible.
- One replay attempt window before escalation.
- All replay actions are audited.
