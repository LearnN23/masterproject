# TECHQUEST EOP Platform: System Walkthrough & Thesis Verification

**Research Title:** *Development and Evaluation of a Web-Based English for Occupational Purposes (EOP) Learning Module for Enhancing Online Technical Support and Customer Service Communication Skills among Thai Undergraduate IT Students Preparing for Employment in Malaysia*  
**Target Degree & Institution:** Master of Education in English Language Teaching (ELT), Fatoni University  
**Empirical Denominator:** \(N = 29\) Included Malaysian Job Advertisements (JobStreet, Indeed, corporate career portals across KL, Selangor, Cyberjaya)  
**Total Planned Instructional Duration:** 1,140 Minutes (19.0 Hours across Lessons 1–8)  
**Architecture:** React 19 + Tailwind CSS + Node.js 24 Native SQLite (`DatabaseSync` in WAL mode) + In-Browser SpeechSynthesis & MediaRecorder Single-Take Capture  

---

## 1. System Matrix & User Persona Routing

| Role | Test Username | Participant Code | Gating Rule / Permissions | Primary View |
| :--- | :--- | :--- | :--- | :--- |
| **Experimental Student** | `student` / `pass123` | `STU-1024` | Strict sequential gating: Consent ➔ Pre-test ➔ Lessons 1 to 8 in order ➔ Post-test | Student Dashboard, TBLT Lesson Player, Assessment Stepper |
| **Secondary Student** | `student2` / `pass123` | `STU-1025` | Strict sequential gating | Student Dashboard |
| **QA / Pilot Tester** | `tester` / `pass123` | `TEST-001` | **Full Gate Bypass Active** (Immediate access to all lessons, pre-test, post-test) | Navigation across all 8 lessons |
| **Thesis Expert / Committee** | `expert` / `pass123` | `EXPERT-01` | **Full Gate Bypass Active** + Interactive Role Switcher + Expert Evaluation Instrument | Evaluation Committee View & Student Simulation |
| **Primary Researcher (Rater 1)** | `rater1` / `pass123` | `RATER-1` | Independent 25-Point rubric grading; view masked queue | Speaking Queue & Rubric Portal |
| **External Evaluator (Rater 2)**| `rater2` / `pass123` | `RATER-2` | Independent blind scoring for inter-rater reliability (ICC) | Speaking Queue & Rubric Portal |
| **Lead Administrator** | `admin` / `admin123` | `ADMIN-01` | Full administrative, progress inspection, and CSV export access | Instructor Dashboard & SPSS Export |

---

## 2. Standardized 8-Lesson TBLT Instructional Curriculum

Grounded in the empirical findings of \(N = 29\) Malaysian job postings:

| Unit | Title & Company Context | Target Communication Functions | Formative Practice & Speaking Prompt |
| :--- | :--- | :--- | :--- |
| **Lesson 1** | **Support Call Openings** (*Concentrix*, `JA001`) | Brand salutation, agent introduction, modal credential verification (`may`, `could`). | 3 MCQs + Single-take opening response for incoming customer inquiry. |
| **Lesson 2** | **Tech Fault Diagnostics** (*Concentrix*, `JA003`) | Indirect diagnostic questioning (`Could you tell me if...`), statement word order. | 3 MCQs + Diagnostic inquiry for freezing banking portal. |
| **Lesson 3** | **Tech Troubleshooting** (*Evoxt*, `JA014`) | Translating technical jargon to plain English, First Conditional workarounds. | 3 MCQs + Workaround guidance for cloud control panel timeout. |
| **Lesson 4** | **De-escalation Masterclass** (*Teleperformance*, `JA004`) | HEAR framework (Hear, Empathize, Apologize, Resolve), taking case ownership. | 3 MCQs + Empathetic de-escalation for unresponsive checkout button. |
| **Lesson 5** | **Clear IT Instructions** (*BASF Malaysia*, `JA010`) | Sequential imperatives (`First`, `Next`, `Then`), comprehension verification checks. | 3 MCQs + Step-by-step guidance for cache clearing & network reset. |
| **Lesson 6** | **Case Escalation Mastery** (*Accenture*, `JA013`) | Professional Tier-2/Tier-3 handover, stating realistic SLA turnaround times. | 3 MCQs + Escalation briefing for P1 database table congestion. |
| **Lesson 7** | **CRM Ticket Hygiene** (*Scicom*, `JA020`) | Audit-ready past-tense case notes, industry acronyms (`SLA`, `FCR`, `AHT`, `TAT`). | 3 MCQs + Concise ticket logging for cloud server outage. |
| **Lesson 8** | **Support Shift Handover** (*Accenture* & *BASF*, `JA013`) | 5-stage oral shift handover framework (ID ➔ Symptom ➔ Actions ➔ Status ➔ Next/SLA). | 3 MCQs + Full 90-second Oral Shift Handover briefing. |

---

## 3. Authoritative Pre-Test (Form A) & Post-Test (Form B) Assessment Suite

Extracted verbatim from **Thesis Appendix B** and **Deliverable 3 Assessment Package**:

