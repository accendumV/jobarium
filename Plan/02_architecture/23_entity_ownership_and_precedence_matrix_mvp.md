# Jobarium Entity Ownership and Precedence Matrix (MVP)

## Purpose
Define source-of-truth ownership and conflict resolution precedence for core entities and derived signals.

This document closes ambiguity for:
- item 5 in system completeness gate,
- concurrent updates from user/manual/parser/enrichment pipelines.

## Precedence Model

### Source Priority (default)
1. **User-confirmed manual input** (highest)
2. **Employer-configured explicit settings** (for employer-owned entities)
3. **System deterministic derivation** (rules-based)
4. **Parser/AI extracted suggestion** (lowest, unless user confirms)

### Timestamp Rule
- For same-priority sources, latest `updated_at` wins.
- Stale updates (older version/timestamp) are ignored.

### Locking Rule
- User-confirmed fields become `locked_by_user=true`.
- Parser/enrichment cannot overwrite locked fields.

## Ownership Matrix

| Entity/Field Group | Canonical Owner | Allowed Writers | Precedence Rule | Notes |
|---|---|---|---|---|
| `candidate_profile` core required fields | candidate user | candidate, platform_admin (support) | user/manual > parser | parser can suggest only |
| `candidate_skill` | candidate + enrichment | candidate, enrichment worker | user/manual > enrichment > parser | maintain provenance per skill |
| `candidate_certification` | candidate | candidate, parser, platform_admin | user/manual > parser | parser suggestions require confirmation when low confidence |
| `candidate_preference` (pay/start/remote) | candidate | candidate | candidate only | parser cannot set directly |
| `candidate_document` metadata | system | upload service, parser service | system deterministic | immutable raw reference |
| `job_posting` fields | employer organization | employer_admin/hiring_manager | employer explicit only | no auto-overwrite |
| `job_requirement` | employer organization | employer_admin/hiring_manager | employer explicit only | templates initialize only |
| `job_question_kit` | employer organization | employer_admin/hiring_manager | employer explicit only | template values editable |
| `match_score` and sub-scores | matching service | matching service | latest model/ranking version | recompute replaces prior snapshot |
| `job_shortlist` | matching service | matching service | latest shortlist version | delta events emitted |
| `invite` | automation service | automation service, platform_admin (cancel only) | state machine guards | no direct writes by employer UI |
| `qa_answer` | candidate | candidate (session owner) | session/state guard | immutable after submit |
| `qa_authenticity_assessment` | authenticity service | authenticity service, platform_admin (override with reason) | latest assessment version | override always audited |
| `candidate_packet` | packet builder service | packet builder, platform_admin (support correction) | latest valid packet; supersede by policy | decisions append to `packet_action` |
| `subscription` | billing service | billing service, platform_admin | billing service canonical | manual adjustments audited |

## Field-Level Conflict Resolution Rules

### Candidate profile fields
- If `locked_by_user=true`: reject parser/enrichment overwrite.
- If unlocked and parser confidence >= threshold: auto-apply allowed only for non-required enrichment fields.
- Required fields (`authorization`, `location/radius`, `pay`, `availability`, `primary role`) always need user confirmation on first set.

### Skills and certifications
- Preserve multiple evidence sources:
  - `source=user`
  - `source=parser`
  - `source=enrichment`
- UI displays consolidated canonical value; backend stores provenance.

### Matching/ranking artifacts
- Treat as derived, ephemeral artifacts.
- Never allow manual edits to `match_score` or `job_shortlist`.

## Write API Guard Requirements
- Every write must include:
  - `source_type` (`user|service|parser|enrichment|admin`)
  - `entity_version` or `updated_at`
- Service enforces optimistic concurrency:
  - reject if version mismatch (`409`).

## Audit Requirements
- Log conflict rejections with reason:
  - `SOURCE_PRECEDENCE_BLOCK`
  - `LOCKED_FIELD_REJECTED`
  - `STALE_VERSION_REJECTED`

## Implementation Notes
- Add provenance columns where missing:
  - `source_type`
  - `source_version`
  - `locked_by_user`
  - `confidence` (for extracted fields)
- Add helper service for merge rules to avoid duplicating logic.
