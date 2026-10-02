import { resolve } from "node:path";
import { loadDist, loadSiteConfig, isRealPage } from "./dist.ts";
import { analyseGraph, normalizeHref } from "./linkgraph.ts";

/** node linkreport.ts <site> : one-line-per-metric link-graph summary used for the Q2 before/after report. */
const site = process.argv[2];
const dir = resolve("sites", site);
const cfg = loadSiteConfig(dir);
const pages = loadDist(resolve(dir, "dist"));
const utility = (cfg.utilityRoutes as string[] | undefined) ?? ["/about/", "/privacy/", "/affiliate-disclosure/"];
const r = analyseGraph(pages, cfg as any, { utilityRoutes: utility });
const real = pages.filter(isRealPage).filter((p) => !p.noindex);
// anchor-text variety: for each internal target, the share held by its most common anchor (main content only)
const anchors = new Map<string, Map<string, number>>();
for (const p of pages.filter(isRealPage)) {
  const main = p.html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? p.html;
  for (const m of main.matchAll(/<a\s[^>]*href=("[^"]*"|'[^']*')[^>]*>([\s\S]*?)<\/a>/gi)) {
    const t = normalizeHref(m[1].slice(1, -1), p.url, cfg.origin);
    const text = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!t || t === p.url || !text) continue;
    const mm = anchors.get(t) ?? new Map(); mm.set(text, (mm.get(text) ?? 0) + 1); anchors.set(t, mm);
  }
}
let skewed = 0, measured = 0;
for (const [t, mm] of anchors) {
  const total = [...mm.values()].reduce((a, b) => a + b, 0);
  if (total < 5 || utility.includes(t) || t === "/") continue;
  measured++;
  if (Math.max(...mm.values()) / total > 0.6) skewed++;
}
const ctx = real.map((p) => r.contextual.get(p.url)?.size ?? 0);
console.log(JSON.stringify({ site, indexable: real.length, orphans: r.orphans.length, unreachable: r.unreachable.length, deepOver3: r.deep.length, maxDepth: Math.max(...r.depth.values()), hubGaps: r.hubGaps.length, under3Contextual: r.thin.length, medianContextualInbound: ctx.sort((a, b) => a - b)[Math.floor(ctx.length / 2)], anchorTargetsMeasured: measured, anchorTargetsOver60pctOneAnchor: skewed }));
