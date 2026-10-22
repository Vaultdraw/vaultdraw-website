// Builds what the site needs to show the app's screenshots in any theme.
//
// Only six themes are photographed (src/assets/shots). For the rest, each
// screen gets a key map (see recolor-encode.mjs) that the browser repaints with
// the theme's own colours (src/scripts/recolor.js). Steps:
//   1. every theme's colours, from the app's theme code  -> .cache/recolor/colors.json
//   2. each screen photographed in two source themes      -> .cache/recolor/shots
//   3. key maps                                           -> public/recolor/<screen>-<mode>.webp
//   4. each theme's colours in key-map order              -> public/recolor/palettes.json
//
//   npm run recolor                    everything
//   npm run recolor -- --only editor   one screen
//   npm run recolor -- --skip-shots    reuse the shots in .cache/recolor/shots
//
// APP_DIR points at the app checkout (default ../vaultdraw).

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { encode, writeKeymap } from "./recolor-encode.mjs";
import { SCREENS } from "./screens.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const appDir = path.resolve(root, process.env.APP_DIR ?? "../vaultdraw");
const cache = path.join(root, ".cache/recolor");
const shots = path.join(cache, "shots");
const out = path.join(root, "public/recolor");

// Source pairs: of all built-in themes, the two per mode whose look-alike
// colours overlap least (few names that one theme paints alike, the other
// also paints alike), so nearly every pixel decodes to one named colour.
const SOURCES = { dark: ["spiderman", "seabed"], light: ["cyberpunk", "everforest-material"] };

const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const screens = SCREENS.filter((s) => !only || s.name === only);

const run = (cmd, argv, cwd) => {
  const r = spawnSync(cmd, argv, { cwd, stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(" ")} failed`);
};

mkdirSync(shots, { recursive: true });
mkdirSync(out, { recursive: true });

console.log("theme colours…");
const colorsFile = path.join(cache, "colors.json");
run("npx", ["vite-node", "--config", "vitest.config.mts", path.join(root, "scripts/capture/theme-colors.ts"), "--", colorsFile], appDir);
const colors = JSON.parse(readFileSync(colorsFile, "utf8"));

if (!args.includes("--skip-shots")) {
  for (const [mode, ids] of Object.entries(SOURCES)) {
    console.log(`source shots (${mode})…`);
    run("node", ["scripts/capture/shoot.mjs", "--raw", shots, "--theme", ids.join(","), "--mode", mode, ...(only ? ["--only", only] : [])], root);
  }
}

const index = Object.fromEntries(colors.names.map((n, i) => [n, i]));
const palettes = {};
const done = {};
for (const [mode, ids] of Object.entries(SOURCES)) {
  let palette;
  for (const screen of screens) {
    if (screen.modes && !screen.modes.includes(mode)) continue;
    const r = await encode(colors, mode, ids.map((id) => ({ id, shot: path.join(shots, `${screen.name}-${id}-${mode}.png`) })));
    await writeKeymap(r, path.join(out, `${screen.name}-${mode}.webp`));
    palette = r.palette; // the same for every screen of a mode: it depends on the sources only
    (done[screen.name] ??= []).push(mode);
    console.log(`  ${screen.name}-${mode}: ${r.palette.length} colours, ${(100 * r.rawShare).toFixed(2)}% kept as photographed`);
  }
  if (!palette) continue;
  // One string of rrggbb per theme, in key-map order.
  palettes[mode] = Object.fromEntries(
    Object.entries(colors.themes).map(([id, m]) => [id, palette.map((p) => m[mode][index[p.name]].slice(1)).join("")]),
  );
}

const body = { screens: done, palettes };
const version = createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0, 10);
writeFileSync(path.join(out, "palettes.json"), JSON.stringify({ version, ...body }));
console.log(`public/recolor/palettes.json (${version})`);
