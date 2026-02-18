# Test Case Matrix (Stories -> Executable Tests)

## Owns
- Canonical mapping from story IDs to executable test case IDs.
- Test type, priority, and pass criteria per mapped case.

## Excludes
- Detailed test implementation code.
- Incident validation procedures (see `../05_operations/*`).

## Conventions
- Test ID format: `TC-<story-id>-<nn>` (example: `TC-C-07-01`)
- Test types: `unit`, `integration`, `contract`, `e2e`
- Priority: `P0`, `P1`
- Status: `planned` (this file), then update to `implemented` during build
- Owner: responsible role for implementation/maintenance.
- Target Slice: primary slice where test becomes mandatory.
- Evidence Link: PR run URL, test report, or artifact path proving pass/fail.

## Story-to-Test Mapping

| Story ID | Test ID | Type | Priority | Endpoint/State Focus | Pass Criteria | Owner | Target Slice | Evidence Link | Status |
|---|---|---|---|---|---|---|---|---|---|
| `E-01` | `TC-E-01-01` | integration | P0 | `EMP-002`, `EMP-006` | Template prefill + editable draft persists with version increment | Backend | `S4` | `TBD` | planned |
| `E-01` | `TC-E-01-02` | contract | P0 | `EMP-004` | Activation blocked when required job fields missing | Backend | `S4` | `TBD` | planned |
| `E-02` | `TC-E-02-01` | integration | P0 | `EMP-003`, `EMP-004` | Dealbreakers persist and version correctly | Backend | `S4` | `TBD` | planned |
| `E-02` | `TC-E-02-02` | e2e | P0 | `PKT-002` | Packet displays dealbreaker outcomes | QA | `S6` | `TBD` | planned |
| `E-03` | `TC-E-03-01` | integration | P0 | `EMP-005` | Invalid guardrail values rejected with `VALIDATION_FAILED` | Backend | `S4` | `TBD` | planned |
| `E-03` | `TC-E-03-02` | e2e | P0 | invite lifecycle | Cap/cooldown/expiry enforcement observed in invite flow | QA | `S5` | `TBD` | planned |
| `E-04` | `TC-E-04-01` | e2e | P0 | `PKT-001` | Inbox default contains completed packets only | QA | `S6` | `TBD` | planned |
| `E-04` | `TC-E-04-02` | integration | P0 | `PKT-002` | Packet returns summary/snippets/transcript | Backend | `S6` | `TBD` | planned |
| `E-05` | `TC-E-05-01` | contract | P0 | `PKT-003` | Valid action stored with actor/timestamp | Backend | `S6` | `TBD` | planned |
| `E-05` | `TC-E-05-02` | integration | P0 | packet state | `reviewed -> actioned` transition enforced | Backend | `S6` | `TBD` | planned |
| `E-06` | `TC-E-06-01` | e2e | P0 | `PKT-002` | Trust label + reason codes + confidence visible | QA | `S6` | `TBD` | planned |
| `E-06` | `TC-E-06-02` | contract | P0 | authenticity policy | No auto-reject path exists based only on score | Backend | `S5` | `TBD` | planned |
| `C-01` | `TC-C-01-01` | e2e | P0 | bootstrap flow | Candidate reaches review stage from upload or builder | QA | `S2` | `TBD` | planned |
| `C-01` | `TC-C-01-02` | integration | P0 | `CAND-006`, `CAND-007` | Draft restore works after re-login | Backend | `S1` | `TBD` | planned |
| `C-02` | `TC-C-02-01` | contract | P0 | `CAND-005` | Required/missing fields payload stable and complete | Backend | `S3` | `TBD` | planned |
| `C-02` | `TC-C-02-02` | integration | P0 | bootstrap state | `review_required -> ready` only when required fields complete | Backend | `S3` | `TBD` | planned |
| `C-03` | `TC-C-03-01` | e2e | P0 | `INV-001` | Invite context fields (role/company/pay/location/time) visible | QA | `S3` | `TBD` | planned |
| `C-03` | `TC-C-03-02` | integration | P0 | invite state | Expired invite blocks start path | Backend | `S5` | `TBD` | planned |
| `C-04` | `TC-C-04-01` | integration | P0 | `QA-002` | Autosave persists with server revision | Backend | `S5` | `TBD` | planned |
| `C-04` | `TC-C-04-02` | e2e | P0 | `QA-003` | Submit succeeds only when required answers valid | QA | `S5` | `TBD` | planned |
| `C-05` | `TC-C-05-01` | e2e | P0 | submit path | Policy notice shown before submission | QA | `S5` | `TBD` | planned |
| `C-05` | `TC-C-05-02` | integration | P1 | assessment handling | Low-confidence authenticity defaults to neutral handling | Backend | `S5` | `TBD` | planned |
| `C-06` | `TC-C-06-01` | contract | P0 | `CAND-003` | `.pdf|.doc|.docx` accepted, unsupported formats rejected | Backend | `S2` | `TBD` | planned |
| `C-06` | `TC-C-06-02` | integration | P0 | parse flow | Parse status transitions visible and consistent | Backend | `S2` | `TBD` | planned |
| `C-07` | `TC-C-07-01` | e2e | P0 | `CAND-007`, `CAND-006` | Starter sections generated and draft autosave works | QA | `S1` | `TBD` | planned |
| `C-07` | `TC-C-07-02` | integration | P0 | draft restore | Reload restores same builder state | Backend | `S1` | `TBD` | planned |
| `C-08` | `TC-C-08-01` | integration | P1 | builder helper | Examples render for high-impact fields | Frontend | `S3` | `TBD` | planned |
| `C-08` | `TC-C-08-02` | e2e | P1 | submit path | Ignoring examples does not block completion | QA | `S3` | `TBD` | planned |
| `C-09` | `TC-C-09-01` | contract | P0 | `CAND-005` | Missing required fields are link-navigable in payload | Backend | `S3` | `TBD` | planned |
| `C-09` | `TC-C-09-02` | integration | P0 | status transitions | Removing required field reverts ready state | Backend | `S3` | `TBD` | planned |
| `C-10` | `TC-C-10-01` | e2e | P0 | parse failure path | One-click fallback opens manual builder | QA | `S2` | `TBD` | planned |
| `C-10` | `TC-C-10-02` | integration | P0 | `CAND-008` | Retry queued and file linkage preserved | Backend | `S2` | `TBD` | planned |
| `C-11` | `TC-C-11-01` | integration | P1 | `CAND-006`, `CAND-005` | Project/course/certificate blocks contribute to readiness/matching | Backend | `S3` | `TBD` | planned |
| `C-11` | `TC-C-11-02` | contract | P1 | validator rules | Empty work history allowed under defined required-field contract | Backend | `S3` | `TBD` | planned |
| `C-12` | `TC-C-12-01` | e2e | P1 | mobile resume | Cross-session draft restore works on mobile | QA | `S3` | `TBD` | planned |
| `C-12` | `TC-C-12-02` | integration | P1 | autosave conflict | Concurrent edit conflict yields non-blocking merge notice | Backend | `S3` | `TBD` | planned |
| `A-01` | `TC-A-01-01` | e2e | P1 | `ADM-001`, `ADM-002` | Failed jobs visible and replay action audited | QA | `S6` | `TBD` | planned |
| `A-01` | `TC-A-01-02` | contract | P1 | replay API | Replay endpoint enforces reason + auth constraints | Backend | `S6` | `TBD` | planned |
| `A-02` | `TC-A-02-01` | integration | P1 | `ADM-003`, `ADM-004` | GDPR export/delete requests accepted and tracked asynchronously | Backend | `S6` | `TBD` | planned |
| `A-02` | `TC-A-02-02` | contract | P1 | auth policy | Cross-user GDPR actions forbidden for non-admin actors | Backend | `S6` | `TBD` | planned |

## Release Gate Coverage
- P0 release requires all `Priority=P0` tests to pass.
- Contract release gate requires all `Type=contract` tests to pass.
- Staging promotion requires no blocker failures in `e2e` P0 cases.
