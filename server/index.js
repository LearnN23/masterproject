const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { DAL } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Directories
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'audio');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve static uploaded audio files
app.use('/uploads/audio', express.static(UPLOADS_DIR));

// Configure Multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `submission-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// ============================================================================
// REST API ROUTES
// ============================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'sqlite', time: new Date().toISOString() });
});

// --- AUTH & USERS ---
// Get All System Users (for role selection / admin overview)
app.get('/api/users', (req, res) => {
  const users = DAL.getAllUsers();
  res.json(users);
});

// Create User (Admin Management)
app.post('/api/users', (req, res) => {
  const { username, password, name, participantCode, participant_code, role, cohortGroup, cohort_group } = req.body;
  if (!username || !name || !role) {
    return res.status(400).json({ error: 'Username, name, and role are required' });
  }
  try {
    const user = DAL.createUser({
      username: username.trim(),
      password: password || 'pass123',
      name: name.trim(),
      participant_code: (participantCode || participant_code || '').trim(),
      role: role.trim(),
      cohort_group: cohortGroup || cohort_group
    });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete User (Admin Management)
app.delete('/api/users/:id', (req, res) => {
  try {
    DAL.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update User (Admin Management)
app.put('/api/users/:id', (req, res) => {
  try {
    const updated = DAL.updateUser(req.params.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// System Stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = DAL.getSystemStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Endpoint (Verifies username/participant_code & password from DB)
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username && !role) {
    return res.status(400).json({ error: 'Username or participant code is required' });
  }

  let user = null;
  if (username) {
    user = DAL.getUserByUsername(username.trim());
  } else if (role) {
    const users = DAL.getAllUsers();
    user = users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or participant code' });
  }

  // If password was provided (or required for regular login)
  if (password !== undefined && password !== null) {
    if (user.password_hash !== password.trim()) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  }

  const consent = DAL.getConsent(user.id);
  const progress = DAL.getProgress(user.id);

  const safeUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    participant_code: user.participant_code,
    role: user.role,
    cohort_group: user.cohort_group,
    consentAgreed: consent ? Boolean(consent.consent_status) : false
  };

  res.json({
    success: true,
    user: safeUser,
    progress
  });
});

// Verify Current Session
app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = DAL.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User session not found' });
  }
  const consent = DAL.getConsent(user.id);
  const progress = DAL.getProgress(user.id);
  res.json({
    success: true,
    user: {
      ...user,
      consentAgreed: consent ? Boolean(consent.consent_status) : false
    },
    progress
  });
});

// Research Consent Status
app.get('/api/auth/consent/:userId', (req, res) => {
  const consent = DAL.getConsent(req.params.userId);
  res.json(consent || { consent_status: 0, agreed_at: null });
});

// Record Research Consent
app.post('/api/auth/consent', (req, res) => {
  const { userId, version } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  const result = DAL.recordConsent(userId, version || 'v1.0');
  res.json({ success: true, consent: result });
});

// --- LESSONS & CURRICULUM ---
app.get('/api/lessons', (req, res) => {
  const lessons = DAL.getAllLessons();
  res.json(lessons);
});

// --- STUDENT PROGRESS & PACING ---
app.get('/api/progress/:userId', (req, res) => {
  const user = DAL.getUserById(req.params.userId) || DAL.getUserByParticipantCode(req.params.userId) || DAL.getUserByUsername(req.params.userId);
  const targetId = user ? user.id : req.params.userId;
  const progress = DAL.getProgress(targetId);
  res.json(progress);
});

app.post('/api/progress', (req, res) => {
  const { userId, unitId, progressUpdate, status, sectionsCompleted, reviewScore } = req.body;
  if (!userId || !unitId) {
    return res.status(400).json({ error: 'userId and unitId are required' });
  }
  const user = DAL.getUserById(userId) || DAL.getUserByParticipantCode(userId) || DAL.getUserByUsername(userId);
  const targetId = user ? user.id : userId;
  
  const updatePayload = progressUpdate || {
    status: status || 'completed',
    sections_completed: sectionsCompleted,
    review_score: reviewScore
  };

  const updated = DAL.updateProgress(targetId, unitId, updatePayload);
  res.json({ success: true, progress: updated });
});

// --- SUBMISSIONS (AUDIO ORAL RESPONSES) ---
app.get('/api/submissions', (req, res) => {
  const list = DAL.getSubmissions(req.query);
  res.json(list);
});

app.post('/api/submissions', upload.any(), (req, res) => {
  const userId = req.body.userId || req.body.user_id || req.body.participant_id || req.body.participantId;
  const unitId = req.body.unitId || req.body.unit_id || req.body.ticketId || req.body.ticket_id || 'section_0';
  const durationSeconds = parseInt(req.body.durationSeconds || req.body.duration_seconds || 15, 10);
  
  let assessmentType = 'pre_test';
  if (unitId === 'section_9' || unitId.includes('post')) {
    assessmentType = 'post_test';
  } else if (unitId.startsWith('lesson_') || unitId.includes('practice')) {
    assessmentType = 'formative_speaking';
  }

  // Resolve user in SQLite
  let user = null;
  if (userId) {
    user = DAL.getUserById(userId) || DAL.getUserByParticipantCode(userId) || DAL.getUserByUsername(userId);
  }
  if (!user) {
    // Default to seeded student if not matched
    user = DAL.getUserByUsername('student');
  }

  let audioFile = null;
  let audioUrl = null;
  const taskAudios = {};

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (file.fieldname.startsWith('task_audio_')) {
        const taskNum = file.fieldname.replace('task_audio_', '');
        taskAudios[taskNum] = `/uploads/audio/${file.filename}`;
        if (!audioFile) {
          audioFile = file.filename;
          audioUrl = `/uploads/audio/${file.filename}`;
        }
      } else if (file.fieldname === 'audio_file' && !audioFile) {
        audioFile = file.filename;
        audioUrl = `/uploads/audio/${file.filename}`;
      }
    }
    // Fallback to first uploaded file if not set
    if (!audioFile && req.files[0]) {
      audioFile = req.files[0].filename;
      audioUrl = `/uploads/audio/${req.files[0].filename}`;
    }
  } else {
    audioFile = 'demo-recording.webm';
    audioUrl = '/uploads/audio/demo-recording.webm';
  }

  let selfAssessment = {};
  try {
    selfAssessment = typeof req.body.self_assessment === 'string'
      ? JSON.parse(req.body.self_assessment)
      : (req.body.self_assessment || {});
  } catch (e) {
    selfAssessment = {};
  }

  if (Object.keys(taskAudios).length > 0) {
    selfAssessment.task_audio_urls = taskAudios;
  }

  const submission = DAL.saveSubmission({
    userId: user.id,
    unitId: unitId,
    assessmentType,
    audioFilePath: audioFile,
    audioUrl,
    durationSeconds,
    selfAssessment
  });

  // Automatically update progress for this unit
  DAL.updateProgress(user.id, unitId, {
    status: 'completed',
    current_sub_section: 'completed'
  });

  res.status(201).json({ success: true, submission });
});

// --- EVALUATIONS (25-POINT SPEAKING RUBRIC) ---
app.post('/api/grades', (req, res) => {
  const submissionId = req.body.submissionId || req.body.submission_id;
  const rawRater = String(req.body.raterType || req.body.rater_id || req.body.rater_role || 'instructor').toLowerCase();
  
  let raterRole = 'instructor';
  let raterUsername = 'instructor';
  if (rawRater.includes('2') || rawRater.includes('rater') || rawRater.includes('b')) {
    raterRole = 'rater';
    raterUsername = 'rater';
  } else {
    raterRole = 'instructor';
    raterUsername = 'instructor';
  }

  const scores = req.body.scores || {};
  const strengths = req.body.strengths || '';
  const areasForImprovement = req.body.areasForImprovement || req.body.improvements || '';
  const suggestions = req.body.suggestions || req.body.comments || '';

  // Find rater user
  const rater = DAL.getUserByUsername(raterUsername) || 
    DAL.getUserByUsername(raterRole === 'rater' ? 'rater2' : 'rater1') || 
    DAL.getUserByUsername('admin');

  // Find submission
  let sub = null;
  if (submissionId) {
    sub = DAL.getSubmissionById(submissionId);
  }
  if (!sub) {
    // Fall back to most recent submission or create demo
    const allSubs = DAL.getSubmissions();
    sub = allSubs[0];
  }

  if (!sub) {
    return res.status(404).json({ error: 'No submissions found to grade' });
  }

  const evals = DAL.saveEvaluation({
    submissionId: sub.id,
    raterId: req.body.raterId || (rater ? rater.id : 'usr_instructor'),
    raterRole: req.body.raterRole || raterRole,
    taskAchievement: req.body.taskAchievement,
    interactiveComm: req.body.interactiveComm,
    vocabulary: req.body.vocabulary,
    grammar: req.body.grammar,
    pronunciationFluency: req.body.pronunciationFluency,
    scores,
    strengths,
    areasForImprovement,
    suggestions
  });

  res.json({ success: true, evaluations: evals });
});

// --- EXPERT COMMITTEE EVALUATION FORM ---
app.get('/api/expert-eval', (req, res) => {
  const evals = DAL.getExpertEvaluations();
  res.json(evals);
});

app.post('/api/expert-eval', (req, res) => {
  const {
    expertId,
    contentQuality,
    languageAppropriateness,
    learningActivities,
    interfaceQuality,
    overallAppropriateness,
    comments
  } = req.body;

  const expert = expertId ? DAL.getUserById(expertId) : DAL.getUserByUsername('expert');

  const result = DAL.saveExpertEvaluation({
    expertId: expert ? expert.id : 'usr_expert_prof',
    contentQuality: Number(contentQuality) || 5,
    languageAppropriateness: Number(languageAppropriateness) || 5,
    learningActivities: Number(learningActivities) || 5,
    interfaceQuality: Number(interfaceQuality) || 5,
    overallAppropriateness: Number(overallAppropriateness) || 5,
    comments: comments || ''
  });

  res.json({ success: true, evaluation: result });
});

// --- SPSS / JAMOVI DATASET EXPORT ---
app.get('/api/export/spss', (req, res) => {
  const dataset = DAL.getSPSSDataset();
  const headers = [
    'Participant_ID',
    'Blind_Mask_Code',
    'Unit_ID',
    'Assessment_Type',
    'Submitted_At',
    'Duration_Seconds',
    'R1_Task_Achievement',
    'R1_Interactive_Comm',
    'R1_Vocabulary',
    'R1_Grammar',
    'R1_Pronunciation_Fluency',
    'R1_Total_25',
    'R1_Percentage',
    'R2_Task_Achievement',
    'R2_Interactive_Comm',
    'R2_Vocabulary',
    'R2_Grammar',
    'R2_Pronunciation_Fluency',
    'R2_Total_25',
    'R2_Percentage',
    'Score_Difference_Pts',
    'Difference_Exceeds_20Pct',
    'Rater1_Notes',
    'Rater2_Notes'
  ];

  const clean = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const rows = dataset.map(row => [
    clean(row.participant_id),
    clean(row.blind_mask_code),
    clean(row.unit_id),
    clean(row.assessment_type),
    clean(row.submitted_at),
    row.duration_seconds || 0,
    row.r1_task,
    row.r1_comm,
    row.r1_lex,
    row.r1_gram,
    row.r1_pron,
    row.r1_total,
    row.r1_pct,
    row.r2_task,
    row.r2_comm,
    row.r2_lex,
    row.r2_gram,
    row.r2_pron,
    row.r2_total,
    row.r2_pct,
    row.score_diff,
    clean(row.diff_flag),
    clean(row.r1_notes),
    clean(row.r2_notes)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="TECHQUEST_SPSS_Dataset.csv"');
  res.status(200).send(csvContent);
});

// Export User Credentials CSV
app.get('/api/export/credentials', (req, res) => {
  const rootCsv = path.join(__dirname, '..', 'techquest_users_credentials.csv');
  const dataCsv = path.join(__dirname, 'data', 'techquest_users_credentials.csv');
  const targetPath = fs.existsSync(rootCsv) ? rootCsv : dataCsv;

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ error: 'Credentials CSV not found. Please run seed script first.' });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="techquest_users_credentials.csv"');
  res.download(targetPath, 'techquest_users_credentials.csv');
});

// Serve direct slides folder from client/public/slides so newly dropped slides work immediately
const CLIENT_PUBLIC_SLIDES = path.join(__dirname, '..', 'client', 'public', 'slides');
if (fs.existsSync(CLIENT_PUBLIC_SLIDES)) {
  app.use('/slides', express.static(CLIENT_PUBLIC_SLIDES));
}

// Serve compiled client frontend
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/slides')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Start Server with graceful fallback (e.g. if macOS AirPlay is using 5000)
function startServer(targetPort) {
  const server = app.listen(targetPort, () => {
    console.log(`TECHQUEST Server running on http://localhost:${targetPort}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = targetPort === 5000 ? 5001 : targetPort + 1;
      console.warn(`[Server] Port ${targetPort} is occupied. Retrying on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('[Server] Startup error:', err);
    }
  });
}

startServer(Number(PORT));
