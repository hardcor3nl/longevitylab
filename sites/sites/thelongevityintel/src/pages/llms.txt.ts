import type { APIRoute } from "astro";
import { llmsTxt } from "@portfolio/core";
import { getAllArticles, articleUrl, CATEGORIES, CATEGORY_LABEL } from "../lib/content";
import site from "../../site.config.json";

/** Generated from content: every indexable article, grouped by section, with its description. */
export const GET: APIRoute = async () => {
  const all = await getAllArticles();
  const u = (p: string) => new URL(p, site.origin).toString();
  const title = (a: (typeof all)[number]) => a.data.h1 ?? a.data.title;
  return new Response(llmsTxt({
    name: site.name,
    summary: "Evidence summaries for longevity products and protocols: what the human studies show, what a product contains, and what it costs. Health information for general reading, not medical advice.",
    details: "Pages are researched from published studies and manufacturer specifications; nothing is tested in-house. Evidence grades (Strong, Moderate, Emerging, Weak) come with a printed rubric and are not numeric scores. Talk to a doctor before acting on any of it.",
    sections: [
      { title: "Data", items: [{ title: "Evidence database", url: u("/database"), description: "Evidence grade and rubric for each product and compound" }] },
      ...CATEGORIES.map((c) => ({
        title: CATEGORY_LABEL[c],
        items: all.filter((a) => a.category === c).sort((x, y) => title(x).localeCompare(title(y))).map((a) => ({ title: title(a), url: u(articleUrl(a)), description: a.data.description })),
      })),
      { title: "About", items: [{ title: "About and editorial policy", url: u("/about") }, { title: "Corrections and contact", url: u("/contact") }] },
    ],
  }), { headers: { "content-type": "text/plain; charset=utf-8" } });
};
