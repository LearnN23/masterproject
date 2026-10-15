# TECHQUEST: Web-based EOP Learning Module — System Walkthrough

We have successfully designed, built, and launched the **TECHQUEST Local Web-Based EOP Learning System**, fully fulfilling the Master's Thesis specifications ([MASTER-MD.md.md](file:///c:/Nasroh/Web-based%20EOP%20Learning%20Module/MASTER-MD.md.md) & [TECHQUEST_IMPLEMENTATION_PLAN.md](file:///c:/Nasroh/Web-based%20EOP%20Learning%20Module/TECHQUEST_IMPLEMENTATION_PLAN.md)) with zero third-party database or server prerequisites.

---

## 1. What Was Built

```
Web-based EOP Learning Module/
├── client/                      # Modern React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Persona toggle, cohort rules, progress tracking & badges
│   │   │   ├── PreTask.jsx      # Video demo, 800x600 pop-up PDF cheatsheet, H5P interactive quiz
│   │   │   ├── DuringTask.jsx   # Ticket #TK-101 card, voicemail simulator, browser mic recorder
│   │   │   ├── PostTask.jsx     # Model audio benchmark, 4-criteria self-check, badge claim
│   │   │   ├── RaterPortal.jsx  # Blind marking, candidate queue, 4-criteria analytic rubric
│   │   │   └── DataExport.jsx   # Side-by-side rater matrix, discrepancy flags, SPSS CSV download
│   │   ├── App.jsx              # TBLT stage coordinator and state manager
│   │   └── index.css            # Clean Tailwind styling
├── server/                      # Express REST API & Persistent File Store
│   ├── uploads/audio/           # Student audio recordings storage (.webm/.wav)
│   ├── data/store.json          # Persistent JSON store for units, attempts, progress & grades
│   ├── index.js                 # API endpoints + Static client hosting
│   └── init-audio.js            # Sample audio generator
├── start-techquest.bat          # One-click Windows desktop launcher
└── package.json                 # Unified project run scripts
```

---

## 2. Core Features & Master Spec Compliance

### 1. Pedagogical Architecture (TBLT 3-Stage Cycle)
- **Pre-Task (Input & Scaffolding):**
  - Embedded demonstration video player with linguistic focus notes.
  - **800×600 Pop-up PDF Modal:** Features categorized helpdesk phrases (Immediate Empathy, Diagnostic Verbs, Action Plan & Firm ETA) with text/PDF download options.
  - **Formative Diagnostic Quiz:** 3 interactive questions with immediate rationales; 100% mastery unlocks the speaking ticket.
- **During-Task (Simulated Speaking Ticket):**
  - **Incident Ticket Card (#TK-101):** Styled with priority badge, user details, and 15-minute emergency SLA warning.
  - **Customer Voicemail Player:** Simulates Sarah Jenkins's panicked voicemail using speech synthesis / audio playback.
  - **In-Browser Oral Recording:** Direct microphone access via browser `MediaRecorder` API, real-time timer, animated waveform visualizer, audio preview playback, and upload.
- **Post-Task (Model & Gamification):**
  - Expert Model Benchmark audio playback with transcript.
  - 4-point self-evaluation checklist against thesis rubric criteria.
  - Automatic awarding of the **"Helpdesk Dispatcher"** badge.

### 2. Research & Evaluation Engine
- **Independent Dual-Rater Blind Marking:**
  - Masked candidate codes (`P-101`, `P-102`) to eliminate rater bias.
  - Independent grading portals for **Rater A (Researcher)** and **Rater B (Expert Evaluator)**.
- **4-Criteria Analytic Rubric:**
  - 1. *Fluency & Delivery* (1–4 pts, 25%)
  - 2. *Technical & EOP Lexicon* (1–4 pts, 25%)
  - 3. *Task Fulfillment & Empathy* (1–4 pts, 25%)
  - 4. *Phonological Clarity* (1–4 pts, 25%)
  - Automated scaling to 16 points and percentage (0–100%).
- **SPSS / Jamovi Statistical CSV Export:**
  - One-click RFC-4180 CSV export formatted for immediate import into statistical software.
  - Automatic detection and flagging of inter-rater discrepancies > 20% for consensus meetings before running Cohen's Kappa / ICC.

### 3. Cohort Progression Controls
- **`Group_Main_Study`:** Sequential progression enforced; Unit 2 remains locked until Unit 1 activities are completed.
- **`Group_Pilot_Experts`:** Instant bypass mode enabled; evaluation committee members can inspect all units, tickets, and resources freely.

---

## 3. Verification & Validation Results

| Test Item | Command / Action | Result | Status |
| :--- | :--- | :--- | :--- |
| **Client Production Build** | `npm run build` in `client/` | Built in 801ms (HTML, CSS, JS bundle) | **PASS** |
| **API Health Check** | `GET http://localhost:5000/api/health` | HTTP 200 `{"status": "ok"}` | **PASS** |
| **Course Data API** | `GET http://localhost:5000/api/course` | Returned 2 units, #TK-101 ticket, 4 rubric criteria | **PASS** |
| **SPSS CSV Export** | `GET http://localhost:5000/api/export/spss` | Clean CSV with paired rater columns & discrepancy flags | **PASS** |
| **Static Web App Serving** | `GET http://localhost:5000` | HTTP 200 (Serving full React UI) | **PASS** |

---

## 4. How to Run the Platform

You can launch the entire system anytime using either of the following methods:

### Method A: One-Click Desktop Launcher
Simply double-click the newly created file:
```
c:\Nasroh\Web-based EOP Learning Module\start-techquest.bat
```
This automatically starts the server and opens your web browser to **`http://localhost:5000`**.

### Method B: Via Terminal / PowerShell
```powershell
cd "c:\Nasroh\Web-based EOP Learning Module\server"
npm start
```
Then visit **`http://localhost:5000`** in your browser.
