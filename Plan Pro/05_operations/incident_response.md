# Incident Response and Escalation

## Owns
- Severity model, escalation timing, and communication requirements.

## Excludes
- Technical recovery steps for specific incidents (see `runbook.md`).

## Severity Model
- `SEV-1`: critical outage or major data/compliance risk.
- `SEV-2`: major degradation with partial functionality.
- `SEV-3`: minor degradation or isolated issue.

## Escalation Timing
- `SEV-1`: immediate paging, continuous response until stabilized.
- `SEV-2`: response within defined on-call window.
- `SEV-3`: queued with owner and ETA.

## Alert-to-Action Matrix
- API reliability breach -> backend on-call + platform.
- Invite dispatch health breach -> automation owner.
- Packet latency breach -> packet pipeline owner.
- DLQ growth breach -> platform/ops owner.
- Data integrity risk -> security + leadership.

## Communications
- Internal updates at fixed cadence by severity.
- Candidate/employer-facing notices when user impact is material.
- Post-incident summary required for SEV-1 and SEV-2.
