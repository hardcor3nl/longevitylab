export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function parseHeadings(content: string): Heading[] {
  const lines = content.split('\n')
  const headings: Heading[] = []
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/)
    if (h2) {
      headings.push({ id: slugify(h2[1]), text: h2[1], level: 2 })
      continue
    }
    const h3 = line.match(/^###\s+(.+)$/)
    if (h3) {
      headings.push({ id: slugify(h3[1]), text: h3[1], level: 3 })
    }
  }
  return headings
}
