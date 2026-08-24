'use strict';
const path = require('path');
const fs = require('fs');
const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const ROOT = path.join(__dirname, '..');
const SEGS_DIR = path.join(ROOT, 'assets', 'segments');
const VERIF_DIR = path.join(ROOT, 'verification');
const SHOTS_DIR = path.join(ROOT, 'screenshots');
const COVER_BG = path.join(ROOT, 'assets', 'cover-raking-bg.png');
const APP_URL = 'http://127.0.0.1:4173';
const SETUP_MS = 8000;
const VIEW = { width: 1440, height: 900 };

const wait = ms => new Promise(r => setTimeout(r, ms));
const codeFor = key => key === ' ' ? 'Space' : key === 'ArrowRight' ? 'ArrowRight' : `Key${key.toUpperCase()}`;

async function pressKey(page, key) {
  await page.evaluate(({ k, c }) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k, code: c, bubbles: true, cancelable: true }));
  }, { k: key, c: codeFor(key) });
}

async function assertText(page, text, segId) {
  const found = await page.evaluate(t => document.body.innerText.includes(t), text);
  if (!found) throw new Error(`[verify] "${text}" missing for ${segId}`);
}

async function captureSegment({ id, assertTexts, navigate, content, contentMs, shotName }) {
  const tmpDir = path.join(SEGS_DIR, `tmp-${id}`);
  fs.mkdirSync(tmpDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1, recordVideo: { dir: tmpDir, size: VIEW } });
  const page = await context.newPage();
  const t0 = Date.now();

  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await wait(2200);
  await pressKey(page, 'r');
  await wait(450);
  await navigate(page);

  const pad = SETUP_MS - (Date.now() - t0);
  if (pad > 0) await wait(pad);

  const contentStart = Date.now();
  await content(page);
  for (const text of assertTexts) await assertText(page, text, id);

  const shotPath = path.join(VERIF_DIR, shotName);
  await page.screenshot({ path: shotPath, fullPage: false });
  if (id === '03-raking-reveal') {
    await page.screenshot({ path: COVER_BG, fullPage: false });
  }

  const remaining = contentMs - (Date.now() - contentStart);
  if (remaining > 50) await wait(remaining);

  await context.close();
  await browser.close();

  const webm = fs.readdirSync(tmpDir).find(f => f.endsWith('.webm'));
  if (!webm) throw new Error(`No WebM recorded for ${id}`);
  fs.renameSync(path.join(tmpDir, webm), path.join(SEGS_DIR, `${id}.webm`));
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

async function main() {
  fs.mkdirSync(SEGS_DIR, { recursive: true });
  fs.mkdirSync(VERIF_DIR, { recursive: true });
  fs.mkdirSync(SHOTS_DIR, { recursive: true });

  await captureSegment({
    id: '01-open-object',
    shotName: '01-condition-trace-v3-opening-final.png',
    assertTexts: ['Open object'],
    navigate: async () => {},
    content: async () => {},
    contentMs: 4500,
  });

  await captureSegment({
    id: '02-review-record-chain',
    shotName: '02-condition-trace-v3-records-final.png',
    assertTexts: ['Review record chain'],
    navigate: async page => { await pressKey(page, ' '); await wait(400); },
    content: async () => {},
    contentMs: 7000,
  });

  await captureSegment({
    id: '03-raking-reveal',
    shotName: '03-condition-trace-v3-raking-light-final.png',
    assertTexts: ['Inspect with raking light'],
    navigate: async page => { await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); },
    content: async page => {
      for (let i = 0; i < 12; i++) { await pressKey(page, 'ArrowRight'); await wait(600); }
      await wait(4800);
    },
    contentMs: 14000,
  });

  await captureSegment({
    id: '04-compare-documentation',
    shotName: '04-condition-trace-v3-compare-final.png',
    assertTexts: ['Compare documentation'],
    navigate: async page => { await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); },
    content: async () => {},
    contentMs: 7000,
  });

  await captureSegment({
    id: '05-first-documented-appearance',
    shotName: '05-condition-trace-v3-evidence-trace-final.png',
    assertTexts: ['First documented appearance'],
    navigate: async page => { await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); },
    content: async () => {},
    contentMs: 5500,
  });

  await captureSegment({
    id: '06-evidence-drawer',
    shotName: '06-condition-trace-v3-evidence-record-final.png',
    assertTexts: ['CT-1847'],
    navigate: async page => { await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); await pressKey(page, ' '); await wait(400); },
    content: async page => { await pressKey(page, ' '); await wait(700); },
    contentMs: 7000,
  });

  console.log('Capture complete.');
}

main().catch(err => { console.error(err); process.exit(1); });


