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
