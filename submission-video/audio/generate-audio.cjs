/**
 * Generates main-audio.wav for the Condition Trace submission film.
 *
 * Pure Node.js WAV PCM — no external dependencies.
 * 44100 Hz / 16-bit / stereo / 31 seconds
 *
 * Sound design:
 *   0–2.5s   Title card: atmospheric drone fade-in
 *   3s       Opening state: ambient hold
 *   6s       Records step: soft UI ping
 *   8.5s     Inspect step: soft UI ping
 *   10s–15s  Raking light: low sweep texture
 *   15s      Crack confirmed: qualified tonal accent (minor)
 *   17.5s    Mark feature: soft UI ping
 *   20s      Compare: soft UI ping
 *   22.5s    Finding: soft chime
 *   25.5s    Drawer open: paper-click transient
 *   29s      End frame: soft resolution chord (A minor)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SR = 44100;
const CHANNELS = 2;
const DURATION = 31;
const N = SR * DURATION;

// Float32 stereo interleaved buffer
const buf = new Float32Array(N * CHANNELS);

// ── Primitives ─────────────────────────────────────────────────────────────

function sine(t, freq, amp, dur, fadeIn = 0.05, fadeOut = 0.1) {
  const start = Math.floor(t * SR);
  const len = Math.floor(dur * SR);
  const fi = Math.max(1, Math.floor(fadeIn * SR));
  const fo = Math.max(1, Math.floor(fadeOut * SR));
  for (let i = 0; i < len && (start + i) < N; i++) {
    const env = Math.min(1, i / fi) * Math.min(1, (len - i) / fo);
    const v = amp * Math.sin(2 * Math.PI * freq * i / SR) * env;
    buf[(start + i) * 2]     += v;
    buf[(start + i) * 2 + 1] += v * 0.97;
  }
}

function noise(t, amp, dur, fadeIn = 0.005, fadeOut = 0.05) {
  const start = Math.floor(t * SR);
  const len = Math.floor(dur * SR);
  const fi = Math.max(1, Math.floor(fadeIn * SR));
  const fo = Math.max(1, Math.floor(fadeOut * SR));
  for (let i = 0; i < len && (start + i) < N; i++) {
    const env = Math.min(1, i / fi) * Math.min(1, (len - i) / fo);
    const l = amp * (Math.random() * 2 - 1) * env;
    const r = amp * (Math.random() * 2 - 1) * env;
    buf[(start + i) * 2]     += l;
    buf[(start + i) * 2 + 1] += r;
  }
}

// Frequency-sweep tone (analog-like raking-light texture)
function sweep(t, dur, ampStart, ampEnd, freqStart, freqEnd, fadeIn = 0.1, fadeOut = 0.6) {
  const start = Math.floor(t * SR);
  const len = Math.floor(dur * SR);
  const fi = Math.max(1, Math.floor(fadeIn * SR));
  const fo = Math.max(1, Math.floor(fadeOut * SR));
  let phase = 0;
  for (let i = 0; i < len && (start + i) < N; i++) {
    const p = i / len;
    const freq = freqStart + (freqEnd - freqStart) * p;
    const amp = (ampStart + (ampEnd - ampStart) * p);
    const env = Math.min(1, i / fi) * Math.min(1, (len - i) / fo);
    phase += 2 * Math.PI * freq / SR;
    const v = amp * Math.sin(phase) * env;
    buf[(start + i) * 2]     += v;
    buf[(start + i) * 2 + 1] += v * 0.9;
  }
}

// Soft ping: 1200Hz + octave
function ping(t, amp = 0.022) {
  sine(t, 1200, amp,        0.18, 0.003, 0.14);
  sine(t,  600, amp * 0.5,  0.24, 0.003, 0.20);
}

// ── SOUND DESIGN ───────────────────────────────────────────────────────────

// Continuous background: espresso-room drone (very quiet)
sine(0, 55,  0.0045, 31, 2.0, 2.0);
sine(0, 110, 0.0030, 31, 2.0, 2.0);
sine(0, 165, 0.0015, 31, 2.0, 2.0);

// Sub-noise floor texture
noise(0, 0.0025, 31, 3.0, 3.0);

// Title card (0–2.5s): ambient texture swells in
sine(0, 440, 0.006, 2.5, 1.8, 0.4);
sine(0, 660, 0.003, 2.5, 1.8, 0.5);

// Step pings: records (6s), inspect (8.5s), mark (17.5s), compare (20s)
for (const t of [6.0, 8.5, 17.5, 20.0]) {
  ping(t);
}

// Finding step (22.5s): slightly warmer ping
sine(22.5,  880, 0.016, 0.30, 0.005, 0.25);
sine(22.5,  440, 0.010, 0.40, 0.005, 0.35);
sine(22.5, 1320, 0.007, 0.20, 0.005, 0.16);

// Raking light texture (10s → 15s): rising sweep
sweep(10.0, 5.0, 0.007, 0.003, 90,  320, 0.15, 0.8);
sweep(10.5, 4.0, 0.004, 0.001, 150, 480, 0.15, 0.7);

// Crack confirmed (15s): observational A-minor accent
sine(15.0, 220, 0.013, 1.8, 0.06, 1.0);
sine(15.0, 330, 0.008, 1.5, 0.06, 0.9);
sine(15.05, 261.6, 0.005, 1.2, 0.06, 0.8); // C4 for minor colour

// Drawer open (25.5s): paper-click transient + short settle
noise(25.50, 0.055, 0.035, 0.001, 0.030);
noise(25.55, 0.018, 0.080, 0.002, 0.070);

// End frame resolution chord (29s): A minor, soft and reflective
// A2=110, E3=165, A3=220, C4=261, E4=330
sine(29.0, 110, 0.011, 2.8, 0.20, 1.6);
sine(29.0, 165, 0.009, 2.8, 0.22, 1.6);
sine(29.0, 220, 0.013, 2.8, 0.22, 1.6);
sine(29.0, 261.6, 0.006, 2.5, 0.20, 1.5);
sine(29.0, 330, 0.007, 2.5, 0.22, 1.5);

// ── NORMALIZE ──────────────────────────────────────────────────────────────
let peak = 0;
for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i]));
const gain = 0.88 / (peak || 1);
for (let i = 0; i < buf.length; i++) buf[i] *= gain;

// ── WRITE WAV ──────────────────────────────────────────────────────────────
const dataLen = N * CHANNELS * 2;
const wavBuf = Buffer.alloc(44 + dataLen);

wavBuf.write('RIFF', 0);
wavBuf.writeUInt32LE(36 + dataLen, 4);
wavBuf.write('WAVE', 8);
wavBuf.write('fmt ', 12);
wavBuf.writeUInt32LE(16, 16);
wavBuf.writeUInt16LE(1, 20);          // PCM
wavBuf.writeUInt16LE(CHANNELS, 22);
wavBuf.writeUInt32LE(SR, 24);
wavBuf.writeUInt32LE(SR * CHANNELS * 2, 28);
wavBuf.writeUInt16LE(CHANNELS * 2, 32);
wavBuf.writeUInt16LE(16, 34);
wavBuf.write('data', 36);
wavBuf.writeUInt32LE(dataLen, 40);

for (let i = 0; i < buf.length; i++) {
  const s = Math.max(-1, Math.min(1, buf[i]));
  wavBuf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
}

const outPath = path.join(__dirname, '..', 'assets', 'audio', 'main-audio.wav');
fs.writeFileSync(outPath, wavBuf);
const mb = (wavBuf.length / 1024 / 1024).toFixed(1);
console.log(`[audio] Written: ${outPath} (${mb} MB)`);
