/** Head parity: title, description, canonical, robots, og:image, JSON-LD (type + exact JSON) live vs new build.
 *  node --experimental-strip-types src/gta-headdiff.ts <siteDir> */
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
const site = path.resolve(process.argv[2] ?? "../../sites/gtasixguide");
const live = path.join(site, "migrate/live"), dist = path.join(site, "dist");
const grab = (h: string) => { const $ = cheerio.load(h); return {
  title: $("title").text(), description: $('meta[name="description"]').attr("content") ?? "", canonical: $('link[rel="canonical"]').attr("href") ?? "",
  robots: $('meta[name="robots"]').attr("content") ?? "", ogImage: $('meta[property="og:image"]').attr("content") ?? "", ogType: $('meta[property="og:type"]').attr("content") ?? "",
  ld: $('script[type="application/ld+json"]').map((_, e) => JSON.stringify(JSON.parse($(e).text()))).get().join("\n"),
  adsense: /ca-pub-2821856460379203/.test(h), h1: $("h1").length,
}; };
let bad = 0, n = 0;
for (const f of fs.readdirSync(live).filter((x) => x.endsWith(".html"))) {
  const route = f === "index.html" ? "/" : "/" + f.replace(/\.html$/, "").split("__").join("/") + "/";
  const b = path.join(dist, route, "index.html");
  if (!fs.existsSync(b)) { console.log("MISSING", route); bad++; continue; }
  const strip = (x: string, r: string) => (r === "/news/" ? x.split(String.fromCharCode(10)).filter((l) => !l.includes('"@type":"ItemList"')).join(String.fromCharCode(10)) : x); // /news/ gains an ItemList (additive)
  const A = grab(fs.readFileSync(path.join(live, f), "utf8")), B = grab(fs.readFileSync(b, "utf8"));
  n++;
  // amended rule: indexable pages gain robots "index, follow, max-image-preview:large"; noindex pages keep live robots
  const wantRobots = /noindex/i.test(A.robots) ? A.robots : "index, follow, max-image-preview:large";
  const d = (Object.keys(A) as (keyof typeof A)[]).filter((k) => (k === "robots" ? B.robots !== wantRobots : k === "ld" ? strip(B.ld, route) !== A.ld : A[k] !== B[k]));
  if (d.length) { bad++; console.log("DIFF", route, d.map((k) => `${k}: live=${JSON.stringify(A[k]).slice(0, 90)} new=${JSON.stringify(B[k]).slice(0, 90)}`).join(" || ")); }
}
console.log(`${n} pages, ${bad} with head differences`);
