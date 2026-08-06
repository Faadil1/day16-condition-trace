'use strict';
/**
 * QC script for the Condition Trace submission film.
 *
 * Uses ffmpeg/ffprobe bundled with @remotion/compositor-win32-x64-msvc.
 * Operates on the ENCODED MP4 (not Remotion source frames).
 *
 * Checks:
 *   - Video: 1920×1080, 30fps, H.264
 *   - Audio: AAC
 *   - Duration: ~33 s
 *   - Audio: integrated LUFS in -18 to -20 range, true peak ≤ -1.0 dBTP
 *   - Frame extraction at 8 timestamps → assets/contact-frames/
 *
 * Run: node qc/qc.cjs
 */

const path        = require('path');
const fs          = require('fs');
const { spawnSync } = require('child_process');

const ROOT        = path.join(__dirname, '..');
const VIDEO       = path.join(ROOT, 'renders', 'Condition_Trace_Final_1080p.mp4');
const FRAMES_DIR  = path.join(ROOT, 'assets', 'contact-frames');
const COMPOSITOR  = path.join(ROOT, 'node_modules', '@remotion', 'compositor-win32-x64-msvc');
const FFMPEG      = path.join(COMPOSITOR, 'ffmpeg.exe');
const FFPROBE     = path.join(COMPOSITOR, 'ffprobe.exe');

// Contact-sheet frame timestamps and labels (must match ContactSheet.tsx)
const CONTACT_FRAMES = [
  { t: 3.5,  name: 'frame-0105.png', label: '3.5 s — Opening object'   },
  { t: 7.0,  name: 'frame-0210.png', label: '7.0 s — Record chain'     },
  { t: 13.0, name: 'frame-0390.png', label: '13.0 s — Raking light'    },
  { t: 17.5, name: 'frame-0525.png', label: '17.5 s — Crack visible'   },
  { t: 21.5, name: 'frame-0645.png', label: '21.5 s — Compare'         },
  { t: 25.0, name: 'frame-0750.png', label: '25.0 s — Finding'         },
  { t: 28.0, name: 'frame-0840.png', label: '28.0 s — Evidence drawer' },
  { t: 31.0, name: 'frame-0930.png', label: '31.0 s — End card'        },
];

function run(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024 });
  return {
    stdout: r.stdout ? r.stdout.toString('utf8') : '',
    stderr: r.stderr ? r.stderr.toString('utf8') : '',
    status: r.status,
  };
}

// ── Pre-flight ────────────────────────────────────────────────────────────────
console.log('[qc] Condition Trace — post-render QC\n');

if (!fs.existsSync(FFMPEG))  { console.error(`[qc] FATAL: ffmpeg not found at ${FFMPEG}`);  process.exit(1); }
if (!fs.existsSync(FFPROBE)) { console.error(`[qc] FATAL: ffprobe not found at ${FFPROBE}`); process.exit(1); }
if (!fs.existsSync(VIDEO))   { console.error(`[qc] FATAL: video not found at ${VIDEO}`);     process.exit(1); }

fs.mkdirSync(FRAMES_DIR, { recursive: true });

// ── 1. ffprobe: codec, dimensions, fps, duration ─────────────────────────────
console.log('[qc] 1/3  Running ffprobe…');
const probe = run(FFPROBE, [
  '-v', 'quiet',
  '-print_format', 'json',
  '-show_streams', '-show_format',
  VIDEO,
]);
if (!probe.stdout) {
  console.error('[qc] FATAL: ffprobe returned no output.\n', probe.stderr.slice(0, 400));
  process.exit(1);
}
let probeData;
try { probeData = JSON.parse(probe.stdout); }
catch (e) { console.error('[qc] FATAL: Could not parse ffprobe JSON'); process.exit(1); }

const videoStream = probeData.streams.find(s => s.codec_type === 'video');
const audioStream = probeData.streams.find(s => s.codec_type === 'audio');
const fmt         = probeData.format;

const width    = videoStream ? videoStream.width  : '?';
const height   = videoStream ? videoStream.height : '?';
const vcodec   = videoStream ? videoStream.codec_name : '?';
const acodec   = audioStream ? audioStream.codec_name : '?';
const duration = fmt          ? parseFloat(fmt.duration).toFixed(2) : '?';
const fpsRaw   = videoStream  ? videoStream.r_frame_rate : '?';
const fps      = fpsRaw !== '?' ? (eval(fpsRaw)).toFixed(3) : '?'; // e.g. "30/1"
const fileMB   = fmt ? (parseInt(fmt.size, 10) / 1024 / 1024).toFixed(1) : '?';

console.log(`\n  File     : ${path.basename(VIDEO)}  (${fileMB} MB)`);
console.log(`  Duration : ${duration} s`);
console.log(`  Video    : ${width}×${height}  ${fps} fps  ${vcodec}`);
console.log(`  Audio    : ${acodec}\n`);

