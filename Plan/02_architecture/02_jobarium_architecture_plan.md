# Jobarium Architecture Plan (MVP)

## Scope and Constraints
- Architecture is **wedge-agnostic** (domain model does not depend on one profession).
- GTM assumption for rollout planning: **DMV trades**.
- Target: **realistic launch in ~8 weeks**.
- Team: **2 developers** (CEO + CTO) with AI assistance.
- AI posture: **minimal AI in MVP** (embeddings, vector retrieval, packet summaries).
- Compliance target at launch: **OWASP+ best practices + GDPR**; SOC2-ready design later.

## System Architecture (GCP)

### Core Principles
1. Keep system of record simple and relational.
2. Use event-driven processing for asynchronous workflows.
3. Isolate expensive/AI tasks behind queues and idempotent workers.
4. Prefer managed services to reduce ops overhead for a small team.

### Runtime Components
- **Frontend Web App**: candidate + employer + admin portals.
- **API Gateway + HTTPS Load Balancer + Cloud Armor**: edge routing and protection.
- **Cloud Run services** (modular monolith style with service boundaries):
  - Identity & Access
  - Candidate Profile
  - Employer/Organization
  - Job & Question Kit
  - Matching & Ranking
  - Automation & Invitations
  - Q&A Session
  - Packet Builder
  - Notifications
  - Billing (basic)
- **Cloud SQL (PostgreSQL)**: source of truth.
- **Memorystore (Redis)**: short-lived cache, rate limits, invite cooldowns, shortlist snapshots.
- **Cloud Storage**: resumes, attachments, generated packet exports.
- **Pub/Sub**: event backbone.
- **Cloud Tasks**: controlled dispatch for notifications/invites.
- **Cloud Scheduler**: hourly shortlist recompute + periodic maintenance jobs.
- **Document AI (OCR/Form Parser)**: robust extraction fallback for scanned PDFs/images.
- **Vertex AI**:
  - Embeddings generation
  - Vector index retrieval (or managed vector-capable store)
  - Packet summary generation
- **Cloud Logging + Monitoring + Error Reporting + Trace**: observability.
- **Secret Manager + KMS**: secret and key handling.

## High-Level Flow
1. Candidate updates profile -> profile normalized -> embeddings refreshed -> `profile_updated` event.
2. Employer updates role/question kit -> embeddings refreshed -> `job_updated` event.
3. Matching service processes events + hourly sweeps:
   - hard filters,
   - top-K vector retrieval,
   - deterministic scoring,
   - shortlist changes emitted.
4. Automation service handles shortlist entry events:
   - enforce caps/cooldowns,
   - create invite,
   - dispatch via Cloud Tasks -> notifications.
5. Candidate submits Q&A:
   - persist answers,
   - trigger packet build,
   - generate summary,
   - mark packet ready,
   - notify HR.

## CV Parsing and Ingestion Pipeline (PDF/DOC/DOCX)

### Goals
- Accept common resume formats with high extraction quality.
- Keep raw document immutable while allowing parser improvements over time.
- Produce both machine-structured and human-readable profile data.

### Supported Inputs (MVP)
- `.pdf` (text and scanned)
- `.docx`
- `.doc` (best-effort via conversion)

### Processing Stages
1. **Upload and virus scan**
   - Candidate uploads CV to signed URL.
   - File lands in Cloud Storage (`raw` bucket path).
   - Antivirus and mime/type validation run asynchronously.
2. **Text extraction**
   - Primary parser for native text PDFs and DOCX.
   - Fallback to Document AI OCR for scanned/image-heavy PDFs.
3. **Section segmentation**
   - Split into structured blocks: profile header, experience, education, certifications, skills, projects, links.
4. **Entity extraction + normalization**
   - Standardize titles, skills, date ranges, employers, certifications, locations.
   - Resolve synonyms into canonical taxonomy IDs where possible.
5. **Confidence scoring + review flags**
   - Assign confidence per field and aggregate quality score.
   - Low-confidence fields are surfaced for user confirmation in UI.
