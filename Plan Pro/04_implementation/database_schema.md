# Database Schema and Migration Plan

## Owns
- Physical schema strategy and migration sequencing.

## Excludes
- Business semantics of fields (see `../02_architecture/data_model.md`).
- Endpoint contract details (see `api_contracts.md`).

## Schema Principles
- Postgres is source of truth.
- UUID primary keys.
- `created_at` and `updated_at` on mutable tables.
- Soft delete only where business flow requires history.
- JSONB for extensible payloads with explicit contract ownership.
- Strong constraints for state machine fields (`CHECK` or `ENUM`).
- Canonical resume JSON is the authoritative profile source; normalized tables are derived projections.

## PostgreSQL DDL (Initial v1)

```sql
-- 001_extensions.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 002_enums.sql
DO $$ BEGIN
    CREATE TYPE role_type AS ENUM ('candidate', 'employer_admin', 'hiring_manager', 'platform_admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'disabled', 'pending_verification');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE invite_status AS ENUM ('queued', 'sent', 'opened', 'started', 'submitted', 'expired', 'cancelled', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE qa_session_status AS ENUM ('created', 'in_progress', 'submitted', 'expired', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE packet_status AS ENUM ('building', 'ready', 'reviewed', 'actioned', 'superseded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE packet_action_type AS ENUM ('interview', 'clarify', 'reject');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE requirement_type AS ENUM ('must_have', 'nice_to_have', 'dealbreaker');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE document_source_type AS ENUM ('pdf_upload', 'doc_upload', 'docx_upload', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE parse_status AS ENUM ('queued', 'processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE candidate_profile_bootstrap_status AS ENUM ('not_started', 'uploading', 'parsing', 'review_required', 'manual_builder', 'ready', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 010_identity.sql
CREATE TABLE IF NOT EXISTS app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT,
    status user_status NOT NULL DEFAULT 'pending_verification',
    email_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    role role_type NOT NULL,
    organization_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role, organization_id)
);

CREATE TABLE IF NOT EXISTS consent_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    consent_version TEXT NOT NULL,
    accepted BOOLEAN NOT NULL,
    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 020_organization.sql
CREATE TABLE IF NOT EXISTS organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    billing_status TEXT NOT NULL DEFAULT 'trial',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_member (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    role role_type NOT NULL CHECK (role IN ('employer_admin', 'hiring_manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS employer_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organization(id) ON DELETE CASCADE,
    branding_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 030_candidate.sql
CREATE TABLE IF NOT EXISTS candidate_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE,
    profile_version INTEGER NOT NULL DEFAULT 1,
    draft_version INTEGER NOT NULL DEFAULT 1,
    headline TEXT,
    summary TEXT,
    primary_location TEXT,
    radius_km INTEGER,
    remote_preference TEXT,
    matchability_status TEXT NOT NULL DEFAULT 'not_ready',
    bootstrap_status candidate_profile_bootstrap_status NOT NULL DEFAULT 'not_started',
    last_saved_at TIMESTAMPTZ,
    canonical_resume_json JSONB NOT NULL DEFAULT '{"schema_version":"1.0","version":1,"sections":[],"meta":{}}'::jsonb,
    profile_embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT candidate_profile_canonical_is_object CHECK (jsonb_typeof(canonical_resume_json) = 'object'),
    CONSTRAINT candidate_profile_canonical_has_schema_version CHECK (canonical_resume_json ? 'schema_version'),
    CONSTRAINT candidate_profile_canonical_has_version CHECK (canonical_resume_json ? 'version'),
    CONSTRAINT candidate_profile_canonical_has_sections CHECK (canonical_resume_json ? 'sections'),
    CONSTRAINT candidate_profile_canonical_has_meta CHECK (canonical_resume_json ? 'meta')
);

CREATE TABLE IF NOT EXISTS candidate_profile_version (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    profile_version INTEGER NOT NULL,
    canonical_resume_json JSONB NOT NULL,
    schema_version TEXT NOT NULL,
    normalization_version TEXT,
    parser_version TEXT,
    material_change_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT candidate_profile_version_canonical_is_object CHECK (jsonb_typeof(canonical_resume_json) = 'object'),
    UNIQUE (candidate_id, profile_version)
);

CREATE TABLE IF NOT EXISTS candidate_skill (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    label TEXT NOT NULL,
    level TEXT,
    years NUMERIC(4,1),
    confidence NUMERIC(4,3),
    source TEXT NOT NULL DEFAULT 'parser',
    projection_source_profile_version INTEGER NOT NULL DEFAULT 1,
    projection_version TEXT NOT NULL DEFAULT 'v1',
    projection_built_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (candidate_id, skill_id)
);

CREATE TABLE IF NOT EXISTS candidate_certification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    cert_id TEXT NOT NULL,
    label TEXT NOT NULL,
    issuer TEXT,
    status TEXT,
    issued_on DATE,
    expires_on DATE,
    evidence_item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    projection_source_profile_version INTEGER NOT NULL DEFAULT 1,
    projection_version TEXT NOT NULL DEFAULT 'v1',
    projection_built_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (candidate_id, cert_id)
);

CREATE TABLE IF NOT EXISTS candidate_preference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL UNIQUE REFERENCES candidate_profile(id) ON DELETE CASCADE,
    preference_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by_source TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidate_document (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    source_type document_source_type NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_uri TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (candidate_id, sha256)
);

CREATE TABLE IF NOT EXISTS document_parse_job (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES candidate_document(id) ON DELETE CASCADE,
    parser_version TEXT NOT NULL,
    status parse_status NOT NULL DEFAULT 'queued',
    attempts INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (document_id, parser_version)
);

CREATE TABLE IF NOT EXISTS document_parse_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parse_job_id UUID NOT NULL UNIQUE REFERENCES document_parse_job(id) ON DELETE CASCADE,
    extracted_text_uri TEXT,
    structured_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    quality_score NUMERIC(4,3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 040_job.sql
CREATE TABLE IF NOT EXISTS job_posting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    job_version INTEGER NOT NULL DEFAULT 1,
    draft_version INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    remote_policy TEXT,
    pay_min NUMERIC(12,2),
    pay_max NUMERIC(12,2),
    status job_status NOT NULL DEFAULT 'draft',
    last_saved_at TIMESTAMPTZ,
    automation_settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    job_embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_requirement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_posting(id) ON DELETE CASCADE,
    requirement_type requirement_type NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    priority SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_question_kit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL UNIQUE REFERENCES job_posting(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_question (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kit_id UUID NOT NULL REFERENCES job_question_kit(id) ON DELETE CASCADE,
    question_order SMALLINT NOT NULL,
    question_type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    constraints_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (kit_id, question_order)
);

-- 050_matching_and_invites.sql
CREATE TABLE IF NOT EXISTS match_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_posting(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    scoring_version TEXT NOT NULL,
    total_score NUMERIC(5,2) NOT NULL,
    sub_scores_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    explainability_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    projection_source_profile_version INTEGER,
    projection_source_job_version INTEGER,
    projection_built_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    computed_at TIMESTAMPTZ NOT NULL,
    UNIQUE (job_id, candidate_id, scoring_version)
);

CREATE TABLE IF NOT EXISTS job_shortlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_posting(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    shortlist_version INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    exited_at TIMESTAMPTZ,
    UNIQUE (job_id, candidate_id, shortlist_version)
);

CREATE TABLE IF NOT EXISTS invite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_posting(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    status invite_status NOT NULL DEFAULT 'queued',
    expires_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    cooldown_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invite_delivery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_id UUID NOT NULL REFERENCES invite(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    provider_message_id TEXT,
    state TEXT NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 060_qa_and_packet.sql
CREATE TABLE IF NOT EXISTS qa_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_id UUID NOT NULL UNIQUE REFERENCES invite(id) ON DELETE CASCADE,
    status qa_session_status NOT NULL DEFAULT 'created',
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_answer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES qa_session(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES job_question(id) ON DELETE CASCADE,
    answer_text TEXT,
    answer_json JSONB,
    evidence_links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (session_id, question_id)
);

CREATE TABLE IF NOT EXISTS qa_response_signal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES qa_session(id) ON DELETE CASCADE,
    question_id UUID REFERENCES job_question(id) ON DELETE SET NULL,
    signal_type TEXT NOT NULL,
    signal_value_json JSONB NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_authenticity_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL UNIQUE REFERENCES qa_session(id) ON DELETE CASCADE,
    model_version TEXT NOT NULL,
    authenticity_score NUMERIC(5,2) NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    policy_result TEXT NOT NULL,
    reason_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidate_packet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_posting(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES qa_session(id) ON DELETE CASCADE,
    status packet_status NOT NULL DEFAULT 'building',
    summary_text TEXT,
    highlights_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    gaps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    superseded_by_packet_id UUID REFERENCES candidate_packet(id) ON DELETE SET NULL,
    ready_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packet_action (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    packet_id UUID NOT NULL REFERENCES candidate_packet(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL REFERENCES app_user(id),
    action packet_action_type NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 070_ops.sql
CREATE TABLE IF NOT EXISTS subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organization(id) ON DELETE CASCADE,
    plan_code TEXT NOT NULL,
    status TEXT NOT NULL,
    active_jobs_limit INTEGER,
    packet_limit INTEGER,
    seat_limit INTEGER,
    billing_cycle_anchor DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_counter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    billing_month DATE NOT NULL,
    packets_generated INTEGER NOT NULL DEFAULT 0,
    invites_sent INTEGER NOT NULL DEFAULT 0,
    active_jobs INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, billing_month)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES app_user(id),
    action TEXT NOT NULL,
    object_type TEXT NOT NULL,
    object_id UUID,
    reason TEXT,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outbox_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_version TEXT NOT NULL,
    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,
    idempotency_key TEXT NOT NULL,
    payload_json JSONB NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (event_name, idempotency_key)
);

CREATE TABLE IF NOT EXISTS inbox_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_name TEXT NOT NULL,
    consumer_name TEXT NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'received',
    error_message TEXT
);

-- 080_indexes.sql
CREATE INDEX IF NOT EXISTS idx_user_role_user_id ON user_role(user_id);
CREATE INDEX IF NOT EXISTS idx_org_member_org_id ON organization_member(organization_id);
CREATE INDEX IF NOT EXISTS idx_candidate_profile_user_id ON candidate_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_profile_version_candidate_id ON candidate_profile_version(candidate_id, profile_version DESC);
CREATE INDEX IF NOT EXISTS idx_candidate_document_candidate_id ON candidate_document(candidate_id);
CREATE INDEX IF NOT EXISTS idx_parse_job_status ON document_parse_job(status);
CREATE INDEX IF NOT EXISTS idx_job_posting_org_status ON job_posting(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_job_requirement_job_id ON job_requirement(job_id);
CREATE INDEX IF NOT EXISTS idx_match_score_job_candidate ON match_score(job_id, candidate_id);
CREATE INDEX IF NOT EXISTS idx_match_score_projection_built_at ON match_score(projection_built_at DESC);
CREATE INDEX IF NOT EXISTS idx_shortlist_job_active ON job_shortlist(job_id, is_active);
CREATE INDEX IF NOT EXISTS idx_invite_job_status ON invite(job_id, status);
CREATE INDEX IF NOT EXISTS idx_invite_candidate_status ON invite(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_qa_session_status ON qa_session(status);
CREATE INDEX IF NOT EXISTS idx_packet_job_status ON candidate_packet(job_id, status);
CREATE INDEX IF NOT EXISTS idx_packet_candidate_job ON candidate_packet(candidate_id, job_id);
CREATE INDEX IF NOT EXISTS idx_packet_action_packet_id ON packet_action(packet_id);
CREATE INDEX IF NOT EXISTS idx_usage_counter_org_month ON usage_counter(organization_id, billing_month);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outbox_unpublished ON outbox_event(published_at) WHERE published_at IS NULL;

-- Optional vector indexes (enable when volume justifies):
-- CREATE INDEX idx_candidate_profile_embedding_ivfflat
--   ON candidate_profile USING ivfflat (profile_embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX idx_job_posting_embedding_ivfflat
--   ON job_posting USING ivfflat (job_embedding vector_cosine_ops) WITH (lists = 100);
```

