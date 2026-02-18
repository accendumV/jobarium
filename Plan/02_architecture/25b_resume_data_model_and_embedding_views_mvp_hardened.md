# Resume Data Model and Embedding Views (MVP Hardened Variation)

## Purpose
This is a production-hardened variation of:
- `25_resume_data_model_and_embedding_views_mvp.md`

It preserves the same core direction:
- canonical resume JSON as source of truth
- derived embedding/projection views

And adds missing safeguards for:
- large-scale operations (millions of resumes)
- parser/user conflict handling
- strong UI support for lock/override workflows
- domain variability across trade verticals

---

## Keep From Original (No Change)
- Canonical JSON remains authoritative.
- Embeddings and projections remain derived and regenerable.
- UI uses ordered sections/items and extensible fields.
- Per-field provenance remains required.
- Versioning and re-embedding remain first-class.

---

## Hardening Delta (What This Variation Adds)

1. Stable object identity in nested structures (ID-first, pointer-safe)
2. Explicit merge/conflict semantics for parser vs user edits
3. Provenance retention/compaction policy
4. Domain profile packs (trade-specific behavior without schema churn)
5. Multilingual/locale and normalization contracts
6. Pipeline idempotency + retry + DLQ operations
7. Projection consistency and rebuild guarantees
8. Resume dedup/merge strategy for multiple sources per user
9. Security/compliance controls for PII-heavy payloads
10. Preference strictness and typed value contracts (including benefits)
11. Multi-domain "ultimate CV" support with per-item domain extensions
12. Explicit binding map for evidence-based matching/explainability

---

## 1) Canonical JSON Additions for Production Safety

### 1.1 Stable IDs everywhere
Every entity in the tree must have a stable ID:
- section: `section_id`
- item: `item_id`
- field (optional for dynamic fields): `field_id`

Use IDs for write targeting where possible; avoid brittle index-only patching.

### 1.2 Add model metadata
Add explicit metadata fields at root:
- `schema_version`
- `normalization_version`
- `parser_version`
- `last_material_change_at`

### 1.3 Add field-level state envelope
For user-facing fields, support:
- `value`
- `state` (`normal`, `parser_suggested`, `user_locked`, `conflict`)
- `provenance_ref`

This keeps UI state explicit and allows controlled merge logic.

---

## 2) Parser vs User Merge Semantics (Required)

Define deterministic precedence rules:

1. `locked_by_user = true` -> parser cannot overwrite value.
2. Unlocked user-edited fields:
   - parser update only if confidence delta crosses threshold and no recent user edit window.
3. On conflict:
   - keep existing value
   - store parser suggestion in side channel
   - set field state to `conflict` for UI review.

### Conflict object (recommended)
- `field_path_or_id`
- `current_value`
- `suggested_value`
- `parser_confidence`
- `detected_at`
- `resolution` (`keep_current`, `accept_suggested`, `manual_edit`)

---

## 3) Provenance at Scale (Retention and Compaction)

Per-field provenance is useful but can grow quickly.

### Retention policy
- Keep full provenance for latest active version.
- Keep compact provenance summaries for older versions.
- Archive deep history to cheaper storage for audit replay.

### Compaction strategy
- Periodic job consolidates repetitive parser-only updates.
- Preserve user-origin changes and lock transitions in full detail.

---

## 4) Domain Profile Packs (Trade Flexibility Without Schema Drift)

Introduce domain packs, for example:
- HVAC
- Electrical
- Plumbing
- Warehouse/operations

Each pack defines:
- recommended sections/fields
- validation and formatting rules
- normalization dictionaries (titles/skills/certs)
- UI hints (widgets, ordering, suggestions)

Canonical schema stays stable; domain behavior is configuration-driven.

### 4.1 Multi-domain support in one canonical resume
Support one comprehensive candidate profile across mixed backgrounds (for example HVAC + facilities + warehouse ops).

Rules:
- domain extensions are attached per item/section context (not just at root).
- one resume can apply multiple domain packs simultaneously.
- matching can consume only role-relevant slices while UI still renders one coherent document.

Do not force candidates into separate resumes per domain unless explicitly requested by user.

---

## 5) Normalization and Locale Contracts

### 5.1 Always store both raw and normalized
For key fields:
- raw text from source
- normalized ID/value (taxonomy-backed)

### 5.2 Locale and multilingual support
Store:
- `document_language`
- per-field language (optional)
- localized formatting metadata (date/currency units)

Do not force normalization that destroys source meaning.

