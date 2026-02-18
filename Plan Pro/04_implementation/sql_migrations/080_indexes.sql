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
