import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'out')
const contentDir = path.join(root, 'content')
const docsDir = path.join(root, 'docs', 'seo-recovery')

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  const result = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...walk(full))
    else result.push(full)
  }
  return result
}

function htmlForRoute(route) {
  const clean = route.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '')
  const candidates = clean
    ? [path.join(outDir, clean, 'index.html'), path.join(outDir, clean + '.html')]
    : [path.join(outDir, 'index.html')]
  return candidates.find(candidate => fs.existsSync(candidate)) || null
}

function count(html, pattern) {
  return (html.match(pattern) || []).length
}

const failures = []
const warnings = []
const brokenInternalLinks = new Set()
const sitemapPath = path.join(outDir, 'sitemap.xml')
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : ''
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
const uniqueUrls = [...new Set(urls)]

if (!sitemap) failures.push('Missing out/sitemap.xml')
if (urls.length !== uniqueUrls.length) failures.push('Sitemap contains duplicate URLs')

const inventory = ['route,status,title,description,canonical,h1,wordCount,source']
for (const url of uniqueUrls) {
  const file = htmlForRoute(url)
  const route = new URL(url).pathname || '/'
  if (!file) {
    failures.push(route + ': missing exported HTML')
    inventory.push(JSON.stringify(route) + ',missing,,,,,,')
    continue
  }

  const html = fs.readFileSync(file, 'utf8')
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim()
  const description = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] || '').trim()
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/gi)].map(match => match[1])
  const h1 = count(html, /<h1(?:\s|>)/gi)
  const wordCount = (html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').match(/\b[\wâ€™'-]+\b/g) || []).length
  const problems = []
  if (!title) problems.push('missing title')
  if (!description) problems.push('missing description')
  if (canonicals.length !== 1) problems.push('canonical count ' + canonicals.length)
  if (h1 !== 1) problems.push('H1 count ' + h1)
  if (wordCount < 50) problems.push('word count ' + wordCount)
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) problems.push('noindex on sitemap URL')
  if (/[Ã]|â(?:€|†|œ)|�/.test(html)) problems.push('possible text encoding corruption')

  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const href = match[1]
    if (/^(?:mailto:|tel:|javascript:|data:|#)/i.test(href)) continue
    let target
    try {
      target = new URL(href, url)
    } catch {
      continue
    }
    if (target.origin !== new URL(url).origin) continue
    if (/^\/(?:_next|api)\//.test(target.pathname)) continue
    if (/\.[a-z0-9]{2,5}$/i.test(target.pathname)) continue
    if (!htmlForRoute(target.origin + target.pathname)) {
      brokenInternalLinks.add(route + ' -> ' + target.pathname)
    }
  }
  if (problems.length) failures.push(route + ': ' + problems.join('; '))
  inventory.push([
    JSON.stringify(route),
    '200',
    JSON.stringify(title.replaceAll('"', '""')),
    JSON.stringify(description.replaceAll('"', '""')),
    JSON.stringify(canonicals[0] || ''),
    h1,
    wordCount,
    JSON.stringify(path.relative(root, file)),
  ].join(','))
}

for (const pair of brokenInternalLinks) failures.push('broken internal link: ' + pair)

const claimPatterns = [
  /\b(?:we|our|i)\s+(?:tested|test|wore|purchased|bought|used|measured)\b/i,
  /\b(?:lab[- ]grade|laboratory|ECG|clinical[- ]grade)\b/i,
  /\b(?:physician|doctor|MD|PhD|board[- ]certified|medical reviewer)\b/i,
  /\b\d[\d,]*\+?\s+(?:studies|participants|patients|devices|months|years)\b/i,
]
const claimRows = ['file,signals']
for (const file of walk(contentDir).filter(file => /\.(md|mdx)$/i.test(file))) {
  const source = fs.readFileSync(file, 'utf8')
  const signals = claimPatterns.flatMap((pattern, index) => pattern.test(source) ? [String(index + 1)] : [])
  if (signals.length) {
    const relative = path.relative(root, file).replaceAll('\\', '/')
    claimRows.push(JSON.stringify(relative) + ',' + JSON.stringify(signals.join('|')))
    warnings.push(relative + ': claim signals ' + signals.join('|') + ' require evidence/credential verification')
  }
}

fs.mkdirSync(docsDir, { recursive: true })
fs.writeFileSync(path.join(docsDir, 'url-inventory.csv'), inventory.join('\n') + '\n')
fs.writeFileSync(path.join(docsDir, 'claims-audit.csv'), claimRows.join('\n') + '\n')

const report = [
  '# Longevity Intel SEO recovery validation',
  '',
  '- Exported sitemap URLs checked: ' + uniqueUrls.length,
  '- Technical failures: ' + failures.length,
  '- Evidence/credential warnings: ' + warnings.length,
  '',
  '## Technical failures',
  '',
  ...(failures.length ? failures.map(item => '- ' + item) : ['- None']),
  '',
  '## Evidence and credential warnings',
  '',
  ...(warnings.length ? warnings.slice(0, 200).map(item => '- ' + item) : ['- None']),
  '',
  'Warnings are deployment gates for YMYL/review pages until the underlying evidence, credentials, dates, and testing disclosures are verified.',
  '',
].join('\n')
fs.writeFileSync(path.join(docsDir, 'validation-report.md'), report)

console.log('Sitemap URLs checked: ' + uniqueUrls.length)
console.log('Technical failures: ' + failures.length)
console.log('Evidence/credential warnings: ' + warnings.length)
if (failures.length) process.exitCode = 1


