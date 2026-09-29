import type { AnchorHTMLAttributes, ReactNode } from "react";
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string | { pathname?: string }; prefetch?: boolean; scroll?: boolean; replace?: boolean; children?: ReactNode };
/** Static stand-in for next/link: a plain anchor, slashless internal hrefs. */
export default function Link({ href, prefetch: _p, scroll: _s, replace: _r, ...rest }: Props) {
  const h = typeof href === "string" ? href : href.pathname ?? "/";
  return <a href={h} {...rest} />;
}
