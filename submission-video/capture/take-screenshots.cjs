/**
 * Captures three product screenshots + one cover-background image
 * from the live Vercel app at day16-condition-trace.vercel.app.
 *
 * Outputs
 *   screenshots/01-condition-trace-opening-16x9.png     1920×1080
 *   screenshots/02-condition-trace-raking-reveal-16x9.png 1920×1080
 *   screenshots/03-condition-trace-evidence-record-16x9.png 1920×1080
 *   assets/cover-raking-bg.png                          1440×900 (for Remotion covers)
 *
 * Verifies state before each capture.
 */
'use strict';

const path = require('path');
const fs   = require('fs');

const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const ROOT      = path.join(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'screenshots');
const ASSETS    = path.join(ROOT, 'assets');
const URL       = 'https://day16-condition-trace.vercel.app';

const wait = ms => new Promise(r => setTimeout(r, ms));

async function pressKey(page, key) {
  await page.evaluate(k => {
    if (document.activeElement && document.activeElement !== document.body)
      document.activeElement.blur();
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: k,
      code: k === ' ' ? 'Space' : `Key${k.toUpperCase()}`,
      bubbles: true, cancelable: true,
    }));
  }, key);
}

async function verifyText(page, text, label) {
  const found = await page.evaluate(t => document.body.innerText.includes(t), text);
  if (found) {
    console.log(`[screenshot] ✓ Verified: "${text}" visible (${label})`);
  } else {
    console.warn(`[screenshot] ✗ WARNING: "${text}" NOT found on page (${label})`);
  }
  return found;
}

async function shot(page, filepath) {
  await page.screenshot({ path: filepath, type: 'png' });
  const kb = Math.round(fs.statSync(filepath).size / 1024);
  console.log(`[screenshot] Saved ${path.basename(filepath)} (${kb} KB)`);
}

(async () => {
  // ── Screenshot 01: Opening state — 1920×1080 ────────────────────────────
  console.log('\n[screenshot] === Screenshot 01: Opening state ===');
  {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await wait(3000);
    await pressKey(page, 'r');
    await wait(1500);
    await verifyText(page, 'Open object', '01-opening');
    await shot(page, path.join(SHOTS_DIR, '01-condition-trace-opening-16x9.png'));
    await browser.close();
  }

  // ── Screenshot 02 + Cover background — raking reveal ────────────────────
  // Shot 02 at 1920×1080; cover-raking-bg at 1440×900 (same state)
  console.log('\n[screenshot] === Screenshot 02: Raking reveal (80° ≈ 84°) + cover bg ===');
  {
    const browser = await chromium.launch({ headless: true });

    // 1920×1080 for the product screenshot
    const ctx1 = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const page1 = await ctx1.newPage();
    await page1.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await wait(3000);
    await pressKey(page1, 'r');
    await wait(800);
    // Advance to inspect step
    await pressKey(page1, ' '); // open → records
    await wait(400);
    await pressKey(page1, ' '); // records → inspect
    await wait(1000);
    // 12 ArrowRight presses: 24° + 60° = 84° (> 72° threshold for "Shallow angle reached")
    for (let i = 0; i < 12; i++) {
      await pressKey(page1, 'ArrowRight');
      await wait(150);
    }
    await wait(800);
    await verifyText(page1, 'Shallow angle reached', '02-raking');
    await verifyText(page1, 'Mark observed feature', '02-cta-active');
    await shot(page1, path.join(SHOTS_DIR, '02-condition-trace-raking-reveal-16x9.png'));
    await ctx1.close();

    // 1440×900 for cover background
    const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page2 = await ctx2.newPage();
    await page2.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await wait(3000);
    await pressKey(page2, 'r');
    await wait(800);
    await pressKey(page2, ' '); // open → records
    await wait(400);
    await pressKey(page2, ' '); // records → inspect
    await wait(1000);
    for (let i = 0; i < 12; i++) {
      await pressKey(page2, 'ArrowRight');
      await wait(150);
    }
    await wait(800);
    await shot(page2, path.join(ASSETS, 'cover-raking-bg.png'));
    await ctx2.close();

    await browser.close();
  }

  // ── Screenshot 03: Evidence drawer open — 1920×1080 ─────────────────────
  console.log('\n[screenshot] === Screenshot 03: Evidence drawer ===');
  {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await wait(3000);
    await pressKey(page, 'r');
    await wait(800);
    // Walk all steps to reach 'record' (evidence drawer)
    // open → records
    await pressKey(page, ' ');
    await wait(400);
    // records → inspect (need ≥72° before CTA enables, but Space always works)
    await pressKey(page, ' ');
    await wait(800);
    // Raking to ≥72° so the inspect CTA is enabled
    for (let i = 0; i < 10; i++) {
      await pressKey(page, 'ArrowRight');
      await wait(120);
    }
    await wait(600);
    // inspect → compare
    await pressKey(page, ' ');
    await wait(500);
    // compare → finding
    await pressKey(page, ' ');
    await wait(500);
    // finding → record (opens GeneratedRecord drawer)
    await pressKey(page, ' ');
    await wait(2000);   // allow drawer animation to complete
    await verifyText(page, 'First documented appearance', '03-drawer-title');
    await verifyText(page, 'CT-1847', '03-doc-id');
    await shot(page, path.join(SHOTS_DIR, '03-condition-trace-evidence-record-16x9.png'));
    await browser.close();
  }

  console.log('\n[screenshot] All done.');
})().catch(err => { console.error('[screenshot]', err); process.exit(1); });
