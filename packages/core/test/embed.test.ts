import { describe, it, expect } from "vitest";
import { iframeSnippet, resizeSnippet, markdownSnippet, imageHtmlSnippet, citeApa, citePlain, citeBibtex, barChartSvg, DEFAULT_THEME, type EmbedSpec } from "../src/index.ts";

const spec: EmbedSpec = { origin: "https://example.com/", embedPath: "/embed/w/", pagePath: "/tools/w/", id: "ex-w", title: "Widget", height: 200, brand: "Example Guide", imagePath: "/embed/w.png", imageAlt: "Widget card" };

describe("embed snippets", () => {
  it("keeps the credit link outside the iframe", () => {
    const s = iframeSnippet(spec);
    expect(s.indexOf("</iframe>")).toBeLessThan(s.indexOf('<a href="https://example.com/tools/w/">Example Guide</a>'));
  });
  it("auto-resize checks the message source and loads no external script", () => {
    const s = resizeSnippet(spec);
    expect(s).toContain("e.source===f.contentWindow");
    expect(s).not.toMatch(/<script[^>]+src=/);
  });
  it("markdown and image variants link to the canonical page", () => {
    expect(markdownSnippet(spec)).toContain("](https://example.com/tools/w/)");
    expect(imageHtmlSnippet(spec)).toContain('href="https://example.com/tools/w/"');
  });
});

describe("citations", () => {
  const c = { title: "Audit & Register", author: "Example Desk", site: "Example", url: "https://example.com/x/", date: "2026-09-29" };
  it("formats APA, plain and BibTeX", () => {
    expect(citeApa(c)).toBe("Example Desk. (2026, September 29). Audit & Register [Data set]. Example. https://example.com/x/");
    expect(citePlain(c)).toContain("29 September 2026");
    expect(citeBibtex(c)).toContain("title = {Audit \\& Register}");
    expect(citeBibtex(c)).toContain("year = {2026}");
  });
});

describe("chart", () => {
  it("renders an accessible svg with the domain watermark and escapes text", () => {
    const r = barChartSvg({ title: "A <b>", items: [{ label: "x&y", value: 3 }, { label: "z", value: 6 }], domain: "example.com", theme: DEFAULT_THEME });
    expect(r.svg).toContain('role="img"');
    expect(r.svg).toContain("example.com");
    expect(r.svg).toContain("A &lt;b&gt;");
    expect(r.svg).toContain("x&amp;y");
  });
});

import { urlset } from "../src/index.ts";
describe("sitemap exclusion", () => {
  it("drops embed pages", () => {
    const x = urlset([{ loc: "https://example.com/tools/w/" }, { loc: "https://example.com/embed/w/" }]);
    expect(x).toContain("/tools/w/");
    expect(x).not.toContain("/embed/");
  });
});