### 5.3 Taxonomy strategy for trade diversity
Use layered taxonomy:
- global core taxonomy (roles, skills, certifications, locations, work modes)
- trade extensions (HVAC/electrical/plumbing/etc.)
- synonym/alias graph (raw phrase -> canonical id)

Store both:
- raw extracted text
- normalized canonical IDs with confidence and taxonomy version

---

## 6) Embedding and Recompute Pipeline Contracts

### 6.1 Idempotency keys
Use deterministic keys for each embedding job:
- `(resume_id, resume_version, embedding_template_version, embedding_model_version, item_ref_id)`

### 6.2 Retry and DLQ
- transient failures -> bounded retries with backoff
- persistent failures -> DLQ with operator replay tooling

### 6.3 Selective re-embedding
Recompute only changed items where possible, not full resume by default.

### 6.4 Freshness SLO
Define explicit SLO for embedding freshness after edit/upload (for example 95th percentile).

---

## 7) Projection Consistency Model

All projections must be treated as rebuildable derivatives.

Required controls:
- projection version tags
- last-built watermark
- consistency checks against canonical version
- one-click rebuild process for drift recovery

Do not let projections become hidden sources of truth.

---

## 8) Multi-Source Resume Strategy (Dedup and Merge)

Candidates may have:
- uploaded PDF
- LinkedIn import
- manual edits

Required policy:
- define active resume per candidate
- define merge behavior across sources
- preserve source lineage per section/item

Recommended:
- maintain one active canonical per candidate profile plus historical versions
- allow user-controlled “adopt suggestion” rather than silent merge for high-impact fields

---

## 8.5 Preference Model Contract (Strictness + Typed Values)

Preferences must be explicit, typed, and machine-evaluable.

Each preference entry should carry:
- `strictness`: `required | strong | flexible | none`
- `operator`: for example `eq | gte | lte | between | in`
- `target` or `target_min/target_max`
- `unit` where relevant
- provenance/lock metadata for user intent preservation

### Example: benefits preference
```json
{
  "benefit_id": "retirement_401k_match",
  "strictness": "strong",
  "operator": "gte",
  "target": 6,
  "unit": "percent"
}
```

Implication for matching:
- `required` -> hard filter
- `strong` -> heavy ranking penalty if unmet
- `flexible` -> mild ranking penalty

This contract applies to compensation, location/work mode, schedule, benefits, and earliest-start preferences.

---

## 8.6 Binding Map for Explainable Matching

Implement a minimal binding map in canonical/derived view:
- role <-> domain
- skill <-> evidence item IDs
- certification/license <-> role eligibility
- location preference <-> work mode/scope
- compensation preference <-> role/location context
- provenance/confidence <-> lock state

These bindings are MVP-critical and provide most precision + explainability value early.

---

## 9) UI Lock/Override UX Contract

To make lock/override practical:

1. Per-field controls:
   - `Lock value`
   - `Unlock for auto-update`
2. Show provenance inline:
   - source, confidence, last update
3. Suggestion inbox:
   - parser proposals shown as reviewable diffs
4. Safe apply:
   - accept suggestion
   - keep locked value
   - edit manually

This is the key trust mechanism for parser-driven systems.

---

## 10) Security and Compliance Controls (Must-Have)

Because resume data is sensitive:
- encrypt at rest and in transit
- classify and mask PII in logs/events
- strict RBAC and tenant scoping for read access
- retention/deletion/export flows linked to canonical and derived artifacts
- audit trail for lock/unlock and value overwrite decisions

---

## 11) Production Checklist

- [ ] Canonical schema includes stable IDs and explicit schema/version metadata
- [ ] Parser merge engine enforces lock and conflict rules
- [ ] Provenance compaction job and retention policy defined
- [ ] Domain profile packs implemented for target launch verticals
- [ ] Normalization contracts (raw + normalized) implemented for roles/skills/certs/locations
- [ ] Embedding jobs are idempotent and replayable; DLQ in place
- [ ] Projection rebuild process and drift checks implemented
- [ ] Resume dedup/merge policy documented and tested
- [ ] UI lock/override interactions implemented and user-tested
- [ ] PII controls and audit requirements verified
- [ ] Preferences use strictness + typed value semantics (including benefits thresholds)
- [ ] Multi-domain profiles validated in one canonical resume without schema branching
- [ ] Binding map is available for "why matched" explanations

---

## Recommendation

Proceed with the original architecture, but adopt this hardened variation as the implementation baseline for production readiness.

The original model is directionally correct; this variation closes operational and scale risks without changing the fundamental design.
