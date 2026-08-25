// Procedural sound design for CONDITION TRACE (Day 16 final film).
// No samples, no libraries, no copyrighted material: every sample is
// generated from noise + sine math and written directly to a WAV file.
import fs from 'fs';
import path from 'path';

const SR = 48000;
const FPS = 30;
const SPF = SR / FPS; // samples per video frame = 1600
const TOTAL_FRAMES = 1155; // 38.5s, matches ConditionTraceDay16Final DURATION
const N = TOTAL_FRAMES * SPF; // total samples

const L = new Float64Array(N);
const R = new Float64Array(N);

const frameToSample = (f) => Math.round(f * SPF);

// ---------------------------------------------------------------- helpers
function onePoleLowpass(x, cutoffHz) {
  const y = new Float64Array(x.length);
  const rc = 1 / (2 * Math.PI * cutoffHz);
  const dt = 1 / SR;
  const alpha = dt / (rc + dt);
  let prev = 0;
  for (let i = 0; i < x.length; i++) {
    prev = prev + alpha * (x[i] - prev);
    y[i] = prev;
  }
  return y;
}

function whiteNoise(len, seed) {
  // small deterministic PRNG so renders are reproducible
  let s = seed >>> 0 || 1;
  const rnd = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return (s / 4294967296) * 2 - 1;
  };
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) out[i] = rnd();
  return out;
}

function bandpassNoise(len, seed, loHz, hiHz) {
  const n = whiteNoise(len, seed);
  const hp = n; // start from full-band
  const lowA = onePoleLowpass(hp, hiHz);
  const lowB = onePoleLowpass(hp, loHz);
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) out[i] = lowA[i] - lowB[i];
  return out;
}

function envAR(len, attackSamp, releaseSamp, sustain = 1) {
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    if (i < attackSamp) out[i] = (i / attackSamp) * sustain;
    else if (i > len - releaseSamp) out[i] = Math.max(0, ((len - i) / releaseSamp)) * sustain;
    else out[i] = sustain;
  }
  return out;
}

function expDecay(len, tau) {
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) out[i] = Math.exp(-i / tau);
  return out;
}

function sine(len, freqFn, phase0 = 0) {
  const out = new Float64Array(len);
  let phase = phase0;
  for (let i = 0; i < len; i++) {
    const f = typeof freqFn === 'function' ? freqFn(i / len) : freqFn;
    phase += (2 * Math.PI * f) / SR;
    out[i] = Math.sin(phase);
  }
  return out;
}

// add a mono buffer into the stereo master at sampleOffset with per-side gain
function addMono(buf, sampleOffset, gainL = 1, gainR = 1) {
  const start = Math.max(0, sampleOffset);
  const end = Math.min(N, sampleOffset + buf.length);
  for (let i = start; i < end; i++) {
    const s = buf[i - sampleOffset];
    L[i] += s * gainL;
    R[i] += s * gainR;
  }
}

// ---------------------------------------------------------------- 1. ROOM TONE (whole film)
// very quiet broadband air, high end softened -- prevents digital silence
{
  const noise = whiteNoise(N, 1001);
  const soft = onePoleLowpass(noise, 3200);
  const roomEnv = 0.006; // very low level
  for (let i = 0; i < N; i++) {
    L[i] += soft[i] * roomEnv;
    R[i] += soft[i] * roomEnv * 0.98;
  }
}

// ---------------------------------------------------------------- 2. TRACE LINE (frames 0-75)
{
  const startF = 0, durF = 75;
  const s0 = frameToSample(startF), len = frameToSample(durF) - s0;
  // thin resonant metal tone: slow sweep 660Hz -> 880Hz with slow tremolo, no whoosh
  const tone = sine(len, (t) => 660 + t * 220);
  const trem = sine(len, 4.2).map((v) => 0.75 + 0.25 * v);
  const env = envAR(len, Math.round(0.35 * SR), Math.round(1.1 * SR), 1);
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) out[i] = tone[i] * trem[i] * env[i] * 0.03;
  addMono(out, s0, 1, 1);
}

// ---------------------------------------------------------------- 3. OPEN (frames 75-180)
{
  const startF = 75;
  const s0 = frameToSample(startF);
  // low tactile presence: filtered low-frequency noise bed, very subtle
  const bedLen = frameToSample(105);
  const bed = bandpassNoise(bedLen, 2001, 60, 220);
  const bedEnv = envAR(bedLen, Math.round(0.6 * SR), Math.round(1.2 * SR), 1);
  const bedOut = new Float64Array(bedLen);
  for (let i = 0; i < bedLen; i++) bedOut[i] = bed[i] * bedEnv[i] * 0.018;
  addMono(bedOut, s0, 1, 1);

  // tiny document-placement tick when CT-1847 label settles (~frame 26 rel -> abs 101)
  const tickAt = frameToSample(startF + 26);
  const tickLen = Math.round(0.09 * SR);
  const tickNoise = bandpassNoise(tickLen, 2002, 900, 2600);
  const tickEnv = expDecay(tickLen, tickLen / 6);
  const tickOut = new Float64Array(tickLen);
  for (let i = 0; i < tickLen; i++) tickOut[i] = tickNoise[i] * tickEnv[i] * 0.05;
  addMono(tickOut, tickAt, 1, 0.9);
}

