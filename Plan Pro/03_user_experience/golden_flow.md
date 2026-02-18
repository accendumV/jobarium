# Golden Flow (End-to-End)

## Owns
- Canonical cross-actor sequence and data handoffs.

## Excludes
- Endpoint details (see `../04_implementation/api_contracts.md`).
- Event payload schemas (see `../02_architecture/integration_contracts.md`).

## Sequence
1. Candidate profile updated -> emits profile change.
2. Employer job updated/activated -> emits job change.
3. Matching computes shortlist diff.
4. Automation creates and sends invite.
5. Candidate starts and submits Q&A.
6. Authenticity assessment and packet build execute.
7. Packet becomes ready and employer is notified.
8. Employer takes action and candidate status is updated.

## Handoffs
- Matching -> Automation: shortlist delta only (no side-channel state mutation).
- Q&A -> Packet: submitted answers + authenticity assessment reference.
- Packet -> Employer action: immutable packet snapshot + action record.
