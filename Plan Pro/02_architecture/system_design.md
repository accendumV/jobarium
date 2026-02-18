# System Design (MVP)

## Owns
- Runtime architecture, core components, and platform choices.

## Excludes
- Field-level entity schemas (see `data_model.md`).
- Event payload details (see `integration_contracts.md`).

## Architecture Constraints
- Wedge-agnostic domain model.
- 8-week MVP target with small team.
- AI-minimal MVP (embeddings, ranking, summary).
- Security baseline: OWASP + GDPR.

## Runtime Topology
- Frontend web app: candidate, employer, admin.
- Edge: load balancer + WAF.
- Backend: modular services aligned to bounded contexts on Cloud Run.
- Source of truth: Postgres.
- Async backbone: Pub/Sub + Cloud Tasks.
- Cache/limits/cooldowns: Redis.
- File store: object storage for documents/artifacts.
- Observability: logs, metrics, tracing.

## Core End-to-End Flow
1. Candidate/job update triggers enrichment and match refresh.
2. Matching computes shortlist diff and emits change event.
3. Automation enforces caps/cooldowns and creates invites.
4. Candidate completes Q&A.
5. Packet builder creates packet and notifies employer.
6. Employer action updates downstream analytics and workflow state.

## Performance Baseline
- Parse p95 < 3m.
- Match refresh p95 < 10m.
- Invite dispatch p95 < 2m.
- Packet build p95 < 90s.
