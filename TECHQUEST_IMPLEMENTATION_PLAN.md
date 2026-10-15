# TECHQUEST IMPLEMENTATION PLAN: MOODLE EOP PLATFORM
**Research Project:** Master's Thesis in English for Occupational Purposes (IT Technical Support)  
**Methodology:** Task-Based Language Teaching (TBLT) | Single-Group Pretest-Posttest Design

---

## Roadmap Overview

| Phase | Focus Area | Key Deliverable | Est. Duration |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation & System Setup | Moodle instance, groups, completion tracking, baseline theme | Week 1 |
| **Phase 2** | Pedagogical Template (TBLT) | Reusable Unit Template (Pre-task, During-task, Post-task) | Week 2 |
| **Phase 3** | Audio Assessment & Rubric | Helpdesk Ticket assignment, Audio Recorder, 4-criteria Rubric | Week 3 |
| **Phase 4** | Cohort Controls & Gamification | Pilot bypass rules, Main study sequential lock, Badges | Week 4 |
| **Phase 5** | Pilot Testing & Two-Rater Check | Expert review, Pilot run, SPSS Inter-Rater Reliability export | Week 5–6 |
| **Phase 6** | Main Study Execution & Backup | Full cohort run, weekly data snapshots, thesis dataset export | Week 7–9 |

---

## Phase Breakdown

### Phase 1: Infrastructure & Course Skeleton
* **Objective:** Establish the Moodle environment, user management, and global course settings.
* **Tasks:**
  1. Initialize Moodle instance with clean, modern, responsive theme (e.g., Boost child theme).
  2. Create course shell: `TECHQUEST: English for IT Technical Support`.
  3. Set course format to **Topics Format**.
  4. Enable global **Completion Tracking** (`Show activity completion conditions: Yes`).
  5. Configure user groups:
     * `Group_Pilot_Experts` (Committee members and pilot students)
     * `Group_Main_Study` (3rd and 4th-year IT research cohort)
* **Definition of Done (DoD):** Course shell accessible; groups functional; completion engine tracking user activity.

---

### Phase 2: Pedagogical Scaffolding & Media Components (TBLT Cycle)
* **Objective:** Construct the reusable 3-stage Task-Based Language Teaching template for each unit.
* **Tasks:**
  1. **Pre-Task Setup:**
     * Embed responsive HTML5 video streaming player for lesson inputs.
     * Configure `File` resources with **"In pop-up"** settings (Dimensions: 800x600) for PDF cheatsheets and technical glossaries.
     * Build formative H5P checks (Drag-and-Drop IT Vocabulary, Dialogue Cards).
  2. **During-Task Setup:**
     * Design standardized Bootstrap/HTML card for simulated IT Support Tickets.
     * Embed customer audio prompt player with playback controls.
  3. **Post-Task Setup:**
     * Provide model audio response block for self-evaluation.
     * Set up automated badge triggers on unit completion.
* **Definition of Done (DoD):** Unit 1 prototype complete with video, popup PDF, H5P quiz, and scenario card.

---

### Phase 3: Speaking Assessment Pipeline & Two-Rater Rubric
* **Objective:** Deploy audio response submission and the independent dual-rater evaluation system.
* **Tasks:**
  1. Configure Moodle **Assignment** for speaking responses:
     * Submission types: Audio recording enabled (RecordRTC) or direct file upload (`.mp3`, `.m4a`, `.wav`, `.webm`).
     * Maximum file size: 20MB.
     * Maximum recordings/files: 1 per ticket.
  2. Build the **Analytic Rubric** in Moodle Advanced Grading:
     * Criteria 1: *Fluency & Delivery* (4 levels, 25%)
     * Criteria 2: *Technical & EOP Lexicon* (4 levels, 25%)
     * Criteria 3: *Task Fulfillment & Empathy* (4 levels, 25%)
     * Criteria 4: *Phonological Clarity* (4 levels, 25%)
  3. Configure Two-Rater Architecture:
     * Create dual grading instances (`Ticket 1 - Rater A` and `Ticket 1 - Rater B`).
     * Enable **Blind Marking** (`anonymous submissions: Yes`) to eliminate rater bias.
  4. Test CSV/Excel export format for statistical analysis in SPSS (Cohen's Kappa / ICC).
* **Definition of Done (DoD):** Student records audio in browser; Raters grade via 4-criteria rubric independently; exported CSV produces clean pairs of scores.

---

### Phase 4: Gating Architecture & Gamification
* **Objective:** Implement conditional progression rules and motivation mechanisms.
* **Tasks:**
  1. Configure **Restrict Access** engine:
     * Main Study condition: Activity completion of prior unit required.
     * Expert bypass condition: Add rule `OR Group = Group_Pilot_Experts`.
  2. Implement **Moodle Badges** (Open Badges standard):
     * Badge 1: *Level 1 Helpdesk Novice* (Trigger: Unit 1 Completion)
     * Badge 2: *Level 2 Support Specialist* (Trigger: Unit 2–3 Completion)
     * Badge 3: *Level 3 IT Quest Master* (Trigger: Final Ticket Submission)
  3. Add **Completion Progress Block** to course drawer for personal visual tracking.
* **Definition of Done (DoD):** Pilot accounts can click any unit freely; Main Study accounts see locked units until prerequisites are satisfied; badges award automatically.

---

### Phase 5: Pilot Study, Reliability Verification & Content Revision
* **Objective:** Run pilot group, conduct expert validation, and compute Inter-Rater Reliability.
* **Tasks:**
  1. Enroll expert evaluation committee and pilot participants.
  2. Collect pilot audio submissions.
  3. Have Rater 1 (Researcher) and Rater 2 (Expert) grade submissions independently.
  4. Export gradebook to SPSS; run:
     * **Cohen's Kappa** or **Intraclass Correlation Coefficient (ICC)** across the 4 rubric criteria.
     * Identify discrepancies exceeding 20% for consensus meetings.
  5. Implement revisions suggested by committee directly in Moodle activity descriptions and H5P modules (zero core code modifications).
* **Definition of Done (DoD):** ICC score verified (> 0.75 acceptable, > 0.85 optimal); committee feedback incorporated; pilot database snapshot archived.

---

### Phase 6: Main Study Deployment & Final Data Archival
* **Objective:** Execute the formal research study and secure research data for thesis defense.
* **Tasks:**
  1. Reset student activity data (clean pilot records while preserving structure).
  2. Enroll 3rd and 4th-year IT participants into `Group_Main_Study`.
  3. Monitor real-time progress via Moodle Completion Reports.
  4. Post-intervention: Export complete dataset (pre-test, weekly ticket submissions, post-test, completion logs, timestamps) to encrypted `.csv` and `.xlsx`.
  5. Generate full platform backup archive (`.mbz` file) and database dump (`.sql`) stored in secondary cloud storage.
* **Definition of Done (DoD):** Clean experimental dataset ready for Chapter 4 data analysis; complete Moodle backup secured.