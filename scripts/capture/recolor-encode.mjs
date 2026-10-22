// Turns one real screenshot into a "key map" that any theme can repaint.
//
// Every pixel the app paints is one of its theme colours, or (on the soft edge
// of text, lines and strokes) a blend of two. For each pixel, this finds the
// named theme colours i, j and the blend t that reproduce it, and stores them
// as R = i, G = j, B = t * 255, alpha 255. Pixels no theme colour explains
// (photos, the macOS window buttons) keep their photographed colour, marked
// with alpha 254.
//
// Two themes can paint different things the same colour (a label and a stroke
// in one theme's text colour), so the same screen is photographed in two
// source themes whose look-alikes differ, and a pixel must match both photos.
// Drawing ink and UI text can still share a colour in every theme but a few
// (where the UI nudges text for contrast), so a frame with the canvas hidden
// tells which pixels were drawn on the canvas: those prefer the canvas palette
// (canvas:*), the rest prefer the UI colours; a look-alike from the other side
// is only used when nothing on the pixel's own side fits.
//
// The site repaints a key map with another theme's colours for the same names
// (src/scripts/recolor-worker.js), so 117 themes without their own screenshot
// still show the real UI in their colours.
//
//   node scripts/capture/recolor-encode.mjs <colors.json> <mode> <out.webp> <theme>=<shot.png> [<theme>=<shot.png>]
// The first shot's <name>-nocanvas.png, when present, gives the canvas mask.
// prints the list of colour names the key map indexes (its palette).

import { existsSync, readFileSync } from "node:fs";
import sharp from "sharp";

/** Above this RGB distance a pixel isn't a theme colour or a blend of two: keep it as photographed. */
const RAW_ERROR = 20;
/** Squared-distance cost per channel of using a colour from the other side of the canvas mask. */
const OTHER_SIDE = 16;
/** Pairs are searched among this many nearest palette colours. */
const NEAREST = 14;

const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const dist2 = (a, b) => {
  let s = 0;
  for (let k = 0; k < a.length; k++) s += (a[k] - b[k]) ** 2;
  return s;
};

/**
 * The named colours as seen in the source themes (one RGB triple per source).
 * Names that look the same in every source are merged: of each group, keep the
 * name whose colour in other themes is closest to the rest of the group (the
 * medoid), since a pixel of that colour could be any of them.
 */
