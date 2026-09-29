import { expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { goneResponse, isGone, parseGone, routesJson } from "../../core/src/seo/gone.ts";
import { parsePage } from "../src/seo/dist.ts";
import { checkCrawl } from "../src/seo/crawl-check.ts";
import { writeGoneFiles } from "../src/seo/gone-cli.ts";

const cfg: any = { name: "T", origin: "https://t.com", trailingSlash: "always", collectionRoutes: { guides: "/guides/" } };
const words = Array.from({ length: 200 }, () => "word").join(" ");
const pg = (url: string, links: string[] = [], robots = "index,follow") =>
  parsePage(url, url, `<html><head><meta name="robots" content="${robots}"></head><body><main>${links.map((l) => `<a href="${l}">x</a>`).join("")}<p>${words}</p></main></body></html>`);

function site(redirects: string, gone = "") {
  const dir = mkdtempSync(join(tmpdir(), "crawl-"));
  mkdirSync(join(dir, "public")); mkdirSync(join(dir, "dist"));
  writeFileSync(join(dir, "public", "_redirects"), redirects);
  writeFileSync(join(dir, "gone.txt"), gone);
  writeGoneFiles(dir);
  writeFileSync(join(dir, "dist", "robots.txt"), "User-agent: *\nDisallow: /go/\nSitemap: https://t.com/sitemap-index.xml\n");
  writeFileSync(join(dir, "dist", "sitemap-index.xml"), "<sitemapindex></sitemapindex>");
  return dir;
}
const base = [pg("/", ["/guides/"]), pg("/guides/", ["/guides/a/", "/guides/b/", "/guides/c/"]), pg("/guides/a/"), pg("/guides/b/"), pg("/guides/c/"), pg("/404.html", [], "noindex,follow")];

it("gone helpers", () => {
  expect(parseGone("# c\n/a/\n/a/ # dup\n\n/b/")).toEqual(["/a/", "/b/"]);
  expect(isGone("/a", ["/a/"])).toBe(true); expect(isGone("/x/", ["/a/"])).toBe(false);
  expect(goneResponse().status).toBe(410);
  expect(routesJson(["/a/"]).include).toEqual(["/go/*", "/a/"]);
  expect(() => routesJson(Array.from({ length: 101 }, (_, i) => `/${i}/`))).toThrow();
});
it("passes a clean site", () => {
  const d = site("/old/ /guides/a/ 301\n");
  expect(checkCrawl(join(d, "dist"), d, cfg, base).status).toBe("pass");
});
it("flags 410 in _redirects, SPA catch-all, chains and missing targets", () => {
  const d = site("/x/ /y/ 410\n/* /index.html 200\n/o1/ /o2/ 301\n/o2/ /guides/a/ 301\n/o3/ /nowhere/ 301\n");
  const t = checkCrawl(join(d, "dist"), d, cfg, base).issues.join("|");
  expect(t).toMatch(/cannot return 410/); expect(t).toMatch(/catch-all/); expect(t).toMatch(/chain/); expect(t).toMatch(/not built: \/o3\//);
});
it("flags gone paths that are still built, thin hubs and faceted links", () => {
  const d = site("", "/guides/a/\n");
  const pages = [...base.slice(0, 1), pg("/guides/", ["/guides/a/?sort=new"]), ...base.slice(2)];
  const t = checkCrawl(join(d, "dist"), d, cfg, pages).issues.join("|");
  expect(t).toMatch(/gone path is still built/); expect(t).toMatch(/lists only/); expect(t).toMatch(/query string/);
});
