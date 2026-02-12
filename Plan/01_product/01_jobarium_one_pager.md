# Jobarium One-Pager

## What Jobarium Is
Jobarium is a two-sided hiring platform that changes hiring from "apply-first" to "match-first."

- Candidates create one structured profile and update it over time.
- Employers set up a job once with must-haves, dealbreakers, and a question kit.
- Matching runs continuously in the background.
- When a candidate newly enters a shortlist, the system auto-invites them to complete role-specific asynchronous pre-screen questions.
- HR reviews only completed candidate packets, not large applicant queues.

Core positioning: **"Uber for hiring"** - setup once, then hands-off, outcome-focused flow.

## Problem It Solves
Current hiring is high-friction on both sides:

- **For employers**: too many low-signal applications, repetitive first-round screening, late discovery of disqualifiers, inconsistent candidate comparisons.
- **For candidates**: repetitive data entry across platforms, poor visibility into ideal jobs, low review probability in high-volume queues.

Jobarium addresses this by combining structured data, automated shortlisting, and packet-first screening.

## Why This Can Work
1. **Strong workflow fit for SMB hiring teams**
   - Reduces repetitive recruiter work and time-to-first-valuable-candidate.
2. **Clear two-sided value**
   - Employers get higher-signal packets; candidates avoid repetitive applications.
3. **Defensible data exhaust**
   - Structured profile fields, role constraints, Q&A answers, and outcomes create proprietary training signal over time.
4. **Operationally practical MVP**
   - Hard filters + top-K retrieval + deterministic scoring is cheaper and more explainable than black-box matching.
5. **Automation aligned with economics**
   - More compute spent when value is created (completed packets), less spent on low-value workflow.

## Known Weaknesses and Realistic Risks
1. **Cold-start liquidity**
   - Without enough active candidates in a local niche, employers may not see early value.
2. **Trust in automation**
   - Recruiters may resist fully hands-off invite flow until quality is proven.
3. **Packet quality variance**
   - Weak candidate responses reduce packet usefulness even if matching is good.
4. **Marketplace asymmetry**
   - Candidate acquisition and employer conversion may scale at different speeds.
5. **Integration drag**
   - Rich integrations (ATS, calendars, external profiles) can delay launch if over-scoped.

## Balanced Approach (Skeptical but Constructive)
The idea is compelling, but execution should stay disciplined:

- Start with a narrow GTM wedge (assumption: DMV trades) while keeping architecture wedge-agnostic.
- Launch with AI-minimal principles: embeddings + ranking + packet summaries only.
- Treat automation as configurable, with clear caps, cooldowns, and opt-in controls.
- Prove value with hard metrics early rather than feature breadth.
- Expand integrations and advanced AI only after base conversion metrics are healthy.

## V1 Scope (8-Week Target)
Must-have:

- Candidate profile creation and updates
- Employer role setup (must-haves, dealbreakers, question kits)
- Matching + scoring + shortlisting
- Auto-invite orchestration
- Asynchronous Q&A completion flow
- Candidate packet generation (summary + full transcript)
- Email/SMS notifications
- Authentication and role-based access
- Basic admin tooling
- GDPR-ready controls (consent, export/delete, retention policies)

Out of scope for initial launch:

- Heavily agentic AI features
- Full SOC2 certification activities (design for SOC2-ready future state)
- Broad enterprise ATS depth

## Success Criteria for First 90 Days Post-Launch
Primary:

- Invite -> packet completion rate
- Packet -> interview-request rate
- Time to first completed packet per job
- Employer repeat job creation / retention

Secondary:

- Candidate profile completion rate
- Invite acceptance rate
- Cost per completed packet

## Strategic Conclusion
Jobarium should be built as an automation-first, packet-first hiring workflow product, not as another job board or ATS. If launch discipline is maintained (narrow wedge, clear metrics, minimal AI, strong workflow quality), it has a credible path to product-market fit and defensibility.
