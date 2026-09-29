import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Check, type Page, type SiteConfig, check, isRealPage } from "./dist.ts";
import { parseGone } from "../../../core/src/seo/gone.ts";
import { slashForms, twinOf } from "../redirect-twins.ts";
import { gscPaths, sitemapPaths } from "../parity.ts";
import { pathOf, readLedger } from "../util.ts";

/**
 * Cloudflare Pages matches `_redirects` sources and `_routes.json` entries literally, so `/old/ /new/ 301` does not catch `/old`.
 * Every redirect / 410 source must therefore resolve the same in both slash forms. Outcome model (what Pages would answer):
 *  - a `_redirects` rule for that exact string: `301 -> target`
 *  - `gone.txt` path routed to the 410 Function by `_routes.json` (exact string): `410`
 *  - a built page (Pages 308s the other slash form to it): `page`
 *  - otherwise `404`
 * Also runs every ledger / GSC / old-sitemap URL in both slash forms and reports the ones that would 404.
 */
export interface RedirectsInput {
  rules: Map<string, { to: string; status: number }>;
  gone: string[]; routesInclude: string[];
  built: Set<string>; dist: string;
  /** URL lists that must not 404, in either slash form. */
  lists: { name: string; paths: string[] }[];
}
export interface RedirectsReport { asymmetric: string[]; uncovered: string[]; listedButBroken: string[]; sources: number }

const isFileLike = (p: string) => /\.[a-z0-9]+$/i.test(p.split("/").pop() ?? "");

export function checkRedirectTwins(i: RedirectsInput): RedirectsReport {
  const rep: RedirectsReport = { asymmetric: [], uncovered: [], listedButBroken: [], sources: 0 };
  const goneSet = new Set(i.gone), routes = new Set(i.routesInclude);
  const builtAny = (p: string) => i.built.has(p) || i.built.has(p.endsWith("/") ? p.replace(/\/+$/, "") : p + "/");
  const outcome = (p: string): string => {
    const r = i.rules.get(p);
    if (r) return r.status === 410 ? "410" : `${r.status} ${r.to}`;
    if (builtAny(p)) return "page";
    if (goneSet.has(p) && routes.has(p)) return "410";
    return "404";
  };
  const sources = new Set<string>();
  for (const [from, { status }] of i.rules) if (status >= 300 && status < 400 || status === 410) sources.add(from);
  for (const g of i.gone) sources.add(g);
  for (const s of sources) {
    if (s.includes("*") || s.includes(":") || !s.startsWith("/") || isFileLike(s) || s === "/") continue;
    rep.sources++;
    const tw = twinOf(s)!;
    const a = outcome(s), b = outcome(tw);
    if (a !== b) rep.asymmetric.push(`${s} => ${a}   but   ${tw} => ${b}`);
    if (goneSet.has(s) && !routes.has(s)) rep.uncovered.push(`${s} is in gone.txt but not in _routes.json: the 410 Function never runs for it`);
  }
  for (const l of i.lists) {
    const seen = new Set<string>();
    for (const raw of l.paths) {
      const p = raw.split(/[?#]/)[0];
      if (!p.startsWith("/") || isFileLike(p) || seen.has(p)) continue;
      seen.add(p);
      for (const f of slashForms(p)) if (outcome(f) === "404" && outcome(slashForms(p).find((x) => x !== f) ?? f) === "404") { rep.listedButBroken.push(`${l.name}: ${p}`); break; }
    }
  }
  return rep;
}

const read = (p: string) => (existsSync(p) ? readFileSync(p, "utf8") : "");
export function loadRules(file: string) {
  const m = new Map<string, { to: string; status: number }>();
  for (const l of read(file).split(/\r?\n/)) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const [from, to, s] = t.split(/\s+/);
    if (!m.has(from)) m.set(from, { to, status: Number(s ?? 302) });
  }
  return m;
}

/** Where the URL lists for a site live: ledger, GSC export (program/gsc/<host>/pages.csv) and any kept old sitemap. */
export function urlLists(siteDir: string, cfg: SiteConfig): { name: string; paths: string[] }[] {
  const lists: { name: string; paths: string[] }[] = [];
  const ledger = join(siteDir, "content-ledger.csv");
  if (existsSync(ledger)) lists.push({ name: "ledger", paths: readLedger(ledger).map((r) => pathOf(r.url)) });
  const host = new URL(cfg.origin).host.replace(/^www\./, "");
  for (const root of [resolve(siteDir, "../../program/gsc", host), resolve(siteDir, "../../program/gsc", host, "export-2026-09-29")])
    if (existsSync(root)) for (const f of readdirSync(root)) if (/^pages\.csv$/i.test(f)) lists.push({ name: `gsc ${root.replace(/\\/g, "/").split("/").slice(-2).join("/")}/${f}`, paths: gscPaths(read(join(root, f))) });
  for (const dir of [siteDir, join(siteDir, "migrate")]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!/(live|old).*sitemap|sitemap.*(live|old)/i.test(f)) continue;
      const t = read(join(dir, f));
      lists.push({ name: `old sitemap ${f}`, paths: f.endsWith(".xml") ? sitemapPaths(t) : t.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).map(pathOf) });
    }
  }
  return lists;
}

export function checkRedirectsBothForms(dist: string, siteDir: string, cfg: SiteConfig, pages: Page[]): Check {
  const rules = loadRules(join(siteDir, "public", "_redirects"));
  const gone = parseGone(read(join(siteDir, "gone.txt")));
  let routesInclude: string[] = [];
  try { routesInclude = JSON.parse(read(join(siteDir, "public", "_routes.json")) || "{}").include ?? []; } catch { /* reported by crawl */ }
  const built = new Set(pages.filter(isRealPage).map((p) => p.url));
  const rep = checkRedirectTwins({ rules, gone, routesInclude, built, dist, lists: urlLists(siteDir, cfg) });
  const issues = [...rep.asymmetric.map((x) => `slash forms differ: ${x}`), ...rep.uncovered];
  const advisories = rep.listedButBroken.map((x) => `would 404 in both slash forms (no page, redirect or 410): ${x}`);
  const c = check("redirects", "Redirects match both slash forms", [...issues, ...advisories], `${rep.sources} redirect/410 sources checked in both forms, ${issues.length} problems, ${advisories.length} listed URLs still 404`, false);
  return issues.length ? c : { ...c, status: advisories.length ? "warn" : "pass" };
}
