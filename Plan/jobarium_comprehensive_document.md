# Jobarium — Comprehensive Working Document (Chat Summary)

This document consolidates everything defined in the conversation from the start, in a structured form you can use for planning, pitching, and scoping V1.

---

## 1) The core concept

Jobarium is a two-sided hiring platform where:

- Job seekers build a comprehensive profile once and keep it updated.
- Employers set up a position once.
- Matching and pre-screening run in the background.
- HR receives only ready-to-review candidate packets when candidates complete the “interview” (predefined questions).

Guiding idea:
- Flip hiring from “people apply to jobs” to “jobs find the right people.”

Primary positioning:
- **Jobarium is Uber for hiring.**

---

## 2) The user problems (two-sided)

### 2.1 Employer problems (HR / hiring managers)
- Too many low-signal applications.
- Screening consumes hours every week.
- Dealbreakers discovered late (salary, location, authorization, start date, required certs).
- First-round calls repeat the same questions.
- Difficult to compare candidates consistently.
- Candidates drop off while scheduling drags.

### 2.2 Candidate problems (job seekers)
- Re-entering the same data across many platforms: LinkedIn, Indeed, Workday portals, company ATS websites, niche boards.
- Rewriting and tailoring application materials repeatedly.
- Missing perfect-fit jobs because postings are fragmented across proprietary platforms and different boards.
- Being buried as applicant #2000 for high-visibility roles and never being reviewed.
- Limited clarity on why they were filtered out.

Core pain statement:
- **There is always a job you fit perfectly. You miss it because you never saw it, or you were buried in a massive queue.**

---

## 3) The agreed product workflow (V1)

The central agreement:
- HR should set up everything once when creating the role.
- After that, the system is fully automated.
- HR only receives updates when candidates complete the “interview” (structured Q&A).

### 3.1 Employer setup (one-time per role)
Employer defines:
- Must-haves vs nice-to-haves.
- Dealbreakers:
  - work authorization
  - location / radius / remote policy
  - salary range
  - start date window
  - required license/certification (if applicable)
- **Question Kit** (5–10 questions).
- Automation rule:
  - Trigger: candidate enters shortlist for this job.
  - Top N and/or score threshold.
  - Caps and cooldowns.
  - Invite expiry.

After setup:
- HR does not click “invite.”
- HR does not run searches.
- HR does not manage floods of applicants.
- HR receives “packets only.”

### 3.2 Candidate flow
Candidate does:
- Creates profile once (multi-step comprehensive form).
- Updates only changes later.

When shortlisted:
- Candidate receives an invitation to answer employer’s predefined questions.
- Candidate chooses to start or decline.
- Candidate answers asynchronously and submits.
- System generates a summary packet for HR.

Candidate value:
- Less repetitive applications.
- Higher visibility to jobs they might miss.
- Less time spent tailoring.
- More time spent responding only when shortlisted.

---

## 4) The “interview” system (Question Kits)

### 4.1 What it is
A structured, asynchronous Q&A that feels like an interview step but is:
- faster than scheduling live calls
- standardized
- role-specific
- “packetized” for HR review

### 4.2 Question Kit rules (V1)
- 5–10 questions max.
- Supported question types:
  - Yes/No
  - Multiple choice
  - Short text (150–300 words)
  - Numeric fields (years, salary, quotas, etc.)
  - Link upload (portfolio/work samples)

### 4.3 Consent step
Even though the system auto-triggers invitations:
- Candidate must opt in (“Start” vs “Decline”).
- This avoids spam feelings and builds trust.

### 4.4 HR output (the packet)
HR receives a ready-to-review packet:
- One-page summary:
  - fit highlights tied to must-haves
  - confirmed constraints (auth, location, salary, start date)
  - evidence snippets from answers
  - gaps/unknowns
  - suggested follow-up questions (3–5)
- Full Q&A transcript below.
- Next actions:
  - invite to live interview
  - request clarification
  - reject

---

## 5) Voluntary “pre-scan” (profile enrichment)

