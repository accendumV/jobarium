# Resume Data Model and Embedding Views (MVP, Merged Hardened)

## Purpose
Define a scalable, flexible data model for storing resumes that supports:
- **Semantic matching** (embeddings for similarity search against job descriptions)
- **Structured UI rendering** (editable sections/items with predictable shapes)
- **Future querying/analytics** (filtering, reporting, and downstream ML features)

This document proposes a **single canonical resume model** plus **derived representations** (embedding texts/vectors and optional relational projections).

---

## Requirements and Constraints
- Resumes vary heavily by profession and formatting; structure can be messy or flat.
- The system must support **AI parsing + AI restructuring** (not just OCR).
- UI needs a **semi-structured** model: sections, items, fields, ordering, and user edits.
- Storage must scale to **millions of users**.
- Write pattern: moderate writes (uploads + edits), heavy reads (UI + matching), plus periodic re-embedding.
- Model must support **versioning** and **reprocessing** (parser upgrades, better extraction, user edits).

---

## Recommended Architecture (Two-Layer Representation)
### Canonical Resume (source of truth)
Store one canonical, versioned JSON document per resume. It is:
- **UI-first** (sections/items that render well)
- **Semantics-friendly** (normalized fields, skill tags, dates, AI annotations)
- **Extensible** (custom sections and unknown fields)

### Derived Views (computed from canonical)
- **Embedding view(s)**: deterministic text generated from canonical JSON.
- **Vector store**: embeddings persisted for similarity search.
- **Optional projections**: relational or search indexes for common filters/analytics.

Key idea: **canonical JSON is authoritative**; embeddings and projections are **derived** and can be regenerated.

---

## Canonical Resume JSON Shape (UI + Semantics)
### Design principles
- **Section-based**: the UI can render any resume by iterating ordered sections.
- **Typed but extensible**: `type` is known for common sections, but custom sections are allowed.
- **Items contain both known fields and `extra_fields`** for unpredictable content.
- **AI annotations** are stored alongside the content with provenance/confidence.