const specOk = {
  width:    width    === 1920,
  height:   height   === 1080,
  vcodec:   typeof vcodec === 'string' && vcodec.includes('264'),
  acodec:   typeof acodec === 'string' && (acodec === 'aac' || acodec === 'mp4a'),
  duration: parseFloat(duration) >= 32.0 && parseFloat(duration) <= 34.0,
  fps:      Math.abs(parseFloat(fps) - 30) < 0.05,
};

for (const [k, ok] of Object.entries(specOk)) {
  console.log(`  ${ok ? '✓' : '✗'} ${k}`);
}

// ── 2. loudnorm analysis: LUFS + true peak ───────────────────────────────────
// Uses the loudnorm filter (available in Remotion's bundled ffmpeg).
// print_format=json makes loudnorm write analysis JSON to stderr.
console.log('\n[qc] 2/3  Measuring LUFS via loudnorm (this takes a moment)…');
const lufsResult = run(FFMPEG, [
  '-i',  VIDEO,
  '-vn',                                             // audio only
  '-af', 'loudnorm=I=-23:LRA=7:TP=-2:print_format=json',
  '-f',  'null', '-',
]);
const lufsOut = lufsResult.stderr + lufsResult.stdout;

// loudnorm prints a JSON block between braces in stderr
const jsonMatch = lufsOut.match(/\{[\s\S]*?\}/);
let lufs = null;
let tp   = null;
if (jsonMatch) {
  try {
    const obj = JSON.parse(jsonMatch[0]);
    // input_i  = measured integrated LUFS; input_tp = measured true peak dBTP
    lufs = obj.input_i  !== undefined ? parseFloat(obj.input_i)  : null;
    tp   = obj.input_tp !== undefined ? parseFloat(obj.input_tp) : null;
    console.log('[qc]   loudnorm JSON parsed:', JSON.stringify(obj, null, 2));
  } catch (_) {
    console.warn('[qc]   Could not parse loudnorm JSON');
  }
} else {
  console.warn('[qc]   loudnorm JSON block not found in output');
  // Print raw output to diagnose
  console.log('[qc]   Raw stderr (last 800 chars):\n', lufsOut.slice(-800));
}

console.log(`\n  Integrated loudness : ${lufs !== null ? lufs.toFixed(1) + ' LUFS' : 'NOT FOUND'}`);
console.log(`  True peak           : ${tp   !== null ? tp.toFixed(1)   + ' dBTP' : 'NOT FOUND'}`);

const lufsOk = lufs !== null && lufs >= -21.0 && lufs <= -17.0;
const tpOk   = tp   !== null && tp   <= -1.0;
console.log(`\n  ${lufsOk ? '✓' : '✗'} Integrated LUFS in [-21, -17] range  (measured: ${lufs})`);
console.log(`  ${tpOk   ? '✓' : '✗'} True peak ≤ -1.0 dBTP               (measured: ${tp})`);

// ── 3. Frame extraction from encoded MP4 ─────────────────────────────────────
console.log('\n[qc] 3/3  Extracting contact-sheet frames from encoded MP4…');
let framesOk = true;

for (const { t, name, label } of CONTACT_FRAMES) {
  const outPath = path.join(FRAMES_DIR, name);
  const r = run(FFMPEG, [
    '-ss',     t.toString(),
    '-i',      VIDEO,
    '-vframes', '1',
    '-q:v',    '2',
    '-y',
    outPath,
  ]);
  if (!fs.existsSync(outPath) || fs.statSync(outPath).size < 1000) {
    console.log(`  ✗ ${name}  (${label}) — extraction failed`);
    if (r.stderr) console.log('    ', r.stderr.slice(-200));
    framesOk = false;
  } else {
    const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`  ✓ ${name}  (${label})  ${kb} KB`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
const allOk = Object.values(specOk).every(Boolean) && lufsOk && tpOk && framesOk;

console.log('\n' + '─'.repeat(60));
if (allOk) {
  console.log('[qc] ✓ ALL CHECKS PASSED — ready to commit.');
} else {
  console.log('[qc] ✗ SOME CHECKS FAILED — do not commit until resolved.');
  if (!Object.values(specOk).every(Boolean)) console.log('     → Fix video spec (codec / dimensions / fps / duration)');
  if (!lufsOk)  console.log(`     → Fix audio LUFS (${lufs} LUFS, target -18 to -20)`);
  if (!tpOk)    console.log(`     → Fix true peak (${tp} dBTP, must be ≤ -1.0 dBTP)`);
  if (!framesOk) console.log('     → Fix frame extraction');
}
console.log('─'.repeat(60) + '\n');

process.exit(allOk ? 0 : 1);
