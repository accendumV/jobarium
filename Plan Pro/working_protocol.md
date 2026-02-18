# Working Protocol (Vibe-Coding with AI)

## Owns
- The required sequence of actions to build the right product with AI.
- Stage gates, stop/go checks, and anti-drift rules.

## Excludes
- Product content itself (see `01_product/*`).
- Technical contracts themselves (see `04_implementation/*`).

## Principle
AI is a high-speed implementation partner, not a product decider.
Humans lock decisions; AI executes inside those boundaries.

## Canonical Build Sequence

### Stage 1 - Vision Lock
Input:
- One clear problem statement and target user.

Output:
- `01_product/vision_and_scope.md` with purpose, non-goals, and success metrics.

Go gate:
- Any feature request can be accepted/rejected by vision in under 10 seconds.

Stop condition:
- If two people interpret the purpose differently, do not proceed.

### Stage 2 - Product Scope Lock
Input:
- Vision lock complete.

Output:
- MVP scope list, out-of-scope list, launch criteria baseline.

Go gate:
- No "maybe" features in MVP.
- Every MVP item maps to a metric.

Stop condition:
- If scope exceeds team/time constraints, cut scope before continuing.

### Stage 3 - Persona and JTBD Lock
Input:
- Scope lock complete.

Output:
- Persona definitions and jobs-to-be-done.

Go gate:
- Every story maps to one primary persona/JTBD.

Stop condition:
- If stories are persona-agnostic, refine personas first.

### Stage 4 - User Stories Lock
Input:
- Persona lock complete.

Output:
- Testable stories with binary acceptance criteria.

Go gate:
- Criteria are objective pass/fail.

Stop condition:
- If acceptance criteria are subjective, rewrite before design/coding.

### Stage 5 - Flow and State Lock
Input:
- Stories lock complete.

Output:
- Candidate/employer flows and state machine rules.

Go gate:
- Happy path + error paths + invalid transitions are explicit.

Stop condition:
- If any "what happens when X fails?" has no answer, do not code yet.

### Stage 6 - Contract Lock
Input:
- Flows/states lock complete.

Output:
- API contracts, DB schema/migrations, event contracts.

Go gate:
- Frontend and backend can implement independently without guessing.

Stop condition:
- If same field/behavior is defined differently across docs, resolve once and continue.

### Stage 7 - Vertical Slice Build
Input:
- Contracts lock complete.

Output:
- End-to-end slices (UI + API + DB + events + tests), one user outcome at a time.

Go gate per slice:
- Demoable in staging.
- Contract tests pass.
- Telemetry emitted.

Stop condition:
- If slice is not end-to-end, do not start next slice.

### Stage 8 - Hardening and Launch Gate
Input:
- All MVP slices complete.

Output:
- Reliability, security, compliance, and operational readiness validated.

Go gate:
- `01_product/launch_criteria.md` passes all P0 gates (or explicit approved exceptions).

Stop condition:
- If critical reliability/security gates fail, no launch.

## AI Interaction Rules (Non-Negotiable)
- AI may not expand scope during implementation.
- AI must reference canonical owners before proposing changes.
- One fact has one owner document.
- If conflict exists, update owner doc first, then code.
- No coding without acceptance criteria for the related story.

## Prompt Pattern (Use Every Time)
1. "Current stage is <stage>."
2. "Canonical sources are <paths>."
3. "Do not change scope."
4. "Implement only <story IDs>/<endpoint IDs>/<migration IDs>."
5. "Return diff + tests + unresolved risks."

## Change Control Cadence
- Daily: update progress against current stage gates.
- Per PR: verify no owner-conflict across docs.
- Weekly: reconcile `implementation_master.md` with active work and metrics.

## Drift Signals (Act Immediately)
- Same term has multiple definitions.
- API and DB names diverge from contracts.
- Story acceptance criteria not covered by tests.
- Team starts building horizontal layers instead of vertical outcomes.

If any drift signal appears:
1) pause new development,
2) fix canonical source,
3) regenerate impacted tasks/prompts,
4) resume.
