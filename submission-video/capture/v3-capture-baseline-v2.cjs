/*
 * Condition Trace V3 — deterministic submission capture baseline v2
 *
 * Captures only the real V3 application. No proof-bearing UI is recreated.
 * Output: submission-video/v3-captures/
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'submission-video', 'v3-captures');
const URL = process.env.CAPTURE_URL || 'http://127.0.0.1:4173';
const SOURCE_SHA = process.env.CAPTURE_SHA || process.env.GITHUB_SHA || 'unknown';
const SOURCE_REF = process.env.CAPTURE_REF || process.env.GITHUB_REF_NAME || 'design/uiux-v3-smoky-patina';

fs.mkdirSync(OUT, { recursive: true });

const report = {
  createdAt: new Date().toISOString(),
  source: { url: URL, ref: SOURCE_REF, sha: SOURCE_SHA, contract: 'real V3 Smoky Patina Archive application capture' },
  primaryViewport: { width: 1920, height: 1080 },
  captures: [],
  assertions: [],
  responsive: [],
  consoleErrors: [],
  pageErrors: [],
  exportedRecord: null,
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function note(label, pass, detail = '') {
  report.assertions.push({ label, pass, detail });
  console.log(`[assert] ${pass ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) throw new Error(`Assertion failed: ${label}${detail ? ` (${detail})` : ''}`);
}

function diagnostics(page, label) {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      report.consoleErrors.push({ page: label, text: msg.text() });
      console.error(`[console:error][${label}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    report.pageErrors.push({ page: label, text: err.message });
    console.error(`[pageerror][${label}] ${err.message}`);
  });
}

async function bodyHas(page, text, label = text) {
  const pass = await page.evaluate(t => document.body.innerText.includes(t), text);
  note(label, pass, text);
}

async function assertStep(page, step) {
  await page.waitForSelector(`main[data-workflow-step="${step}"]`, { timeout: 10000 });
  const actual = await page.locator('main.app-shell').getAttribute('data-workflow-step');
  note(`workflow step = ${step}`, actual === step, `actual=${actual}`);
}

async function capture(page, filename, label, viewport) {
  const full = path.join(OUT, filename);
  await page.screenshot({ path: full, type: 'png', fullPage: false, animations: 'allow' });
  const bytes = fs.statSync(full).size;
  report.captures.push({ filename, label, width: viewport.width, height: viewport.height, bytes });
  console.log(`[capture] ${filename} (${Math.round(bytes / 1024)} KB)`);
}

async function metrics(page) {
  return page.evaluate(() => ({
    viewportWidth: innerWidth,
    viewportHeight: innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
  }));
}

async function loadClean(page) {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForSelector('canvas', { state: 'visible', timeout: 15000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
  }, null, { timeout: 15000 });
  await sleep(1200);
  await page.keyboard.press('r');
  await assertStep(page, 'open');
  await sleep(700);
}

async function reachInspect(page) {
  await page.getByRole('button', { name: /Begin examination/i }).click();
  await assertStep(page, 'records');
  await sleep(800);
  await page.getByRole('button', { name: /Enter surface inspection/i }).click();
  await assertStep(page, 'inspect');
  await sleep(800);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(85);
  }
  await bodyHas(page, 'capture ready', 'raking-light capture-ready state');
  const button = page.getByRole('button', { name: /Capture observation/i });
  note('Capture observation enabled', !(await button.isDisabled()));
}

async function triggerObservation(page, captureSeal = null) {
  const button = page.getByRole('button', { name: /Capture observation/i });
  await button.evaluate(el => el.click());
  await sleep(70);
  if (captureSeal) await captureSeal();
  await bodyHas(page, 'OBS-04', 'OBS-04 mounted after capture');
  await bodyHas(page, 'FRAME PRESERVED', 'OBS-04 frame-preserved state exists');
  await bodyHas(page, 'Human-reviewed observation captured', 'OBS-04 human-reviewed status exists');
  await assertStep(page, 'compare');
}

async function primaryCapture(browser) {
  const viewport = { width: 1920, height: 1080 };
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, acceptDownloads: true });
  const page = await context.newPage();
  diagnostics(page, 'primary-1920x1080');

  await loadClean(page);
  await bodyHas(page, 'CONDITION TRACE', 'Condition Trace identity visible');
  await bodyHas(page, 'Case brief', 'Open / Case brief visible');
  await capture(page, '01-condition-trace-v3-open-16x9.png', 'Open / editorial case hero', viewport);

  await page.getByRole('button', { name: /Begin examination/i }).click();
  await assertStep(page, 'records');
  await sleep(1100);
  await bodyHas(page, 'Evidence record chain', 'Records / evidence record chain visible');
  note('Records / four archive folios', (await page.locator('.records-folio').count()) === 4);
  await bodyHas(page, 'Diffuse and raking light', 'Records / return-arrival raking-light evidence visible');
  await capture(page, '02-condition-trace-v3-records-16x9.png', 'Records / evidence archive', viewport);

  await page.getByRole('button', { name: /Enter surface inspection/i }).click();
  await assertStep(page, 'inspect');
  await sleep(800);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(90);
  }
  await bodyHas(page, 'capture ready', 'Inspect / capture-ready state');
  await bodyHas(page, 'Upper-right shoulder', 'Inspect / target area visible');
  note('Inspect / Capture observation enabled', !(await page.getByRole('button', { name: /Capture observation/i }).isDisabled()));
  await capture(page, '03-condition-trace-v3-raking-light-16x9.png', 'Inspect / raking-light signature', viewport);

  await triggerObservation(page, async () => {
    await capture(page, '04-condition-trace-v3-obs04-preserved-16x9.png', 'OBS-04 / transient frame-preserved state', viewport);
  });

  await sleep(900);
  await bodyHas(page, 'NO EQUIVALENT RAKING-LIGHT CAPTURE', 'Compare / prior evidence gap visible');
  await bodyHas(page, 'AREA MATCH', 'Compare / area match visible');
  await bodyHas(page, 'LIGHTING GAP', 'Compare / lighting gap visible');
  await bodyHas(page, 'Prior physical absence therefore cannot be established', 'Compare / limitation preserved');
  await capture(page, '05-condition-trace-v3-compare-16x9.png', 'Compare / honest A-B documentation comparison', viewport);

  await page.getByRole('button', { name: /Continue to finding/i }).click();
  await assertStep(page, 'finding');
  await sleep(1600);
  for (const id of ['SRC-03', 'OBS-04', 'CMP-01', 'LIM-01', 'FND-01']) await bodyHas(page, id, `Finding / lineage ${id}`);
  await bodyHas(page, 'First documented appearance · Aug 3, 2026', 'Finding / canonical conclusion visible');
  await bodyHas(page, 'Prior physical absence cannot be confirmed', 'Finding / limitation visible');
  await capture(page, '06-condition-trace-v3-evidence-trace-16x9.png', 'Finding / evidence lineage', viewport);

  await page.getByRole('button', { name: /Generate evidence record/i }).click();
  await assertStep(page, 'record');
  const drawer = page.locator('section[aria-label="Generated evidence record"]');
  await drawer.waitFor({ state: 'visible', timeout: 5000 });
  await sleep(900);
  await bodyHas(page, 'First documented appearance', 'Record / title visible');
  await bodyHas(page, 'CT-1847 / 03 AUG 2026', 'Record / canonical document ID visible');
  await bodyHas(page, 'DOCUMENTATION GAP', 'Record / documentation gap visible');
  await capture(page, '07-condition-trace-v3-evidence-record-16x9.png', 'Record / generated archival evidence record', viewport);

  const exportButton = page.getByRole('button', { name: /Export review record/i });
  note('Record / export action mounted', (await exportButton.count()) === 1);
  const downloadPromise = page.waitForEvent('download', { timeout: 7000 });
  await exportButton.evaluate(el => el.click());
  const download = await downloadPromise;
  const exportName = 'CT-1847-condition-trace-review.json';
  const exportPath = path.join(OUT, exportName);
  await download.saveAs(exportPath);
  const payload = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  note('Export / finding status qualified', payload.findingStatus === 'QUALIFIED');
  note('Export / OBS-04 preserved', payload.capturedObservation?.id === 'OBS-04');
  note('Export / no liability claim', String(payload.limitation || '').toLowerCase().includes('liability'));
  report.exportedRecord = { filename: exportName, bytes: fs.statSync(exportPath).size };

  const m = await metrics(page);
  note('Primary viewport / no horizontal overflow', m.horizontalOverflow === false, JSON.stringify(m));
  await context.close();
}

async function responsiveCapture(browser, viewport, filename, mode) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  diagnostics(page, `qa-${viewport.width}x${viewport.height}`);
  await loadClean(page);

  if (mode === 'finding') {
    await reachInspect(page);
    await triggerObservation(page);
    await sleep(700);
    await page.getByRole('button', { name: /Continue to finding/i }).click();
    await assertStep(page, 'finding');
    await sleep(1300);
    await bodyHas(page, 'FND-01', `Responsive ${viewport.width} / finding lineage visible`);
  }

  const m = await metrics(page);
  note(`Responsive ${viewport.width}x${viewport.height} / no horizontal overflow`, m.horizontalOverflow === false, JSON.stringify(m));
  await capture(page, filename, `Responsive QA / ${mode}`, viewport);
  report.responsive.push({ viewport, mode, ...m });
  await context.close();
}

(async () => {
  console.log(`[baseline-v2] URL=${URL}`);
  console.log(`[baseline-v2] ref=${SOURCE_REF}`);
  console.log(`[baseline-v2] sha=${SOURCE_SHA}`);

  const browser = await chromium.launch({ headless: true });
  let failed = false;
  try {
    await primaryCapture(browser);
    await responsiveCapture(browser, { width: 1440, height: 900 }, 'qa-condition-trace-v3-open-1440x900.png', 'open');
    await responsiveCapture(browser, { width: 1366, height: 768 }, 'qa-condition-trace-v3-finding-1366x768.png', 'finding');
  } catch (error) {
    failed = true;
    report.failure = { message: error.message, stack: error.stack };
    console.error(error);
  } finally {
    await browser.close();
    report.passed = !failed && report.consoleErrors.length === 0 && report.pageErrors.length === 0;
    fs.writeFileSync(path.join(OUT, 'capture-report.json'), JSON.stringify(report, null, 2));
    console.log(`[baseline-v2] report written; passed=${report.passed}`);
  }

  if (!report.passed) process.exit(1);
  console.log('[baseline-v2] PASS — V3 capture baseline complete.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
