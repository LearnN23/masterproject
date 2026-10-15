# PROJECT SPECIFICATION: TECHQUEST LMS (MOODLE)

**Platform for English for Occupational Purposes (EOP) – IT Technical Support Communication**

*Master’s Thesis Research Project | Single-Group Pretest-Posttest Design*

---

## 1. Project Overview & Research Context

* **Project Title:** TECHQUEST EOP Learning Platform
* **Target Audience:** 3rd and 4th-year undergraduate Information Technology (IT) students.
* **Context/Domain:** English for Occupational Purposes (EOP) focusing on Online IT Technical Support and Customer Helpdesk Communication.
* **Instructional Framework:** Task-Based Language Teaching (TBLT) & ADDIE Model.
* **Research Methodology:**
* Single-group pretest-posttest experimental design.
* Pilot study phase (featuring Expert Evaluation & Two-Rater Inter-Rater Reliability verification).
* Main study phase (formal implementation and data collection).


* **Primary Implementation Vehicle:** **Moodle LMS** (Open-Source), customized with H5P, advanced grading rubrics, audio submission workflows, and cohort-based progression rules.

---

## 2. Pedagogical Architecture (TBLT Cycle in Moodle)

Each unit in the course follows a three-stage TBLT sequence structured directly into Moodle sections:

```
[ Unit / Lesson ]
   ├── 1. Pre-Task Phase (Scaffolding & Input)
   │     ├── Video Demonstration (Embedded streaming)
   │     ├── Knowledge/Vocabulary Cheatsheet (PDF Pop-up & Download)
   │     └── Formative Interactive Quiz (H5P: Matching / Multiple Choice)
   ├── 2. During-Task Phase (Simulated IT Support Ticket)
   │     ├── Ticket Scenario Card (Priority, Client, Problem Details)
   │     ├── Customer Audio Prompt (Audio playback simulating angry/confused client)
   │     └── Oral Response Task (Moodle Assignment with in-browser audio recording)
   └── 3. Post-Task Phase (Feedback & Gamification)
         ├── Model Response (Self-benchmark audio sample)
         └── Milestone Badge Trigger (Anonymous progress achievement)

```

---

## 3. Core Feature Requirements & Technical Implementation in Moodle

### 3.1 Content Delivery & Media Handling

* **Video Content:** Embedded video streaming (responsive HTML5 or unlisted streaming embeds) to minimize server load.
* **Course Reading & PDF Cheatsheets:**
* Configure Moodle `File` resources with **"In pop-up"** or **"Embed"** display options for instant reading without leaving the lesson flow.
* Explicit download links provided for offline review.


* **Interactive Quizzes:**
* Native **H5P integration (Interactive Content)** within Moodle.
* Question types: Drag-and-drop vocabulary, interactive video checkpoints, and multi-choice diagnostic quizzes.



### 3.2 Customer Ticket Practice (Speaking Assessment)

* **Context Presentation:** Standardized Helpdesk Card formatted in HTML/Bootstrap within Moodle:
* `Ticket ID` (e.g., `#TK-101`)
* `Severity Level` (Low / Medium / Critical)
* `Issue Category` (Network, Software, Hardware, Authentication)
* `Customer Prompt` (Embedded audio player containing the simulated client voice message)


* **Audio Recording & Storage:**
* Utilizes Moodle’s native **Assignment activity** configured for online audio recording (Atto / TinyMCE RecordRTC audio button or audio file submission).
* Audio files (.mp3 / .ogg / .webm) permanently stored on the Moodle file system/database to ensure long-term retention through thesis defense.



---

## 4. Assessment, Analytic Rubrics & Two-Rater Reliability

### 4.1 Analytic Rubric Setup (Moodle Advanced Grading)

Configure Moodle's **Rubric Grading Method** across 4 evaluation criteria:

| Criterion | Level 1 (Novice) | Level 2 (Developing) | Level 3 (Competent) | Level 4 (Proficient) | Weight |
| --- | --- | --- | --- | --- | --- |
| **1. Fluency & Delivery** | Hesitant, frequent pauses, halting rhythm | Minor hesitation, generally steady | Smooth rhythm, minor self-corrections | Fluent, professional tempo, natural pauses | 25% |
| **2. Technical & EOP Lexicon** | Inaccurate or non-standard IT phrasing | Basic technical terms with minor misuse | Accurate helpdesk terminology | Precise diagnostic vocabulary & professional tone | 25% |
| **3. Task Fulfillment & Empathy** | Fails to address ticket; lacks empathy | Partially addresses issue; weak customer care | Resolves issue; shows standard professional empathy | De-escalates frustration; clear action plan/ETA | 25% |
| **4. Phonological Clarity** | Pronunciation impedes comprehension | Intelligible with notable L1 interference | Clear pronunciation; minor stress errors | Crisp, highly intelligible; professional cadence | 25% |

