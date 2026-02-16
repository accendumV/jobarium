# Jobarium Candidate User Flow (Full-Scale Product)

## Goal
Give candidates a transparent, low-friction hiring journey from onboarding to outcomes, with clear controls over profile visibility, match volume, and communication.

## Experience Principles
- Separate onboarding from matching and invitations.
- Explain ranking and invite eligibility in plain language.
- Prevent overload with strict exposure caps and progressive reveal.
- Preserve trust with consent clarity, authenticity fairness, and appeal pathways.
- Keep candidate experience mobile-first and interruption-safe.

## Flow Architecture
Candidate experience runs as three linked layers:
1. Account creation and access layer (auth + consent).
2. Onboarding and profile readiness pipeline (inside app, post-auth).
3. Matching-centric hiring pipeline (matching parent with nested invite/screening/outcome states).

---

## Layer 0: Account Creation and Access (Pre-Onboarding)

### Stage L0.1: Account Sign-Up / Login
1. Candidate creates account using:
   - email/password (+ email confirmation), or
   - social sign-up (Google or LinkedIn).
2. Candidate accepts legal/privacy/GDPR consent during account creation.

Success condition:
- Authenticated account with consent baseline is established before onboarding starts.

### Stage L0.2: Post-Login Entry Gate
1. Immediately after first login, candidate is routed to onboarding wizard.
2. Candidate cannot access dashboard/matching until onboarding completion criteria are met.

Success condition:
- Candidate enters onboarding as a separate in-app flow (account creation is complete and not repeated).

---

## Pipeline A: Onboarding and Profile Readiness (Post-Auth)

### Stage A1: Source-Aware Intake
1. System detects sign-up source (`email/password`, `google`, `linkedin`).
2. Onboarding path adapts:
   - email/password or google: start with CV/document upload.
   - linkedin: pre-fill baseline profile from LinkedIn parse and show initial completeness progress.

Success condition:
- Candidate sees the correct onboarding starting point based on sign-up source.

### Stage A2: CV/Document Import and Parse Bootstrap
1. Candidate uploads CV (PDF/DOC/DOCX) and optional additional documents (certs/portfolio).
2. Parser extracts profile candidates and confidence values.
3. System produces completeness summary for parsed vs missing fields.

Success condition:
- Parse output is available and missing fields are explicitly identified for enrichment.

### Stage A3: Progressive Enrichment
1. Candidate completes missing high-impact fields first.
2. Candidate adds skills, certifications, project links, work outcomes, shift preferences, and availability windows.
3. Profile completeness is recalculated after each enrichment update.

Success condition:
- Candidate is matchable and quality-score eligible across targeted role families.

### Stage A4: Visibility and Profile Governance
1. Default visibility is set to `Active`.
2. Candidate may change visibility mode (`Active`, `Passive`, `Private`) in profile settings later.
3. Candidate can version profile updates, see freshness indicators, and request export/delete/anonymize per policy.

Success condition:
- Profile remains current, compliant, and explainable.

---

## Pipeline B: Matching-Centric Hiring Lifecycle

### Stage B1: Matching Queue and Discovery
1. Matching jobs run continuously in the background.
2. Candidate sees only shortlisted opportunities (non-shortlisted matches are hidden).
3. Candidate-visible match list includes match reasons and confidence context for shortlisted items.
4. Platform enforces exposure controls:
   - default visible matches: top 3
   - max in-app listed matches: top 10
   - low-confidence matches suppressed below threshold

Success condition:
- Candidate sees curated shortlisted opportunities only, without feed fatigue.

### Stage B2: Nested Invitation State (inside Matching)
1. Invitation appears only after shortlist entry and invite policy checks.
2. Invitation status is displayed within the match record (ready/queued/expired).
3. Candidate opens invite detail from that match context and can accept/decline/defer.

Success condition:
- Invitation handling remains contextual to the originating match.

### Stage B3: Nested Screening State (inside Matching)
1. Candidate completes question kit (typed inputs, structured responses, optional links).
2. Autosave, recovery, and expiry handling protect candidate effort.
3. Authenticity policy and fairness copy are visible before submit.
4. Screening submission is always tied to match ID and invitation ID.

Success condition:
- Submission is complete, auditable, and packet-ready.

### Stage B4: Nested Outcome State (inside Matching)
1. Candidate sees outcome progression in the same match record:
   - submitted
   - under review
   - interview requested / closed
2. Candidate receives channel-consistent notifications with fallback behavior.

Success condition:
- Candidate does not need a separate outcomes tab to track hiring results.

### Stage B5: Interview Scheduling (Separate Top-Level Tab)
1. Interview workflow is separate from matching list navigation due to scheduling complexity.
2. Candidate manages interview scheduling, calendar import, and slot confirmation.

Success condition:
- Interview operations are centralized without breaking match context integrity.

### Stage B6: Job Offers (Separate Top-Level Tab)
1. Final offers from successful interview pipelines appear in dedicated offers area.
2. Candidate receives in-app and email offer notification.

Success condition:
- Offer handling is explicit and distinct from pre-offer matching states.

---

## Timing and Exposure Policy (Full-Scale Defaults)
- Target time to first match: 5-30 minutes after profile becomes matchable.
- Fallback SLA: match update or no-fit status within 24 hours.
- No-fit persistence window: 24-72 hours triggers guided profile improvement prompts.
- Max active invites per candidate: 3.
- Max new invites per candidate: 2/day, 5/week.

## Screen Domains

### Onboarding and Profile Domain
- account creation and login
- source-aware onboarding entry
- CV upload and parse review
- completeness summary
- enrichment dashboard
- visibility controls (default active)
- profile governance and data controls

### Matching and Action Domain
- shortlisted match list (parent view)
- nested invitation status/detail per match
- nested screening status per match
- nested outcome status per match
- separate interview scheduling center
- separate job offers center

## Full-Scale Failure and Edge Flows
- parse failure -> manual fallback with background reprocessing
- repeated no-fit state -> recommendation playbook and profile refresh prompts
- invite expiry -> controlled reactivation and cooldown guidance
- suspected authenticity false-positive -> appeal and human review track
- communication delivery failure -> fallback channels and in-app inbox
- duplicate account -> merge and consent reconciliation flow

## Full-Scale Candidate KPIs
- signup to verified account conversion
- verified account to onboarding completion conversion
- onboarding completion to first shortlist conversion
- time to first match
- match impression to invite open rate
- invite open to Q&A start rate
- Q&A completion rate
- packet to interview conversion
- interview to offer conversion
- monthly profile freshness rate
- candidate satisfaction and trust score

## Strategic Non-Goals (Current Product Line)
- unrestricted open-market job board behavior
- infinite-scroll low-signal opportunity feeds
- opaque black-box recommendations without explanation
