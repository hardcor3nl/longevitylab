import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Check, type Page, type SiteConfig, check, hubPairs, isRealPage } from "./dist.ts";
import { parseGone, routeForms } from "../../../core/src/seo/gone.ts";
import { normalizeHref } from "./linkgraph.ts";
import { htmlToText } from "../util.ts";

/**
 * Crawl-budget and status-code hygiene (Google: "HTTP status codes", "Manage crawl budget", "Soft 404 errors").
 *  - 404.html exists (Cloudflare Pages serves it with a real 404 status when no route matches) and is noindex; no SPA catch-all rewrite (`/* /index.html 200`) that would turn every bad URL into a soft 404.
 *  - `_redirects`: only supported statuses, no 410 (unsupported there), no loops, no chains, targets exist, no source that is also a built page.
 *  - 410s: `gone.txt` paths are not built, not linked, not in the sitemap, and `_routes.json` + Function are in sync.
 *  - Soft-404 hubs: every hub lists at least 3 items; no built page says "no results".
 *  - Facets: no internal links to query-string URLs unless the target is noindex; no query-string URLs in sitemaps.
 *  - robots.txt: sitemap declared, /go/ disallowed, site not blocked.
 */
export function checkCrawl(dist: string, siteDir: string, cfg: SiteConfig, pages: Page[]): Check {
  const issues: string[] = [], soft: string[] = [];
  const real = pages.filter(isRealPage);
  const built = new Set(real.map((p) => p.url));
  const read = (p: string) => (existsSync(p) ? readFileSync(p, "utf8") : "");

  // 404
  const nf = pages.find((p) => p.url === "/404.html");
  if (!nf) issues.push("dist/404.html missing: unknown URLs would not get a real 404");
  else if (!nf.noindex) issues.push("404 page must be noindex");

  // redirects
  const rfile = join(siteDir, "public", "_redirects");
  const rules = read(rfile).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => l.split(/\s+/));
  const map = new Map(rules.map(([f, t, s]) => [f, { to: t, status: Number(s ?? 302) }]));
  for (const [from, { to, status }] of map) {
    if (/^\/\*\s*$/.test(from) && status === 200) issues.push("catch-all `/* ... 200` rewrite creates soft 404s");
    if (status === 410) issues.push(`_redirects cannot return 410 (${from}): list it in gone.txt`);
    else if (![200, 301, 302, 303, 307, 308].includes(status)) issues.push(`unsupported _redirects status ${status} for ${from}`);
    if (from === to) issues.push(`redirect loop ${from}`);
    if (status >= 300 && status < 400) {
      if (map.has(to)) issues.push(`redirect chain ${from} -> ${to} -> ${map.get(to)!.to}`);
      else if (to.startsWith("/") && !built.has(to) && !to.includes("*") && !(/.[a-z0-9]+$/i.test(to) && existsSync(join(dist, to.slice(1))))) issues.push(`redirect target not built: ${from} -> ${to}`);
      if (built.has(from)) issues.push(`${from} is redirected but also built (wasted page)`);
      if (cfg.trailingSlash === "always" && to.startsWith("/") && !to.endsWith("/") && !/\.\w+$/.test(to)) issues.push(`redirect target not in canonical slash form: ${to}`);
    }
  }
  // links into redirected URLs
  for (const p of real) for (const h of p.links) {
    const t = normalizeHref(h, p.url, cfg.origin);
    if (t && map.has(t) && map.get(t)!.status >= 300) { soft.push(`${p.url} links to redirected ${t}`); break; }
  }

  // gone
  const gone = parseGone(read(join(siteDir, "gone.txt")));
  const generated = JSON.parse(read(join(siteDir, "functions", "gone-paths.json")) || "[]");
  if (JSON.stringify(gone) !== JSON.stringify(generated)) issues.push("functions/gone-paths.json out of sync with gone.txt (run pnpm seo:gone <site>)");
  const routes = read(join(siteDir, "public", "_routes.json"));
  if (!routes) issues.push("public/_routes.json missing (run pnpm seo:gone <site>)");
  else { const inc: string[] = JSON.parse(routes).include ?? []; for (const g of gone) for (const form of routeForms(g)) if (!inc.includes(form)) issues.push(`_routes.json does not route ${form} to the Function`); }
  const sitemapText = ["sitemap-index.xml", ...real.length ? [] : []].map((f) => read(join(dist, f))).join("");
  for (const g of gone) {
    if (built.has(g)) issues.push(`gone path is still built: ${g}`);
    if (sitemapText.includes(`${cfg.origin}${g}`)) issues.push(`gone path in sitemap: ${g}`);
    for (const p of real) if (p.links.some((h) => normalizeHref(h, p.url, cfg.origin) === g)) { issues.push(`${p.url} links to gone ${g}`); break; }
  }

  // soft-404 hubs and empty states
  const pairs = hubPairs(cfg);
  const hubs = pairs.map((h) => h.page);
  for (const { page: hub, prefix } of pairs) {
    const hp = real.find((p) => p.url === hub);
    if (!hp) continue;
    const n = new Set(hp.mainLinks.map((h) => normalizeHref(h, hp.url, cfg.origin)).filter((t) => t && t !== hub && t.startsWith(prefix))).size;
    if (n < 3) issues.push(`hub ${hub} lists only ${n} items (soft-404 risk)`);
  }
  // category hubs (siblings of their items, e.g. /guides/setup/ listing /guides/<slug>/): must list at least 2 entries under a collection route
  const collections = Object.values(cfg.collectionRoutes ?? {});
  for (const cat of (cfg.categoryRoutes as string[]) ?? []) {
    const cp = real.find((p) => p.url === cat);
    if (!cp || cp.noindex) continue;
    const n = new Set(cp.mainLinks.map((h) => normalizeHref(h, cp.url, cfg.origin)).filter((t) => t && t !== cat && !collections.includes(t) && !((cfg.categoryRoutes as string[]) ?? []).includes(t) && collections.some((c) => t.startsWith(c)))).size;
    if (n < 2) issues.push(`category hub ${cat} lists only ${n} entries (soft-404 risk)`);
  }
  for (const p of real.filter((x) => !x.noindex)) {
    const main = htmlToText(p.html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? "");
    if (/\b(no results found|nothing found|no items (found|match)|0 results)\b/.test(main)) issues.push(`${p.url}: looks like an empty-state page that is indexable`);
    const words = main.split(" ").filter(Boolean).length;
    if (words < 120 && !hubs.includes(p.url) && p.url !== "/") soft.push(`${p.url}: only ${words} words (thin-page / soft-404 risk)`);
  }

  // facets
  for (const p of real) for (const h of p.links) {
    if (!/^(\/|https?:\/\/)/.test(h) || /^https?:\/\//.test(h) && !h.startsWith(cfg.origin) || h.startsWith("/go/")) continue;
    if (h.split("#")[0].includes("?")) { issues.push(`${p.url}: internal link with query string ${h} (faceted/parameter URL)`); break; }
  }
  if (/<loc>[^<]*\?/.test(sitemapText)) issues.push("sitemap index contains query-string url");

  // robots.txt
  const robots = read(join(dist, "robots.txt"));
  if (!robots) issues.push("robots.txt missing");
  else {
    if (!new RegExp(`^Sitemap:\\s*${cfg.origin.replace(/[.]/g, "\\.")}/sitemap-index\\.xml\\s*$`, "im").test(robots)) issues.push("robots.txt does not declare the sitemap index");
    if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) issues.push("robots.txt blocks the whole site");
    if (!/^\s*Disallow:\s*\/go\//im.test(robots)) issues.push("robots.txt does not disallow /go/");
    if (/^\s*Disallow:.*(\/_astro|\.css|\.js)/im.test(robots)) issues.push("robots.txt blocks CSS/JS assets (Google needs them to render)");
  }
  const thin = soft.length;
  const c = check("crawl", "Crawl budget and status codes", [...issues, ...soft], `${map.size} redirects, ${gone.length} 410s, 404 page ${nf ? "ok" : "missing"}, robots ok, ${thin} advisories`, false);
  return issues.length ? c : { ...c, status: soft.length ? "warn" : "pass" };
}
