// ============================================================================
// Seed Script: 20 Students, 4 Instructors, 4 Raters, 2 Admins
// Plus Exports Authoritative CSV: techquest_users_credentials.csv
// ============================================================================

const { db } = require('./db');
const fs = require('fs');
const path = require('path');

console.log('Seeding pre-ready research users into SQLite...');

const STUDENTS = [
  { id: 'usr_stu_01', code: 'STU-1001', username: 'student01', name: 'Somchai Prasert', pass: 'Student@2026#01' },
  { id: 'usr_stu_02', code: 'STU-1002', username: 'student02', name: 'Nadia Hassan', pass: 'Student@2026#02' },
  { id: 'usr_stu_03', code: 'STU-1003', username: 'student03', name: 'Kittipong Srikul', pass: 'Student@2026#03' },
  { id: 'usr_stu_04', code: 'STU-1004', username: 'student04', name: 'Supaporn Wongsuwan', pass: 'Student@2026#04' },
  { id: 'usr_stu_05', code: 'STU-1005', username: 'student05', name: 'Warunee Rattanaporn', pass: 'Student@2026#05' },
  { id: 'usr_stu_06', code: 'STU-1006', username: 'student06', name: 'Thanawat Suksom', pass: 'Student@2026#06' },
  { id: 'usr_stu_07', code: 'STU-1007', username: 'student07', name: 'Chidchanok Phromma', pass: 'Student@2026#07' },
  { id: 'usr_stu_08', code: 'STU-1008', username: 'student08', name: 'Natthawut Chaiya', pass: 'Student@2026#08' },
  { id: 'usr_stu_09', code: 'STU-1009', username: 'student09', name: 'Siriporn Boonmee', pass: 'Student@2026#09' },
  { id: 'usr_stu_10', code: 'STU-1010', username: 'student10', name: 'Anon Kasemsook', pass: 'Student@2026#10' },
  { id: 'usr_stu_11', code: 'STU-1011', username: 'student11', name: 'Ploypailin Thongdee', pass: 'Student@2026#11' },
  { id: 'usr_stu_12', code: 'STU-1012', username: 'student12', name: 'Kritsada Charoensuk', pass: 'Student@2026#12' },
  { id: 'usr_stu_13', code: 'STU-1013', username: 'student13', name: 'Benjarat Saetang', pass: 'Student@2026#13' },
  { id: 'usr_stu_14', code: 'STU-1014', username: 'student14', name: 'Teerapat Intarasit', pass: 'Student@2026#14' },
  { id: 'usr_stu_15', code: 'STU-1015', username: 'student15', name: 'Pornpimol Saenghom', pass: 'Student@2026#15' },
  { id: 'usr_stu_16', code: 'STU-1016', username: 'student16', name: 'Worachet Phinit', pass: 'Student@2026#16' },
  { id: 'usr_stu_17', code: 'STU-1017', username: 'student17', name: 'Jantana Samart', pass: 'Student@2026#17' },
  { id: 'usr_stu_18', code: 'STU-1018', username: 'student18', name: 'Phanuphong Klahan', pass: 'Student@2026#18' },
  { id: 'usr_stu_19', code: 'STU-1019', username: 'student19', name: 'Chalisa Wannaphop', pass: 'Student@2026#19' },
  { id: 'usr_stu_20', code: 'STU-1020', username: 'student20', name: 'Nuttaphol Panyawan', pass: 'Student@2026#20' }
];

const INSTRUCTORS = [
  { id: 'usr_instructor', code: 'INST-01', username: 'instructor01', name: 'Dr. Arisara Chantarat (Lead Instructor)', pass: 'Instructor@2026#1' },
  { id: 'usr_inst_02', code: 'INST-02', username: 'instructor02', name: 'Asst. Prof. Dr. Somkiat Pradit', pass: 'Instructor@2026#2' },
  { id: 'usr_inst_03', code: 'INST-03', username: 'instructor03', name: 'Dr. Piyawat Sukhum', pass: 'Instructor@2026#3' },
  { id: 'usr_inst_04', code: 'INST-04', username: 'instructor04', name: 'Dr. Wanida Kaewmanee', pass: 'Instructor@2026#4' }
];

const RATERS = [
  { id: 'usr_rater_1', code: 'RATER-01', username: 'rater01', name: 'Dr. Kanya Charoenwong (Primary Rater)', pass: 'Rater@2026#1' },
  { id: 'usr_rater_2', code: 'RATER-02', username: 'rater02', name: 'Dr. Michael Davis (Blind Rater 2)', pass: 'Rater@2026#2' },
  { id: 'usr_rater_03', code: 'RATER-03', username: 'rater03', name: 'Dr. Noor Aini Ahmad (External Rater 3)', pass: 'Rater@2026#3' },
  { id: 'usr_rater_04', code: 'RATER-04', username: 'rater04', name: 'Dr. Sarawut Cheewathan (Calibration Rater 4)', pass: 'Rater@2026#4' }
];

