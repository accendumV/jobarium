# Jobarium End-to-End Golden Flow (MVP)

## Purpose
Define the canonical system flow connecting candidate actions, employer actions, and platform automation.

## Golden Flow Sequence

1. Candidate signs up and uploads CV.
2. CV parser extracts profile data; candidate confirms critical fields.
3. Employer creates job, requirements, and question kit; enables automation.
4. Matching pipeline evaluates candidate-job fit.
5. Candidate enters shortlist; platform creates and sends invite.
6. Candidate accepts invite and submits asynchronous Q&A.
7. Packet builder generates summary + transcript packet.
8. Employer reviews packet and takes action.
9. Outcome signals feed ranking improvements and analytics.

## Event-Aligned Flow

1. `candidate.document.uploaded`
2. `candidate.document.parsed`
3. `profile.updated`
4. `job.updated`
5. `matching.shortlist.changed`
6. `invite.created`
7. `qa.submitted`
8. `packet.ready`
9. `packet.action.recorded` (recommended new event)

## Data Hand-offs by Stage

### Candidate Onboarding -> Profile
- input: resume file, core preferences
- output: normalized candidate profile + embeddings

### Employer Setup -> Matchable Job
- input: structured requirements + question kit
- output: normalized job profile + embeddings

### Match and Invite -> Candidate Engagement
- input: shortlist diffs + invite policy
- output: active invite state + delivery status

### Q&A -> Packet
- input: candidate answers + role context
- output: packet summary, evidence snippets, transcript

### Employer Decision -> Learning Loop
- input: interview/clarify/reject action
- output: analytics counters + ranking feedback features

## UX Guardrails Across the Flow
- Always show users why they are seeing this step.
- Keep each step short and reversible where possible.
- Never block core flow on non-critical enrichments.
- Preserve trust with explicit consent and clear automation rules.

## Operational SLO Targets (Initial)
- CV parse p95 < 3 minutes
- Match refresh after major profile/job update p95 < 10 minutes
- Invite dispatch p95 < 2 minutes after shortlist entry
- Packet generation p95 < 90 seconds after Q&A submit

## MVP Risks in This Flow
- Parser quality variance can reduce first impression.
- Overly strict employer filters can produce low packet volume.
- Overly loose filters can produce low-quality packets.

## Mitigations
- Confidence-based field confirmation in onboarding.
- Requirement quality checks in job setup wizard.
- Alerting on jobs with zero packet output after defined window.

## Definition of "Flow Is Working"
- Candidate receives relevant invite without manual applying.
- Employer receives completed packet without sourcing manually.
- Employer can make a decision in one review pass.
