#!/usr/bin/env node
/*
 * Génère les images hébergées de la signature à partir du générateur
 * lui-même (index.html), pour garantir un rendu identique à l'aperçu.
 *
 *   node tools/build-assets.cjs                      -> assets/signature-block.png + assets/linkedin.png
 *   node tools/build-assets.cjs --baseline "Texte"   -> assets/blocks/b-<hash>.png (accroche personnalisée)
 *
 * Prérequis : npm i -D playwright (ou Playwright installé globalement).
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
  console.error('Playwright est requis : npm i -D playwright');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const baselineArg = args.includes('--baseline') ? args[args.indexOf('--baseline') + 1] : null;

function writeDataUrl(file, dataUrl) {
  const out = path.join(root, 'assets', file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('écrit :', path.relative(root, out));
}

(async () => {
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(launch);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await page.waitForFunction(() => window.VoltRSignature);
  await page.evaluate(() => window.VoltRSignature.ready);

  if (baselineArg) {
    const res = await page.evaluate((b) => ({
      file: window.VoltRSignature.blockFile(b),
      data: window.VoltRSignature.renderBlock(b, 2)
    }), baselineArg);
    writeDataUrl(res.file, res.data);
  } else {
    const res = await page.evaluate(() => ({
      block: window.VoltRSignature.renderBlock(window.VoltRSignature.config.DEFAULT_BASELINE, 2),
      icon: window.VoltRSignature.renderIcon(3),
      cfg: window.VoltRSignature.config
    }));
    writeDataUrl(res.cfg.BLOCK_FILE, res.block);
    writeDataUrl(res.cfg.ICON_FILE, res.icon);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
