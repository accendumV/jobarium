# Jobarium Alert Thresholds and Escalation Matrix (MVP)

## Purpose
Define concrete alert thresholds and escalation paths for pilot operations.

This closes item 39 in the system completeness gate.

## Alerting Ownership
- Primary responder: CTO
- Secondary responder: CEO

## Severity Mapping
- `SEV-1`: business-critical outage/data risk
- `SEV-2`: major degradation impacting active workflows
- `SEV-3`: minor degradation with workaround

## Core Alert Thresholds

### API Reliability
- Trigger:
  - `5xx_rate > 3%` for 10 minutes
- Severity:
  - SEV-2
- Escalation:
  - CTO immediate, CEO if > 30 minutes

### Invite Dispatch Health
- Trigger:
  - invite delivery success `< 90%` for 10 minutes
- Severity:
  - SEV-2
- Escalation:
  - CTO immediate, CEO immediate if hard provider down

### Q&A Submission Reliability
- Trigger:
  - submit failure rate `> 5%` for 10 minutes
- Severity:
  - SEV-2
- Escalation:
  - CTO immediate

### Packet Build Latency
- Trigger:
  - packet ready p95 `> 5 minutes` for 15 minutes
- Severity:
  - SEV-2
- Escalation:
  - CTO immediate, CEO if > 60 minutes

### CV Parse Failure Spike
- Trigger:
  - parse failure rate `> 15%` for 15 minutes
- Severity:
  - SEV-2
- Escalation:
  - CTO immediate

### DLQ Backlog Growth
- Trigger:
  - DLQ backlog `> 100` unprocessed events for 30 minutes
- Severity:
  - SEV-2
- Escalation:
  - CTO immediate

### Data Integrity Risk
- Trigger:
  - failed writes with inconsistency indicators or missing critical events
- Severity:
  - SEV-1
- Escalation:
  - CTO + CEO immediate, incident bridge required

## Escalation Timing Matrix
- SEV-1:
  - acknowledge in 15 minutes
  - stakeholder update every 30 minutes
- SEV-2:
  - acknowledge in 60 minutes
  - stakeholder update every 2 hours
- SEV-3:
  - acknowledge next business day
  - include in weekly ops review

## Notification Routing
- Primary channel: pager/ops alert channel
- Secondary channel: SMS fallback to on-call
- Tertiary: email digest for non-critical alerts

## Alert Hygiene Rules
- deduplicate repeated alerts for same condition window
- auto-close only after sustained recovery window
- require post-incident note for SEV-1/SEV-2 closures

## Weekly Calibration
- review noisy alerts
- tune thresholds based on pilot traffic baseline
- add/remove alerts with documented rationale
