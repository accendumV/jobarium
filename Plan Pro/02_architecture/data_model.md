# Data Model (Canonical + Hardened)

## Owns
- Canonical entities, source precedence, parser/re-embedding contracts.

## Excludes
- API route models (see `../04_implementation/api_contracts.md`).
- UX rendering behavior (see `../03_user_experience/ui_specification.md`).

## Source-of-Truth Model
- Canonical profile JSON is authoritative for candidate profile state.
- Derived views are generated for ranking/embedding/search; never edited directly.
- Every entity has stable IDs and version metadata for safe recomputation.

## Core Entity Families
- Identity/access.
- Organization/employer.
- Candidate profile and documents.
- Job/requirements/question kit.
- Matching/shortlist.
- Invite and delivery.
- Q&A and authenticity.
- Candidate packet and packet actions.
- Billing usage and audit log.

## Precedence and Merge Rules
- User-confirmed field beats parser-inferred value.
- Latest user edit wins inside same source priority.
- Parser updates create conflict objects when locked fields differ.
- Reprocessing never silently overwrites locked/user-confirmed values.

## Parser + Enrichment Contracts
- Parse stores raw + normalized outputs.
- Field confidence bands drive auto-accept vs manual confirmation.
- Reprocessing is idempotent on `(document_id, parser_version)`.
- Enrichment recompute is idempotent on `(entity_id, enrichment_version)`.

## Embedding Contracts
- Global resume embedding per profile version.
- Item-level embeddings for granular retrieval.
- Re-embed only changed sections when possible.

## Migration Policy
- Backward-compatible additive DB changes first.
- Breaking schema changes require dual-read/write window and rollback path.
