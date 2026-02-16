# Jobarium Employer User Flow (Full-Scale Product)

## Goal
Give employers a complete hiring operating system that turns role intent into interview-ready candidates with clear controls, measurable quality, and governance-grade compliance.

## Experience Principles
- Configure once, automate safely, tune continuously.
- Keep reviewer attention on decision-ready packets, not raw application noise.
- Explain ranking, authenticity, and risk signals in auditable terms.
- Support team-based decisioning with role-based access and clear ownership.
- Treat reliability, compliance, and integration resilience as first-class UX concerns.

## Employer Journey (Full-Scale)

### Stage E0: Account Creation and Access (Pre-Onboarding)
1. Employer creates account via email/password (+ verification) or social sign-up.
2. Employer accepts legal/privacy baseline terms at account creation.
3. First login routes user into employer onboarding flow (dashboard remains locked).

Success condition:
- Employer account exists and onboarding starts as a separate in-app flow.

### Stage E1: Organization and Access Foundation (Post-Auth)
1. Employer creates workspace with legal entity, operating region, and timezone.
2. Platform verifies company identity and domain.
3. Admin configures teammate invites and RBAC roles (Admin, Recruiter, Hiring Manager, Viewer).
4. Employer accepts platform terms and data processing commitments.

Success condition:
- Secure, compliant workspace with role-scoped access.

### Stage E2: Hiring Program and Job Design
1. Employer selects role template or creates role from scratch.
2. Employer configures:
   - role basics (title, location, schedule, compensation)
   - requirements (must-haves, nice-to-haves, dealbreakers)
   - role-family taxonomy and priority level
3. Employer builds question kit with reusable module blocks.

Success condition:
- Role is structurally valid and screening-ready.

### Stage E3: Automation and Policy Activation
1. Employer configures invite policy and guardrails:
   - trigger mode (top N or threshold)
   - caps, cooldowns, expiry windows
   - channel strategy and quiet hours
2. Platform runs policy validation and quality checks.
3. Employer activates role.

Success condition:
- Matching and invitation automation run within safe policy boundaries.

### Stage E4: Intake and Packet Operations
1. Employer receives completed packets in a prioritized inbox.
2. Inbox supports filtering by role, fit band, authenticity signal, freshness, and status.
3. Employer performs triage queues (high priority, review today, follow-up).

Success condition:
- Review workload is manageable and prioritized.

### Stage E5: Packet Review and Decisioning
1. Employer opens packet detail with:
   - fit explainability
   - dealbreaker outcomes
   - authenticity reason codes and confidence
   - evidence snippets and full transcript
2. Employer actions:
   - interview request
   - clarify request
   - reject with optional reason taxonomy
3. Optional collaborative review and handoff workflows are supported.

Success condition:
- Fast, consistent, and defensible hiring decisions.

### Stage E6: Performance and Continuous Optimization
1. Dashboard tracks role-level funnel quality and velocity.
2. Platform provides recommendation prompts:
   - tune requirements
   - tune invite policy
   - adjust question kit
3. Employer applies changes with versioned policy history.

Success condition:
- Packet quality and conversion improve over time.

### Stage E7: Governance, Integrations, and Program Scale
1. Employer manages audit logs, retention rules, and compliance requests.
2. Employer connects integrations (ATS export, calendar, HRIS, communication providers).
3. Employer scales from single role to multi-role, multi-location hiring programs.

Success condition:
- Hiring program scales without losing control, observability, or compliance posture.

## Hierarchy and Navigation Rules (Employer)
- Account creation and onboarding are separate flows.
- Job setup and automation are separate but sequential operational flows.
- Packet Detail is a child flow of Packet Inbox, not a standalone primary journey.
- Performance dashboard is top-level; packet actions feed it but do not replace it.

## Screen Domains (Full-Scale)

### Foundation and Setup
- organization onboarding and verification
- RBAC and teammate management
- compliance and policy acknowledgments
- role template catalog and job setup wizard

### Operational Hiring
- automation settings and guardrail validation
- packet inbox with queue states
- packet detail and collaborative decisioning
- follow-up and clarification management

### Optimization and Governance
- performance dashboard with recommendation engine
- audit, retention, and compliance console
- integration center and health status

## Required vs Optional Employer Inputs (Full-Scale)

Required:
- legal organization profile and operating region
- primary admin and access roles
- role essentials (title, location, compensation, schedule)
- requirements taxonomy and question kit
- invite policy configuration within safe bounds

Optional but high-value:
- multi-reviewer routing rules
- hiring program SLAs per role family
- integration-specific field mappings
- custom scoring or weighting overrides

## Failure and Edge Flows (Full-Scale)
- zero packet output after activation -> guided requirement relaxation and market reach diagnostics
- packet flood or low-quality surge -> stricter threshold and quality gate recommendations
- policy misconfiguration -> activation block with corrective guidance
- provider degradation -> fallback channels and queued retries
- false-positive authenticity concerns -> confidence transparency and appeal-aware handling
- reviewer conflict -> ownership handoff and escalation path

## Full-Scale Employer KPIs
- time to first packet
- packet review throughput
- packet to interview conversion
- interview to hire conversion (proxy where needed)
- reviewer time saved per role
- policy adjustment success rate
- repeat activation and multi-role expansion rate
- compliance incident rate and resolution SLA

## Strategic Non-Goals (Current Product Line)
- replacing entire enterprise ATS data model in phase one
- bespoke workflow builders for every enterprise edge case
- opaque autonomous hiring actions without human decision checkpoints
