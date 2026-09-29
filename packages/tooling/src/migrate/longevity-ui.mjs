/**
 * Longevity Intel UI port (job M, step 3), one-off and re-runnable.
 * usage: node packages/tooling/src/migrate/longevity-ui.mjs <old repo> <sites/thelongevityintel>
 * Copies the old App Router pages and shared components into src/legacy (rendered statically through the shims in
 * src/legacy/shims), and extracts each page's title/description into src/legacy/pageMeta.json. Content is not retyped.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const [repo, site] = process.argv.slice(2);
const oldSrc = join(repo, "src");
const out = join(site, "src/legacy");
const COMPONENTS = ["AnimatedSection", "ArticleTrust", "BentoGrid", "Breadcrumb", "CategoryNav", "ContentCluster", "DatabaseTeaser", "EditorialPromise", "EmailCapture", "FaqSection", "HubPillars", "ProductCard", "ProtocolsTeaser", "QuickVerdict", "QuizTeaser", "RelatedArticles", "StartHere", "TableOfContents", "TopGuides", "TrustBar"];
const LIBS = ["site", "authors", "toc", "types"];
const SKIP_TOP = new Set(["api", "go", "fonts", "category"]);

mkdirSync(join(out, "components"), { recursive: true });
mkdirSync(join(out, "lib"), { recursive: true });
for (const c of COMPONENTS) cpSync(join(oldSrc, "components", c + ".tsx"), join(out, "components", c + ".tsx"));
for (const l of LIBS) cpSync(join(oldSrc, "lib", l + ".ts"), join(out, "lib", l + ".ts"));

const STR = new RegExp("^\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|\"((?:[^\"\\\\]|\\\\.)*)\"|`((?:[^`\\\\]|\\\\.)*)`)");
const lit = (s) => {
  const m = STR.exec(s);
  if (!m) return undefined;
  return (m[1] ?? m[2] ?? m[3]).split("\\'").join("'").split('\\"').join('"').split("${SITE.name}").join("Longevity Intel");
};
const meta = {};
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (dir === join(oldSrc, "app") && SKIP_TOP.has(name)) continue;
      walk(p);
      continue;
    }
    if (name !== "page.tsx") continue;
    const rel = relative(join(oldSrc, "app"), dir).split("\\").join("/") || "index";
    if (rel === "index" || rel.includes("[")) continue;
    const dest = join(out, "pages", rel + ".tsx");
    mkdirSync(join(dest, ".."), { recursive: true });
    cpSync(p, dest);
    const layout = join(dir, "layout.tsx");
    const text = (existsSync(layout) ? readFileSync(layout, "utf8") : "") + "\n" + readFileSync(p, "utf8");
    const block = /export const metadata[\s\S]*?\n}/.exec(text)?.[0] ?? "";
    const title = lit(/\btitle:\s*([\s\S]*)/.exec(block)?.[1] ?? "");
    const description = lit(/\bdescription:\s*([\s\S]*)/.exec(block)?.[1] ?? "");
    meta[rel] = { title, description };
  }
}
walk(join(oldSrc, "app"));
for (const d of ["authors/[slug]", "database/[id]", "protocols/[id]", "category/[slug]"]) {
  const dest = join(out, "pages", d + ".tsx");
  mkdirSync(join(dest, ".."), { recursive: true });
  cpSync(join(oldSrc, "app", d, "page.tsx"), dest);
}
writeFileSync(join(out, "pageMeta.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(Object.keys(meta).length, "pages; missing title:", Object.entries(meta).filter(([, v]) => !v.title).map(([k]) => k));
