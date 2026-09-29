/**
 * VPNInfobase content export.
 * usage: node --experimental-strip-types src/migrate/vpn.ts --repo <old app/frontend> --site <sites/vpninfobase> --data <data/vpninfobase/vpn-audit-register>
 * Emits blog + review MDX, src/data/{register,gaps,affiliates}.json, content-ledger.csv, public/_redirects.
 * Blog body text is the old strings (mechanical link normalisation only). Reviews are built on the audit register.
 */
import { withTwins } from "../redirect-twins.ts";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { csvCell } from "../util.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "C:/Users/michael/Projects/Websites/vpninfobase/app/frontend");
const site = opt("--site", "sites/vpninfobase");
const dataDir = opt("--data", "data/vpninfobase/vpn-audit-register");
const EDITORIAL = "VPNInfobase editorial";
const TODAY = "2026-09-29";

const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
function firstSeen(needle: string, file: string): { date: string; approx: boolean } {
  const out = git(["log", "-S" + needle, "--format=%aI", "--reverse", "--", file]).split("\n").filter(Boolean);
  if (out.length) return { date: out[0].slice(0, 10), approx: false };
  const add = git(["log", "--diff-filter=A", "--format=%aI", "--", file]).split("\n").filter(Boolean).at(-1);
  return { date: (add ?? "2026-05-01").slice(0, 10), approx: true };
}

