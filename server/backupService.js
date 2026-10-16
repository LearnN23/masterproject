const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { db, DAL } = require('./db');

/**
 * Creates a comprehensive, self-contained research backup ZIP archive:
 * 1. Safe SQLite checkpoint (PRAGMA wal_checkpoint(TRUNCATE))
 * 2. SQLite database (techquest.db)
 * 3. Fresh SPSS / Jamovi CSV dataset
 * 4. Participant credentials & cohort roster CSV
 * 5. All student audio recordings (raw + organized by candidate code)
 * 6. Audio mapping audit manifest (audio_manifest.csv)
 * 7. README_AUDIT_GUIDE.txt and backup_metadata.json
 *
 * @param {string|null} destZipPath - Output zip file path (optional)
 * @returns {object} Backup summary info
 */
function createResearchBackupArchive(destZipPath = null) {
  // 1. Force SQLite WAL checkpoint to ensure all data is written to disk
  try {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  } catch (e) {
    console.warn('[Backup] WAL checkpoint warning:', e.message);
  }

  const tempDir = path.join(__dirname, `_temp_backup_${Date.now()}`);
  
  if (!destZipPath) {
    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    const dateStr = new Date().toISOString().slice(0, 10);
    destZipPath = path.join(backupsDir, `TECHQUEST_Research_Backup_${dateStr}_${Date.now()}.zip`);
  }

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    // Subdirectories inside archive
    const dbSubdir = path.join(tempDir, 'database');
    const statsSubdir = path.join(tempDir, 'statistics');
    const participantsSubdir = path.join(tempDir, 'participants');
    const audioRawSubdir = path.join(tempDir, 'audio_recordings', 'raw');
    const audioOrgSubdir = path.join(tempDir, 'audio_recordings', 'organized_by_candidate');

    fs.mkdirSync(dbSubdir, { recursive: true });
    fs.mkdirSync(statsSubdir, { recursive: true });
    fs.mkdirSync(participantsSubdir, { recursive: true });
    fs.mkdirSync(audioRawSubdir, { recursive: true });
    fs.mkdirSync(audioOrgSubdir, { recursive: true });

    // 2. Copy Database
    const srcDb = path.join(__dirname, 'data', 'techquest.db');
    if (fs.existsSync(srcDb)) {
      fs.copyFileSync(srcDb, path.join(dbSubdir, 'techquest.db'));
    }

    // 3. Export SPSS / Jamovi Dataset
    const spssData = DAL.getSPSSDataset();
    const headers = [
      'Participant_ID', 'Blind_Mask_Code', 'Unit_ID', 'Assessment_Type', 'Submitted_At', 'Duration_Seconds',
      'R1_Task_Achievement', 'R1_Interactive_Comm', 'R1_Vocabulary', 'R1_Grammar', 'R1_Pronunciation_Fluency', 'R1_Total_25', 'R1_Percentage',
      'R2_Task_Achievement', 'R2_Interactive_Comm', 'R2_Vocabulary', 'R2_Grammar', 'R2_Pronunciation_Fluency', 'R2_Total_25', 'R2_Percentage',
      'Score_Difference_Pts', 'Difference_Exceeds_20Pct', 'Is_Calibrated', 'Calibration_Notes', 'Rater1_Notes', 'Rater2_Notes'
    ];
    const clean = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const spssRows = spssData.map(row => [
      clean(row.participant_id), clean(row.blind_mask_code), clean(row.unit_id), clean(row.assessment_type), clean(row.submitted_at),
      row.duration_seconds || 0,
      row.r1_task, row.r1_comm, row.r1_lex, row.r1_gram, row.r1_pron, row.r1_total, row.r1_pct,
      row.r2_task, row.r2_comm, row.r2_lex, row.r2_gram, row.r2_pron, row.r2_total, row.r2_pct,
      row.score_diff, clean(row.diff_flag), clean(row.is_calibrated), clean(row.calibration_notes), clean(row.r1_notes), clean(row.r2_notes)
    ].join(','));
    const spssCsv = [headers.join(','), ...spssRows].join('\r\n');
    fs.writeFileSync(path.join(statsSubdir, 'TECHQUEST_SPSS_Dataset.csv'), spssCsv, 'utf8');

    // 4. Export Participant Roster & Credentials
    const users = db.prepare('SELECT id, username, name, participant_code, role, cohort_group, created_at FROM users ORDER BY participant_code ASC').all();
    const userHeaders = ['User_ID', 'Participant_Code', 'Full_Name', 'Username', 'Assigned_Role', 'Cohort_Group', 'Account_Created_At'];
    const userRows = users.map(u => [
      clean(u.id), clean(u.participant_code), clean(u.name), clean(u.username), clean(u.role), clean(u.cohort_group), clean(u.created_at)
    ].join(','));
    fs.writeFileSync(path.join(participantsSubdir, 'research_participants_roster.csv'), [userHeaders.join(','), ...userRows].join('\r\n'), 'utf8');

    // 5. Copy Audio Recordings & Generate Audio Manifest
    const submissions = db.prepare(`
      SELECT s.*, u.name as student_name, u.participant_code, u.cohort_group,
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
      ORDER BY u.participant_code ASC, s.submitted_at ASC
    `).all();

    const uploadsDir = path.join(__dirname, 'uploads', 'audio');
    const manifestHeaders = [
      'Participant_Code', 'Student_Name', 'Cohort_Group', 'Unit_ID', 'Unit_Title',
      'Assessment_Type', 'Duration_Seconds', 'Submitted_At', 'Raw_Filename', 'Organized_Filename', 'Audio_Status'
    ];

    const manifestRows = [];
    let audioFilesCopied = 0;

    for (const sub of submissions) {
      let rawFilename = '';
      if (sub.audio_file_path) {
        rawFilename = path.basename(sub.audio_file_path);
      } else if (sub.audio_url) {
        rawFilename = path.basename(sub.audio_url);
      }

      const srcAudioPath = rawFilename ? path.join(uploadsDir, rawFilename) : null;
      const fileExists = srcAudioPath && fs.existsSync(srcAudioPath);

      const ext = rawFilename ? path.extname(rawFilename) || '.webm' : '.webm';
      const safeName = (sub.student_name || 'student').replace(/[^a-zA-Z0-9]/g, '_');
      const safeUnit = (sub.unit_id || 'unit').replace(/[^a-zA-Z0-9]/g, '_');
      const organizedFilename = `${sub.participant_code || 'CODE'}_${safeUnit}_${safeName}${ext}`;

      if (fileExists) {
        fs.copyFileSync(srcAudioPath, path.join(audioRawSubdir, rawFilename));
        fs.copyFileSync(srcAudioPath, path.join(audioOrgSubdir, organizedFilename));
        audioFilesCopied++;
      }

      manifestRows.push([
        clean(sub.participant_code),
        clean(sub.student_name),
        clean(sub.cohort_group),
        clean(sub.unit_id),
        clean(sub.unit_title),
        clean(sub.assessment_type),
        sub.duration_seconds || 0,
        clean(sub.submitted_at),
        clean(rawFilename),
        clean(organizedFilename),
        fileExists ? 'AVAILABLE' : 'FILE_NOT_FOUND'
      ].join(','));
    }

    const manifestCsv = [manifestHeaders.join(','), ...manifestRows].join('\r\n');
    // Save manifest in audio_recordings and root for quick reference
    fs.writeFileSync(path.join(tempDir, 'audio_recordings', 'audio_manifest.csv'), manifestCsv, 'utf8');
    fs.writeFileSync(path.join(tempDir, 'audio_manifest.csv'), manifestCsv, 'utf8');

    // Also preserve any remaining audio files in uploads/audio (e.g. demos)
    if (fs.existsSync(uploadsDir)) {
      const allUploadFiles = fs.readdirSync(uploadsDir);
      for (const f of allUploadFiles) {
        const dest = path.join(audioRawSubdir, f);
        if (!fs.existsSync(dest) && !f.startsWith('.')) {
          try {
            fs.copyFileSync(path.join(uploadsDir, f), dest);
          } catch (_) {}
        }
      }
    }

    // 6. Metadata Manifest & Committee Audit Guide
    const backupMetadata = {
      researchTitle: "TECHQUEST: Web-based EOP Learning Module for IT Technical Support",
      researcher: "Nasroh",
      degree: "Master's Thesis in English for Specific Purposes / IT Education",
      backupTimestamp: new Date().toISOString(),
      databaseEngine: "SQLite 3 WAL Mode",
      totalParticipants: users.length,
      totalSubmissions: submissions.length,
      audioFilesArchived: audioFilesCopied,
      archiveContents: {
        database: "SQLite master data file (techquest.db)",
        statistics: "Complete statistical callset (SPSS / Jamovi ready CSV)",
        participants: "Full participant code & cohort mapping table",
        audioRecordings: "All participant oral responses with audio_manifest.csv mapping"
      }
    };
    fs.writeFileSync(path.join(tempDir, 'backup_metadata.json'), JSON.stringify(backupMetadata, null, 2), 'utf8');

    const readmeText = `================================================================================
TECHQUEST RESEARCH DATA & AUDIO ARCHIVE
Master's Thesis Quasi-Experimental Study
================================================================================
Generated At: ${new Date().toLocaleString()} (${new Date().toISOString()})
Researcher: Nasroh

CONTENTS SUMMARY:
-----------------
1. /database/techquest.db
   - Authoritative SQLite database containing all research tables:
     users, research_consent, lessons, student_progress, submissions,
     evaluations (dual-rater 25-point rubrics), expert_evaluations.

2. /statistics/TECHQUEST_SPSS_Dataset.csv
   - Comprehensive tabular dataset formatted for direct import into IBM SPSS
     or Jamovi for Chapter 4 statistical analysis (paired t-test, Cohen's d, ICC).

3. /audio_recordings/
   - /raw/ : Original timestamped voice recording files (.webm / .wav).
   - /organized_by_candidate/ : Renamed audio files using participant codes:
     [ParticipantCode]_[UnitID]_[StudentName].webm
   - audio_manifest.csv : Complete audit trail linking every audio file
     to candidate ID, prompt, and submission timestamp.

4. /participants/research_participants_roster.csv
   - Participant codes, assigned cohort groups, and account dates.

HOW TO AUDIT STUDENT ORAL SUBMISSIONS:
-------------------------------------
1. Open 'audio_manifest.csv' in Excel or Numbers.
2. Filter by Participant_Code (e.g., STU-1001) or Unit_ID (section_0 = Pre-test, section_9 = Post-test).
3. Open the corresponding audio recording in /audio_recordings/organized_by_candidate/ to listen.
================================================================================
`;
    fs.writeFileSync(path.join(tempDir, 'README_AUDIT_GUIDE.txt'), readmeText, 'utf8');

    // 7. Create ZIP archive using native zip
    const parentDir = path.dirname(destZipPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // Zip contents from inside tempDir
    execFileSync('/usr/bin/zip', ['-r', '-q', destZipPath, '.'], { cwd: tempDir });

    return {
      success: true,
      zipPath: destZipPath,
      zipFilename: path.basename(destZipPath),
      sizeBytes: fs.statSync(destZipPath).size,
      totalParticipants: users.length,
      totalSubmissions: submissions.length,
      audioFilesCopied
    };
  } finally {
    // Clean up temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.warn('[Backup] Temp cleanup error:', e.message);
    }
  }
}

module.exports = {
  createResearchBackupArchive
};
