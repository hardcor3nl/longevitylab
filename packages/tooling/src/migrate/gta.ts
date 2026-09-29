/**
 * GTA VI Guide export. Source of truth = the crawled live HTML in
 * sites/gtasixguide/migrate/live (old repo 389be1c is what is deployed).
 * Emits: src/content/news/*.mdx, src/content/pages/*.json, src/data/launch/*.json,
 * migrate/route-manifest.json. Nothing is retyped by hand.
 *
 *   node --experimental-strip-types src/migrate/gta.ts
 */
import { withTwins } from "../redirect-twins.ts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "../../../../sites/gtasixguide");
const liveDir = path.join(site, "migrate/live");
const OLD = "C:/Users/michael/Projects/Websites/gtasixguide";
const ORIGIN = "https://gtasixguide.com";

const files = fs.readdirSync(liveDir).filter((f) => f.endsWith(".html"));
const routeOf = (f: string) => (f === "index.html" ? "/" : "/" + f.replace(/\.html$/, "").split("__").join("/") + "/");

// ---------- helpers ----------
const webpIfExists = (src: string) => {
  const m = src.match(/^(\/[^?#]+)\.(jpg|jpeg|png)$/i);
  if (!m) return src;
  return fs.existsSync(path.join(site, "public", m[1] + ".webp")) ? m[1] + ".webp" : src;
};
const REDIR = new Map<string, string>();
for (const l of fs.readFileSync(path.join(site, "migrate/old_redirects.txt"), "utf8").split("\n")) {
  const m = l.trim().match(/^(\/\S+)\s+(\/\S+)\s+301$/);
  if (m) REDIR.set(m[1].replace(/\/$/, ""), m[2]);
}
/** internal links to a retired URL point straight at its 301 target (no redirect hop) */
const fixHref = (h: string) => (h.startsWith("/") ? REDIR.get(h.replace(/\/$/, "")) ?? h : h);
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/([*_`\[\]<>{}])/g, "\\$1");
const ws = (s: string) => s.replace(/\s+/g, " ").trim();
const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");

type El = cheerio.Cheerio<any>;
let $: cheerio.CheerioAPI;

function statusOf(cls: string): string | null {
  if (/neon-cyan/.test(cls)) return "ok";
  if (/yellow/.test(cls)) return "warn";
  if (/red|rose/.test(cls)) return "bad";
  if (/neon-pink/.test(cls)) return "pink";
  return null;
}

// inline -> markdown (MDX safe)
function inline(node: any, inTable = false): string {
  let out = "";
  $(node).contents().each((_, n: any) => {
    if (n.type === "text") {
      let t = (n.data as string).replace(/\s+/g, " ");
      t = esc(t);
      if (inTable) t = t.replace(/\|/g, "\\|");
      out += t;
      return;
    }
    if (n.type !== "tag") return;
    const tag = n.tagName;
    const cls = $(n).attr("class") || "";
    if (tag === "svg") return;
    if (tag === "br") { out += inTable ? " " : "  \n"; return; }
    if (tag === "strong" || tag === "b") { const t = inline(n, inTable); out += t.trim() ? `**${t.trim()}**` + (/\s$/.test(t) ? " " : "") : t; return; }
    if (tag === "em" || tag === "i") { const t = inline(n, inTable); out += t.trim() ? `*${t.trim()}*` + (/\s$/.test(t) ? " " : "") : t; return; }
    if (tag === "code") { out += "`" + $(n).text() + "`"; return; }
    if (tag === "a") {
      const href = fixHref($(n).attr("href") || "");
      const t = inline(n, inTable);
      if (false) {
      } else out += `[${t}](${href.replace(/\)/g, "%29").replace(/ /g, "%20")})`;
      return;
    }
    if (tag === "span") {
      const st = statusOf(cls);
      const t = inline(n, inTable);
      out += st && inTable ? `<span data-s="${st}">${t}</span>` : t;
      return;
    }
    out += inline(n, inTable);
  });
  return out;
}

// generic normalised HTML (JSX-safe) with semantic class mapping
function mapClass(cls: string): string {
  const c = new Set<string>();
  if (/(^| )grid( |$)|grid-cols/.test(cls)) c.add("g");
  if (/rounded/.test(cls) && /border/.test(cls)) c.add("box");
  if (/divide-y/.test(cls)) c.add("rows");
  if (/border-l/.test(cls)) c.add("tl");
  if (/(^| )flex( |$)/.test(cls)) c.add("fx");
  if (/rounded-full/.test(cls)) c.add("pill");
  if (/text-neon-cyan|neon-text-cyan/.test(cls)) c.add("c-cyan");
  if (/text-neon-pink|neon-text-pink/.test(cls)) c.add("c-pink");
  if (/text-yellow/.test(cls)) c.add("c-warn");
  if (/font-heading/.test(cls)) c.add("hd");
  if (/uppercase/.test(cls)) c.add("up");
  if (/text-white/.test(cls)) c.add("c-w");
  if (/text-gray-(400|500|600)/.test(cls)) c.add("c-dim");
  if (/neon-border-cyan|border-neon-cyan/.test(cls)) c.add("b-cyan");
  if (/border-neon-pink|neon-border-pink/.test(cls)) c.add("b-pink");
  if (/border-yellow/.test(cls)) c.add("b-warn");
  return [...c].join(" ");
}
function gen(node: any): string {
  if (node.type === "text") return (node.data as string).replace(/[{}]/g, (m: string) => (m === "{" ? "&#123;" : "&#125;")).replace(/</g, "&lt;").replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, "&amp;");
  if (node.type !== "tag") return "";
  const tag = node.tagName;
  if (tag === "svg" || tag === "script" || tag === "style" || tag === "button") return "";
  const cls = mapClass($(node).attr("class") || "");
  let attrs = cls ? ` className="${cls}"` : "";
  if (tag === "a") {
    const href = fixHref($(node).attr("href") || "");
    attrs += ` href="${escAttr(href)}"`;
    if ($(node).attr("target") === "_blank" || /^https?:/.test(href)) attrs += ` target="_blank" rel="noopener noreferrer"`;
  }
  if (tag === "img") {
    return `<img src="${escAttr(webpIfExists($(node).attr("src") || ""))}" alt="${escAttr($(node).attr("alt") || "")}" loading="lazy" decoding="async" />`;
  }
  if (tag === "br") return "<br />";
  if (tag === "summary") attrs = "";
  const kids = $(node).contents().map((_, n) => gen(n)).get().join("");
  return `<${tag}${attrs}>${kids}</${tag}>`;
}

// grid "table" -> GFM table
function gridTable(el: El): string | null {
  const rows: any[] = [];
  const collect = (e: El) => {
    e.children().each((_, c: any) => {
      const cls = $(c).attr("class") || "";
      if (/(^| )grid( |$)|grid-cols/.test(cls) && $(c).children().length >= 2) rows.push(c);
      else if (c.tagName === "div") collect($(c));
    });
  };
  collect(el);
  if (rows.length < 2) return null;
  // never drop siblings: the rows must account for all of the container's text
  const strip = (t: string) => t.replace(/\s+/g, "");
  if (strip(rows.map((r) => $(r).text()).join("")).length !== strip(el.text()).length) return null;
  const first = $(rows[0]);
  const isHead = first.children().toArray().every((c: any) => c.tagName === "span") && /uppercase/.test(first.attr("class") || "");
  if (!isHead) return null;
  const n = first.children().length;
  if (rows.some((r) => $(r).children().length !== n)) return null;
  const cell = (c: any) => inline(c, true).trim() || "&nbsp;";
  const head = first.children().toArray().map((c: any) => ws($(c).text()).replace(/\|/g, "\\|"));
  let out = "| " + head.join(" | ") + " |\n| " + head.map(() => "---").join(" | ") + " |\n";
  for (const r of rows.slice(1)) out += "| " + $(r).children().toArray().map(cell).join(" | ") + " |\n";
  return out + "\n";
}

function isMbHeading(c: any) {
  return c.tagName === "div" && /^mb-8$/.test($(c).attr("class") || "") && $(c).find("h2,h3").length > 0;
}

function block(c: any, depth = 0): string {
  if (c.type === "text") return ws(c.data) ? esc(ws(c.data)) + "\n\n" : "";
  if (c.type !== "tag") return "";
  const tag = c.tagName;
  const cls = $(c).attr("class") || "";
  if (tag === "svg") return "";
  if (isMbHeading(c)) {
    let out = "";
    $(c).children().each((_, k: any) => {
      if (k.tagName === "h2" || k.tagName === "h3") out += `${k.tagName === "h3" ? "###" : "##"} ${inline(k).trim()}\n\n`;
      else if (k.tagName === "div" && !$(k).text().trim()) return; // decorative accent bar
      else out += block(k);
    });
    return out;
  }
  if (tag === "h2" || tag === "h3" || tag === "h4") return `${"#".repeat(+tag[1])} ${inline(c).trim()}\n\n`;
  if (tag === "p") return inline(c).trim() + "\n\n";
  if (tag === "table") return gen(c) + "\n\n";
  if ((tag === "div" || tag === "section") && /rounded/.test(cls) && /border/.test(cls)) {
    const t = gridTable($(c));
    if (t) return t;
    if ($(c).find("table").length === 1 && $(c).children().length === 1) return gen($(c).find("table")[0]) + "\n\n";
  }
  if ((tag === "ul" || tag === "ol") && $(c).children("li").toArray().every((li: any) => $(li).children().toArray().every((k: any) => ["strong", "a", "em", "code", "span", "br"].includes(k.tagName) && !$(li).children("span").filter((_, s) => /rounded-full|flex/.test($(s).attr("class") || "")).length))) {
    let out = "";
    $(c).children("li").each((i, li) => { out += (tag === "ol" ? `${i + 1}. ` : "- ") + inline(li).trim() + "\n"; });
    return out + "\n";
  }
  // inline-only bordered box (the "Sources:" / "Related:" notes) -> blockquote
  if ((tag === "div" || tag === "p") && /rounded/.test(cls) && $(c).children().toArray().every((k: any) => ["strong", "a", "em", "code", "span", "br"].includes(k.tagName))) {
    return "> " + inline(c).trim().replace(/\n/g, "\n> ") + "\n\n";
  }
  // generic
  return gen(c) + "\n\n";
}

function bodyToMdx(article: El): string {
  let out = "";
  article.contents().each((_, c) => { out += block(c); });
  return out.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

// ---------- head parsing ----------
function head() {
  const jsonld = $('script[type="application/ld+json"]').map((_, e) => { try { return JSON.parse($(e).text()); } catch { return null; } }).get().filter(Boolean);
  return {
    title: $("title").first().text(),
    description: $('meta[name="description"]').attr("content") || "",
    robots: $('meta[name="robots"]').attr("content") || "",
    ogType: $('meta[property="og:type"]').attr("content") || "website",
    ogImage: $('meta[property="og:image"]').attr("content") || "",
    ogTitle: $('meta[property="og:title"]').attr("content") || "",
    twTitle: $('meta[name="twitter:title"]').attr("content") || "",
    canonical: $('link[rel="canonical"]').attr("href") || "",
    published: $('meta[property="article:published_time"]').attr("content") || "",
    modified: $('meta[property="article:modified_time"]').attr("content") || "",
    jsonld,
  };
}

const yaml = (o: any) => JSON.stringify(o, null, 2); // JSON is valid YAML frontmatter

// ---------- run ----------
const manifest: any[] = [];
fs.mkdirSync(path.join(site, "src/content/news"), { recursive: true });
fs.mkdirSync(path.join(site, "src/content/pages"), { recursive: true });
let nNews = 0, nPages = 0;

for (const f of files) {
  const route = routeOf(f);
  $ = cheerio.load(fs.readFileSync(path.join(liveDir, f), "utf8"));
  const h = head();
  const slug = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "__");
  manifest.push({ route, slug, title: h.title, robots: h.robots, canonical: h.canonical });
  if (h.canonical && h.canonical !== ORIGIN + route) console.warn("canonical differs", route, h.canonical);

  if (route.startsWith("/news/") && route !== "/news/") {
    const article = $("article").first();
    const heroSec = $("section").filter((_, e) => /h-64/.test($(e).attr("class") || "")).first();
    const img = heroSec.find("img").first();
    const cat = ws(heroSec.find("span.rounded-full").first().text());
    const dateDisp = ws(heroSec.find("span").filter((_, e) => /text-gray-400/.test($(e).attr("class") || "")).first().text());
    const h1 = ws(heroSec.find("h1").text());
    const byline = ws($("p").filter((_, e) => /^Published /.test(ws($(e).text()))).first().text());
    const tldr = $("h3").filter((_, e) => /Key Takeaways/.test($(e).text())).first().parent().find("li").map((_, li) => ws($(li).text().replace(/^▸/, ""))).get();
    const updates = $('section[aria-label="Update log"] li').map((_, li) => {
      const d = ws($(li).children("strong").first().text()).replace(/:$/, "");
      const clone = $(li).clone(); clone.children("strong").first().remove();
      return { date: d, note: ws(clone.text()) };
    }).get();
    const related = $("h3").filter((_, e) => /Continue Reading/.test($(e).text())).first().parent().find("a").filter((_, a) => $(a).find("h4").length > 0).map((_, a) => ({
      path: fixHref($(a).attr("href") || ""), title: ws($(a).find("h4").text()), category: ws($(a).find("span").first().text()),
      accent: /cyan/.test($(a).attr("class") || "") ? "cyan" : "pink",
    })).get();
    const iso = (d: string) => { const m = d.match(/(\d{1,2}) ([A-Za-z]{3,9}) (\d{4})/) || d.match(/([A-Za-z]{3,9}) (\d{1,2}), (\d{4})/); if (!m) return null; const t = /^\d/.test(m[1]) ? Date.parse(`${m[1]} ${m[2]} ${m[3]} UTC`) : Date.parse(`${m[1]} ${m[2]}, ${m[3]} UTC`); return isNaN(t) ? null : new Date(t).toISOString().slice(0, 10); };
    const pubIso = h.jsonld.find((j: any) => j["@type"] === "NewsArticle")?.datePublished || h.published.slice(0, 10);
    const updIso = h.jsonld.find((j: any) => j["@type"] === "NewsArticle")?.dateModified || "";
    const srcBox = article.find("div.rounded-lg").filter((_, e) => /^(Primary )?sources?/i.test(ws($(e).text()))).first();
    const sources = srcBox.find("a").map((_, a) => ({ title: ws($(a).text()), url: $(a).attr("href") || "", checked: updIso || pubIso })).get().filter((x: any) => /^https?:/.test(x.url));
    const fm: any = {
      slug: slug.replace("news__", ""),
      targetQuery: h1.toLowerCase(),
      updateLog: updates.map((u: any) => ({ date: iso(u.date), change: u.note })).filter((u: any) => u.date),
      sources,
      title: h.title, h1, description: h.description, category: cat, dateDisplay: dateDisp, byline,
      published: h.jsonld.find((j: any) => j["@type"] === "NewsArticle")?.datePublished || h.published.slice(0, 10),
      updated: h.jsonld.find((j: any) => j["@type"] === "NewsArticle")?.dateModified || "",
      image: img.attr("src") || "", imageAlt: img.attr("alt") || h1, ogImage: h.ogImage, ogTitle: h.ogTitle, twTitle: h.twTitle,
      robots: h.robots, tldr, updates, related, jsonld: h.jsonld,
      keepLiveMeta: true,
      author: "GTASixGuide Research Desk", evidence: "research", noindex: /noindex/.test(h.robots),
    };
    const body = bodyToMdx(article);
    if (/unlock/i.test(body + h.title + h.description)) fm.allowPhrases = ["unlock"];
    fs.writeFileSync(path.join(site, "src/content/news", slug.replace("news__", "") + ".mdx"), `---\n${yaml(fm)}\n---\n\n${body}`);
    nNews++;
    continue;
  }
  if (route === "/") continue; // home is a hand template fed by home.json below
  // generic page
  const main = $("#root main").first();
  let bodyHtml = "";
  const outerMain = main; // main.pt-16 contains hero header + inner main
  outerMain.find("button, script").remove();
  bodyHtml = outerMain.contents().map((_, n) => rawHtml(n)).get().join("");
  const kind = route.startsWith("/vehicles/") && route !== "/vehicles/" ? "vehicle" : route.startsWith("/tools/") ? "tool" : "page";
  fs.writeFileSync(path.join(site, "src/content/pages", slug + ".json"), JSON.stringify({ path: route, kind, title: h.title, description: h.description, robots: h.robots, ogType: h.ogType, ogImage: h.ogImage, ogTitle: h.ogTitle, twTitle: h.twTitle, jsonld: h.jsonld, bodyHtml }, null, 1));
  nPages++;
}

// raw html serialiser for hub pages: keep Tailwind classes, drop svg-less noise, webp images
// responsive variants (-640/-960 webp siblings written by gta-assets.mjs)
function setSrcset(img: any) {
  const src = img.attr("src") || "";
  if (!src.endsWith(".webp") || img.attr("srcset")) return;
  const parts = [640, 960].filter((w) => fs.existsSync(path.join(site, "public", src.replace(/\.webp$/, `-${w}.webp`)))).map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`);
  if (!parts.length) return;
  img.attr("srcset", [...parts, `${src} 1600w`].join(", "));
  img.attr("sizes", img.attr("loading") === "eager" ? "100vw" : "(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw");
}
// old React reveal wrappers start invisible until an IntersectionObserver runs: make them visible-by-default (CSS .rv)
/** Cloudflare's email obfuscation (data-cfemail) -> the real address; the new host re-applies obfuscation at the edge. */
export function decodeCf(hex: string): string { const k = parseInt(hex.slice(0, 2), 16); let o = ""; for (let i = 2; i < hex.length; i += 2) o += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ k); return o; }
function unCf(h: string): string {
  h = h.replace(/href="\/cdn-cgi\/l\/email-protection#([0-9a-f]+)"/g, (_m, x) => `href="mailto:${decodeCf(x)}"`);
  return h.replace(/<a href="\/cdn-cgi\/l\/email-protection"[^>]*data-cfemail="([0-9a-f]+)"[^>]*>\[email(?:&#160;|&nbsp;| | )protected\]<\/a>/g, (_m, x) => `<a href="mailto:${decodeCf(x)}">${decodeCf(x)}</a>`)
    .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">\[email(?:&#160;|&nbsp;| | )protected\]<\/span>/g, (_m, x) => decodeCf(x));
}
function reveal(h: string): string { h = unCf(h); return h.replace(/href="(\/[^"]*)"/g, (_m, u) => `href="${fixHref(u)}"`).replace(/opacity-0 translate-y-\d+/g, "rv").replace(/(class="[^"]*?)translate-y-\d+ opacity-0/g, "$1rv"); }
function rawHtml(n: any): string {
  if (n.type === "text") return $.html(n);
  if (n.type !== "tag") return "";
  if (n.tagName === "script") return "";
  const el = $(n);
  el.find("img").each((_, i) => { const s = $(i).attr("src"); if (s) $(i).attr("src", webpIfExists(s)); $(i).attr("decoding", "async"); setSrcset($(i)); });
  return reveal($.html(n));
}

// home
{
  $ = cheerio.load(fs.readFileSync(path.join(liveDir, "index.html"), "utf8"));
  const h = head();
  const main = $("#root main").first();
  main.find("script").remove();
  main.find("img").each((_, i) => { const s = $(i).attr("src"); if (s) $(i).attr("src", webpIfExists(s)); setSrcset($(i)); });
  fs.writeFileSync(path.join(site, "src/content/pages/home.json"), JSON.stringify({ path: "/", kind: "home", title: h.title, description: h.description, robots: h.robots, ogType: h.ogType, ogImage: h.ogImage, ogTitle: h.ogTitle, twTitle: h.twTitle, jsonld: h.jsonld, bodyHtml: reveal(main.html() ?? "") }, null, 1));
  nPages++;
}

// launch data + vehicle redirects
fs.mkdirSync(path.join(site, "src/data/launch"), { recursive: true });
for (const j of fs.readdirSync(path.join(OLD, "src/data/launch"))) fs.copyFileSync(path.join(OLD, "src/data/launch", j), path.join(site, "src/data/launch", j));
fs.mkdirSync(path.join(site, "public"), { recursive: true });
fs.copyFileSync(path.join(OLD, "public/_redirects"), path.join(site, "migrate/old_redirects.txt"));
fs.writeFileSync(path.join(site, "migrate/route-manifest.json"), JSON.stringify(manifest, null, 1));
console.log({ nNews, nPages, routes: manifest.length });

// ---------- ledger + redirects ----------
{
  const sm = fs.readFileSync(path.join(liveDir, "../sitemap-live.txt"), "utf8").split(/\r?\n/).filter(Boolean).map((u) => u.replace(ORIGIN, ""));
  const inSitemap = new Set(sm);
  const words = (route: string) => {
    const slug = route.replace(/^\/|\/$/g, "").replace(/\//g, "__");
    const nf = path.join(site, "src/content/news", slug.replace("news__", "") + ".mdx");
    const pf = path.join(site, "src/content/pages", (slug || "home") + ".json");
    const t = fs.existsSync(nf) ? fs.readFileSync(nf, "utf8").split("\n---\n")[1] : fs.existsSync(pf) ? JSON.parse(fs.readFileSync(pf, "utf8")).bodyHtml.replace(/<[^>]+>/g, " ") : "";
    return (t || "").split(/\s+/).filter(Boolean).length;
  };
  const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const rows = ["url,decision,target_query,reason,redirect_target,date,status,word_count,in_live_sitemap,robots,kind"];
  for (const m of manifest) {
    const kind = m.route === "/" ? "home" : m.route.startsWith("/news/") && m.route !== "/news/" ? "news" : m.route.startsWith("/vehicles/") && m.route !== "/vehicles/" ? "vehicle" : m.route.startsWith("/tools/") ? "tool" : "page";
    rows.push([m.route, "keep", "", q("no GSC pages file for this site: everything is keep"), "", "2026-09-29", "proposed", words(m.route), inSitemap.has(m.route), q(m.robots), kind].join(","));
  }
  const red = fs.readFileSync(path.join(site, "migrate/old_redirects.txt"), "utf8").split(/\r?\n/).filter((l) => /^\/.*\s+(\/\S+)\s+(301|200)/.test(l));
  const seen = new Set<string>();
  for (const l of red) {
    const [from, to, code] = l.trim().split(/\s+/);
    const key = from.replace(/\/$/, "");
    if (seen.has(key) || code === "200") continue;
    seen.add(key);
    rows.push([key + "/", "keep", "", q("existing 301 preserved verbatim"), to, "2026-09-29", "proposed", 0, false, "", "redirect"].join(","));
  }
  fs.writeFileSync(path.join(site, "content-ledger.csv"), rows.join("\n") + "\n");
  fs.writeFileSync(path.join(site, "public/_redirects"), withTwins(fs.readFileSync(path.join(site, "migrate/old_redirects.txt"), "utf8")));
  console.log("ledger rows", rows.length - 1);
}
