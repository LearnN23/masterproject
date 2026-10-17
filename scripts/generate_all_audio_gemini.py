#!/usr/bin/env python3
"""
Master Audio Generator for TechQuest ESP Module
Generates studio-quality AI voices using Gemini 3.8 Flash TTS / 3.1 Flash TTS
with Round-Robin Key Rotation across all keys in .env.
"""

import os
import sys
import json
import time
import wave
from dotenv import load_dotenv

load_dotenv('.env')

# Load all Gemini keys from .env
KEYS = []
for i in range(1, 10):
    k = os.getenv(f'GEMINI_API_KEY_{i}')
    if k and k.strip():
        KEYS.append(k.strip())

if not KEYS:
    # Try generic GEMINI_API_KEY
    k = os.getenv('GEMINI_API_KEY')
    if k:
        KEYS.append(k.strip())

if not KEYS:
    print("Error: No GEMINI_API_KEY found in .env")
    sys.exit(1)

print(f"[Gemini TTS] Loaded {len(KEYS)} API Keys from .env successfully.")

from google import genai
from google.genai import types

# Voice character assignment
VOICE_MAP = {
    # Customers / Callers
    'Chew Wei Lun': 'Puck',
    'Lim Teck Seng': 'Charon',
    'Marcus Henderson': 'Fenrir',
    'David Tan': 'Puck',
    'Arun Patel': 'Charon',
    'Catherine Wong': 'Aoede',
    'Sarah': 'Aoede',
    'Customer (Sarah)': 'Aoede',
    'Customer': 'Charon',
    'Customer (David Miller)': 'Fenrir',
    'Customer (Remote)': 'Puck',
    'Caller (Field Sales)': 'Kore',
    'VIP Enterprise Client': 'Charon',
    'European Desk Lead Julian': 'Fenrir',
    
    # Agents / Leads
    'Shift Lead Sarah': 'Kore',
    'Agent (Golf)': 'Puck',
    'Agent (Pear)': 'Aoede',
    'Agent (Alex)': 'Charon',
    'Agent (Nadia)': 'Kore',
    'Agent (Mei)': 'Aoede',
    'Student Agent': 'Puck',
    'Agent': 'Puck',
}

def get_voice(speaker_name, default_is_agent=False):
    for k, v in VOICE_MAP.items():
        if k.lower() in speaker_name.lower():
            return v
    # Fallback heuristic
    if 'sarah' in speaker_name.lower() or 'catherine' in speaker_name.lower() or 'pear' in speaker_name.lower() or 'mei' in speaker_name.lower():
        return 'Aoede'
    if default_is_agent:
        return 'Puck'
    return 'Charon'

key_counter = 0

def generate_pcm(text, voice_name, max_retries=3):
    global key_counter
    models_to_try = ['gemini-3.8-flash-tts', 'gemini-3.1-flash-tts-preview', 'gemini-2.5-flash-preview-tts']
    
    for attempt in range(max_retries * len(KEYS)):
        current_key = KEYS[key_counter % len(KEYS)]
        key_num = (key_counter % len(KEYS)) + 1
        key_counter += 1
        
        client = genai.Client(api_key=current_key)
        
        for model in models_to_try:
            try:
                # Clean text of markdown/quotes
                clean_text = text.replace('"', '').replace("'", "'").strip()
                res = client.models.generate_content(
                    model=model,
                    contents=clean_text,
                    config=types.GenerateContentConfig(
                        response_modalities=['AUDIO'],
                        speech_config=types.SpeechConfig(
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name=voice_name
                                )
                            )
                        )
                    )
                )
                
                for part in res.candidates[0].content.parts:
                    if part.inline_data and part.inline_data.data:
                        return part.inline_data.data
            except Exception as e:
                err_str = str(e)
                if 'RESOURCE_EXHAUSTED' in err_str or '429' in err_str:
                    print(f"  [Key {key_num}] Rate limit hit on {model}. Rotating to next key...")
                    time.sleep(1.5)
                    break # try next key
                elif 'INVALID_ARGUMENT' in err_str:
                    continue # try next model
                else:
                    print(f"  [Key {key_num}] Warning: {e}")
                    time.sleep(1.0)
                    break
        time.sleep(1.5)
        
    raise RuntimeError(f"Failed to generate audio for text: {text[:40]}...")

import struct
import math

