import data from "../../data/affiliates.json";

type Entry = { id: string; url: string; status: "live" | "plain" };
const entries = data as unknown as Entry[];
export const affiliateLinks: Record<string, string> = Object.fromEntries(entries.map((e) => [e.id, e.url]));
export const goPath = (slug: string) => `/go/${slug}`;
export const getAffiliateDestination = (slug: string) => affiliateLinks[slug] ?? null;
/**
 * True only for programmes marked `live` in the registry (Amazon Associates michaelregeer-20, Awin, and the named
 * Oxford Healthspan / Sunlighten referral links). Plain brand links are not sponsored and carry no affiliate label.
 */
export const isAffiliateDestination = (slug: string) => entries.find((e) => e.id === slug)?.status === "live";
