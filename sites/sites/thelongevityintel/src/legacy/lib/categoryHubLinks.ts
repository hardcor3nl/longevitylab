import data from "../../data/clusters.json";

/** Related tools / hubs shown at the bottom of category listing pages. */
export const categoryHubLinks = data.hubs as Record<string, { title: string; links: { href: string; label: string; desc: string }[] }>;
