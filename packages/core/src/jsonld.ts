/** JSON-LD builders. No Person (owner decision); Review/Rating only for owner-tested pages with a visible rubric. */
export interface OrgInfo {
  name: string; url: string; logo?: string; sameAs?: string[]; description?: string;
  /** trust layer (Job T): absolute URLs of the methodology and corrections pages, the contact page and email */
  publishingPrinciples?: string; correctionsPolicy?: string; contactUrl?: string; email?: string; foundingDate?: string;
}
export interface ArticleInfo {
  title: string; description: string; url: string; published: string; updated?: string;
  /** absolute URL(s) of the page's primary image (1200x630 OG image is fine) */
  image?: string | string[]; evidence: "research" | "compiled-data" | "owner-tested"; rubric?: boolean;
}

export const organization = (o: OrgInfo) => ({
  "@context": "https://schema.org", "@type": "Organization", name: o.name, url: o.url,
  ...(o.logo ? { logo: { "@type": "ImageObject", url: o.logo } } : {}),
  ...(o.sameAs?.length ? { sameAs: o.sameAs } : {}),
  ...(o.description ? { description: o.description } : {}),
  ...(o.foundingDate ? { foundingDate: o.foundingDate } : {}),
  ...(o.publishingPrinciples ? { publishingPrinciples: o.publishingPrinciples } : {}),
  ...(o.correctionsPolicy ? { correctionsPolicy: o.correctionsPolicy } : {}),
  ...(o.contactUrl || o.email ? { contactPoint: { "@type": "ContactPoint", contactType: "editorial", ...(o.email ? { email: o.email } : {}), ...(o.contactUrl ? { url: o.contactUrl } : {}) } } : {}),
});

export const webSite = (o: OrgInfo) => ({
  "@context": "https://schema.org", "@type": "WebSite", name: o.name, url: o.url,
  publisher: { "@type": "Organization", name: o.name, url: o.url },
});

/** Article / BlogPosting. Author and publisher are always the Organization (no Person). Google: no required props; headline, image, datePublished, dateModified, author recommended. */
export const article = (a: ArticleInfo, org: OrgInfo, type: "Article" | "BlogPosting" | "NewsArticle" = "Article") => ({
  "@context": "https://schema.org", "@type": type, headline: a.title.slice(0, 110), description: a.description,
  mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
  datePublished: a.published, dateModified: a.updated ?? a.published,
  ...(a.image ? { image: Array.isArray(a.image) ? a.image : [a.image] } : {}),
  author: { "@type": "Organization", name: org.name, url: org.url },
  publisher: { "@type": "Organization", name: org.name, url: org.url, ...(org.logo ? { logo: { "@type": "ImageObject", url: org.logo } } : {}) },
});

/** ItemList for hubs and roundups: items must be visible on the page as links. */
export const itemList = (items: { name: string; url: string }[], name?: string) => ({
  "@context": "https://schema.org", "@type": "ItemList", ...(name ? { name } : {}), numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: it.url })),
});

export interface DatasetInfo {
  name: string; description: string; url: string; license: string; dateModified: string; datePublished?: string;
  keywords?: string[]; distribution: { contentUrl: string; encodingFormat: string }[];
  temporalCoverage?: string; variableMeasured?: string[]; isAccessibleForFree?: boolean;
}
/** Dataset for link-earning data pages. Google requires name + description (50-5000 chars); license, creator, distribution recommended. */
export const dataset = (d: DatasetInfo, org: OrgInfo) => ({
  "@context": "https://schema.org", "@type": "Dataset", name: d.name, description: d.description, url: d.url,
  license: d.license, dateModified: d.dateModified, ...(d.datePublished ? { datePublished: d.datePublished } : {}),
  creator: { "@type": "Organization", name: org.name, url: org.url },
  publisher: { "@type": "Organization", name: org.name, url: org.url },
  isAccessibleForFree: d.isAccessibleForFree ?? true,
  ...(d.keywords ? { keywords: d.keywords } : {}),
  ...(d.temporalCoverage ? { temporalCoverage: d.temporalCoverage } : {}),
  ...(d.variableMeasured ? { variableMeasured: d.variableMeasured } : {}),
  distribution: d.distribution.map((x) => ({ "@type": "DataDownload", contentUrl: x.contentUrl, encodingFormat: x.encodingFormat })),
});

export const breadcrumbList = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
});
/** Breadcrumb helper: visible crumbs ({name, href?}) to absolute-URL items. The last crumb takes `currentUrl`. */
export const breadcrumbsFromCrumbs = (crumbs: { name: string; href?: string }[], site: string | URL, currentUrl: string) =>
  breadcrumbList(crumbs.map((c, i) => ({ name: c.name, url: i === crumbs.length - 1 || !c.href ? currentUrl : new URL(c.href, site).toString() })));

/** Only call with a FAQ that is visibly rendered on the page. */
export const faqPage = (qa: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: qa.map((x) => ({ "@type": "Question", name: x.question, acceptedAnswer: { "@type": "Answer", text: x.answer } })),
});

export const videoGame = (v: { name: string; url: string; description?: string }) => ({
  "@context": "https://schema.org", "@type": "VideoGame", ...v,
});

/** Review markup gate: owner-tested evidence AND a visible rubric, otherwise returns null. */
export function review(
  a: ArticleInfo, subject: { name: string; type?: string }, org: OrgInfo,
  rating: { value: number; best?: number },
) {
  if (a.evidence !== "owner-tested" || !a.rubric) return null;
  return {
    "@context": "https://schema.org", "@type": "Review", name: a.title, datePublished: a.published,
    itemReviewed: { "@type": subject.type ?? "SoftwareApplication", name: subject.name },
    author: { "@type": "Organization", name: org.name },
    reviewRating: { "@type": "Rating", ratingValue: rating.value, bestRating: rating.best ?? 5 },
  };
}

export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