// ---------------------------------------------------------------- 4. RECORDS (frames 180-300)
{
  const sceneStart = 180;
  const tickStartsRel = [6, 12, 18, 24]; // matches overlayTop date-reveal frames
  const pitches = [2400, 2650, 2850, 3100];
  tickStartsRel.forEach((rel, i) => {
    const at = frameToSample(sceneStart + rel);
    const len = Math.round(0.05 * SR);
    const n = bandpassNoise(len, 3000 + i, pitches[i] - 250, pitches[i] + 250);
    const env = expDecay(len, len / 5);
    const out = new Float64Array(len);
    for (let j = 0; j < len; j++) out[j] = n[j] * env[j] * 0.032;
    addMono(out, at, i % 2 === 0 ? 1 : 0.85, i % 2 === 0 ? 0.85 : 1);
  });
}

// ---------------------------------------------------------------- 5. RAKING LIGHT (frames 300-540) -- signature
{
  const sceneStart = 300, sceneLen = 240;
  const s0 = frameToSample(sceneStart);
  const len = sceneLen * SPF;
  const noise = whiteNoise(len, 4001);
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / len; // 0..1 across the scene, tracks the 24deg -> 8deg sweep
    // band narrows and rises in center frequency as the angle lowers (more focused light)
    const centerHz = 2600 + t * 3200; // 2.6kHz -> 5.8kHz
    const bw = 900 - t * 500; // 900Hz -> 400Hz (narrowing = "more focused")
    out[i] = noise[i]; // placeholder, filtered below in blocks for perf
  }
  // block-wise bandpass with moving center (approximate continuous sweep in chunks)
  const chunks = 24;
  const chunkLen = Math.ceil(len / chunks);
  const filtered = new Float64Array(len);
  for (let c = 0; c < chunks; c++) {
    const cs = c * chunkLen;
    const ce = Math.min(len, cs + chunkLen);
    if (cs >= ce) continue;
    const t = (cs + (ce - cs) / 2) / len;
    const centerHz = 2600 + t * 3200;
    const bw = 900 - t * 500;
    const seg = noise.slice(cs, ce);
    const bp = bandpassNoise(seg.length, 4100 + c, centerHz - bw / 2, centerHz + bw / 2);
    for (let i = 0; i < bp.length; i++) filtered[cs + i] = bp[i];
  }
  // slow overall rise in presence + a very quiet resonant sine that tracks the band center
  const presence = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / len;
    presence[i] = 0.014 + t * 0.02; // rises from 0.014 to 0.034
  }
  const resonance = sine(len, (t) => 2600 + t * 3200);
  for (let i = 0; i < len; i++) {
    out[i] = filtered[i] * presence[i] + resonance[i] * presence[i] * 0.12;
  }
  // restrained tonal settling point at CAPTURE READY (last ~34 frames of the scene)
  const readyStartRel = sceneLen - 34;
  const readyStart = frameToSample(readyStartRel);
  const readyLen = frameToSample(sceneLen) - readyStart;
  const settle = sine(readyLen, 5800);
  const settleEnv = envAR(readyLen, Math.round(0.15 * SR), Math.round(0.55 * SR), 1);
  for (let i = 0; i < readyLen; i++) out[readyStart + i] += settle[i] * settleEnv[i] * 0.02;
  addMono(out, s0, 1, 1);
}

// ---------------------------------------------------------------- 6. OBS-04 (frames 540-630)
{
  const sceneStart = 540;
  // one soft archival registration sound synced with the capture transient
  const at = frameToSample(sceneStart + 3);
  const clickLen = Math.round(0.06 * SR);
  const click = bandpassNoise(clickLen, 5001, 1400, 3200);
  const clickEnv = expDecay(clickLen, clickLen / 5);
  const clickOut = new Float64Array(clickLen);
  for (let i = 0; i < clickLen; i++) clickOut[i] = click[i] * clickEnv[i] * 0.06;
  addMono(clickOut, at, 1, 1);

  const resLen = Math.round(0.9 * SR);
  const res = sine(resLen, 220);
  const resEnv = expDecay(resLen, resLen / 4);
  const resOut = new Float64Array(resLen);
  for (let i = 0; i < resLen; i++) resOut[i] = res[i] * resEnv[i] * 0.022;
  addMono(resOut, at + Math.round(0.02 * SR), 1, 0.95);
}

