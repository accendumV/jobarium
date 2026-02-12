# Jobarium Notification Templates and Fallbacks (MVP)

## Purpose
Define message templates, channel strategy, and fallback behavior for critical notifications.

This closes item 30 in the system completeness gate.

## Channel Strategy
- Primary channels:
  - Email (default)
  - SMS (opt-in for candidate, optional for employer)
- Channel priority:
  1. Preferred user channel if configured and healthy
  2. Secondary channel if primary fails
  3. In-app notification fallback where available

## Template Rules
- Keep subject/body concise and action-oriented.
- Include role/job context and clear CTA.
- Include unsubscribe/preferences link where required.
- Never include sensitive personal data in message body.

## Event-to-Template Map (P0)

### N-01 Candidate Invite Sent
- Trigger:
  - `invite.created`
- Audience:
  - candidate
- Email subject:
  - "You have a new interview invitation on Jobarium"
- Body essentials:
  - role title
  - employer name
  - pay/location summary
  - invite expiry
  - `Start` CTA
- SMS fallback:
  - "New Jobarium invite: [Role] at [Employer]. Expires [time]. Open app/link."

### N-02 Invite Expiring Soon
- Trigger:
  - invite expiry - 24h reminder
- Audience:
  - candidate
- Email subject:
  - "Reminder: your Jobarium invite expires soon"
- Body essentials:
  - remaining time
  - direct start link

### N-03 Q&A Submission Confirmation
- Trigger:
  - `qa.submitted`
- Audience:
  - candidate
- Email subject:
  - "Your responses were submitted"
- Body essentials:
  - confirmation timestamp
  - expected review window

### N-04 Packet Ready for Employer
- Trigger:
  - `packet.ready`
- Audience:
  - employer reviewers
- Email subject:
  - "New candidate packet is ready to review"
- Body essentials:
  - role title
  - candidate initials/identifier (privacy-safe)
  - `Review packet` CTA

### N-05 Packet Action Notification
- Trigger:
  - packet action `interview|clarify|reject`
- Audience:
  - candidate
- Email subject examples:
  - "Next step requested for your Jobarium submission"
  - "Update on your Jobarium submission"
- Body essentials:
  - action type
  - next step instructions

### N-06 System Delay Notice (Operational)
- Trigger:
  - incident requiring user communication
- Audience:
  - affected candidates/employers
- Body essentials:
  - affected feature
  - status summary
  - expected update time

## Fallback Behavior

### Delivery Failure Handling
1. Attempt primary channel.
2. Retry with backoff per provider policy.
3. If retries exhausted:
   - attempt secondary channel (if consent exists).
4. If both fail:
   - mark delivery failed and create support-visible log entry.

### Outage Mode
- If provider outage > 30 minutes:
  - switch to degraded mode:
    - send only critical notifications (`N-01`, `N-04`, `N-06`).
  - queue non-critical notifications for later replay.

## Consent and Compliance
- Respect channel opt-in/opt-out preferences.
- Respect quiet hours for SMS by recipient timezone.
- Include legal footer and preference management in email templates.

## Template Variables (Safe Set)
- `recipient_first_name`
- `role_title`
- `employer_name`
- `invite_expiry_at`
- `cta_url`
- `support_url`

No raw sensitive fields (full personal identifiers, full transcripts, etc.) in notifications.

## Monitoring Metrics
- delivery success rate by channel
- send latency by event type
- fallback activation rate
- bounce/failure rate

## Ownership
- Product copy owner: CEO
- Technical delivery owner: CTO
- Review cadence: biweekly during pilot
