// viewport ("above the fold") captures, real rendering: node scripts/fold.mjs <base> <outdir> <prefix> path...
import { chromium } from 'playwright';
const [base, out, prefix, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  for (const u of paths) {
    await p.goto(base + u, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const name = `${prefix}-${(u.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home')}-${w}-fold.png`;
    await p.screenshot({ path: `${out}/${name}` });
    console.log(name);
  }
}
await b.close();
