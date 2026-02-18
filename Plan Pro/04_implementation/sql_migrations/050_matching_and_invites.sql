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
