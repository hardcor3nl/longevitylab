import { heroSrcSet, heroFallback } from "../lib/heroes";
type Props = { src: string; alt: string; fill?: boolean; priority?: boolean; sizes?: string; className?: string; width?: number; height?: number; quality?: number; style?: Record<string, string | number> };
/** Static stand-in for next/image: hero ids resolve to the self-hosted, pre-resized webp set. */
export default function Image({ src, alt, fill, priority, sizes, className, width, height, quality: _q, style }: Props) {
  const set = heroSrcSet(src);
  const fillStyle = fill ? { position: "absolute" as const, inset: 0, width: "100%", height: "100%", ...style } : style;
  return (
    <img
      src={set ? heroFallback(src) : src}
      srcSet={set ?? undefined}
      sizes={set ? sizes ?? "100vw" : undefined}
      alt={alt}
      width={fill ? undefined : width ?? (set ? 960 : undefined)}
      height={fill ? undefined : height ?? (set ? 640 : undefined)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={className}
      style={fillStyle}
    />
  );
}
