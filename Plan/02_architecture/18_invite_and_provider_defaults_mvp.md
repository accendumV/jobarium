# Jobarium Invite Defaults and Provider Strategy (MVP)

## Purpose
Lock two decision areas for MVP:
1. default invite anti-spam policy values,
2. integration provider strategy (direct SDK vs abstraction depth).

## A) Invite Anti-Spam Policy Defaults (MVP)

### Default Values (per active job)
- shortlist trigger mode: `top_n`
- default `top_n`: `25`
- invite expiry: `72h`
- candidate re-invite cooldown: `7 days`
- daily invite cap per job: `20`
- weekly invite cap per job: `80`
- max active outstanding invites per job: `40`

### Guardrails
- prevent new invite if candidate has:
  - active invite for same job
  - submitted Q&A for same job in last 30 days (unless manual override)
- enforce quiet hours for outbound SMS (timezone-aware).

### Override Policy
- Employer can tune values within safe ranges:
  - `top_n`: 10-50
  - expiry: 24h-7d
  - cooldown: 3-30 days
  - daily cap: 5-50
- Out-of-range values require admin approval in MVP.

### Why these defaults
- Avoid invite spam.
- Preserve enough throughput for early hiring outcomes.
- Keep behavior predictable for small teams.

## B) Provider Strategy (MVP)

### Decision
- Use **direct provider SDKs with a thin internal adapter interface**.

### Initial Providers
- Email: `SendGrid`
- SMS: `Twilio`
- Payments: `Stripe`

### Adapter Interface Requirement
- Standard internal methods only:
  - `sendEmail()`
  - `sendSms()`
  - `createCheckoutSession()`
  - `getDeliveryStatus()`
- Provider-specific payload mapping stays behind adapter.

### Why this approach
- Faster MVP implementation than full abstraction platform.
- Keeps an upgrade path to switch providers later.
- Avoids vendor lock in high-level business flows.

### Fallback Rules
- If SMS provider degraded:
  - fallback to email where candidate consent exists.
- If email provider degraded:
  - queue retries and escalate; use SMS for critical invites if allowed.
- Provider outage > 30 min:
  - trigger incident runbook path.

## C) Ownership and Review
- Owners: CEO/CTO
- Review cadence: every 2 weeks during pilot
- Revisit triggers:
  - invite completion rate degradation
  - complaint/spam signal increase
  - provider incident frequency above threshold
