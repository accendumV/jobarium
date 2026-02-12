# Jobarium Employer User Flow (MVP)

## Goal
Give employers a hands-off hiring workflow where setup is short and review quality is high.

## Experience Principles
- Setup once, automation by default.
- No queue overload: only completed packets reach the inbox.
- Explainable matching and consistent packet structure.
- One-click decision actions to reduce cycle time.

## Employer Journey (Primary Path)

### Stage 1: Organization Onboarding
1. Employer creates organization account.
2. Adds organization details and team members (optional in MVP).
3. Configures notification channels and timezone.

Success condition:
- Employer workspace is active and can create jobs.

### Stage 2: Job Setup Wizard
1. Employer creates role with title, location, pay band, schedule details.
2. Defines requirements:
   - must-haves
   - nice-to-haves
   - dealbreakers
3. Selects or edits question kit template (5-10 questions).

Success condition:
- Role is publish-ready with structured requirements and screening kit.

### Stage 3: Automation Configuration
1. Employer enables auto-invite rules:
   - shortlist threshold/top N
   - invite caps
   - cooldown windows
   - expiry duration
2. Employer activates job.

Success condition:
- Matching and invite automation are live without manual sourcing.

### Stage 4: Packet Inbox Review
1. Employer receives only completed candidate packets.
2. For each packet, employer sees:
   - fit highlights tied to must-haves
   - dealbreaker confirmations
   - authenticity insight badge (self-authored/mixed/heavy-assistance-suspected)
   - summarized risks/gaps
   - full Q&A transcript
3. Employer takes one action:
   - request interview
   - request clarification
   - reject

Success condition:
- Decisions are fast and consistent with less screening effort.

### Stage 5: Feedback and Optimization
1. Employer actions feed ranking outcomes.
2. Employer adjusts requirements and question kit when needed.
3. Dashboard shows efficiency and conversion metrics.

Success condition:
- Better packet quality and conversion over time.

## Screen-Level Requirements

### Employer Setup Screens
- Organization onboarding
- Job creation wizard
- Requirement and dealbreaker builder
- Question kit editor
- Automation settings panel

### Employer Operational Screens
- Packet inbox
- Packet detail view
- Job performance dashboard
- Template management (future-safe)

## Required vs Optional Employer Inputs (MVP)

Required:
- role title/description
- location and remote policy
- pay range
- must-haves and dealbreakers
- question kit

Optional (but recommended):
- ideal candidate traits
- preferred start window detail
- team reviewer assignments

## Employer Delight Opportunities
- First packet ETA shown after job activation.
- Smart defaults prefilled for invite policy.
- Packet side-by-side comparison view (phase 1.5 if feasible).
- Built-in verification prompts when authenticity risk is flagged.

## Failure and Edge Flows
- Zero packet output after activation:
   - suggest requirement relaxation candidates.
- Too many low-quality packets:
   - tighten must-haves or update question kit quality.
- Notification delivery failures:
   - fallback channels and retry strategy.
- Policy misconfiguration:
   - guardrails/warnings before activation.
- False-positive authenticity flag:
   - employer sees confidence and reason codes, not binary reject recommendation.

## Employer KPIs
- time to first completed packet
- packet -> interview rate
- interview -> hire proxy rate
- reviewer time saved per role
- repeat job activation rate

## Non-Goals for MVP
- Full ATS replacement
- Complex interview panel workflows
- Enterprise-grade workflow customization