async function loadOld() {
  const r = (p: string) => JSON.stringify(join(repo, p));
  const out = await build({
    stdin: {
      contents: `export { vpnDatabase, blogArticles } from ${r("src/lib/vpnDatabase.ts")};
      export { blogContentMap } from ${r("src/lib/blogContent.ts")};
      export { reviewDeepCopy } from ${r("src/lib/reviewContent.ts")};`,
      resolveDir: repo, loader: "ts",
    },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  });
  const dir = mkdtempSync(join(tmpdir(), "vpn-old-"));
  const file = join(dir, "old.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return (await import(pathToFileURL(file).href)) as any;
}

const esc = (s: string) =>
  s.split(/(`[^`\n]*`)/).map((p, i) => (i % 2 ? p : p.replace(/([{}])/g, "\\$1").replace(/<(?=[a-zA-Z/!])/g, "\\<"))).join("");
const words = (s: string) => s.replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;
const fm = (o: Record<string, unknown>) =>
  YAML.stringify(o, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date): (\d{4}-\d\d-\d\d\S*)$/gm, '$1$2: "$3"');

/** live review slug for a register slug */
const LIVE_SLUG: Record<string, string> = { "proton-vpn": "protonvpn", pia: "private-internet-access", "hide-me": "hideme", "trust-zone": "trustzone" };
const NAME_TO_SLUG: Record<string, string> = { NordVPN: "nordvpn", ExpressVPN: "expressvpn", Surfshark: "surfshark", Mullvad: "mullvad", ProtonVPN: "protonvpn", "ProtonVPN Free": "protonvpn-free" };

function cleanTitle(t: string): string {
  let s = t.replace(/\s*\(?\b20\d\d\b\)?/g, "").replace(/\s+/g, " ").trim().replace(/\s+in$/i, "");
  if (s.length > 60) s = s.split(/[:—(]/)[0].trim();
  if (s.length > 60) s = s.slice(0, 60).replace(/\s+\S*$/, "");
  return s;
}
function cleanDesc(d: string): string {
  let s = d.replace(/^Tested:\s*which/i, "Which").replace(/\b20\d\d\b/g, "").replace(/\s{2,}/g, " ").trim();
  if (s.length > 155) s = s.slice(0, 154).replace(/\s+\S*$/, "") + ".";
  return s;
}

async function main() {
  const old = await loadOld();
  const register: any[] = JSON.parse(readFileSync(join(dataDir, "vpn-audit-register.json"), "utf8"));
  for (const c of ["blog", "reviews"]) { rmSync(join(site, "src/content", c), { recursive: true, force: true }); mkdirSync(join(site, "src/content", c), { recursive: true }); }
  const ledger: string[][] = [];

  // ---- gaps per provider (from the dataset's own GAPS parts)
  const gaps: Record<string, string[]> = {};
  for (const f of readdirSync(join(dataDir, "parts")).filter((x) => /^gaps-group/.test(x))) {
    let cur = "";
    for (const line of readFileSync(join(dataDir, "parts", f), "utf8").split("\n")) {
      const h = /^##\s+(\S+)\s*$/.exec(line);
      if (h) { cur = h[1]; gaps[cur] = []; continue; }
      const b = /^-\s+(.*)$/.exec(line);
      if (b && cur) gaps[cur].push(b[1]);
    }
  }
  writeFileSync(join(site, "src/data/gaps.json"), JSON.stringify(gaps, null, 2) + "\n");
  const reg = register.map((r) => ({ ...r, liveSlug: LIVE_SLUG[r.slug] ?? r.slug }));
  writeFileSync(join(site, "src/data/register.json"), JSON.stringify(reg, null, 2) + "\n");
  for (const f of ["METHOD.md", "CHANGELOG.md", "GAPS.md"]) copyFileSync(join(dataDir, f), join(site, "src/data", f));
  mkdirSync(join(site, "public/data"), { recursive: true });
  copyFileSync(join(dataDir, "vpn-audit-register.json"), join(site, "public/data/vpn-audit-register.json"));

  // ---- providers (brand colour/initials from the old database; name only otherwise)
  const provRows = old.vpnDatabase.map((v: any) => ({ slug: v.slug, name: v.name, color: v.color, initials: v.initials }));
  for (const [slug, name, initials] of [["protonvpn-free", "Proton VPN Free", "P"], ["tor-browser", "Tor Browser", "T"], ["vpnarea", "VPNArea", "V"]])
    if (!provRows.find((x: any) => x.slug === slug)) provRows.push({ slug, name, color: "#64748B", initials });
  writeFileSync(join(site, "src/data/providers.json"), JSON.stringify(provRows, null, 2) + "\n");

  // ---- reviews: 25 live URLs
  const REVIEW_SLUGS = ["nordvpn","expressvpn","surfshark","protonvpn","private-internet-access","cyberghost","ipvanish","mullvad","windscribe","ivpn","tunnelbear","vyprvpn","hideme","hotspot-shield","atlas-vpn","privatevpn","strongvpn","trustzone","airvpn","zenmate","vpnarea","astrill","purevpn","protonvpn-free","tor-browser"];
  const liveToReg = (s: string) => reg.find((r) => r.liveSlug === s);
  const nameOf = (s: string) => liveToReg(s)?.name ?? old.vpnDatabase.find((v: any) => v.slug === s)?.name ?? ({ vpnarea: "VPNArea", "protonvpn-free": "Proton VPN Free", "tor-browser": "Tor Browser" } as any)[s] ?? s;
  for (const slug of REVIEW_SLUGS) {
    const r = liveToReg(slug);
    const name = nameOf(slug);
    const deep = old.reviewDeepCopy[slug];
    const seen = firstSeen(`slug: "${slug}"`, "src/lib/vpnDatabase.ts");
    const body: string[] = [];
    if (deep) {
      body.push("## Who it suits\n\n" + deep.bestFor.map((x: string) => `- ${esc(x)}`).join("\n"));
      body.push("## Who should look elsewhere\n\n" + deep.notFor.map((x: string) => `- ${esc(x)}`).join("\n"));
      body.push("*These two lists are the editorial reading of the register facts on this page, not measured results.*");
      body.push("## Alternatives\n\n" + deep.alternatives.map((a: any) => `- [${nameOf(a.slug)}](/reviews/${a.slug}/): ${esc(a.reason)}`).join("\n"));
    }
    let sources: any[] = [];
    let checked = "2026-09-28";
    if (r) {
      sources = r.sources.map((u: string) => ({ title: u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), url: u, checked: r.checked }));
      checked = r.checked;
    } else if (slug === "tor-browser") {
      sources = ["https://www.torproject.org/about/history/", "https://www.torproject.org/about/financials/", "https://www.torproject.org/about/sponsors/"].map((u) => ({ title: u.replace(/^https:\/\/www\./, ""), url: u, checked: "2026-09-28" }));
    }
    const tq = ({ "protonvpn-free": "proton vpn free", "tor-browser": "tor browser vs vpn", vpnarea: "vpnarea review" } as any)[slug] ?? `${name.toLowerCase()} review`;
    const front: Record<string, unknown> = {
      title: `${name}: owner, audits and real prices`.slice(0, 60),
      description: `Who owns ${name}, where it is based, which independent audits it has, past incidents and price per month by billed term. Checked ${checked}.`.slice(0, 155),
      slug, targetQuery: tq, published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}),
      updated: checked, reviewEvery: "90d", author: EDITORIAL, evidence: "compiled-data", sources,
      affiliates: slug === "nordvpn" ? ["nordvpn"] : [], category: "vpn-review", relatedTools: [],
      updateLog: r ? [{ date: checked, change: "Page rebuilt on the VPN audit register; facts re-checked against the vendor's own pages and auditors' reports on this date." }] : [],
      h1: `${name} review`,
    };
    writeFileSync(join(site, "src/content/reviews", `${slug}.mdx`), `---\n${fm(front)}---\n\n${body.join("\n\n")}${body.length ? "\n" : ""}`);
    ledger.push([`/reviews/${slug}/`, "keep", tq, r ? "rebuilt on the audit register" : "no register record; page states what is and is not verified", "", TODAY, "proposed", String(words(body.join(" "))), "false", "review", "", seen.date, "derived"]);
  }

  // ---- blog: 41 posts
  const keep = new Set(["best-vpn-beginners", "wireguard-vs-openvpn", "what-is-a-vpn"]);
  const blogSlugs = Object.keys(old.blogContentMap);
  const prune: string[] = [];
  for (const slug of blogSlugs) {
    const a = old.blogContentMap[slug];
    const meta = old.blogArticles.find((x: any) => x.slug === slug);
    const body: string[] = [];
    for (const s of a.sections) {
      if (s.type === "intro" || s.type === "text") body.push(esc(s.content));
      else if (s.type === "h2") body.push(`## ${esc(s.title).replace(/What you can unlock/, "What you can access")}`);
      else if (s.type === "proscons") body.push(`**Pros**\n\n${s.pros.map((x: string) => `- ${esc(x)}`).join("\n")}\n\n**Cons**\n\n${s.cons.map((x: string) => `- ${esc(x)}`).join("\n")}`);
      else if (s.type === "cta") {
        const rs = NAME_TO_SLUG[s.vpnName];
        // Old CTA carried an unsourced price and blurb; the review page now holds the sourced figures.
        body.push(rs ? `See the sourced facts for ${s.vpnName} in the [${s.vpnName} review](/reviews/${rs}/).` : "");
      } else if (s.type === "faq") {
        body.push("## Common questions\n\n" + s.faqItems.map((f: any) => `### ${esc(f.q)}\n\n${esc(f.a)}`).join("\n\n"));
      }
    }
    const md = body.filter(Boolean).join("\n\n") + "\n";
    const seen = firstSeen(`slug: "${slug}"`, "src/lib/blogContent.ts");
    const wc = words(md);
    const tq = cleanTitle(a.title).split(" — ")[0].toLowerCase().replace(/[?:]|\bcomplete beginner's guide\b|\bexplained simply\b/g, "").replace(/\s+/g, " ").trim();
    const front: Record<string, unknown> = {
      title: cleanTitle(a.title), description: cleanDesc(meta?.excerpt ?? a.title), slug, targetQuery: tq,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}), author: EDITORIAL, evidence: "research",
      sources: [], category: a.category, relatedTools: [], needsSources: true, h1: a.title.replace(/\s*\(?\b20\d\d\b\)?/g, "").trim(),
    };
    writeFileSync(join(site, "src/content/blog", `${slug}.mdx`), `---\n${fm(front)}---\n\n${md}`);
    const proposed = !keep.has(slug) && wc < 500;
    if (proposed) prune.push(`${slug} (${wc} words)`);
    ledger.push([`/blog/${slug}/`, "keep", tq, proposed ? "keep for now (no GSC pages file); brief proposes prune: under 500 words" : "keep", "", TODAY, "proposed", String(wc), "true", "blog", meta?.date ?? "", seen.date, "derived"]);
  }
  writeFileSync(join(site, "prune-candidates.txt"), prune.join("\n") + "\n");

  // ---- static pages + compares (built by hand)
  const statics: [string, string][] = [["/", "home"], ["/reviews/", "hub"], ["/blog/", "hub"], ["/compare/", "hub"], ["/deals/", "becomes prices by billed term"], ["/about/", "rewrite"], ["/contact/", "keep"], ["/privacy/", "keep"], ["/affiliate-disclosure/", "keep"], ["/vpn-audit-register/", "NEW: register page (link-earning asset)"]];
  for (const [u, why] of statics) ledger.push([u, "keep", "", why, "", TODAY, "proposed", "", "", "static", "", "", ""]);
  for (const c of ["nordvpn-vs-expressvpn", "nordvpn-vs-surfshark", "expressvpn-vs-surfshark", "protonvpn-vs-nordvpn"]) ledger.push([`/compare/${c}/`, "keep", c.replace(/-vs-/, " vs "), "rebuilt from register facts", "", TODAY, "proposed", "", "", "compare", "", "", "derived"]);

  // ---- redirects: keep the 30 live 301s verbatim
  const oldRedirects = readFileSync(join(repo, "public/_redirects"), "utf8").split(/\r?\n/).filter((l) => /^\/.*\s301$/.test(l));
  writeFileSync(join(site, "public/_redirects"), withTwins("# old flat sitemap URL (submitted in Search Console)\n/sitemap.xml /sitemap-index.xml 301\n\n# 301s carried over from the old site (each source in both slash forms)\n" + oldRedirects.join("\n") + "\n"));
  for (const l of oldRedirects.filter((x) => x.split(/\s+/)[0].endsWith("/"))) {
    const [from, to] = l.split(/\s+/);
    ledger.push([from, "redirect", "", "301 carried over from the old site", to, TODAY, "approved", "", "", "redirect", "", "", ""]);
  }

  // ---- affiliates
  writeFileSync(join(site, "src/data/affiliates.json"), JSON.stringify([
    { id: "nordvpn", programme: "NordVPN affiliate programme", network: "direct (Nord go domain)", url: "https://go.nordvpn.net/SHBLC", status: "live" },
  ], null, 2) + "\n");

  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_last_updated", "published", "target_query_source"];
  writeFileSync(join(site, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  console.log(JSON.stringify({ reviews: REVIEW_SLUGS.length, blog: blogSlugs.length, ledger: ledger.length, pruneCandidates: prune.length }));
}
main();
