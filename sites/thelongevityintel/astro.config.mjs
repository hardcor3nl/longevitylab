import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import { fileURLToPath } from "node:url";
import rehypeTables, { rehypeWrapTables } from "./rehype-tables.mjs";
import rehypeAffiliates from "./rehype-affiliates.mjs";

const legacy = (p) => fileURLToPath(new URL(`./src/legacy/${p}`, import.meta.url));

export default defineConfig({
  site: "https://thelongevityintel.com",
  output: "static",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  integrations: [mdx(), react()],
  markdown: { processor: unified({ rehypePlugins: [rehypeTables, rehypeWrapTables, rehypeAffiliates] }) },
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        // The ported App Router components import Next and framer-motion; these shims render them as plain static HTML.
        { find: "next/link", replacement: legacy("shims/next-link.tsx") },
        { find: "next/image", replacement: legacy("shims/next-image.tsx") },
        { find: "next/navigation", replacement: legacy("shims/next-navigation.ts") },
        { find: "framer-motion", replacement: legacy("shims/framer-motion.tsx") },
        { find: /^@\//, replacement: legacy("") },
      ],
    },
  },
});
