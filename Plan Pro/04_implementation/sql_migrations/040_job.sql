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
