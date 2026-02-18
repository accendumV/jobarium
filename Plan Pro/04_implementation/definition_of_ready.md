# Definition of Ready (DoR)

## Owns
- Gate checklist that every implementation ticket must satisfy before development starts.

## Excludes
- Story acceptance criteria content (see `../01_product/user_stories.md`).
- Release go/no-go (see `../01_product/launch_criteria.md`).

## DoR Checklist (Required)
- [ ] Story ID exists in `../01_product/user_stories.md`.
- [ ] Story has primary persona + JTBD mapping.
- [ ] Slice ID assigned (`S1..S6`) from `vertical_slices.md`.
- [ ] Endpoint IDs identified (from `api_contracts.md` / `openapi.yaml`).
- [ ] DB impact identified (tables/migrations from `sql_migrations/`).
- [ ] State machine impact identified (if applicable).
- [ ] Test IDs assigned in `test_case_matrix.md`.
- [ ] Error/edge behavior defined.
- [ ] Rollback note included (API/DB/data safety).
- [ ] Owner assigned (single accountable role).

## DoR Fail Rule
- If any required item is missing, ticket is not implementation-ready and cannot be pulled into active sprint.

## Ticket Header Template
- Story ID:
- Persona/JTBD:
- Slice:
- Endpoint IDs:
- DB tables/migrations:
- State transitions:
- Test IDs:
- Rollback note:
- Owner:
