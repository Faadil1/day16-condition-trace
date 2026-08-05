/**
 * Records a live demo of condition-trace.vercel.app for the Remotion submission film.
 * Output: assets/live-condition-trace-capture.webm (~32 seconds)
 *
 * Timing is designed to align with ConditionTraceFinal.tsx key frames:
 *   startFrom=75 → at comp frame 90, video shows demo ~0.5s (stable opening state)
 */

'use strict';

const path = require('path');
const fs = require('fs');

// Global playwright installation
const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const OUT_DIR = path.join(__dirname, '..', 'assets');
const OUT_FILE = path.join(OUT_DIR, 'live-condition-trace-capture.webm');
const URL = 'https://day16-condition-trace.vercel.app';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pressKey(page, key) {
  await page.evaluate((k) => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: k,
      code: k === ' ' ? 'Space' : ('Arrow' + k.replace('Arrow', '')),
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
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log(`[record] Navigating to ${URL}`);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Hold for WebGL initialization (2.5s of loading before R press)
  await wait(2500);

  // R → ensure clean opening state
  await pressKey(page, 'r');
  console.log('[record] R pressed — reset to opening state');

  // === Opening state hold: 3 seconds ===
  // (startFrom=75 means comp frame 90 maps to video t=5.5s = ~0.5s after R press)
  await wait(3000);

  // === Space → Records step ===
  await pressKey(page, ' ');
  console.log('[record] Space pressed — records step');
  await wait(2500);

  // === Space → Inspect step ===
  await pressKey(page, ' ');
  console.log('[record] Space pressed — inspect step');
  await wait(1500);

  // === ArrowRight × 11 → progressive raking light (450ms intervals) ===
  console.log('[record] Raking light progression…');
  for (let i = 0; i < 11; i++) {
    await pressKey(page, 'ArrowRight');
    console.log(`[record]   ArrowRight ${i + 1}/11`);
    await wait(450);
  }

  // Hold on crack revealed
  await wait(2500);

  // === Space → Compare step ===
  await pressKey(page, ' ');
  console.log('[record] Space pressed — compare step');
  await wait(2500);

  // === Space → Finding step ===
  await pressKey(page, ' ');
  console.log('[record] Space pressed — finding step');
  await wait(3000);

  // === Space → Drawer / evidence step ===
  await pressKey(page, ' ');
  console.log('[record] Space pressed — drawer/evidence step');
  await wait(6500);

  console.log('[record] Demo sequence complete. Closing context…');
  await context.close();

  // Playwright names the file with a generated UUID; find and rename it
  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.webm') && f !== 'live-condition-trace-capture.webm');
  if (files.length === 0) {
    console.error('[record] ERROR: No WebM file found in assets/');
    await browser.close();
    process.exit(1);
  }

  // Sort by mtime descending to grab the most recently written file
  const latest = files
    .map(f => ({ name: f, mtime: fs.statSync(path.join(OUT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];

  const src = path.join(OUT_DIR, latest.name);
  fs.renameSync(src, OUT_FILE);
  console.log(`[record] Saved: ${OUT_FILE}`);

  const size = fs.statSync(OUT_FILE).size;
  console.log(`[record] File size: ${(size / 1024 / 1024).toFixed(1)} MB`);

  await browser.close();
  console.log('[record] Done.');
})().catch(err => {
  console.error('[record] Fatal error:', err);
  process.exit(1);
});
