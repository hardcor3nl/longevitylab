import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Check, type Page, type SiteConfig, check, isRealPage } from "./dist.ts";

/**
 * <head> hygiene on a built dist. Sources: Google "Title links", "Snippets/meta description", "Canonical",
 * "Robots meta" docs (developers.google.com/search/docs/appearance/title-link, .../snippet, .../crawling-indexing/consolidate-duplicate-urls, .../robots-meta-tag).
 * FAIL: missing/duplicate title, description or canonical; canonical not self-referencing and absolute on the origin; wrong or repeated
 * robots meta; duplicate titles or descriptions across indexable pages; not exactly one h1; missing/invalid OG image.
 * WARN: title over 60 or description over 160 chars (truncation), description under 70 chars, images without width/height.
 * hreflang: the portfolio is English only, so pages must NOT carry hreflang (a lone hreflang is ignored at best, misleading at worst).
 */
export const canonicalFor = (cfg: SiteConfig, url: string) => {
  const path = url === "/" ? "/" : cfg.trailingSlash === "always" ? url.replace(/\/?$/, "/") : url.replace(/\/$/, "");
  return new URL(path, cfg.origin).toString();
};

/** width/height from a PNG IHDR, or null. */
export function pngSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const metaProp = (html: string, prop: string) => {
  const head = html.split(/<\/head>/i)[0];
  const m = [...head.matchAll(/<meta\b[^>]*>/gi)].map((x) => x[0]).find((t) => new RegExp(`property=["']${prop}["']`, "i").test(t));
  return m?.match(/content="([^"]*)"/i)?.[1];
};