### 4.2 Independent Two-Rater Workflow (Inter-Rater Reliability)

To calculate **Cohen’s Kappa** or **Intraclass Correlation Coefficients (ICC)** without evaluation bias:

1. **Blind Marking:** Enable `Blind marking` (`anonymous submissions`) in Assignment Settings to mask student names with randomized Participant IDs.
2. **Dual Grading Setup:**
* **Approach:** Create two linked assessment columns or configure separate grading assignment instances:
* `Ticket Task 1 - Rater A (Researcher)`
* `Ticket Task 1 - Rater B (Expert Evaluator)`


* Rater B accesses the submissions independently without visibility of Rater A’s scores.


3. **Statistical Data Export:**
* Export the gradebook directly to `.xlsx` / `.csv`.
* Columns include: `Participant_ID`, `Rater1_Scores (by criteria)`, `Rater2_Scores (by criteria)`, `Difference_Flag`.
* Formatted for direct import into SPSS / Jamovi.



---

## 5. Gamification, Progress Tracking & Anonymous Social Proof

* **Student Personal Tracker:**
* **Activity Completion:** Checkboxes and automated completion conditions (e.g., *Student must view activity*, *Student must receive a grade*).
* **Completion Progress Block:** Visual horizontal progress bar displayed on the course sidebar.


* **Anonymous Peer Progress:**
* To avoid peer anxiety while maintaining collective motivation, implement **Moodle Badges**:
* 🥉 *Level 1: Dispatcher Badge* (Completion of Unit 1)
* 🥈 *Level 2: Troubleshooter Badge* (Completion of Unit 2-3)
* 🥇 *Level 3: IT Quest Specialist* (Completion of Final Tickets)


* Class progress is presented anonymously via collective completion metrics rather than public score leaderboards.


* **Researcher / Teacher Dashboard:**
* Access to Moodle **Activity Completion Reports** and **Gradebook Overview**.
* Real-time monitoring of which students have submitted audio tasks versus pending submissions.



---

## 6. Research Deployment Controls (Pilot Study vs. Main Study)

To allow the expert committee and pilot group to inspect all modules freely without breaking the sequential lock required for the main study:

### 6.1 Cohort & Group Configuration

Create two distinct Moodle Groups:

1. `Group_Pilot_Experts` (Pilot students + Evaluation Committee)
2. `Group_Main_Study` (Experimental research cohort)

### 6.2 Access Restrictions (`Restrict Access` Engine)

Set conditional rules on each lesson topic:

* **For Main Study:** Restrict access based on completion of preceding activities (*Must complete Unit N before Unit N+1 unlocks*).
* **For Pilot & Experts:** Add an `OR` bypass condition:
* `Student must complete Previous Activity` **OR** `Student belongs to Group: Group_Pilot_Experts`.


* **Benefit:** Evaluators can inspect any lesson, video, PDF, or ticket immediately. When transitioning to the Main Study, no code changes are required—simply enroll research participants into `Group_Main_Study`.

### 6.3 Data Archival & Isolation

* Keep a clear separation of submission phases via assignment tags: `Phase: Pilot` vs. `Phase: Main`.
* Full platform backup snapshot (`.mbz` file) taken after Pilot testing and before Main Study commencement.

---

## 7. AI Agent Execution Roadmap (Antigravity Kickstart Steps)

This roadmap guides the AI agent in configuring and structuring the Moodle platform:

* [ ] **Step 1: Course Shell Creation**
* Set Course Format to **Topics Format**.
* Enable **Completion Tracking** at the course level (`Show activity completion conditions: Yes`).


* [ ] **Step 2: Groups & Cohorts Setup**
* Create groups: `Group_Pilot_Experts` and `Group_Main_Study`.
* Configure access restriction rules supporting instant bypass for the expert group.


* [ ] **Step 3: Speaking Assessment Template (Ticket Activity)**
* Add an `Assignment` activity.
* Set **Submission Types:** Audio recording enabled / Online text disabled.
* Set **Grading:** Grading method = `Rubric`.
* Input the 4-criteria Analytic Rubric with score descriptions.
* Enable **Blind Marking**.


* [ ] **Step 4: Media & Interactive Integration**
* Set up an **H5P Content Bank** instance for interactive pre-task quizzes.
* Configure PDF resource settings to open in modal/pop-up (`Display: In pop-up`).


* [ ] **Step 5: Gamification & Badges Engine**
* Configure course badges tied to specific Activity Completion criteria.
* Add the **Completion Progress Block** to the course dashboard.


* [ ] **Step 6: Data Export Verification**
* Verify that the Moodle Gradebook exports all custom rubric sub-scores and timestamps into a clean `.csv` layout suitable for SPSS.ASSM