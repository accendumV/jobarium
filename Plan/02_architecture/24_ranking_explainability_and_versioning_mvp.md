# Jobarium Ranking Explainability and Versioning Spec (MVP)

## Purpose
Define:
1. explainability payload format for match results (item 10),
2. ranking versioning and rollback strategy (item 12).

## Explainability Payload Contract (`v1`)

### Object: `match_explainability`
- `candidate_id` (string)
- `job_id` (string)
- `ranking_version` (string, e.g. `rank_v1_2026_02`)
- `total_score` (0-100)
- `sub_scores` (object):
  - `skills`
  - `title_role`
  - `domain`
  - `experience`
  - `location`
  - `pay`
  - `availability`
  - `recency`
  - `profile_quality`
- `hard_filter_results` (object):
  - authorization: `pass|fail|unknown`
  - location: `pass|fail|unknown`
  - pay_overlap: `pass|fail|unknown`
  - start_date: `pass|fail|unknown`
  - required_cert: `pass|fail|unknown`
- `why_matched` (array[string], min 1, max 5)
- `gaps_or_unknowns` (array[string], min 0, max 5)
- `computed_at` (ISO string)

### UI Guidance
- Employer UI must show:
  - top 3 positive reasons from `why_matched`
  - top 3 risks from `gaps_or_unknowns`
  - sub-score breakdown on demand

## Ranking Version Model

### Version Identifier
- Format: `rank_v{major}_{YYYY}_{MM}`
- Example: `rank_v1_2026_02`

### When to Bump Version
- major bump:
  - weight changes impacting ordering materially
  - scoring formula changes
  - hard filter semantics changes
- minor metadata change (no ordering impact):
  - keep same ranking version

### Storage Requirements
- Persist `ranking_version` with each `match_score`.
- Persist `shortlist_version` with each shortlist snapshot.
- Keep previous ranking snapshots for at least 30 days during pilot.

## Rollout and Rollback Strategy

### Safe Rollout
1. Compute candidate ordering in shadow mode for sample jobs.
2. Compare with current version:
   - overlap,
   - ordering deltas,
   - packet/interview conversion proxy.
3. Enable new version behind feature flag.
4. Promote to default after monitoring window.

### Rollback Trigger Conditions
- significant drop in packet->interview rate,
- abnormal shortlist volatility,
- support complaints tied to relevance quality.

### Rollback Procedure
1. Switch feature flag to prior `ranking_version`.
2. Recompute shortlist for active jobs.
3. Emit `matching.shortlist.changed` with rollback marker.
4. Record decision and incident note.

## Governance
- Ranking changes require:
  - CTO approval,
  - documented rationale,
  - decision log entry.
- Pilot cadence:
  - evaluate weekly; avoid more than one major ranking change per week.
