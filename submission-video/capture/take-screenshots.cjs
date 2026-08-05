/**
 * Takes 1920×1080 PNG screenshots of condition-trace.vercel.app
 * Outputs:
 *   screenshots/01-condition-trace-opening-16x9.png
 *   screenshots/02-condition-trace-raking-reveal-16x9.png
 *   screenshots/03-condition-trace-evidence-record-16x9.png
 */

'use strict';

const path = require('path');
const fs = require('fs');

const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const SHOTS_DIR = path.join(__dirname, '..', 'screenshots');
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

async function shot(page, filename) {
  const out = path.join(SHOTS_DIR, filename);
  await page.screenshot({ path: out, type: 'png' });
  const size = fs.statSync(out).size;
  console.log(`[screenshot] ${filename} (${(size / 1024).toFixed(0)} KB)`);
}

(async () => {
  console.log('[screenshot] Launching browser at 1920×1080…');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // ── Screenshot 01: Opening state ──────────────────────────────────────────
  console.log(`[screenshot] Loading ${URL}…`);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await wait(3000); // let WebGL fully init
  await pressKey(page, 'r'); // ensure clean state
  await wait(1200);
  await shot(page, '01-condition-trace-opening-16x9.png');

  // ── Screenshot 02: Raking reveal with crack ────────────────────────────────
  // Navigate to inspect step
  await pressKey(page, ' ');
  await wait(800);
  // Push raking light to 80° (16 presses × 5° = 80° from 0 base)
  // App starts at 0°, each ArrowRight adds 5°, threshold is 72°
  for (let i = 0; i < 16; i++) {
    await pressKey(page, 'ArrowRight');
    await wait(120);
  }
  await wait(800);
  await shot(page, '02-condition-trace-raking-reveal-16x9.png');

  // ── Screenshot 03: Evidence drawer open ───────────────────────────────────
  // Advance through remaining steps to drawer
  await pressKey(page, ' '); // compare
  await wait(600);
  await pressKey(page, ' '); // finding
  await wait(600);
  await pressKey(page, ' '); // drawer / evidence
  await wait(1500);
  await shot(page, '03-condition-trace-evidence-record-16x9.png');

  await browser.close();
  console.log('[screenshot] All screenshots written to screenshots/');
})().catch(err => {
  console.error('[screenshot] Fatal error:', err);
  process.exit(1);
});
