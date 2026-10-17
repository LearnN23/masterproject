import glob
import os
import wave
import struct
import math

def clean_audio_tail(file_path):
    with wave.open(file_path, 'rb') as w:
        nchannels = w.getnchannels()
        sampwidth = w.getsampwidth()
        framerate = w.getframerate()
        nframes = w.getnframes()
        data = w.readframes(nframes)

    samples = list(struct.unpack(f'<{nframes * nchannels}h', data))
    
    # 5ms window
    win_len = int(framerate * 0.005) * nchannels
    num_windows = len(samples) // win_len

    # Scan backwards from the end to detect where the burst begins
    in_noise = False
    cut_sample_index = len(samples)

    for i in range(num_windows - 1, -1, -1):
        win = samples[i * win_len : (i + 1) * win_len]
        rms = math.sqrt(sum(s * s for s in win) / len(win)) if win else 0
        if rms > 500:
            in_noise = True
        elif in_noise and rms < 100:
            # We found the silence dip right before the noise burst!
            # Cut right at this window end
            cut_sample_index = (i + 1) * win_len
            break

    if not in_noise:
        print(f"Skipping {file_path}: No noise burst detected.")
        return False

    # Retain the samples up to cut_sample_index
    trimmed_samples = samples[:cut_sample_index]

    # Apply a 15ms linear fade-out to zero at the new end to prevent clicks
    fade_len = int(framerate * 0.015) * nchannels
    if len(trimmed_samples) > fade_len:
        for idx in range(fade_len):
            factor = (fade_len - idx) / fade_len
            sample_pos = len(trimmed_samples) - fade_len + idx
            trimmed_samples[sample_pos] = int(trimmed_samples[sample_pos] * factor)

    # Pack back into bytes
    packed_data = struct.pack(f'<{len(trimmed_samples)}h', *trimmed_samples)

    # Save cleanly
    with wave.open(file_path, 'wb') as w:
        w.setnchannels(nchannels)
        w.setsampwidth(sampwidth)
        w.setframerate(framerate)
        w.writeframes(packed_data)

    trimmed_ms = ((len(samples) - len(trimmed_samples)) / (framerate * nchannels)) * 1000
    print(f"Trimmed {os.path.basename(file_path)}: cut {trimmed_ms:.1f}ms noise tail.")
    return True

def main():
    target_files = sorted(
        glob.glob('client/public/audio_prompts/*.wav') +
        glob.glob('client/public/audio_turns/*.wav')
    )
    print(f"Found {len(target_files)} audio files to process.")
    
    count = 0
    for file_path in target_files:
        if clean_audio_tail(file_path):
            count += 1
            
    print(f"\nSuccessfully trimmed and smoothed {count} audio files!")

if __name__ == '__main__':
    main()
