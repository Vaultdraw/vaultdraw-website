// Every colour the Vaultdraw app paints, for every built-in theme and mode,
// computed by the app's own theme code (so contrast nudges and derived tints
// are exact). Feeds the screenshot recolouring (see recolor-encode.mjs).
//
// Runs inside the app's Vite setup, from the app checkout:
//   cd ../vaultdraw && npx vite-node --config vitest.config.mts \
//     ../vaultdraw-website/scripts/capture/theme-colors.ts -- <out.json>
//
// Output: { names: string[], themes: { [id]: { dark: string[], light: string[] } } }
// where themes[id][mode][i] is the #rrggbb colour of names[i].

import { writeFileSync } from "node:fs";
import path from "node:path";

const appDir = path.resolve(process.env.APP_DIR ?? path.join(process.cwd()));
const theme = `${appDir}/excalidraw-desktop/src/theme`;

const { loadBuiltinThemes } = await import(/* @vite-ignore */ `${theme}/builtins.ts`);
const { deriveTokens } = await import(/* @vite-ignore */ `${theme}/tokens.ts`);
const { excalidrawVariableOverrides } = await import(/* @vite-ignore */ `${theme}/excalidrawVars.ts`);
const { buildCanvasPaletteMap } = await import(/* @vite-ignore */ `${theme}/canvas.ts`);
const { blendOver, normalizeHex } = await import(/* @vite-ignore */ `${theme}/color.ts`);

const RGBA = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
const hex2 = (n: number) => n.toString(16).padStart(2, "0");

/** A colour value as #rrggbb, or [#rrggbb, alpha] for a translucent one; null for anything else. */
const parse = (value: string): string | [string, number] | null => {
  const hex = normalizeHex(value);
  if (hex) return hex.slice(0, 7);
  const m = RGBA.exec(value.trim());
  if (!m) return null;
  const color = `#${hex2(+m[1])}${hex2(+m[2])}${hex2(+m[3])}`;
  const a = m[4] === undefined ? 1 : +m[4];
  return a >= 1 ? color : [color, a];
};

/** name -> opaque colour for one variant. Translucent tints are painted over each surface they sit on. */
const colorsOf = (variant: unknown, mode: "dark" | "light"): Record<string, string> => {
  const tokens: Record<string, string> = deriveTokens(variant, mode);
  const vars: Record<string, string> = excalidrawVariableOverrides(tokens, mode);
  const surfaces = {
    bg: tokens["--vault-bg"],
    surface: tokens["--vault-surface"],
    menu: tokens["--vault-menu-bg"],
  };
  const out: Record<string, string> = { "fixed:black": "#000000", "fixed:white": "#ffffff" };
  for (const [name, value] of Object.entries({ ...tokens, ...vars })) {
    if (name.includes("shadow")) continue; // black at low alpha: covered by fixed:black
    const c = parse(value);
    if (!c) continue;
    if (typeof c === "string") out[name] = c;
    else for (const [on, under] of Object.entries(surfaces)) out[`${name}@${on}`] = blendOver(c[0], c[1], under);
  }
  for (const [from, to] of buildCanvasPaletteMap(variant)) out[`canvas:${from}`] = normalizeHex(to)!.slice(0, 7);
  return out;
};

const themes = loadBuiltinThemes();
const table: Record<string, Record<string, Record<string, string>>> = {};
for (const t of themes) table[t.id] = { dark: colorsOf(t.dark, "dark"), light: colorsOf(t.light, "light") };

const names = [...new Set(Object.values(table).flatMap((m) => [...Object.keys(m.dark), ...Object.keys(m.light)]))].sort();
const result = {
  names,
  themes: Object.fromEntries(
    Object.entries(table).map(([id, m]) => [id, { dark: names.map((n) => m.dark[n] ?? null), light: names.map((n) => m.light[n] ?? null) }]),
  ),
};

const out = process.argv.at(-1)!;
writeFileSync(out, JSON.stringify(result));
console.log(`${themes.length} themes, ${names.length} colour names -> ${out}`);
