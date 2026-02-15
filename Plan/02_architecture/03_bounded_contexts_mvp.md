# Bounded Contexts (MVP)

## Purpose
Define a small set of bounded contexts for Jobarium from the start, so that service boundaries, ownership, and integration patterns stay consistent as the system grows.

## Principles Used
- **Bounded context** = explicit boundary with its own consistency scope (aggregates), language, and integration contract (events/APIs).
- **Cross-cutting** = capability used by many contexts; implement as shared capability or thin platform service, not as a domain BC.
- Align with the existing [architecture plan](02_jobarium_architecture_plan.md) service list and entity groupings.

---

## Recommended Bounded Contexts (8)

Target: **fewer contexts** at the start; split only when load or ownership justifies it.

### 1. **Identity & Access**
- **Owns:** `user`, `user_role`, `consent_record`; authentication and authorization.
- **Language:** User, role, consent, session, principal.
- **Why a BC:** Shared by all actors; single place for "who can do what" (RBAC, consent, federated identity).

### 2. **Candidate Profile**
- **Owns:** `candidate_profile`, `candidate_skill`, `candidate_certification`, `candidate_preference`, `candidate_document`, `document_parse_job`, `document_parse_result`, `candidate_enrichment_state`, `candidate_profile_signal`.
- **Language:** Profile, document, parse, enrichment, skill, certification, preference, matchability.
- **Why a BC:** Single consistency boundary for "who the candidate is and what they offer"; CV parsing and enrichment are part of this context.