6. **Persist and emit events**
   - Save raw extraction, structured JSON, and normalized entities.
   - Emit enrichment trigger event for embeddings and ranking refresh.

### Parsing Rules (Pragmatic)
- Parser does not overwrite user-confirmed fields automatically.
- Most recent user edit wins unless user chooses "re-apply from CV."
- Keep parser deterministic where possible; use AI extraction only where needed.
- Maintain parser versioning to reprocess old CVs safely.

## Background Enrichment Pipeline (Continuous)

### Purpose
Create a reliable "always improving" candidate/job signal layer without blocking user workflows.

### Enrichment Tasks
- Canonicalize skills and map aliases.
- Infer role families and seniority bands.
- Estimate experience years from timelines (with confidence).
- Derive location compatibility tokens (radius, remote/hybrid fit).
- Recompute embeddings after relevant updates.
- Refresh match candidates for affected jobs/candidates only (delta-based).

### Trigger Sources
- `candidate_document.parsed`
- `profile.updated`
- `job.updated`
- scheduled re-enrichment (nightly for stale records)
- taxonomy/model version bumps

### Orchestration Pattern
- Pub/Sub event fan-out -> dedicated Cloud Run workers.
- Cloud Tasks for throttled heavy jobs (OCR, LLM extraction, re-embedding waves).
- Idempotent jobs with dedupe keys: `(entity_id, enrichment_type, version)`.
- Dead-letter topics + replay tooling for failed batches.

### Freshness Model
- **Near-real-time path**: user-triggered updates within minutes.
- **Batch maintenance path**: nightly backfill and quality repairs.
- **SLA targets (initial)**:
  - CV parse completion p95: < 3 minutes
  - enrichment completion p95: < 10 minutes

### Safety and Cost Controls
- Progressive parsing: cheap deterministic parser first, OCR/AI fallback only if needed.
- Skip unchanged sections using content hashes.
- Apply concurrency caps per tenant to avoid noisy-neighbor effects.
- Cache extraction outputs by document hash.

## Domain Entities (Core Data Model)

### Identity and Access
- `user`
  - id, email, phone, password_hash/federated_id, status, created_at
- `user_role`
  - user_id, role (`candidate`, `employer_admin`, `hiring_manager`, `platform_admin`)
- `consent_record`
  - user_id, consent_type, version, accepted_at, revoked_at

### Organization and Employer
- `organization`
  - id, name, industry, size_band, billing_status
- `organization_member`
  - organization_id, user_id, role
- `employer_profile`
  - organization_id, brand/meta preferences, timezone

### Candidate
- `candidate_profile`
  - user_id, headline, summary, years_experience, location, radius_km, remote_pref
- `candidate_skill`
  - candidate_id, skill_id, level, years
- `candidate_certification`
  - candidate_id, cert_id, issuer, expires_at
- `candidate_preference`
  - candidate_id, pay_min, pay_type, shift_pref, availability_date
- `candidate_document`
  - candidate_id, type, storage_uri, parsed_status
- `document_parse_job`
  - id, candidate_id, document_id, parser_version, status, attempts, started_at, finished_at
- `document_parse_result`
  - parse_job_id, extracted_text_uri, structured_json, confidence_json, quality_score
- `candidate_enrichment_state`
  - candidate_id, enrichment_version, last_enriched_at, stale_reason, status
- `candidate_profile_signal`
  - candidate_id, signal_type, signal_value_json, confidence, source

### Job and Requirements
- `job_posting`
  - id, organization_id, title, description, location, remote_policy, pay_min/max, status
- `job_requirement`
  - job_id, requirement_type (`must_have`, `nice_to_have`, `dealbreaker`), key, value
- `job_question_kit`
  - id, job_id, status, version
- `job_question`
  - kit_id, type, prompt, options_json, constraints

### Matching and Automation
- `match_score`
  - job_id, candidate_id, total_score, sub_scores_json, computed_at
- `job_shortlist`
  - job_id, candidate_id, rank, entered_at, exited_at
- `invite`
  - id, job_id, candidate_id, status, expires_at, sent_at, cooldown_key
