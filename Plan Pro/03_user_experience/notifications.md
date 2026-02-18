# Notifications (Templates + Fallbacks)

## Owns
- Event-to-template mapping and delivery fallback behavior.

## Excludes
- Alerting/escalation for internal incidents (see `../05_operations/incident_response.md`).
- Provider configuration internals (see `../02_architecture/operations_config.md`).

## P0 Template Set
- Candidate invite sent.
- Invite expiring soon.
- Q&A submission confirmation.
- Packet ready for employer.
- Packet action notification.
- System delay notice.

## Delivery Policy
- Primary channel by user preference.
- Secondary fallback when primary fails.
- Outage mode sends delay-safe communication where applicable.

## Compliance Rules
- Respect consent and channel opt-in/opt-out.
- Use approved variable whitelist only.
- Never include sensitive internals in user-facing copy.
