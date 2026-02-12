# Jobarium Parser Confidence Thresholds and Reprocessing Policy (MVP)

## Purpose
Define:
1. confidence thresholds and user-confirmation rules (item 20),
2. parser reprocessing policy when parser version changes (item 21).

## Confidence Thresholds (MVP Defaults)

### Threshold Bands
- `high` >= 0.85
- `medium` 0.60-0.84
- `low` < 0.60

## Field Handling Rules

### Required Matchability Fields
- Fields:
  - primary role/title
  - work authorization
  - location/radius or remote preference
  - pay expectation
  - start availability
- Rule:
  - never auto-finalize from parser alone.
  - must be user-confirmed at least once.

### Non-Required Enrichment Fields
- Fields:
  - additional skills
  - certifications
  - portfolio links
  - work history bullets
- Rule:
  - `high`: auto-apply allowed if field not user-locked.
  - `medium`: apply as suggestion; user confirmation recommended.
  - `low`: do not auto-apply; explicit user review required.

### Locked Field Rule
- If `locked_by_user=true`, parser cannot overwrite regardless of confidence.

## UX Confirmation Requirements
- Show confidence tag per parsed field (`high|medium|low`).
- Highlight low-confidence fields in "Needs review."
- Provide one-click accept/edit for medium/low suggested values.

## Parser Versioning
- Parser version format: `parser_v{major}.{minor}.{patch}`.
- Store `parser_version` on:
  - parse job
  - parse result
  - candidate field provenance records

## Reprocessing Policy

### Reprocess Triggers
1. major parser version upgrade,
2. extraction bug fix for critical fields,
3. taxonomy normalization changes impacting matching quality.

### Reprocess Scope
- Priority 1:
  - active candidates updated in last 90 days.
- Priority 2:
  - candidates with open invites/active jobs.
- Priority 3:
  - remaining backlog in batches.

### Reprocess Safety Rules
- Never overwrite user-locked fields.
- Preserve prior parse results for audit and diff.
- Emit reprocess event with old/new parser version metadata.

## Operational Limits
- Batch size: tune to keep pipeline under target latency.
- Concurrency caps by tenant to avoid noisy-neighbor impact.
- Pause/retry controls if parse failure rate spikes.

## Acceptance Criteria
- Threshold behavior is deterministic and testable.
- Required fields always require user confirmation.
- Reprocessing runs without corrupting user-confirmed data.
- Audit trail captures parser version transitions and field changes.
