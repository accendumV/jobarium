# Jobarium Master Entry Point

## Why this document exists
This is the single high-level entry point for the entire planning set.

Use it to:
- understand the full system quickly,
- see what is already defined,
- navigate into deeper documents in the right order.

---

## 1) Executive Snapshot
Jobarium is an automation-first hiring platform:
- candidates create one profile,
- employers configure roles once,
- matching and pre-screening run in the background,
- employers review completed candidate packets, not application floods.

Core objective:
- reduce hiring friction on both sides while preserving trust, explainability, and operational control.

---

## 2) Current Planning Status (high level)
- System completeness gate: `Pass`
- Critical gaps (Red): `0`
- Remaining maturity work: document-by-document review/approval with CEO + CTO.

Primary planning assets already defined:
- product framing and HR value requirements,
- architecture and data/event contracts,
- user flows and UI inventory,
- security/compliance baseline,
- operations runbooks and fallback procedures.

---

## 3) How the System Works (one-page view)
1. Candidate signs up, uploads CV, confirms key fields.
2. Employer sets role requirements, question kit, and invite automation.
3. Matching pipeline filters and ranks candidates.
4. Auto-invites are sent with safeguards (caps/cooldowns/expiry).
5. Candidate completes async Q&A.
6. Packet builder generates employer-ready packet.
7. Employer takes action (interview/clarify/reject).
8. Outcome signals feed continuous improvement.

Trust and safety layers:
- authenticity risk signals for Q&A,
- RBAC and audit logging,
- GDPR workflows and retention policies,
- incident response and replay runbooks.

---

## 4) Read This First (recommended sequence)

### Step A: Vision and scope
1. `01_product/01_jobarium_one_pager.md`
2. `01_product/08_hr_value_requirements.md`
3. `01_product/11_priority_matrix_mvp.md`

### Step B: Architecture backbone
4. `02_architecture/02_jobarium_architecture_plan.md`
5. `02_architecture/12_system_completeness_gate.md`
6. `02_architecture/13_state_machines_mvp.md`
7. `02_architecture/14_event_contracts_registry.md`

### Step C: UX and user experience
8. `03_user_experience_flows/03_candidate_user_flow.md`
9. `03_user_experience_flows/04_employer_user_flow.md`
10. `03_user_experience_flows/15_ui_screen_inventory_mvp.md`

### Step D: Security and operations
11. `02_architecture/17_rbac_matrix_mvp.md`
12. `06_operations/19_audit_logging_and_retention_mvp.md`
13. `06_operations/16_pilot_support_runbook.md`

---

## 5) Guided Paths by Audience

### CEO path (strategy + launch readiness)
- `01_product/01_jobarium_one_pager.md`
- `01_product/12_launch_definition_of_done.md`
- `04_delivery_and_execution/32_pilot_execution_ready_checklist.md`
- `07_decisions_log/07_decisions_log.md`

### CTO path (build and reliability)
- `02_architecture/02_jobarium_architecture_plan.md`
- `02_architecture/13_state_machines_mvp.md`
- `02_architecture/14_event_contracts_registry.md`
- `02_architecture/21_schema_versioning_and_migrations_mvp.md`
- `06_operations/39_alert_thresholds_and_escalation_matrix_mvp.md`

### HR reviewer path (value validation)
- `01_product/08_hr_value_requirements.md`
- `01_product/09_user_personas.md`
- `03_user_experience_flows/04_employer_user_flow.md`
- `03_user_experience_flows/05_end_to_end_golden_flow.md`

### Product/UX path
- `01_product/10_user_stories_mvp.md`
- `03_user_experience_flows/15_ui_screen_inventory_mvp.md`
- `03_user_experience_flows/29_ui_state_standards_mvp.md`
- `03_user_experience_flows/30_notification_templates_and_fallbacks_mvp.md`

### Ops/Support path
- `06_operations/16_pilot_support_runbook.md`
- `06_operations/24_authenticity_appeal_ops_flow_mvp.md`
- `06_operations/36_integration_failure_fallback_playbook_mvp.md`
- `06_operations/40_admin_console_requirements_mvp.md`

---

## 6) Governance Note
All documents are currently tracked as `Draft v1` in:
- `00_project_plan_index.md`

Review and approve one-by-one with CTO, then update status in the registry.

---

## 7) Supporting Navigation
- Registry source of truth: `00_project_plan_index.md`
- Wiki navigator: `../Wiki/index.html`

Use this master entry for orientation, then use the registry and Wiki navigator for detailed navigation.
