# Jobarium Authenticity Detection Specification (MVP -> Phase 1.5)

## 1. Objective
Detect likely heavy AI rewriting or outsourced answer generation in employer Q&A submissions, while preserving fairness and minimizing false positives.

This module provides **decision support**, not automatic hiring decisions.

## 2. Product Policy

### 2.1 Allowed vs Not Allowed
- Allowed:
  - grammar and spelling corrections
  - short phrasing improvements
  - translation assistance (declared or inferred)
- Not allowed (policy-flagged):
  - full answer generation with little user involvement
  - copy-paste of externally generated full responses
  - inconsistent fabricated details that break profile history coherence

### 2.2 Decision Principle
- MVP must be **human-in-the-loop**.
- Model output can flag risk but cannot auto-reject candidates.
- Employers see confidence and reason codes, not binary guilt labels.

## 3. Detection Architecture

## 3.1 Data Sources
- Q&A editor telemetry:
  - keystroke timing aggregates (not raw keylogging)
  - paste events (count/size/timestamps)
  - edit operations (insert/delete bursts)
  - focus/blur intervals
- Submitted answers:
  - final text
  - answer length and structure
- Candidate profile baseline:
  - prior written fields
  - experience history, certifications, role family

### 3.2 Processing Steps
1. Collect session telemetry and answer content.
2. Compute per-answer features.
3. Aggregate session-level features.
4. Run rule engine to produce reason codes.
5. Compute authenticity score + confidence.
6. Persist assessment and emit event.
7. Attach trust insight to packet.

### 3.3 Service Components
- `qa-telemetry-collector` (Cloud Run endpoint)
- `qa-signal-extractor` (worker)
- `qa-authenticity-scorer` (rule engine in MVP)
- `packet-trust-enricher` (adds badge + reason codes to packet view)

## 4. Signal Definitions (MVP)

All features are normalized to [0,1] where possible.

### 4.1 Behavioral Signals
- `paste_ratio_chars`
  - pasted_characters / total_characters
- `full_answer_paste_events`
  - count of paste events where pasted chunk > 70% of final answer
- `time_to_first_input_sec`
  - long delay followed by large paste can increase risk
- `edit_churn_ratio`
  - edits / final_length (very low with large paste can increase risk)
- `typing_burst_entropy`
  - low entropy patterns may indicate non-human drafting sequence

### 4.2 Linguistic Consistency Signals
- `style_shift_score`
  - difference between candidate historical writing profile and current submission
- `readability_shift`
  - abrupt jumps in complexity/vocabulary level
- `template_phrase_density`
  - known generic assistant phrase frequency

### 4.3 Coherence and Plausibility Signals
- `timeline_conflict_score`
  - conflicts with known employment chronology
- `domain_depth_mismatch`
  - answer sophistication inconsistent with profile claims
- `cross_answer_contradiction_score`
  - logical contradictions between answers in same session

### 4.4 Contextual Mitigation Signals
- `non_native_language_indicator`
  - reduces weight of style-shift-only concerns
- `accessibility_mode_indicator`
  - allows alternative input behavior patterns
- `declared_assistance_flag`
  - candidate declares use of writing support tools

## 5. Scoring Model (MVP Rule-Based)

### 5.1 Score
`ai_assist_likelihood` in [0,100]:

`score = 100 * (0.40*B + 0.30*L + 0.20*C - 0.10*M)`

Where:
- `B` = behavioral risk composite
- `L` = linguistic inconsistency composite
- `C` = coherence risk composite
- `M` = mitigation composite

`authenticity_score = 100 - ai_assist_likelihood`

### 5.2 Confidence
Confidence in [0,1] based on:
- telemetry completeness
- answer length sufficiency
- number of active signals
- inter-signal agreement

Low confidence defaults to neutral packet labeling.

### 5.3 Policy Buckets
- `0-34`: `likely_self_authored`
- `35-64`: `mixed_assistance`
- `65-100`: `heavy_assistance_suspected`

If confidence < 0.55 => policy result downgraded to `mixed_assistance` with low-confidence marker.

## 6. Reason Codes

