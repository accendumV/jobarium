# Jobarium Project Plan Index

## Purpose
This file is the single navigation point for all planning documents.

Use it to:
- find documents quickly,
- avoid duplicate docs,
- track document maturity,
- keep decisions and roadmap aligned.

## Planning Structure (Canonical)

### 01 Product
- vision, one-pager, positioning, value proposition, success metrics

### 02 Architecture
- system design, entities/data model, event model, security/compliance, AI components

### 03 User Experience Flows
- candidate flow, employer flow, end-to-end flow, admin/support flow

### 04 Delivery and Execution
- implementation roadmap, sprint plan, milestones, dependencies, risks

### 05 Commercial and GTM
- wedge/geography strategy, pilot plan, pricing, packaging, traction metrics

### 06 Operations and Quality
- SLOs, observability, incident handling, QA strategy, runbooks

### 07 Decisions Log
- key decisions, rationale, alternatives, consequences, owners

### 99 Archive
- superseded docs kept for history

## Current Document Registry

| ID | Document | Area | Status | Owner | Next Action |
|---|---|---|---|---|---|
| D-001 | `01_product/01_jobarium_one_pager.md` | 01 Product | Draft v1 | CEO | tighten investor version |
| D-002 | `02_architecture/02_jobarium_architecture_plan.md` | 02 Architecture | Draft v1 | CEO/CTO | lock open decisions |
| D-003 | `03_user_experience_flows/03_candidate_user_flow.md` | 03 UX Flows | Draft v1 | CEO/CTO | add screen specs |
| D-004 | `03_user_experience_flows/04_employer_user_flow.md` | 03 UX Flows | Draft v1 | CEO/CTO | add packet UI wire notes |
| D-005 | `03_user_experience_flows/05_end_to_end_golden_flow.md` | 03 UX Flows | Draft v1 | CEO/CTO | add failure-state flow |
| D-006 | `02_architecture/06_authenticity_detection_spec.md` | 02 Architecture | Draft v1 | CEO/CTO | define thresholds per role |
| D-007 | `99_archive/jobarium_comprehensive_document.md` | 99 Archive/Input | Reference | CEO | keep as source transcript |

## Mandatory Rules for New Documents
1. Add every new planning document to this registry.
2. Use one primary owner per document.
3. Assign one status only:
   - `Draft v1`
   - `In review`
   - `Approved`
   - `Superseded`
4. If superseded, point to replacement doc in the "Next Action" field.
5. Keep doc names short and stable.

## Naming Convention
- Pattern: `NN_topic_name.md`
- `NN` = sequence by creation order, not by importance.
- Use lowercase and underscores only.
- One topic per document.

Examples:
- `07_admin_ops_flow.md`
- `08_mvp_weekly_execution_plan.md`
- `09_api_contracts_mvp.md`

## Weekly Planning Cadence
- **Monday**: update roadmap and priorities.
- **Wednesday**: log key decisions and blockers.
- **Friday**: update doc statuses and next actions.

## Immediate Next Documents to Create
1. `07_admin_ops_flow.md` (support, moderation, GDPR requests, retries)
2. `08_mvp_weekly_execution_plan.md` (week-by-week deliverables with owners)
3. `09_mvp_risk_register.md` (top risks, impact, mitigation, trigger)
4. `10_api_boundaries_mvp.md` (service boundaries + initial contracts)

## Single Source of Truth
If documents conflict:
1. latest `Approved` document wins,
2. then latest `In review`,
3. then latest `Draft v1`,
4. transcript/reference docs are supporting context only.