export function sourcePalette(colors, sourceIds, mode) {
  const srcs = sourceIds.map((id) => colors.themes[id][mode]);
  const others = Object.entries(colors.themes).filter(([id]) => !sourceIds.includes(id)).map(([, m]) => m[mode]);
  const groups = new Map();
  colors.names.forEach((name, i) => {
    if (srcs.some((s) => !s[i])) return;
    const key = `${isCanvasName(name)}|${srcs.map((s) => s[i]).join()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(i);
  });
  const palette = [];
  for (const members of groups.values()) {
    let best = members[0];
    if (members.length > 1) {
      let bestCost = Infinity;
      for (const m of members) {
        let cost = 0;
        for (const t of others) {
          if (!t[m]) continue;
          for (const o of members) if (o !== m && t[o]) cost += Math.sqrt(dist2(rgb(t[m]), rgb(t[o])));
        }
        if (cost < bestCost) [bestCost, best] = [cost, m];
      }
    }
    const name = colors.names[best];
    palette.push({ name, canvas: isCanvasName(name), color: srcs.flatMap((s) => rgb(s[best])) });
  }
  if (palette.length > 255) throw new Error(`palette has ${palette.length} colours; the key map holds 255`);
  return palette;
}

const isCanvasName = (name) => name.startsWith("canvas:") || name.startsWith("fixed:");

/**
 * Best palette colour i, j and blend t for one pixel (its colour in every
 * source); null when nothing fits. Colours from the other side of the canvas
 * mask cost a little extra, so exact look-alikes resolve to the pixel's side.
 */
function fit(c, palette, drawn) {
  const n = c.length;
  const cost = (i) => (palette[i].name.startsWith("fixed:") || palette[i].canvas === drawn ? 0 : OTHER_SIDE * n);
  const near = palette
    .map((p, i) => [i, dist2(c, p.color) + cost(i)])
    .sort((a, b) => a[1] - b[1])
    .slice(0, NEAREST);
  let best = { i: near[0][0], j: near[0][0], t: 0, err: near[0][1], fit: near[0][1] - cost(near[0][0]) };
  for (let x = 0; x < near.length; x++) {
    for (let y = x + 1; y < near.length; y++) {
      const a = palette[near[x][0]].color, b = palette[near[y][0]].color;
      let dot = 0, len = 0;
      for (let k = 0; k < n; k++) {
        const ab = b[k] - a[k];
        dot += (c[k] - a[k]) * ab;
        len += ab * ab;
      }
      if (!len) continue;
      const t = Math.round(Math.min(1, Math.max(0, dot / len)) * 255) / 255;
      let err = 0;
      for (let k = 0; k < n; k++) err += (c[k] - (a[k] + (b[k] - a[k]) * t)) ** 2;
      const total = err + Math.max(cost(near[x][0]), cost(near[y][0]));
      if (total < best.err) best = { i: near[x][0], j: near[y][0], t, err: total, fit: err };
    }
  }
  return best.fit > RAW_ERROR ** 2 * (n / 3) ? null : best;
}

/** Lossless WebP (exact values, about half the size of PNG). */
export const writeKeymap = (r, file) =>
  sharp(r.keymap, { raw: { width: r.width, height: r.height, channels: 4 } }).webp({ lossless: true, effort: 6 }).toFile(file);

/** sources: [{ id, shot }] photographed in the same layout. */
export async function encode(colors, mode, sources) {
  const palette = sourcePalette(colors, sources.map((s) => s.id), mode);
  const shots = await Promise.all(sources.map((s) => sharp(s.shot).removeAlpha().raw().toBuffer({ resolveWithObject: true })));
  const { width, height } = shots[0].info;
  if (shots.some((s) => s.info.width !== width || s.info.height !== height)) throw new Error("source shots differ in size");
  const bare = sources[0].shot.replace(/\.png$/, "-nocanvas.png");
  const noCanvas = existsSync(bare) ? (await sharp(bare).removeAlpha().raw().toBuffer()) : null;
  const out = Buffer.alloc(width * height * 4);
  const cache = new Map();
  let raw = 0;
  for (let p = 0, q = 0; q < out.length; p += 3, q += 4) {
    const c = shots.flatMap((s) => [s.data[p], s.data[p + 1], s.data[p + 2]]);
    const s0 = shots[0].data;
    const drawn = !!noCanvas && (s0[p] !== noCanvas[p] || s0[p + 1] !== noCanvas[p + 1] || s0[p + 2] !== noCanvas[p + 2]);
    const key = `${drawn}|${c.join()}`;
    let f = cache.get(key);
    if (f === undefined) cache.set(key, (f = fit(c, palette, drawn)));
    if (!f) {
      raw++;
      out[q] = s0[p];
      out[q + 1] = s0[p + 1];
      out[q + 2] = s0[p + 2];
      out[q + 3] = 254; // as photographed
      continue;
    }
    out[q] = f.i;
    out[q + 1] = f.j;
    out[q + 2] = Math.round(f.t * 255);
    out[q + 3] = 255;
  }
  return { palette, width, height, keymap: out, rawShare: raw / (width * height), unique: cache.size };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [colorsPath, mode, outPng, ...pairs] = process.argv.slice(2);
  const colors = JSON.parse(readFileSync(colorsPath, "utf8"));
  const sources = pairs.map((p) => {
    const [id, shot] = p.split("=");
    return { id, shot };
  });
  const r = await encode(colors, mode, sources);
  await writeKeymap(r, outPng);
  console.log(JSON.stringify({ palette: r.palette.map((p) => p.name), raw: +(100 * r.rawShare).toFixed(2), unique: r.unique }));
}