We defined an optional step:
- It is **voluntary**.
- It is **not gating** in V1.
- It improves the profile summary and comparisons.

Outputs stored and cached:
1. Raw answers (source of truth)
2. Structured extraction (JSON)
3. Human-readable profile brief and follow-ups

Purpose:
- Improve matching signal and packet quality without forcing candidates to do extra work.

---

## 6) Matching, scoring, and shortlisting

### 6.1 The ranking pipeline (scalable)
We agreed on a practical cascade that avoids N×M matching:

1) Hard filters (dealbreakers)
2) Retrieve top K by semantic similarity (vector search)
3) Deterministic scoring on top K
4) Shortlist top N

This is why the system does not “explode” when there are 10k employers and 10k job seekers.

### 6.2 Hard filters (pass/fail)
Examples:
- work authorization eligibility
- location compatibility (onsite radius, hybrid rules, remote allowed)
- pay overlap
- start date window
- required cert/license

Fail any: candidate excluded for the job.

### 6.3 Retrieval (top K)
- Convert candidate profile and job requirements into embeddings.
- Use cosine similarity to fetch top K candidates (or jobs) from a vector index.
- Typical K: 200–500

### 6.4 Deterministic scoring
We defined a scoring function in [0,100]:

Score(c, j) = 100 × (
  w_s * S_skills +
  w_t * S_title +
  w_d * S_domain +
  w_e * S_experience +
  w_l * S_location +
  w_p * S_pay +
  w_a * S_availability +
  w_r * S_recency +
  w_q * S_quality
)

All sub-scores normalized to [0,1]. Weights sum to 1.

Suggested starting weights:
- skills: 0.35
- title/role: 0.15
- domain: 0.10
- experience: 0.10
- location: 0.10
- pay: 0.10
- availability: 0.05
- recency: 0.03
- profile quality: 0.02

Skills score example:
- Must-have coverage M and nice-to-have coverage N
- S_skills = 0.7*M + 0.3*N

Tie-breakers:
1) Must-have coverage
2) semantic similarity
3) recency

### 6.5 How the shortlist triggers automation
- Every job has a shortlist (top N).
- When a candidate newly enters top N:
  - automation triggers invitation
  - caps/cooldowns prevent spam
  - expiry prevents stale invites

---

## 7) “Fast background” mode

Your requirement:
- No specific “runs.”
- Background process should be continuous.

We defined:
- Hourly refresh (fast background) as a practical baseline:
  - recompute shortlist per active job hourly
  - or trigger on events (job_updated, profile_updated)

This creates:
- “magic behind the scenes”
- HR sees only outcomes (packets completed)

---

## 8) Unit economics (early view)

Key idea:
- Keep background matching cheap.
- Spend AI compute when value is created.

Cost drivers:
- embeddings when profiles/jobs change (low)
- vector search retrieval (moderate)
- summarization only on submitted Q&A (bounded, cached)

Pricing should align with value:
- active jobs
- packets/month (completed interview packets)
- seats
- overage packs

Reason:
- HR experiences value only when completed packets arrive.
- Your costs also concentrate at packet generation.

---

## 9) Investor narrative

### 9.1 What stands out
- You are not an apply-first board.
- You are not an ATS.
- You are “Uber for hiring”: set-and-forget matching + structured pre-screen packets.

### 9.2 Two-sided value
Employers:
- less screening time
- fewer wasted interviews
- consistent comparison

Candidates:
- one profile replaces repeated applications
- discovered for roles they missed
- no queue disadvantage when they match perfectly

### 9.3 Slide drafts we refined

Slide 1 — The problem:
- employer screening overload
- candidate busywork + missed opportunities + queues
- “perfect fit exists but gets missed”

Slide 2 — The win-win solution:
- Jobarium is Uber for hiring
- setup once on both sides
- background matching and auto pre-screen
- HR receives completed packets only

### 9.4 Elevator pitch (short)
Jobarium is Uber for hiring: employers set up a role once, candidates set up a profile once, and the platform matches and pre-screens in the background, delivering HR only completed candidate packets.

