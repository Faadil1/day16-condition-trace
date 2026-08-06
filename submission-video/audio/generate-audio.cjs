/**
 * Generates assets/audio/main-audio.wav for the Condition Trace submission film.
 * Pure Node.js PCM — no external dependencies.
 *
 * 44100 Hz / 16-bit / stereo / 31 seconds
 * Target: ≤ -4 dBFS sample peak → ≤ -1.0 dBTP (allowing for 3 dB intersample headroom)
 *
 * Sound design timeline (composition time):
 *   0–2.5s   Title card ambient swell
 *   3s       Opening state – ambient hold
 *   6s (5s)  Records step – soft UI ping
 *   8s       Inspect step entry – soft UI ping
 *   9–16.2s  Raking light – frequency sweep texture
 *   15s      Crack confirmed – quiet A-minor accent
 *   17s      Mark observed feature (comp) – soft ping
 *   20s      Compare – soft ping
 *   23s      Finding – warm chime
 *   26s      Evidence drawer – paper-click transient
 *   29s      End card – A-minor resolution chord
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const SR       = 44100;
const CHANNELS = 2;
const DURATION = 31;
const N        = SR * DURATION;

const buf = new Float32Array(N * CHANNELS);

// ── Primitives ──────────────────────────────────────────────────────────────

function sine(t, freq, amp, dur, fi = 0.05, fo = 0.1) {
  const s  = Math.floor(t * SR);
  const len = Math.floor(dur * SR);
  const fiS = Math.max(1, Math.floor(fi * SR));
  const foS = Math.max(1, Math.floor(fo * SR));
  for (let i = 0; i < len && s + i < N; i++) {
    const env = Math.min(1, i / fiS) * Math.min(1, (len - i) / foS);
    const v   = amp * Math.sin(2 * Math.PI * freq * i / SR) * env;
    buf[(s + i) * 2]     += v;
    buf[(s + i) * 2 + 1] += v * 0.97;
  }
}

function noise(t, amp, dur, fi = 0.005, fo = 0.06) {
  const s   = Math.floor(t * SR);
  const len = Math.floor(dur * SR);
  const fiS = Math.max(1, Math.floor(fi * SR));
  const foS = Math.max(1, Math.floor(fo * SR));
  for (let i = 0; i < len && s + i < N; i++) {
    const env = Math.min(1, i / fiS) * Math.min(1, (len - i) / foS);
    buf[(s + i) * 2]     += amp * (Math.random() * 2 - 1) * env;
    buf[(s + i) * 2 + 1] += amp * (Math.random() * 2 - 1) * env;
  }
}

function sweep(t, dur, a0, a1, f0, f1, fi = 0.12, fo = 0.6) {
  const s   = Math.floor(t * SR);
  const len = Math.floor(dur * SR);
  const fiS = Math.max(1, Math.floor(fi * SR));
  const foS = Math.max(1, Math.floor(fo * SR));
  let phase = 0;
  for (let i = 0; i < len && s + i < N; i++) {
    const p   = i / len;
    const env = Math.min(1, i / fiS) * Math.min(1, (len - i) / foS);
    phase += 2 * Math.PI * (f0 + (f1 - f0) * p) / SR;
    const v = (a0 + (a1 - a0) * p) * Math.sin(phase) * env;
    buf[(s + i) * 2]     += v;
    buf[(s + i) * 2 + 1] += v * 0.9;
  }
}

function ping(t, amp = 0.020) {
  sine(t, 1200, amp,       0.18, 0.003, 0.14);
  sine(t,  600, amp * 0.5, 0.24, 0.003, 0.20);
}

// ── SOUND DESIGN ────────────────────────────────────────────────────────────

// Continuous espresso-room drone (very quiet)
sine(0, 55,  0.004, 31, 2.0, 2.0);
sine(0, 110, 0.003, 31, 2.0, 2.0);
sine(0, 165, 0.002, 31, 2.0, 2.0);
noise(0, 0.002, 31, 3.0, 3.0);

// Title card swell (0–2.5s)
sine(0, 440, 0.005, 2.5, 1.8, 0.4);
sine(0, 660, 0.003, 2.5, 1.8, 0.5);

// Step pings: records (5s), inspect (8s), mark (17s), compare (20s)
for (const t of [5.0, 8.0, 17.0, 20.0]) ping(t);

// Finding chime (23s) — slightly warmer
sine(23.0,  880, 0.014, 0.30, 0.005, 0.25);
sine(23.0,  440, 0.009, 0.40, 0.005, 0.35);
sine(23.0, 1320, 0.006, 0.20, 0.005, 0.16);

// Raking sweep texture (9–16.2s)
sweep(9.0,  7.2, 0.006, 0.003, 90,  320, 0.15, 0.8);
sweep(9.5,  6.0, 0.003, 0.001, 150, 480, 0.15, 0.7);

// Crack confirmed (15s) — qualified, observational, A-minor
sine(15.0, 220, 0.011, 1.8, 0.06, 1.0);
sine(15.0, 330, 0.007, 1.5, 0.06, 0.9);
sine(15.0, 261.6, 0.004, 1.2, 0.06, 0.8);

// Evidence drawer open (26s) — paper-click transient
noise(26.0, 0.050, 0.035, 0.001, 0.030);
noise(26.05, 0.016, 0.080, 0.002, 0.070);

// End card resolution chord (29s) — A minor, soft and reflective
// A2=110, E3=165, A3=220, C4=261.6, E4=330
sine(29.0, 110,   0.010, 2.8, 0.20, 1.6);
sine(29.0, 165,   0.008, 2.8, 0.22, 1.6);
sine(29.0, 220,   0.012, 2.8, 0.22, 1.6);
sine(29.0, 261.6, 0.006, 2.5, 0.20, 1.5);
sine(29.0, 330,   0.006, 2.5, 0.22, 1.5);

// ── NORMALIZE & MASTER ───────────────────────────────────────────────────────
// Target -4 dBFS sample peak (≈ 0.631 amp) to stay well under -1.0 dBTP
// (allows up to 3 dB intersample excess from AAC inter-sample overshoot)
let peak = 0;
for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i]));
const TARGET_AMP = 0.58; // -4.7 dBFS → comfortable -1.7 dBTP headroom
const gain = TARGET_AMP / (peak || 1);
for (let i = 0; i < buf.length; i++) buf[i] *= gain;

// Report levels
let finalPeak = 0;
for (let i = 0; i < buf.length; i++) finalPeak = Math.max(finalPeak, Math.abs(buf[i]));
const dBFS = 20 * Math.log10(finalPeak);
console.log(`[audio] Sample peak: ${dBFS.toFixed(2)} dBFS (${finalPeak.toFixed(4)} amplitude)`);
console.log(`[audio] Estimated true peak (3 dB intersample margin): ${(dBFS + 3).toFixed(2)} dBTP`);

// ── WRITE WAV ────────────────────────────────────────────────────────────────
const dataLen = N * CHANNELS * 2;
const wavBuf  = Buffer.alloc(44 + dataLen);
wavBuf.write('RIFF', 0);
wavBuf.writeUInt32LE(36 + dataLen, 4);
wavBuf.write('WAVE', 8);
wavBuf.write('fmt ', 12);
wavBuf.writeUInt32LE(16, 16);
wavBuf.writeUInt16LE(1, 20);           // PCM
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
console.log(`[audio] Written: ${outPath} (${(wavBuf.length / 1024 / 1024).toFixed(1)} MB)`);
