import { expect, it } from "vitest";
import { paginate, relatedEntries } from "../src/seo/related.ts";

const mk = (id: string, cluster: string, title: string, date = "2026-01-01", tags: string[] = []) => ({ href: `/${id}/`, title, cluster, date, tags });
const all = [
  mk("a", "Lovable", "Lovable pricing explained"), mk("b", "Lovable", "Lovable alternatives"), mk("c", "Cursor", "Cursor pricing explained"),
  mk("d", "Lovable", "Lovable vs Cursor", "2026-05-01", ["cursor"]), mk("e", "Other", "Zzz unrelated"), mk("f", "Other", "Yyy unrelated"),
];
it("same cluster first, excludes self, deterministic", () => {
  const r = relatedEntries(all[0], all, { limit: 3 });
  expect(r.slice(0, 2).map((x) => x.href).sort()).toEqual(["/b/", "/d/"]); expect(r[2].href).toBe("/c/");
  expect(relatedEntries(all[0], all, { limit: 3 })).toEqual(r);
});
it("always returns the minimum even with no topical overlap", () => {
  const r = relatedEntries(all[4], all, { limit: 6, min: 3 });
  expect(r.length).toBeGreaterThanOrEqual(3);
  expect(r.find((x) => x.href === "/e/")).toBeUndefined();
});
it("paginates with self-contained urls", () => {
  const p = paginate([1, 2, 3, 4, 5], 2, "/guides/");
  expect(p.map((x) => x.path)).toEqual(["/guides/", "/guides/page/2/", "/guides/page/3/"]);
  expect(p[1].prev).toBe("/guides/"); expect(p[2].next).toBeUndefined(); expect(p[0].items).toEqual([1, 2]);
});
