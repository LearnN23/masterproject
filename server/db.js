// ============================================================================
// TECHQUEST SQLite Database Engine & Data Access Layer
// Uses Node.js 24 native `node:sqlite` (DatabaseSync)
// ============================================================================

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'techquest.db');
const db = new DatabaseSync(DB_PATH);

// Enable foreign key enforcement and WAL mode for high performance
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize Tables Schema
function initSchema() {
  db.exec(`
    -- 1. Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL DEFAULT 'password123',
      name TEXT NOT NULL,
      participant_code TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'instructor', 'rater', 'expert', 'admin', 'tester', 'rater_1', 'rater_2')),
      cohort_group TEXT NOT NULL CHECK(cohort_group IN ('Group_Main_Study', 'Group_Pilot', 'Group_Pilot_Experts', 'Group_Evaluators', 'Group_Staff')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 2. Research Ethics Consent
    CREATE TABLE IF NOT EXISTS research_consent (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      consent_status INTEGER NOT NULL DEFAULT 0,
      consent_version TEXT NOT NULL DEFAULT 'v1.0',
      agreed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id)
    );

    -- 3. Lessons Curriculum Table
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      unit_number INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      communication_skill TEXT,
      language_focus TEXT,
      category TEXT NOT NULL CHECK(category IN ('pre_test', 'lesson', 'post_test')),
      is_published INTEGER NOT NULL DEFAULT 1
    );

    -- 4. Student Progress Table (Sequential Locking & Pacing)
    CREATE TABLE IF NOT EXISTS student_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      unit_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'locked' CHECK(status IN ('locked', 'not_started', 'in_progress', 'completed')),
      current_sub_section TEXT DEFAULT 'situation',
      sections_completed TEXT DEFAULT '{"situation":false,"learn":false,"practice":false,"review":false,"speaking":false}',
      review_score INTEGER DEFAULT NULL,
      best_review_score INTEGER DEFAULT NULL,
      completed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, unit_id)
    );

    -- 5. Submissions Table (Oral Voice Recordings)
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      unit_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      assessment_type TEXT NOT NULL CHECK(assessment_type IN ('pre_test', 'post_test', 'formative_speaking')),
      audio_file_path TEXT,
      audio_url TEXT,
      duration_seconds INTEGER DEFAULT 0,
      blind_mask_code TEXT NOT NULL,
      self_assessment TEXT DEFAULT '{}',
      submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 6. Dual-Rater 25-Point Evaluations Table
    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      rater_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rater_role TEXT NOT NULL CHECK(rater_role IN ('instructor', 'rater', 'rater_1', 'rater_2')),
      task_achievement INTEGER NOT NULL CHECK (task_achievement BETWEEN 1 AND 5),
      interactive_comm INTEGER NOT NULL CHECK (interactive_comm BETWEEN 1 AND 5),
      vocabulary INTEGER NOT NULL CHECK (vocabulary BETWEEN 1 AND 5),
      grammar INTEGER NOT NULL CHECK (grammar BETWEEN 1 AND 5),
      pronunciation_fluency INTEGER NOT NULL CHECK (pronunciation_fluency BETWEEN 1 AND 5),
      total_score INTEGER NOT NULL CHECK (total_score BETWEEN 5 AND 25),
      total_percentage REAL NOT NULL,
      strengths TEXT,
      areas_for_improvement TEXT,
      suggestions TEXT,
      graded_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(submission_id, rater_id)
    );

    -- 7. Expert Committee Evaluation Table (Thesis Validation Instrument)
    CREATE TABLE IF NOT EXISTS expert_evaluations (
      id TEXT PRIMARY KEY,
      expert_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content_quality INTEGER NOT NULL CHECK (content_quality BETWEEN 1 AND 5),
      language_appropriateness INTEGER NOT NULL CHECK (language_appropriateness BETWEEN 1 AND 5),
      learning_activities INTEGER NOT NULL CHECK (learning_activities BETWEEN 1 AND 5),
      interface_quality INTEGER NOT NULL CHECK (interface_quality BETWEEN 1 AND 5),
      overall_appropriateness INTEGER NOT NULL CHECK (overall_appropriateness BETWEEN 1 AND 5),
      comments TEXT,
      evaluated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 8. Badges Table (Gamification)
    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      badge_key TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      awarded_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_key)
    );
  `);

  // Safe migrations for dual-rater calibration tracking & 20-point task scoring
  try {
    db.exec(`ALTER TABLE evaluations ADD COLUMN is_calibrated INTEGER DEFAULT 0;`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE evaluations ADD COLUMN calibration_notes TEXT;`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE evaluations ADD COLUMN task_scores TEXT;`);
  } catch (e) {}
}

