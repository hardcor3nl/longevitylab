import { expect, it } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parsePage } from "../src/seo/dist.ts";
import { canonicalFor, checkHead, pngSize } from "../src/seo/head-check.ts";

const cfg: any = { name: "T", origin: "https://t.com", trailingSlash: "always" };
const page = (url: string, o: { title?: string; desc?: string; canon?: string; robots?: string; extra?: string } = {}) =>
  parsePage(url, url, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${o.title ?? "Title " + url}</title><meta name="description" content="${o.desc ?? "A description of " + url + " that is long enough to be a fine snippet."}"><link rel="canonical" href="${o.canon ?? "https://t.com" + url}"><meta name="robots" content="${o.robots ?? "index,follow"}">${o.extra ?? ""}<link rel="preload" as="font" href="/f.woff2" crossorigin></head><body><h1>H</h1></body></html>`);

it("canonical follows trailing slash policy", () => {
  expect(canonicalFor(cfg, "/a/")).toBe("https://t.com/a/");
  expect(canonicalFor({ ...cfg, trailingSlash: "never" }, "/a/")).toBe("https://t.com/a");
});
it("reads PNG dimensions", () => {
  const b = Buffer.alloc(24); b.writeUInt32BE(0x89504e47, 0); b.writeUInt32BE(1200, 16); b.writeUInt32BE(630, 20);
  expect(pngSize(b)).toEqual({ w: 1200, h: 630 });
  expect(pngSize(Buffer.from("nope"))).toBeNull();
});
it("clean pages pass head and duplicate checks", () => {
  const r = checkHead([page("/a/"), page("/b/")], cfg, "/nonexistent");
  expect(r.head.status).not.toBe("fail"); expect(r.duplicates.status).toBe("pass");
});
it("flags duplicate titles/descriptions", () => {
  const r = checkHead([page("/a/", { title: "Same", desc: "x".repeat(80) }), page("/b/", { title: "Same", desc: "x".repeat(80) })], cfg, "/x");
  expect(r.duplicates.status).toBe("fail");
  expect(r.duplicates.issues.length).toBe(2);
});
it("flags bad canonical, duplicate robots, hreflang, multiple h1", () => {
  const r = checkHead([page("/a/", { canon: "https://t.com/other/" }), page("/b/", { extra: '<meta name="robots" content="noindex"><link rel="alternate" hreflang="en" href="https://t.com/b/">' })], cfg, "/x");
  const t = r.head.issues.join("|");
  expect(r.head.status).toBe("fail");
  expect(t).toMatch(/not the self URL/); expect(t).toMatch(/2 robots meta/); expect(t).toMatch(/hreflang/);
});
it("noindex pages are exempt from duplicate checks", () => {
  const r = checkHead([page("/a/", { title: "Same" }), page("/b/", { title: "Same", robots: "noindex,follow" })], cfg, "/x");
  expect(r.duplicates.status).toBe("pass");
});

it("og:image with wrong dimensions is a WARN, a missing file is still a FAIL", () => {
  const dir = mkdtempSync(join(tmpdir(), "og-"));
  const b = Buffer.alloc(24); b.writeUInt32BE(0x89504e47, 0); b.writeUInt32BE(1536, 16); b.writeUInt32BE(1024, 20);
  writeFileSync(join(dir, "og.png"), b);
  const pg = (img: string) => page("/a/", { extra: `<meta property="og:image" content="${img}"><meta name="twitter:image" content="${img}">` });
  expect(checkHead([pg("https://t.com/og.png")], cfg, dir).og.status).toBe("warn");
  expect(checkHead([pg("https://t.com/missing.png")], cfg, dir).og.status).toBe("fail");
});
