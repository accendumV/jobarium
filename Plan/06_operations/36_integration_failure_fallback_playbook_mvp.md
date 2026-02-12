# Jobarium Integration Failure and Fallback Playbook (MVP)

## Purpose
Define integration fallback behavior across external providers and internal dependencies.

This closes item 36 in the system completeness gate.

## Scope
- Email/SMS providers
- Payments provider
- OCR/parser external dependencies
- AI summary/authenticity dependencies

## Global Fallback Principles
1. Protect core user flow first (candidate submit, employer review).
2. Degrade gracefully before disabling features.
3. Queue and replay recoverable operations.
4. Make fallback mode visible to ops.

## Failure Classes
- `transient` (timeouts, short provider errors)
- `degraded` (partial outage, elevated latency)
- `hard_down` (sustained outage)
- `data_error` (invalid payload/config/credentials)

## Per-Integration Fallback Matrix

### Email/SMS
- Primary failure:
  - retry with backoff (3 attempts).
- Secondary fallback:
  - switch channel if consent and contact exist.
- Hard-down mode:
  - queue non-critical notifications.
  - send critical (`invite.created`, `packet.ready`) via available channel.

### Payments
- Primary failure:
  - retry checkout session creation.
- Fallback:
  - show clear "billing temporarily unavailable" and keep non-destructive access.
- Hard-down mode:
  - pause upgrades/downgrades, keep active subscriptions unchanged.

### OCR/Parser Dependency
- Primary failure:
  - switch to deterministic parser-only mode.
- Fallback:
  - require manual field confirmation entry path.
- Hard-down mode:
  - disable auto-parse UI CTA and show manual profile workflow.

### AI Summary/Authenticity Dependency
- Primary failure:
  - retry async jobs.
- Fallback:
  - publish transcript-first packet without summary/auth badge.
- Hard-down mode:
  - mark packet with "analysis delayed" and queue post-processing.

## Operational Triggers
- Enter degraded mode when:
  - integration success rate drops below threshold for 10 min.
- Exit degraded mode when:
  - success rate recovers for sustained 15 min.

## User Messaging Rules
- show concise status messages in-app.
- avoid technical provider names in user-facing copy.
- provide expected update window when possible.

## Replay Rules
- replay queued tasks in capped batches.
- preserve original idempotency keys.
- verify side-effect safety before bulk replay.

## Ownership
- CTO owns integration incident response.
- CEO owns stakeholder communication during sustained outages.

## Validation Checklist
- [ ] simulated provider outage tested in staging
- [ ] degraded mode toggles verified
- [ ] transcript-first fallback validated
- [ ] replay process tested end-to-end
