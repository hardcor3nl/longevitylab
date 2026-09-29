import { expect, it } from "vitest";
import { buildSitemaps, urlset, normalizeLastmod, latestDate } from "../src/seo/sitemap.ts";

it("never invents lastmod", () => {
  const x = urlset([{ loc: "https://a.com/x/" }]);
  expect(x).not.toContain("lastmod");
});
it("rejects junk dates and keeps real ones", () => {
  expect(normalizeLastmod("July 2026")).toBeUndefined();
  expect(normalizeLastmod("2026-07-01")).toBe("2026-07-01");
  expect(latestDate(["2026-01-01", "2026-03-01", undefined])).toBe("2026-03-01");
});
it("drops noindex and duplicates, escapes urls", () => {
  const x = urlset([
    { loc: "https://a.com/a/?x=1&y=2", lastmod: "2026-01-01" },
    { loc: "https://a.com/a/?x=1&y=2" },
    { loc: "https://a.com/hidden/", noindex: true },
  ]);
  expect(x).not.toContain("hidden");
  expect(x.match(/<url>/g)).toHaveLength(1);
  expect(x).toContain("&amp;y=2");
});
it("emits image entries", () => {
  expect(urlset([{ loc: "https://a.com/", images: ["https://a.com/og/a.png"] }])).toContain("<image:loc>https://a.com/og/a.png</image:loc>");
});
it("builds index with per-group files and skips empty groups", () => {
  const m = buildSitemaps("https://a.com", [
    { name: "guides", entries: [{ loc: "https://a.com/g/", lastmod: "2026-02-02" }] },
    { name: "empty", entries: [{ loc: "https://a.com/n/", noindex: true }] },
  ]);
  expect([...m.keys()].sort()).toEqual(["sitemap-guides.xml", "sitemap-index.xml"]);
  expect(m.get("sitemap-index.xml")).toContain("https://a.com/sitemap-guides.xml</loc><lastmod>2026-02-02");
});
