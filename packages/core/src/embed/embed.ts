/**
 * Shared embed platform: snippet builders and citation formatters. Pure functions, no Astro imports,
 * so they are unit-tested and reused by every site.
 *
 * Link policy (Google link spam policies): the credit is a plain, visible, brand-named link that an
 * editor can keep or remove. The iframe snippet puts the credit link OUTSIDE the iframe, so it lives on
 * the host page as a normal <a>. No hidden links, no keyword anchors, no forced attribution scripts.
 */
export const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface EmbedSpec {
  /** Site origin, no trailing slash, e.g. https://gtasixguide.com */
  origin: string;
  /** Path of the embed page, e.g. /embed/unlock-time/ */
  embedPath: string;
  /** Canonical full page the credit link points to, e.g. /tools/unlock-time/ */
  pagePath: string;
  /** Widget id, used for the iframe element id (letters, digits, dashes) */
  id: string;
  /** Accessible iframe title */
  title: string;
  /** Initial iframe height in px (auto-resize takes over when the script is used) */
  height: number;
  /** Brand name used in the credit anchor, e.g. "GTA VI Guide" */
  brand: string;
  /** Static share-card image path (PNG), for forums and Markdown */
  imagePath?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const abs = (origin: string, path: string) => origin.replace(/\/$/, "") + path;

export function creditHtml(s: EmbedSpec, label = "Source"): string {
  return `<p style="font:13px/1.4 system-ui,sans-serif;margin:6px 0 0">${label}: <a href="${escAttr(abs(s.origin, s.pagePath))}">${escAttr(s.brand)}</a></p>`;
}

/** Plain iframe. Credit link sits outside the iframe. */
export function iframeSnippet(s: EmbedSpec): string {
  return `<iframe id="${s.id}" src="${escAttr(abs(s.origin, s.embedPath))}" title="${escAttr(s.title)}" width="100%" height="${s.height}" style="border:0;max-width:100%" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>\n${creditHtml(s)}`;
}

/** Iframe plus a tiny inline listener that sizes the frame to its content. No external script is loaded. */
export function resizeSnippet(s: EmbedSpec): string {
  const js = `addEventListener("message",function(e){var f=document.getElementById("${s.id}");if(f&&e.source===f.contentWindow&&e.data&&e.data.portfolioEmbed)f.style.height=e.data.height+"px"})`;
  return `${iframeSnippet(s)}\n<script>${js}</script>`;
}

/** Static image plus link, HTML (for pages that will not run iframes). */
export function imageHtmlSnippet(s: EmbedSpec): string {
  if (!s.imagePath) return "";
  const dim = s.imageWidth && s.imageHeight ? ` width="${s.imageWidth}" height="${s.imageHeight}"` : "";
  return `<a href="${escAttr(abs(s.origin, s.pagePath))}"><img src="${escAttr(abs(s.origin, s.imagePath))}" alt="${escAttr(s.imageAlt ?? s.title)}"${dim} loading="lazy" style="max-width:100%;height:auto"></a>\n${creditHtml(s)}`;
}

/** Markdown for Reddit, Discord and forums: image that links to the page, plus a text credit. */
export function markdownSnippet(s: EmbedSpec): string {
  if (!s.imagePath) return "";
  const alt = (s.imageAlt ?? s.title).replace(/[\[\]]/g, "");
  return `[![${alt}](${abs(s.origin, s.imagePath)})](${abs(s.origin, s.pagePath)})\n\nSource: [${s.brand}](${abs(s.origin, s.pagePath)})`;
}

/** Chart snippet: image plus credit link, licence stated. */
export function chartSnippet(o: { origin: string; imgPath: string; pagePath: string; alt: string; brand: string; width?: number; height?: number }): string {
  const dim = o.width && o.height ? ` width="${o.width}" height="${o.height}"` : "";
  return `<figure style="margin:0"><a href="${escAttr(abs(o.origin, o.pagePath))}"><img src="${escAttr(abs(o.origin, o.imgPath))}" alt="${escAttr(o.alt)}"${dim} loading="lazy" style="max-width:100%;height:auto"></a><figcaption style="font:13px/1.4 system-ui,sans-serif">Chart: <a href="${escAttr(abs(o.origin, o.pagePath))}">${escAttr(o.brand)}</a>, CC BY 4.0</figcaption></figure>`;
}

/* ---------------- Cite this ---------------- */
export interface CiteSpec {
  /** Title of the dataset or page */
  title: string;
  /** Editorial name of the publisher, e.g. "GTASixGuide Research Desk" */
  author: string;
  /** Site name, e.g. "GTA VI Guide" */
  site: string;
  /** Stable canonical URL of the page */
  url: string;
  /** ISO date (YYYY-MM-DD) of the dataset version, i.e. when the data was last checked */
  date: string;
  /** Optional version label */
  version?: string;
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const parts = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split("-").map(Number); return { y, m, d }; };
const bibEsc = (s: string) => s.replace(/([&%$#_{}])/g, "\\$1");

export function citeApa(c: CiteSpec): string {
  const { y, m, d } = parts(c.date);
  const ver = c.version ? ` (Version ${c.version})` : "";
  return `${c.author}. (${y}, ${MONTHS[m - 1]} ${d}). ${c.title}${ver} [Data set]. ${c.site}. ${c.url}`;
}
export function citePlain(c: CiteSpec): string {
  const { y, m, d } = parts(c.date);
  return `${c.author}, "${c.title}", ${c.site}, ${d} ${MONTHS[m - 1]} ${y}${c.version ? `, version ${c.version}` : ""}. ${c.url}`;
}
export function citeBibtex(c: CiteSpec): string {
  const { y, m } = parts(c.date);
  const key = (c.site.replace(/[^A-Za-z0-9]/g, "") + y + "_" + c.title.split(/\s+/)[0].replace(/[^A-Za-z0-9]/g, "")).slice(0, 60);
  const lines = [
    `  title = {${bibEsc(c.title)}}`,
    `  author = {${bibEsc(c.author)}}`,
    `  year = {${y}}`,
    `  month = {${MONTHS[m - 1].slice(0, 3).toLowerCase()}}`,
    `  publisher = {${bibEsc(c.site)}}`,
    ...(c.version ? [`  version = {${bibEsc(c.version)}}`] : []),
    `  url = {${c.url}}`,
    `  note = {Data set, last checked ${c.date.slice(0, 10)}}`,
  ];
  return `@misc{${key},\n${lines.join(",\n")}\n}`;
}

/** Theme for sites without bespoke tokens: follows the surrounding text colour, so it works on light and dark pages. */
export const LK_ADAPTIVE = "--lk-bg:transparent;--lk-ink:currentColor;--lk-muted:color-mix(in srgb,currentColor 82%,transparent);--lk-line:color-mix(in srgb,currentColor 30%,transparent);--lk-accent:currentColor;--lk-btn:#1d4ed8;--lk-btn-ink:#fff;--lk-field:color-mix(in srgb,currentColor 7%,transparent);--lk-field-ink:currentColor";
