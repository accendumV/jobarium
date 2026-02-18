# Vision and Scope (MVP)

## Owns
- Product definition, MVP boundaries, non-goals, success metrics.

## Excludes
- Detailed user flow steps (see `../03_user_experience/*`).
- Technical implementation details (see `../02_architecture/*`).

## Product Definition
Jobarium is a match-first hiring workflow:
- Candidate keeps one evolving structured profile.
- Employer configures job, dealbreakers, and question kit once.
- System continuously matches and invites shortlisted candidates.
- Employer reviews completed packets instead of raw application queues.

## MVP Scope (Must Ship)
- Candidate onboarding + profile bootstrap from CV.
- Employer org/job setup with dealbreakers and question kit.
- Matching, ranking, shortlist diff, and invite automation.
- Candidate Q&A session and packet generation.
- Employer packet actions: `interview`, `clarify`, `reject`.
- RBAC, audit logging, GDPR workflows, basic admin tooling.

## Explicit Non-Goals
- Enterprise-depth ATS ecosystem.
- Broad agentic AI flows.
- Full SOC2 program execution (only SOC2-ready design posture).

## Success Metrics (First 90 Days)
- Invite -> packet completion rate.
- Packet -> interview-request rate.
- Time to first completed packet per job.
- Employer repeat-job rate.
- Candidate profile completion rate.
- Cost per completed packet.

## MVP Guardrails
- Authenticity signals are advisory only; no auto-reject by score.
- Launch wedge can be narrow; architecture stays wedge-agnostic.
- Favor reliable deterministic scoring + explainability over opaque models.
