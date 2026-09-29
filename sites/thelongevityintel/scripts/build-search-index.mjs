// public/search-index.json: [{ slug, category, title, description }] for the header search (fetched lazily).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
const root = new URL("../src/content/", import.meta.url);
const items = [];
for (const cat of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of readdirSync(new URL(`${cat.name}/`, root)).filter((n) => /\.mdx?$/.test(n))) {
    const { data } = matter(readFileSync(new URL(`${cat.name}/${f}`, root), "utf8"));
    if (data.noindex) continue;
    items.push({ slug: f.replace(/\.mdx?$/, ""), category: cat.name, title: data.title, description: data.description });
  }
}
items.sort((a, b) => a.title.localeCompare(b.title));
writeFileSync(new URL("../public/search-index.json", import.meta.url), JSON.stringify(items));
console.log(`search index: ${items.length} entries`);