## Migration Policy
- Forward-only versioned migrations.
- Breaking migration requires:
  - expand phase (new columns/tables),
  - dual-write/dual-read window,
  - contract cutover,
  - cleanup phase.

## Canonical vs Projection Contract
- `candidate_profile.canonical_resume_json` is the only write-authoritative resume payload.
- `candidate_profile_version` stores immutable version snapshots for audit/replay.
- `candidate_skill`, `candidate_certification`, and `match_score` are rebuildable projections.
- Projection drift is detected using `projection_*` fields and corrected by recompute jobs.

## Non-Canonical Domain Extension Contract
- Domain-specific data is allowed only as namespaced extensions inside canonical JSON.
- Reserved namespace:
  - item-level: `sections[].items[].extra_fields.domain.<domain_id>.*`
  - root-level (optional): `domain_extensions.<domain_id>.*`
- Canonical core keys (`schema_version`, `version`, `sections`, `meta`) cannot be overridden by extension keys.
- Extension payloads must include `domain_pack_version` at the domain namespace root.
- Unknown domain namespaces are persisted as-is, but ignored by projection builders until explicitly whitelisted.
- Projection builders parse only approved domain packs and must never mutate or delete unknown extension keys.

## Initial Migration Sequence (Implementation Order)
1. `001-002`: extensions and enums.
2. `010-020`: identity + organization.
3. `030`: candidate profile and document/parse pipeline.
4. `040`: job and question kit.
5. `050`: matching/shortlist/invites.
6. `060`: Q&A and packet pipeline.
7. `070`: billing, audit, outbox/inbox.
8. `080`: indexes and performance tuning.

## Safety Requirements
- Migrations run in CI on clean DB.
- Rollback path documented for every release.
- Index review for high-cardinality query paths.
- Staging migration rehearsal required before production promotion.
