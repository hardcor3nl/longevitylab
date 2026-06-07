import { ReactNode } from 'react'

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractText((children as { props: { children: ReactNode } }).props.children)
  }
  return ''
}

export const mdxComponents = {
  h2: ({ children }: { children?: ReactNode }) => {
    const text = extractText(children)
    const id = slugify(text)
    return (
      <h2 id={id} className="scroll-mt-24 group">
        {children}
        <a href={`#${id}`} aria-hidden className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity text-muted text-sm">#</a>
      </h2>
    )
  },
  h3: ({ children }: { children?: ReactNode }) => {
    const text = extractText(children)
    const id = slugify(text)
    return (
      <h3 id={id} className="scroll-mt-24 group">
        {children}
        <a href={`#${id}`} aria-hidden className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity text-muted text-xs">#</a>
      </h3>
    )
  },
}
