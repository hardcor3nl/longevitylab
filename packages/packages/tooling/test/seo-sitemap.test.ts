import { expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSitemaps } from "../../core/src/seo/sitemap.ts";
import { loadDist } from "../src/seo/dist.ts";
import { checkSitemaps } from "../src/seo/sitemap-check.ts";

const cfg: any = { name: "T", origin: "https://t.com", trailingSlash: "always" };
function fixture(pages: Record<string, string>, groups: any[]) {
  const dir = mkdtempSync(join(tmpdir(), "seo-"));
  for (const [u, h] of Object.entries(pages)) { mkdirSync(join(dir, u), { recursive: true }); writeFileSync(join(dir, u, "index.html"), h); }
  for (const [f, x] of buildSitemaps(cfg.origin, groups)) writeFileSync(join(dir, f), x);
  return dir;
}
const page = (u: string, robots = "") => `<html><head><title>t</title><link rel="canonical" href="https://t.com${u}">${robots}</head><body></body></html>`;

it("passes a consistent sitemap", () => {
  const d = fixture({ "/": page("/"), "/a/": page("/a/") }, [{ name: "p", entries: [{ loc: "https://t.com/", lastmod: "2026-01-01" }, { loc: "https://t.com/a/", lastmod: "2026-02-01" }] }]);
  expect(checkSitemaps(d, cfg, loadDist(d), join(d, "_redirects")).status).toBe("pass");
});
it("flags noindex pages in the sitemap, and indexable pages missing from it", () => {
  const d = fixture({ "/": page("/"), "/a/": page("/a/", '<meta name="robots" content="noindex,follow">'), "/b/": page("/b/") },
    [{ name: "p", entries: [{ loc: "https://t.com/" }] }]);
  // noindex entry injected by hand because urlset() itself drops it
  writeFileSync(join(d, "sitemap-p.xml"), readFileSync(join(d, "sitemap-p.xml"), "utf8").replace("</urlset>", "<url><loc>https://t.com/a/</loc></url></urlset>"));
  const r = checkSitemaps(d, cfg, loadDist(d), join(d, "_redirects"));
  expect(r.status).toBe("fail");
  expect(r.issues.join("\n")).toMatch(/noindex: \/a\//);
  expect(r.issues.join("\n")).toMatch(/missing from sitemap: \/b\//);
});
