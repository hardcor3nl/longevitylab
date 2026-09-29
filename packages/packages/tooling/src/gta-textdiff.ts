/** Text-diff check: main text of every page on the new build vs the live snapshot (sites/gtasixguide/migrate/live).
 *  node --experimental-strip-types src/gta-textdiff.ts <siteDir> */
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const site = path.resolve(process.argv[2] ?? "../../sites/gtasixguide");
const live = path.join(site, "migrate/live"), dist = path.join(site, "dist");
const flat = (html: string) => cheerio.load("<p>" + html.replace(/<[^>]+>/g, " ") + "</p>")("p").text().replace(/[\s ]+/g, "").replace(/[◆▸•→★✓]/g, "");
const inner = ($: cheerio.CheerioAPI, s: string) => { const e = $(s).first(); e.find("script,style,svg,button,nav[aria-label=Breadcrumb],.faq-block").remove(); return e.html() ?? ""; };
let bad = 0, n = 0;
for (const f of fs.readdirSync(live).filter((x) => x.endsWith(".html"))) {
  const route = f === "index.html" ? "/" : "/" + f.replace(/\.html$/, "").split("__").join("/") + "/";
  const isNews = route.startsWith("/news/") && route !== "/news/";
  const built = path.join(dist, route, "index.html");
  if (!fs.existsSync(built)) { console.log("MISSING", route); bad++; continue; }
  const dec = (x: string) => { const k = parseInt(x.slice(0, 2), 16); let o = ""; for (let i = 2; i < x.length; i += 2) o += String.fromCharCode(parseInt(x.slice(i, i + 2), 16) ^ k); return o; };
  const liveHtml = fs.readFileSync(path.join(live, f), "utf8").replace(/<a href="\/cdn-cgi\/l\/email-protection"[^>]*data-cfemail="([0-9a-f]+)"[^>]*>\[email&#160;protected\]<\/a>/g, (_m, x) => `<a>${dec(x)}</a>`).replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">\[email&#160;protected\]<\/span>/g, (_m, x) => dec(x));
  const a = cheerio.load(liveHtml);
  const b = cheerio.load(fs.readFileSync(built, "utf8"));
  const A = flat(inner(a, isNews ? "article" : "#root main")), B = flat(inner(b, isNews ? "article" : "#main"));
  if (!isNews && (!A.length || !B.length)) {
    // pages without a nested <main> (tools, map viewer): compare the whole <main>
    const A2 = flat(inner(a, "#root main")), B2 = flat(inner(b, "main"));
    n++;
    if (A2 !== B2) { let j = 0; while (j < A2.length && A2[j] === B2[j]) j++; bad++; console.log(`DIFF ${route} live ${A2.length} new ${B2.length} first difference at ${j}: live "${A2.slice(Math.max(0, j - 25), j + 50)}" new "${B2.slice(Math.max(0, j - 25), j + 50)}"`); }
    continue;
  }
  n++;
  if (A === B) continue;
  let i = 0; while (i < A.length && A[i] === B[i]) i++;
  bad++; console.log(`DIFF ${route} live ${A.length} new ${B.length} chars; first difference at ${i}: live "${A.slice(Math.max(0, i - 25), i + 40)}" new "${B.slice(Math.max(0, i - 25), i + 40)}"`);
}
console.log(`${n} pages compared, ${bad} with differences`);
process.exit(bad ? 1 : 0);
