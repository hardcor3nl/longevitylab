import type { APIRoute, GetStaticPaths } from "astro";
import { charts, type ChartKey } from "../../lib/cpd-stats";
export const getStaticPaths: GetStaticPaths = () => (Object.keys(charts) as ChartKey[]).map((name) => ({ params: { name }, props: { name } }));
/** Standalone SVG file of each chart, so the "Use this chart" snippet can point at an image. */
export const GET: APIRoute = ({ props }) => new Response(charts[props.name as ChartKey].svg, { headers: { "content-type": "image/svg+xml" } });
