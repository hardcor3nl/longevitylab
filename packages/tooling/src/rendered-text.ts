import { pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { loadDocs } from "@portfolio/schema";
import { distFileFor, htmlToText, parseRedirectsFile } from "./util.ts";

/** Reduce MDX/Markdown source to comparable paragraphs of plain text. */
export function sourceParagraphs(body: string): string[] {
  return body
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/^\s*(import|export)\s.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*\|?\s*:?-{3,}[\s|:-]*$/gm, "")
    .split(/\n+/)
    .map((p) => p
      .replace(/^\s*[#>*\-+\d.]+\s+/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\\([{}<|~])/g, "$1")
      .replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")
      .replace(/[*`]/g, "")
      .replace(/\|/g, " ")
      .replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
      .replace(/\s+/g, " ").trim().toLowerCase())
    .filter((p) => p.split(" ").length >= 8);
}

export interface RenderedTextResult { file: string; url: string; missing: string[]; deferred: boolean; noHtml: boolean }

export function checkRenderedText(html: string | null, body: string): { missing: string[]; deferred: boolean } {
  if (html === null) return { missing: [], deferred: false };
  const text = htmlToText(html).replace(/\|/g, " ").replace(/\s+/g, " ");
  const deferred = /id="S:\d+"|<template[^>]*data-defer|Loading page/i.test(html) && /hidden/.test(html);
  // whitespace- and entity-insensitive: raw HTML blocks in MDX join adjacent elements without spaces
  const flat = (t: string) => t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#\d+;/g, "").replace(/[◆▸•→|]/g, "").replace(/\s+/g, "");
  const flatText = flat(text);
  const missing = sourceParagraphs(body).filter((p) => !flatText.includes(flat(p).slice(0, 40)));
  return { missing, deferred };
}

function main() {
  const a = process.argv.slice(2);
  const opt = (n: string, d?: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : d);
  const site = opt("--site", ".")!, dist = join(site, opt("--dist", "dist")!);
  const content = join(site, opt("--content", "src/content")!);
  const cfg = JSON.parse(readFileSync(join(site, "site.config.json"), "utf8"));
  // slugs the ledger merges or cuts are 301s, not built pages
  const redirected = new Set([...parseRedirectsFile(join(site, "public/_redirects")).keys()]);
  let bad = 0, n = 0;
  for (const d of loadDocs(content)) {
    const fmx = d.frontmatter as { slug?: string; route?: string } | undefined;
    const slug = fmx?.slug;
    if (!slug) continue;
    const coll = relative(content, d.file).split(/[\\/]/)[0];
    const base = cfg.collectionRoutes?.[coll];
    if (!base && !fmx?.route) continue;
    const url = fmx?.route ?? `${base}${slug}${cfg.trailingSlash === "always" ? "/" : ""}`;
    if (redirected.has(url)) continue;
    n++;
    const file = distFileFor(dist, url);
    const r = checkRenderedText(file ? readFileSync(file, "utf8") : null, d.body);
    if (!file) { bad++; console.log(`FAIL no built page for ${url}`); }
    else if (r.deferred || r.missing.length) {
      bad++; console.log(`FAIL ${url}${r.deferred ? " (deferred/hidden body)" : ""} missing ${r.missing.length} paragraphs, e.g. "${r.missing[0]?.slice(0, 60)}"`);
    }
  }
  console.log(`${n} pages checked, ${bad} failing`);
  process.exit(bad ? 1 : 0);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
