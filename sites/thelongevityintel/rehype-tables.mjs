/** Markdown tables: first body cell becomes a row header, empty header cells get hidden text, so screen readers get real headers. */
const el = (n, tag) => n.type === "element" && n.tagName === tag;
function walk(node, fn) { fn(node); (node.children ?? []).forEach((c) => walk(c, fn)); }
export default function rehypeTables() {
  return (tree) => {
    walk(tree, (n) => {
      if (!el(n, "table")) return;
      walk(n, (m) => {
        if (el(m, "thead")) walk(m, (h) => {
          if (!el(h, "th")) return;
          h.properties = { ...h.properties, scope: "col" };
          if (!h.children.some((c) => (c.type === "text" && c.value.trim()) || c.type === "element"))
            h.children = [{ type: "element", tagName: "span", properties: { className: ["visually-hidden"] }, children: [{ type: "text", value: "Attribute" }] }];
        });
        if (el(m, "tbody")) for (const tr of m.children.filter((c) => el(c, "tr"))) {
          const first = tr.children.find((c) => el(c, "td") || el(c, "th"));
          if (first && el(first, "td")) { first.tagName = "th"; first.properties = { ...first.properties, scope: "row" }; }
        }
      });
    });
  };
}