- `invite_delivery`
  - invite_id, channel (`email`, `sms`), provider_id, state

### Q&A and Packets
- `qa_session`
  - id, invite_id, status, started_at, submitted_at
- `qa_answer`
  - session_id, question_id, answer_text/value, evidence_links_json
- `qa_response_signal`
  - session_id, question_id, signal_type, signal_value_json, captured_at
- `qa_authenticity_assessment`
  - session_id, authenticity_score, ai_assist_likelihood, confidence, policy_result, assessed_at
- `candidate_packet`
  - id, job_id, candidate_id, session_id, summary_text, highlights_json, gaps_json, status
- `packet_action`
  - packet_id, actor_user_id, action (`interview`, `clarify`, `reject`), note, created_at

### Billing and Audit
- `subscription`
  - organization_id, plan_code, active_jobs_limit, packet_limit, seat_limit
- `usage_counter`
  - organization_id, month, packets_generated, invites_sent, active_jobs
- `audit_log`
  - actor_id, action, object_type, object_id, metadata_json, created_at

## Event Model (Pub/Sub Topics)
- `profile.updated`
- `job.updated`
- `candidate.document.uploaded`
- `candidate.document.parsed`
- `candidate.enrichment.requested`
- `candidate.enrichment.completed`
- `matching.shortlist.changed`
- `invite.created`
- `invite.expired`
- `qa.submitted`
- `qa.authenticity.assessed`
- `packet.ready`
- `billing.usage.updated`

Event requirements:
- idempotency key per event
- at-least-once consumer design
- dead-letter topics for failed processing

## Matching and Ranking Design

### Stage 1: Hard Filters (fail-fast)
- authorization eligibility
- location/radius/remote compatibility
- pay overlap
- start-date window
- required cert/license

### Stage 2: Candidate Retrieval
- embedding similarity search to get top K (200-500 typical).

### Stage 3: Deterministic Score
- weighted normalized score in [0,100], with explainable sub-scores.
- store sub-scores for HR explainability and model tuning.

### Stage 4: Shortlist Diff and Trigger
- compare new shortlist to prior snapshot.
- for newly entered candidates, emit automation trigger event.

## Q&A Authenticity and AI-Assistance Detection

### Why it matters
Employers need confidence that submitted answers reflect candidate involvement, not fully AI-generated responses.

### Product policy (balanced)
- Allow light assistance (grammar fixes, short rewrites).
- Flag likely heavy outsourcing/rewriting.
- Never auto-reject by model alone in MVP; provide trust signals for human decision.
- Show transparent policy notice to candidates before they start Q&A.

### Detection signals (multi-signal, not single-score only)
1. **Behavioral signals**
   - time-to-first-keystroke, typing burst patterns, paste ratio, full-answer paste events, edit churn.
2. **Linguistic consistency**
   - consistency with candidate profile language level/history, abrupt style shifts across answers.
3. **Cross-answer coherence**
   - contradictions in timeline, tools, domain details, and stated experience.
4. **Prompt leakage patterns**
   - generic template artifacts and known assistant markers.

### Pipeline flow
1. Capture session telemetry and answer events.
2. Extract response signals per answer and session.
3. Compute authenticity assessment (score + confidence + reason codes).
4. Attach "authenticity insight" to candidate packet:
   - `likely_self_authored`
   - `mixed_assistance`
   - `heavy_assistance_suspected`
5. Emit `qa.authenticity.assessed` before packet finalization.

### Employer-facing output
- Trust badge in packet header.
- Brief reason codes (example: "high paste ratio", "inconsistent technical depth").
- Recommendation: "ask 2 verification follow-up questions."

### Candidate-facing safeguards
- Pre-submit notice: acceptable vs unacceptable assistance.
- Soft warning on suspicious behavior during session (optional in MVP).
- Appeal/review path for false positives.

### Risk controls
- Use confidence thresholds; low-confidence cases default to neutral.
- Keep explainability logs for dispute handling.
- Monitor fairness across candidate language backgrounds.

