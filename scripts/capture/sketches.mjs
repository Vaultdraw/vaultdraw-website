// Exports the SKETCHES in vault.mjs as SVG with the app's own Export: SVG
// command, for the site's illustrations. The embedded font is dropped (the
// site serves Excalifont itself) and colours are mapped to the theme in CSS.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { SKETCHES, buildVault } from "./vault.mjs";

export const exportSketches = async (browser, base, outDir) => {
  mkdirSync(outDir, { recursive: true });
  buildVault();
  for (const [name, make] of Object.entries(SKETCHES)) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
    const file = `Sketches/${name}.excalidraw`;
    await page.addInitScript(
      ({ file, json }) => {
        localStorage.setItem(
          "excalidraw-vault-preferences-v1",
          JSON.stringify({ theme: "light", colorTheme: "Default", syncCanvas: false, hasPanned: true, exportOptions: { scale: 1, background: false, embedScene: false, pattern: false, pageShaped: false } }),
        );
        let repo;
        Object.defineProperty(window, "__vaultRepo", {
          configurable: true,
          get: () => repo,
          set: (r) => {
            repo = r;
            r.seedDrawing(file, json);
          },
        });
      },
      { file, json: make() },
    );
    await page.goto(`${base}/e2e.html?seed=empty&chrome=macos`);
    await page.getByLabel("Vault File Navigator").waitFor();
    await page.locator(".vault-tree-item__name", { hasText: "Sketches" }).first().click();
    await page.locator(".vault-tree-item__name", { hasText: name }).first().click();
    await page.locator(".vault-editor canvas.interactive").waitFor();
    await page.waitForTimeout(1500);
    await page.keyboard.press("Meta+Shift+P");
    await page.keyboard.type("Export: SVG", { delay: 20 });
    await page.waitForTimeout(300);
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => window.__vaultRepo.exported.length > 0, null, { timeout: 15000 });
    const svg = await page.evaluate(() => new TextDecoder().decode(window.__vaultRepo.exported.at(-1).bytes));
    const clean = svg
      .replace(/<style class="style-fonts">[\s\S]*?<\/style>/g, "")
      .replace(/<!-- svg-source:excalidraw -->/g, "")
      .replace(/<metadata>[\s\S]*?<\/metadata>/g, "");
    writeFileSync(path.join(outDir, `${name}.svg`), clean);
    console.log(`  sketch ${name} (${Math.round(clean.length / 1024)} kB)`);
    await page.close();
  }
};
