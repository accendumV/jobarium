# Traceability Matrix (Canonical)

## Owns
- Single audit view across product, architecture, contracts, data, and testing.

## Excludes
- Detailed acceptance criteria prose (see `../01_product/user_stories.md`).

## Coverage Matrix

| Story ID | Slice | Endpoint IDs | State Coverage | Core Table Groups | Test IDs |
|---|---|---|---|---|---|
| `E-01` | `S4` | `EMP-002`, `EMP-003`, `EMP-006` | `job_posting: draft` | `organization`, `job_*` | `TC-E-01-01`, `TC-E-01-02` |
| `E-02` | `S4`,`S6` | `EMP-003`, `EMP-004`, `PKT-002` | `job_posting: draft->active` | `job_requirement`, `candidate_packet` | `TC-E-02-01`, `TC-E-02-02` |
| `E-03` | `S4`,`S5` | `EMP-005`, `INV-001` | `invite: queued|sent|expired|cancelled` | `job_posting`, `invite` | `TC-E-03-01`, `TC-E-03-02` |
| `E-04` | `S6` | `PKT-001`, `PKT-002` | `candidate_packet: ready|reviewed` | `candidate_packet` | `TC-E-04-01`, `TC-E-04-02` |
| `E-05` | `S6` | `PKT-003` | `candidate_packet: reviewed->actioned` | `packet_action` | `TC-E-05-01`, `TC-E-05-02` |
| `E-06` | `S5`,`S6` | `PKT-002` | `qa_session: submitted` | `qa_authenticity_assessment`, `candidate_packet` | `TC-E-06-01`, `TC-E-06-02` |
| `C-01` | `S1`,`S2` | `CAND-003`, `CAND-006`, `CAND-007` | `candidate_profile_bootstrap` | `candidate_profile`, `candidate_document` | `TC-C-01-01`, `TC-C-01-02` |
| `C-02` | `S3` | `CAND-005`, `CAND-002` | `review_required->ready` | `candidate_profile` | `TC-C-02-01`, `TC-C-02-02` |
| `C-03` | `S3`,`S5` | `INV-001` | `invite: sent|opened|started|expired` | `invite` | `TC-C-03-01`, `TC-C-03-02` |
| `C-04` | `S5` | `QA-001`, `QA-002`, `QA-003` | `qa_session: created->in_progress->submitted` | `qa_session`, `qa_answer` | `TC-C-04-01`, `TC-C-04-02` |
| `C-05` | `S5` | `QA-003`, `PKT-002` | `qa_session: in_progress|submitted` | `qa_authenticity_assessment` | `TC-C-05-01`, `TC-C-05-02` |
| `C-06` | `S2` | `CAND-003`, `CAND-008` | `uploading->parsing->review_required|failed` | `candidate_document`, `document_parse_*` | `TC-C-06-01`, `TC-C-06-02` |
| `C-07` | `S1` | `CAND-007`, `CAND-006` | `not_started->manual_builder->review_required` | `candidate_profile` | `TC-C-07-01`, `TC-C-07-02` |
| `C-08` | `S3` | `CAND-001`, `CAND-006` | `manual_builder|review_required` | `candidate_profile` | `TC-C-08-01`, `TC-C-08-02` |
| `C-09` | `S1`,`S3` | `CAND-005`, `CAND-002` | `review_required->ready` | `candidate_profile` | `TC-C-09-01`, `TC-C-09-02` |
| `C-10` | `S2` | `CAND-008`, `CAND-007`, `CAND-006` | `parsing->failed->manual_builder` | `document_parse_job`, `candidate_profile` | `TC-C-10-01`, `TC-C-10-02` |
| `C-11` | `S3` | `CAND-006`, `CAND-002`, `CAND-005` | `manual_builder->review_required->ready` | `candidate_profile`, `match_score` | `TC-C-11-01`, `TC-C-11-02` |
| `C-12` | `S1`,`S3` | `CAND-006`, `CAND-001` | `uploading|manual_builder|review_required` | `candidate_profile` | `TC-C-12-01`, `TC-C-12-02` |
| `A-01` | `S6` | `ADM-001`, `ADM-002` | failure/replay lifecycle | `inbox_event`, `audit_log` | `TC-A-01-01`, `TC-A-01-02` |
| `A-02` | `S6` | `ADM-003`, `ADM-004` | request queued->processed | `audit_log` | `TC-A-02-01`, `TC-A-02-02` |