### 3. **Organization & Billing**
- **Owns:** `organization`, `organization_member`, `employer_profile`; `subscription`, `usage_counter`; plan and limit checks for the org.
- **Language:** Organization, member, employer profile, tenant; subscription, plan, usage, limit.
- **Why billing here:** Subscription is per organization and employers pay; `subscription` and `usage_counter` are keyed by `organization_id`. One boundary for "employer tenant and what they pay / use."
- **Aggregates within BC:** Organization (org, members, employer profile) and Subscription/Usage (subscription, usage_counter per org) can remain distinct aggregates.
- **Future — candidate/individual subscriptions:** If you add paid plans for candidates later, see [Billing placement and future candidate subscriptions](#billing-placement-and-future-candidate-subscriptions) below.

### 4. **Job & Question Kit**
- **Owns:** `job_posting`, `job_requirement`, `job_question_kit`, `job_question`.
- **Language:** Job, requirement, dealbreaker, question kit, question.
- **Why a BC:** Single place for "what the employer is looking for" and the screening questionnaire; one consistency boundary per job.

### 5. **Matching & Ranking**
- **Owns:** `match_score`, `job_shortlist` (who is in/out, rank, entered_at/exited_at).
- **Language:** Match, score, shortlist, eligibility, rank.
- **Why a BC:** Read model over Profile + Job; owns shortlist lifecycle and emits `matching.shortlist.changed`. Distinct from "sending invites."

### 6. **Invitations & Automation**
- **Owns:** `invite`, `invite_delivery`; caps, cooldowns, expiry, dispatch rules.
- **Language:** Invite, delivery, cap, cooldown, dispatch.
- **Why a BC:** "When and how we ask a candidate to complete Q&A"; consumes shortlist events and triggers outbound communication. Owns invite lifecycle.

### 7. **Q&A Session**
- **Owns:** `qa_session`, `qa_answer`, `qa_response_signal`, `qa_authenticity_assessment`.
- **Language:** Session, answer, response signal, authenticity assessment.
- **Why a BC:** Pre-screen flow and its outcomes; owns session lifecycle and authenticity signals. Produces data consumed by Packet.

### 8. **Candidate Packet**
- **Owns:** `candidate_packet`, `packet_action` (interview / clarify / reject); summary, highlights, gaps.
- **Language:** Packet, summary, highlights, gaps, packet action.
- **Why a BC:** Employer-facing deliverable; built from Q&A + profile but has its own lifecycle and employer decisions. "Packet Builder" is the process inside this context.

---

## Domain Entities by Bounded Context

Entity names and groupings below align with the [architecture plan](02_jobarium_architecture_plan.md#domain-entities-core-data-model). Each BC owns the listed entities (source of truth and lifecycle).

| Bounded context | Domain entities |
|-----------------|-----------------|
| **Identity & Access** | `user`, `user_role`, `consent_record` |
| **Candidate Profile** | `candidate_profile`, `candidate_skill`, `candidate_certification`, `candidate_preference`, `candidate_document`, `document_parse_job`, `document_parse_result`, `candidate_enrichment_state`, `candidate_profile_signal` |
| **Organization & Billing** | `organization`, `organization_member`, `employer_profile`, `subscription`, `usage_counter` |
| **Job & Question Kit** | `job_posting`, `job_requirement`, `job_question_kit`, `job_question` |
| **Matching & Ranking** | `match_score`, `job_shortlist` |
| **Invitations & Automation** | `invite`, `invite_delivery` |
| **Q&A Session** | `qa_session`, `qa_answer`, `qa_response_signal`, `qa_authenticity_assessment` |
| **Candidate Packet** | `candidate_packet`, `packet_action` |

**Cross-cutting (not owned by a single BC):**
- `audit_log` — shared kernel; append-only log used by many contexts. Implement in Identity & Access or a shared module (see [Not Bounded Contexts](#not-bounded-contexts-cross-cutting--shared)).

---

## Not Bounded Contexts (Cross-Cutting / Shared)

### Notifications
- **Role:** Delivery mechanism (email, SMS). No domain aggregate; many contexts need to "send a message."
- **Recommendation:** Implement as a **shared capability** (e.g. Notification service or adapter) called by Invitations & Automation, Candidate Packet, and optionally Identity (e.g. verification). Do **not** model as its own domain BC.

### Audit
- **Role:** `audit_log` records who did what. Cross-cutting compliance concern.
- **Recommendation:** **Shared kernel** or small platform capability: append-only log consumed by many contexts. Can live in Identity & Access or a tiny shared module; avoid duplicating audit logic in every BC.

---

## Context Map (Summary)

| Upstream (publishes events) | Downstream (subscribes / calls) |
|-----------------------------|----------------------------------|
| Identity & Access          | All (auth checks) |
| Candidate Profile           | Matching & Ranking; Candidate Packet (read) |
| Organization & Billing      | Job & Question Kit; Invitations (tenant context + limits); Candidate Packet (usage) |
| Job & Question Kit          | Matching & Ranking; Invitations; Q&A (question kit ref); Candidate Packet |
| Matching & Ranking          | Invitations & Automation (`matching.shortlist.changed`) |
| Invitations & Automation    | Q&A Session (invite → session); Notifications (send) |
| Q&A Session                 | Candidate Packet (`qa.submitted`, authenticity); Notifications (reminders) |
| Candidate Packet            | Organization & Billing (usage); Notifications (e.g. "packet ready") |

Integration style: **event-driven** (Pub/Sub) for async flows; **API/synchronous** for auth, read-your-writes, and immediate user actions.

---

## BC Interfaces (conceptual)

For main interaction points between BCs, logical external keys (data overlap), and when to use synchronous vs asynchronous communication, see [04_bc_interfaces_conceptual.md](04_bc_interfaces_conceptual.md).

---

## Mapping to Runtime (Cloud Run)

The architecture plan's "modular monolith style with service boundaries" can map one-to-one to these BCs:

- Identity & Access → Identity & Access service  
- Candidate Profile → Candidate Profile service  
- Organization & Billing → Organization / Employer service (org + subscription + usage)  
- Job & Question Kit → Job & Question Kit service  
- Matching & Ranking → Matching & Ranking service  
- Invitations & Automation → Invitations & Automation service  
- Q&A Session → Q&A Session service  
- Candidate Packet → Packet Builder service  

Notifications and Audit are **not** separate services; they are capabilities used by the above (e.g. Notifications called by Invitations and Packet Builder; Audit can live in Identity & Access or a shared module).

---

## Optional Consolidations (If You Want Even Fewer BCs)

- **Applied:** Billing with Organization → **Organization & Billing** (subscription is per org; employers pay).
- **Matching + Invitations** → Single "Shortlist & Outreach" context. Possible if they always evolve together; kept separate here for clearer ownership (scoring vs. invite policy).
- **Q&A Session + Candidate Packet** → Single "Screening & Packet" context. Reduces boundaries but mixes "capture answers" and "produce employer deliverable"; keeping them separate is recommended.

---

## Open Points
1. Whether **Audit** lives in Identity & Access or in a tiny shared "Platform" module.
2. Naming: "Invitations & Automation" vs "Automation & Invitations" (align with existing architecture doc).
3. When to introduce a **dedicated Billing BC** (e.g. candidate/individual subscriptions, Stripe, dedicated billing team) — see [Billing placement and future candidate subscriptions](#billing-placement-and-future-candidate-subscriptions).
