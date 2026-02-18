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
