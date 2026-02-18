# Personas and JTBD

## Owns
- Canonical persona definitions for MVP.
- JTBD statements per persona (to be expanded iteratively).

## Excludes
- Story acceptance criteria (see `user_stories.md`).
- UX flow implementation (see `../03_user_experience/*`).

## Persona Set (MVP)

### Persona 1: SMB Hiring Manager (Primary Buyer/User)
- Role: owner/ops manager/office manager hiring frontline roles.
- Main goal: fill roles fast with less screening overhead.
- Main pain: too many low-signal applications.

### Persona 2: Recruiter / HR Generalist (Primary Workflow Operator)
- Role: in-house recruiter handling multiple open roles.
- Main goal: standardize screening and reduce manual outreach.
- Main pain: noisy pipelines and context switching.

### Persona 3: Skilled Trade Candidate (Primary Supply User)
- Role: HVAC/electrician/plumbing/maintenance candidate.
- Main goal: get relevant opportunities without repetitive applications.
- Main pain: re-entering profile data and poor visibility.

### Persona 4: Skilled Tech-Savvy Professional Candidate
- Role: software/data/product professional.
- Main goal: discover high-fit jobs with clear match reasoning.
- Main pain: opaque ranking and generic job feeds.

### Persona 5: Mid-Level, Mid-Savvy Professional Candidate
- Role: operations/support/coordinator profile with mixed digital comfort.
- Main goal: complete hiring flow without friction.
- Main pain: confusing workflows and long forms.

### Persona 6: Platform Admin / Support Operator (Internal)
- Role: internal operations handling incidents/policy workflows.
- Main goal: resolve failures fast and maintain compliance.
- Main pain: incomplete observability and manual recovery effort.

### Persona 7: Early-Stage Job Seeker (Student / No Resume)
- Role: student, career switcher, or first-time applicant without a usable CV.
- Main goal: become matchable quickly by building a profile/resume in-product.
- Main pain: cannot start because they have no resume and low confidence in what to write.
- Product need: guided resume builder with progressive prompts, examples, autosave, and matchability feedback.
- Why this persona matters now: validates the resume-builder path instead of assuming CV upload as the only entry.

## Persona Prioritization
- Tier 1: Persona 1, 2, 3
- Tier 2: Persona 7, 4, 5
- Tier 3: Persona 6

## JTBD Statements (Canonical)

### Persona 1: SMB Hiring Manager
- `JTBD-P1-01`: As an SMB hiring manager, I want to receive only interview-ready candidate packets, so that I can hire faster without wasting time on low-signal applicants.
- `JTBD-P1-02`: As an SMB hiring manager, I want hard dealbreakers enforced before review, so that I can avoid late-stage disqualification surprises.

### Persona 2: Recruiter / HR Generalist
- `JTBD-P2-01`: As a recruiter, I want standardized packet views and one-click actions, so that I can process multiple open roles consistently and quickly.
- `JTBD-P2-02`: As a recruiter, I want explainable match reasons, so that I can trust and defend shortlist decisions.

### Persona 3: Skilled Trade Candidate
- `JTBD-P3-01`: As a skilled trade candidate, I want to upload my CV once and get profile prefill, so that I can avoid repetitive job applications.
- `JTBD-P3-02`: As a skilled trade candidate, I want transparent invite context before starting Q&A, so that I can decide quickly whether the role is worth my time.

### Persona 4: Skilled Tech-Savvy Professional Candidate
- `JTBD-P4-01`: As a tech-savvy candidate, I want clear match reasoning and preference controls, so that I can optimize my visibility for high-fit opportunities.
- `JTBD-P4-02`: As a tech-savvy candidate, I want low-friction profile import, so that I can start using the platform without manual duplication.

### Persona 5: Mid-Level, Mid-Savvy Professional Candidate
- `JTBD-P5-01`: As a mid-skill candidate, I want guided onboarding with plain-language prompts, so that I can complete my profile confidently without confusion.
- `JTBD-P5-02`: As a mid-skill candidate, I want mobile-friendly Q&A with autosave, so that I can complete screening reliably in short sessions.

### Persona 6: Platform Admin / Support Operator
- `JTBD-P6-01`: As a platform admin, I want visibility into failed jobs and replay controls, so that I can restore workflow health quickly.
- `JTBD-P6-02`: As a platform admin, I want auditable policy workflows (GDPR/authenticity appeals), so that compliance actions are traceable and safe.

### Persona 7: Early-Stage Job Seeker (Student / No Resume)
- `JTBD-P7-01`: As an early-stage job seeker without a resume, I want a guided resume builder with examples, so that I can become matchable even if I start from zero.
- `JTBD-P7-02`: As an early-stage job seeker without prior experience depth, I want progressive prompts and feedback on high-impact fields, so that I can build a credible profile step by step.

## Mapping Note
- Each JTBD should map to at least one story in `user_stories.md` and at least one stage in `../03_user_experience/*`.