### Example canonical JSON (trimmed)
```json
{
  "resume_id": "res_123",
  "user_id": "user_456",
  "version": 1,
  "headline": "Senior Data Engineer",
  "primary_location": "San Francisco, CA",
  "contact": {
    "name": "Jane Doe",
    "email": "jane.doe@email.com",
    "phone": "+1-555-123-4567",
    "links": {
      "linkedin": "https://www.linkedin.com/in/janedoe"
    },
    "_provenance": {
      "fields": {
        "/name": {
          "source": "parser",
          "parse_run_id": "parse_789",
          "confidence": 0.94,
          "updated_at": "2026-02-16T10:00:00Z",
          "locked_by_user": false
        },
        "/email": {
          "source": "user",
          "updated_at": "2026-02-16T10:05:00Z",
          "locked_by_user": true,
          "note": "User corrected email after parse."
        },
        "/phone": {
          "source": "parser",
          "parse_run_id": "parse_789",
          "confidence": 0.83,
          "updated_at": "2026-02-16T10:00:00Z",
          "locked_by_user": false
        },
        "/links/linkedin": {
          "source": "parser",
          "parse_run_id": "parse_789",
          "confidence": 0.9,
          "updated_at": "2026-02-16T10:00:00Z",
          "locked_by_user": false
        }
      }
    }
  },
  "summary": "Senior Data Engineer with 7+ years of experience...",
  "sections": [
    {
      "id": "sec_experience",
      "type": "experience",
      "title": "Experience",
      "order": 2,
      "items": [
        {
          "id": "exp_acme",
          "title": "Senior Data Engineer",
          "company": "Acme Corp",
          "location": "San Francisco, CA",
          "start_date": "2020-01-01",
          "end_date": null,
          "highlights": [
            "Migrated batch ETL to streaming (Kafka + Spark)...",
            "Implemented feature store serving 50+ ML models..."
          ],
          "skills": ["Kafka", "Spark", "Feature Store"],
          "extra_fields": {},
          "ai_annotations": {
            "normalized_title": "Senior Data Engineer",
            "seniority": "senior",
            "confidence": 0.92
          },
          "_provenance": {
            "fields": {
              "/title": {
                "source": "parser",
                "parse_run_id": "parse_789",
                "confidence": 0.93,
                "updated_at": "2026-02-16T10:00:00Z",
                "locked_by_user": false
              },
              "/company": {
                "source": "parser",
                "parse_run_id": "parse_789",
                "confidence": 0.95,
                "updated_at": "2026-02-16T10:00:00Z",
                "locked_by_user": false
              },
              "/start_date": {
                "source": "parser",
                "parse_run_id": "parse_789",
                "confidence": 0.78,
                "updated_at": "2026-02-16T10:00:00Z",
                "locked_by_user": false
              },
              "/highlights/0": {
                "source": "parser",
                "parse_run_id": "parse_789",
                "confidence": 0.72,
                "updated_at": "2026-02-16T10:00:00Z",
                "locked_by_user": false
              },
              "/highlights/1": {
                "source": "parser",
                "parse_run_id": "parse_789",
                "confidence": 0.7,
                "updated_at": "2026-02-16T10:00:00Z",
                "locked_by_user": false
              }
            }
          }
        }
      ]
    },
    {
      "id": "sec_custom_1",
      "type": "custom",
      "title": "Interests",
      "order": 6,
      "items": [
        {
          "id": "custom_item_1",
          "label": "Interests",
          "value": "Open-source data tools, mentoring, rock climbing",
          "extra_fields": {
            "visibility": "public"
          }
        }
      ]
    }
  ],
  "skills_flat": ["Python", "SQL", "Spark", "Kafka", "Airflow"],
  "skills_flat_provenance": {
    "Python": { "source": "parser", "parse_run_id": "parse_789", "confidence": 0.98 },
    "Kafka": { "source": "parser", "parse_run_id": "parse_789", "confidence": 0.9 },
    "Airflow": { "source": "parser", "parse_run_id": "parse_789", "confidence": 0.88 }
  },
  "_provenance": {
    "document": {
      "source_type": "pdf_upload",
      "parse_run_id": "parse_789",
      "parser_version": "resume-parser@1.3.0",
      "parsed_at": "2026-02-16T10:00:00Z"
    },
    "fields": {
      "/headline": {
        "source": "parser",
        "parse_run_id": "parse_789",
        "confidence": 0.89,
        "updated_at": "2026-02-16T10:00:00Z",
        "locked_by_user": false
      },
      "/summary": {
        "source": "parser",
        "parse_run_id": "parse_789",
        "confidence": 0.8,
        "updated_at": "2026-02-16T10:00:00Z",
        "locked_by_user": false
      }
    }
  },
  "meta": {
    "source_type": "pdf_upload",
    "source_file_url": "s3://bucket/raw-resumes/jane_doe.pdf",
    "language": "en",
    "parse_confidence": 0.9,
    "created_at": "2026-02-16T10:00:00Z",
    "updated_at": "2026-02-16T10:00:00Z"
  }
}
```

### Notes on flexibility
- **Custom sections**: `type="custom"` with `title` and generic item shapes.
- **Unknown/extra fields**: use `extra_fields` (map) rather than schema-breaking.
- **Ordering**: `order` allows rendering and user-controlled rearrangement.
- **Locking/provenance** (recommended): per-field metadata to prevent parser from overwriting user-confirmed edits.

### Canonical extension references (JSON artifacts)
The following files are official extension examples of this canonical model and should be treated as companion artifacts:
- `Plan/CV.json`: baseline canonical sample.
- `Plan/CV_ext.json`: canonical + extended structures for richer normalized fields.
- `Plan/CV_ext_multi.json`: canonical + multi-domain extensions and preference/binding examples.

Rules for all three:
- They must conform to the same canonical root contract defined in this document.
- Any additional fields are extensions, not replacements for canonical keys.
- Parser/user merge, provenance, strictness, and idempotency rules from this document still apply.

---

## UI Rendering From Canonical Resume JSON (MVP)
Goal: render a resume-like document, allow edits/additions, and preserve all parsed information.

