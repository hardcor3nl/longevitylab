import type { APIRoute, GetStaticPaths } from "astro";
import { getAllArticles, CATEGORY_LABEL } from "../../lib/content";
import { ogPng } from "../../lib/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const rows = [
    { slug: "default", title: "What the studies show about longevity products, and what they cost", eyebrow: "Evidence summaries" },
    ...(await getAllArticles()).map((a) => ({ slug: `${a.category}/${a.slug}`, title: a.data.h1 ?? a.data.title, eyebrow: CATEGORY_LABEL[a.category] })),
  ];
  return rows.map((r) => ({ params: { slug: r.slug }, props: r }));
};
export const GET: APIRoute = async ({ props }) => new Response(await ogPng(props.title, props.eyebrow), { headers: { "content-type": "image/png" } });
