import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  // The real domain is not chosen yet; set SITE_URL when deploying.
  site: process.env.SITE_URL ?? "http://localhost:4321",
  trailingSlash: "ignore",
  // The CSS is small; inlining it saves a render-blocking request.
  build: { inlineStylesheets: "always" },
  image: { layout: "constrained" },
  markdown: {
    // Token colours come from the site theme (see prose.css).
    shikiConfig: { theme: "css-variables" },
    // Mermaid blocks become inline SVG at build time (no runtime JS); prose.css themes them.
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: "inline-svg",
          mermaidConfig: {
            theme: "base",
            // A system font, so text measured at build time fits its box in the browser.
            fontFamily: "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif",
            flowchart: { htmlLabels: false, curve: "basis" },
          },
        },
      ],
    ],
  },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
});