def save_wav(pcm_data_list, output_filepath, sample_rate=24000):
    os.makedirs(os.path.dirname(output_filepath), exist_ok=True)
    raw_bytes = b''.join(pcm_data_list)
    nframes = len(raw_bytes) // 2
    samples = list(struct.unpack(f'<{nframes}h', raw_bytes))

    # Detect and trim trailing static noise burst
    win_len = int(sample_rate * 0.005) # 5ms window
    num_windows = len(samples) // win_len
    in_noise = False
    cut_idx = len(samples)

    for i in range(num_windows - 1, -1, -1):
        win = samples[i * win_len : (i + 1) * win_len]
        rms = math.sqrt(sum(s * s for s in win) / len(win)) if win else 0
        if rms > 500:
            in_noise = True
        elif in_noise and rms < 100:
            cut_idx = (i + 1) * win_len
            break

    if in_noise:
        samples = samples[:cut_idx]

    # Apply 15ms linear fade-out to prevent clicks
    fade_len = int(sample_rate * 0.015)
    if len(samples) > fade_len:
        for idx in range(fade_len):
            factor = (fade_len - idx) / fade_len
            pos = len(samples) - fade_len + idx
            samples[pos] = int(samples[pos] * factor)

    trimmed_bytes = struct.pack(f'<{len(samples)}h', *samples)

    with wave.open(output_filepath, 'wb') as wf:
        wf.setnchannels(1)      # mono
        wf.setsampwidth(2)      # 16-bit
        wf.setframerate(sample_rate)
        wf.writeframes(trimmed_bytes)
    size_kb = os.path.getsize(output_filepath) / 1024
    print(f"  [SAVED & TRIMMED] {output_filepath} ({size_kb:.1f} KB)")

def main():
    with open('scripts/audio_generation_manifest.json') as f:
        manifest = json.load(f)
        
    silence_0_6s = b'\x00\x00' * int(24000 * 0.6)
    
    # ----------------------------------------------------
    # 1. PRE-TEST CUSTOMER PROMPTS (4 files)
    # ----------------------------------------------------
    print("\n==================================================")
    print("1. GENERATING PRE-TEST AUDIO PROMPTS (FORM A)")
    print("==================================================")
    pre_voices = ['Puck', 'Charon', 'Fenrir', 'Kore']
    for idx, item in enumerate(manifest['pre_test']):
        t_num = item['taskNumber']
        text = item['customerPromptText']
        voice = pre_voices[idx % len(pre_voices)]
        out_path = f"client/public/audio_prompts/pre_test_task_{t_num}.wav"
        print(f"\nTask {t_num} (Voice: {voice}): \"{text[:60]}...\"")
        pcm = generate_pcm(text, voice)
        save_wav([pcm], out_path)
        time.sleep(1.5)

    # ----------------------------------------------------
    # 2. POST-TEST CUSTOMER PROMPTS (4 files)
    # ----------------------------------------------------
    print("\n==================================================")
    print("2. GENERATING POST-TEST AUDIO PROMPTS (FORM B)")
    print("==================================================")
    post_voices = ['Puck', 'Charon', 'Aoede', 'Fenrir']
    for idx, item in enumerate(manifest['post_test']):
        t_num = item['taskNumber']
        text = item['customerPromptText']
        voice = post_voices[idx % len(post_voices)]
        out_path = f"client/public/audio_prompts/post_test_task_{t_num}.wav"
        print(f"\nTask {t_num} (Voice: {voice}): \"{text[:60]}...\"")
        pcm = generate_pcm(text, voice)
        save_wav([pcm], out_path)
        time.sleep(1.5)

    # ----------------------------------------------------
    # 3. LOOP TASKS (LESSONS 1-8) MODEL DIALOGUES & TURNS
    # ----------------------------------------------------
    print("\n==================================================")
    print("3. GENERATING LOOP TASKS 1-8 DIALOGUES & TURNS")
    print("==================================================")
    for lesson_num in range(1, 9):
        turns = manifest['loop_tasks'].get(str(lesson_num), [])
        print(f"\n--- Generating Lesson {lesson_num} ({len(turns)} turns) ---")
        
        dialogue_frames = []
        for t_idx, turn in enumerate(turns):
            turn_num = turn.get('turn', t_idx + 1)
            speaker = turn.get('speaker', 'Speaker')
            text = turn.get('text', '')
            
            is_agent = ('agent' in speaker.lower() or 'golf' in speaker.lower() or 
                        'pear' in speaker.lower() or 'alex' in speaker.lower() or 
                        'nadia' in speaker.lower() or 'mei' in speaker.lower())
            
            voice = get_voice(speaker, default_is_agent=is_agent)
            print(f"  Lesson {lesson_num} Turn {turn_num} ({speaker} -> {voice}): \"{text[:50]}...\"")
            
            pcm = generate_pcm(text, voice)
            
            # Save individual turn audio for student practice turn playback
            turn_path = f"client/public/audio_turns/lesson_{lesson_num}_turn_{turn_num}.wav"
            save_wav([pcm], turn_path)
            
            dialogue_frames.append(pcm)
            if t_idx < len(turns) - 1:
                dialogue_frames.append(silence_0_6s)
            
            time.sleep(1.5)
            
        # Save complete blended model dialogue for loop task
        os.makedirs("client/public/audio_loop_dialogue", exist_ok=True)
        full_dialogue_path = f"client/public/audio_loop_dialogue/lesson_{lesson_num}_dialogue.wav"
        save_wav(dialogue_frames, full_dialogue_path)
        
    print("\n==================================================")
    print("ALL AUDIO GENERATION COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == '__main__':
    main()
