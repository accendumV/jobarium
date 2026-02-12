# Jobarium Decisions Log

## Purpose
Capture high-impact decisions with rationale to prevent repeated debates and document trade-offs.

## How to Use
- Add one entry per decision.
- Keep entries brief and explicit.
- Link impacted docs.
- Do not delete old decisions; mark them superseded when replaced.

## Decision Status Values
- Proposed
- Accepted
- Superseded
- Rejected

## Decision Template

### DEC-XXXX: <Decision title>
- Date:
- Status:
- Owner:
- Context:
- Decision:
- Alternatives considered:
- Why this option:
- Consequences:
- Affected docs:
- Review date:

---

## Entries

### DEC-0001: Use wedge-agnostic architecture for MVP
- Date: 2026-02-12
- Status: Accepted
- Owner: CEO
- Context: GTM wedge is still under discussion, but implementation timeline is short.
- Decision: Keep core architecture wedge-agnostic; use DMV trades as GTM assumption only.
- Alternatives considered:
  - hard-code trade-specific model now
  - delay architecture until wedge fully finalized
- Why this option: keeps velocity high and avoids rework while preserving early GTM flexibility.
- Consequences:
  - requires configurable requirement taxonomy
  - slight upfront modeling effort
- Affected docs:
  - `02_architecture/02_jobarium_architecture_plan.md`
  - `01_product/01_jobarium_one_pager.md`
- Review date: after first pilot onboarding

### DEC-0002: AI-minimal MVP with authenticity detection guardrails
- Date: 2026-02-12
- Status: Accepted
- Owner: CEO
- Context: Need trust and speed in first release.
- Decision: Keep AI scope minimal (embeddings/retrieval/summaries) and add authenticity risk signals for Q&A.
- Alternatives considered:
  - extensive AI agents in MVP
  - no authenticity controls in MVP
- Why this option: balances trust, cost, and implementation speed.
- Consequences:
  - rule-based scoring first, classifier later
  - human-in-the-loop packet decisions required
- Affected docs:
  - `02_architecture/02_jobarium_architecture_plan.md`
  - `02_architecture/06_authenticity_detection_spec.md`
  - `03_user_experience_flows/03_candidate_user_flow.md`
  - `03_user_experience_flows/04_employer_user_flow.md`
- Review date: 30 days post-launch
