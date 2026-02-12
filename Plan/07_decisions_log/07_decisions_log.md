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

---

## Entries

### DEC-0001: Use wedge-agnostic architecture for MVP
- Date: 2026-02-12
- Status: Accepted
- Owner: CEO
- Context: GTM wedge is still under discussion, but implementation timeline is short.
- Decision: Keep core architecture wedge-agnostic; use DMV/North Carolina trades as GTM assumption only.
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

### DEC-0003: Lock first launch wedge and geography
- Date: 2026-02-12
- Status: Accepted
- Owner: CEO
- Context: GTM assumption existed but was not explicitly locked for launch execution.
- Decision: Launch wedge is DMV skilled trades (HVAC/electrical/plumbing/maintenance), with architecture remaining wedge-agnostic.
- Alternatives considered:
  - Raleigh-first launch
  - multi-wedge launch in parallel
- Why this option: improves focus, speeds pilot learning, and aligns with structured dealbreaker model.
- Consequences:
  - template and outreach strategy should prioritize DMV trades first
  - expansion to other wedges remains supported by current architecture
- Affected docs:
  - `01_product/01_jobarium_one_pager.md`
  - `01_product/09_user_personas.md`
  - `02_architecture/02_jobarium_architecture_plan.md`
- Review date: after first 10 active employers

### DEC-0004: Adopt launch Definition-of-Done gate
- Date: 2026-02-12
- Status: Accepted
- Owner: CEO/CTO
- Context: Launch quality criteria existed across docs but were not centralized.
- Decision: Use `01_product/12_launch_definition_of_done.md` as mandatory go/no-go gate.
- Alternatives considered:
  - ad hoc launch readiness check
  - engineering-only release checklist
- Why this option: creates clear cross-functional release accountability.
- Consequences:
  - launch requires explicit sign-off against P0 criteria
  - exceptions must be logged and owned
- Affected docs:
  - `01_product/12_launch_definition_of_done.md`
  - `02_architecture/12_system_completeness_gate.md`
- Review date: one week before pilot go-live

### DEC-0005: Lock invite anti-spam defaults for MVP
- Date: 2026-02-12
- Status: Accepted
- Owner: CEO/CTO
- Context: Invite controls existed, but default values were not locked.
- Decision: Adopt default invite values defined in `02_architecture/18_invite_and_provider_defaults_mvp.md`.
- Alternatives considered:
  - employer-config-only without platform defaults
  - strict low-volume defaults
- Why this option: balances candidate experience protection and hiring throughput.
- Consequences:
  - safer automation behavior at launch
  - policy review needed every 2 weeks during pilot
- Affected docs:
  - `02_architecture/18_invite_and_provider_defaults_mvp.md`
  - `03_user_experience_flows/04_employer_user_flow.md`
- Review date: after first 100 invites

### DEC-0006: Provider strategy for MVP integrations
- Date: 2026-02-12
- Status: Accepted
- Owner: CTO
- Context: Needed explicit direction on provider abstraction depth.
- Decision: Use direct provider SDKs behind thin internal adapters for email/SMS/payments.
- Alternatives considered:
  - full provider abstraction layer from day one
  - hard-coupled direct SDK usage without adapters
- Why this option: fastest to ship while preserving switchability.
- Consequences:
  - adapter contracts must be stable and tested
  - can migrate providers with limited service-level change
- Affected docs:
  - `02_architecture/18_invite_and_provider_defaults_mvp.md`
  - `06_operations/16_pilot_support_runbook.md`
- Review date: end of pilot month 1
