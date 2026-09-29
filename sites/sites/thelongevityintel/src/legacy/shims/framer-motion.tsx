/**
 * Static stand-in for framer-motion. Every `motion.x` renders the plain element with the animation props removed, so
 * server output is fully visible with no JS (the old site shipped content at opacity 0 until hydration). Entrance
 * reveals are done in CSS (`.reveal`, see global.css) by the layout's tiny observer.
 */
import { createElement, forwardRef, Fragment, type ReactNode } from "react";
const STRIP = new Set(["initial", "animate", "exit", "transition", "variants", "whileHover", "whileTap", "whileInView", "whileFocus", "viewport", "layout", "layoutId", "drag", "dragConstraints", "onAnimationComplete", "custom", "style_motion"]);
const cache = new Map<string, any>();
function make(tag: string) {
  if (!cache.has(tag)) {
    cache.set(tag, forwardRef<any, any>(({ style, ...props }, ref) => {
      const clean: Record<string, unknown> = {};
      for (const k of Object.keys(props)) if (!STRIP.has(k)) clean[k] = props[k];
      // MotionValues (e.g. scaleX from useTransform) are dropped; plain style values are kept.
      const s: Record<string, unknown> = {};
      if (style) for (const k of Object.keys(style)) { const v = style[k]; if (typeof v === "string" || typeof v === "number") s[k] = v; }
      return createElement(tag, { ...clean, style: s, ref });
    }));
  }
  return cache.get(tag);
}
export const motion: any = new Proxy({}, { get: (_t, tag: string) => make(tag) });
export const AnimatePresence = ({ children }: { children?: ReactNode; mode?: string }) => createElement(Fragment, null, children);
export const useInView = () => true;
export const useScroll = () => ({ scrollYProgress: { get: () => 0 } });
export const useTransform = () => 0;
