# Jobarium Event Contracts Registry (MVP, v1)

## Purpose
Define versioned event contracts for all asynchronous workflows so producers and consumers can evolve safely.

This registry is the source of truth for:
- payload schemas,
- producer/consumer ownership,
- idempotency and ordering assumptions,
- compatibility and versioning policy.

## Global Envelope (applies to all events)

### Required Envelope Fields
- `event_id` (string, UUID)
- `event_name` (string)
- `event_version` (string, e.g. `v1`)
- `occurred_at` (string, ISO-8601 UTC)
- `producer` (string, service name)
- `trace_id` (string)
- `idempotency_key` (string)

### Optional Envelope Fields
- `tenant_id` (string)
- `correlation_id` (string)
- `schema_ref` (string)

### Delivery Model
- Pub/Sub at-least-once delivery.
- Consumers must be idempotent.
- Out-of-order delivery is possible; consumers must validate entity timestamps/state.

## Versioning Policy
- Additive non-breaking change (new optional field): remain on same version.
- Breaking change (required field change/removal/type change): create new version.
- Each new major version requires:
  1. decision log entry,
  2. migration plan,
  3. deprecation timeline for old version.

## Contract Template
For each event:
- Name + version
- Producer
- Consumers
- Trigger
- Required payload fields
- Optional payload fields
- Idempotency key rule
- Ordering assumptions
- Retry/DLQ notes

---

## E-01 `profile.updated` (`v1`)
- Producer: `candidate-profile-service`
- Consumers: `matching-service`, `enrichment-service`, `analytics-service`
- Trigger: candidate profile create/update confirmed
- Required payload:
  - `candidate_id` (string)
  - `profile_version` (integer)
  - `changed_fields` (array[string])
  - `updated_at` (ISO string)
- Optional payload:
  - `source` (`manual` | `import` | `parser`)
- Idempotency key:
  - `profile.updated:{candidate_id}:{profile_version}`
- Ordering:
  - process latest `profile_version`; ignore stale

## E-02 `job.updated` (`v1`)
- Producer: `job-service`
- Consumers: `matching-service`, `analytics-service`
- Trigger: job create/update/activation/pause/close
- Required payload:
  - `job_id`
  - `job_version` (integer)
  - `status` (`draft|active|paused|closed|archived`)
  - `updated_at`
- Optional payload:
  - `changed_fields` (array[string])
- Idempotency key:
  - `job.updated:{job_id}:{job_version}`
- Ordering:
  - apply only if `job_version` is newer

## E-03 `candidate.document.uploaded` (`v1`)
- Producer: `candidate-document-service`
- Consumers: `parser-service`, `security-scan-service`
- Trigger: resume upload finalized
- Required payload:
  - `candidate_id`
  - `document_id`
  - `storage_uri`
  - `mime_type`
  - `uploaded_at`
- Optional payload:
  - `source` (`web` | `mobile`)
- Idempotency key:
  - `candidate.document.uploaded:{document_id}`

## E-04 `candidate.document.parsed` (`v1`)
- Producer: `parser-service`
- Consumers: `enrichment-service`, `candidate-profile-service`, `analytics-service`
- Trigger: parse completed (success path)
- Required payload:
  - `candidate_id`
  - `document_id`
  - `parse_job_id`
  - `parser_version`
  - `quality_score` (number 0-1)
  - `completed_at`
- Optional payload:
  - `confidence_summary` (object)
  - `low_confidence_fields` (array[string])
- Idempotency key:
  - `candidate.document.parsed:{parse_job_id}:{parser_version}`

## E-05 `candidate.enrichment.requested` (`v1`)
- Producer: `enrichment-orchestrator`
- Consumers: `enrichment-worker`
- Trigger: profile/job/parser update requiring enrichment
- Required payload:
  - `candidate_id`
  - `enrichment_version`
  - `reason` (`profile_updated|document_parsed|scheduled|model_bump`)
  - `requested_at`
- Optional payload:
  - `priority` (`high|normal|low`)
- Idempotency key:
  - `candidate.enrichment.requested:{candidate_id}:{enrichment_version}`

## E-06 `candidate.enrichment.completed` (`v1`)
- Producer: `enrichment-worker`
- Consumers: `matching-service`, `analytics-service`
- Trigger: enrichment finishes
- Required payload:
  - `candidate_id`
  - `enrichment_version`
  - `signals_updated` (array[string])
  - `completed_at`
- Optional payload:
  - `warnings` (array[string])
