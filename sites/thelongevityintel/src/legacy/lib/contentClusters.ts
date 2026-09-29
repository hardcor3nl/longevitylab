import data from "../../data/clusters.json";

export type ClusterLink = { href: string; label: string; desc: string };
export type ContentCluster = { id: string; name: string; match: string[]; slugs?: string[]; links: ClusterLink[]; [k: string]: unknown };
export const contentClusters = data.clusters as unknown as ContentCluster[];

export function matchCluster(input: { slug?: string; category?: string; tags?: string[]; title?: string }): ContentCluster | null {
  const hay = [input.slug ?? "", input.category ?? "", input.title ?? "", ...(input.tags ?? [])].join(" ").toLowerCase();
  let best: { cluster: ContentCluster; score: number } | null = null;
  for (const cluster of contentClusters) {
    let score = 0;
    if (input.slug && cluster.slugs?.includes(input.slug)) score += 10;
    for (const m of cluster.match) if (hay.includes(m.toLowerCase())) score += 2;
    if (score > 0 && (!best || score > best.score)) best = { cluster, score };
  }
  return best?.cluster ?? null;
}

export function clusterLinksFor(
  input: { slug?: string; category?: string; tags?: string[]; title?: string; path?: string },
  limit = 5,
): { cluster: ContentCluster; links: ClusterLink[] } | null {
  const cluster = matchCluster(input);
  if (!cluster) return null;
  const current = input.path ?? (input.slug && input.category ? `/${input.category}/${input.slug}` : "");
  const links = cluster.links.filter((l) => l.href !== current).slice(0, limit);
  return links.length === 0 ? null : { cluster, links };
}
