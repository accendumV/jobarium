# Document Registry

## Owns
- Canonical list of Plan Pro files and their status/owner.

## Excludes
- Business or technical content details.

| File | Owner | Status | Notes |
|---|---|---|---|
| `README.md` | Product + Tech Lead | active | Root orientation and usage rules for Plan Pro |
| `00_navigation/README.md` | Product + Tech Lead | active | Reading order and navigation rules |
| `00_navigation/traceability_matrix.md` | Product + Tech Lead | active | Single audit matrix across stories, slices, contracts, states, data, tests |
| `working_protocol.md` | Product + Tech Lead | active | Canonical sequence and stage gates for AI-assisted execution |
| `00_navigation/decisions_log.md` | Product + Tech Lead | active | Canonical decisions and launch exceptions log |
| `implementation_master.md` | Product + Tech Lead | active | Primary execution plan |
| `01_product/vision_and_scope.md` | Product | active | Scope and non-goals |
| `01_product/personas_jtbd.md` | Product | active | Canonical personas and JTBD baseline |
| `01_product/user_stories.md` | Product + Eng | active | Stories and acceptance |
| `01_product/launch_criteria.md` | Product + Ops | active | Go/no-go gates |
| `02_architecture/system_design.md` | Architecture | active | Runtime and stack |
| `02_architecture/bounded_contexts.md` | Architecture | active | BC boundaries |
| `02_architecture/integration_contracts.md` | Architecture + Backend | active | Events/interfaces |
| `02_architecture/data_model.md` | Data + Backend | active | Entities and precedence |
| `02_architecture/state_machines.md` | Backend | active | Lifecycle contracts |
| `02_architecture/security_and_compliance.md` | Security + Backend | active | RBAC/audit/GDPR |
| `02_architecture/operations_config.md` | Backend + Ops | active | Threshold/default configs |
| `03_user_experience/candidate_journey.md` | Product + UX | active | Candidate flow |
| `03_user_experience/employer_journey.md` | Product + UX | active | Employer flow |
| `03_user_experience/golden_flow.md` | Product + Architecture | active | E2E handoffs |
| `03_user_experience/ui_specification.md` | UX | active | Screens/states/readiness |
| `03_user_experience/notifications.md` | Product + Ops | active | Template/fallback rules |
| `04_implementation/sprint_plan.md` | Eng Manager | active | Build sequence |
| `04_implementation/vertical_slices.md` | Product + Eng | active | Canonical end-to-end build units and DoD |
| `04_implementation/api_contracts.md` | Backend | active | Endpoint contracts |
| `04_implementation/openapi.yaml` | Backend | active | Machine-readable API contract |
| `04_implementation/database_schema.md` | Data + Backend | active | DDL and migrations |
| `04_implementation/sql_migrations/` | Data + Backend | active | Executable SQL migration files (`001_extensions.sql`..`080_indexes.sql`) |
| `04_implementation/migration_runbook.md` | Data + Platform | active | Migration apply/validate/rollback operational procedure |
| `04_implementation/test_strategy.md` | QA + Eng | active | Test gates |
| `04_implementation/test_case_matrix.md` | QA + Eng | active | Story-to-test executable mapping |
| `04_implementation/definition_of_ready.md` | Product + Eng | active | Ticket readiness gate before implementation starts |
| `04_implementation/deployment_pipeline.md` | Platform | active | CI/CD and rollback |
| `04_implementation/monitoring_spec.md` | SRE/Ops | active | SLO, alerts, dashboards |
| `05_operations/runbook.md` | Ops | active | Incident playbooks |
| `05_operations/admin_console.md` | Ops + Product | active | Admin capabilities |
| `05_operations/incident_response.md` | Ops | active | Sev model/escalation |
| `05_operations/readiness_evidence.md` | Product + Ops | active | Launch-gate evidence and exception linkage |

## Status Values
- `draft`: incomplete and not executable.
- `active`: approved for implementation use.
- `deprecated`: replaced by another file owner.
