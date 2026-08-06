'use strict';
/**
 * Captures 6 deterministic WebM clips from the live Condition Trace app.
 *
 * Protocol per segment:
 *   1. Load URL (networkidle)
 *   2. Hard reset (R key)
 *   3. Navigate to required step via Space key
 *   4. Pad elapsed time to exactly SETUP_MS from page load
 *   5. === content window begins (video frame 240 at 30fps) ===
 *   6. Run content function (hold or animate)
 *   7. Assert required heading in DOM
 *   8. Take verification screenshot
 *   9. Hold remaining time to fill contentMs
 *  10. Close context → WebM saved
 *
 * In Remotion, all clips use startFrom=240 to skip the 8-second setup.
 */

const path = require('path');
const fs   = require('fs');

const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const ROOT      = path.join(__dirname, '..');
const SEGS_DIR  = path.join(ROOT, 'assets', 'segments');
const VERIF_DIR = path.join(ROOT, 'verification');
const APP_URL   = 'https://day16-condition-trace.vercel.app';

const SETUP_MS = 8000; // fixed setup budget → startFrom = 240 frames @ 30 fps

const wait = ms => new Promise(r => setTimeout(r, ms));

function codeFor(key) {
  if (key === ' ')          return 'Space';
  if (key === 'ArrowRight') return 'ArrowRight';
  return `Key${key.toUpperCase()}`;
}

async function pressKey(page, key) {
  await page.evaluate(({ k, c }) => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k, code: c, bubbles: true, cancelable: true }));
  }, { k: key, c: codeFor(key) });
}

async function assertText(page, text, segId) {
  const found = await page.evaluate(t => document.body.innerText.includes(t), text);
  if (!found) {
    throw new Error(`[verify] FAIL — "${text}" not found in DOM for segment ${segId}`);
  }
  console.log(`[verify] "${text}" — FOUND ✓`);
}

