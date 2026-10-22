// Takes the site's screenshots from the real Vaultdraw UI.
//
// The app repo's Playwright harness (excalidraw-desktop/e2e.html) mounts the
// real VaultApp over an in-memory vault. This script builds that harness,
// seeds it with the sample vault from vault.mjs, and photographs each screen
// in each featured theme with WebKit (the engine of the macOS app).
//
//   npm run shots                      all themes, all screens
//   npm run shots -- --only editor     one screen
//   npm run shots -- --theme nord      one theme
//   npm run shots -- --mode light      one colour mode
//   npm run shots -- --sketches        only the SVG sketches
//
// APP_DIR points at the app checkout (default ../vaultdraw).

import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildVault, VAULT_NAME } from "./vault.mjs";
import { SCREENS } from "./screens.mjs";
import { exportSketches } from "./sketches.mjs";
import { FEATURED } from "../../src/data/featured.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const appDir = path.resolve(root, process.env.APP_DIR ?? "../vaultdraw");
const desktop = path.join(appDir, "excalidraw-desktop");
const harness = path.join(root, ".cache/app-harness");
const raw = path.join(root, ".cache/shots");
const out = path.join(root, "src/assets/shots");
const PORT = Number(process.env.SHOTS_PORT ?? 1499);
const PREFS_KEY = "excalidraw-vault-preferences-v1";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const onlyScreen = flag("only");
const onlyTheme = flag("theme");
const onlyMode = flag("mode");

const require = createRequire(path.join(appDir, "package.json"));
const { webkit } = require("playwright");
const sharp = (await import("sharp")).default;

if (!existsSync(path.join(harness, "e2e.html")) || args.includes("--rebuild")) {
  console.log("building the app harness…");
  execFileSync(
    "npx",
    ["vite", "build", "--config", "vite.e2e.config.mts", "--outDir", harness, "--emptyOutDir", "--logLevel", "error"],
    { cwd: desktop, stdio: "inherit" },
  );
}

const server = spawn(
  "npx",
  ["vite", "preview", "--config", "vite.e2e.config.mts", "--outDir", harness, "--port", String(PORT), "--strictPort"],
  { cwd: desktop, stdio: "ignore" },
);
const stop = () => server.kill();
process.on("exit", stop);

const waitForServer = async () => {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/e2e.html`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("harness preview did not start");
};
await waitForServer();

mkdirSync(raw, { recursive: true });
mkdirSync(out, { recursive: true });

const browser = await webkit.launch();

if (!onlyScreen && !onlyTheme && !onlyMode) {
  await exportSketches(browser, `http://localhost:${PORT}`, path.join(root, "src/assets/sketches"));
}
if (args.includes("--sketches")) {
  await browser.close();
  stop();
  process.exit(0);
}

const vault = buildVault();

const themes = FEATURED.filter((t) => !onlyTheme || t.id === onlyTheme);
const screens = SCREENS.filter((s) => !onlyScreen || s.name === onlyScreen);

for (const theme of themes) {
  for (const mode of theme.shotModes) {
    for (const screen of screens) {
      if (screen.modes && !screen.modes.includes(mode)) continue;
      if (screen.themes && !screen.themes.includes(theme.id)) continue;
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
        colorScheme: mode,
      });
      page.on("pageerror", (e) => console.warn(`  ${screen.name}: ${e.message}`));
      await page.addInitScript(
        ({ vault, name, key, prefs }) => {
          localStorage.setItem(key, JSON.stringify(prefs));
          window.__sampleVault = vault;
          let repo;
          Object.defineProperty(window, "__vaultRepo", {
            configurable: true,
            get: () => repo,
            set: (r) => {
              repo = r;
              r.vault = { ...r.vault, name };
              for (const [p, json] of Object.entries(vault)) r.seedDrawing(p, json);
            },
          });
        },
        {
          vault,
          name: VAULT_NAME,
          key: PREFS_KEY,
          prefs: { theme: mode, colorTheme: theme.name, syncCanvas: true, hasPanned: true, ...screen.prefs },
        },
      );
      await page.goto(`http://localhost:${PORT}/e2e.html?seed=empty&chrome=macos${screen.query ?? ""}`);
      await page.getByLabel("Vault File Navigator").waitFor();
      await screen.run(page);
      const file = `${screen.name}-${theme.id}-${mode}`;
      const png = path.join(raw, `${file}.png`);
      await page.screenshot({ path: png, clip: screen.clip });
      // Lossless-ish master; Astro makes the AVIF/WebP sizes from it.
      await sharp(png).webp({ quality: 92, effort: 6 }).toFile(path.join(out, `${file}.webp`));
      console.log(`  ${file}`);
      await page.close();
    }
  }
}

await browser.close();
stop();