Reason codes are short, explainable tags for employers and support team:
- `RC_PASTE_HEAVY`
- `RC_STYLE_SHIFT_ABRUPT`
- `RC_TEMPLATE_PHRASE_PATTERN`
- `RC_TIMELINE_CONFLICT`
- `RC_CROSS_ANSWER_CONTRADICTION`
- `RC_LOW_EDIT_INVOLVEMENT`
- `RC_LOW_CONFIDENCE_RESULT`

Packet UI shows top 1-3 reason codes only.

## 7. Data Model Additions

### `qa_response_signal`
- `id` (uuid)
- `session_id`
- `question_id`
- `signal_type`
- `signal_value_json`
- `captured_at`

Indexes:
- `(session_id, question_id)`
- `(signal_type, captured_at)`

### `qa_authenticity_assessment`
- `id` (uuid)
- `session_id` (unique)
- `authenticity_score` (0-100)
- `ai_assist_likelihood` (0-100)
- `confidence` (0-1)
- `policy_result` (enum)
- `reason_codes_json` (array)
- `model_version`
- `assessed_at`

Indexes:
- `(policy_result, assessed_at)`
- `(confidence, assessed_at)`

## 8. Event Contracts

### 8.1 `qa.submitted` (input trigger)
Payload:
- `event_id`
- `session_id`
- `candidate_id`
- `job_id`
- `submitted_at`

### 8.2 `qa.authenticity.assessed` (output)
Payload:
- `event_id`
- `session_id`
- `candidate_id`
- `job_id`
- `policy_result`
- `authenticity_score`
- `confidence`
- `reason_codes` (max 3)
- `model_version`
- `assessed_at`

## 9. Employer UX Output

### 9.1 Packet Header
- Trust badge:
  - Green: likely self-authored
  - Yellow: mixed assistance
  - Orange: heavy assistance suspected

### 9.2 Detail Block
- "Why flagged" with short reason codes + plain-language translation.
- "Suggested verification prompts" (2-3):
  - scenario-based follow-up
  - timeline clarification
  - tool/process deep dive

### 9.3 Guardrail Copy
- "This is an automated trust signal and should be used alongside interview judgment."

## 10. Candidate UX and Fairness

### 10.1 Pre-Session Notice
- Explain accepted assistance boundaries.
- Explain that authenticity checks are applied for employer trust and fairness.

### 10.2 In-Session Guidance
- Optional soft warning on suspicious full-answer paste behavior:
  - "Please ensure your response reflects your own experience."

### 10.3 Post-Flag Review Path
- Candidate can request review if they believe the signal is incorrect.
- Support tools show full signal snapshot and confidence.

## 11. Privacy, Security, and GDPR
- Store only aggregate telemetry features; avoid storing raw keystroke content.
- Restrict access to authenticity data to authorized employer/admin roles.
- Include authenticity data in export/delete workflows.
- Retain raw telemetry-derived features for limited period (recommended: 90 days), keep final assessment longer for audit.

## 12. MVP Rollout Plan

### Phase A (Week 6 target)
- Implement telemetry capture + rule-based scoring.
- Show badge + reason codes internally only (admin/employer pilot group).
- Track false-positive feedback.

### Phase B (Week 7-8)
- Enable badge for all pilot employers.
- Add candidate review path and support tooling.
- Tune thresholds by role family.

### Phase C (Phase 1.5)
- Train lightweight classifier using labeled outcomes.
- Keep rule-based fallback for explainability and resilience.

## 13. Quality Metrics
- precision@flag (employer-confirmed suspicious cases)
- false-positive rate (candidate appeals upheld)
- coverage rate (% sessions with confidence >= 0.55)
- employer trust utility score (survey + action correlation)
- impact on packet->interview conversion (must not degrade unfairly)

## 14. Test Strategy

### Unit Tests
- feature extraction correctness
- score computation and threshold bucketing
- reason code generation

### Integration Tests
- `qa.submitted` -> assessment persisted -> event emitted
- packet rendering with trust insight
- low-confidence downgrade behavior

### Adversarial Tests
- full copy-paste synthetic cases
- paraphrased AI-generated responses
- multilingual and non-native writing profiles
- accessibility-altered input behavior

## 15. Open Questions to Lock
1. Should employers be able to configure strictness per role?
2. Do we allow hard block for very high-risk + high-confidence in regulated roles?
3. How long should reason-code history be visible to employers?
4. Should declared assistance by candidates reduce score or only annotate output?
