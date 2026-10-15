const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'uploads', 'audio');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Generate a valid 2-second WAV file with a soft tone
const sampleRate = 8000;
const duration = 2;
const numSamples = sampleRate * duration;
const blockAlign = 2;
const byteRate = sampleRate * blockAlign;
const dataSize = numSamples * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM format
buffer.writeUInt16LE(1, 22); // Mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // 16-bit
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate gentle 440Hz sine wave tone
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const sample = Math.sin(2 * Math.PI * 440 * t) * 0.2 * 32767;
  buffer.writeInt16LE(Math.round(sample), 44 + i * 2);
}

fs.writeFileSync(path.join(dir, 'demo-sample.webm'), buffer);
fs.writeFileSync(path.join(dir, 'sarah_prompt.wav'), buffer);
console.log('Sample audio files created successfully.');