const ADMINS = [
  { id: 'usr_admin', code: 'ADMIN-01', username: 'admin01', name: 'TECHQUEST Lead Administrator', pass: 'Admin@2026#1' },
  { id: 'usr_admin_02', code: 'ADMIN-02', username: 'admin02', name: 'Technical Systems Coordinator', pass: 'Admin@2026#2' }
];

const EXPERTS = [
  { id: 'usr_expert_prof', code: 'EXPERT-01', username: 'expert', name: 'Prof. Evaluation Committee', pass: 'Expert@2026#1' }
];

const TESTERS = [
  { id: 'usr_tester_qa', code: 'TEST-001', username: 'tester', name: 'Functional QA Tester', pass: 'Tester@2026#1' }
];

// Clean legacy codes that might cause unique constraint conflicts
db.exec(`
  DELETE FROM users WHERE id IN ('usr_rater_alias', 'usr_student_kittipong');
`);

const upsertUser = (u, role, cohort) => {
  const existing = db.prepare('SELECT id FROM users WHERE id = ? OR username = ? OR participant_code = ?').get(u.id, u.username, u.code);
  if (existing) {
    db.prepare(`
      UPDATE users 
      SET username = ?, password_hash = ?, name = ?, participant_code = ?, role = ?, cohort_group = ?
      WHERE id = ?
    `).run(u.username, u.pass, u.name, u.code, role, cohort, existing.id);
  } else {
    db.prepare(`
      INSERT INTO users (id, username, password_hash, name, participant_code, role, cohort_group)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(u.id, u.username, u.pass, u.name, u.code, role, cohort);
  }
};

// 1. Upsert 20 Students
STUDENTS.forEach(s => upsertUser(s, 'student', 'Group_Main_Study'));

// 2. Upsert 4 Instructors
INSTRUCTORS.forEach(i => upsertUser(i, 'instructor', 'Group_Staff'));

// 3. Upsert 4 Raters
RATERS.forEach(r => upsertUser(r, 'rater', 'Group_Evaluators'));

// 4. Upsert 2 Admins
ADMINS.forEach(a => upsertUser(a, 'admin', 'Group_Staff'));

// 5. Upsert Expert & QA Tester
EXPERTS.forEach(e => upsertUser(e, 'expert', 'Group_Pilot_Experts'));
TESTERS.forEach(t => upsertUser(t, 'tester', 'Group_Pilot'));

console.log('✓ Successfully seeded all 30 pre-ready research accounts into SQLite.');

// Build CSV Content
const csvRows = [
  ['Role', 'Participant_Code', 'Full_Name', 'Username', 'Password', 'Cohort_Group', 'Access_Permissions']
];

const clean = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

STUDENTS.forEach(s => {
  csvRows.push([
    'Student',
    s.code,
    s.name,
    s.username,
    s.pass,
    'Group_Main_Study',
    'Sequential Gates: Consent -> Pre-test -> Lessons 1-8 -> Post-test (Receives Instructor Scores Only)'
  ]);
});

INSTRUCTORS.forEach(i => {
  csvRows.push([
    'Instructor',
    i.code,
    i.name,
    i.username,
    i.pass,
    'Group_Staff',
    'Lead Evaluator: Authoritative 25-pt Rubric Audio Grading (Delivered to Students), Student Roster, Calibration'
  ]);
});

RATERS.forEach(r => {
  csvRows.push([
    'Rater',
    r.code,
    r.name,
    r.username,
    r.pass,
    'Group_Evaluators',
    'Pilot Evaluator: Blind 25-pt Rubric Scoring (Internal Calibration / ICC Reliability)'
  ]);
});

ADMINS.forEach(a => {
  csvRows.push([
    'Administrator',
    a.code,
    a.name,
    a.username,
    a.pass,
    'Group_Staff',
    'Full Administrative Access: User Management, SQLite Engine Stats, SPSS Dataset Export'
  ]);
});

EXPERTS.forEach(e => {
  csvRows.push([
    'Expert Evaluator',
    e.code,
    e.name,
    e.username,
    e.pass,
    'Group_Pilot_Experts',
    'Committee Walkthrough: 1-Click Role Switcher (Student/Instructor/Rater/Admin), Thesis Validation Tool'
  ]);
});

TESTERS.forEach(t => {
  csvRows.push([
    'QA Tester',
    t.code,
    t.name,
    t.username,
    t.pass,
    'Group_Pilot',
    'Zero Lockouts: Unrestricted Access for Full Curriculum & Assessment Quality Assurance'
  ]);
});

const csvContent = csvRows.map(row => row.map(clean).join(',')).join('\r\n');

// Write to project root
const ROOT_CSV = path.join(__dirname, '..', 'techquest_users_credentials.csv');
fs.writeFileSync(ROOT_CSV, csvContent, 'utf8');

// Write to server/data
const DATA_CSV = path.join(__dirname, 'data', 'techquest_users_credentials.csv');
fs.writeFileSync(DATA_CSV, csvContent, 'utf8');

console.log(`✓ CSV generated successfully:\n  - ${ROOT_CSV}\n  - ${DATA_CSV}`);
