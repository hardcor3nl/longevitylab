// usage: node scripts/imgcheck.mjs <base> path...   reports images that fail to load after scrolling
import { chromium } from 'playwright';
const [base, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
let bad = 0;
for (const u of paths) {
  await p.goto(base + u, { waitUntil: 'load' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
  await p.waitForTimeout(1500);
  const broken = await p.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')));
  const total = await p.evaluate(() => document.images.length);
  if (broken.length) { bad++; console.log('BROKEN', u, broken.slice(0, 5)); }
  console.log(u, 'images', total, 'broken', broken.length);
}
await b.close();
