import { type Check, type Page, type SiteConfig, check, hubPairs, isRealPage } from "./dist.ts";

/**
 * Build-time structured-data validation against schema.org and Google's documented requirements:
 *  Article       https://developers.google.com/search/docs/appearance/structured-data/article
 *  Breadcrumb    https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 *  Organization  https://developers.google.com/search/docs/appearance/structured-data/organization
 *  Dataset       https://developers.google.com/search/docs/appearance/structured-data/dataset
 *  FAQPage       https://developers.google.com/search/docs/appearance/structured-data/faqpage (rich result retired; markup must still mirror visible text)
 *  ItemList      https://developers.google.com/search/docs/appearance/structured-data/carousel
 * Plus portfolio policy: author/publisher are Organizations, no Person, no Review/Rating without owner evidence.
 */
const ISO_DT = /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/;
const KNOWN = new Set(["Organization", "WebSite", "Article", "BlogPosting", "NewsArticle", "BreadcrumbList", "FAQPage", "ItemList", "Dataset", "VideoGame", "Review", "WebPage", "CollectionPage", "SoftwareApplication", "Product"]);
const ARTICLE = new Set(["Article", "BlogPosting", "NewsArticle"]);
const isAbs = (u: unknown) => typeof u === "string" && /^https:\/\/[^/]+/.test(u);

export const types = (n: any): string[] => (Array.isArray(n?.["@type"]) ? n["@type"] : n?.["@type"] ? [n["@type"]] : []);
const asArray = (v: unknown) => (Array.isArray(v) ? v : v === undefined ? [] : [v]);
const visibleText = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").toLowerCase();

/** Validate one JSON-LD node. `ctx.text` is the page's visible text; `ctx.origin` the site origin. */
export function validateNode(n: any, ctx: { text: string; origin: string }): string[] {
  const e: string[] = [];
  const need = (k: string) => { if (n[k] === undefined || n[k] === "" || (Array.isArray(n[k]) && !n[k].length)) e.push(`${types(n)[0]} missing ${k}`); };
  if (!String(n["@context"] ?? "").match(/^https?:\/\/schema\.org\/?$/)) e.push(`${types(n)[0] ?? "node"} missing @context https://schema.org`);
  const t = types(n)[0];
  if (!t) return [...e, "node without @type"];
  if (!KNOWN.has(t)) e.push(`unrecognised @type ${t}`);
  if (ARTICLE.has(t)) {
    ["headline", "datePublished", "dateModified", "image", "author", "publisher"].forEach(need);
    if (typeof n.headline === "string" && n.headline.length > 110) e.push("Article headline over 110 chars");
    for (const k of ["datePublished", "dateModified"]) if (n[k] && !ISO_DT.test(n[k])) e.push(`Article ${k} not ISO 8601: ${n[k]}`);
    if (n.datePublished && n.dateModified && n.dateModified < n.datePublished) e.push("Article dateModified earlier than datePublished");
    for (const a of asArray(n.author)) {
      if (types(a)[0] !== "Organization") e.push(`Article author must be an Organization, got ${types(a)[0]}`);
      if (!a.name) e.push("Article author missing name");
      if (!isAbs(a.url)) e.push("Article author missing absolute url");
    }
    if (n.publisher && types(n.publisher)[0] !== "Organization") e.push("Article publisher must be an Organization");
    for (const img of asArray(n.image)) if (!isAbs(typeof img === "string" ? img : img?.url)) e.push("Article image must be an absolute https URL");
    const id = typeof n.mainEntityOfPage === "string" ? n.mainEntityOfPage : n.mainEntityOfPage?.["@id"];
    if (!isAbs(id)) e.push("Article mainEntityOfPage must be the absolute page URL");
  } else if (t === "BreadcrumbList") {
    const items = asArray(n.itemListElement);
    if (items.length < 2) e.push("BreadcrumbList needs at least 2 items");
    items.forEach((it: any, i: number) => {
      if (it.position !== i + 1) e.push(`BreadcrumbList position ${it.position} at index ${i}`);
      if (!it.name) e.push(`BreadcrumbList item ${i + 1} missing name`);
      if (!isAbs(it.item)) e.push(`BreadcrumbList item ${i + 1} url not absolute`);
    });
  } else if (t === "Organization") {
    need("name"); need("url");
    if (!n.logo) e.push("Organization missing logo (Google logo guidance)");
    else if (!isAbs(typeof n.logo === "string" ? n.logo : n.logo.url)) e.push("Organization logo not an absolute URL");
    if (!n.sameAs?.length) e.push("Organization missing sameAs (no profile URLs)");
  } else if (t === "WebSite") {
    need("name"); need("url");
  } else if (t === "FAQPage") {
    const qs = asArray(n.mainEntity);
    if (!qs.length) e.push("FAQPage has no questions");
    for (const q of qs) {
      const qt = String(q.name ?? "").toLowerCase().replace(/\s+/g, " ").trim();
      const at = String(q.acceptedAnswer?.text ?? "").toLowerCase().replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (!qt || !ctx.text.includes(qt)) e.push(`FAQPage question not visible on page: "${qt.slice(0, 50)}"`);
      if (!at || !ctx.text.includes(at.slice(0, 60))) e.push(`FAQPage answer not visible on page for: "${qt.slice(0, 50)}"`);
    }
  } else if (t === "ItemList") {
    const items = asArray(n.itemListElement);
    if (!items.length) e.push("ItemList is empty");
    if (n.numberOfItems !== undefined && n.numberOfItems !== items.length) e.push("ItemList numberOfItems mismatch");
    items.forEach((it: any, i: number) => {
      if (it.position !== i + 1) e.push(`ItemList position ${it.position} at index ${i}`);
      if (!isAbs(it.url ?? it.item)) e.push(`ItemList item ${i + 1} url not absolute`);
      if (!it.name) e.push(`ItemList item ${i + 1} missing name`);
    });
  } else if (t === "Dataset") {
    need("name"); need("description"); need("license"); need("creator"); need("dateModified"); need("distribution");
    const d = String(n.description ?? "");
    if (d && (d.length < 50 || d.length > 5000)) e.push(`Dataset description must be 50-5000 chars, is ${d.length}`);
    if (n.dateModified && !ISO_DT.test(n.dateModified)) e.push("Dataset dateModified not ISO 8601");
    if (n.license && !isAbs(n.license)) e.push("Dataset license should be a license URL");
    for (const dl of asArray(n.distribution)) {
      if (types(dl)[0] !== "DataDownload") e.push("Dataset distribution must be DataDownload");
      if (!isAbs(dl.contentUrl)) e.push("Dataset distribution contentUrl not absolute");
      if (!dl.encodingFormat) e.push("Dataset distribution missing encodingFormat");
    }
    if (n.creator && !["Organization", "Person"].includes(types(n.creator)[0])) e.push("Dataset creator must be Organization/Person");
  } else if (t === "Review" || t === "AggregateRating") {
    e.push(`${t} present: only allowed for owner-tested pages with a visible rubric; verify manually`);
  }
  return e;
}