// Seed Core Lessons & Standard Users
function seedData() {
  // Check if lessons are seeded
  const lessonCount = db.prepare('SELECT COUNT(*) as count FROM lessons').get().count;
  if (lessonCount === 0) {
    const insertLesson = db.prepare(`
      INSERT INTO lessons (id, unit_number, title, communication_skill, language_focus, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const standardLessons = [
      ['section_0', 0, 'Pre-test: Diagnostic Spoken Assessment', 'Formal Spoken Diagnostics', 'Baseline oral support communication', 'pre_test'],
      ['lesson_1', 1, 'Responding to Customer Enquiries', 'Customer enquiry handling', 'Greetings, offering help, empathy, modal verbs', 'lesson'],
      ['lesson_2', 2, 'Identifying and Clarifying Technical Problems', 'Problem clarification', 'Diagnostic clarifying questions, open vs closed inquiries', 'lesson'],
      ['lesson_3', 3, 'Explaining Troubleshooting Procedures', 'Step-by-step instructions', 'Sequencing connectors (first, next, then, finally)', 'lesson'],
      ['lesson_4', 4, 'Handling Customer Complaints', 'De-escalation & empathy', 'Apologizing professionally, acknowledging frustration', 'lesson'],
      ['lesson_5', 5, 'Providing Clear Instructions', 'Technical direction', 'Imperatives, checking client understanding', 'lesson'],
      ['lesson_6', 6, 'Escalating Unresolved Issues', 'Professional escalation', 'Handover protocol, managing expectations, setting realistic ETAs', 'lesson'],
      ['lesson_7', 7, 'Support Tickets and Technical Documentation', 'CRM & Ticket documentation', 'Concise incident logs, technical vocabulary', 'lesson'],
      ['lesson_8', 8, 'Complete Online Customer Support Interaction', 'Integrated simulation', 'Full lifecycle call/chat handling', 'lesson'],
      ['section_9', 9, 'Post-test: Outcome Spoken Assessment', 'Formal Research Outcome Evaluation', 'Mastery oral support communication', 'post_test']
    ];

    for (const l of standardLessons) {
      insertLesson.run(...l);
    }
    console.log('[DB] Seeded 10 instructional units into SQLite.');
  }

  // Check if initial users exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, password_hash, name, participant_code, role, cohort_group)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const initialUsers = [
      // 1. Experimental Student (Main Study - Strict sequential lock)
      ['usr_student_nadia', 'student', 'pass123', 'Nadia Hassan', 'STU-1024', 'student', 'Group_Main_Study'],
      ['usr_student_kittipong', 'student2', 'pass123', 'Kittipong Srikul', 'STU-1025', 'student', 'Group_Main_Study'],
      
      // 2. Functional QA Tester (Bypass all locks)
      ['usr_tester_qa', 'tester', 'pass123', 'Functional QA Tester', 'TEST-001', 'tester', 'Group_Pilot'],
      
      // 3. Expert / Thesis Committee Member (Full bypass, role switching, expert form)
      ['usr_expert_prof', 'expert', 'pass123', 'Prof. Evaluation Committee', 'EXPERT-01', 'expert', 'Group_Pilot_Experts'],
      
      // 4. Primary Researcher / Rater 1 (Independent grading)
      ['usr_rater_1', 'rater1', 'pass123', 'Dr. Researcher (Rater 1)', 'RATER-1', 'rater_1', 'Group_Evaluators'],
      
      // 5. Expert Evaluator / Rater 2 (Blind grading for inter-rater reliability)
      ['usr_rater_2', 'rater2', 'pass123', 'Dr. External Expert (Rater 2)', 'RATER-2', 'rater_2', 'Group_Evaluators'],
      
      // 6. Lead Administrator
      ['usr_admin', 'admin', 'admin123', 'TECHQUEST Lead Admin', 'ADMIN-01', 'admin', 'Group_Staff']
    ];

    for (const u of initialUsers) {
      insertUser.run(...u);
    }
    console.log('[DB] Seeded 6 core research users into SQLite.');

    // Seed sample submissions & grades for demonstration
    seedDemoSubmissions();
  }
}

function seedDemoSubmissions() {
  const insertSub = db.prepare(`
    INSERT INTO submissions (id, user_id, unit_id, assessment_type, audio_file_path, audio_url, duration_seconds, blind_mask_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEval = db.prepare(`
    INSERT INTO evaluations (
      id, submission_id, rater_id, rater_role,
      task_achievement, interactive_comm, vocabulary, grammar, pronunciation_fluency,
      total_score, total_percentage, strengths, areas_for_improvement, suggestions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Sample submission 1: Pre-test for student Nadia
  const sub1Id = 'sub_pretest_nadia';
  insertSub.run(
    sub1Id,
    'usr_student_nadia',
    'section_0',
    'pre_test',
    'demo_nadia_pretest.webm',
    '/uploads/audio/demo_nadia_pretest.webm',
    18,
    'BLIND-101'
  );

  // Rater 1 grade for sub 1
  insertEval.run(
    'eval_sub1_r1',
    sub1Id,
    'usr_rater_1',
    'rater_1',
    3, 3, 3, 3, 2, // 14 / 25 (56%)
    14,
    56.0,
    'Appropriate opening greeting and willingness to help.',
    'Needs wider range of technical vocabulary and stronger modal verb usage.',
    'Practice diagnostic questions using "could you please".'
  );

  // Rater 2 grade for sub 1 (independent)
  insertEval.run(
    'eval_sub1_r2',
    sub1Id,
    'usr_rater_2',
    'rater_2',
    3, 3, 3, 2, 3, // 14 / 25 (56%)
    14,
    56.0,
    'Polite tone and audible pronunciation.',
    'Grammar structures when offering solutions could be smoother.',
    'Focus on transition connectors.'
  );

  console.log('[DB] Seeded sample submissions & dual-rater evaluations into SQLite.');
}

// Execute on load
initSchema();
seedData();

// ============================================================================
// DATA ACCESS LAYER (DAL) METHODS
// ============================================================================

const DAL = {
  // --- USERS & AUTH ---
  getUserById(id) {
    return db.prepare('SELECT id, username, name, participant_code, role, cohort_group, created_at FROM users WHERE id = ?').get(id);
  },

  getUserByUsername(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim();
    return db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(participant_code) = LOWER(?)').get(clean, clean);
  },

  getUserByParticipantCode(code) {
    if (!code) return null;
    const clean = code.trim();
    return db.prepare('SELECT id, username, name, participant_code, role, cohort_group, created_at FROM users WHERE LOWER(participant_code) = LOWER(?)').get(clean);
  },

  getAllUsers() {
    return db.prepare('SELECT id, username, name, participant_code, role, cohort_group, created_at FROM users ORDER BY role, name').all();
  },

  createUser({ username, password, name, participant_code, role, cohort_group }) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const pass = password || 'pass123';
    const code = participant_code || `P-${Math.floor(100 + Math.random() * 900)}`;
    const cohort = cohort_group || (role === 'student' ? 'Group_Main_Study' : role === 'expert' ? 'Group_Pilot_Experts' : role === 'rater' ? 'Group_Evaluators' : 'Group_Staff');
    db.prepare(`
      INSERT INTO users (id, username, password_hash, name, participant_code, role, cohort_group)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, username, pass, name, code, role, cohort);
    return this.getUserById(id);
  },

  deleteUser(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  },

  updateUser(id, fields = {}) {
    const user = this.getUserById(id);
    if (!user) return null;
    const name = fields.name !== undefined ? fields.name.trim() : user.name;
    const username = fields.username !== undefined ? fields.username.trim() : user.username;
    const role = fields.role !== undefined ? fields.role.trim() : user.role;
    const cohort = fields.cohort_group !== undefined ? fields.cohort_group.trim() : user.cohort_group;
    const code = fields.participant_code !== undefined ? fields.participant_code.trim() : user.participant_code;
    const password = fields.password || fields.password_hash;

    if (password && password.trim()) {
      db.prepare(`
        UPDATE users SET name = ?, username = ?, role = ?, cohort_group = ?, participant_code = ?, password_hash = ? WHERE id = ?
      `).run(name, username, role, cohort, code, password.trim(), id);
    } else {
      db.prepare(`
        UPDATE users SET name = ?, username = ?, role = ?, cohort_group = ?, participant_code = ? WHERE id = ?
      `).run(name, username, role, cohort, code, id);
    }
    return this.getUserById(id);
  },

  // --- CONSENT ---
  getConsent(userId) {
    return db.prepare('SELECT * FROM research_consent WHERE user_id = ?').get(userId);
  },

  recordConsent(userId, version = 'v1.0') {
    const existing = this.getConsent(userId);
    const now = new Date().toISOString();
    if (existing) {
      db.prepare('UPDATE research_consent SET consent_status = 1, agreed_at = ? WHERE user_id = ?').run(now, userId);
    } else {
      const id = `cst_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      db.prepare('INSERT INTO research_consent (id, user_id, consent_status, consent_version, agreed_at) VALUES (?, ?, 1, ?, ?)').run(id, userId, version, now);
    }
    return this.getConsent(userId);
  },

  // --- LESSONS & CURRICULUM ---
  getAllLessons() {
    return db.prepare('SELECT * FROM lessons ORDER BY unit_number ASC').all();
  },

  getLessonById(unitId) {
    return db.prepare('SELECT * FROM lessons WHERE id = ?').get(unitId);
  },

  // --- PROGRESS TRACKING ---
  getProgress(userId) {
    const rows = db.prepare('SELECT * FROM student_progress WHERE user_id = ?').all(userId);
    const map = {};
    for (const r of rows) {
      map[r.unit_id] = {
        ...r,
        sections_completed: JSON.parse(r.sections_completed || '{}')
      };
    }
    return map;
  },

  updateProgress(userId, unitId, progressUpdate) {
    const existing = db.prepare('SELECT * FROM student_progress WHERE user_id = ? AND unit_id = ?').get(userId, unitId);
    const now = new Date().toISOString();
    const sectionsJson = JSON.stringify(progressUpdate.sections_completed || {});

    if (existing) {
      // Never downgrade an already completed unit back to in_progress or not_started
      const finalStatus = (existing.status === 'completed' && progressUpdate.status && progressUpdate.status !== 'completed')
        ? 'completed'
        : (progressUpdate.status || existing.status);

      db.prepare(`
        UPDATE student_progress
        SET status = ?,
            current_sub_section = COALESCE(?, current_sub_section),
            sections_completed = COALESCE(?, sections_completed),
            review_score = COALESCE(?, review_score),
            best_review_score = MAX(COALESCE(?, 0), COALESCE(best_review_score, 0)),
            completed_at = CASE WHEN ? = 'completed' THEN ? ELSE completed_at END,
            updated_at = ?
        WHERE user_id = ? AND unit_id = ?
      `).run(
        finalStatus,
        progressUpdate.current_sub_section || null,
        sectionsJson,
        progressUpdate.review_score !== undefined ? progressUpdate.review_score : null,
        progressUpdate.review_score !== undefined ? progressUpdate.review_score : null,
        finalStatus,
        now,
        now,
        userId,
        unitId
      );
    } else {
      const id = `prg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      db.prepare(`
        INSERT INTO student_progress (
          id, user_id, unit_id, status, current_sub_section,
          sections_completed, review_score, best_review_score, completed_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        unitId,
        progressUpdate.status || 'in_progress',
        progressUpdate.current_sub_section || 'situation',
        sectionsJson,
        progressUpdate.review_score || null,
        progressUpdate.review_score || null,
        progressUpdate.status === 'completed' ? now : null,
        now
      );
    }
    return this.getProgress(userId)[unitId];
  },

  // --- SUBMISSIONS (AUDIO) ---
  saveSubmission({ userId, unitId, assessmentType, audioFilePath, audioUrl, durationSeconds, selfAssessment }) {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const randomMaskNum = Math.floor(100 + Math.random() * 900);
    const blindMaskCode = `BLIND-${randomMaskNum}`;

    db.prepare(`
      INSERT INTO submissions (
        id, user_id, unit_id, assessment_type,
        audio_file_path, audio_url, duration_seconds,
        blind_mask_code, self_assessment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      unitId,
      assessmentType,
      audioFilePath,
      audioUrl,
      durationSeconds || 0,
      blindMaskCode,
      JSON.stringify(selfAssessment || {})
    );

    return db.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
  },

  getSubmissions(filter = {}) {
    let sql = `
      SELECT s.*, u.name as student_name, u.participant_code,
             COALESCE(l.title, 
               CASE 
                 WHEN s.unit_id = 'section_0' THEN 'Pre-test: Diagnostic Spoken Assessment'
                 WHEN s.unit_id = 'section_9' THEN 'Post-test: Outcome Spoken Assessment'
                 WHEN s.unit_id LIKE 'lesson_%' THEN 'Lesson ' || REPLACE(s.unit_id, 'lesson_', '') || ': Practice'
                 ELSE s.unit_id 
               END
             ) as unit_title
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN lessons l ON s.unit_id = l.id
    `;
    const params = [];
    if (filter.userId) {
      sql += ' WHERE s.user_id = ?';
      params.push(filter.userId);
    } else if (filter.unitId) {
      sql += ' WHERE s.unit_id = ?';
      params.push(filter.unitId);
    }
    sql += ' ORDER BY s.submitted_at DESC';
    const rows = db.prepare(sql).all(...params);
    return rows.map(row => {
      const evals = this.getEvaluationsForSubmission(row.id);
      const grades = {};
      evals.forEach(e => {
        const info = {
          total: e.total_score,
          total_score: e.total_score,
          percentage: e.total_percentage,
          total_percentage: e.total_percentage,
          task_achievement: e.task_achievement,
          interactive_comm: e.interactive_comm,
          vocabulary: e.vocabulary,
          grammar: e.grammar,
          pronunciation_fluency: e.pronunciation_fluency,
          strengths: e.strengths,
          areas_for_improvement: e.areas_for_improvement,
          suggestions: e.suggestions,
          rater_name: e.rater_name,
          graded_at: e.graded_at,
          rater_role: e.rater_role,
          is_calibrated: Boolean(e.is_calibrated),
          calibration_notes: e.calibration_notes || null,
          task_scores: e.task_scores ? JSON.parse(e.task_scores) : null
        };
        grades[e.rater_role] = info;
        if (e.rater_role === 'instructor' || e.rater_role === 'rater_1') {
          grades.instructor = info;
          grades.raterA = info;
        }
        if (e.rater_role === 'rater' || e.rater_role === 'rater_2') {
          grades.rater = info;
          grades.raterB = info;
        }
      });

      let selfAssessment = {};
      try {
        selfAssessment = typeof row.self_assessment === 'string'
          ? JSON.parse(row.self_assessment || '{}')
          : (row.self_assessment || {});
      } catch (e) {
        selfAssessment = {};
      }

      return {
        ...row,
        self_assessment: selfAssessment,
        task_audio_urls: selfAssessment.task_audio_urls || null,
        evaluations: evals,
        grades
      };
    });
  },

  getSubmissionById(id) {
    const row = db.prepare(`
      SELECT s.*, u.name as student_name, u.participant_code,
             COALESCE(l.title, 
               CASE 
                 WHEN s.unit_id = 'section_0' THEN 'Pre-test: Diagnostic Spoken Assessment'
                 WHEN s.unit_id = 'section_9' THEN 'Post-test: Outcome Spoken Assessment'
                 WHEN s.unit_id LIKE 'lesson_%' THEN 'Lesson ' || REPLACE(s.unit_id, 'lesson_', '') || ': Practice'
                 ELSE s.unit_id 
               END
             ) as unit_title
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN lessons l ON s.unit_id = l.id
      WHERE s.id = ?
    `).get(id);
    if (!row) return null;
    const evals = this.getEvaluationsForSubmission(row.id);
    const grades = {};
    evals.forEach(e => {
      const info = {
        total: e.total_score,
        total_score: e.total_score,
        percentage: e.total_percentage,
        total_percentage: e.total_percentage,
        task_achievement: e.task_achievement,
        interactive_comm: e.interactive_comm,
        vocabulary: e.vocabulary,
        grammar: e.grammar,
        pronunciation_fluency: e.pronunciation_fluency,
        strengths: e.strengths,
        areas_for_improvement: e.areas_for_improvement,
        suggestions: e.suggestions,
        rater_name: e.rater_name,
        graded_at: e.graded_at,
        rater_role: e.rater_role,
        is_calibrated: Boolean(e.is_calibrated),
        calibration_notes: e.calibration_notes || null
      };
      grades[e.rater_role] = info;
      if (e.rater_role === 'instructor' || e.rater_role === 'rater_1') {
        grades.instructor = info;
        grades.raterA = info;
      }
      if (e.rater_role === 'rater' || e.rater_role === 'rater_2') {
        grades.rater = info;
        grades.raterB = info;
      }
    });

    let selfAssessment = {};
    try {
      selfAssessment = typeof row.self_assessment === 'string'
        ? JSON.parse(row.self_assessment || '{}')
        : (row.self_assessment || {});
    } catch (e) {
      selfAssessment = {};
    }

    return {
      ...row,
      self_assessment: selfAssessment,
      task_audio_urls: selfAssessment.task_audio_urls || null,
      evaluations: evals,
      grades
    };
  },

  // --- EVALUATIONS & 25-POINT RUBRIC ---
  saveEvaluation(data) {
    const submissionId = data.submissionId;
    const raterId = data.raterId;
    const raterRole = data.raterRole || 'instructor';
    const scores = data.scores || {};
    const strengths = data.strengths || '';
    const areasForImprovement = data.areasForImprovement || data.improvements || '';
    const suggestions = data.suggestions || '';

    const parseCriterion = (v1, v2, fallback = 3) => {
      const val = v1 !== undefined ? v1 : v2;
      const num = Number(val);
      if (isNaN(num) || num < 1) return fallback;
      return Math.min(Math.max(Math.round(num), 1), 5);
    };

    const ta = parseCriterion(data.taskAchievement, scores.task_achievement);
    const ic = parseCriterion(data.interactiveComm, scores.interactive_comm || scores.interactive_communication);
    const voc = parseCriterion(data.vocabulary, scores.vocabulary);
    const gr = parseCriterion(data.grammar, scores.grammar);
    const pf = parseCriterion(data.pronunciationFluency, scores.pronunciation_fluency);
    let total = ta + ic + voc + gr + pf;
    let pct = Number(((total / 25) * 100).toFixed(1));
    let taskScoresStr = null;

    if (data.taskScores && typeof data.taskScores === 'object') {
      const ts = data.taskScores;
      taskScoresStr = JSON.stringify(ts);
      const t1 = Math.min(Math.max(Number(ts[1] || ts.task_1 || 0), 0), 5);
      const t2 = Math.min(Math.max(Number(ts[2] || ts.task_2 || 0), 0), 5);
      const t3 = Math.min(Math.max(Number(ts[3] || ts.task_3 || 0), 0), 5);
      const t4 = Math.min(Math.max(Number(ts[4] || ts.task_4 || 0), 0), 5);
      total = t1 + t2 + t3 + t4;
      pct = Number(((total / 20) * 100).toFixed(1));
    }

    const isCalibrated = data.isCalibrated ? 1 : 0;
    const calibrationNotes = data.calibrationNotes !== undefined ? String(data.calibrationNotes) : null;

    let existing = null;
    if (raterRole === 'instructor' || raterRole === 'rater_1') {
      existing = db.prepare(`
        SELECT id FROM evaluations 
        WHERE submission_id = ? AND (rater_id = ? OR rater_role IN ('instructor', 'rater_1'))
      `).get(submissionId, raterId);
    } else {
      existing = db.prepare('SELECT id FROM evaluations WHERE submission_id = ? AND rater_id = ?').get(submissionId, raterId);
    }

    const now = new Date().toISOString();

    if (existing) {
      db.prepare(`
        UPDATE evaluations
        SET task_achievement = ?,
            interactive_comm = ?,
            vocabulary = ?,
            grammar = ?,
            pronunciation_fluency = ?,
            total_score = ?,
            total_percentage = ?,
            strengths = ?,
            areas_for_improvement = ?,
            suggestions = ?,
            graded_at = ?,
            is_calibrated = CASE WHEN ? = 1 THEN 1 ELSE is_calibrated END,
            calibration_notes = COALESCE(?, calibration_notes),
            task_scores = COALESCE(?, task_scores)
        WHERE id = ?
      `).run(
        ta, ic, voc, gr, pf, total, pct,
        strengths || '', areasForImprovement || '', suggestions || '', now,
        isCalibrated, calibrationNotes, taskScoresStr,
        existing.id
      );
    } else {
      const id = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      db.prepare(`
        INSERT INTO evaluations (
          id, submission_id, rater_id, rater_role,
          task_achievement, interactive_comm, vocabulary, grammar, pronunciation_fluency,
          total_score, total_percentage, strengths, areas_for_improvement, suggestions, graded_at,
          is_calibrated, calibration_notes, task_scores
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, submissionId, raterId, raterRole || 'rater_1',
        ta, ic, voc, gr, pf, total, pct,
        strengths || '', areasForImprovement || '', suggestions || '', now,
        isCalibrated, calibrationNotes, taskScoresStr
      );
    }

    return this.getEvaluationsForSubmission(submissionId);
  },

  getEvaluationsForSubmission(submissionId) {
    return db.prepare(`
      SELECT e.*, u.name as rater_name
      FROM evaluations e
      JOIN users u ON e.rater_id = u.id
      WHERE e.submission_id = ?
    `).all(submissionId);
  },

  // --- EXPERT VALIDATION FORM ---
  saveExpertEvaluation({ expertId, contentQuality, languageAppropriateness, learningActivities, interfaceQuality, overallAppropriateness, comments }) {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO expert_evaluations (
        id, expert_id, content_quality, language_appropriateness,
        learning_activities, interface_quality, overall_appropriateness,
        comments, evaluated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, expertId, contentQuality, languageAppropriateness,
      learningActivities, interfaceQuality, overallAppropriateness,
      comments || '', now
    );

    return db.prepare('SELECT * FROM expert_evaluations WHERE id = ?').get(id);
  },

  getExpertEvaluations() {
    return db.prepare(`
      SELECT ee.*, u.name as expert_name, u.participant_code
      FROM expert_evaluations ee
      JOIN users u ON ee.expert_id = u.id
      ORDER BY ee.evaluated_at DESC
    `).all();
  },

  // --- SPSS / JAMOVI EXPORT ---
  getSPSSDataset() {
    const submissions = db.prepare(`
      SELECT s.*, u.participant_code, l.title as unit_title
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      JOIN lessons l ON s.unit_id = l.id
      ORDER BY s.submitted_at ASC
    `).all();

    return submissions.map(sub => {
      const evals = this.getEvaluationsForSubmission(sub.id);
      const r1 = evals.find(e => e.rater_role === 'rater_1' || e.rater_role === 'instructor') || {};
      const r2 = evals.find(e => e.rater_role === 'rater_2' || e.rater_role === 'rater') || {};

      const isPreOrPost = sub.assessment_type === 'pre_test' || sub.assessment_type === 'post_test' || sub.unit_id === 'section_0' || sub.unit_id === 'section_9';
      const maxScore = isPreOrPost ? 20 : 25;

      let r1TaskScores = {};
      try {
        if (r1.task_scores) {
          r1TaskScores = typeof r1.task_scores === 'string' ? JSON.parse(r1.task_scores) : r1.task_scores;
        }
      } catch (e) {}

      let r2TaskScores = {};
      try {
        if (r2.task_scores) {
          r2TaskScores = typeof r2.task_scores === 'string' ? JSON.parse(r2.task_scores) : r2.task_scores;
        }
      } catch (e) {}

      let diff = '';
      let diffFlag = 'NO';
      if (r1.total_score !== undefined && r2.total_score !== undefined) {
        diff = Math.abs(r1.total_score - r2.total_score);
        // Flag discrepancy > 20% of max score (4 pts on 20-pt scale, 5 pts on 25-pt scale)
        if (diff >= (maxScore * 0.2)) {
          diffFlag = 'YES (Consensus Review Required)';
        }
      }

      return {
        participant_id: sub.participant_code,
        blind_mask_code: sub.blind_mask_code,
        unit_id: sub.unit_id,
        assessment_type: sub.assessment_type,
        submitted_at: sub.submitted_at,
        duration_seconds: sub.duration_seconds,
        max_score: maxScore,
        r1_t1: r1TaskScores[1] ?? '',
        r1_t2: r1TaskScores[2] ?? '',
        r1_t3: r1TaskScores[3] ?? '',
        r1_t4: r1TaskScores[4] ?? '',
        r1_task: r1.task_achievement ?? '',
        r1_comm: r1.interactive_comm ?? '',
        r1_lex: r1.vocabulary ?? '',
        r1_gram: r1.grammar ?? '',
        r1_pron: r1.pronunciation_fluency ?? '',
        r1_total: r1.total_score ?? '',
        r1_pct: r1.total_percentage ?? '',
        r2_t1: r2TaskScores[1] ?? '',
        r2_t2: r2TaskScores[2] ?? '',
        r2_t3: r2TaskScores[3] ?? '',
        r2_t4: r2TaskScores[4] ?? '',
        r2_task: r2.task_achievement ?? '',
        r2_comm: r2.interactive_comm ?? '',
        r2_lex: r2.vocabulary ?? '',
        r2_gram: r2.grammar ?? '',
        r2_pron: r2.pronunciation_fluency ?? '',
        r2_total: r2.total_score ?? '',
        r2_pct: r2.total_percentage ?? '',
        score_diff: diff,
        diff_flag: diffFlag,
        is_calibrated: (r1.is_calibrated || r2.is_calibrated) ? 'YES' : 'NO',
        calibration_notes: r1.calibration_notes || r2.calibration_notes || '',
        r1_notes: r1.strengths ? `${r1.strengths} | ${r1.areas_for_improvement}` : '',
        r2_notes: r2.strengths ? `${r2.strengths} | ${r2.areas_for_improvement}` : ''
      };
    });
  },

  getCohortOverview() {
    const students = db.prepare(`
      SELECT id, username, name, participant_code, cohort_group, created_at
      FROM users
      WHERE role = 'student'
      ORDER BY participant_code ASC
    `).all();

    const consents = db.prepare('SELECT user_id, consent_status, agreed_at FROM research_consent').all();
    const consentMap = {};
    consents.forEach(c => { consentMap[c.user_id] = Boolean(c.consent_status); });

    const progressRows = db.prepare('SELECT user_id, unit_id, status, review_score FROM student_progress').all();
    const progressMap = {};
    progressRows.forEach(p => {
      if (!progressMap[p.user_id]) progressMap[p.user_id] = {};
      progressMap[p.user_id][p.unit_id] = p;
    });

    const subs = this.getSubmissions();
    const subsByUserAndUnit = {};
    subs.forEach(s => {
      const key = `${s.user_id}_${s.unit_id}`;
      if (!subsByUserAndUnit[key] || (s.grades && Object.keys(s.grades).length > Object.keys(subsByUserAndUnit[key].grades || {}).length)) {
        subsByUserAndUnit[key] = s;
      }
    });

    return students.map(st => {
      const uProgress = progressMap[st.id] || {};
      
      let completedLessons = 0;
      for (let i = 1; i <= 8; i++) {
        const uId = `lesson_${i}`;
        if (uProgress[uId] && uProgress[uId].status === 'completed') {
          completedLessons++;
        }
      }

      const preSub = subsByUserAndUnit[`${st.id}_section_0`];
      const preInstGrade = preSub?.grades?.instructor || preSub?.grades?.raterA || null;
      const preRaterGrade = preSub?.grades?.rater || preSub?.grades?.raterB || null;
      const preDiff = (preInstGrade && preRaterGrade) ? Math.abs(preInstGrade.total - preRaterGrade.total) : null;

      const postSub = subsByUserAndUnit[`${st.id}_section_9`];
      const postInstGrade = postSub?.grades?.instructor || postSub?.grades?.raterA || null;
      const postRaterGrade = postSub?.grades?.rater || postSub?.grades?.raterB || null;
      const postDiff = (postInstGrade && postRaterGrade) ? Math.abs(postInstGrade.total - postRaterGrade.total) : null;

      let stage = 'Consent Pending';
      if (consentMap[st.id]) {
        stage = 'Consent Signed';
        if (preSub) {
          stage = (preInstGrade && preRaterGrade) ? 'Pre-test Dual Graded' : 'Pre-test Submitted';
          if (completedLessons > 0) {
            stage = `Lessons (${completedLessons}/8)`;
            if (completedLessons === 8) {
              stage = 'Lessons Complete';
              if (postSub) {
                stage = (postInstGrade && postRaterGrade) ? 'Study Completed & Dual Graded' : 'Post-test Submitted';
              }
            }
          }
        }
      }

      return {
        ...st,
        hasConsent: Boolean(consentMap[st.id]),
        preTest: {
          status: uProgress['section_0']?.status || 'not_started',
          hasSubmission: Boolean(preSub),
          submissionId: preSub?.id || null,
          audioUrl: preSub?.audio_url || null,
          instructorScore: preInstGrade ? preInstGrade.total : null,
          raterScore: preRaterGrade ? preRaterGrade.total : null,
          isDualScored: Boolean(preInstGrade && preRaterGrade),
          diff: preDiff,
          isDiscrepant: preDiff !== null && preDiff >= 4
        },
        lessons: {
          completedCount: completedLessons,
          allCompleted: completedLessons === 8
        },
        postTest: {
          status: uProgress['section_9']?.status || 'not_started',
          hasSubmission: Boolean(postSub),
          submissionId: postSub?.id || null,
          audioUrl: postSub?.audio_url || null,
          instructorScore: postInstGrade ? postInstGrade.total : null,
          raterScore: postRaterGrade ? postRaterGrade.total : null,
          isDualScored: Boolean(postInstGrade && postRaterGrade),
          diff: postDiff,
          isDiscrepant: postDiff !== null && postDiff >= 4
        },
        overallStage: stage
      };
    });
  },

  getSystemStats() {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const usersByRole = db.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role').all();
    const usersByCohort = db.prepare('SELECT cohort_group, COUNT(*) as count FROM users GROUP BY cohort_group').all();
    const totalSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
    const subsByType = db.prepare('SELECT assessment_type, COUNT(*) as count FROM submissions GROUP BY assessment_type').all();
    const totalEvaluations = db.prepare('SELECT COUNT(*) as count FROM evaluations').get().count;
    const evalsByRole = db.prepare('SELECT rater_role, COUNT(*) as count FROM evaluations GROUP BY rater_role').all();
    const expertEvals = db.prepare('SELECT COUNT(*) as count FROM expert_evaluations').get().count;

    return {
      totalUsers,
      usersByRole,
      usersByCohort,
      totalSubmissions,
      subsByType,
      totalEvaluations,
      evalsByRole,
      expertEvals,
      dbEngine: 'SQLite WAL mode (Native Node.js 24 DatabaseSync)'
    };
  },

  // --- DATA RESET & REFRESH (ADMIN MAINTENANCE) ---
  resetData({ scope = 'all', userId = null, includeConsent = false }) {
    const uploadsDir = path.join(__dirname, 'uploads', 'audio');
    let deletedFiles = 0;

    const removeAudioFile = (filepathOrUrl) => {
      if (!filepathOrUrl) return;
      try {
        const basename = path.basename(filepathOrUrl);
        // Only delete uploaded files, never touch demo or lesson audio
        if (basename.startsWith('submission-')) {
          const fullPath = path.join(uploadsDir, basename);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            deletedFiles++;
          }
        }
      } catch (err) {
        console.warn('[Reset] Error deleting audio file:', err.message);
      }
    };

    let deletedSubmissions = 0;
    let deletedEvaluations = 0;
    let deletedProgressRecords = 0;
    let deletedBadges = 0;
    let deletedConsentRecords = 0;

    db.exec('BEGIN TRANSACTION;');
    try {
      if (scope === 'all') {
        // Collect all submissions to delete audio files
        const subs = db.prepare('SELECT id, audio_file_path, audio_url, self_assessment FROM submissions').all();
        for (const s of subs) {
          removeAudioFile(s.audio_file_path);
          removeAudioFile(s.audio_url);
          try {
            const meta = JSON.parse(s.self_assessment || '{}');
            if (meta.task_audio_urls) {
              Object.values(meta.task_audio_urls).forEach(removeAudioFile);
            }
          } catch (_) {}
        }

        // Clean any lingering submission-*.webm files in uploads directory
        if (fs.existsSync(uploadsDir)) {
          const lingering = fs.readdirSync(uploadsDir);
          for (const f of lingering) {
            if (f.startsWith('submission-')) {
              try {
                fs.unlinkSync(path.join(uploadsDir, f));
                deletedFiles++;
              } catch (_) {}
            }
          }
        }

        const evCount = db.prepare('SELECT COUNT(*) as count FROM evaluations').get().count;
        const subCount = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
        const progCount = db.prepare('SELECT COUNT(*) as count FROM student_progress').get().count;
        const badgeCount = db.prepare('SELECT COUNT(*) as count FROM badges').get().count;

        db.exec('DELETE FROM evaluations;');
        db.exec('DELETE FROM submissions;');
        db.exec('DELETE FROM student_progress;');
        db.exec('DELETE FROM badges;');

        if (includeConsent) {
          const cCount = db.prepare('SELECT COUNT(*) as count FROM research_consent').get().count;
          db.exec('DELETE FROM research_consent;');
          deletedConsentRecords = cCount;
        }

        deletedEvaluations = evCount;
        deletedSubmissions = subCount;
        deletedProgressRecords = progCount;
        deletedBadges = badgeCount;

      } else if (scope === 'tests_only') {
        const subs = db.prepare("SELECT id, audio_file_path, audio_url, self_assessment FROM submissions WHERE unit_id IN ('section_0', 'section_9') OR assessment_type IN ('pre_test', 'post_test')").all();
        
        for (const s of subs) {
          removeAudioFile(s.audio_file_path);
          removeAudioFile(s.audio_url);
        }

        const subIds = subs.map(s => s.id);
        if (subIds.length > 0) {
          const idPlaceholders = subIds.map(() => '?').join(',');
          const evDel = db.prepare(`DELETE FROM evaluations WHERE submission_id IN (${idPlaceholders})`).run(...subIds);
          deletedEvaluations = evDel.changes;
          const subDel = db.prepare(`DELETE FROM submissions WHERE id IN (${idPlaceholders})`).run(...subIds);
          deletedSubmissions = subDel.changes;
        }

        const progDel = db.prepare("DELETE FROM student_progress WHERE unit_id IN ('section_0', 'section_9')").run();
        deletedProgressRecords = progDel.changes;

      } else if (scope === 'lessons_only') {
        const progDel = db.prepare("DELETE FROM student_progress WHERE unit_id NOT IN ('section_0', 'section_9')").run();
        deletedProgressRecords = progDel.changes;

        const formativeSubs = db.prepare("SELECT id, audio_file_path, audio_url, self_assessment FROM submissions WHERE assessment_type = 'formative_speaking'").all();
        for (const s of formativeSubs) {
          removeAudioFile(s.audio_file_path);
          removeAudioFile(s.audio_url);
        }
        if (formativeSubs.length > 0) {
          const subDel = db.prepare("DELETE FROM submissions WHERE assessment_type = 'formative_speaking'").run();
          deletedSubmissions = subDel.changes;
        }

        const badgeDel = db.prepare('DELETE FROM badges;').run();
        deletedBadges = badgeDel.changes;

      } else if (scope === 'single_user' && userId) {
        const subs = db.prepare('SELECT id, audio_file_path, audio_url, self_assessment FROM submissions WHERE user_id = ?').all(userId);
        for (const s of subs) {
          removeAudioFile(s.audio_file_path);
          removeAudioFile(s.audio_url);
        }

        const subIds = subs.map(s => s.id);
        if (subIds.length > 0) {
          const idPlaceholders = subIds.map(() => '?').join(',');
          const evDel = db.prepare(`DELETE FROM evaluations WHERE submission_id IN (${idPlaceholders})`).run(...subIds);
          deletedEvaluations = evDel.changes;
          const subDel = db.prepare(`DELETE FROM submissions WHERE id IN (${idPlaceholders})`).run(...subIds);
          deletedSubmissions = subDel.changes;
        }

        const progDel = db.prepare('DELETE FROM student_progress WHERE user_id = ?').run(userId);
        deletedProgressRecords = progDel.changes;

        const badgeDel = db.prepare('DELETE FROM badges WHERE user_id = ?').run(userId);
        deletedBadges = badgeDel.changes;

        if (includeConsent) {
          const cDel = db.prepare('DELETE FROM research_consent WHERE user_id = ?').run(userId);
          deletedConsentRecords = cDel.changes;
        }
      }

      db.exec('COMMIT;');

      try {
        db.exec('VACUUM;');
      } catch (_) {}

      return {
        success: true,
        scope,
        userId: userId || null,
        deletedSubmissions,
        deletedEvaluations,
        deletedProgressRecords,
        deletedBadges,
        deletedConsentRecords,
        deletedFiles
      };
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  }
};

module.exports = {
  db,
  DAL
};
