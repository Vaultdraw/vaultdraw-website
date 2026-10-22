// Builds the site favicon from the official one (src/assets/brand/favicon-official.svg,
// light/dark colours): heavier strokes and the view cropped to the drawing, so the
// mark fills the whole 16 px square like Excalidraw's instead of floating in it.
//
//   node scripts/favicon.mjs   -> public/favicon.svg, public/favicon.ico (16/32/48)

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STROKE = 100; // the source strokes are 64: too thin once the mark fills 16 px
const PAD = 0.02; // share of the side left free around the drawing

const thick = readFileSync(path.join(root, "src/assets/brand/favicon-official.svg"), "utf8").replace(
  /stroke-width="64"/g,
  `stroke-width="${STROKE}"`,
);

// Painted bounds of the drawing (strokes included), from a render of the full 1024 box.
const { info } = await sharp(Buffer.from(thick)).png().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const x = -info.trimOffsetLeft;
const y = -info.trimOffsetTop;
const side = Math.max(info.width, info.height) * (1 + 2 * PAD);
const viewBox = [x + info.width / 2 - side / 2, y + info.height / 2 - side / 2, side, side].map((n) => Math.round(n)).join(" ");

const svg = thick.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`).replace(/width="1024" height="1024"/, 'width="64" height="64"');
writeFileSync(path.join(root, "public/favicon.svg"), svg);

// ICO with PNG entries (supported by every current browser and OS); light-tab colours.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(svg), { density: 72 * (s / 64) * 4 }).resize(s, s).png().toBuffer()));
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
console.log(`public/favicon.svg (viewBox ${viewBox}), public/favicon.ico (${offset} B)`);