async function captureSegment({ id, assertTexts, navigate, content, contentMs }) {
  console.log(`\n[capture] ══ Segment ${id} ══`);

  const tmpDir = path.join(SEGS_DIR, `tmp-${id}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: tmpDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  const t0 = Date.now();

  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`[capture] Page loaded (${Date.now() - t0} ms)`);

  // Extra wait for WebGL + React hydration
  await wait(2500);

  // Hard reset to clean "open" state
  await pressKey(page, 'r');
  await wait(500);
  console.log('[capture] Reset → open');

  // Navigate to the required step during setup
  await navigate(page);

  // Pad to exactly SETUP_MS from t0 to lock content window start
  const elapsed = Date.now() - t0;
  const pad = SETUP_MS - elapsed;
  if (pad > 0) {
    console.log(`[capture] Padding ${pad} ms → ${SETUP_MS} ms setup`);
    await wait(pad);
  } else {
    console.warn(`[capture] ⚠ Setup took ${elapsed} ms (over ${SETUP_MS} ms budget by ${-pad} ms)`);
  }

  const contentStart = Date.now();
  console.log(`[capture] ▶ Content window (total elapsed: ${contentStart - t0} ms)`);

  // Run the content-window function (hold, animate, etc.)
  await content(page);

  // Assert required heading is visible in DOM
  for (const text of assertTexts) {
    await assertText(page, text, id);
  }

  // Take the paired verification screenshot
  const verifPath = path.join(VERIF_DIR, `${id}.png`);
  await page.screenshot({ path: verifPath, fullPage: false });
  console.log(`[capture] Screenshot → ${verifPath}`);

  // Hold remaining time to fill contentMs
  const spent = Date.now() - contentStart;
  const remaining = contentMs - spent;
  if (remaining > 50) {
    await wait(remaining);
  }

  await context.close();
  await browser.close();

  // Rename the generated WebM to the canonical segment name
  const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.webm'));
  if (!files.length) throw new Error(`[capture] No WebM generated for ${id}`);

  const outPath = path.join(SEGS_DIR, `${id}.webm`);
  fs.renameSync(path.join(tmpDir, files[0]), outPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const mb = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(`[capture] ✓ Saved ${id}.webm (${mb} MB)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(SEGS_DIR,  { recursive: true });
  fs.mkdirSync(VERIF_DIR, { recursive: true });

  // ── 01 — Open object ──────────────────────────────────────────────────────
  await captureSegment({
    id: '01-open-object',
    assertTexts: ['Open object'],
    navigate: async () => {},                    // already at open state after R
    content:  async () => {},                    // static hold
    contentMs: 3000,                             // 3 s; composition uses 79 frames (2.63 s)
  });

  // ── 02 — Review record chain ──────────────────────────────────────────────
  await captureSegment({
    id: '02-review-record-chain',
    assertTexts: ['Review record chain'],
    navigate: async (page) => {
      await pressKey(page, ' '); await wait(400); // open → records
    },
    content: async () => {},
    contentMs: 3500,                             // composition uses 94 frames (3.13 s)
  });

  // ── 03 — Raking reveal ────────────────────────────────────────────────────
  await captureSegment({
    id: '03-raking-reveal',
    assertTexts: ['Inspect with raking light'],
    navigate: async (page) => {
      await pressKey(page, ' '); await wait(400); // open → records
      await pressKey(page, ' '); await wait(400); // records → inspect
    },
    content: async (page) => {
      // Raking animation: 12 × ArrowRight × 600 ms = 7.2 s (24° → 84°)
      console.log('[capture] Raking light animation…');
      for (let i = 0; i < 12; i++) {
        await pressKey(page, 'ArrowRight');
        const angle = 24 + (i + 1) * 5;
        console.log(`[capture]   ArrowRight ${i + 1}/12  → ${angle}°`);
        await wait(600);
      }
      // Hold at 84° (crack visible, CTA active) for 4.8 s
      await wait(4800);
    },
    contentMs: 12000,                            // 7.2 s raking + 4.8 s hold; composition uses 334 frames (11.13 s)
  });

  // ── 04 — Compare documentation ────────────────────────────────────────────
  await captureSegment({
    id: '04-compare-documentation',
    assertTexts: ['Compare documentation'],
    navigate: async (page) => {
      await pressKey(page, ' '); await wait(400); // open → records
      await pressKey(page, ' '); await wait(400); // records → inspect (Space works regardless of ready)
      await pressKey(page, ' '); await wait(400); // inspect → compare
    },
    content: async () => {},
    contentMs: 3500,
  });

  // ── 05 — First documented appearance ──────────────────────────────────────
  await captureSegment({
    id: '05-first-documented-appearance',
    assertTexts: ['First documented appearance'],
    navigate: async (page) => {
      await pressKey(page, ' '); await wait(400); // open → records
      await pressKey(page, ' '); await wait(400); // records → inspect
      await pressKey(page, ' '); await wait(400); // inspect → compare
      await pressKey(page, ' '); await wait(400); // compare → finding
    },
    content: async () => {},
    contentMs: 4000,                             // composition uses 109 frames (3.63 s)
  });

  // ── 06 — Generated evidence drawer ────────────────────────────────────────
  await captureSegment({
    id: '06-evidence-drawer',
    assertTexts: ['CT-1847'],
    navigate: async (page) => {
      await pressKey(page, ' '); await wait(400); // open → records
      await pressKey(page, ' '); await wait(400); // records → inspect
      await pressKey(page, ' '); await wait(400); // inspect → compare
      await pressKey(page, ' '); await wait(400); // compare → finding
    },
    content: async (page) => {
      // Drawer opens at the very start of the content window
      await pressKey(page, ' ');                 // finding → record (drawer slides in)
      await wait(600);                           // wait for Framer Motion animation
    },
    contentMs: 5000,                             // composition uses 139 frames (4.63 s)
  });

  console.log('\n[capture] ✓ All 6 segments captured successfully.');
  console.log(`[capture]   Segments:      ${SEGS_DIR}`);
  console.log(`[capture]   Verification:  ${VERIF_DIR}`);
}

main().catch(err => {
  console.error('[capture] FATAL:', err.message);
  process.exit(1);
});
