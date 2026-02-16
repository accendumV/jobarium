# Screen Connectivity Maps

This file contains Mermaid-safe diagrams for the main product screen connections.

Source alignment:
- `Plan/03_user_experience_flows/03_candidate_user_flow.md`
- `Plan/03_user_experience_flows/04_employer_user_flow.md`
- `Plan/03_user_experience_flows/05_end_to_end_golden_flow.md`
- `Plan/03_user_experience_flows/15_ui_screen_inventory_mvp.md`
- `Plan/02_architecture/03_bounded_contexts_mvp.md`
- `Plan/02_architecture/04_bc_interfaces_conceptual.md`

---

## 1) Global Entry and Shared Layer

```mermaid
flowchart TD
  A["Landing or Marketing"] --> R["Role Intent Selection"]
  R --> B["Sign Up or Log In"]
  B --> C["Role Based Consent Capture"]
  C --> D["Email Verification"]
  D -->|Candidate| C0["Candidate Onboarding Entry"]
  D -->|Employer| E0["Employer Workspace Onboarding"]

  C0 -.-> S2["Privacy and Data Rights"]
  E0 -.-> S2
```

---

## 2) Candidate App Map

```mermaid
flowchart TD
  C0["Onboarding Entry"] --> C1["CV Upload or Import"]
  C1 --> C2["Parsed Data Review"]
  C2 --> C3["Profile Completeness Dashboard"]
  C3 --> C4["Match Home"]
  C4 --> C5["Match Detail"]
  C5 --> C6["Invite Detail"]

  C6 -->|Start Q and A| C7["Q and A Session"]
  C6 -->|Decline| C4
  C6 -->|Expired| C5

  C7 -->|Submit| C8["Submission Confirmation"]
  C7 -->|Autosave Resume| C7
  C8 --> C9["Opportunity Status Timeline"]

  C9 -->|Interview Requested| C10["Interview Scheduling Center"]
  C9 -->|Offer Received| C11["Offers Center"]
  C9 -->|Clarification Needed| C7
  C9 -->|Closed| C4

  C4 --> C12["Candidate Settings and Data Rights"]
  C12 --> C13["Data Export Request"]
  C12 --> C14["Data Deletion Request"]

  C9 -->|Authenticity Flagged| C15["Appeal Submission"]
  C15 --> C16["Appeal Status Tracking"]
```

---

## 3) Employer App Map

```mermaid
flowchart TD
  E0["Employer Workspace Onboarding"] --> E1["Team Members and Roles"]
  E1 --> E2["Job Setup Wizard"]
  E2 --> E3["Automation Settings"]
  E3 --> E4["Job Lifecycle Management"]

  E4 -->|Job Active| E5["Packet Inbox"]
  E5 --> E6["Packet Detail and Decision Desk"]

  E6 -->|Interview| E7["Clarification and Follow Up Queue"]
  E6 -->|Clarify| E7
  E6 -->|Reject| E5

  E5 --> E8["Job Performance Dashboard"]
  E8 -->|Tune Role or Requirements| E2
  E8 -->|Tune Automation Policy| E3

  E1 --> E9["Integration Status Center"]
  E1 --> E10["Compliance and Billing Settings"]
```

---

## 4) Architecture Aware Integration Map

```mermaid
flowchart LR
  C1["Candidate Onboarding and Profile"]
  C2["Candidate Match Screens"]
  C3["Invite Detail"]
  C4["Q and A Session"]
  C5["Candidate Timeline and Status"]

  E1["Employer Org and Team"]
  E2["Job Setup and Automation"]
  E3["Packet Inbox and Detail"]
  E4["Employer Analytics and Settings"]

  IAM["Identity and Access"]
  PROF["Candidate Profile"]
  ORG["Organization"]
  BILL["Billing"]
  JOB["Job and Question Kit"]
  MATCH["Matching and Ranking"]
  INV["Invitations and Automation"]
  QA["Q and A Session BC"]
  PACK["Candidate Packet"]
  NOTIF["Notifications Shared Capability"]

  C1 --> IAM
  C1 --> PROF
  E1 --> IAM
  E1 --> ORG
  E2 --> JOB
  E2 --> ORG
  E2 --> BILL
  C3 --> INV
  C4 --> INV
  C4 --> JOB
  E3 --> PACK
  E3 --> IAM
  E3 --> ORG

  PROF -->|profile.updated| MATCH
  JOB -->|job.updated| MATCH
  MATCH -->|matching.shortlist.changed| INV
  INV -->|invite.created| NOTIF
  QA -->|qa.submitted| PACK
  QA -->|qa.authenticity.assessed| PACK
  PACK -->|packet.ready| NOTIF
  PACK -->|usage.increment| BILL

  MATCH --> C2
  INV --> C3
  QA --> C4
  PACK --> C5
  PACK --> E3
  BILL --> E4
```