export function checkHead(pages: Page[], cfg: SiteConfig, dist: string): { head: Check; duplicates: Check; og: Check } {
  const hard: string[] = [], soft: string[] = [], og: string[] = [], ogWarn: string[] = [];
  const real = pages.filter(isRealPage);
  const titles = new Map<string, string[]>(), descs = new Map<string, string[]>();
  for (const p of real) {
    const head = p.html.split(/<\/head>/i)[0];
    const count = (re: RegExp) => (head.match(re) ?? []).length;
    if (!p.title) hard.push(`${p.url}: missing <title>`);
    else if (count(/<title[\s>]/gi) > 1) hard.push(`${p.url}: more than one <title>`);
    if (!p.description) { if (!p.noindex) hard.push(`${p.url}: missing meta description`); }
    else if (count(/<meta[^>]+name=["']description["']/gi) > 1) hard.push(`${p.url}: more than one meta description`);
    if (p.noindex && p.canonical.length === 0) { /* noindex utility pages (e.g. a rewrite target) need no canonical */ }
    else if (p.canonical.length !== 1) hard.push(`${p.url}: ${p.canonical.length} canonical links (need exactly 1)`);
    else if (p.noindex && /^\/embed\//.test(p.url)) {
      // embed pages: noindex, canonical to the full page (an indexable, non-embed URL on this origin)
      const c = p.canonical[0];
      if (!c.startsWith(cfg.origin.replace(/\/$/, "") + "/") || /\/embed\//.test(c)) hard.push(`${p.url}: embed canonical ${c} must be the full page on ${cfg.origin}`);
    }
    else if (p.canonical[0] !== canonicalFor(cfg, p.url)) hard.push(`${p.url}: canonical ${p.canonical[0]} is not the self URL ${canonicalFor(cfg, p.url)}`);
    const robotsTags = count(/<meta[^>]+name=["']robots["']/gi);
    if (robotsTags !== 1) hard.push(`${p.url}: ${robotsTags} robots meta tags (need exactly 1, explicit)`);
    if (!p.noindex && /nofollow|none/i.test(p.robots)) hard.push(`${p.url}: indexable page has nofollow robots (${p.robots})`);
    if (/rel=["']alternate["'][^>]*hreflang|hreflang=/i.test(head)) hard.push(`${p.url}: hreflang present on an English-only site`);
    if (!/<html[^>]+lang=["']en/i.test(p.html)) hard.push(`${p.url}: <html lang="en..."> missing`);
    if (!/<meta[^>]+name=["']viewport["']/i.test(head)) hard.push(`${p.url}: viewport meta missing`);
    if (!p.noindex) {
      if (p.h1.length !== 1) hard.push(`${p.url}: ${p.h1.length} <h1> elements (need exactly 1)`);
      if (p.title.length > 60) soft.push(`${p.url}: title ${p.title.length} chars (>60 may truncate)`);
      if (p.description.length > 160) soft.push(`${p.url}: description ${p.description.length} chars (>160 may truncate)`);
      if (p.description && p.description.length < 70) soft.push(`${p.url}: description only ${p.description.length} chars`);
      titles.set(p.title.toLowerCase(), [...(titles.get(p.title.toLowerCase()) ?? []), p.url]);
      if (p.description) descs.set(p.description.toLowerCase(), [...(descs.get(p.description.toLowerCase()) ?? []), p.url]);
      for (const m of p.html.matchAll(/<img\b[^>]*>/gi)) if (!/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0])) { soft.push(`${p.url}: <img> without width/height (CLS)`); break; }
      // og:image
      const img = metaProp(p.html, "og:image");
      if (!img) og.push(`${p.url}: no og:image`);
      else {
        if (!img.startsWith(cfg.origin)) ogWarn.push(`${p.url}: og:image not on origin: ${img}`);
        else {
          const f = join(dist, decodeURIComponent(new URL(img).pathname));
          if (!existsSync(f)) og.push(`${p.url}: og:image file missing: ${new URL(img).pathname}`);
          else if (f.endsWith(".png")) {
            const s = pngSize(readFileSync(f));
            if (!s || s.w !== 1200 || s.h !== 630) ogWarn.push(`${p.url}: og:image is ${s ? `${s.w}x${s.h}` : "not a png"}, want 1200x630`);
          }
        }
        if (!/twitter:image/.test(p.html)) og.push(`${p.url}: og:image without twitter:image`);
      }
    }
    if (!/<link[^>]+rel=["']preload["'][^>]+as=["']font["']/i.test(head)) soft.push(`${p.url}: no font preload`);
    // hero/LCP image (fetchpriority high) must also be preloaded
    const lcp = p.html.match(/<img\b[^>]*fetchpriority=["']high["'][^>]*>/i)?.[0];
    if (lcp) { const src = lcp.match(/\ssrc="([^"]+)"/)?.[1]; if (src && !head.includes(`href="${src}"`)) soft.push(`${p.url}: LCP image not preloaded`); }
  }
  const dupIssues = (m: Map<string, string[]>, what: string) => [...m].filter(([, u]) => u.length > 1).map(([t, u]) => `duplicate ${what} "${t.slice(0, 60)}" on ${u.join(", ")}`);
  const dups = [...dupIssues(titles, "title"), ...dupIssues(descs, "description")];
  const soft2 = [...new Set(soft.map((s) => s.replace(/^\S+: /, "")))];
  const headCheck = hard.length
    ? check("head", "Head hygiene", [...hard, ...soft], `${real.length} pages checked`)
    : check("head", "Head hygiene", soft, `${real.length} pages: one canonical, explicit robots, one h1, no hreflang${soft.length ? `; ${soft2.length} advisory kinds` : ""}`, true);
  return {
    head: headCheck,
    duplicates: check("duplicates", "Duplicate titles/descriptions", dups, `${titles.size} distinct titles, ${descs.size} distinct descriptions across indexable pages`),
    og: check("og", "Open Graph images", og.length ? og : ogWarn, `${real.filter((p) => !p.noindex).length - og.filter((o) => /no og:image/.test(o)).length} pages with an og:image${ogWarn.length ? `, ${ogWarn.length} not 1200x630 (share previews only, WARN)` : " (1200x630)"}`, og.length === 0),
  };
}
