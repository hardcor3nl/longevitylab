import { pathToFileURL } from "node:url";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { distFileFor, parseRedirectsFile, pathOf } from "./util.ts";

/** Link check on a built dist: internal links must hit a built page/asset (or a planned redirect: reported as a hop); external links are sampled with HEAD/GET. */
function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : []; });
}
async function main() {
  const a = process.argv.slice(2);
  const opt = (n: string, d?: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : d);
  const origin = opt("--origin", "https://vibecodingintel.com")!, dist = opt("--dist", "dist")!, sample = Number(opt("--sample", "25")), redirects = parseRedirectsFile(opt("--redirects", "public/_redirects")!);
  const bad: string[] = [], hops: string[] = [], ext = new Map<string, string>();
  let internal = 0;
  for (const f of htmlFiles(dist)) {
    const html = readFileSync(f, "utf8"), page = "/" + f.slice(dist.length + 1).replace(/index\.html$/, "");
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
      const h = m[1].replace(/&amp;/g, "&");
      if (/^(mailto:|tel:|javascript:)/.test(h)) continue;
      if (/^https?:\/\//.test(h)) { if (!h.startsWith(origin)) ext.set(h, page); continue; }
      const p = pathOf(h.startsWith("#") ? page : h).split(/[?#]/)[0];
      if (p.startsWith("/go/")) continue;
      internal++;
      if (distFileFor(dist, p) || distFileFor(dist, p + (p.endsWith("/") ? "" : "/"))) continue;
      if (redirects.has(p)) hops.push(`${page} -> ${p}`); else bad.push(`${page} -> ${h}`);
    }
  }
  const urls = [...ext.keys()].sort(() => Math.random() - 0.5).slice(0, sample);
  const extBad: string[] = [];
  await Promise.all(urls.map(async (u) => {
    try { const r = await fetch(u, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "Mozilla/5.0 link-check" } }); if (r.status >= 400 && ![401, 403, 405, 429, 999].includes(r.status)) extBad.push(`${u} ${r.status}`); }
    catch (e) { extBad.push(`${u} ${(e as Error).message}`); }
  }));
  console.log(`internal ${internal} checked, ${bad.length} broken, ${hops.length} via planned 301; external ${ext.size} unique, ${urls.length} sampled, ${extBad.length} failing`);
  bad.slice(0, 40).forEach((x) => console.log("  BROKEN", x)); hops.slice(0, 40).forEach((x) => console.log("  301-hop", x)); extBad.forEach((x) => console.log("  EXT", x));
  process.exit(bad.length ? 1 : 0);
}
main();
