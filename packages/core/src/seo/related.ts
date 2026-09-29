/**
 * Related-content selection: same cluster first, then shared tags, then topical word overlap, then recency.
 * Deterministic (ties break on date then href) so builds are reproducible. Every article should render at least
 * `min` links so no page depends on a single hub link for discovery.
 */
export interface RelatedCandidate {
  href: string; title: string; description?: string;
  /** topic cluster (category); same cluster ranks first */
  cluster?: string; tags?: string[]; date?: string; text?: string;
}
const STOP = new Set("the a an and or of to in for with vs is are how what best on your you 2026 2025 guide review".split(" "));
const words = (s = "") => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));

export function scoreRelated(cur: RelatedCandidate, c: RelatedCandidate): number {
  let s = 0;
  if (cur.cluster && c.cluster === cur.cluster) s += 10;
  const tags = new Set(cur.tags ?? []);
  s += (c.tags ?? []).filter((t) => tags.has(t)).length * 4;
  const a = words(cur.title + " " + (cur.text ?? "")), b = words(c.title + " " + (c.text ?? ""));
  const inter = [...a].filter((w) => b.has(w)).length;
  s += (inter / Math.max(1, Math.min(a.size, b.size))) * 6;
  return s;
}

export function relatedEntries(cur: RelatedCandidate, all: RelatedCandidate[], opt: { limit?: number; min?: number } = {}): RelatedCandidate[] {
  const limit = opt.limit ?? 6, min = Math.min(opt.min ?? 3, limit);
  const pool = all.filter((c) => c.href !== cur.href);
  const ranked = pool
    .map((c) => ({ c, s: scoreRelated(cur, c) }))
    .sort((x, y) => y.s - x.s || (y.c.date ?? "").localeCompare(x.c.date ?? "") || x.c.href.localeCompare(y.c.href));
  const picked = ranked.filter((r) => r.s > 0).slice(0, limit);
  if (picked.length < min) for (const r of ranked) { if (picked.length >= min) break; if (!picked.includes(r)) picked.push(r); }
  return picked.map((r) => r.c);
}

/** Pagination helper for hubs that outgrow one page (~100+ links). Page 1 lives at the hub URL; others at `${base}page/N/`. Each page self-canonicals and is linked with plain <a href>; Google ignores rel=prev/next. */
export function paginate<T>(items: T[], perPage: number, base: string) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  return Array.from({ length: pages }, (_, i) => ({
    number: i + 1, total: pages, items: items.slice(i * perPage, (i + 1) * perPage),
    path: i === 0 ? base : `${base}page/${i + 1}/`,
    prev: i === 0 ? undefined : i === 1 ? base : `${base}page/${i}/`,
    next: i + 1 < pages ? `${base}page/${i + 2}/` : undefined,
  }));
}
