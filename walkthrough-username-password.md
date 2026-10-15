# TECHQUEST EOP Platform: Multi-Persona Dashboards & User Architecture

## Overview
We have built and verified dedicated dashboards, user provisioning, and presentation slide architectures for the TECHQUEST English for Occupational Purposes (EOP) platform, strictly aligned with the Master's thesis methodology.

---

## 1. Pre-Ready User Roster & Credentials (30 Accounts)

The database has been seeded with 30 distinct pre-ready accounts covering all experimental roles. An authoritative CSV spreadsheet has been generated at `techquest_users_credentials.csv` (and in `server/data/techquest_users_credentials.csv`), and is also directly downloadable from the Administrator Dashboard via `/api/export/credentials`.

### Roster Summary Table

| Category | Count | Usernames | Participant Codes | Default Password | Primary Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Students** | 20 | `student01` .. `student20` | `STU-1001` .. `STU-1020` | `Student@2026#01` .. `#20` | Experimental cohort (`Group_Main_Study`). Sequential progression: Consent ➔ Pre-test ➔ Lessons 1–8 ➔ Post-test. Receives authoritative Instructor scores only. |
| **Instructors** | 4 | `instructor01` .. `instructor04` | `INST-01` .. `INST-04` | `Instructor@2026#1` .. `#4` | Lead evaluators (`Group_Staff`). 25-point analytic rubric scoring delivered directly to students, audio feedback, calibration oversight. |
| **Raters** | 4 | `rater01` .. `rater04` | `RATER-01` .. `RATER-04` | `Rater@2026#1` .. `#4` | Blind evaluators (`Group_Evaluators`). Independent rubric evaluations during the pilot/testing calibration phase for inter-rater reliability (ICC). |
| **Administrators** | 2 | `admin01`, `admin02` | `ADMIN-01`, `ADMIN-02` | `Admin@2026#1`, `Admin@2026#2` | System administration (`Group_Staff`). User management, SQLite engine telemetry, 1-click credentials CSV download, and SPSS export. |
| **Expert Committee** | 1 | `expert` | `EXPERT-01` | `Expert@2026#1` | Thesis committee (`Group_Pilot_Experts`). 1-click role switcher (Student/Instructor/Rater/Admin) and thesis validation instrument. |
| **QA Tester** | 1 | `tester` | `TEST-001` | `Tester@2026#1` | Pilot group (`Group_Pilot`). Zero-lockout bypass for end-to-end curriculum QA testing. |

---

## 2. Lesson Slides Placeholder Architecture (Lessons 1–8)

A dedicated presentation slide architecture has been designed and wired across all 8 lessons.

### Folder Structure
Slide assets are stored in the client public directory so they can be dropped in at any time without code changes:
```
client/public/slides/
├── lesson1/    (Lesson 1: Responding to Customer Enquiries)
├── lesson2/    (Lesson 2: Identifying & Clarifying Technical Problems)
├── lesson3/    (Lesson 3: Explaining Troubleshooting Procedures)
├── lesson4/    (Lesson 4: Handling Customer Complaints & Empathy)
├── lesson5/    (Lesson 5: Providing Clear Step-by-Step Instructions)
├── lesson6/    (Lesson 6: Escalating Unresolved Cases & SLAs)
├── lesson7/    (Lesson 7: CRM Ticket Hygiene & Documentation)
├── lesson8/    (Lesson 8: Support Shift Handover & Case Summaries)
└── README.md
```

### Supported Slide Ingestion Options
1. **Option A — High-Res Slide Images (Recommended):**
   - Place exported PNG or JPG images inside each folder named: `slide_1.png`, `slide_2.png`, `slide_3.png`, `slide_4.png`, `slide_5.png`.
   - The viewer automatically displays them in a 16:9 widescreen canvas with thumbnail chips and keyboard navigation.
2. **Option B — Standalone PDF Presentation:**
   - Drop a `slides.pdf` or `presentation.pdf` into the lesson folder.
   - The viewer provides an immediate "Download Official Slide Deck (PDF)" action bar for students and instructors.
3. **Option C — Automatic Pedagogical Fallback (Zero Broken Images):**
   - If custom slide files have not yet been provided by the instructor, the viewer dynamically generates 5 curriculum slides synthesized from `LESSONS_DATA`:
     - **Slide 1:** Module Title, Corporate Scenario & Helpdesk Context
     - **Slide 2:** Core Learning Objectives & Technical Competencies
     - **Slide 3:** Target Language Functions, Sentence Formulas & Contrast Analysis
     - **Slide 4:** Authentic Model Dialogue & Helpdesk Agent Speech Acts
     - **Slide 5:** 25-Point Analytic Rubric Expectations & Spoken Task Briefing

### Viewer Features
- **Widescreen 16:9 Canvas:** Professional dark-slate presentation viewport.
- **Keyboard Navigation:** Left and Right arrow keys cycle slides.
- **Presenter Mode:** Fullscreen button (`Maximize2` / `Minimize2`) expands the slide deck to fullscreen for classroom lectures or committee demonstrations.
- **Direct Express Static Route:** `/slides` is served directly by the backend Express server, allowing new slide images dropped into `client/public/slides` to become instantly visible without rebuilding Vite.

---

## 3. Lesson Progression Integration

In `InteractiveLessonView.jsx`, `slides` is seamlessly integrated into the student progression flow:
1. **Step 1: Situation** — Workplace context, role scenario, objectives. (Action: *View Lesson Slides*)
2. **Step 2: Slides** — High-resolution widescreen slide deck viewer with presenter mode and PDF download. (Action: *Continue to Language Focus*)
3. **Step 3: Learn** — Target vocabulary, grammar rules, workplace contrast analysis, and model dialogues. (Action: *Go to Practice*)
4. **Step 4: Practice** — Formative interactive questions with immediate diagnostic feedback. (Action: *Proceed to Review*)
5. **Step 5: Review** — Summative ticket review quiz with scoring. (Action: *Enter Audio Simulation*)
6. **Step 6: Speaking** — Single-take audio recording for helpdesk ticket resolution. (Action: *Complete & Submit*)
7. **Step 7: Results** — Milestone celebration, score recap, and progression to next lesson.

---

## 4. Verification & Testing
- **Backend Service:** Running on `http://localhost:5000` via Node.js native `DatabaseSync` SQLite WAL engine.
- **Credentials CSV Endpoint:** Tested `GET /api/export/credentials` ➔ Returned `HTTP 200 OK`, `Content-Type: text/csv`, 6331 bytes.
- **Slide Static Route:** Tested `GET /slides/README.md` ➔ Returned `HTTP 200 OK`, `Content-Type: text/markdown`.
- **Roster Verification:** Tested `GET /api/users` ➔ Verified all 30 student, instructor, rater, admin, expert, and tester accounts.
- **Client Build:** Vite compiled cleanly with zero errors.
