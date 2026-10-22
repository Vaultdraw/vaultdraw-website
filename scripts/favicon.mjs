// Builds the site favicon from the official small mark: a solid rounded tile in
// the logo's folder purple with the mark in white, like Excalidraw's, so it
// stays visible at 16 px on light and dark tab bars alike.
//
//   node scripts/favicon.mjs   -> public/favicon.svg, public/favicon.ico (16/32/48)

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TILE = "#907aa9"; // Rosé Pine folder (light), BRAND.md
const GLYPH = "#ffffff";
const SCALE = 0.74; // the mark's share of the tile
const STROKE = 84; // source strokes are 64; thicker so they hold at 16 px

const mark = readFileSync(path.join(root, "src/assets/brand/mark-small-dark.svg"), "utf8");
const inner = mark
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${GLYPH}"`)
  .replace(/stroke-width="64"/g, `stroke-width="${STROKE}"`)
  .replace(/s-dark-/g, "fav-");

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><title>Vaultdraw</title>` +
  `<rect width="1024" height="1024" rx="224" fill="${TILE}"/>` +
  `<g transform="translate(512 512) scale(${SCALE}) translate(-512 -512)">${inner}</g></svg>\n`;
writeFileSync(path.join(root, "public/favicon.svg"), svg);

// ICO with PNG entries (supported by every current browser and OS).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(svg)).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync(path.join(root, "public/favicon.ico"), Buffer.concat([header, ...pngs]));
console.log(`public/favicon.svg (${svg.length} B), public/favicon.ico (${offset} B)`);
