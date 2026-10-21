import { defineConfig } from "astro/config";

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
  },
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
});