### Form A: Pre-Test Diagnostic Baseline Assessment
1. **Task 1: Call Opening & Verification** (*OWNDAYS Malaysia*, `JA001`): Order tracking inquiry. (Prep: 45s, Speak: 35s).
2. **Task 2: Fault Isolation & Paraphrasing** (*Concentrix Malaysia*, `JA003`): Mobile banking portal freeze. (Prep: 45s, Speak: 45s).
3. **Task 3: Workaround & De-escalation** (*Teleperformance Malaysia*, `JA004`): E-commerce checkout button failure. (Prep: 60s, Speak: 60s).
4. **Task 4: CRM Synthesis & Shift Handover** (*Accenture Malaysia*, `JA013`): P1 incident `#TK-9021`, Error 504 Timeout. (Prep: 90s, Speak: 90s).

### Form B: Post-Test Summative Outcome Assessment (100% Parallel Equivalence)
1. **Task 1: Call Opening & Verification** (*Foundever Malaysia*, `JA006`): Unauthorized subscription billing fee. (Prep: 45s, Speak: 35s).
2. **Task 2: Fault Isolation & Paraphrasing** (*Evoxt Cloud Solutions*, `JA014`): Cloud console timeout. (Prep: 45s, Speak: 45s).
3. **Task 3: Workaround & De-escalation** (*MSIG Insurance*, `JA005`): Emergency overseas claim 5-day delay. (Prep: 60s, Speak: 60s).
4. **Task 4: CRM Synthesis & Shift Handover** (*BASF Malaysia*, `JA010`): P1 incident `#TK-1009`, SAP RAM overflow. (Prep: 90s, Speak: 90s).

### Interactive Assessment Stepper Features:
- Standardized Inbound Customer Voice Prompts delivered via in-browser `SpeechSynthesis`.
- Preparation Countdown Timer with candidate notes scratchpad (simulates paper test answer space).
- Strict Single-Take Spoken Recording via `MediaRecorder` with live pulse visualizer.
- Automatic backend upload to `/api/submissions` and synchronization to SQLite `student_progress`.

---

## 4. Two-Rater 25-Point Evaluation Pipeline & Reliability Flag

### Blueprint 25-Point Analytic Rubric:
1. **Task Achievement / Fulfillment (1–5)**: Technical accuracy, error codes, SLA compliance.
2. **Interactive Communication & Pragmatic Tone (1–5)**: BPO register, HEAR empathy, personal ownership.
3. **Occupational & Technical Vocabulary (1–5)**: Domain terminology, CS acronyms, plain English clarity.
4. **Grammatical Control & Target Structures (1–5)**: Modals, indirect question word order, First Conditionals.
5. **Pronunciation, Fluency & Intelligibility (1–5)**: Pacing (100–120 wpm), non-penalization of intelligible Thai accent under CEFR B2.

### Inter-Rater Reliability & Discrepancy Flagging:
- Rater 1 (Researcher) and Rater 2 (Expert Evaluator) score independently in a blind queue.
- If \(|R_1 - R_2| \ge 5\) points (> 20% variance), the platform automatically displays a high-visibility alert:  
  `⚠️ Inter-Rater Discrepancy Flag (> 20% Variance Detected) — Consensus Review Required`.

### Automatic CEFR Readiness Mapping:
- **18 – 20 Pts (90–100%)**: `B2.2 / C1` — Job-Ready Specialist (Direct BPO Deployment).
- **15 – 17 Pts (75–85%)**: `B2.1` — Deployable Support Agent (Mentor Supervision).
- **12 – 14 Pts (60–70%)**: `B1.2` — Intermediate (Requires On-the-Job Supervision).
- **08 – 11 Pts (40–55%)**: `B1.1` — Developing (Requires Remedial Language Training).
- **00 – 07 Pts (0–35%)**: `A2` — Novice (Unprepared for Voice Operations).

---

## 5. Statistical Data Export & Committee Validation

- **SPSS / Jamovi CSV Export (`GET /api/export/spss`)**:  
  Exports all participant codes, blind mask IDs, timestamps, audio durations, individual criterion scores for Rater 1 and Rater 2, total raw scores, percentage scores, score discrepancy, and discrepancy flags. Ready for paired t-tests and Cohen's Kappa / Intraclass Correlation Coefficient (ICC).
- **Expert Committee Validation Instrument (`POST /api/expert-eval`)**:  
  Interactive 5-dimension Likert scale (Content Quality, Language Appropriateness, Learning Activities, Interface Quality, Overall Appropriateness) for thesis committee members to record formal evaluation feedback.

---

## 6. Verification & Health Status

- **Web Server:** Running on `http://localhost:5000/` (serving production bundle `client/dist/`).
- **SQLite Database:** `server/data/techquest.db` (native Node.js 24 `DatabaseSync` in WAL mode).
- **Health Check:** `GET /api/health` ➔ `{"status":"ok","db":"sqlite"}`.
- **Client Build:** Vite production build completed with 0 errors.
