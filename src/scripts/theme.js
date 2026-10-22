// Theme picker. The choice (theme + light/dark/system) is a per-visitor
// convenience kept in localStorage; Base.astro's inline script applies it
// before first paint, this module handles changes.

import { siteVars } from "./palette.js";

const KEY = "vd-theme";
const root = document.documentElement;
const DEFAULT = root.dataset.defaultTheme;
const featured = JSON.parse(document.getElementById("vd-featured")?.textContent ?? "[]");
const light = matchMedia("(prefers-color-scheme: light)");

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
};
const write = (value) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {}
};

let state = read() ?? { id: DEFAULT, mode: "system" };
let all = null;

const findTheme = async (id) => {
  const f = featured.find((t) => t.id === id);
  if (f) return f;
  all ??= fetch("/themes.json").then((r) => r.json());
  return (await all).find((t) => t.id === id);
};

const schemeOf = (mode) => (mode === "system" ? (light.matches ? "light" : "dark") : mode);

const varsFor = (theme) => ({
  dark: siteVars(theme.dark ?? theme.light),
  light: siteVars(theme.light ?? theme.dark),
});

const variantFor = (fig, id, scheme) => {
  const variants = JSON.parse(fig.dataset.variants);
  const key = [`${id}-${scheme}`, `${DEFAULT}-${scheme}`].find((k) => variants[k]);
  return key && { key, ...variants[key] };
};

const onScreen = (el) => {
  const box = el.getBoundingClientRect();
  return box.bottom > 0 && box.top < innerHeight;
};

/** Start loading a theme's visible screenshots (on hover), so a switch is instant. */
const preload = (id) => {
  const scheme = schemeOf(state.mode);
  for (const fig of document.querySelectorAll("[data-shot]")) {
    const img = fig.querySelector("img");
    const v = variantFor(fig, id, scheme);
    if (!v || !onScreen(img)) continue;
    const pre = new Image();
    pre.sizes = img.sizes;
    pre.srcset = v.avif;
  }
};

/** Swap screenshots to the theme; returns the on-screen images that changed. */
/** Hidden screenshots (an inactive feature tab) are repainted when shown: see "vd:shown". */
const shown = (fig) => fig.getClientRects().length > 0;

const swapShots = (id, scheme) => {
  const changed = [];
  for (const fig of document.querySelectorAll("[data-shot]")) {
    const v = variantFor(fig, id, scheme);
    const picture = fig.querySelector("picture");
    if (!v || picture.dataset.current === `${id}-${scheme}`) continue; // already this theme (photo or repaint)
    if (picture.dataset.current === v.key) {
      if (!v.key.startsWith(`${id}-`)) {
        fig.dataset.showing = "fallback"; // stand-in already showing (first load)
        if (shown(fig)) repaint(fig, id, scheme, v.key);
      }
      continue;
    }
    const key = v.key;
    picture.dataset.current = key;
    // Drop the no-script light/dark media switch: the script decides now.
    for (const s of picture.querySelectorAll("source[media]")) s.remove();
    picture.querySelector('source[type="image/avif"]').srcset = v.avif;
    picture.querySelector('source[type="image/webp"]').srcset = v.webp;
    const img = picture.querySelector("img");
    img.src = v.src;
    fig.dataset.showing = key.startsWith(`${id}-`) ? "theme" : "fallback";
    if (fig.dataset.showing === "fallback" && shown(fig)) repaint(fig, id, scheme, key);
    if (onScreen(img)) changed.push(img);
  }
  return changed;
};

/**
 * A theme without its own screenshots: show the stand-in, then swap in the
 * same screen repainted in the theme's colours once it's ready.
 */
const repaint = async (fig, id, scheme, standIn) => {
  const { supported, recolored } = await import("./recolor.js");
  if (!supported) return;
  const url = await recolored(fig.dataset.shot, id, scheme);
  const picture = fig.querySelector("picture");
  if (!url || picture.dataset.current !== standIn) return; // none, or the theme changed meanwhile
  for (const s of picture.querySelectorAll("source")) s.srcset = url;
  picture.querySelector("img").src = url;
  picture.dataset.current = `${id}-${scheme}`;
  fig.dataset.showing = "repainted";
};

const paint = (vars, scheme) => {
  for (const k of Array.from(root.style)) root.style.removeProperty(k);
  if (vars) for (const [k, v] of Object.entries(vars[scheme])) root.style.setProperty(k, v);
};

const render = async ({ fade = true, settle = false } = {}) => {
  const scheme = schemeOf(state.mode);
  if (fade) {
    root.classList.add("theme-fade");
    setTimeout(() => root.classList.remove("theme-fade"), 450);
  }
  root.dataset.scheme = scheme;
  root.dataset.theme = state.id;
  root.dataset.mode = state.mode;
  paint(state.id === DEFAULT ? null : state.vars, scheme);
  const visible = swapShots(state.id, scheme);
  // During a view transition, wait (briefly) for visible screenshots so the
  // new snapshot doesn't show the old theme's pictures.
  if (settle && visible.length) {
    await Promise.race([
      Promise.all(visible.map((img) => img.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 300)),
    ]);
  }

  const theme = await findTheme(state.id);
  for (const el of document.querySelectorAll("[data-theme-name]")) el.textContent = theme?.name ?? "";
  for (const b of document.querySelectorAll("[data-pick-theme]")) {
    b.setAttribute("aria-pressed", String(b.dataset.pickTheme === state.id));
  }
  for (const b of document.querySelectorAll("[data-mode-toggle]")) {
    b.dataset.state = state.mode;
    b.setAttribute("aria-label", `Colour mode: ${state.mode}. Change`);
    b.title = `Mode: ${state.mode}`;
  }
};

const calm = matchMedia("(prefers-reduced-motion: reduce)");

/**
 * Re-render with the new state. Where the browser supports view transitions,
 * the new theme spreads out in a circle from the button that was clicked;
 * elsewhere the colours cross-fade.
 */
const change = (next, origin) => {
  state = next;
  write(state);
  if (!document.startViewTransition || calm.matches || !origin) {
    render();
    return;
  }
  const { x, y } = origin;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = document.startViewTransition(() => render({ fade: false, settle: true }));
  t.ready.then(() =>
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
    ),
  );
};

const pick = async (id, origin) => {
  const theme = await findTheme(id);
  if (!theme) return;
  change({ ...state, id, vars: id === DEFAULT ? undefined : varsFor(theme) }, origin);
};

const centre = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const MODES = ["system", "light", "dark"];

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-pick-theme]");
  if (t) {
    pick(t.dataset.pickTheme, centre(t));
    return;
  }
  const m = e.target.closest("[data-mode-toggle]");
  if (m) {
    change({ ...state, mode: MODES[(MODES.indexOf(state.mode) + 1) % MODES.length] }, centre(m));
  }
});

for (const type of ["pointerenter", "focusin"]) {
  document.addEventListener(
    type,
    (e) => {
      const t = e.target.closest?.("[data-pick-theme]");
      if (t && t.dataset.pickTheme !== state.id) preload(t.dataset.pickTheme);
    },
    true,
  );
}

light.addEventListener("change", () => state.mode === "system" && render());

// A screenshot became visible (feature tabs): give it the current theme.
document.addEventListener("vd:shown", () => swapShots(state.id, schemeOf(state.mode)));

render({ fade: false });
