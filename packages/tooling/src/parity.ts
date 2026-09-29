import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import { distFileFor, parseCsv, parseRedirectsFile, pathOf, readLedger } from "./util.ts";

export interface ParityInput {
  /** URL paths that must resolve: live sitemap + GSC pages. */
  paths: string[];
  dist: string;
  /** path -> planned 301/410 (from ledger and _redirects). */
  redirects: Map<string, { to: string; status: number }>;
}
export interface ParityResult { ok: string[]; redirected: string[]; unplanned: string[]; brokenRedirect: string[] }

export function checkParity({ paths, dist, redirects }: ParityInput): ParityResult {
  const r: ParityResult = { ok: [], redirected: [], unplanned: [], brokenRedirect: [] };
  for (const p of [...new Set(paths)]) {
    if (distFileFor(dist, p)) { r.ok.push(p); continue; }
    const red = redirects.get(p);
    if (red) {
      if (red.status === 410) { r.redirected.push(p); continue; }
      const target = pathOf(red.to);
      if (/^https?:\/\//.test(red.to)) { r.redirected.push(p); continue; }
      (distFileFor(dist, target) ? r.redirected : r.brokenRedirect).push(p);
    } else r.unplanned.push(p);
  }
  return r;
}

export function sitemapPaths(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => pathOf(m[1]));
}

/** Reads paths from a GSC "pages" export: any column whose value looks like a URL. */
export function gscPaths(csv: string): string[] {
  const rows = parseCsv(csv);
  const out: string[] = [];
  for (const row of rows) {
    const v = Object.values(row).find((x) => /^https?:\/\//.test(x)) ?? (row.path?.startsWith("/") ? row.path : undefined);
    if (v) out.push(pathOf(v));
  }
  return out;
}

export function ledgerRedirects(ledgerPath: string): Map<string, { to: string; status: number }> {
  const m = new Map<string, { to: string; status: number }>();
  if (!existsSync(ledgerPath)) return m;
  for (const row of readLedger(ledgerPath)) {
    if (row.decision === "keep") continue;
    if (row.redirect_target) m.set(pathOf(row.url), { to: row.redirect_target, status: 301 });
    else if (row.decision === "cut") m.set(pathOf(row.url), { to: "", status: 410 });
  }
  return m;
}

async function main() {
  const a = process.argv.slice(2);
  const opt = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
  const dist = opt("--dist"), sitemap = opt("--sitemap"), gsc = opt("--gsc"), ledger = opt("--ledger"), redirectsFile = opt("--redirects");
  if (!dist || !sitemap) { console.error("usage: parity --dist <dir> --sitemap <url|file> [--gsc pages.csv] [--ledger content-ledger.csv] [--redirects public/_redirects]"); process.exit(2); }
  const xml = sitemap.startsWith("http") ? await (await fetch(sitemap)).text() : readFileSync(sitemap, "utf8");
  const paths = sitemapPaths(xml);
  if (gsc && existsSync(gsc)) paths.push(...gscPaths(readFileSync(gsc, "utf8")));
  const redirects = new Map([...(ledger ? ledgerRedirects(ledger) : []), ...(redirectsFile ? parseRedirectsFile(redirectsFile) : [])]);
  const res = checkParity({ paths, dist, redirects });
  console.log(`ok ${res.ok.length}  planned-redirect ${res.redirected.length}  broken-redirect ${res.brokenRedirect.length}  UNPLANNED 404 ${res.unplanned.length}`);
  for (const p of res.unplanned) console.log("  404", p);
  for (const p of res.brokenRedirect) console.log("  bad 301 target", p);
  process.exit(res.unplanned.length + res.brokenRedirect.length ? 1 : 0);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