// ---------------------------------------------------------------- 7. COMPARE (frames 630-780)
{
  const sceneStart = 630, sceneLen = 150;
  const s0 = frameToSample(sceneStart);
  const len = sceneLen * SPF;
  // subtle stereo shift left (prior) -> right (captured) as attention moves
  const bed = bandpassNoise(len, 6001, 1800, 3600);
  const bedEnv = 0.01;
  const outL = new Float64Array(len);
  const outR = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / len;
    const panL = 1 - t * 0.5;
    const panR = 0.5 + t * 0.5;
    outL[i] = bed[i] * bedEnv * panL;
    outR[i] = bed[i] * bedEnv * panR;
  }
  addMono(outL, s0, 1, 0); // left channel contribution
  addMono(outR, s0, 0, 1); // right channel contribution

  // one tiny connector tone near the AREA MATCH / LIGHTING GAP label
  const at = frameToSample(sceneStart + 14);
  const tLen = Math.round(0.5 * SR);
  const tone = sine(tLen, 1200);
  const tEnv = envAR(tLen, Math.round(0.06 * SR), Math.round(0.4 * SR), 1);
  const tOut = new Float64Array(tLen);
  for (let i = 0; i < tLen; i++) tOut[i] = tone[i] * tEnv[i] * 0.012;
  addMono(tOut, at, 1, 1);
}

// ---------------------------------------------------------------- 8. EVIDENCE TRACE (frames 780-960)
{
  const sceneStart = 780;
  const perNode = 20;
  const nodeCount = 5;
  for (let i = 0; i < nodeCount; i++) {
    const rel = 6 + i * perNode;
    const at = frameToSample(sceneStart + rel);
    const clarity = i / (nodeCount - 1); // 0..1, FND-01 most resolved
    const len = Math.round(0.07 * SR);
    const centerHz = 1600 + clarity * 1400;
    const n = bandpassNoise(len, 7000 + i, centerHz - 200, centerHz + 200);
    const env = expDecay(len, len / (4 + clarity * 3));
    const out = new Float64Array(len);
    for (let j = 0; j < len; j++) out[j] = n[j] * env[j] * (0.03 + clarity * 0.02);
    addMono(out, at, 1, 1);
    if (i === nodeCount - 1) {
      // FND-01: add a short harmonic overtone, still restrained
      const tLen = Math.round(0.35 * SR);
      const tone = sine(tLen, centerHz);
      const tEnv = envAR(tLen, Math.round(0.02 * SR), Math.round(0.3 * SR), 1);
      const tOut = new Float64Array(tLen);
      for (let j = 0; j < tLen; j++) tOut[j] = tone[j] * tEnv[j] * 0.016;
      addMono(tOut, at, 1, 1);
    }
  }
}

// ---------------------------------------------------------------- 9. EVIDENCE RECORD (frames 960-1080)
{
  const sceneStart = 960, sceneLen = 120;
  const s0 = frameToSample(sceneStart);
  const len = sceneLen * SPF;
  // light paper/friction texture: filtered noise, gently modulated, fading other textures
  const noise = bandpassNoise(len, 8001, 1200, 4200);
  const mod = sine(len, 0.6).map((v) => 0.6 + 0.4 * v);
  const env = envAR(len, Math.round(0.4 * SR), Math.round(1.0 * SR), 1);
  const out = new Float64Array(len);
  for (let i = 0; i < len; i++) out[i] = noise[i] * mod[i] * env[i] * 0.016;
  addMono(out, s0, 1, 1);
}

// ---------------------------------------------------------------- 10. END CARD (frames 1080-1155)
{
  const sceneStart = 1080, sceneLen = 75;
  const s0 = frameToSample(sceneStart);
  const len = sceneLen * SPF;
  // final trace-line completion resonance around relative frames 10-46
  const at = frameToSample(sceneStart + 10);
  const tLen = frameToSample(46 - 10);
  const tone = sine(tLen, 494);
  const tEnv = envAR(tLen, Math.round(0.3 * SR), Math.round(0.9 * SR), 1);
  const tOut = new Float64Array(tLen);
  for (let i = 0; i < tLen; i++) tOut[i] = tone[i] * tEnv[i] * 0.018;
  addMono(tOut, at, 1, 1);

  // natural fade of the whole mix over the last ~20 frames (no hard cut)
  const fadeLen = frameToSample(20);
  const fadeStart = N - fadeLen;
  for (let i = 0; i < fadeLen; i++) {
    const g = 1 - i / fadeLen;
    L[fadeStart + i] *= g;
    R[fadeStart + i] *= g;
  }
}

// ---------------------------------------------------------------- soft limiter + write WAV
function softLimit(x) {
  return Math.tanh(x * 1.4) / 1.4;
}

const outDir = 'C:/Users/fboussari/day16-condition-trace/submission-video/audio';
fs.mkdirSync(outDir, { recursive: true });

function writeWav(filePath, left, right) {
  const numSamples = left.length;
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample * 2;
  const dataSize = numSamples * blockAlign;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(2, 22); // channels
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * blockAlign, 28);
  buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  let off = 44;
  for (let i = 0; i < numSamples; i++) {
    const l = Math.max(-1, Math.min(1, softLimit(left[i])));
    const r = Math.max(-1, Math.min(1, softLimit(right[i])));
    buf.writeInt16LE(Math.round(l * 32767), off); off += 2;
    buf.writeInt16LE(Math.round(r * 32767), off); off += 2;
  }
  fs.writeFileSync(filePath, buf);
}

writeWav(path.join(outDir, 'condition-trace-master-raw.wav'), L, R);
console.log('wrote raw master WAV:', N, 'samples,', (N / SR).toFixed(3), 's');
