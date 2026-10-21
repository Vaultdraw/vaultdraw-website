---
title: Themes
description: Built-in palettes, light and dark, syncing the canvas, and adding your own.
order: 7
---

A theme colours the whole app: the file tree, header, Settings, and Excalidraw's own toolbars, menus and dialogs. Every theme has a dark and a light variant, so theme and mode are chosen separately in **Settings → Appearance**, or in `config.toml`:

```toml
[appearance]
theme = "Tokyo Night"   # name, case-insensitive
mode = "system"         # light | dark | system
sync_canvas = true
```

Vaultdraw ships Noctalia's palettes and the Noctalia community collection. You can also pick one from the palette: `Theme: Nord`. The [theme grid on the home page](/#themes) shows them all; click one to try it on this site.

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
