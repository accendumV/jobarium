# Jobarium Candidate User Flow (MVP)

## Goal
Give candidates a low-effort path to relevant opportunities with high transparency and minimal repetitive work.

## Experience Principles
- Fast onboarding: first meaningful setup in under 3 minutes.
- Progressive profiling: ask only what improves matching now.
- Trust-first automation: explain why invites appear.
- Mobile-friendly completion for interview Q&A.

## Candidate Journey (Primary Path)

### Stage 1: Entry and Account Creation
1. Candidate lands on value page: "Create one profile, get matched automatically."
2. Candidate signs up (email/password or OAuth).
3. Candidate accepts required terms/privacy/GDPR consent.

Success condition:
- Authenticated user and baseline consent recorded.

### Stage 2: Profile Bootstrap (Fast Start)
1. Candidate uploads CV (PDF/DOC/DOCX) and/or imports from LinkedIn.
2. System parses and pre-fills profile fields.
3. Candidate confirms only high-impact fields first:
   - desired role/title
   - location + commute radius
   - work authorization
   - pay expectation range
   - availability/start date

Success condition:
- Candidate reaches "matchable profile" threshold.

### Stage 3: Guided Profile Completion
1. UI shows profile completeness meter and "what improves matching" tips.
2. Candidate adds optional enrichments:
   - skills
   - certifications/licenses
   - work history detail
   - portfolio links
3. Candidate sets communication preferences (email/SMS).

Success condition:
- Candidate can be reliably scored for shortlist eligibility.

### Stage 4: Discovery and Invite
1. Background matching runs continuously.
2. If candidate enters a job shortlist, invite is sent.
3. Invite includes:
   - role summary
   - company name
   - location/pay range
   - time estimate to complete Q&A
4. Candidate chooses Start or Decline.

Success condition:
- Candidate opts in with clear expectations.

### Stage 5: Asynchronous Q&A Submission
1. Candidate answers 5-10 role-specific questions.
2. Autosave prevents loss; progress bar shows remaining effort.
3. Candidate submits once complete.

Success condition:
- Completed submission creates an HR-ready packet.

### Stage 6: Post-Submission and Retention
1. Candidate receives submission confirmation and expected response window.
2. Candidate gets optional profile improvement suggestions.
3. Candidate can track status (submitted/reviewed/interview requested).

Success condition:
- Candidate remains engaged and keeps profile fresh.

## Screen-Level Requirements

### Candidate Onboarding Screens
- Landing + signup
- Consent capture
- CV upload/import
- Field confirmation (high-impact)
- Profile completeness dashboard

### Candidate Action Screens
- Invite detail page
- Q&A session page
- Submission confirmation
- Opportunity status timeline

## Required vs Optional Data (MVP)

Required to become matchable:
- authorization
- location/radius or remote preference
- pay expectation range
- start availability
- one primary role/title

Optional (high value):
- certifications/licenses
- detailed work bullets
- portfolio/project links
- shift preferences

## Candidate Delight Opportunities
- "You are now visible to matching employers" feedback at completion milestone.
- Clear match explanations ("Why this role is relevant").
- One-tap profile refresh prompts when data becomes stale.

## Failure and Edge Flows
- Parse failure: user continues with manual entry; retry parser in background.
- Low-confidence extraction: highlight uncertain fields for confirmation.
- Invite expired: allow reactivation request where policy allows.
- Duplicate account detection: guided merge flow (future-safe).

## Candidate KPIs
- signup -> matchable profile conversion
- invite open rate
- invite accept rate
- invite -> Q&A completion rate
- profile update frequency (monthly)

## Non-Goals for MVP
- Full career coaching assistant
- Heavy AI rewriting of candidate answers
- Deep social-graph-driven ranking
