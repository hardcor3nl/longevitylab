import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { collectionSchema } from "@portfolio/schema";

const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  price: z.string(),
  badge: z.string().optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  affiliateUrl: z.string(),
});
// The shared schema plus the article fields the old site's templates use (verdict, products, hero image, tags).
const article = collectionSchema.extend({
  verdict: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  products: z.array(productSchema).default([]),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  legacyDate: z.any().optional(),
});
const entries = (base: string) => defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${base}` }), schema: article });

export const collections = {
  supplements: entries("supplements"),
  wearables: entries("wearables"),
  recovery: entries("recovery"),
  diagnostics: entries("diagnostics"),
  protocols: entries("protocols"),
  best: entries("best"),
};
