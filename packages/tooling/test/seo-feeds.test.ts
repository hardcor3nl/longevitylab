import { expect, it } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { atomFeed, llmsTxt, rssFeed } from "../../core/src/seo/feed.ts";
import { parsePage } from "../src/seo/dist.ts";
import { checkFeeds } from "../src/seo/feeds-check.ts";

const cfg: any = { name: "T", origin: "https://t.com", trailingSlash: "always" };
const meta = { title: "T", link: "https://t.com/", description: "d", feedUrl: "https://t.com/feed.xml", author: "A" };
const home = parsePage("/", "/", '<html><head><link rel="alternate" type="application/rss+xml" href="/feed.xml"></head><body></body></html>');
const art = parsePage("/guides/a/", "", "<html><head></head><body></body></html>");

function dist(link: string) {
  const d = mkdtempSync(join(tmpdir(), "feed-"));
  const items = [{ title: "A", link, description: "d", published: "2026-01-01" }];
  writeFileSync(join(d, "feed.xml"), rssFeed(meta, items));
  writeFileSync(join(d, "atom.xml"), atomFeed(meta, items));
  writeFileSync(join(d, "llms.txt"), llmsTxt({ name: "T", summary: "s", sections: [{ title: "G", items: [{ title: "A", url: "https://t.com/guides/a/" }] }] }));
  return d;
}
it("passes when feed items point at built indexable pages", () => {
  expect(checkFeeds(dist("https://t.com/guides/a/"), cfg, [home, art]).status).toBe("pass");
});
it("fails on links to unbuilt pages", () => {
  const r = checkFeeds(dist("https://t.com/guides/missing/"), cfg, [home, art]);
  expect(r.status).toBe("fail"); expect(r.issues.join()).toMatch(/unbuilt/);
});
