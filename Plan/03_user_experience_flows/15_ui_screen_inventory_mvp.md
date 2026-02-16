# Jobarium UI Screen Inventory and Component Spec (MVP)

## Purpose
Define a complete MVP screen inventory for candidate and employer portals with component-level requirements.

This document closes the gap between journey flows and implementation by specifying:
- all required screens,
- key components per screen,
- required states (empty/loading/error),
- data dependencies,
- primary analytics events.

## Conventions
- Screen ID prefixes:
  - `CAND-` candidate portal
  - `EMP-` employer portal
  - `ADMIN-` admin/internal
  - `SHARED-` cross-portal
- Priority:
  - `P0` launch critical
  - `P1` post-launch high value

## Required Global UX States (all P0 screens)
- `loading`
- `empty`
- `error_recoverable`
- `error_blocking`
- `success_feedback` (for submit/save actions)

## Candidate Portal Screens

### SHARED-000: Role Intent Selection (`P0`)
- Goal: identify user intent early so downstream signup, consent, and onboarding are role-specific.
- Components:
  - candidate/employer role cards
  - role value proposition copy
  - continue action
- Data:
  - selected role intent (`candidate` or `employer`)
- States:
  - selection missing, save failed
- Analytics:
  - `role_intent_selected`

### CAND-001: Entry and Sign-Up (`P0`)
- Goal: create account with minimal friction.
- Components:
  - value proposition hero
  - sign-up form/OAuth buttons
  - login switch link
  - legal links
- Data:
  - auth providers availability
- States:
  - loading auth config, invalid credentials, duplicate email
- Analytics:
  - `candidate_signup_started`, `candidate_signup_completed`
- Notes:
  - this screen is entered after `SHARED-000` role intent selection

### CAND-001B: Account Verification and First Login Gate (`P0`)
- Goal: finish account creation and route user into onboarding.
- Components:
  - email verification confirmation
  - first-login redirect notice
  - onboarding lock gate message
- States:
  - verification pending, verification failed, verified
- Analytics:
  - `candidate_email_verified`, `candidate_first_login`

### CAND-002: Consent Capture at Account Creation (`P0`)
- Goal: collect terms/privacy/GDPR consent during sign-up (not inside onboarding wizard).
- Components:
  - consent items checklist
  - version label
  - accept/decline actions
- Data:
  - latest consent policy version
- States:
  - consent fetch failed, consent submit failed
- Analytics:
  - `candidate_consent_accepted`, `candidate_consent_declined`
- Notes:
  - consent checklist may differ by role (candidate vs employer)

### CAND-003: CV Upload/Import (`P0`)
- Goal: bootstrap profile quickly.
- Components:
  - file dropzone (PDF/DOC/DOCX)
  - LinkedIn/import actions (if enabled)
  - parse status card
  - additional document upload (certificates/portfolio)
- Data:
  - file upload token, parser status
- States:
  - file type invalid, parse failed, parse pending
- Analytics:
  - `cv_upload_started`, `cv_upload_success`, `cv_parse_failed`

### CAND-004: High-Impact Field Confirmation (`P0`)
- Goal: reach matchable profile threshold.
- Components:
  - required fields form (role, location/radius, auth, pay range, availability)
  - confidence highlights for parsed fields
  - save/continue
- Data:
  - parsed profile payload + confidence
- States:
  - missing required field, validation error
- Analytics:
  - `candidate_profile_required_completed`

### CAND-005: Profile Completeness Dashboard (`P0`)
- Goal: guide optional enrichment.
- Components:
  - progress meter
  - parsed vs missing fields summary
  - missing fields recommendation list
  - profile section cards (skills/certs/history)
- Data:
  - profile completeness score and section gaps
- States:
  - no recommendations, save failure
- Analytics:
  - `candidate_profile_updated`, `candidate_profile_completeness_changed`

### CAND-006: Matching Status and Curated Match List (`P0`)
- Goal: show asynchronous match progress and prevent candidate overwhelm.
- Components:
  - matching state card (in progress/match found/no fit yet)
  - compact shortlist-only match list (role, fit, status, why matched, action)
  - list visibility controls (default top 3, expand to top 10)
  - no-fit guidance and profile improvement prompt
  - nested invitation status per match
  - nested screening status per match
  - nested outcome status per match
