# Implementation Master Plan (MVP)

## Owns
- End-to-end execution sequence for the MVP.
- Dependency order across product, architecture, UX, engineering, and operations.
- Entry criteria and exit criteria for each phase.

## Excludes
- Deep domain specs (kept in referenced files).
- Repeating API payloads, schema fields, or UI copy.

## 1) Scope Lock
- MVP goal: deliver packet-first hiring flow with candidate onboarding, parsing, matching, invite, Q&A, packet generation, and employer decisioning.
- Out of scope for MVP: advanced analytics suite, broad multi-region rollout, large integration marketplace.
- Source: `01_product/vision_and_scope.md`

## 2) Canonical References (No Duplication)
- Process protocol: `working_protocol.md`
- Decisions and exceptions: `00_navigation/decisions_log.md`
- Cross-domain audit matrix: `00_navigation/traceability_matrix.md`
- Product: `01_product/vision_and_scope.md`, `01_product/personas_jtbd.md`, `01_product/user_stories.md`, `01_product/launch_criteria.md`
- Architecture: `02_architecture/system_design.md`, `02_architecture/bounded_contexts.md`, `02_architecture/integration_contracts.md`, `02_architecture/data_model.md`, `02_architecture/state_machines.md`, `02_architecture/security_and_compliance.md`, `02_architecture/operations_config.md`
- UX: `03_user_experience/candidate_journey.md`, `03_user_experience/employer_journey.md`, `03_user_experience/golden_flow.md`, `03_user_experience/ui_specification.md`, `03_user_experience/notifications.md`
- Build/QA: `04_implementation/sprint_plan.md`, `04_implementation/vertical_slices.md`, `04_implementation/definition_of_ready.md`, `04_implementation/api_contracts.md`, `04_implementation/openapi.yaml`, `04_implementation/database_schema.md`, `04_implementation/sql_migrations/`, `04_implementation/migration_runbook.md`, `04_implementation/test_strategy.md`, `04_implementation/test_case_matrix.md`, `04_implementation/deployment_pipeline.md`, `04_implementation/monitoring_spec.md`
- Ops: `05_operations/runbook.md`, `05_operations/admin_console.md`, `05_operations/incident_response.md`, `05_operations/readiness_evidence.md`

## 3) Delivery Phases

### Phase 0 - Foundations
Entry:
- Scope and stories approved.
- BC boundaries and event names locked.

Deliverables:
- API contract v1 skeleton.
- DB schema v1 baseline.
- CI pipeline with lint/test/migrate stages.

Exit:
- `04_implementation/api_contracts.md` has all P0 endpoints marked `draft` or `approved`.
- `04_implementation/database_schema.md` migration plan accepted.

### Phase 1 - Candidate + Employer Core Paths
Entry:
- Phase 0 exit complete.

Deliverables:
- Candidate onboarding + CV upload/import + parse confirmation.
- Employer onboarding + job setup + automation settings.
- Matching shortlist generation and invite dispatch flow.

Exit:
- Candidate and employer critical paths pass E2E smoke tests.
- Event publishing/consuming works for P0 events.

### Phase 2 - Q&A, Packet, and Decisioning
Entry:
- Phase 1 exit complete.

Deliverables:
- Q&A session lifecycle with authenticity assessment hooks.
- Packet assembly and employer review surface.
- Decision actions and status propagation.

Exit:
- Packet generation success rate and latency meet initial targets.
- State machine invariants pass contract tests.

### Phase 3 - Hardening and Pilot Readiness
Entry:
- Phase 2 exit complete.

Deliverables:
- Alerting, dashboards, DLQ replay, incident playbooks.
- RBAC hardening, audit coverage, GDPR path validation.
- Go/no-go assessment against launch criteria.

Exit:
- `01_product/launch_criteria.md` all P0 gates pass.
- Pilot support runbook trial completed.

## 4) Dependency Graph (Build Order)
1. Bounded contexts + state machines
2. API contracts + database schema
3. Candidate/employer UX flows
4. Event contracts + async workers
5. Matching, invite, Q&A, packet services
6. Security/compliance hardening
7. Monitoring + incident operations
8. Launch gate review

## 5) Non-Redundancy Guardrails
- Architecture decisions live only in `02_architecture/*`.
- Execution sequencing lives only in `04_implementation/sprint_plan.md`.
- Operational procedures live only in `05_operations/*`.
- `implementation_master.md` references, it does not restate.

## 6) Open Implementation Risks (Must Burn Down)
- API surface drift before frontend alignment.
- Parser confidence and reprocessing churn increasing support load.
- Event contract version mismatch across services.
- Authenticity false positives causing manual-review spikes.
- Incomplete audit events blocking compliance sign-off.
