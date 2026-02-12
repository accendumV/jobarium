# Jobarium Candidate Disclosure and Consent Copy Package (MVP)

## Purpose
Provide finalized candidate-facing copy for:
- privacy/consent,
- authenticity checks disclosure,
- communication permissions,
- data rights (GDPR).

This closes item 25 in the system completeness gate.

## Copy Principles
- Plain language over legal jargon.
- Clear "why" for each consent.
- Actionable user choices (accept/decline where applicable).
- No dark patterns.

## A) Account Creation Consent Copy

### Terms and Privacy Consent (Required)
- Title:
  - "Before you continue"
- Body:
  - "To use Jobarium, please review and accept our Terms of Use and Privacy Notice."
  - "We use your profile data to match you with roles and deliver interview invitations."
- Checkbox label:
  - "I agree to the Terms of Use and Privacy Notice."
- Blocking behavior:
  - required for account creation.

## B) Matching and Profile Processing Disclosure

### Candidate Profile Processing (Required)
- Title:
  - "How your profile is used"
- Body:
  - "Jobarium analyzes your profile information to identify job matches."
  - "You can edit your profile at any time."
  - "Required match fields (such as location and work eligibility) are always shown for your confirmation."
- CTA:
  - "Continue"

## C) Authenticity Check Disclosure (Required for Q&A)

### Pre-Q&A Notice
- Title:
  - "Response authenticity notice"
- Body:
  - "To help employers evaluate responses fairly, Jobarium applies automated authenticity checks."
  - "Light assistance (such as grammar fixes) is allowed."
  - "Fully outsourced or auto-generated responses may be flagged for review."
  - "This does not automatically reject your application."
- Checkbox label:
  - "I understand the authenticity policy."
- Blocking behavior:
  - required before Q&A submission.

## D) Communication Consent (Channel-Specific)

### Email Notifications
- Label:
  - "Receive job and interview updates by email."
- Default:
  - enabled

### SMS Notifications
- Label:
  - "Receive time-sensitive updates by SMS."
- Default:
  - disabled (opt-in)
- Note:
  - "Standard carrier rates may apply. You can opt out anytime."

## E) Data Rights (GDPR) Copy

### Data Rights Panel
- Title:
  - "Your data rights"
- Body:
  - "You can request a copy of your data or request deletion from your account settings."
  - "Some records may be retained where required for legal/compliance reasons."
- Actions:
  - "Request data export"
  - "Request account/data deletion"

## F) Error and Recovery Copy

### Consent Save Failure
- Message:
  - "We couldn't save your consent settings right now. Please try again."

### Q&A Authenticity Notice Not Accepted
- Message:
  - "Please confirm the authenticity notice before submitting your responses."

## G) Localization/Accessibility Notes
- Keep reading level near plain-English business language.
- Support screen readers with clear heading labels.
- Avoid ambiguous negatives in consent labels.

## H) Approval and Change Control
- Owner: CEO
- Reviewer: CTO
- Update rule:
  - any legal/compliance wording change requires version bump and date annotation.
