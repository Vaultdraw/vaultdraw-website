// Copies the app's built-in themes into src/data/themes.json, trimmed to the
// colours the site uses. Run after the app adds or changes a theme:
//   npm run themes            (APP_DIR defaults to ../vaultdraw)

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.resolve(root, process.env.APP_DIR ?? "../vaultdraw");
const dir = path.join(appDir, "excalidraw-desktop/src/theme/builtin");

// Same priority as the app (builtins.ts): noctalia, then community, then own.
const sources = [
  ["noctalia", path.join(dir, "noctalia")],
  ["community", path.join(dir, "community")],
  ["vaultdraw", dir],
];

const ROLES = {
  bg: "mSurface",
  fg: "mOnSurface",
  panel: "mSurfaceVariant",
  muted: "mOnSurfaceVariant",
  line: "mOutline",
  accent: "mPrimary",
  onAccent: "mOnPrimary",
  accent2: "mSecondary",
  accent3: "mTertiary",
  error: "mError",
};
const ANSI = ["red", "green", "yellow", "blue", "magenta", "cyan"];

const variant = (v) => {
  if (!v?.mSurface || !v?.mOnSurface || !v?.mPrimary) return null;
  const out = {};
  for (const [k, role] of Object.entries(ROLES)) if (v[role]) out[k] = v[role].toLowerCase();
  const t = v.terminal?.normal;
  if (t) out.ansi = ANSI.map((c) => (t[c] ?? "").toLowerCase());
  return out;
};

const themes = new Map();
for (const [origin, folder] of sources) {
  for (const file of readdirSync(folder).filter((f) => f.endsWith(".json")).sort()) {
    const id = file.replace(/\.json$/, "");
    if (themes.has(id)) continue;
    const json = JSON.parse(readFileSync(path.join(folder, file), "utf8"));
    const dark = variant(json.dark);
    const light = variant(json.light);
    if (!dark && !light) continue;
    themes.set(id, { id, name: json.name ?? id, origin, dark, light });
  }
}

const list = [...themes.values()].sort((a, b) =>
  a.id === "default" ? -1 : b.id === "default" ? 1 : a.name.localeCompare(b.name),
);
writeFileSync(path.join(root, "src/data/themes.json"), JSON.stringify(list) + "\n");
console.log(`${list.length} themes → src/data/themes.json`);