- Idempotency key:
  - `candidate.enrichment.completed:{candidate_id}:{enrichment_version}`

## E-07 `matching.shortlist.changed` (`v1`)
- Producer: `matching-service`
- Consumers: `automation-service`, `analytics-service`
- Trigger: shortlist diff computed for a job
- Required payload:
  - `job_id`
  - `shortlist_version` (integer)
  - `entered_candidates` (array[string])
  - `exited_candidates` (array[string])
  - `computed_at`
- Optional payload:
  - `reason` (`event_triggered|hourly_refresh`)
- Idempotency key:
  - `matching.shortlist.changed:{job_id}:{shortlist_version}`

## E-08 `invite.created` (`v1`)
- Producer: `automation-service`
- Consumers: `notification-service`, `analytics-service`
- Trigger: invite record created and queued
- Required payload:
  - `invite_id`
  - `job_id`
  - `candidate_id`
  - `expires_at`
  - `created_at`
- Optional payload:
  - `channel_preferences` (array[`email`,`sms`])
- Idempotency key:
  - `invite.created:{invite_id}`

## E-09 `invite.expired` (`v1`)
- Producer: `automation-service`
- Consumers: `analytics-service`, `candidate-experience-service`
- Trigger: invite reached expiry and not started
- Required payload:
  - `invite_id`
  - `job_id`
  - `candidate_id`
  - `expired_at`
- Idempotency key:
  - `invite.expired:{invite_id}`

## E-10 `qa.submitted` (`v1`)
- Producer: `qa-service`
- Consumers: `authenticity-service`, `packet-builder-service`, `analytics-service`
- Trigger: candidate submits all required answers
- Required payload:
  - `session_id`
  - `invite_id`
  - `job_id`
  - `candidate_id`
  - `submitted_at`
- Optional payload:
  - `answer_count` (integer)
- Idempotency key:
  - `qa.submitted:{session_id}`

## E-11 `qa.authenticity.assessed` (`v1`)
- Producer: `authenticity-service`
- Consumers: `packet-builder-service`, `analytics-service`, `admin-ops-service`
- Trigger: authenticity scoring complete
- Required payload:
  - `session_id`
  - `candidate_id`
  - `job_id`
  - `policy_result` (`likely_self_authored|mixed_assistance|heavy_assistance_suspected`)
  - `authenticity_score` (0-100)
  - `confidence` (0-1)
  - `model_version`
  - `assessed_at`
- Optional payload:
  - `reason_codes` (array[string], max 3 for downstream UI)
- Idempotency key:
  - `qa.authenticity.assessed:{session_id}:{model_version}`

## E-12 `packet.ready` (`v1`)
- Producer: `packet-builder-service`
- Consumers: `employer-inbox-service`, `notification-service`, `analytics-service`
- Trigger: packet build success
- Required payload:
  - `packet_id`
  - `job_id`
  - `candidate_id`
  - `session_id`
  - `ready_at`
- Optional payload:
  - `summary_version` (string)
  - `trust_label` (string)
- Idempotency key:
  - `packet.ready:{packet_id}`

## E-13 `billing.usage.updated` (`v1`)
- Producer: `billing-service`
- Consumers: `billing-service` (aggregator), `analytics-service`
- Trigger: metered usage increments
- Required payload:
  - `organization_id`
  - `billing_month` (YYYY-MM)
  - `metric_name` (`packets_generated|invites_sent|active_jobs`)
  - `delta` (number)
  - `updated_at`
- Optional payload:
  - `source_event_id`
- Idempotency key:
  - `billing.usage.updated:{organization_id}:{billing_month}:{metric_name}:{source_event_id}`

---

## Consumer Validation Rules
1. Reject events with unknown `event_version` for strict consumers.
2. Validate required fields before processing.
3. If validation fails, route to DLQ with error reason.
4. Do not partial-process invalid events.

## Replay Rules
- Replay must preserve original `event_id` and `occurred_at`.
- Replayed message must include `replay=true` flag in message attributes.
- Consumers should remain idempotent and avoid duplicate side effects.

## Ownership and Change Control
- Contract owner:
  - CEO/CTO until dedicated platform owner exists.
- Any schema change requires:
  1. PR updating this registry,
  2. affected consumer compatibility notes,
  3. decision log entry for breaking changes.

## Open Items (Follow-up)
1. Add JSON Schema snippets per event in a machine-readable appendix.
2. Add message attribute conventions for routing/priority.
3. Define SLA per event type (publish-to-consume latency targets).
