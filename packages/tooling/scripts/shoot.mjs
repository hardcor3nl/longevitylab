// usage: node scripts/shoot.mjs <base> <outdir> <prefix> path1 path2 ...
import { chromium } from 'playwright';
import fs from 'node:fs';
const [base, out, prefix, ...paths] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(800);
    await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; }));
    // trigger lazy content
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(2500);
    const name = `${prefix}-${(p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home')}-${tag}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    console.log(name);
  }
  await ctx.close();
}
await browser.close();
