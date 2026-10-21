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

const swapShots = (id, scheme) => {
  for (const fig of document.querySelectorAll("[data-shot]")) {
    const variants = JSON.parse(fig.dataset.variants);
    const key = [`${id}-${scheme}`, `${DEFAULT}-${scheme}`].find((k) => variants[k]);
    const v = variants[key];
    const picture = fig.querySelector("picture");
    if (!v || picture.dataset.current === key) continue;
    picture.dataset.current = key;
    // Drop the no-script light/dark media switch: the script decides now.
    for (const s of picture.querySelectorAll("source[media]")) s.remove();
    picture.querySelector('source[type="image/avif"]').srcset = v.avif;
    picture.querySelector('source[type="image/webp"]').srcset = v.webp;
    picture.querySelector("img").src = v.src;
    fig.dataset.showing = key.startsWith(`${id}-`) ? "theme" : "fallback";
  }
};

const paint = (vars, scheme) => {
  for (const k of Array.from(root.style)) root.style.removeProperty(k);
  if (vars) for (const [k, v] of Object.entries(vars[scheme])) root.style.setProperty(k, v);
};

const render = async ({ fade = true } = {}) => {
  const scheme = schemeOf(state.mode);
  if (fade) {
    root.classList.add("theme-fade");
    setTimeout(() => root.classList.remove("theme-fade"), 450);
  }
  root.dataset.scheme = scheme;
  root.dataset.theme = state.id;
  root.dataset.mode = state.mode;
  paint(state.id === DEFAULT ? null : state.vars, scheme);
  swapShots(state.id, scheme);

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

const pick = async (id) => {
  const theme = await findTheme(id);
  if (!theme) return;
  state = { ...state, id, vars: id === DEFAULT ? undefined : varsFor(theme) };
  write(state);
  render();
};

const MODES = ["system", "light", "dark"];

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-pick-theme]");
  if (t) {
    pick(t.dataset.pickTheme);
    return;
  }
  if (e.target.closest("[data-mode-toggle]")) {
    state = { ...state, mode: MODES[(MODES.indexOf(state.mode) + 1) % MODES.length] };
    write(state);
    render();
  }
});

light.addEventListener("change", () => state.mode === "system" && render());

render({ fade: false });
