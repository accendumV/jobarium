# Jobarium Launch Definition of Done (MVP)

## Purpose
Define explicit launch readiness criteria across product, quality, security/compliance, and operations.

A launch is approved only when all P0 criteria below are met or an exception is documented in the decisions log.

## 1) Product and Workflow Criteria (P0)
- Candidate can complete end-to-end flow:
  - sign-up -> profile bootstrap -> invite -> Q&A submit -> confirmation.
- Employer can complete end-to-end flow:
  - org setup -> job setup -> automation config -> packet review -> action.
- Packet-first behavior is active:
  - employer inbox defaults to completed packets.
- Dealbreaker checks visible in packet:
  - authorization, location/radius, pay overlap, availability, required cert/license.
- Authenticity insight displayed as advisory signal only (no auto-reject).

## 2) Functional Quality Criteria (P0)
- Zero known blocker bugs in candidate/employer P0 flows.
- Core APIs meet baseline reliability under pilot load.
- Parser failures degrade gracefully to manual profile entry.
- Packet build retries work and failed jobs are observable.

## 3) Security and Compliance Criteria (P0)
- OWASP baseline controls enabled (auth/session/input validation/rate limiting).
- GDPR workflows functional:
  - consent capture
  - export request handling
  - delete/anonymize request handling
  - retention policy execution
- Audit logs exist for sensitive and admin actions.

## 4) Operational Readiness Criteria (P0)
- On-call ownership and incident severities defined.
- Alerts configured for:
  - invite dispatch failures
  - parse failure spike
  - packet build delay/failure
  - API 5xx spike
- DLQ inspection and replay tested in staging.
- Pilot support communication templates approved.

## 5) Data and Analytics Criteria (P0)
- Core events emitted and validated for:
  - profile/job updates
  - shortlist changes
  - invite lifecycle
  - q&a submission
  - packet readiness
- Dashboard metrics available:
  - time to first completed packet
  - invite -> completion
  - packet -> interview action

## 6) Performance/SLO Criteria (P0)
- CV parse completion p95 < 3 minutes.
- matching refresh p95 < 10 minutes after major update.
- invite dispatch p95 < 2 minutes after shortlist entry.
- packet generation p95 < 90 seconds after Q&A submission.

## 7) Go/No-Go Process
- Readiness review participants:
  - CEO, CTO
- Inputs:
  - this DoD checklist
  - system completeness gate
  - open incident/risk summary
- Decision outcomes:
  - `Go`
  - `Go with exceptions` (must be logged with owner/date)
  - `No-Go` (blocked criteria and remediation date)

## 8) Launch Sign-Off
- Target launch date:
- CEO sign-off:
- CTO sign-off:
- Exceptions approved (if any):
