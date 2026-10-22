// Turns a Vaultdraw theme variant into the site's CSS variables. Like the
// app, it nudges colours until text is readable, so any of the palettes can
// dress the site without breaking contrast. Used at build time and in the
// browser, so it is plain JS with no imports.

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

export const mix = (a, b, t) => {
  const p = rgb(a);
  const q = rgb(b);
  return hex(p.map((v, i) => v + (q[i] - v) * t));
};

/**
 * Move `color` away from the background until it reaches `min` contrast on
 * every surface it may sit on (the page, and panels a little lighter or darker).
 */
const ensure = (color, bgs, min) => {
  const list = [].concat(bgs);
  const target = lum(list[0]) > 0.4 ? "#000000" : "#ffffff";
  const ok = (c) => list.every((b) => contrast(c, b) >= min);
  let c = color;
  for (let t = 0.04; !ok(c) && t <= 1; t += 0.04) c = mix(color, target, t);
  return c;
};

export const isDark = (v) => lum(v.bg) < 0.4;

/** CSS custom properties for one theme variant. */
export const siteVars = (v) => {
  const bg = v.bg;
  let fg = v.fg;
  let muted = v.muted ?? mix(fg, bg, 0.35);
  // Some palettes give the secondary role more contrast than the primary.
  if (contrast(muted, bg) > contrast(fg, bg)) [fg, muted] = [muted, fg];
  let panel = v.panel ?? mix(bg, fg, 0.05);
  if (contrast(panel, bg) < 1.06) panel = mix(bg, fg, 0.05);
  // Text lands on the page, on panels, and on the in-between card tint.
  const surfaces = [bg, panel, mix(panel, bg, 0.5)];
  fg = ensure(fg, surfaces, 9);
  muted = ensure(muted, surfaces, 4.8);
  const sunk = mix(bg, isDark(v) ? "#000000" : "#ffffff", isDark(v) ? 0.25 : 0.5);
  const line = ensure(v.line ?? mix(bg, fg, 0.18), bg, 1.45);
  const accent = ensure(v.accent, surfaces, 4.6);
  const onAccent = contrast(v.onAccent ?? bg, accent) >= 4.5 ? v.onAccent ?? bg : contrast("#000000", accent) > contrast("#ffffff", accent) ? "#000000" : "#ffffff";
  const ansi = (v.ansi ?? []).map((c) => (c ? ensure(c, surfaces, 4.6) : accent));
  while (ansi.length < 6) ansi.push(accent);

  return {
    "--bg": bg,
    "--sunk": sunk,
    "--panel": panel,
    "--fg": fg,
    "--muted": muted,
    "--line": line,
    "--line-soft": mix(line, bg, 0.45),
    "--accent": accent,
    "--on-accent": onAccent,
    "--accent-soft": mix(accent, bg, 0.82),
    "--red": ansi[0],
    "--green": ansi[1],
    "--yellow": ansi[2],
    "--blue": ansi[3],
    "--magenta": ansi[4],
    "--cyan": ansi[5],
    "color-scheme": isDark(v) ? "dark" : "light",
    // Logo (components/Mark.astro): the theme's own colours, only nudged where
    // one would nearly vanish, so Rosé Pine gives exactly the official logo.
    "--logo-ink": ensure(v.fg, [bg], 2),
    "--logo-draw": ensure(v.accent, [bg], 2),
    "--logo-folder": ensure(v.ansi?.[4] ?? v.accent2 ?? v.accent, [bg], 2),
    "--logo-pen": ensure(v.ansi?.[3] ?? v.accent3 ?? v.accent, [bg], 2),
  };
};

export const cssBlock = (selector, vars) =>
  `${selector}{${Object.entries(vars)
    .map(([k, val]) => `${k}:${val}`)
    .join(";")}}`;
