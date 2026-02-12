# Jobarium User Stories (MVP)

## Purpose
Provide implementation-ready user stories across core personas with clear acceptance criteria.

## Story Format
- As a <persona>, I want <capability>, so that <outcome>.

## Employer Stories (SMB Hiring Manager / Recruiter)

### E-01 Job Setup Template
- Story:
  - As an employer, I want to start from a role template, so that I can launch a job in minutes.
- Acceptance criteria:
  - Employer can select template and edit all prefilled fields.
  - Requirements, question kit, and invite policy are pre-populated.
  - Job can be activated without leaving setup flow.

### E-02 Dealbreaker Control
- Story:
  - As an employer, I want to define hard dealbreakers, so that unqualified candidates are filtered early.
- Acceptance criteria:
  - Dealbreakers support authorization, location/radius, pay range, availability, and certification.
  - Dealbreaker statuses appear in candidate packet summary.

### E-03 Automation Guardrails
- Story:
  - As an employer, I want invite caps and cooldowns, so that candidates are not spammed.
- Acceptance criteria:
  - Employer can configure top N/threshold, daily cap, cooldown, and expiry.
  - Invite log records all dispatches and statuses.

### E-04 Packet-First Review
- Story:
  - As an employer, I want a packet-first inbox, so that I review only completed pre-screened candidates.
- Acceptance criteria:
  - Inbox default view excludes incomplete applications.
  - Packet contains summary, evidence snippets, and full Q&A transcript.

### E-05 One-Click Decision
- Story:
  - As an employer, I want to decide in one click, so that hiring cycle time is reduced.
- Acceptance criteria:
  - Employer can choose Interview, Clarify, Reject.
  - Action is stored with actor and timestamp.

### E-06 Authenticity Insight
- Story:
  - As an employer, I want authenticity signals on responses, so that I can verify candidate involvement.
- Acceptance criteria:
  - Packet shows trust label, reason codes, and confidence marker.
  - System provides 2-3 suggested verification prompts.
  - No automatic rejection based on authenticity score alone.

## Candidate Stories (Skilled Trade Candidate)

### C-01 Fast Profile Bootstrap
- Story:
  - As a candidate, I want to upload my CV and get profile prefill, so that I avoid repetitive form entry.
- Acceptance criteria:
  - CV parser extracts core profile fields.
  - Candidate can confirm key fields in one guided step.

### C-02 Matchable Profile Guidance
- Story:
  - As a candidate, I want to know what fields matter most, so that I can become visible quickly.
- Acceptance criteria:
  - UI shows profile completion and "high-impact missing fields."
  - Candidate becomes matchable after completing required fields.

### C-03 Invite Transparency
- Story:
  - As a candidate, I want clear invite context, so that I can decide whether to proceed.
- Acceptance criteria:
  - Invite includes role, company, pay/location summary, and estimated completion time.
  - Candidate can Start or Decline.

### C-04 Mobile Q&A Completion
- Story:
  - As a candidate, I want mobile-friendly Q&A with autosave, so that I can complete screening reliably.
- Acceptance criteria:
  - Autosave persists progress.
  - Progress indicator shows remaining steps.
  - Submission confirmation shows expected response window.

### C-05 Fair Authenticity Policy
- Story:
  - As a candidate, I want transparent authenticity rules, so that I understand acceptable assistance.
- Acceptance criteria:
  - Candidate sees policy notice before submission.
  - Candidate has review path for potential false-positive flags.

## Internal Admin Stories (Platform Operations)

### A-01 Event Retry and Observability
- Story:
  - As an admin, I want to inspect and replay failed jobs, so that pipeline failures are recoverable.
- Acceptance criteria:
  - Failed parsing/enrichment/authenticity jobs are visible.
  - Retry action is available with audit logging.

### A-02 GDPR Workflow
- Story:
  - As an admin, I want to process data export and deletion requests, so that GDPR obligations are met.
- Acceptance criteria:
  - Export and deletion workflows are tracked and auditable.
  - Status transitions are visible to authorized users.

## MVP Story Prioritization
- P0:
  - E-01, E-02, E-03, E-04, E-05, E-06
  - C-01, C-02, C-03, C-04, C-05
- P1:
  - A-01, A-02

## Notes for Sprint Planning
- Keep stories vertical and demoable end-to-end.
- For each story, define API contract + UI state + analytics event together.
- Favor narrower P0 completion over partial breadth.
