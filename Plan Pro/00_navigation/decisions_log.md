# Decisions Log (Plan Pro)

## Owns
- Canonical record of implementation/launch decisions and approved exceptions.

## Excludes
- Feature specification details (see owner docs by domain).

## Status Values
- `proposed`
- `approved`
- `rejected`
- `superseded`

## Entries

### DEC-PP-0001: Plan Pro is canonical source
- Date: 2026-02-17
- Status: approved
- Decision: `Plan Pro/` is the authoritative planning source for implementation and launch.
- Why: eliminate drift between legacy `Plan/` and implementation documents.
- Supersedes: all operational planning references that treat `Plan/` as active source.

### DEC-PP-0002: Vertical slices are required execution units
- Date: 2026-02-17
- Status: approved
- Decision: work is executed by `S1..S6` slices with DoD gating.
- Why: prevents horizontal build drift and improves demoability.
- References: `04_implementation/vertical_slices.md`, `04_implementation/sprint_plan.md`.

### DEC-PP-0003: Go-with-exceptions launch decisions must be logged here
- Date: 2026-02-17
- Status: approved
- Decision: any `go_with_exceptions` launch outcome must create an entry with owner, due date, and risk note in this file.
- Why: enforce explicit risk ownership and prevent hidden launch debt.
- References: `01_product/launch_criteria.md`.

## Template for New Entry
### DEC-PP-XXXX: <title>
- Date: YYYY-MM-DD
- Status: proposed|approved|rejected|superseded
- Decision: <what was decided>
- Why: <reasoning>
- Impact: <what changes>
- Owner: <name/role>
- Due date: YYYY-MM-DD (required for exceptions)
- Risk note: <required for launch exceptions>
- References: <paths>
