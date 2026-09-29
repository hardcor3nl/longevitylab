import { readFileSync } from "node:fs";
/**
 * /go/<id> links in article bodies: `live` programmes stay on the tracked first-party hop with rel="sponsored nofollow";
 * `plain` entries link straight to the vendor with no sponsorship markup (no programme joined, nothing to track).
 * Unknown ids are left untouched so the link check reports them.
 */
const registry = new Map(JSON.parse(readFileSync(new URL("./src/data/affiliates.json", import.meta.url), "utf8")).map((a) => [a.id, a]));
const walk = (n, fn) => { fn(n); (n.children ?? []).forEach((c) => walk(c, fn)); };
export default function rehypeAffiliates() {
  return (tree) => walk(tree, (n) => {
    if (n.type !== "element" || n.tagName !== "a" || typeof n.properties?.href !== "string") return;
    const m = /^\/go\/([a-z0-9-]+)\/?$/.exec(n.properties.href);
    if (!m) return;
    const a = registry.get(m[1]);
    if (!a) return;
    if (a.status === "live") { n.properties.href = `/go/${a.id}`; n.properties.rel = ["sponsored", "nofollow", "noopener"]; }
    else { n.properties.href = a.url; n.properties.rel = ["noopener"]; }
  });
}
