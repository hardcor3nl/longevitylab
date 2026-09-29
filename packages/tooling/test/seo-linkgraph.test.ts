import { expect, it } from "vitest";
import { parsePage } from "../src/seo/dist.ts";
import { analyseGraph, checkLinkGraph, normalizeHref } from "../src/seo/linkgraph.ts";

const cfg: any = { name: "T", origin: "https://t.com", trailingSlash: "always", collectionRoutes: { guides: "/guides/" } };
const pg = (url: string, links: string[], robots = "") =>
  parsePage(url, url, `<html><head><title>${url}</title>${robots}</head><body><nav>${links.map((l) => `<a href="${l}">x</a>`).join("")}</nav><main>${links.map((l) => `<a href="${l}">x</a>`).join("")}</main></body></html>`);

it("normalises hrefs", () => {
  expect(normalizeHref("../b/", "/a/x/", "https://t.com")).toBe("/a/b/");
  expect(normalizeHref("https://t.com/x/#f", "/", "https://t.com")).toBe("/x/");
  expect(normalizeHref("https://other.com/x/", "/", "https://t.com")).toBeNull();
  expect(normalizeHref("/go/lovable/", "/", "https://t.com")).toBeNull();
  expect(normalizeHref("#top", "/", "https://t.com")).toBeNull();
});
it("finds orphans, depth and hub gaps", () => {
  const pages = [
    pg("/", ["/guides/"]), pg("/guides/", ["/guides/a/"]), pg("/guides/a/", ["/guides/b/"]), pg("/guides/b/", ["/guides/c/"]),
    pg("/guides/c/", ["/guides/d/"]), pg("/guides/d/", []), pg("/guides/lonely/", []), pg("/404.html", []),
  ];
  const r = analyseGraph(pages, cfg);
  expect(r.orphans).toEqual(["/guides/lonely/"]);
  expect(r.deep.some((d) => d.startsWith("/guides/d/"))).toBe(true);
  expect(r.hubGaps).toContain("/guides/lonely/ not linked from hub /guides/");
  expect(checkLinkGraph(pages, cfg).status).toBe("fail");
});
it("noindex pages are not orphan failures; healthy graph passes hard checks", () => {
  const pages = [pg("/", ["/guides/", "/guides/a/"]), pg("/guides/", ["/guides/a/", "/"]), pg("/guides/a/", ["/", "/guides/"]), pg("/guides/hidden/", [], '<meta name="robots" content="noindex">')];
  const c = checkLinkGraph(pages, cfg);
  expect(c.status).not.toBe("fail");
});
