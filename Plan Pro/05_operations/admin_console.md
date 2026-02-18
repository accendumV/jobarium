# Admin Console Requirements (MVP)

## Owns
- Minimum admin capabilities required to operate MVP safely.

## Excludes
- End-user workflows and UI specs.

## Required Capabilities
- View failed jobs/events with filter/search.
- Retry/replay failed jobs/events with guardrails.
- Inspect entity state and transition history.
- Process GDPR export/delete requests.
- View audit events for sensitive actions.
- Override authenticity label (admin-only, reason required).

## Access Rules
- `platform_admin` only for cross-tenant operational actions.
- Every admin action requires actor identity + timestamp + reason where sensitive.