- Data:
  - latest match run metadata, shortlisted matches, invite/screening/outcome state per match
- States:
  - no shortlisted matches, shortlisted with invite-ready item, shortlisted with queued invitation
- Analytics:
  - `candidate_matching_viewed`, `candidate_matchlist_expanded`, `candidate_match_clicked`

### CAND-006B: Invite Detail (Nested Under Matching) (`P0`)
- Goal: informed start/decline decision after invite is created.
- Components:
  - role summary card
  - employer summary card
  - pay/location/time estimate block
  - start/decline CTAs
- Data:
  - invite details, expiry, job metadata
- States:
  - expired invite, already started/completed invite
- Analytics:
  - `invite_viewed`, `invite_started`, `invite_declined`

### CAND-007: Q&A Session (`P0`)
- Goal: complete async pre-screen reliably.
- Components:
  - question renderer (yes/no, MCQ, short text, numeric, links)
  - autosave indicator
  - progress bar
  - authenticity policy notice
  - submit action
- Data:
  - question kit, prior autosaved answers, match_id, invite_id
- States:
  - autosave failed (retry), validation errors, session expired
- Analytics:
  - `qa_started`, `qa_autosave`, `qa_submitted`

### CAND-008: Submission Confirmation (`P0`)
- Goal: close loop and reduce uncertainty.
- Components:
  - success confirmation
  - expected response window
  - next-step explanation
- Data:
  - session status and timestamp
- States:
  - missing session reference fallback
- Analytics:
  - `qa_submission_confirmation_viewed`

### CAND-009: Opportunity Status Timeline (`P1`)
- Goal: retention and transparency.
- Components:
  - status timeline
  - latest action indicator
  - optional profile refresh prompt
- Data:
  - invite/session/packet status summary
- States:
  - no active opportunities
- Analytics:
  - `candidate_timeline_viewed`

### CAND-010: Interview Scheduling Center (`P0`)
- Goal: handle interview scheduling as a dedicated flow.
- Components:
  - interview requests list
  - slot picker
  - calendar integration actions
  - confirmation details
- Analytics:
  - `candidate_interview_slot_selected`, `candidate_calendar_connected`

### CAND-011: Job Offers Center (`P0`)
- Goal: centralize final offers after successful interview process.
- Components:
  - offer list
  - offer detail and response actions
  - email notification confirmation
- Analytics:
  - `candidate_offer_viewed`, `candidate_offer_accepted`, `candidate_offer_declined`

## Employer Portal Screens

### EMP-001: Organization Onboarding (`P0`)
- Goal: initialize employer workspace.
- Components:
  - organization profile form
  - timezone + channel preferences
  - invite teammates (optional)
- Data:
  - org settings defaults
- States:
  - duplicate org name warning, save failed
- Analytics:
  - `employer_onboarding_completed`

### EMP-002: Job Setup Wizard (`P0`)
- Goal: create role quickly with structure.
- Components:
  - template selector
  - role basics form
  - requirement builder (must/nice/dealbreaker)
  - question kit editor
- Data:
  - template payload, requirement taxonomy
- States:
  - required section incomplete, invalid pay/location config
- Analytics:
  - `job_setup_started`, `job_setup_completed`, `template_selected`

### EMP-003: Automation Settings (`P0`)
- Goal: configure auto-invite safely.
- Components:
  - top N/threshold controls
  - cap/cooldown/expiry controls
  - policy preview panel
  - activate toggle
- Data:
  - current policy config and guardrails
- States:
  - invalid policy combination
- Analytics:
  - `invite_policy_updated`, `job_activated`

### EMP-004: Packet Inbox (`P0`)
- Goal: review completed packets only.
- Components:
  - packet list/table
  - filters (role, date, fit range, authenticity label)
  - sorting and quick status
- Data:
  - packet summary feed
- States:
  - no packets yet empty state with guidance
- Analytics:
  - `packet_inbox_viewed`, `packet_filter_applied`

### EMP-005: Packet Detail (`P0`)
- Goal: make decision in one screen.
- Components:
  - fit summary
  - dealbreaker checks
  - authenticity badge + reason codes + confidence
  - evidence snippets
  - full transcript
  - sticky action bar (`Interview`, `Clarify`, `Reject`)
