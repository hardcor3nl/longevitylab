import type { APIRoute, GetStaticPaths } from "astro";
import { cpdRecords } from "../../../lib/cpd";
import { slugify, money } from "../../../lib/cpd-stats";
import { ogPng } from "../../../lib/og";
export const getStaticPaths: GetStaticPaths = () => cpdRecords.map((rec) => ({ params: { slug: slugify(rec.compound) }, props: { rec } }));
/** Static share card per compound for forums and Markdown. Numbers as sourced; no advice. */
export const GET: APIRoute = async ({ props }) => {
  const rec = props.rec;
  const c = (rec.products as any[]).map((p) => p.costPerStudyDosePerMonth).filter((x) => x != null) as number[];
  const line = c.length ? `${money(Math.min(...c))} to ${money(Math.max(...c))} a month at the dose used in a cited study` : "price per product at the dose used in a cited study";
  const png = await ogPng(`${rec.compound}: ${line}`, "Cost per study dose, not advice", "thelongevityintel.com/cost-per-dose");
  return new Response(new Uint8Array(png), { headers: { "content-type": "image/png" } });
};
