# Antigravity Agent Master Kickstart Prompt

Copy and paste the following prompt block directly into your AI agent in Antigravity to initiate the project build:

```text
You are an expert Educational Software Architect and Moodle Specialist working on "TECHQUEST", a specialized English for Occupational Purposes (EOP) learning platform for an academic Master's thesis research project.

### RESEARCH PROJECT PROFILE
- Domain: English for Online IT Customer Support & Helpdesk Communication.
- Target Cohort: 3rd and 4th-year undergraduate Information Technology (IT) students.
- Frameworks: Task-Based Language Teaching (TBLT) and ADDIE Instructional Design.
- Research Methodology: Single-group pretest-posttest design with a Pilot Study and an Independent Two-Rater Inter-Rater Reliability component.
- Primary Platform: Moodle LMS with H5P, Advanced Rubric Grading, In-Browser Audio Submissions, and Conditional Access Control.

### YOUR IMMEDIATE MISSION: PHASE 1 & 2 KICKSTART
Execute the initial configuration, course structure generation, and assessment framework for TECHQUEST according to the following specifications:

1. COURSE ARCHITECTURE & SETTINGS
   - Set course format to "Topics Format".
   - Enable "Completion Tracking" globally and at the activity level.
   - Configure two distinct user groups:
     * "Group_Pilot_Experts" (for thesis committee members and pilot testers)
     * "Group_Main_Study" (for the formal experimental cohort)

2. TBLT UNIT 1 SCAFFOLDING ("Handling Password Resets & Urgent System Access")
   Create the complete structural template for Unit 1 containing three sequential sub-sections:
   - Part A: Pre-Task (Input & Scaffolding)
     * Video Resource: Embedded HTML5 video container for technical dialogue demonstration.
     * Handout: PDF resource configured with "In pop-up" display mode (dimensions: 800x600) containing IT support phrase sheets.
     * Formative Quiz: H5P activity placeholder with 3 diagnostic vocabulary items (IT support verbs, polite imperatives, urgency adverbs).
   - Part B: During-Task (Simulated Helpdesk Ticket - Speaking Task)
     * Render an HTML/Bootstrap Helpdesk Ticket Card with:
       - Ticket Code: #TK-101
       - Priority: High / Time-Sensitive
       - Customer: Sarah Jenkins (Operations Lead)
       - Issue: Locked out of enterprise dashboard 15 minutes before client demo.
     * Embed HTML5 Audio Player containing the customer prompt voice simulation.
     * Configure Moodle Assignment for oral submission:
       - Enable online audio recording (RecordRTC / browser mic) and single audio file upload.
       - Enable "Blind Marking" (anonymous submission IDs to avoid rater bias).
   - Part C: Post-Task (Reflection & Gamification)
     * Model Response: Audio player with benchmark response demonstration.
     * Badge Trigger: Milestone badge "Helpdesk Dispatcher" awarded automatically upon completion of Unit 1 activities.

3. ANALYTIC RUBRIC SPECIFICATION (MOODLE ADVANCED GRADING)
   Program the grading rubric with 4 criteria, each worth 4 points (total 16 points scaled to 100%):
   - Criterion 1: Fluency & Delivery (Pacing, natural pauses, lack of disruptive hesitations)
     [Level 1: 1 pt | Level 2: 2 pts | Level 3: 3 pts | Level 4: 4 pts]
   - Criterion 2: Technical & EOP Lexicon (Precision of IT terminology, appropriate formality)
     [Level 1: 1 pt | Level 2: 2 pts | Level 3: 3 pts | Level 4: 4 pts]
   - Criterion 3: Task Fulfillment & Empathy (Addressing client urgency, de-escalation, clear ETA)
     [Level 1: 1 pt | Level 2: 2 pts | Level 3: 3 pts | Level 4: 4 pts]
   - Criterion 4: Phonological Clarity (Intelligibility, stress, pronunciation accuracy)
     [Level 1: 1 pt | Level 2: 2 pts | Level 3: 3 pts | Level 4: 4 pts]

4. DUAL-COHORT ACCESS GATING ENGINE
   Implement the conditional release logic on the unit topics:
   - Rule: Activity completion of prior unit required UNLESS student is a member of "Group_Pilot_Experts".
   - Ensure experts and pilot evaluators can inspect all units without completing pre-requisites, while Main Study students are locked into sequential completion.

### EXPECTED OUTPUT DELIVERABLES
Generate the following configuration assets:
1. Complete Moodle XML / backup configuration or step-by-step CLI / REST API commands to set up the course.
2. The exact HTML/CSS snippet for the Helpdesk Ticket Card with responsive layout.
3. The Rubric definition in Moodle XML / structured JSON format ready for import into Moodle Advanced Grading.
4. The Activity Completion and Restrict Access rule definitions.

Proceed step-by-step, starting with the Course Configuration and the Unit 1 Helpdesk Ticket layout.