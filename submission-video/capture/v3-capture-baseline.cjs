/*
 * Condition Trace V3 — submission capture baseline
 *
 * Captures the real Smoky Patina Archive application from a local Vite preview
 * built from design/uiux-v3-smoky-patina. No proof-bearing UI is recreated.
 *
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
  source: {
    url: URL,
    ref: SOURCE_REF,
    sha: SOURCE_SHA,
    contract: 'V3 Smoky Patina Archive — real application capture',
  },
  primaryViewport: { width: 1920, height: 1080 },
  captures: [],
  assertions: [],
  responsive: [],
  consoleErrors: [],
  pageErrors: [],
  exportedRecord: null,
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function noteAssertion(label, pass, detail = '') {
  report.assertions.push({ label, pass, detail });
  const mark = pass ? '✓' : '✗';
  console.log(`[assert] ${mark} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) throw new Error(`Assertion failed: ${label}${detail ? ` (${detail})` : ''}`);
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function waitForCanvas(page) {
  await page.waitForSelector('canvas', { state: 'visible', timeout: 15000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
  }, { timeout: 15000 });
  await sleep(1400);
}

async function assertStep(page, step) {
  await page.waitForSelector(`main[data-workflow-step="${step}"]`, { timeout: 8000 });
  const actual = await page.locator('main.app-shell').getAttribute('data-workflow-step');
  noteAssertion(`workflow step = ${step}`, actual === step, `actual=${actual}`);
}

async function assertText(page, text, label = text) {
  const found = await page.getByText(text, { exact: false }).first().isVisible().catch(() => false);
  noteAssertion(label, found, text);
}

async function assertBodyText(page, text, label = text) {
  const found = await page.evaluate(t => document.body.innerText.includes(t), text);
  noteAssertion(label, found, text);
}

async function capture(page, filename, label, viewport) {
  const full = path.join(OUT, filename);
  await page.screenshot({ path: full, type: 'png', fullPage: false });
  const bytes = fs.statSync(full).size;
  report.captures.push({ filename, label, width: viewport.width, height: viewport.height, bytes });
  console.log(`[capture] ${filename} (${Math.round(bytes / 1024)} KB)`);
}

async function pageMetrics(page) {
  return page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
}

function attachDiagnostics(page, label) {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const item = { page: label, text: msg.text() };
      report.consoleErrors.push(item);
      console.error(`[console:error][${label}] ${msg.text()}`);
    }
  });
  page.on('pageerror', error => {
    const item = { page: label, text: error.message };
    report.pageErrors.push(item);
    console.error(`[pageerror][${label}] ${error.message}`);
  });
}

async function loadClean(page) {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  await waitForFonts(page);
  await waitForCanvas(page);
  await page.keyboard.press('r');
  await assertStep(page, 'open');
  await sleep(900);
}

async function reachInspectReady(page) {
  await page.getByRole('button', { name: /Begin examination/i }).click();
  await assertStep(page, 'records');
  await sleep(900);
  await page.getByRole('button', { name: /Enter surface inspection/i }).click();
  await assertStep(page, 'inspect');
  await sleep(900);

  // 24° control value + 10 × 5° = 74° control value ≈ 8° from surface.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(90);
  }
  await assertBodyText(page, 'capture ready', 'raking-light capture-ready state');
  const disabled = await page.getByRole('button', { name: /Capture observation/i }).isDisabled();
  noteAssertion('Capture observation enabled', disabled === false);
  await sleep(550);
}

async function mainCapture(browser) {
  const viewport = { width: 1920, height: 1080 };
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, acceptDownloads: true });
  const page = await context.newPage();
  attachDiagnostics(page, 'primary-1920x1080');

  await loadClean(page);

  await assertText(page, 'CONDITION TRACE', 'Condition Trace identity visible');
  await assertBodyText(page, 'Case brief', 'Open / Case brief visible');
  await capture(page, '01-condition-trace-v3-open-16x9.png', 'Open / editorial case hero', viewport);

  await page.getByRole('button', { name: /Begin examination/i }).click();
  await assertStep(page, 'records');
  await sleep(1350);
  await assertBodyText(page, 'Evidence record chain', 'Records / Evidence record chain visible');
  const folioCount = await page.locator('.records-folio').count();
  noteAssertion('Records / four archive folios', folioCount === 4, `count=${folioCount}`);
  await assertBodyText(page, 'Diffuse and raking light', 'Verified return-arrival lighting visible');
  await capture(page, '02-condition-trace-v3-records-16x9.png', 'Records / evidence archive', viewport);

  await page.getByRole('button', { name: /Enter surface inspection/i }).click();
  await assertStep(page, 'inspect');
  await sleep(950);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(110);
  }
  await assertBodyText(page, 'capture ready', 'Inspect / capture-ready state');
  await assertBodyText(page, 'Upper-right shoulder', 'Inspect / target area visible');
  const captureButton = page.getByRole('button', { name: /Capture observation/i });
  noteAssertion('Inspect / Capture observation enabled', !(await captureButton.isDisabled()));
  await capture(page, '03-condition-trace-v3-raking-light-16x9.png', 'Inspect / raking-light signature', viewport);

  await captureButton.click();
  await page.getByText('OBS-04 / FRAME PRESERVED', { exact: false }).waitFor({ state: 'visible', timeout: 380 });
  await assertBodyText(page, 'Human-reviewed observation captured', 'OBS-04 preservation seal visible');
  await capture(page, '04-condition-trace-v3-obs04-preserved-16x9.png', 'OBS-04 / frame preserved', viewport);

  await assertStep(page, 'compare');
  await sleep(1100);
  await assertBodyText(page, 'NO EQUIVALENT RAKING-LIGHT CAPTURE', 'Compare / prior evidence gap visible');
  await assertBodyText(page, 'AREA MATCH', 'Compare / area match visible');
  await assertBodyText(page, 'LIGHTING GAP', 'Compare / lighting gap visible');
  await assertBodyText(page, 'Prior physical absence therefore cannot be established', 'Compare / limitation preserved');
  await capture(page, '05-condition-trace-v3-compare-16x9.png', 'Compare / honest A-B documentation comparison', viewport);

  await page.getByRole('button', { name: /Continue to finding/i }).click();
  await assertStep(page, 'finding');
  await sleep(1850);
  for (const id of ['SRC-03', 'OBS-04', 'CMP-01', 'LIM-01', 'FND-01']) {
    await assertBodyText(page, id, `Finding / lineage ${id}`);
  }
  await assertBodyText(page, 'First documented appearance · Aug 3, 2026', 'Finding / canonical conclusion visible');
  await assertBodyText(page, 'Prior physical absence cannot be confirmed', 'Finding / limitation visible');
  await capture(page, '06-condition-trace-v3-evidence-trace-16x9.png', 'Finding / animated evidence lineage', viewport);

  await page.getByRole('button', { name: /Generate evidence record/i }).click();
  await assertStep(page, 'record');
  await page.locator('section[aria-label="Generated evidence record"]').waitFor({ state: 'visible', timeout: 4000 });
  await sleep(1350);
  await assertBodyText(page, 'First documented appearance', 'Record / title visible');
  await assertBodyText(page, 'CT-1847 / 03 AUG 2026', 'Record / canonical document ID visible');
  await assertBodyText(page, 'DOCUMENTATION GAP', 'Record / documentation gap visible');
  await assertBodyText(page, 'Export review record', 'Record / export action visible');
  await capture(page, '07-condition-trace-v3-evidence-record-16x9.png', 'Record / generated archival evidence record', viewport);

  const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
  await page.getByRole('button', { name: /Export review record/i }).click();
  const download = await downloadPromise;
  const exportName = 'CT-1847-condition-trace-review.json';
  const exportPath = path.join(OUT, exportName);
  await download.saveAs(exportPath);
  const exportPayload = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  noteAssertion('Export / finding status qualified', exportPayload.findingStatus === 'QUALIFIED');
  noteAssertion('Export / OBS-04 preserved', exportPayload.capturedObservation?.id === 'OBS-04');
  noteAssertion('Export / no liability claim', String(exportPayload.limitation || '').toLowerCase().includes('liability'));
  report.exportedRecord = { filename: exportName, bytes: fs.statSync(exportPath).size };

  const metrics = await pageMetrics(page);
  noteAssertion('Primary viewport / no horizontal overflow', metrics.horizontalOverflow === false, JSON.stringify(metrics));

  await context.close();
}

async function responsiveCheck(browser, viewport, filename, mode) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  attachDiagnostics(page, `qa-${viewport.width}x${viewport.height}`);
  await loadClean(page);

  if (mode === 'finding') {
    await reachInspectReady(page);
    await page.getByRole('button', { name: /Capture observation/i }).click();
    await assertStep(page, 'compare');
    await sleep(850);
    await page.getByRole('button', { name: /Continue to finding/i }).click();
    await assertStep(page, 'finding');
    await sleep(1550);
    await assertBodyText(page, 'FND-01', `Responsive ${viewport.width} / finding lineage visible`);
  }

  const metrics = await pageMetrics(page);
  noteAssertion(`Responsive ${viewport.width}x${viewport.height} / no horizontal overflow`, metrics.horizontalOverflow === false, JSON.stringify(metrics));
  await capture(page, filename, `Responsive QA / ${mode}`, viewport);
  report.responsive.push({ viewport, mode, ...metrics });
  await context.close();
}

(async () => {
  console.log(`[baseline] URL=${URL}`);
  console.log(`[baseline] ref=${SOURCE_REF}`);
  console.log(`[baseline] sha=${SOURCE_SHA}`);

  const browser = await chromium.launch({ headless: true });
  let failed = false;
  try {
    await mainCapture(browser);
    await responsiveCheck(browser, { width: 1440, height: 900 }, 'qa-condition-trace-v3-open-1440x900.png', 'open');
    await responsiveCheck(browser, { width: 1366, height: 768 }, 'qa-condition-trace-v3-finding-1366x768.png', 'finding');
  } catch (error) {
    failed = true;
    report.failure = { message: error.message, stack: error.stack };
    console.error(error);
  } finally {
    await browser.close();
    report.passed = !failed && report.consoleErrors.length === 0 && report.pageErrors.length === 0;
    fs.writeFileSync(path.join(OUT, 'capture-report.json'), JSON.stringify(report, null, 2));
    console.log(`[baseline] report written; passed=${report.passed}`);
  }

  if (!report.passed) {
    console.error(`[baseline] FAILED — consoleErrors=${report.consoleErrors.length} pageErrors=${report.pageErrors.length}`);
    process.exit(1);
  }

  console.log('[baseline] PASS — V3 capture baseline complete.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