- Data:
  - packet payload and related job metadata
- States:
  - missing summary fallback, stale packet superseded notice
- Analytics:
  - `packet_viewed`, `packet_action_taken`

### EMP-006: Job Performance Dashboard (`P1`)
- Goal: monitor flow quality and velocity.
- Components:
  - KPI cards (time to first packet, invite->completion, packet->interview)
  - trend chart
  - role switcher/date filters
- Data:
  - analytics aggregates
- States:
  - insufficient data notice
- Analytics:
  - `employer_dashboard_viewed`

## Shared/Internal Screens

### SHARED-001: Notification Preferences (`P1`)
- Goal: channel control for users.
- Components:
  - email/SMS toggles
  - digest/realtime settings
- Analytics:
  - `notification_preferences_updated`
- Placement:
  - exposed from main account/dashboard settings after onboarding (not part of pre-onboarding entry flow)

### SHARED-002: Error and Retry Surface (`P0`)
- Goal: recover from transient failures.
- Components:
  - retry CTA
  - support contact path
  - contextual error message
- Analytics:
  - `retry_clicked`, `support_contact_clicked`

### ADMIN-001: Pipeline Failures Monitor (`P1`)
- Goal: inspect failed parse/enrichment/packet jobs.
- Components:
  - failed jobs table
  - retry action
  - failure reason panel
- Analytics:
  - `admin_job_retry_triggered`

## Component Library (MVP Core)
- `JobSummaryCard`
- `InviteActionPanel`
- `ProgressMeter`
- `DealbreakerStatusList`
- `AuthenticityBadge`
- `ReasonCodeList`
- `PacketActionBar`
- `QuestionRenderer`
- `AutosaveIndicator`
- `KpiMetricCard`
- `EmptyStatePanel`
- `RecoverableErrorPanel`

## Data Dependency Map (Minimal)
- Candidate onboarding screens depend on:
  - auth service
  - candidate profile service
  - document parser status API
- Employer setup screens depend on:
  - org service
  - job service
  - template catalog
- Packet screens depend on:
  - packet service
  - authenticity assessment payload
  - action endpoint

## UX Readiness Checklist (for each P0 screen)
1. Primary user goal is clear.
2. One primary CTA and one safe secondary CTA.
3. Loading/empty/error states explicitly designed.
4. Analytics events defined.
5. Permission checks defined.
6. Mobile behavior defined where candidate-facing.

## Out of Scope (Post-MVP)
- Advanced personalization/theme settings.
- Dynamic drag-and-drop workflow builders.
- Deep multi-panel admin workflows.

## Full-Scale Product Expansion (Beyond MVP)

### Candidate Flow Expansion
- Add identity and account security screens:
  - multi-factor enrollment
  - account recovery and device/session controls
- Add profile governance screens:
  - profile version history
  - data export, delete, and anonymization controls
  - visibility mode controls (active, passive, private)
- Expand matching surfaces:
  - ranked opportunities center with reason transparency
  - no-fit diagnostic state with guided profile actions
  - invite history and reactivation queue
- Expand post-submission surfaces:
  - outcome explanation categories
  - appeal and dispute tracking
  - preference center with channel history

### Employer Flow Expansion
- Add organization foundation screens:
  - company verification
  - legal/compliance acknowledgment
  - RBAC management and teammate role assignment
- Add advanced job program screens:
  - multi-role management dashboard
  - template governance and versioning
  - question kit library with reusable blocks
- Add operations and governance screens:
  - policy validation and activation diagnostics
  - audit log explorer and retention controls
  - integration health center (ATS, calendar, communication providers)
- Add collaborative decision screens:
  - reviewer assignment and handoff
  - structured rejection reason taxonomy
  - SLA and escalation monitoring

### Shared Platform Expansion
- unified notification center with delivery status
- incident banner and degraded-mode UX framework
- admin moderation and integrity operations console

### Full-Scale Design Readiness Additions
For each expanded screen set, define:
1. role-level permission matrix
2. analytics and audit events
3. fallback/degraded behavior
4. localization and accessibility requirements
5. data retention and privacy constraints
