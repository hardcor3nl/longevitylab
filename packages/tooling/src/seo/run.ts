import { join } from "node:path";
import { type Check, loadDist, loadSiteConfig } from "./dist.ts";
import { checkSitemaps } from "./sitemap-check.ts";
import { checkStructuredData } from "./jsonld-check.ts";
import { checkHead } from "./head-check.ts";
import { checkFeeds } from "./feeds-check.ts";
import { checkCrawl } from "./crawl-check.ts";
import { checkLinkGraph } from "./linkgraph.ts";
import { checkIndexNow } from "./indexnow.ts";

export interface RunOptions { siteDir: string; distDir?: string; only?: string[] }
export interface Scorecard { site: string; checks: Check[]; failed: number; warned: number }

/** Runs every SEO check against a built site. Add new checks to the list below. */
export function runSeoChecks(o: RunOptions): Scorecard {
  const cfg = loadSiteConfig(o.siteDir);
  const dist = o.distDir ?? join(o.siteDir, "dist");
  const pages = loadDist(dist);
  const redirectsFile = join(o.siteDir, "public", "_redirects");
  const ctx = { cfg, dist, pages, siteDir: o.siteDir, redirectsFile };
  let hc: ReturnType<typeof checkHead> | undefined;
  const headChecks = () => (hc ??= checkHead(pages, cfg, dist));
  const all: [string, () => Check][] = [
    ["sitemaps", () => checkSitemaps(dist, cfg, pages, redirectsFile)],
    ["head", () => headChecks().head],
    ["duplicates", () => headChecks().duplicates],
    ["og", () => headChecks().og],
    ["structured-data", () => checkStructuredData(pages, cfg)],
    ["linkgraph", () => checkLinkGraph(pages, cfg)],
    ["feeds", () => checkFeeds(dist, cfg, pages)],
    ["crawl", () => checkCrawl(dist, o.siteDir, cfg, pages)],
    ["indexnow", () => checkIndexNow(dist, cfg)],
  ];
  const checks = all.filter(([id]) => !o.only || o.only.includes(id)).map(([, f]) => f());
  void ctx;
  return { site: cfg.name, checks, failed: checks.filter((c) => c.status === "fail").length, warned: checks.filter((c) => c.status === "warn").length };
}

export function formatScorecard(s: Scorecard, verbose = false): string {
  const icon = { pass: "PASS", warn: "WARN", fail: "FAIL" } as const;
  const lines = [`SEO scorecard: ${s.site}`, ""];
  for (const c of s.checks) {
    lines.push(`[${icon[c.status]}] ${c.name}: ${c.summary}`);
    for (const i of c.issues.slice(0, verbose ? 500 : 8)) lines.push(`         - ${i}`);
    if (c.issues.length > (verbose ? 500 : 8)) lines.push(`         ... ${c.issues.length - 8} more (use --verbose)`);
  }
  lines.push("", `${s.checks.length - s.failed - s.warned}/${s.checks.length} pass, ${s.warned} warn, ${s.failed} fail`);
  return lines.join("\n");
}
