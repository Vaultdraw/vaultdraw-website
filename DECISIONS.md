# Decisions

## Stack: Astro, static output

- Astro 7 builds plain HTML. The only JavaScript is two small modules (theme picker, tabs, about 3 kB) plus an inline snippet that applies a saved theme before first paint.
- Markdown content collections hold the docs and the changelog.
- `astro:assets` + sharp make AVIF and WebP at four widths from each screenshot.
- No UI framework, no CSS framework. Plain CSS with custom properties; component styles are scoped.

## Private by default

- Fonts are self-hosted: Newsreader and JetBrains Mono from `@fontsource-variable` (bundled at build), Excalifont copied from the app (SIL OFL 1.1).
- No analytics, no cookies, no third-party requests. A `<meta>` CSP allows only `'self'`.
- The visitor's theme choice is kept in `localStorage` (a per-visitor convenience). Everything works without it.

## Colours come from the app

- `npm run themes` copies the app's built-in themes (`excalidraw-desktop/src/theme/builtin/`) into `src/data/themes.json`.
- `src/scripts/palette.js` turns a theme into the site's CSS variables and nudges colours until text meets contrast targets (body ≥ 9:1, muted ≥ 4.8:1, accent ≥ 4.6:1), the same idea as the app's contrast guard.
- The site opens in **Rosé Pine**: warm in both dark and light, and less generic than the neutral Default. The six featured themes can be switched from the header; any of the 123 from the grid.

## Screenshots are taken from the app, not mocked

- `npm run shots` builds the app's own Playwright harness (`excalidraw-desktop/e2e.html`: the real VaultApp over an in-memory vault), seeds it with the sample vault in `scripts/capture/vault.mjs`, and photographs five screens in six themes, dark and light, with WebKit (the macOS app's engine).
- The sample drawings are written for the site; none of the owner's own drawings are used.
- The hero sketch is an Excalidraw scene exported with the app's own **Export: SVG**, then recoloured with the theme in CSS.
- Masters are WebP (q92) in `src/assets/shots/`, about 10 MB for 60 images. Astro generates the served sizes.

## Open questions for the owner

- **Domain and host.** `astro.config.mjs` reads `SITE_URL`; nothing is deployed. GitHub Pages or Cloudflare Pages both work (static `dist/`).
- **Download links.** The download page says "coming soon" until a GitHub release exists.
- **OG image.** `public/og.png` is generated from the hero; replace it once the app has its own icon.