---

## Rendering Notes

- Open this file in Markdown Preview for the most reliable Mermaid rendering.
- If any diagram fails in your environment, split it into smaller blocks and keep labels simple ASCII.

---

## Non Mermaid Fallback Map

Use this section if Mermaid rendering is disabled in your editor.

### Global Entry and Shared Layer

`Landing or Marketing`
-> `Role Intent Selection`
-> `Sign Up or Log In`
-> `Role Based Consent Capture`
-> `Email Verification`
-> Candidate path: `Candidate Onboarding Entry`
-> Employer path: `Employer Workspace Onboarding`

Optional shared links from both paths:
- `Privacy and Data Rights`

### Candidate App Flow

`Onboarding Entry`
-> `CV Upload or Import`
-> `Parsed Data Review`
-> `Profile Completeness Dashboard`
-> `Match Home`
-> `Match Detail`
-> `Invite Detail`

From `Invite Detail`:
- Start: -> `Q and A Session`
- Decline: -> `Match Home`
- Expired: -> `Match Detail`

From `Q and A Session`:
- Submit: -> `Submission Confirmation` -> `Opportunity Status Timeline`
- Resume path: `Q and A Session` -> `Q and A Session`

From `Opportunity Status Timeline`:
- Interview requested: -> `Interview Scheduling Center`
- Offer received: -> `Offers Center`
- Clarification needed: -> `Q and A Session`
- Closed: -> `Match Home`
- Authenticity flagged: -> `Appeal Submission` -> `Appeal Status Tracking`

From `Match Home`:
- -> `Candidate Settings and Data Rights`
  - -> `Data Export Request`
  - -> `Data Deletion Request`

### Employer App Flow

`Employer Workspace Onboarding`
-> `Team Members and Roles`
-> `Job Setup Wizard`
-> `Automation Settings`
-> `Job Lifecycle Management`
-> (if active) `Packet Inbox`
-> `Packet Detail and Decision Desk`

From `Packet Detail and Decision Desk`:
- Interview: -> `Clarification and Follow Up Queue`
- Clarify: -> `Clarification and Follow Up Queue`
- Reject: -> `Packet Inbox`

From `Packet Inbox`:
- -> `Job Performance Dashboard`
  - Tune role or requirements: -> `Job Setup Wizard`
  - Tune automation policy: -> `Automation Settings`

From `Team Members and Roles`:
- -> `Integration Status Center`
- -> `Compliance and Billing Settings`

### Architecture Aware Integration (BC linked)

Sync checks and reads:
- Candidate onboarding and profile screens -> `Identity and Access`, `Candidate Profile`
- Employer org and team screens -> `Identity and Access`, `Organization`
- Job setup and automation screens -> `Job and Question Kit`, `Organization`, `Billing`
- Invite detail -> `Invitations and Automation`
- Q and A session -> `Invitations and Automation`, `Job and Question Kit`
- Packet inbox and detail -> `Candidate Packet`, `Identity and Access`, `Organization`

Async event flow:
- `Candidate Profile` -profile.updated-> `Matching and Ranking`
- `Job and Question Kit` -job.updated-> `Matching and Ranking`
- `Matching and Ranking` -matching.shortlist.changed-> `Invitations and Automation`
- `Invitations and Automation` -invite.created-> `Notifications Shared Capability`
- `Q and A Session BC` -qa.submitted-> `Candidate Packet`
- `Q and A Session BC` -qa.authenticity.assessed-> `Candidate Packet`
- `Candidate Packet` -packet.ready-> `Notifications Shared Capability`
- `Candidate Packet` -usage.increment-> `Billing`
