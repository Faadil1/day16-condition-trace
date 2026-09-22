'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUT = path.join(process.cwd(), 'evidence-in-motion-v4-qa');
fs.mkdirSync(OUT, { recursive: true });

const URL = process.env.CAPTURE_URL || 'http://127.0.0.1:4173';
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
  const out = path.join(OUT, name);
  await page.screenshot({ path: out, fullPage: false });
  console.log('[v4-qa] screenshot', out);
}

async function waitStep(page, step) {
  await page.waitForSelector('[data-workflow-step="' + step + '"]', { timeout: 15000 });
  await wait(450);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await waitStep(page, 'open');
  await shot(page, '01-open.png');

  await key(page, ' ');
  await waitStep(page, 'records');
  await shot(page, '02-records.png');

  await key(page, ' ');
  await waitStep(page, 'inspect');
  await shot(page, '03-inspect-start.png');

  for (let i = 0; i < 12; i++) {
    await key(page, 'ArrowRight');
    await wait(180);
  }
  const inspectText = await page.locator('body').innerText();
  if (!/REVIEW RANGE/i.test(inspectText)) throw new Error('Review range not reached');
  await wait(650);
  await shot(page, '04-review-range.png');

  await key(page, ' ');
  await wait(130);
  await shot(page, '05-obs04-transition.png');

  await waitStep(page, 'compare');
  const compareText = await page.locator('body').innerText();
  if (!/AREA MATCH/i.test(compareText) || !/LIGHTING GAP/i.test(compareText) || !/OBS-04/i.test(compareText)) {
    throw new Error('Compare evidence markers missing');
  }
  await shot(page, '06-compare.png');

  await key(page, ' ');
  await waitStep(page, 'finding');
  await page.waitForFunction(() => document.body.innerText.includes('SRC-03') && document.body.innerText.includes('FND-01'), null, { timeout: 8000 });
  await wait(520);
  const findingText = await page.locator('body').innerText();
  for (const token of ['SRC-03', 'OBS-04', 'CMP-01', 'LIM-01', 'FND-01']) {
    if (!findingText.includes(token)) throw new Error('Finding missing ' + token);
  }
  await shot(page, '07-finding.png');

  const seal = page.locator('.hold-to-seal');
  await seal.focus();
  await page.keyboard.down('Enter');
  await wait(700);
  await shot(page, '08-seal-resistance.png');
  await wait(900);

  await waitStep(page, 'record');
  await page.keyboard.up('Enter');
  await wait(900);
  await shot(page, '09-record.png');

  const body = await page.locator('body').innerText();
  if (!/First documented appearance/i.test(body) || !/DOCUMENTATION GAP/i.test(body)) {
    throw new Error('Final record proof state missing');
  }

  const report = {
    branch: 'design/evidence-in-motion-v4',
    url: URL,
    viewport: '1920x1080',
    checks: {
      open: true,
      records: true,
      inspect: true,
      reviewRange: true,
      obs04: true,
      compare: true,
      finding: true,
      sealResistance: true,
      record: true,
    },
    capturedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT, 'qa.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log('[v4-qa] PASS');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
