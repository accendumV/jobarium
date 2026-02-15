# Bounded Contexts (MVP)

## Purpose
Define a small set of bounded contexts for Jobarium from the start, so that service boundaries, ownership, and integration patterns stay consistent as the system grows.

## Principles Used
- **Bounded context** = explicit boundary with its own consistency scope (aggregates), language, and integration contract (events/APIs).
- **Cross-cutting** = capability used by many contexts; implement as shared capability or thin platform service, not as a domain BC.
- Align with the existing [architecture plan](02_jobarium_architecture_plan.md) service list and entity groupings.

---

## Recommended Bounded Contexts (9)

Target: **fewer contexts** at the start; split only when load or ownership justifies it.

### 1. **Identity & Access**
- **Owns:** `user`, `user_role`, `consent_record`; authentication and authorization.
- **Language:** User, role, consent, session, principal.
- **Why a BC:** Shared by all actors; single place for "who can do what" (RBAC, consent, federated identity).

### 2. **Candidate Profile**
- **Owns:** `candidate_profile`, `candidate_skill`, `candidate_certification`, `candidate_preference`, `candidate_document`, `document_parse_job`, `document_parse_result`, `candidate_enrichment_state`, `candidate_profile_signal`.
- **Language:** Profile, document, parse, enrichment, skill, certification, preference, matchability.
- **Why a BC:** Single consistency boundary for "who the candidate is and what they offer"; CV parsing and enrichment are part of this context.

### 3. **Organization**
- **Owns:** `organization`, `organization_member`, `employer_profile`.
- **Language:** Organization, member, employer profile, tenant.
- **Why a BC:** Single place for "employer tenant" — who they are, who belongs, brand preferences. Billing is kept separate so billing models (org vs individual vs candidate) can evolve independently.

### 4. **Billing**
- **Owns:** `subscription`, `usage_counter`; plan and limit checks.
- **Language:** Subscription, plan, usage, limit, billable party.
- **Why a BC:** Billing models are uncertain — may be tied to organizations, individuals (hiring professionals), or optionally candidates. Keeping Billing separate avoids locking in one model; it can reference `organization_id` and/or `user_id` as the billable party as the product evolves.

### 5. **Job & Question Kit**
- **Owns:** `job_posting`, `job_requirement`, `job_question_kit`, `job_question`.
- **Language:** Job, requirement, dealbreaker, question kit, question.
- **Why a BC:** Single place for "what the employer is looking for" and the screening questionnaire; one consistency boundary per job.

### 6. **Matching & Ranking**
- **Owns:** `match_score`, `job_shortlist` (who is in/out, rank, entered_at/exited_at).
- **Language:** Match, score, shortlist, eligibility, rank.
- **Why a BC:** Read model over Profile + Job; owns shortlist lifecycle and emits `matching.shortlist.changed`. Distinct from "sending invites."

### 7. **Invitations & Automation**
- **Owns:** `invite`, `invite_delivery`; caps, cooldowns, expiry, dispatch rules.
- **Language:** Invite, delivery, cap, cooldown, dispatch.
- **Why a BC:** "When and how we ask a candidate to complete Q&A"; consumes shortlist events and triggers outbound communication. Owns invite lifecycle.

### 8. **Q&A Session**
- **Owns:** `qa_session`, `qa_answer`, `qa_response_signal`, `qa_authenticity_assessment`.
- **Language:** Session, answer, response signal, authenticity assessment.
- **Why a BC:** Pre-screen flow and its outcomes; owns session lifecycle and authenticity signals. Produces data consumed by Packet.

### 9. **Candidate Packet**
- **Owns:** `candidate_packet`, `packet_action` (interview / clarify / reject); summary, highlights, gaps.
- **Language:** Packet, summary, highlights, gaps, packet action.
- **Why a BC:** Employer-facing deliverable; built from Q&A + profile but has its own lifecycle and employer decisions. "Packet Builder" is the process inside this context.

---

## Domain Entities by Bounded Context

Each BC owns the listed entities (source of truth). Aligns with [architecture plan](02_jobarium_architecture_plan.md#domain-entities-core-data-model).

| Bounded context | Domain entities |
|-----------------|-----------------|
| **Identity & Access** | `user`, `user_role`, `consent_record` |
| **Candidate Profile** | `candidate_profile`, `candidate_skill`, `candidate_certification`, `candidate_preference`, `candidate_document`, `document_parse_job`, `document_parse_result`, `candidate_enrichment_state`, `candidate_profile_signal` |
| **Organization** | `organization`, `organization_member`, `employer_profile` |
| **Billing** | `subscription`, `usage_counter` |
| **Job & Question Kit** | `job_posting`, `job_requirement`, `job_question_kit`, `job_question` |
| **Matching & Ranking** | `match_score`, `job_shortlist` |
| **Invitations & Automation** | `invite`, `invite_delivery` |
| **Q&A Session** | `qa_session`, `qa_answer`, `qa_response_signal`, `qa_authenticity_assessment` |
| **Candidate Packet** | `candidate_packet`, `packet_action` |

**Cross-cutting:** `audit_log` — shared kernel; Identity & Access or shared module (see below).

---

## Not Bounded Contexts (Cross-Cutting / Shared)

### Notifications
Delivery (email, SMS). Shared capability used by Invitations, Candidate Packet, optionally Identity; not a domain BC.

### Audit
`audit_log` — who did what. Shared kernel or small platform capability; Identity & Access or shared module.

---

## Context Map and BC interfaces

[04_bc_interfaces_conceptual.md](04_bc_interfaces_conceptual.md): interaction points, external keys, sync vs async, diagram. Style: event-driven (Pub/Sub) for async; API/sync for auth and read-your-writes.

---

## Optional Consolidations (If You Want Even Fewer BCs)

- **Matching + Invitations** → "Shortlist & Outreach"; kept separate for ownership (scoring vs. invite policy).
- **Q&A Session + Candidate Packet** → "Screening & Packet"; kept separate to avoid mixing capture vs. deliverable.

---

## Open Points
1. Whether **Audit** lives in Identity & Access or in a tiny shared "Platform" module.
2. Naming: "Invitations & Automation" vs "Automation & Invitations" (align with existing architecture doc).
3. Billing model: how billable party is scoped (organization_id vs user_id vs both) and when to add candidate/individual plans — to be decided when product and pricing are fixed.
