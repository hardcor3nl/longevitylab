export function notFound(): never { throw new Error("NEXT_NOT_FOUND"); }
export function usePathname() { return typeof window === "undefined" ? "/" : window.location.pathname; }
export function useRouter() { return { push: (h: string) => { window.location.href = h; }, replace: (h: string) => { window.location.replace(h); } }; }
