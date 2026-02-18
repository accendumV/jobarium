# Sprint Plan (8 Weeks)

## Owns
- Time-phased implementation sequence and dependencies.

## Excludes
- Detailed story definitions (see `../01_product/user_stories.md`).
- Incident runbooks (see `../05_operations/runbook.md`).

## Canonical Order
- This plan executes slices in strict dependency order from `vertical_slices.md`.
- Sequence is fixed: `S1 -> S2 -> S3 -> S4 -> S5 -> S6`.

## Week-to-Slice Mapping

### Week 1 - Slice S1 (Candidate account + consent + builder draft)
- Implement `AUTH-001`, `AUTH-002`, `AUTH-003`, `CAND-001`, `CAND-006`, `CAND-007`, `CAND-005`.
- Deliver auth/consent/profile draft persistence + matchability baseline.
- Exit gate: S1 DoD passes in staging.

### Week 2 - Slice S2 (Resume upload/parse/fallback)
- Implement `CAND-003`, `CAND-008` with parse lifecycle and fallback to manual builder.
- Add parse status/error surfacing and retry path.
- Exit gate: S2 DoD passes in staging.

### Week 3 - Slice S3 (Matchability + candidate match visibility)
- Implement `CAND-002`, `CAND-004`, `INV-001` candidate-side visibility.
- Deliver ready-state transitions + invite transparency + ranking snippet surface.
- Exit gate: S3 DoD passes in staging.

### Week 4 - Slice S4 (Employer setup + automation)
- Implement `EMP-001`, `EMP-002`, `EMP-003`, `EMP-004`, `EMP-005`, `EMP-006`.
- Deliver org setup, job draft/activation, and guardrail persistence.
- Exit gate: S4 DoD passes in staging.

### Week 5 - Slice S5 (Invite -> Q&A submission)
- Implement `QA-001`, `QA-002`, `QA-003` with invite lifecycle handoff.
- Deliver Q&A autosave, submit validation, and authenticity assessment trigger.
- Exit gate: S5 DoD passes in staging.

### Week 6 - Slice S6 (Packet + employer actions + admin ops baseline)
- Implement `PKT-001`, `PKT-002`, `PKT-003`, `ADM-001..ADM-004`.
- Deliver packet review/action, replay visibility, and GDPR operation endpoints.
- Exit gate: S6 DoD passes in staging.

### Week 7 - Hardening Pass (cross-slice)
- Resolve cross-slice defects found in S1-S6.
- Complete performance tuning, audit coverage, retry/DLQ hardening.
- Exit gate: no blocker defects across P0 slices.

### Week 8 - Launch Readiness
- Full E2E regression and contract-test sweep.
- Operational rehearsal and incident simulation.
- Go/no-go review against `../01_product/launch_criteria.md`.

## No-Drift Rule
- If slice DoD is not met, next slice work does not start.
- Any scope additions must be added to a new slice or explicit hardening item, not hidden inside an active slice.
