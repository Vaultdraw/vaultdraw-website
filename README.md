# Vaultdraw website

The website for [Vaultdraw](https://github.com/Vaultdraw/beltio), an offline vault for Excalidraw drawings: a static Astro site with docs, a changelog and a download page.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/
```

## Content

| What | Where |
| --- | --- |
| Home page | `src/pages/index.astro` |
| Docs | `src/content/docs/*.md` (`order` in the front matter sets the sidebar order) |
| Changelog | `src/content/changelog/*.md`, one file per entry |
| Themes | `src/data/themes.json`, generated, see below |

## From the app

Both scripts read the app checkout at `../beltio` (set `APP_DIR` to change it).

- `npm run themes` copies the app's built-in themes into `src/data/themes.json`.
- `npm run shots` takes the screenshots and the hero sketch from the real app UI via its Playwright harness. Options: `--only <screen>`, `--theme <id>`, `--mode dark|light`, `--sketches`, `--rebuild`. Screens are in `scripts/capture/screens.mjs`, the sample vault in `scripts/capture/vault.mjs`, the featured themes in `src/data/featured.mjs`.
