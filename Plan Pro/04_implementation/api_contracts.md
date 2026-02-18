# API Contracts (v1)

## Owns
- REST endpoint contract list with minimum request/response/error requirements.
- Human-readable source for `openapi.yaml`.

## Excludes
- DB table definitions (see `database_schema.md`).
- Async event payload details (see `../02_architecture/integration_contracts.md`).

## Global Contract Standards
- Every endpoint defines: auth role, tenant scope, request schema, response schema, and error schema.
- Content type: `application/json`.
- Authentication: `Authorization: Bearer <jwt>`, except `signup` and `login`.
- Idempotency required for mutating endpoints:
  - Header: `Idempotency-Key: <uuid>`
  - Duplicate key + same body => return original response.
  - Duplicate key + different body => `409 IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD`.
- Pagination:
  - Query: `limit` (default 20, max 100), `cursor` (opaque string).
  - Response: `next_cursor` nullable.
- Draft/autosave:
  - all editable multi-step flows must expose draft-save endpoints.
  - autosave writes use idempotency key and return server revision.

## Standard Response Envelope
Success:
```json
{
  "data": {},
  "meta": {
    "trace_id": "trc_123",
    "request_id": "req_123"
  }
}
```

Error:
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": [
      { "field": "email", "issue": "invalid_format" }
    ]
  },
  "meta": {
    "trace_id": "trc_123",
    "request_id": "req_123"
  }
}
```

## Required Error Codes
- `INVALID_STATE_TRANSITION`
- `GUARD_CONDITION_FAILED`
- `ENTITY_TERMINAL_STATE`
- `FORBIDDEN`
- `TENANT_SCOPE_VIOLATION`
- `VALIDATION_FAILED`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `UNAUTHORIZED`
- `IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD`

## Endpoint Contracts (P0)

## Endpoint ID Catalog
- `AUTH-001` `POST /auth/signup`
- `AUTH-002` `POST /auth/login`
- `AUTH-003` `POST /consents`
- `CAND-001` `GET /candidate/profile`
- `CAND-002` `PUT /candidate/profile`
- `CAND-003` `POST /candidate/documents`
- `CAND-004` `GET /candidate/matches`
- `CAND-005` `GET /candidate/profile/matchability`
- `CAND-006` `PUT /candidate/profile/draft`
- `CAND-007` `POST /candidate/profile/builder/start`
- `CAND-008` `POST /candidate/documents/{id}/parse/retry`
- `EMP-001` `POST /organizations`
- `EMP-002` `POST /jobs`
- `EMP-003` `PUT /jobs/{id}`
- `EMP-004` `POST /jobs/{id}/activate`
- `EMP-005` `PUT /jobs/{id}/automation-settings`
- `EMP-006` `PUT /jobs/{id}/draft`
- `INV-001` `GET /invites/{id}`
- `QA-001` `POST /qa/sessions/{id}/start`
- `QA-002` `POST /qa/sessions/{id}/autosave`
- `QA-003` `POST /qa/sessions/{id}/submit`
- `PKT-001` `GET /employer/packets`
- `PKT-002` `GET /employer/packets/{id}`
- `PKT-003` `POST /employer/packets/{id}/actions`
- `ADM-001` `GET /admin/failures`
- `ADM-002` `POST /admin/failures/{id}/replay`
- `ADM-003` `POST /gdpr/export`
- `ADM-004` `POST /gdpr/delete`

### 1) Auth and Consent

#### `POST /auth/signup`
- Auth: none
- Tenant scope: N/A
- Request:
```json
{
  "email": "candidate@example.com",
  "password": "string-min-10",
  "role_intent": "candidate",
  "phone": "+17135550178"
}
```
- Response `201`:
```json
{
  "data": {
    "user_id": "usr_01",
    "role": "candidate",
    "email_verified": false
  },
  "meta": { "trace_id": "trc_01", "request_id": "req_01" }
}
```

#### `POST /auth/login`
- Auth: none
- Request:
```json
{
  "email": "candidate@example.com",
  "password": "string"
}
```
- Response `200`:
```json
{
  "data": {
    "access_token": "jwt",
    "refresh_token": "token",
    "expires_in_seconds": 900,
    "user": {
      "user_id": "usr_01",
      "role": "candidate"
    }
  },
  "meta": { "trace_id": "trc_02", "request_id": "req_02" }
}
```

#### `POST /consents`
- Auth: `candidate|employer_admin|hiring_manager`
- Request:
```json
{
  "consent_type": "terms_privacy",
  "consent_version": "2026-02",
  "accepted": true
}
```
- Response `201`: created consent record with timestamp.

### 2) Candidate Profile

#### `GET /candidate/profile`
- Auth: `candidate`
- Tenant scope: self only
- Response `200`:
```json
{
  "data": {
    "candidate_id": "cand_01",
    "profile_version": 7,
    "headline": "Field Operations Supervisor",
    "summary": "text",
    "location": "Houston, TX",
    "matchability_status": "ready",
    "missing_high_impact_fields": [],
    "canonical_resume_json": {}
  },
  "meta": { "trace_id": "trc_10", "request_id": "req_10" }
}
```

#### `PUT /candidate/profile`
- Auth: `candidate`
- Idempotency: required
- Request:
```json
{
  "headline": "Field Operations Supervisor",
  "summary": "text",
  "location": "Houston, TX",
  "preferences": {
    "work_mode": ["onsite", "hybrid"],
    "radius_km": 80
  }
}
```
- Response `200`: returns updated profile + incremented `profile_version`.

#### `POST /candidate/documents`
- Auth: `candidate`
- Idempotency: required
- Request:
```json
{
  "file_name": "resume.pdf",
  "mime_type": "application/pdf",
  "sha256": "hex-string"
}
```
- Response `201`:
```json
{
  "data": {
    "document_id": "doc_01",
    "upload_url": "https://signed-url",
    "expires_at": "2026-02-18T15:00:00Z"
  },
  "meta": { "trace_id": "trc_11", "request_id": "req_11" }
}
```

#### `GET /candidate/matches`
- Auth: `candidate`
- Query: `limit`, `cursor`
- Response `200`: list of match cards with `job_id`, `score`, `explainability_snippet`, `invite_status`.

#### `GET /candidate/profile/matchability`
- Endpoint ID: `CAND-005`
- Auth: `candidate`
- Tenant scope: self only
- Response `200`:
```json
{
  "data": {
    "status": "ready",
    "required_fields": ["headline", "location", "skills"],
    "missing_fields": [],
    "high_impact_missing_fields": []
  },
  "meta": { "trace_id": "trc_12", "request_id": "req_12" }
}
```

#### `PUT /candidate/profile/draft`
- Endpoint ID: `CAND-006`
- Auth: `candidate`
- Idempotency: required
- Request:
```json
{
  "sections": [
    { "type": "summary", "content": "Entry-level technician..." },
    { "type": "education", "items": [] }
  ],
  "autosave": true
}
```
- Response `200`: draft saved with `draft_version` and `last_saved_at`.

#### `POST /candidate/profile/builder/start`
- Endpoint ID: `CAND-007`
- Auth: `candidate`
- Idempotency: required
- Request:
```json
{
  "mode": "no_resume",
  "template": "starter"
}
```
- Response `201`: creates starter profile sections for resume-builder flow.

#### `POST /candidate/documents/{id}/parse/retry`
- Endpoint ID: `CAND-008`
- Auth: `candidate|platform_admin`
- Idempotency: required
- Request:
```json
{
  "reason": "manual_retry_after_failure"
}
```
- Response `202`: parse retry queued.

### 3) Employer and Job Setup

#### `POST /organizations`
- Auth: `employer_admin`
- Idempotency: required
- Request:
```json
{
  "name": "Acme HVAC LLC",
  "industry": "trades",
  "timezone": "America/Chicago"
}
```
- Response `201`: `organization_id`.

#### `POST /jobs`
- Auth: `employer_admin|hiring_manager` (with permission)
- Idempotency: required
- Request:
```json
{
  "organization_id": "org_01",
  "title": "HVAC Field Service Supervisor",
  "location": "Houston, TX",
  "remote_policy": "onsite",
  "pay_min": 90000,
  "pay_max": 115000,
  "requirements": [
    { "type": "must_have", "key": "experience_years", "value": "5+" },
    { "type": "dealbreaker", "key": "cert_epa_608", "value": true }
  ],
  "question_kit": [
    { "type": "text", "prompt": "Describe your dispatch process." }
  ]
}
```
- Response `201`: job resource with `status: "draft"`.

#### `PUT /jobs/{id}`
- Auth: `employer_admin|hiring_manager`
- Idempotency: required
- Request: partial update for job fields, requirements, and question kit.
- Response `200`: updated job with incremented `job_version`.

#### `POST /jobs/{id}/activate`
- Auth: `employer_admin|hiring_manager`
- Idempotency: required
- Guard: required fields + question kit valid
- Response `200`: `status: "active"`, returns transition metadata.

#### `PUT /jobs/{id}/automation-settings`
- Auth: `employer_admin` (or delegated permission)
- Idempotency: required
- Request:
```json
{
  "top_n": 25,
  "score_threshold": 72.0,
  "daily_invite_cap": 30,
  "cooldown_hours": 168,
  "invite_expiry_hours": 120
}
```
- Response `200`: persisted settings.

#### `PUT /jobs/{id}/draft`
- Endpoint ID: `EMP-006`
- Auth: `employer_admin|hiring_manager`
- Idempotency: required
- Request:
```json
{
  "title": "HVAC Field Service Supervisor",
  "location": "Houston, TX",
  "requirements": [],
  "question_kit": [],
  "autosave": true
}
```
- Response `200`:
```json
{
  "data": {
    "job_id": "job_01",
    "draft_version": 4,
    "last_saved_at": "2026-02-18T15:40:00Z"
  },
  "meta": { "trace_id": "trc_22", "request_id": "req_22" }
}
```

### 4) Invite and Q&A

#### `GET /invites/{id}`
- Auth: `candidate` (self invite), `platform_admin`
- Response `200`: invite details, status, expiry, job summary.

#### `POST /qa/sessions/{id}/start`
- Auth: `candidate`
- Idempotency: required
- Guard: invite/session valid and not expired.
- Response `200`: session moves to `in_progress`.

#### `POST /qa/sessions/{id}/autosave`
- Auth: `candidate`
- Idempotency: required
- Request:
```json
{
  "answers": [
    { "question_id": "q_01", "answer_text": "text" }
  ],
  "client_updated_at": "2026-02-18T15:20:00Z"
}
```
- Response `200`: autosave acknowledgement with server revision.

#### `POST /qa/sessions/{id}/submit`
- Auth: `candidate`
- Idempotency: required
- Guard: required answers complete and valid.
- Response `202`: `status: "submitted"`, packet build queued.

### 5) Employer Packet Review

#### `GET /employer/packets`
- Auth: `employer_admin|hiring_manager`
- Query: `job_id`, `status`, `limit`, `cursor`
- Response `200`: packet list ordered by `ready_at desc`.

#### `GET /employer/packets/{id}`
- Auth: `employer_admin|hiring_manager`
- Response `200`:
```json
{
  "data": {
    "packet_id": "pkt_01",
    "job_id": "job_01",
    "candidate_id": "cand_01",
    "summary_text": "text",
    "highlights": [],
    "gaps": [],
    "authenticity": {
      "policy_result": "mixed_assistance",
      "score": 61,
      "confidence": 0.72,
      "reason_codes": ["high_paste_ratio"]
    },
    "transcript": []
  },
  "meta": { "trace_id": "trc_30", "request_id": "req_30" }
}
```

#### `POST /employer/packets/{id}/actions`
- Auth: `employer_admin|hiring_manager`
- Idempotency: required
- Request:
```json
{
  "action": "interview",
  "note": "Strong operational leadership."
}
```
- Response `201`: created `packet_action` with actor and timestamp.

### 6) Admin/Ops

#### `GET /admin/failures`
- Auth: `platform_admin`
- Query: `failure_type`, `status`, `limit`, `cursor`
- Response `200`: list of failed jobs/events with replay eligibility.

#### `POST /admin/failures/{id}/replay`
- Auth: `platform_admin`
- Idempotency: required
- Request:
```json
{
  "reason": "Transient upstream timeout recovered"
}
```
- Response `202`: replay queued and audit event emitted.

#### `POST /gdpr/export`
- Auth: `platform_admin` or `candidate` (self)
- Idempotency: required
- Request: `{ "subject_user_id": "usr_01" }`
- Response `202`: export job queued.

#### `POST /gdpr/delete`
- Auth: `platform_admin` or `candidate` (self)
- Idempotency: required
- Request:
```json
{
  "subject_user_id": "usr_01",
  "mode": "anonymize",
  "reason": "user_requested"
}
```
- Response `202`: deletion/anonymization job queued.

## HTTP Status Usage
- `200` read/update success.
- `201` created.
- `202` accepted for async processing.
- `400` validation failure.
- `401` unauthenticated.
- `403` forbidden.
- `404` not found.
- `409` conflict/idempotency mismatch/state conflict.
- `429` rate limited.
- `500` internal error.
