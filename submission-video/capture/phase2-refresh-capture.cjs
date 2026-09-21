'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUT = path.join(process.cwd(), 'phase2-refresh-output');
const TMP = path.join(OUT, 'video-temp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const URL = process.env.CAPTURE_URL || 'http://127.0.0.1:4173';
const wait = ms => new Promise(r => setTimeout(r, ms));

async function pressKey(page, key) {
  await page.evaluate(k => {
    const el = document.activeElement;
    if (el && typeof el.blur === 'function') el.blur();
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: k,
      code: k === ' ' ? 'Space' : (k.startsWith('Arrow') ? k : 'Key' + k.toUpperCase()),
      bubbles: true,
      cancelable: true,
    }));
  }, key);
}

async function screenshot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, type: 'png', fullPage: false });
  console.log('[capture] saved', file);
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
    recordVideo: {
      dir: TMP,
      size: { width: 1920, height: 1080 },
    },
  });
  const page = await context.newPage();
  const video = page.video();
  const events = [];
  const started = Date.now();
  const mark = name => {
    const t = (Date.now() - started) / 1000;
    events.push({ name, t: Number(t.toFixed(3)) });
    console.log('[capture]', name, t.toFixed(3) + 's');
  };

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  mark('page-loaded');
  await wait(2200);

  await pressKey(page, 'r');
  await waitStep(page, 'open');
  await wait(1000);
  mark('open-stable');
  await screenshot(page, '01-day16-current-open-1920x1080.png');

  await pressKey(page, ' ');
  await waitStep(page, 'records');
  await wait(1000);
  mark('records-stable');
  await screenshot(page, '02-day16-current-records-1920x1080.png');

  await pressKey(page, ' ');
  await waitStep(page, 'inspect');
  await wait(1200);
  mark('inspect-start');
  await screenshot(page, '03-day16-current-inspect-start-1920x1080.png');

  for (let i = 0; i < 10; i++) {
    await pressKey(page, 'ArrowRight');
    await wait(280);
  }
  await wait(850);
  mark('review-range-reveal');
  const bodyAtReveal = await page.locator('body').innerText();
  if (!/REVIEW RANGE/i.test(bodyAtReveal)) throw new Error('Latest runtime did not reach REVIEW RANGE');
  await screenshot(page, '04-day16-current-raking-reveal-1920x1080.png');

  await wait(900);
  mark('capture-trigger');
  await pressKey(page, ' ');
  await wait(180);
  mark('capture-seal');
  await screenshot(page, '05-day16-current-obs04-seal-1920x1080.png');

  await waitStep(page, 'compare');
  await wait(850);
  mark('compare-stable');
  const compareText = await page.locator('body').innerText();
  if (!/AREA MATCH/i.test(compareText) || !/LIGHTING GAP/i.test(compareText)) {
    throw new Error('Compare proof state missing AREA MATCH / LIGHTING GAP');
  }
  await screenshot(page, '06-day16-current-compare-1920x1080.png');

  await pressKey(page, ' ');
  await waitStep(page, 'finding');
  await wait(900);
  mark('finding-stable');
  await screenshot(page, '07-day16-current-finding-1920x1080.png');

  const seal = page.locator('.hold-to-seal');
  await seal.waitFor({ state: 'visible', timeout: 10000 });
  const box = await seal.boundingBox();
  if (!box) throw new Error('Hold-to-seal button has no bounding box');

  mark('hold-to-seal-start');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await wait(1050);
  await page.mouse.up();
  mark('hold-to-seal-complete');

  await waitStep(page, 'record');
  await wait(1300);
  mark('record-stable');
  const recordText = await page.locator('body').innerText();
  if (!/DOCUMENTATION GAP/i.test(recordText) || !/First documented appearance/i.test(recordText)) {
    throw new Error('Final evidence record proof state missing');
  }
  await screenshot(page, '08-day16-current-evidence-record-1920x1080.png');

  await wait(1200);
  mark('end-hold');

  await context.close();
  const rawVideoPath = await video.path();
  const finalVideo = path.join(OUT, 'day16-current-main-full-walk.webm');
  fs.copyFileSync(rawVideoPath, finalVideo);

  const provenance = {
    repository: 'Faadil1/day16-condition-trace',
    branch: 'main',
    commit: process.env.GITHUB_SHA || null,
    expectedCommit: 'dc36a537dd08b3e3d835c25fe3cae3b97e6060e4',
    sourceUrl: URL,
    viewport: '1920x1080',
    captureDateUtc: new Date().toISOString(),
    events,
    outputs: fs.readdirSync(OUT).filter(x => !x.startsWith('video-temp')),
  };
  fs.writeFileSync(path.join(OUT, 'provenance.json'), JSON.stringify(provenance, null, 2));

  await browser.close();
  console.log('[capture] complete');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
