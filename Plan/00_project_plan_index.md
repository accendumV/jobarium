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
| D-007 | `99_archive/jobarium_comprehensive_document.md` | 99 Archive/Input | Draft v1 | CEO | keep as source transcript |
| D-008 | `01_product/08_hr_value_requirements.md` | 01 Product | Draft v1 | CEO | get HR validation feedback |
| D-009 | `01_product/09_user_personas.md` | 01 Product | Draft v1 | CEO/CTO | validate persona assumptions with HR |
| D-010 | `01_product/10_user_stories_mvp.md` | 01 Product | Draft v1 | CEO/CTO | convert P0 stories into sprint backlog |
| D-011 | `01_product/11_priority_matrix_mvp.md` | 01 Product | Draft v1 | CEO/CTO | lock P0 scope for 8-week plan |
| D-012 | `02_architecture/12_system_completeness_gate.md` | 02 Architecture | Draft v1 | CEO/CTO | maintain as current readiness scorecard |
| D-013 | `02_architecture/13_state_machines_mvp.md` | 02 Architecture | Draft v1 | CEO/CTO | implement transition guards and telemetry |
| D-014 | `02_architecture/14_event_contracts_registry.md` | 02 Architecture | Draft v1 | CEO/CTO | wire producer/consumer validation and DLQ handling |
| D-015 | `03_user_experience_flows/15_ui_screen_inventory_mvp.md` | 03 UX Flows | Draft v1 | CEO/CTO | map P0 screens to wireframes and API contracts |
| D-016 | `06_operations/16_pilot_support_runbook.md` | 06 Operations | Draft v1 | CEO/CTO | validate on-call, alerts, and replay flow in staging |
| D-017 | `01_product/12_launch_definition_of_done.md` | 01 Product | Draft v1 | CEO/CTO | use as launch go/no-go checklist |
| D-018 | `02_architecture/18_invite_and_provider_defaults_mvp.md` | 02 Architecture | Draft v1 | CEO/CTO | enforce defaults and adapter contracts in implementation |
| D-019 | `02_architecture/17_rbac_matrix_mvp.md` | 02 Architecture | Draft v1 | CEO/CTO | enforce endpoint authorization and tenant scoping checks |
| D-020 | `06_operations/19_audit_logging_and_retention_mvp.md` | 06 Operations | Draft v1 | CEO/CTO | implement retention jobs and audit access restrictions |
| D-021 | `02_architecture/20_parser_thresholds_and_reprocessing_mvp.md` | 02 Architecture | Draft v1 | CEO/CTO | implement confidence thresholds and safe reprocessing |
| D-022 | `02_architecture/21_schema_versioning_and_migrations_mvp.md` | 02 Architecture | Draft v1 | CTO | apply expand/migrate/contract policy for DB/event schema changes |
| D-023 | `02_architecture/23_entity_ownership_and_precedence_matrix_mvp.md` | 02 Architecture | Draft v1 | CEO/CTO | enforce source-of-truth and precedence conflict rules |
| D-024 | `02_architecture/24_ranking_explainability_and_versioning_mvp.md` | 02 Architecture | Draft v1 | CTO | implement explainability payload and ranking rollback controls |
| D-025 | `01_product/25_candidate_disclosure_and_consent_copy_mvp.md` | 01 Product | Draft v1 | CEO | apply copy package in candidate UX |
| D-026 | `03_user_experience_flows/29_ui_state_standards_mvp.md` | 03 UX Flows | Draft v1 | CEO/CTO | ensure all P0 screens implement required UI states |
| D-027 | `03_user_experience_flows/30_notification_templates_and_fallbacks_mvp.md` | 03 UX Flows | Draft v1 | CEO/CTO | implement template catalog and fallback routing rules |
| D-028 | `06_operations/24_authenticity_appeal_ops_flow_mvp.md` | 06 Operations | Draft v1 | CEO/CTO | implement appeal case workflow and SLA tracking |
| D-029 | `06_operations/36_integration_failure_fallback_playbook_mvp.md` | 06 Operations | Draft v1 | CTO | validate degraded-mode fallbacks in staging |
| D-030 | `06_operations/39_alert_thresholds_and_escalation_matrix_mvp.md` | 06 Operations | Draft v1 | CTO | configure and tune alert thresholds for pilot traffic |
| D-031 | `06_operations/40_admin_console_requirements_mvp.md` | 06 Operations | Draft v1 | CEO/CTO | implement minimum admin console capabilities for pilot ops |
| D-032 | `04_delivery_and_execution/32_pilot_execution_ready_checklist.md` | 04 Delivery | Draft v1 | CEO/CTO | use as weekly pilot execution gate |
| D-033 | `../Wiki/index.html` | 00 Navigation | Draft v1 | CEO/CTO | keep wiki links in sync with registry |
| D-034 | `00_master_entry_point.md` | 00 Navigation | Draft v1 | CEO/CTO | use as single high-level starting point |
| D-035 | `03_user_experience_flows/41_full_scale_ui_readiness_checklist.md` | 03 UX Flows | Draft v1 | CEO/CTO | track per-screen readiness gates and close P0 gaps |

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