## Data and Storage Strategy
- Postgres is authoritative for transactional state.
- Redis stores ephemeral values:
  - rate limit tokens,
  - invite cooldown locks,
  - shortlist cache,
  - short TTL read caches.
- Cloud Storage stores files and packet artifacts.
  - `raw/` immutable user uploads
  - `processed/` extracted text and structured outputs
  - `artifacts/` packet exports and generated documents
- Vector index stores embeddings with metadata references to canonical records.

## Security and GDPR Baseline
- TLS everywhere, strict CORS, Cloud Armor WAF policies.
- RBAC enforced at API layer and query layer.
- PII minimization and field-level classification.
- Encryption at rest (managed keys) + optional CMEK for sensitive stores.
- Audit logging for admin and sensitive actions.
- GDPR controls in MVP:
  - explicit consent records,
  - data export endpoint,
  - delete/anonymize workflow,
  - retention policy jobs.
- Q&A telemetry policy:
  - explicit consent notice for anti-fraud/authenticity checks,
  - minimize captured behavioral data,
  - retention limits and role-restricted access.

## Proposed Tech Stack (Pragmatic)
- Frontend: Next.js (TypeScript), server actions + API client.
- Backend: TypeScript on Cloud Run (NestJS or Fastify modular architecture).
- Database: Cloud SQL PostgreSQL + Prisma/Drizzle ORM.
- Queue/Event: Pub/Sub + Cloud Tasks.
- Cache: Redis (Memorystore).
- Auth: first-party auth + optional Google OAuth; JWT with short-lived access + rotating refresh.
- Messaging: SendGrid (email), Twilio (SMS) or GCP partner equivalent.
- Payments: Stripe (hybrid model support).
- AI: Vertex AI embeddings + summarization.
- Authenticity scoring:
  - rule-based signal engine first,
  - optional lightweight classifier in phase 1.5 after enough labeled data.
- Parsing:
  - `pdf-parse`/`pdfjs` for text PDFs,
  - `mammoth` or equivalent for DOCX,
  - Document AI OCR fallback for scanned files.
- IaC: Terraform (minimum viable modules).
- CI/CD: GitHub Actions -> Artifact Registry -> Cloud Run deploy.

## Eight-Week Delivery Skeleton (Architecture-Centric)
- **Week 1**: repo/platform bootstrap, IaC baseline, auth, org/user model.
- **Week 2**: candidate profile + CV upload + parser v1 + job posting + requirements + question kits.
- **Week 3**: matching pipeline v1 (hard filters + retrieval + scoring), shortlist persistence.
- **Week 4**: enrichment workers (skills/title/location normalization), automation engine (invite rules, caps/cooldowns), email/SMS dispatch.
- **Week 5**: Q&A sessions + packet builder + summary generation.
- **Week 6**: employer packet inbox/actions + authenticity badge/reason codes + basic billing counters.
- **Week 7**: GDPR endpoints, audit logging, hardening, observability, load tuning.
- **Week 8**: end-to-end QA, parser/enrichment quality tuning, pilot onboarding tooling, launch readiness.

## Architecture Trade-Offs (Intentional)
- Modular monolith on Cloud Run now, service split later by load and team growth.
- AI-minimal now for speed/reliability; richer AI after metric validation.
- Event-driven internals increase complexity but are required for non-blocking automation.
- Integrations phased to prevent launch delay.

## Open Architecture Decisions (to Lock Next)
1. Single backend service vs multiple Cloud Run services at launch.
2. Vector storage choice: Vertex index vs Postgres+extension fallback.
3. Invite cadence policy defaults per job.
4. Final auth strategy (passwordless vs password+OAuth mix).
5. Exact billing limits and trial thresholds for hybrid pricing.
6. CV parser strategy for `.doc` legacy files (support now vs convert-only policy).
7. Confidence threshold for "auto-apply parsed fields" vs "require user confirmation."
8. Default authenticity policy strictness by role type.
9. Candidate UX: hard block suspicious submissions vs soft-flag-only (recommended: soft-flag-only in MVP).
