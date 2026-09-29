// usage: node axe.mjs <baseUrl> <dist>   (needs playwright-core and axe-core resolvable, e.g. NODE_PATH; Chromium via PLAYWRIGHT_BROWSERS_PATH/CHROME_PATH)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
const require = createRequire(import.meta.url);
let pw; try { pw = require("playwright-core"); } catch { pw = require("playwright"); } const { chromium } = pw; const axeSrc = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const [base, dist] = process.argv.slice(2);
const pages = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? pages(p) : n === "index.html" ? [p] : []; });
const urls = pages(dist).map((f) => "/" + f.slice(dist.length + 1).replace(/index\.html$/, "")).filter((u) => !u.startsWith("/_astro"));
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
let bad = 0, worst = {};
for (const theme of (process.env.THEMES ?? "light,dark").split(",")) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
  await pg.addInitScript((t) => localStorage.setItem("vci-theme", t), theme);
  for (const u of urls) {
    await pg.goto(base + u); await pg.addScriptTag({ content: axeSrc });
    const r = await pg.evaluate(() => axe.run(document, { resultTypes: ["violations"] }));
    for (const v of r.violations) { worst[v.id] = (worst[v.id] ?? 0) + 1; if (["serious", "critical"].includes(v.impact)) { bad++; console.log(theme, u, v.id, v.impact, v.nodes.length, v.nodes[0]?.target?.join(" ")); } else console.log("minor", theme, u, v.id, v.impact); }
  }
  await ctx.close();
}
console.log(`axe: ${urls.length} pages x 2 themes, serious/critical violations: ${bad}`, JSON.stringify(worst)); await b.close(); process.exit(bad ? 1 : 0);
