import themes from "./themes.json";
import { FEATURED } from "./featured.mjs";

export const SITE = {
  name: "Vaultdraw",
  repo: "https://github.com/Vaultdraw/vaultdraw",
  description:
    "An offline vault for Excalidraw drawings. Pick a folder; every drawing is a plain .excalidraw file. Search, links, history and themes, with no account and no cloud.",
};

/** The theme the site opens in. */
export const DEFAULT_THEME = "rose-pine";

export const THEMES = themes;
export const themeById = (id) => themes.find((t) => t.id === id);

/** Featured themes with their colours, in switcher order. */
export const FEATURED_THEMES = [
  ...FEATURED.filter((f) => f.id === DEFAULT_THEME),
  ...FEATURED.filter((f) => f.id !== DEFAULT_THEME),
].map((f) => ({ ...f, ...themeById(f.id) }));
