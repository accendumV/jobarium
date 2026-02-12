# Jobarium Lifecycle State Machines (MVP)

## Purpose
Define explicit lifecycle state machines for core workflow entities:
- `job_posting`
- `invite`
- `qa_session`
- `candidate_packet`

This document is implementation-facing and intended to remove ambiguity in backend and UI behavior.

## Global Rules
- State transitions are append-only in audit history.
- Invalid transitions must be rejected and logged.
- Every successful transition updates `updated_at`.
- Transition side effects must be idempotent.
- Async handlers must use idempotency keys.

## 1) Job Posting State Machine

### States
- `draft`
- `active`
- `paused`
- `closed`
- `archived`

### Transition Table
| Current State | Event | Guard Conditions | Next State | Side Effects |
|---|---|---|---|---|
| `draft` | `job.activate` | required fields + question kit valid | `active` | emit `job.updated`; schedule matching refresh |
| `draft` | `job.archive` | none | `archived` | emit `job.updated` |
| `active` | `job.pause` | none | `paused` | emit `job.updated`; stop new invites |
| `active` | `job.close` | none | `closed` | emit `job.updated`; expire open invites |
| `paused` | `job.resume` | role still valid | `active` | emit `job.updated`; matching refresh |
| `paused` | `job.close` | none | `closed` | emit `job.updated` |
| `closed` | `job.reopen` | role still valid | `active` | emit `job.updated`; matching refresh |
| `closed` | `job.archive` | none | `archived` | emit `job.updated` |

### Invalid Transition Examples
- `archived -> active`
- `draft -> closed` (use `active` then `closed` for traceable lifecycle)

## 2) Invite State Machine

### States
- `queued`
- `sent`
- `opened`
- `started`
- `submitted`
- `expired`
- `cancelled`
- `failed`

### Transition Table
| Current State | Event | Guard Conditions | Next State | Side Effects |
|---|---|---|---|---|
| `queued` | `invite.dispatch_success` | provider ack received | `sent` | emit `invite.created`; persist provider metadata |
| `queued` | `invite.dispatch_failed` | retries remaining | `queued` | retry with backoff |
| `queued` | `invite.dispatch_failed_final` | retries exhausted | `failed` | emit `invite.failed`; alert ops if threshold reached |
| `sent` | `invite.opened` | tracking event received | `opened` | analytics increment |
| `sent` | `invite.start` | candidate opts in | `started` | create `qa_session` |
| `opened` | `invite.start` | candidate opts in | `started` | create `qa_session` |
| `sent` | `invite.expire` | now > `expires_at` | `expired` | emit `invite.expired` |
| `opened` | `invite.expire` | now > `expires_at` and not started | `expired` | emit `invite.expired` |
| `started` | `qa.submitted` | linked session submitted | `submitted` | emit `invite.completed` |
| `queued`/`sent`/`opened` | `invite.cancel` | job closed/cancelled/admin action | `cancelled` | emit `invite.cancelled` |

### Notes
- `started` invite cannot transition to `expired`; once session started, expiry is governed by `qa_session`.
- Cooldown logic is external to state machine and enforced before creating `queued`.

## 3) QA Session State Machine

### States
- `created`
- `in_progress`
- `submitted`
- `expired`
- `abandoned`

### Transition Table
| Current State | Event | Guard Conditions | Next State | Side Effects |
|---|---|---|---|---|
| `created` | `qa.start` | invite valid | `in_progress` | record `started_at`; emit `qa.started` |
| `in_progress` | `qa.autosave` | payload valid | `in_progress` | persist delta; update heartbeat |
| `in_progress` | `qa.submit` | all required answers valid | `submitted` | emit `qa.submitted`; trigger authenticity assessment + packet build |
| `created` | `qa.expire` | invite/session ttl exceeded | `expired` | emit `qa.expired` |
| `in_progress` | `qa.expire` | ttl exceeded and not submitted | `expired` | emit `qa.expired` |
| `in_progress` | `qa.abandon` | inactivity threshold exceeded | `abandoned` | emit `qa.abandoned`; optional reminder |
| `abandoned` | `qa.resume` | still before ttl | `in_progress` | emit `qa.resumed` |

### Validation Rules
- `submitted` is terminal.
- Submission after `expired` is rejected.
- Required answers must pass type validation.

## 4) Candidate Packet State Machine

### States
- `building`
- `ready`
- `reviewed`
- `actioned`
- `superseded`
- `failed`

### Transition Table
| Current State | Event | Guard Conditions | Next State | Side Effects |
|---|---|---|---|---|
| `building` | `packet.build_success` | summary + transcript available | `ready` | emit `packet.ready`; notify employer |
| `building` | `packet.build_failed` | retries remaining | `building` | retry build job |
| `building` | `packet.build_failed_final` | retries exhausted | `failed` | emit `packet.failed`; alert ops |
| `ready` | `packet.viewed` | employer authorized | `reviewed` | analytics increment |
| `reviewed` | `packet.action.interview` | action valid | `actioned` | persist `packet_action`; notify candidate |
| `reviewed` | `packet.action.clarify` | action valid | `actioned` | persist `packet_action`; notify candidate |
| `reviewed` | `packet.action.reject` | action valid | `actioned` | persist `packet_action`; notify candidate |
| `ready` | `packet.supersede` | newer valid packet exists | `superseded` | link `superseded_by_packet_id` |
| `reviewed` | `packet.supersede` | newer valid packet exists | `superseded` | link relationship |

### Notes
- `actioned` is terminal for MVP.
- Superseding is for re-screen scenarios where policy allows a fresh Q&A.

## Cross-Entity Invariants
1. A `qa_session` cannot exist without an `invite`.
2. A `candidate_packet` cannot become `ready` unless linked `qa_session` is `submitted`.
3. Closing a job must cancel or expire all non-terminal invites.
4. Only one active `ready/reviewed/actioned` packet per candidate-job pair unless explicitly superseded policy is enabled.

## API and UI Implementation Requirements
- Backend must expose transition errors using stable codes:
  - `INVALID_STATE_TRANSITION`
  - `GUARD_CONDITION_FAILED`
  - `ENTITY_TERMINAL_STATE`
- UI must map each terminal state to explicit user-facing messages.
- Admin tools must allow replay only for failed async operations, not manual forced transitions bypassing guards.

## Telemetry Requirements
- Emit transition metric: `state_transition_total{entity,from,to,event}`.
- Emit invalid transition metric: `state_transition_invalid_total{entity,event}`.
- Track transition latency for async paths (invite dispatch, packet build).

## Versioning
- State machine version: `v1`.
- Any breaking transition change requires:
  1. decision log entry,
  2. migration note,
  3. backward compatibility plan for in-flight entities.
