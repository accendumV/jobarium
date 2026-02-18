# Operations Configuration Contracts

## Owns
- Runtime thresholds/defaults impacting automation, parsing, ranking, and authenticity behavior.

## Excludes
- Incident handling steps (see `../05_operations/*`).
- State transition logic (see `state_machines.md`).

## Invite Automation Defaults
- Daily per-job invite cap.
- Candidate cooldown period per job.
- Invite expiry window.
- Top-N/score threshold gate for dispatch.

## Parser/Reprocessing Defaults
- Confidence thresholds for auto-accept, confirm-required, reject/manual.
- Reprocess triggers: parser model bump, candidate request, failed parse recovery.
- Locked field protection enabled by default.

## Ranking/Explainability Defaults
- Versioned scoring model ID.
- Explainability payload with sub-scores and reason snippets.
- Safe rollout/rollback procedure for scoring version changes.

## Authenticity Defaults
- Policy buckets: `likely_self_authored|mixed_assistance|heavy_assistance_suspected`.
- Advisory-only action policy for MVP.
- Reason code cap in UI output.

## Change Control
- Any threshold/default change requires:
  - owner approval,
  - changelog entry,
  - rollout + rollback note.
