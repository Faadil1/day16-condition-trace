/**
 * Records a live demo of day16-condition-trace.vercel.app for the Remotion submission film.
 *
 * Timing aligned to ConditionTraceFinal.tsx (startFrom=30, fps=30):
 *   video_time = (comp_frame + 30) / 30
 *
 *   comp 2.5s  → video 3.5s  : opening state (title fading)
 *   comp 5.0s  → video 6.0s  : records
 *   comp 8.0s  → video 9.0s  : inspect
 *   comp 9.0s  → video 10.0s : first ArrowRight
 *   comp 17.0s → video 18.0s : hold — crack/mark CTA visible
 *   comp 20.0s → video 21.0s : compare
 *   comp 23.0s → video 24.0s : finding
 *   comp 26.0s → video 27.0s : evidence drawer
 *   comp 29.0s → video 30.0s : covered by end card
 */
'use strict';

const path = require('path');
const fs = require('fs');

const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const OUT_DIR  = path.join(__dirname, '..', 'assets');
const OUT_FILE = path.join(OUT_DIR, 'live-condition-trace-capture.webm');
const URL = 'https://day16-condition-trace.vercel.app';

const wait = ms => new Promise(r => setTimeout(r, ms));

async function pressKey(page, key) {
  await page.evaluate(k => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: k,
      code: k === ' ' ? 'Space' : `Key${k.toUpperCase()}`,
      bubbles: true,
      cancelable: true,
    }));
  }, key);
}

(async () => {
  console.log('[record] Starting browser…');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  console.log('[record] Navigating…');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // t=0→1s: navigate + settle (page loads into "open" state)
  await wait(1000);

  // R → guaranteed clean open state (video ~t=1.0s, comp ~t=0.0s)
  await pressKey(page, 'r');
  console.log('[record] Reset to open state');

  // === OPEN OBJECT: hold 5 s total → comp 0→5s ===
  // (Title covers 0–3s; opening visible at comp 2.5s → video 3.5s)
  await wait(5000);

  // === Space → RECORDS  (video t≈6s, comp 5.0s) ===
  await pressKey(page, ' ');
  console.log('[record] → records (Step 02)');
  await wait(3000);                     // records hold 3 s → comp 5–8s

  // === Space → INSPECT  (video t≈9s, comp 8.0s) ===
  await pressKey(page, ' ');
  console.log('[record] → inspect (Step 03)');
  await wait(1000);                     // settle 1 s before raking → comp 8–9s

  // === RAKING LIGHT: 12 presses × 600 ms (video t=10–17.2s, comp 9–16.2s) ===
  // lightAngle starts at 24°; each press +5° → 12 presses = 84°
  // ready threshold ≥72° reached after 10 presses (74°)
  console.log('[record] Raking light…');
  for (let i = 0; i < 12; i++) {
    await pressKey(page, 'ArrowRight');
    console.log(`[record]   ArrowRight ${i + 1}/12  (${24 + (i + 1) * 5}°)`);
    await wait(600);
  }

  // === HOLD crack / Mark observed feature CTA active ===
  // (video t≈17.2–21s, comp 16.2–20s)
  await wait(3800);
  console.log('[record] Mark observed feature — CTA active');

  // === Space → COMPARE  (video t≈21s, comp 20.0s) ===
  await pressKey(page, ' ');
  console.log('[record] → compare (Step 04)');
  await wait(3000);                     // comp 20–23s

  // === Space → FINDING  (video t≈24s, comp 23.0s) ===
  await pressKey(page, ' ');
  console.log('[record] → finding (Step 05)');
  await wait(3000);                     // comp 23–26s (finding panel + doc gap + CTA visible)

  // === Space → RECORD/DRAWER  (video t≈27s, comp 26.0s) ===
  await pressKey(page, ' ');
  console.log('[record] → evidence drawer (Step 06)');
  await wait(5000);                     // comp 26–30.7s (drawer fully visible; end card covers 29–31s)

  console.log('[record] Demo complete. Closing…');
  await context.close();

  // Rename the generated WebM to the canonical name
  const files = fs.readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.webm') && f !== 'live-condition-trace-capture.webm');

  if (!files.length) {
    console.error('[record] ERROR: no WebM found in assets/');
    await browser.close();
    process.exit(1);
  }

  const latest = files
    .map(f => ({ name: f, mtime: fs.statSync(path.join(OUT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];

  fs.renameSync(path.join(OUT_DIR, latest.name), OUT_FILE);
  const mb = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(1);
  console.log(`[record] Saved ${OUT_FILE} (${mb} MB)`);

  await browser.close();
})().catch(err => { console.error('[record]', err); process.exit(1); });
