# Monitoring Spec (MVP)

## Owns
- Metrics, dashboards, and alert contracts tied to SLOs.

## Excludes
- Human response procedure after alert fires (see `../05_operations/incident_response.md`).

## Core Dashboards
- Workflow health: invite volume, Q&A submissions, packet readiness.
- Reliability: API error rate, latency, queue lag, DLQ size.
- Business: invite->completion, packet->action, time-to-first-packet.

## Mandatory Metrics
- `state_transition_total{entity,from,to,event}`
- `state_transition_invalid_total{entity,event}`
- Parse duration and failure rate.
- Match refresh duration.
- Invite dispatch latency and failure rate.
- Packet build latency and failure rate.

## Alert Baseline
- API 5xx spike.
- Parse failure spike.
- DLQ backlog growth.
- Invite dispatch degradation.
- Packet build latency breach.