---

## 10) Competitors and differentiation (high level)

We clarified:
- Some platforms can surface candidates before they apply.
- However, in most cases, a recruiter still needs to click “invite,” search, message, or manage a flow.

Your differentiator:
- after initial setup, the system runs without recruiter actions
- auto-invites are triggered automatically when shortlist changes
- HR sees completed packets rather than queues

Strategic framing:
- LinkedIn can be treated as a partner channel rather than an enemy:
  - identity + credibility + distribution
  - Jobarium owns the deeper workflow layer

---

## 11) Moat (what makes this defensible)

The moat is not “AI matching.”

The moat is:
- proprietary structured signals earned through your workflow:
  - standardized profile fields
  - employer must-haves and dealbreakers
  - Q&A packets tied to a role
  - outcomes (views, interviews, hires)
- outcome-driven ranking improvement over time
- employer lock-in via role templates + kits + “packets-only” habit
- candidate lock-in as a living career record
- trust and quality controls that improve conversion

What investors will challenge:
- cold start and liquidity
- trust and packet quality
- proof of outcomes

How to address:
- start narrow (role family + region)
- publish early proof metrics:
  - packet completion rate
  - packet-to-interview rate
  - time to first completed packet
  - employer retention

---

## 12) Strategy discussion: building supply first

You proposed:
- candidate acquisition first is easier because candidates join many platforms.
- once enough candidate density exists:
  - advertise to HR
  - offer free trial (one job setup + limited completed packets free)
  - convert based on experience of hands-off flow

We refined:
- “signups” are not enough; you need usable profiles and retention.
- a structured “core profile fast, enrich later” approach improves completion.
- employer pilots should start as soon as you have density in one wedge (not necessarily after 10k).

---

## 13) Geography and role family

We discussed Raleigh, NC and DMV.

Key agreement:
- role family + SMB focus matter more than geography early.

### DMV discussion (your direction)
You asked about non-clearance roles and suggested HVAC/electrician.

We identified high-demand, clearance-free wedges that fit your structured matching:
- HVAC
- Electricians
- Plumbing
- Maintenance/repair
- other frontline roles (as potential expansions)

These roles are SMB-friendly and map cleanly to dealbreakers:
- licensing/certs
- service area / commuting radius
- schedule/shift availability
- years of experience
- pay expectations

---

## 14) GCP-based architecture direction (overview)

We mapped the system to GCP services:

- Cloud Run for microservices (Profile, Jobs, Matching, Automation, Q&A, Packet Builder, Notifications, Billing)
- API Gateway + Cloud Load Balancer + Cloud Armor + Cloud CDN
- Cloud SQL (Postgres) for system of record
- Memorystore (Redis) for caching, caps, cooldowns, shortlist cache
- Cloud Storage for files (resumes, attachments)
- Pub/Sub for events (profile_updated, job_updated, shortlist_changed, answers_submitted, packet_ready)
- Cloud Scheduler for hourly triggers
- Cloud Tasks for throttled invite dispatch
- Vertex AI for embeddings, vector search, and summaries

We also produced a C4 model describing the system context, containers, and key components.

---

## 15) What we produced as artifacts
- A V1 specification in Markdown.
- An architecture diagram (image).
- A Mermaid diagram for text-based rendering.
- A full C4 model in DSL form.

---

## 16) Next-step decisions (ready to lock)
To proceed into a concrete build and go-to-market plan, the next decisions are:

1) First role family wedge:
- Trades (HVAC/electrician/plumbing/maintenance) for DMV SMBs
- or a different wedge if you prefer

2) First geography:
- Raleigh
- DMV
- or parallel pilots once wedge is fixed

3) V1 scope boundaries:
- written Q&A only (recommended)
- no tests in V1
- no “automated decisions,” human decides based on packet

4) Trial offer definition:
- not “one run”
- “one job setup + up to X completed packets free”

5) The first metrics to track:
- invite → packet completion
- packet → interview requested
- time to first completed packet
- employer retention and repeat jobs

---

End of document.