### Inputs (UI “catalogs”)
- **`sectionCatalog`**: allowed section types + default titles + layout rules (e.g., experience uses role/company/date line + bullets).
- **`fieldCatalog`**: field definitions per section type (label, data type, editor widget, validation, suggestion hooks).
- **`layoutTemplates`**: resume-like layouts (classic/compact), print-friendly CSS.

### Rendering algorithm (document + editors)
1) **Build a Render VM from canonical JSON**
   - Normalize: ensure IDs, `order`, arrays, and `extra_fields` exist; coerce dates where safe.
   - Resolve templates: pick a section template by `section.type` (fallback to generic for `custom`).
   - Materialize fields: convert known fields to typed `FieldVM`s; convert `extra_fields` into generic `FieldVM`s (type guessed).
   - Coverage check: any value not mapped to a known field must still appear as a generic field (e.g., under “Additional info”) so nothing is dropped.

2) **Render as a resume**
   - Render **header** (name/contact/headline/summary) with resume typography.
   - Render sections by `order` using a **section renderer registry** keyed by `section.type`.
   - Apply consistent formatting (date ranges, right-aligned dates, bullets, skill chips) and keep it print-friendly.

3) **Edit binding**
   - Each rendered field carries a **JSON pointer/path** (e.g., `/contact/email`, `/sections/sec_experience/items/exp_acme/highlights/0`).
   - Edits emit **patch ops** (`replace/add/remove/move`) applied to canonical JSON; bump `version`; update provenance (`source=user`, `locked_by_user=true` when applicable).

### Adding data (guided)
- **Add field/value (inside a section/item)**:
  - Picker from `fieldCatalog` (section-scoped) + “Custom field”.
  - Inline hints: examples, validation (dates), autocomplete (skills/titles/companies from vocab + user history).
  - Optional async AI suggestions (debounced) with explicit “Apply”.

- **Add section**:
  - User selects from `sectionCatalog` (pre-defined list).
  - Insert section with default title/order and an initial empty item; focus first primary field and show section guidance.

## Embedding Views (What to Feed the Model)
### Why not embed the raw PDF or raw parsed text?
You want embeddings to be:
- **Consistent**: same concepts appear in similar “slots”
- **Deterministic**: same resume version produces the same text (and reproducible embeddings)
- **Composable**: embed global + parts for better retrieval

### Derived embedding text formats
Generate embedding texts from canonical JSON using a fixed template.

#### A) Global embedding text (one per resume version)
```text
Headline: Senior Data Engineer
Location: San Francisco, CA

Summary:
Senior Data Engineer with 7+ years of experience...

Skills:
Python, SQL, Scala, Spark, Kafka, Airflow, dbt, Snowflake, AWS S3, ...

Experience:
- Senior Data Engineer, Acme Corp (2020-01 – Present)
  Highlights: Migrated batch ETL to streaming (Kafka + Spark)...; Implemented feature store...
- Data Engineer, Beta Analytics (2017-07 – 2019-12)
  Highlights: Built ELT pipelines with Airflow + dbt...; Optimized Snowflake costs...

Education:
- M.S. Computer Science, XYZ University (2017)
```

#### B) Item-level embeddings (recommended)
Store embeddings for:
- each **experience item**
- each **project**
- optionally a **skills-only** view

This improves matching granularity (e.g., matching a job’s “streaming” requirement to the relevant experience item).

---

## Storage Recommendations
### Primary storage (source of truth): PostgreSQL + `jsonb`
Use PostgreSQL for transactional integrity, joins, and long-term maintainability; store canonical resume JSON in a `jsonb` column.

Recommended `resumes` table fields:
- `id` (resume id)
- `user_id`
- `version` (or separate `resume_versions` table)
- `canonical_json` (`jsonb`)
- scalar “index columns” for common filters (derived from JSON):
  - `primary_title`, `primary_location`, `total_years_experience`, `updated_at`

Indexing:
- btree on `(user_id)`
- optionally GIN on `canonical_json` for targeted queries (skills, section types)
- btree on frequently filtered scalar columns

### Raw document storage: object store
Store uploaded original file in S3/GCS (or equivalent), referenced from `meta.source_file_url`.

### Embeddings storage: Postgres `pgvector` or external vector DB
Option A (simplest MVP): **Postgres + pgvector**
- keeps OLTP + vectors in one system
- good operational simplicity early

