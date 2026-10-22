import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import remarkRelease from "./scripts/remark-release.mjs";
import { mermaidFromCache, mermaidToCache } from "./scripts/rehype-mermaid-cache.mjs";

const mermaidConfig = {
  theme: "base",
  // A system font, so text measured at build time fits its box in the browser.
  fontFamily: "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif",
  flowchart: { htmlLabels: false, curve: "basis" },
};

export default defineConfig({
  // The live site (canonical URLs, Open Graph image); SITE_URL overrides it.
  site: process.env.SITE_URL ?? "https://vaultdraw.vercel.app",
  trailingSlash: "ignore",
  // The CSS is small; inlining it saves a render-blocking request.
  build: { inlineStylesheets: "always" },
  image: { layout: "constrained" },
  markdown: {
    // Token colours come from the site theme (see prose.css).
    shikiConfig: { theme: "css-variables" },
    // Mermaid blocks become inline SVG at build time (no runtime JS); prose.css themes them.
    // Rendered SVGs are committed in src/mermaid/, so hosts without a browser can build.
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    // {{version}}, {{dmg_url}} and friends come from src/data/release.js.
    remarkPlugins: [remarkRelease],
    rehypePlugins: [
      [mermaidFromCache, { mermaidConfig }],
      [rehypeMermaid, { strategy: "inline-svg", mermaidConfig }],
      mermaidToCache,
    ],
  },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
});
