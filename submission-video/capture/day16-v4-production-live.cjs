'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const URL = process.env.CAPTURE_URL || 'https://day16-condition-trace.vercel.app/';
const OUT = path.join(process.cwd(), 'day16-v4-live-output');
const TMP = path.join(OUT, 'tmp-video');
const FRAMES = path.join(OUT, 'stills');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(FRAMES, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));

async function key(page, value) {
  await page.evaluate(k => {
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') active.blur();
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: k,
      code: k === ' ' ? 'Space' : (k.startsWith('Arrow') ? k : 'Key' + k.toUpperCase()),
      bubbles: true,
      cancelable: true,
    }));
  }, value);
}

async function shot(page, name) {
  const p = path.join(FRAMES, name);
  await page.screenshot({ path: p, fullPage: false });
  console.log('[v4-live] still', name);
}

async function waitStep(page, step) {
  await page.waitForSelector('[data-workflow-step="' + step + '"]', { timeout: 15000 });
  await wait(350);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: TMP, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  const video = page.video();

  const marks = [];
  const started = Date.now();
  const mark = name => {
    const t = Number(((Date.now() - started) / 1000).toFixed(3));
    marks.push({ name, t });
    console.log('[v4-live]', name, t);
  };

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await waitStep(page, 'open');
  const openBody = await page.locator('body').innerText();
  if (!/CONDITION TRACE/i.test(openBody) || !/TRACE THE RECORD/i.test(openBody)) throw new Error('Production runtime is not Condition Trace');

  mark('open');
  await wait(2500);
  await shot(page, '01-open-v4.png');
  await wait(2200);

  await key(page, ' ');
  await waitStep(page, 'records');
  mark('records');
  await wait(2500);
  await shot(page, '02-records-v4.png');
  await wait(2200);

  await key(page, ' ');
  await waitStep(page, 'inspect');
  mark('inspect-start');
  await wait(1400);

  for (let i = 0; i < 12; i++) {
    await key(page, 'ArrowRight');
    await wait(430);
  }
  const inspectText = await page.locator('body').innerText();
  if (!/REVIEW RANGE/i.test(inspectText)) throw new Error('Review range not reached in production V4');
  mark('review-range');
  await wait(1600);
  await shot(page, '03-raking-reveal-v4.png');
  await wait(1200);

  mark('obs04-trigger');
  await key(page, ' ');
  await wait(150);
  await shot(page, '04-obs04-v4.png');

  await waitStep(page, 'compare');
  const compareText = await page.locator('body').innerText();
  if (!/AREA MATCH/i.test(compareText) || !/LIGHTING GAP/i.test(compareText) || !/OBS-04/i.test(compareText)) {
    throw new Error('Compare proof markers missing in production V4');
  }
  mark('compare');
  await wait(3000);
  await shot(page, '05-compare-v4.png');
  await wait(1800);

  await key(page, ' ');
  await waitStep(page, 'finding');
  await page.waitForFunction(() => ['SRC-03','OBS-04','CMP-01','LIM-01','FND-01'].every(t => document.body.innerText.includes(t)), null, { timeout: 8000 });
  mark('finding');
  await wait(3000);
  await shot(page, '06-finding-v4.png');
  await wait(1500);

  const seal = page.locator('.hold-to-seal');
  await seal.waitFor({ state: 'visible', timeout: 10000 });
  await seal.focus();
  mark('seal-start');
  await page.keyboard.down('Enter');
  await wait(700);
  await shot(page, '07-seal-v4.png');
  await wait(900);

  await waitStep(page, 'record');
  await page.keyboard.up('Enter');
  mark('record');
  await wait(3200);
  const recordText = await page.locator('body').innerText();
  if (!/First documented appearance/i.test(recordText) || !/DOCUMENTATION GAP/i.test(recordText)) {
    throw new Error('Final record proof state missing in production V4');
  }
  await shot(page, '08-record-v4.png');
  await wait(2500);
  mark('end');

  await context.close();
  const tmpVideo = await video.path();
  const rawVideo = path.join(OUT, 'day16-v4-live-recording.webm');
  fs.copyFileSync(tmpVideo, rawVideo);

  const provenance = {
    repo: 'Faadil1/day16-condition-trace',
    sourceBranch: 'design/evidence-in-motion-v4',
    sourceCommit: '810ddeb61d8116f379380d57e93c56db40b944af',
    mainCommit: '810ddeb61d8116f379380d57e93c56db40b944af',
    runtime: URL,
    captureType: 'live browser recording',
    captureDate: new Date().toISOString(),
    viewport: '1920x1080',
    marks,
    files: [
      'day16-v4-live-recording.webm',
      ...fs.readdirSync(FRAMES).map(name => 'stills/' + name),
    ],
  };
  fs.writeFileSync(path.join(OUT, 'provenance.json'), JSON.stringify(provenance, null, 2));

  await browser.close();
  console.log('[v4-live] PASS');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
