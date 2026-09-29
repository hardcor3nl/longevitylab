import { expect, it } from "vitest";
import { atomFeed, llmsTxt, rssFeed } from "../src/seo/feed.ts";

const m = { title: "T & Co", link: "https://t.com/", description: "d", feedUrl: "https://t.com/feed.xml", author: "T editorial" };
const items = [
  { title: "Old <one>", link: "https://t.com/old/", description: "o", published: "2026-01-01" },
  { title: "New", link: "https://t.com/new/", description: "n", published: "2026-02-01", updated: "2026-03-05" },
];
it("rss escapes, orders newest first, uses RFC 822 dates", () => {
  const x = rssFeed(m, items);
  expect(x).toContain("T &amp; Co"); expect(x).toContain("Old &lt;one&gt;");
  expect(x.indexOf("/new/")).toBeLessThan(x.indexOf("/old/"));
  expect(x).toMatch(/<pubDate>Sun, 01 Feb 2026 00:00:00 GMT<\/pubDate>/);
  expect(x).toContain('rel="self"');
});
it("atom carries updated and published separately", () => {
  const x = atomFeed(m, items);
  expect(x).toContain("<updated>2026-03-05T00:00:00Z</updated>"); expect(x).toContain("<published>2026-02-01T00:00:00Z</published>");
});
it("limit is honoured", () => { expect(rssFeed(m, items, 1).match(/<item>/g)).toHaveLength(1); });
it("llms.txt follows the llmstxt.org shape", () => {
  const x = llmsTxt({ name: "T", summary: "A  site\nabout x", sections: [{ title: "Guides", items: [{ title: "G", url: "https://t.com/g/", description: "desc" }] }, { title: "Empty", items: [] }] });
  expect(x.startsWith("# T\n\n> A site about x\n")).toBe(true);
  expect(x).toContain("## Guides\n\n- [G](https://t.com/g/): desc");
  expect(x).not.toContain("Empty");
});
