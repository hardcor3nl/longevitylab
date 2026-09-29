import data from "../../data/faqs.json";

export type FaqItem = { question: string; answer: string };
export const articleFaqs = data.articles as Record<string, FaqItem[]>;
export const compareFaqs = data.compare as Record<string, FaqItem[]>;
export const getArticleFaqs = (slug: string): FaqItem[] => articleFaqs[slug] ?? [];
export const getCompareFaqs = (slug: string): FaqItem[] => compareFaqs[slug] ?? [];
export function faqJsonLd(faqs: FaqItem[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
