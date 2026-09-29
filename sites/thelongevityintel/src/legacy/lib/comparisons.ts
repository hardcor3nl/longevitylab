import data from "../../data/comparisons.json";

export type Comparison = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  verdict: string;
  description: string;
  a: string;
  b: string;
  featured?: boolean;
  related: { href: string; label: string }[];
};
export const comparisons = data as unknown as Comparison[];
export const compareCategories = ["All", "Supplements", "Wearables", "Recovery", "Training", "Stress"] as const;
export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
