import supplements from "../data/supplements.json";
import comparisons from "../data/comparisons.json";

/** Links from an article to the dataset records and head-to-head comparisons about the same compounds or devices.
 *  Derived from the data files (names, aliases, comparison titles), not hand-listed per article. */
export interface DatasetLink { href: string; label: string; note: string }

const GENERIC = new Set("vs compared types forms apps best guide the and which".split(" "));
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+]+/g, " ").trim();
const hasTerm = (hay: string, term: string) => (" " + hay + " ").includes(" " + term + " ");

export function datasetLinksFor(a: { slug: string; body?: string; data: { title: string; description?: string; tags: string[]; h1?: string } }, limit = { records: 4, compares: 2 }): DatasetLink[] {
  const hay = norm([a.slug, a.data.title, a.data.h1 ?? "", a.data.description ?? "", ...a.data.tags].join(" "));
  const body = " " + norm(a.body ?? "") + " ";
  /** a term counts when it is in the title, slug, tags or description, or the body names it at least twice */
  const mentions = (term: string) => hasTerm(hay, term) || body.split(" " + term + " ").length - 1 >= 2;
  const matched = (supplements as any[])
    .map((s) => ({ s, hits: [s.id, s.name, ...String(s.aliases ?? "").split(",")].map(norm).filter((t) => t.length >= 2 && mentions(t)).length }))
    .filter((x) => x.hits > 0).sort((x, y) => y.hits - x.hits || x.s.id.localeCompare(y.s.id))
    ;
  // a record the data says stacks with a matched one (stacksWith) comes next, so every record is reachable from the pages about its partners
  const partners = matched.flatMap((x: any) => ((x.s.stacksWith ?? []) as string[]).map((id) => (supplements as any[]).find((r) => r.id === id)).filter(Boolean).map((s: any) => ({ s, hits: 0 })));
  const seen = new Set<string>();
  const records = [...matched, ...partners].filter((x: any) => !seen.has(x.s.id) && seen.add(x.s.id)).slice(0, limit.records)
    .map(({ s }: any) => ({ href: `/database/${s.id}`, label: `${s.name} evidence record`, note: String(s.summary ?? "").split(". ")[0].slice(0, 140) }));
  const compares = (comparisons as any[])
    .map((c) => {
      const terms = [...new Set(norm(`${c.slug.replace(/-/g, " ")} ${c.title} ${c.a} ${c.b}`).split(" ").filter((t) => t.length >= 3 && !GENERIC.has(t)))];
      return { c, hits: terms.filter((t) => mentions(t)).length };
    })
    .filter((x) => x.hits > 0).sort((x, y) => y.hits - x.hits || x.c.slug.localeCompare(y.c.slug)).slice(0, limit.compares)
    .map(({ c }) => ({ href: `/compare/${c.slug}`, label: `${c.title}: ${c.subtitle ?? "side by side"}`, note: String(c.verdict ?? "") }));
  return [...records, ...compares].filter((l) => !(l.href === `/${a.slug}`));
}
