# Jobarium HR Value Requirements (Validation Draft)

## Purpose
This document translates HR pain points into concrete product expectations and acceptance criteria for MVP validation.

Audience:
- HR professionals reviewing product-market fit
- CEO/CTO prioritizing MVP scope

## How to Review
For each requirement, ask:
1. Does this solve a real day-to-day HR pain point?
2. Is the acceptance criteria practical and measurable?
3. Is this required for pilot launch, or can it be phased?

## HR Jobs-To-Be-Done (Core)
1. Reduce time spent screening unqualified applicants.
2. Surface qualified candidates faster and more consistently.
3. Avoid late-stage disqualifiers (authorization, pay, location, availability, certs).
4. Keep candidate quality high without adding recruiter workload.
5. Maintain compliance, fairness, and auditability.

## Requirements Matrix

### R-01: Packet-First Hiring Inbox
- Pain point:
  - HR teams drown in large applicant queues and repetitive resume review.
- Expected capability:
  - Employer receives completed candidate packets, not raw applicant floods.
- Acceptance criteria:
  - For active jobs, default employer inbox view shows only submitted packets.
  - Packet includes standardized summary and full Q&A transcript.
  - Employer can complete decision action in one screen.
- Priority: P0 (MVP must-have)

### R-02: Dealbreaker Validation Upfront
- Pain point:
  - Recruiters discover disqualifiers too late and waste interview time.
- Expected capability:
  - Hard constraints are checked before packet reaches employer.
- Acceptance criteria:
  - Packet clearly shows status for authorization, location/radius, pay overlap, availability, and required cert/license.
  - Dealbreaker mismatches are visible and filterable.
- Priority: P0

### R-03: Consistent Candidate Comparability
- Pain point:
  - Comparing candidates is inconsistent and subjective across reviewers.
- Expected capability:
  - Standardized packet structure with explainable fit dimensions.
- Acceptance criteria:
  - Every packet follows same section order and scoring format.
  - Fit highlights map to explicit must-have/nice-to-have fields.
  - Reviewer can compare at least two packets with same criteria labels.
- Priority: P0

### R-04: Fast Job Setup via Role Templates
- Pain point:
  - Job setup is repetitive and error-prone, especially for recurring roles.
- Expected capability:
  - Employer can start from role templates and edit quickly.
- Acceptance criteria:
  - Template selection pre-fills requirements, question kit, and invite policy.
  - Median job setup time for templated role <= 10 minutes in pilot.
  - "Blank from scratch" option remains available.
- Priority: P0

### R-05: Automation with Recruiter Control
- Pain point:
  - Recruiters want less manual outreach, but still need control and guardrails.
- Expected capability:
  - Auto-invite workflow with configurable caps/cooldowns/expiry.
- Acceptance criteria:
  - Employer can set and edit invite threshold/top N, caps, cooldowns, and expiry.
  - Invite activity log shows who was invited and when.
  - System prevents repeated invite spam via cooldown policy.
- Priority: P0

### R-06: Candidate Authenticity Trust Signals
- Pain point:
  - Employers worry about heavily AI-generated or outsourced responses.
- Expected capability:
  - Trust insight appears in packet as advisory signal with reasons.
- Acceptance criteria:
  - Packet displays authenticity label + top reason codes + confidence marker.
  - No automatic rejection is triggered by authenticity score in MVP.
  - Employer receives suggested verification follow-up prompts.
- Priority: P0

### R-07: Explainable Match Reasons
- Pain point:
  - Recruiters distrust black-box rankings and need explainability.
- Expected capability:
  - Each packet explains why candidate matched this role.
- Acceptance criteria:
  - Packet includes "Why matched" section with at least 3 concrete attributes.
  - Mismatch or unknown fields are explicitly shown.
- Priority: P1 (high)

### R-08: One-Click Workflow Actions
- Pain point:
  - Fragmented tools slow decisions and increase admin work.
- Expected capability:
  - Decision actions happen inside packet workflow.
- Acceptance criteria:
  - Employer can choose: Interview, Clarify, Reject.
  - Action is persisted with timestamp and user.
  - Optional note can be added without leaving packet view.
- Priority: P0

### R-09: SLA Visibility and Hiring Throughput Metrics
- Pain point:
  - HR cannot tell if hiring flow is improving or stalling.
- Expected capability:
  - Dashboard tracks speed and conversion metrics tied to value.
- Acceptance criteria:
  - Dashboard includes:
    - time to first completed packet
    - invite -> completion rate
    - packet -> interview rate
    - repeat job activation rate
  - Metrics are filterable by job and date range.
- Priority: P1

### R-10: Workflow Integrations (Pragmatic MVP)
- Pain point:
  - Recruiters avoid tools that do not fit existing communication habits.
- Expected capability:
  - Core integrations support real daily workflow without overbuilding.
- Acceptance criteria:
  - Email and SMS notifications functional in MVP.
  - Calendar link support for interview handoff.
  - Basic export endpoint/format for ATS handoff.
- Priority: P1

### R-11: Candidate Experience Quality
- Pain point:
  - Poor candidate UX lowers completion rates and harms employer brand.
- Expected capability:
  - Fast, transparent, mobile-friendly candidate flow.
- Acceptance criteria:
  - Candidate sees estimated completion time before starting Q&A.
  - Q&A supports autosave and progress indicators.
  - Candidate receives confirmation and expected response window after submit.
- Priority: P0

### R-12: Compliance and Auditability
- Pain point:
  - HR needs defensible processes for legal/privacy scrutiny.
- Expected capability:
  - GDPR baseline controls and action audit trail.
- Acceptance criteria:
  - Consent capture and retention policy enforcement exist.
  - Data export and deletion/anonymization workflows exist.
  - HR decisions and admin actions are auditable.
- Priority: P0

## MVP Validation Questions for HR Reviewer
Ask reviewer to score each from 1 (low value) to 5 (critical):
1. Does this reduce your screening workload materially?
2. Does this improve candidate quality entering interviews?
3. Would this fit your current recruiter workflow?
4. Is anything critical missing for pilot adoption?
5. What would block real usage in week one?

## Non-Goals for Initial Pilot
- Full ATS replacement.
- Enterprise custom workflow builder.
- Fully automated hiring decisions without human review.

## Sign-Off Section (for HR Validation)
- Reviewer name:
- Role/company type:
- Date:
- Overall fit score (1-10):
- Top 3 must-have requirements:
- Top 3 concerns:
- Recommended pilot conditions:
