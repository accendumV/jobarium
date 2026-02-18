# Bounded Contexts (MVP)

## Owns
- Domain boundaries and source-of-truth ownership.

## Excludes
- Event schemas (see `integration_contracts.md`).
- API endpoints (see `../04_implementation/api_contracts.md`).

## Contexts
1. Identity and Access
2. Candidate Profile
3. Organization
4. Billing
5. Job and Question Kit
6. Matching and Ranking
7. Invitations and Automation
8. Q&A Session
9. Candidate Packet

## Ownership Summary
- Identity: users, roles, consent.
- Candidate Profile: profile, docs, parse results, enrichment state.
- Organization: org profile and membership.
- Billing: subscriptions and usage counters.
- Job/Question Kit: job requirements and question sets.
- Matching: score + shortlist lifecycle.
- Invitations: invite lifecycle + delivery state.
- Q&A: sessions, answers, response signals, authenticity assessment.
- Candidate Packet: packet lifecycle + employer actions.

## Cross-Cutting (Not BCs)
- Notifications.
- Audit logging.