Option B (scale-out): **dedicated vector DB** (Qdrant/Pinecone/Weaviate)
- better horizontal scaling and specialized features
- still keep canonical JSON in Postgres

### Search/analytics (optional, later)
If you need advanced keyword search/facets beyond Postgres:
- Elasticsearch/OpenSearch as a **derived index**

---

## Example: “One-page resume” → Stored Artifacts
For a single upload, you typically store:

1) **Raw resume file**
- Storage: S3/GCS
- Key: `raw-resumes/user_456/res_123/v1.pdf`

2) **Canonical resume JSON (versioned)**
- Storage: Postgres `resumes.canonical_json` (or `resume_versions.canonical_json`)
- Purpose: UI rendering, edits, structured analysis, source for embeddings

3) **Embedding texts (optional to persist)**
- Often you do **not** store these long strings permanently (they’re deterministic)
- If you do store them, store compactly per `(resume_id, version, item_ref_id)`

4) **Embeddings (vectors)**
- Storage: `resume_embeddings` table (pgvector) or vector DB
- Include metadata:
  - `resume_id`, `resume_version`
  - `item_type` (`global|experience|project|skills`)
  - `item_ref_id` (e.g., `exp_acme`)
  - `embedding_model`, `embedding_version`

---

## Updates, Versioning, and Re-Embedding
### Versioning strategy
Treat canonical resume changes as new versions:
- Upload or user edit → **increment resume version**
- Keep old versions for audit/debug (configurable retention)

### Re-embedding strategy
Embeddings are derived; regenerate when:
- resume version changes
- embedding template changes
- embedding model changes
- parser/normalizer improves and canonical JSON changes materially

Suggested approach:
- Maintain `embedding_version` separate from `resume.version`
- Mark old embeddings as stale or keep them for reproducibility

---

## Why Canonical JSON + Derived Embeddings (not one structure for everything)
- UI needs: **editable, structured, ordered, typed** content with optional custom fields.
- Embeddings need: **deterministic text views** optimized for semantic similarity.
- Combining them into one “opaque blob” hurts UI and analytics.
- Keeping embeddings as derived data keeps the system robust: you can **recompute** without data loss.

---

## MVP Checklist (Implementation Notes)
- Canonical JSON schema (documented + validated)
- Per-field provenance rules (user-confirmed overrides parser)
- Deterministic embedding templates (global + item-level)
- Vector storage (pgvector first is fine)
- Basic indexes (by user, updated_at, and a few scalar projections)

---

## Production Hardening Additions (Merged from Hardened Variant)

### 1) Canonical JSON Additions for Production Safety

#### 1.1 Stable IDs everywhere
Every entity in the tree must have a stable ID:
- section: `section_id`
- item: `item_id`
- field (optional for dynamic fields): `field_id`

Use IDs for write targeting where possible; avoid brittle index-only patching.

#### 1.2 Add model metadata
Add explicit metadata fields at root:
- `schema_version`
- `normalization_version`
- `parser_version`
- `last_material_change_at`

#### 1.3 Add field-level state envelope
For user-facing fields, support:
- `value`
- `state` (`normal`, `parser_suggested`, `user_locked`, `conflict`)
- `provenance_ref`

This keeps UI state explicit and allows controlled merge logic.

### 2) Parser vs User Merge Semantics (Required)
Define deterministic precedence rules:
1. `locked_by_user = true` -> parser cannot overwrite value.
2. Unlocked user-edited fields:
   - parser update only if confidence delta crosses threshold and no recent user edit window.
3. On conflict:
   - keep existing value
   - store parser suggestion in side channel
   - set field state to `conflict` for UI review.

Recommended conflict object fields:
- `field_path_or_id`
- `current_value`
- `suggested_value`
- `parser_confidence`
- `detected_at`
- `resolution` (`keep_current`, `accept_suggested`, `manual_edit`)

### 3) Provenance at Scale (Retention and Compaction)
Per-field provenance is useful but can grow quickly.

Retention policy:
- keep full provenance for latest active version
- keep compact provenance summaries for older versions
- archive deep history to cheaper storage for audit replay

