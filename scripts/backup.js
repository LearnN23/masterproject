#!/usr/bin/env node

/**
 * TECHQUEST Research Snapshot & Backup Utility
 * Usage: npm run backup
 */

const path = require('path');
const { createResearchBackupArchive } = require('../server/backupService');

console.log('================================================================');
console.log('TECHQUEST: Creating Research Data & Audio Backup Archive...');
console.log('================================================================');

try {
  const result = createResearchBackupArchive();
  const sizeMb = (result.sizeBytes / (1024 * 1024)).toFixed(2);
  
  console.log('✓ Checkpointed SQLite WAL data to disk.');
  console.log(`✓ Backed up SQLite database (techquest.db).`);
  console.log(`✓ Exported SPSS / Jamovi statistical dataset.`);
  console.log(`✓ Exported research participants roster.`);
  console.log(`✓ Preserved ${result.audioFilesCopied} student audio recording(s).`);
  console.log(`✓ Generated human-readable audio audit manifest (audio_manifest.csv).`);
  console.log('----------------------------------------------------------------');
  console.log(`Archive Created Successfully:`);
  console.log(`  File: ${result.zipFilename}`);
  console.log(`  Path: ${result.zipPath}`);
  console.log(`  Size: ${sizeMb} MB (${result.sizeBytes} bytes)`);
  console.log('================================================================');
} catch (err) {
  console.error('❌ Backup failed:', err);
  process.exit(1);
}
