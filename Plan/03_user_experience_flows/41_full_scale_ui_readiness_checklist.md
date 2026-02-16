# Jobarium Full-Scale UI Screen Readiness Checklist

## Purpose
Provide one implementation-facing checklist for all required screens, with:
- screen inventory across candidate, employer, shared, and admin areas,
- textual element requirements per screen,
- readiness gates to track design-to-build completion.

## Readiness Legend
- `P0`: launch critical
- `P1`: post-launch high value
- Readiness columns use:
  - `[ ]` not ready
  - `[x]` ready
  - `[-]` not applicable

## Candidate Screens

| ID | Screen | Priority | Required UI elements (must be present) | IA/Flow | States | Data/API | Analytics | RBAC | Copy | A11y | QA |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CAND-001 | Start / Role Select | P0 | Role switch, entry fields, CTA to candidate/employer account creation, legal links | [x] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| CAND-002 | Candidate Account Creation | P0 | Email/password form, Google/LinkedIn sign-up, consent text, validation errors, submit CTA | [x] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| CAND-003 | Candidate Login | P0 | Login form, SSO buttons, forgot-password link, invalid credentials and lockout states | [ ] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| CAND-004 | Email Verification + First Login Gate | P0 | Verification status, resend action, onboarding-required notice, support fallback | [ ] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| CAND-005 | Password Recovery | P1 | Reset request, token verification, new password form, expiry/error states | [ ] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| CAND-006 | Candidate Onboarding Wizard | P0 | Stepper, source intake, CV/doc upload + parse, completeness summary, enrichment fields, visibility default Active, final review, gated next/back | [x] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| CAND-007 | Candidate Dashboard | P0 | KPI cards, shortcuts, alert/attention module, flow step links, empty/error placeholders | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-008 | Matching (Parent View) | P0 | Shortlist-only list, fit + why matched, nested invitation/screening/outcome statuses, TTFM card, cap controls | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-009 | Invite Detail (Nested) | P0 | Role/company summary, compensation/location/timebox, expiry, start/decline CTAs | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-010 | Screening / Q&A (Nested) | P0 | Question renderer, autosave, progress, authenticity disclosure, validation and submit | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-011 | Match Outcome Detail (Nested) | P0 | Outcome timeline/status, explanation, next actions | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-012 | Interviews | P0 | Interview list, slot picker, calendar connect/sync, confirm/reschedule/cancel | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-013 | Job Offers | P0 | Offer list, offer detail, accept/decline CTAs, expiry banner, confirmation | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-014 | Candidate Profile | P0 | Editable profile sections, readiness score, docs list, visibility control, save feedback | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-015 | Notification Preferences | P1 | Email/SMS/in-app toggles, digest vs realtime controls, save feedback | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-016 | Privacy + Consent Center | P1 | Consent version history, export/delete/anonymize actions, retention notices | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| CAND-017 | Candidate Support + Appeals | P1 | Issue form, authenticity appeal flow, case status timeline, attachments | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Employer Screens

| ID | Screen | Priority | Required UI elements (must be present) | IA/Flow | States | Data/API | Analytics | RBAC | Copy | A11y | QA |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EMP-001 | Employer Account Creation | P0 | Work email/password/company/role form, terms acceptance, SSO options, submit CTA | [x] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| EMP-002 | Employer Login | P0 | Login form, SSO, forgot-password, lockout/invalid credential states | [ ] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| EMP-003 | Verification + First Login Gate | P0 | Verification status, resend action, required onboarding route | [ ] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| EMP-004 | Employer Onboarding Wizard | P0 | Stepper, org data, RBAC bootstrap, compliance acknowledgments, integrations setup, defaults, completion gate | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-005 | Employer Dashboard (includes Performance) | P0 | KPI cards, pending workload, shortcuts, integrated performance metrics and recommendations | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-006 | Job Setup Wizard | P0 | Multi-step setup with inferred completion (no manual checkboxes), basics, requirements, question kit, validation summary | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-007 | Automation Center | P0 | Policy controls, read-only internal validation statuses, activation gating, save/activate actions | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-008 | Jobs Program Management | P1 | Jobs table, status filters, create/clone/archive actions, health indicators per job | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-009 | Packets Workspace - List | P0 | Packet list, role/date/fit/authenticity filters, sort controls, packet job reference, open detail action | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-010 | Packets Workspace - Detail | P0 | Packet/candidate/job reference block, fit summary, dealbreakers, authenticity reason codes, evidence, actions | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-011 | Packets Workspace - Setup | P0 | Packet composition controls, decision rules, save setup, return to packet list | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-012 | Team + RBAC Management | P1 | Member list, invite teammate, role assignment and revocation, access history | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-013 | Integration Health Center | P1 | Provider status cards (ATS/calendar/comms), reconnect actions, failure diagnostics | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-014 | Audit Log Explorer | P1 | Immutable audit table, filters by actor/action/time/job, export action | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-015 | Billing + Usage | P1 | Plan card, usage counters, invoices, subscription controls | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| EMP-016 | Employer Support + Incident View | P1 | Incident banner, degraded mode guidance, escalation/support actions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Shared Screens

| ID | Screen | Priority | Required UI elements (must be present) | IA/Flow | States | Data/API | Analytics | RBAC | Copy | A11y | QA |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SHARED-001 | Notification Center | P1 | Notification feed, unread/read controls, deep links to match/invite/packet/interview/offer | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| SHARED-002 | Global Search | P1 | Search input, entity filters, grouped results, keyboard navigation | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| SHARED-003 | Error + Retry Surface | P0 | Contextual error panel, retry CTA, safe fallback action, support link | [ ] | [ ] | [ ] | [ ] | [-] | [ ] | [ ] | [ ] |
| SHARED-004 | Session + Security | P1 | Active session list, device history, revoke session, optional MFA controls | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Admin / Operations Screens

| ID | Screen | Priority | Required UI elements (must be present) | IA/Flow | States | Data/API | Analytics | RBAC | Copy | A11y | QA |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ADMIN-001 | Pipeline Monitor | P1 | Failed jobs table (parse/enrichment/match/notify), reason panel, retry actions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| ADMIN-002 | Authenticity Ops Console | P1 | Flagged assessment queue, reason breakdown, reviewer decisions, appeal linkage | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| ADMIN-003 | Integration Failures Console | P1 | Provider incident timeline, impacted entities, fallback state, rerun actions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| ADMIN-004 | Alerting + Escalation Matrix | P1 | Threshold config, route matrix, alert history, acknowledge/escalate actions | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| ADMIN-005 | Template Governance | P1 | Template library (question kits/notifications), versioning, publish controls | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Global Readiness Gates (apply to all P0 screens)

- [ ] One primary CTA and one safe secondary CTA.
- [ ] Required UX states defined: loading, empty, error_recoverable, error_blocking, success_feedback.
- [ ] Input validation and error messaging copy are present.
- [ ] Data contract and payload shape confirmed with backend.
- [ ] Analytics events mapped to screen actions.
- [ ] Permission checks and unauthorized behavior defined.
- [ ] Accessibility baseline implemented (keyboard, labels, contrast, focus states).
- [ ] Mobile behavior verified for candidate-facing screens.

## Notes on Current Structure Decisions

- Candidate hierarchy is enforced: `Matching` is parent; `Invitations`, `Screening`, and `Outcomes` are nested.
- Candidate sees matches only when shortlisted.
- Employer navigation is simplified:
  - `Packets` is one workspace (List + Detail + Setup),
  - `Performance` is integrated into `Dashboard`.
- Internal checks (for example, automation guardrails) are system validations, not user tasks.