Compaction strategy:
- periodic job consolidates repetitive parser-only updates
- preserve user-origin changes and lock transitions in full detail

### 4) Domain Profile Packs (Trade Flexibility Without Schema Drift)
Use domain packs (for example HVAC, Electrical, Plumbing, Warehouse/Ops).

Each pack defines:
- recommended sections/fields
- validation and formatting rules
- normalization dictionaries (titles/skills/certs)
- UI hints (widgets, ordering, suggestions)

Canonical schema stays stable; domain behavior is configuration-driven.

#### 4.1 Multi-domain support in one canonical resume
Support one comprehensive candidate profile across mixed backgrounds.

Rules:
- domain extensions are attached per item/section context (not only at root)
- one resume can apply multiple domain packs simultaneously
- matching can consume only role-relevant slices while UI renders one coherent document
- do not force separate resumes per domain unless explicitly requested

### 5) Normalization and Locale Contracts

#### 5.1 Always store both raw and normalized
For key fields:
- raw text from source
- normalized ID/value (taxonomy-backed)

#### 5.2 Locale and multilingual support
Store:
- `document_language`
- per-field language (optional)
- localized formatting metadata (date/currency units)

Do not force normalization that destroys source meaning.

#### 5.3 Taxonomy strategy for trade diversity
Use layered taxonomy:
- global core taxonomy (roles, skills, certifications, locations, work modes)
- trade extensions
- synonym/alias graph (raw phrase -> canonical id)

Store both raw extracted text and normalized canonical IDs with confidence and taxonomy version.

### 6) Embedding and Recompute Pipeline Contracts
Idempotency key for embedding jobs:
- `(resume_id, resume_version, embedding_template_version, embedding_model_version, item_ref_id)`

Retry and DLQ:
- transient failures -> bounded retries with backoff
- persistent failures -> DLQ with operator replay tooling

Selective re-embedding:
- recompute only changed items where possible, not full resume by default

Freshness:
- define explicit SLO for embedding freshness after edit/upload.

### 7) Projection Consistency Model
All projections are rebuildable derivatives.

Required controls:
- projection version tags
- last-built watermark
- consistency checks against canonical version
- one-click rebuild process for drift recovery

Do not let projections become hidden sources of truth.

### 8) Multi-Source Resume Strategy (Dedup and Merge)
Candidates may have PDF upload, LinkedIn import, and manual edits.

Required policy:
- define active resume per candidate
- define merge behavior across sources
- preserve source lineage per section/item

Recommended:
- one active canonical per candidate profile plus historical versions
- user-controlled "adopt suggestion" rather than silent merge for high-impact fields

#### 8.5 Preference Model Contract (Strictness + Typed Values)
Each preference entry should carry:
- `strictness`: `required | strong | flexible | none`
- `operator`: `eq | gte | lte | between | in`
- `target` or `target_min/target_max`
- `unit` where relevant
- provenance/lock metadata

Matching implication:
- `required` -> hard filter
- `strong` -> heavy ranking penalty if unmet
- `flexible` -> mild ranking penalty

This applies to compensation, location/work mode, schedule, benefits, and earliest-start preferences.

#### 8.6 Binding Map for Explainable Matching
Implement binding map in canonical/derived views:
- role <-> domain
- skill <-> evidence item IDs
- certification/license <-> role eligibility
- location preference <-> work mode/scope
- compensation preference <-> role/location context
- provenance/confidence <-> lock state

These bindings are MVP-critical for precision and explainability.

### 9) UI Lock/Override UX Contract
Per-field controls:
- `Lock value`
- `Unlock for auto-update`

UI behavior:
- show provenance inline (source, confidence, last update)
- parser suggestions appear as reviewable diffs
- allow accept suggestion / keep locked value / manual edit

This is the trust mechanism for parser-driven systems.

### 10) Security and Compliance Controls (Must-Have)
Resume data is sensitive:
- encrypt at rest and in transit
- classify and mask PII in logs/events
- strict RBAC and tenant scoping for reads
- retention/deletion/export flows linked to canonical and derived artifacts
- audit trail for lock/unlock and overwrite decisions

### 11) Expanded Production Checklist
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

