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
