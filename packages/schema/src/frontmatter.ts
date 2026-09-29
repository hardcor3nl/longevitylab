import { z } from "zod";

const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/, "must be a real ISO date (YYYY-MM-DD)"),
);

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  checked: isoDate,
  /** true when `checked` is derived from a month string in the old site, not a real re-check date */
  approx: z.boolean().optional(),
});

export const updateLogEntry = z.object({ date: isoDate, change: z.string().min(1) });

export const evidenceLevels = ["research", "compiled-data", "owner-tested"] as const;

const shape = (strict: boolean) => ({
  title: z.string().min(1),
  description: z.string().min(1),
  /** migrated page whose live <title>/description are kept verbatim for ranking continuity: length limits waived */
  keepLiveMeta: z.boolean().optional(),
  /** banned phrases that are legitimate topic words on this page (e.g. "unlock time" for a game); listed explicitly */
  allowPhrases: z.array(z.string()).optional(),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  targetQuery: z.string().min(1),
  published: isoDate,
  updated: isoDate.optional(),
  reviewEvery: z.string().regex(/^\d+d$/, "use e.g. 90d").optional(),
  author: z.string().min(1),
  evidence: z.enum(evidenceLevels),
  sources: z.array(sourceSchema).default([]),
  ownerEvidence: z.array(z.string()).optional(),
  affiliates: z.array(z.string()).default([]),
  updateLog: z.array(updateLogEntry).default([]),
  noindex: z.boolean().default(false),
  // migration bookkeeping, not part of the binding spec
  publishedApprox: z.boolean().optional(),
  needsSources: z.boolean().optional(),
  rubric: z.boolean().optional(),
  /** on-page H1 when it differs from the <title> */
  h1: z.string().optional(),
  category: z.string().optional(),
  relatedTools: z.array(z.string()).default([]),
  /** dataset tool name whose sourced plan table the layout renders (AIHunterLabs pricing tracker) */
  pricingTool: z.string().optional(),
  toolA: z.string().optional(),
  toolB: z.string().optional(),
  cover: z.string().optional(),
  articleType: z.string().optional(),
  readingTime: z.number().optional(),
  toolTags: z.string().optional(),
  legacyDate: z.string().optional(),
  /** canonical path when the entry's URL is not <collection base>/<slug>/ (e.g. nested destination pages) */
  route: z.string().regex(/^\//).optional(),
  /** hero image reference: file under src/assets, alt text, credit */
  hero: z.object({ file: z.string(), alt: z.string(), credit: z.string().optional(), creditUrl: z.string().optional() }).optional(),
});

/** Frontmatter for every content entry (FOUNDATION_SPEC "Content model"). Lint and `pnpm check:content` use this. */
export const frontmatterSchema = z.object(shape(true)).superRefine((v, ctx) => {
  if (v.keepLiveMeta) return;
  if (v.title.length > 60) ctx.addIssue({ code: "custom", path: ["title"], message: "title over 60 chars" });
  if (v.description.length > 155) ctx.addIssue({ code: "custom", path: ["description"], message: "description over 155 chars" });
});
/** Same shape without length limits: for Astro collections, so length problems surface in check:content, not as a build crash. */
export const collectionSchema = z.object(shape(false));

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Source = z.infer<typeof sourceSchema>;

/** Data-file entries (tools, prompts) use a lighter shape. */
export const affiliateSchema = z.object({
  id: z.string(),
  programme: z.string(),
  network: z.string(),
  url: z.url(),
  status: z.enum(["live", "pending", "none"]),
});
export type Affiliate = z.infer<typeof affiliateSchema>;