/** Flatten @graph and arrays. */
export const nodesOf = (p: Page): any[] => p.jsonLd.flatMap((j) => (Array.isArray(j) ? j : j?.["@graph"] ? j["@graph"].map((g: any) => ({ "@context": j["@context"], ...g })) : [j]));

export function checkStructuredData(pages: Page[], cfg: SiteConfig, datasetRoutes: string[] = (cfg.datasetRoutes as string[]) ?? []): Check {
  const issues: string[] = [];
  const routes = Object.values(cfg.collectionRoutes ?? {});
  let nodes = 0;
  for (const p of pages.filter(isRealPage)) {
    const ns = nodesOf(p);
    nodes += ns.length;
    p.jsonLdErrors.forEach((m) => issues.push(`${p.url}: invalid JSON in ld+json (${m})`));
    const text = visibleText(p.html);
    for (const n of ns) validateNode(n, { text, origin: cfg.origin }).forEach((m) => issues.push(`${p.url}: ${m}`));
    const have = new Set(ns.flatMap(types));
    const isHome = p.url === "/";
    const cats = (cfg.categoryRoutes as string[]) ?? [];
    const isHub = routes.includes(p.url) || ((cfg.hubRoutes as string[]) ?? []).includes(p.url) || cats.includes(p.url);
    const isEntry = !routes.includes(p.url) && !cats.includes(p.url) && routes.some((r) => p.url.startsWith(r)) && !p.noindex;
    if (isHome) for (const t of ["Organization", "WebSite"]) if (!have.has(t)) issues.push(`${p.url}: home page missing ${t}`);
    if (isEntry && ![...ARTICLE].some((t) => have.has(t))) issues.push(`${p.url}: article page missing Article JSON-LD`);
    if ((isEntry || isHub) && !have.has("BreadcrumbList")) issues.push(`${p.url}: missing BreadcrumbList`);
    if (isHub && !have.has("ItemList")) issues.push(`${p.url}: hub missing ItemList`);
    if (datasetRoutes.includes(p.url) && !have.has("Dataset")) issues.push(`${p.url}: data page missing Dataset`);
    // breadcrumb visible on page whenever marked up
    if (have.has("BreadcrumbList") && !/class="breadcrumbs"/.test(p.html)) issues.push(`${p.url}: BreadcrumbList without a visible breadcrumb trail`);
  }
  // Organization/logo/sameAs are warnings by nature on young sites: keep them visible but separate
  const soft = issues.filter((i) => /missing sameAs|missing logo/.test(i));
  const hard = issues.filter((i) => !soft.includes(i));
  const c = check("structured-data", "Structured data", hard, `${nodes} JSON-LD nodes validated across ${pages.filter(isRealPage).length} pages`);
  if (!hard.length && soft.length) return { ...c, status: "warn", issues: [...new Set(soft.map((s) => s.replace(/^\S+: /, "")))] };
  return c;
}
