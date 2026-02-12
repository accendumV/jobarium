# Jobarium Priority Matrix (MVP)

## Purpose
Prioritize features for the 8-week launch using a practical matrix:
- business impact,
- user pain reduction,
- implementation effort,
- delivery risk.

## Scoring Model
- Impact: 1-5 (higher is better)
- Pain Reduction: 1-5 (higher is better)
- Effort: 1-5 (lower is better)
- Risk: 1-5 (lower is better)

Priority score (simple):
`(Impact + Pain Reduction) - (Effort + Risk)`

This matrix is directional, not absolute. CEO/CTO can override with rationale.

## Feature Priority Table

| Feature | Impact | Pain Reduction | Effort | Risk | Score | Priority |
|---|---:|---:|---:|---:|---:|---|
| Candidate onboarding + CV prefill | 5 | 5 | 3 | 3 | 4 | P0 |
| Employer job setup + templates | 5 | 5 | 3 | 2 | 5 | P0 |
| Dealbreaker filtering | 5 | 5 | 3 | 2 | 5 | P0 |
| Matching + deterministic scoring | 5 | 4 | 4 | 3 | 2 | P0 |
| Auto-invite with caps/cooldowns | 5 | 5 | 3 | 3 | 4 | P0 |
| Async Q&A session flow | 5 | 4 | 3 | 2 | 4 | P0 |
| Packet builder (summary + transcript) | 5 | 5 | 3 | 3 | 4 | P0 |
| Authenticity insight badge | 4 | 4 | 3 | 3 | 2 | P0 |
| Employer packet actions | 5 | 4 | 2 | 2 | 5 | P0 |
| Email/SMS notifications | 4 | 4 | 2 | 2 | 4 | P0 |
| GDPR baseline workflows | 5 | 4 | 3 | 3 | 3 | P0 |
| Core dashboard metrics | 4 | 4 | 2 | 2 | 4 | P1 |
| ATS export basics | 3 | 3 | 3 | 3 | 0 | P1 |
| Calendar handoff links | 3 | 3 | 2 | 1 | 3 | P1 |
| Advanced AI coaching | 2 | 2 | 4 | 4 | -4 | P2 |
| Enterprise ATS deep integrations | 3 | 2 | 5 | 4 | -4 | P2 |

## Priority Buckets

### P0 (Launch Critical)
- Candidate onboarding + CV parsing prefill
- Employer setup templates
- Dealbreaker filters
- Matching/scoring
- Auto-invite automation controls
- Async Q&A + packet generation
- Authenticity insights (advisory only)
- Employer decision actions
- Notifications
- GDPR baseline and audit trail

### P1 (Post-Launch, High Value)
- Metrics dashboard enhancements
- ATS export basics
- Calendar workflow polish

### P2 (Later)
- Advanced AI features
- Deep enterprise integrations

## Dependency Notes
- Packet builder depends on Q&A submission model.
- Authenticity insights depend on Q&A telemetry capture.
- Auto-invite depends on shortlist delta events.
- Templates depend on requirement taxonomy stability.

## Decision Rules
1. If P0 scope slips, cut P1 first, not P0 quality.
2. Do not add new P0 items without removing another P0 item.
3. Every P0 feature must map to at least one documented HR pain point.
4. Any exception requires a decision log entry.

## Review Cadence
- Re-score weekly (Friday).
- Capture changes in decisions log if priority shifts materially.
