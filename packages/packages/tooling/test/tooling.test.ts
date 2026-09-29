import { expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkParity, checkRedirects, checkRenderedText, parseCsv, sitemapPaths } from "../src/index.ts";

const dist = mkdtempSync(join(tmpdir(), "dist-"));
const page = (p: string, html: string) => { mkdirSync(join(dist, p), { recursive: true }); writeFileSync(join(dist, p, "index.html"), html); };
page("guides/a", "<html><body><p>Cursor Pro costs twenty dollars a month for individual developers.</p></body></html>");
page("guides/new", "<p>x</p>");

it("parity: 200, planned 301, unplanned 404", () => {
  const r = checkParity({ paths: ["/guides/a/", "/guides/old/", "/guides/gone/", "/guides/dead/"], dist,
    redirects: new Map([["/guides/old/", { to: "/guides/new/", status: 301 }], ["/guides/dead/", { to: "/guides/nowhere/", status: 301 }]]) });
  expect(r.ok).toEqual(["/guides/a/"]);
  expect(r.redirected).toEqual(["/guides/old/"]);
  expect(r.unplanned).toEqual(["/guides/gone/"]);
  expect(r.brokenRedirect).toEqual(["/guides/dead/"]);
});
it("redirects: bad target, chain, loop", () => {
  const m = new Map([["/x/", { to: "/guides/new/", status: 301 }], ["/y/", { to: "/z/", status: 301 }], ["/z/", { to: "/guides/new/", status: 301 }], ["/q/", { to: "/q/", status: 301 }], ["/w/", { to: "/missing/", status: 301 }]]);
  const r = checkRedirects(m, dist);
  expect(r.badTarget).toEqual(["/w/ -> /missing/"]);
  expect(r.chains).toEqual(["/y/ -> /z/"]);
  expect(r.loops).toEqual(["/q/"]);
});
it("rendered text: detects hidden/deferred body and missing paragraphs", () => {
  const body = "Cursor Pro costs twenty dollars a month for individual developers.\n\nA second paragraph that never made it into the page markup at all.";
  const ok = checkRenderedText(readHtml("guides/a"), body);
  expect(ok.missing).toHaveLength(1);
  const spin = checkRenderedText('<main>Loading page</main><div hidden id="S:0"><p>x</p></div>', body);
  expect(spin.deferred).toBe(true);
});
it("csv + sitemap parsing", () => {
  expect(parseCsv('a,b\n"x,1",y\n')).toEqual([{ a: "x,1", b: "y" }]);
  expect(sitemapPaths("<loc>https://a.com/x/</loc>")).toEqual(["/x/"]);
});
import { readFileSync } from "node:fs";
function readHtml(p: string) { return readFileSync(join(dist, p, "index.html"), "utf8"); }
