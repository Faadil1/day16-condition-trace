'use strict';
const path = require('path');
const fs = require('fs');
const PLAYWRIGHT_PATH = 'C:\\Users\\fboussari\\Documents\\node-v24.16.0-win-x64\\node-v24.16.0-win-x64\\node_modules';
const { chromium } = require(path.join(PLAYWRIGHT_PATH, 'playwright'));

const OUT_DIR = path.join(__dirname, '..', 'evidence', 'canonical-v3-live');
const OUT_FILE = path.join(OUT_DIR, 'canonical-v3-live-recording.webm');
const URL = 'https://day16-condition-trace-763l8ombe-faadil1s-projects.vercel.app/?_vercel_share=MlPnKIqjeXm8LPueFNVx6My7i4ij3KIY';
const WAIT = ms => new Promise(r => setTimeout(r, ms));

async function clickText(page, text) {
  const loc = page.getByText(text, { exact: false }).first();
  await loc.waitFor({ state: 'visible', timeout: 15000 });
  await loc.click({ timeout: 15000 });
}

async function pressSpace(page) {
  await page.keyboard.press('Space');
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await WAIT(3000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  const required = ['CONDITION TRACE', 'TRACE THE RECORD. NOT THE BLAME.', 'CT-1847', 'OBJECT / 01', 'RECORD CHAIN / 04 MOMENTS'];
  for (const t of required) {
    if (!bodyText.includes(t)) throw new Error(`Missing canonical marker: ${t}`);
  }

  await clickText(page, 'BEGIN EXAMINATION');
  await WAIT(2500);

  for (const _ of [1, 2, 3, 4, 5]) {
    await pressSpace(page);
    await WAIT(2500);
  }

  await WAIT(3000);
  await context.close();
  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.webm') && f !== 'canonical-v3-live-recording.webm');
  if (!files.length) throw new Error('No webm produced');
  const latest = files.map(name => ({ name, mtime: fs.statSync(path.join(OUT_DIR, name)).mtimeMs })).sort((a, b) => b.mtime - a.mtime)[0];
  fs.renameSync(path.join(OUT_DIR, latest.name), OUT_FILE);
  console.log(OUT_FILE);
})();
