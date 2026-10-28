---
title: Themes
description: Built-in palettes, light and dark, syncing the canvas, and adding your own.
group: Customise
order: 4
---

A theme colours the whole app: the file tree, header, Settings, and Excalidraw's own toolbars, menus and dialogs. Every theme has a dark and a light variant, so theme and mode are chosen separately in **Settings → Appearance**, or in `config.toml`:

```toml
[appearance]
theme = "Tokyo Night"   # name, case-insensitive
mode = "system"         # light | dark | system
sync_canvas = true
```

Vaultdraw ships Noctalia's palettes and the Noctalia community collection. You can also pick one from the palette: `Theme: Nord`. The [theme grid on the home page](/#themes) shows them all; click one to try it on this site.

> **Next release.** Only eight built-in themes (Default, Noctalia, Catppuccin, Dracula, Gruvbox, Nord, Rosé Pine and Tokyo Night) are part of the code read at startup. The others load the moment you pick one, and the theme in `config.toml` loads before the first paint, so nothing flashes. The theme code read at startup shrinks from 210 KB to 67 KB.

## Community themes

> **Next release (0.2.0).** The themes browser and installs are not in the current download ({{version}}) yet.

The [Vaultdraw/themes](https://github.com/Vaultdraw/themes) repository holds over a hundred more palettes, credited to their authors. **Settings → Appearance → Install more themes…** (or `Themes: Browse community themes`) opens a grid with previews, author, credit, licence, search and filters, and Install, Update, Use and Remove buttons. It works from the keyboard and loads only when you open it.

- **Asked once.** Downloading is off until you allow it. The first install asks, and the answer is saved as `network.allow_themes`. You can revoke it in **Settings → General**, and `network.enabled = false` turns every download off. Nothing is requested before you open the browser.
- **Checked.** Each theme file is checked against the list's SHA-256 before it is written. Only https to public hosts is used.
- **From a URL.** **Install from URL…** (`Themes: Install from URL or GitHub repo`) installs one theme file, or lists the themes in a GitHub repo, into your `themes/` folder.
- **Offline.** The list is cached and shown offline with a notice. Installed themes are plain files you keep.

## Sync canvas with theme

With **Sync canvas with theme** on, the canvas is recoloured on screen: its background becomes the theme's, and the stroke and fill colours from Excalidraw's palette become matching theme colours. Only the display changes. Saved drawings and exports keep Excalidraw's standard colours, so they look the same to anyone who opens them.

## Adding a theme

Themes use the [Noctalia](https://github.com/noctalia-dev/noctalia) palette format, so existing Noctalia palettes work unchanged. Put a `.json` file in `themes/` in the config folder, either as `Midnight.json` or as `Midnight/Midnight.json`. The file name is the theme's name, and a theme with a built-in's name replaces it.

Three colours per variant are enough; everything else is derived, and colours are adjusted where needed so text stays readable:

```json
{
  "dark": { "mSurface": "#1b1d2b", "mOnSurface": "#d8dae8", "mPrimary": "#82aaff" },
  "light": { "mSurface": "#f6f6fa", "mOnSurface": "#2b2d3a", "mPrimary": "#3b6fd8" }
}
```

Leave out `light` or `dark` and it is generated from the other.

| Role | Used for |
| --- | --- |
| `mSurface` | Canvas and app background |
| `mOnSurface` | Text and icons; black and grey strokes on a synced canvas |
| `mPrimary` | Accent: selection, buttons, links, focus rings |
| `mSurfaceVariant` | Tint of the sidebar and header |
| `mOnSurfaceVariant` | Secondary text |
| `mError` | Errors and delete actions; red on a synced canvas |
| `mSecondary`, `mTertiary` | Extra accents for the synced canvas palette |
| `terminal` | Optional ANSI colours, feeding the synced canvas palette |

Themes are data only: colour values, no code. A custom accent (`appearance.accent_color`) can replace any theme's primary colour.

## CSS snippets

> **Next release.** Not in the current download yet.

For what a theme can't do (spacing, fonts, hiding a button, a wider sidebar), add your own CSS, as in Obsidian. Put `.css` files in `snippets/` in the config folder and turn each on in **Settings → Appearance → CSS snippets** or in `config.toml`:

```toml
[appearance]
snippets = ["wide-sidebar", "big-tabs"]   # file names without .css, applied in this order
```

```css
/* snippets/wide-sidebar.css */
.vault-navigator { min-width: 320px; }
```

- Snippets apply after the theme. Theme colours are set inline, so to override a `--vault-*` token add `!important`.
- They reload live: saving a file, adding or removing one, or editing `appearance.snippets` applies at once.
- Files are used as written. One that fails to load (over 256 KiB, not UTF-8, a symbolic link) is skipped and Settings shows why.
- They style the app only. Saved drawings and PNG, SVG and PDF exports do not change.
- They work offline: `@import` is ignored and remote `url(...)` is blocked, so embed images and fonts as `data:` URLs.
- Palette commands: `CSS snippets: Open folder`, `CSS snippets: Reload` and one `CSS snippets: Toggle <name>` per file. All can be rebound.
- With no snippet on, nothing is read before the first frame.

The class names and `--vault-*` tokens are the stable surface; other internal class names can change between versions.
