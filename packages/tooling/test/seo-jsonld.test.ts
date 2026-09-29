import { expect, it } from "vitest";
import { article, breadcrumbList, dataset, faqPage, itemList, organization, webSite } from "../../core/src/jsonld.ts";
import { validateNode } from "../src/seo/jsonld-check.ts";

const org = { name: "T editorial", url: "https://t.com/", logo: "https://t.com/logo.png", sameAs: ["https://x.com/t"] };
const ctx = { text: "what is x? x is a thing that does stuff in the page body", origin: "https://t.com" };
const art = { title: "T", description: "d", url: "https://t.com/a/", published: "2026-01-01", updated: "2026-02-01", image: "https://t.com/og/a.png", evidence: "research" as const };

it("well-formed nodes validate clean", () => {
  for (const n of [organization(org), webSite(org), article(art, org), article(art, org, "BlogPosting"),
    breadcrumbList([{ name: "Home", url: "https://t.com/" }, { name: "A", url: "https://t.com/a/" }]),
    itemList([{ name: "A", url: "https://t.com/a/" }], "L"),
    dataset({ name: "D", description: "x".repeat(60), url: "https://t.com/d/", license: "https://creativecommons.org/licenses/by/4.0/", dateModified: "2026-02-01", distribution: [{ contentUrl: "https://t.com/d.csv", encodingFormat: "text/csv" }] }, org)])
    expect(validateNode(n, ctx)).toEqual([]);
});
it("article without image, with Person author and bad dates fails", () => {
  const bad: any = { ...article({ ...art, image: undefined }, org), author: { "@type": "Person", name: "A" }, dateModified: "2025-01-01" };
  const e = validateNode(bad, ctx).join("|");
  expect(e).toMatch(/missing image/); expect(e).toMatch(/author must be an Organization/); expect(e).toMatch(/dateModified earlier/);
});
it("FAQPage only valid when the FAQ is visible", () => {
  expect(validateNode(faqPage([{ question: "What is x?", answer: "x is a thing that does stuff" }]), ctx)).toEqual([]);
  expect(validateNode(faqPage([{ question: "Hidden question?", answer: "nowhere on page" }]), ctx).length).toBeGreaterThan(0);
});
it("dataset needs license, distribution and long enough description", () => {
  const e = validateNode({ "@context": "https://schema.org", "@type": "Dataset", name: "D", description: "short" }, ctx).join("|");
  expect(e).toMatch(/missing license/); expect(e).toMatch(/missing distribution/); expect(e).toMatch(/50-5000/);
});
it("organization without logo or sameAs is flagged; breadcrumb positions checked", () => {
  expect(validateNode(organization({ name: "T", url: "https://t.com/" }), ctx).join("|")).toMatch(/logo/);
  const b: any = breadcrumbList([{ name: "H", url: "https://t.com/" }, { name: "A", url: "https://t.com/a/" }]);
  b.itemListElement[1].position = 5;
  expect(validateNode(b, ctx).join("|")).toMatch(/position/);
});
