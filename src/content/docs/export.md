---
title: Export
description: Export PNG, SVG or PDF, copy an image to the clipboard, or save a copy of the drawing.
group: Using Vaultdraw
order: 12
---

Exports always use Excalidraw's standard colours, even with **Sync canvas with theme** on, so they look the same to everyone.

## Export an image

Press **Cmd+Shift+E** (**Export image…**) to open the export dialog.

| Option | Choices |
| --- | --- |
| Format | PNG or SVG |
| Scale | 1x, 2x or 3x |
| Background | On or off. **Background pattern** adds the paper, for drawings that have one |
| Dark mode | Export the dark version |
| Embed scene | Saves the drawing inside the image (`.excalidraw.png` or `.excalidraw.svg`), so it can be opened and edited again |
| Only selected | Export just the selection |
| Page shape | In page mode, export whole pages |

Vaultdraw remembers your last scale, background and embed choices.

## Copy to the clipboard

**Copy PNG** and **Copy SVG** are in the export dialog and in the canvas right-click menu. On macOS the image goes to the system clipboard, ready to paste into other apps.

## From the file tree

Right-click a drawing in the file tree, or open its **⋯** menu:

- **Export as PNG…** and **Export as SVG…** export without opening the drawing.
- **Export as PDF…** exports the pages of a [page-mode](/docs/page-mode/) drawing.
- **Save a copy…** copies the `.excalidraw` file anywhere you choose.

These work in read-only vaults too.

## Commands

`Export: PNG`, `Export: SVG`, `Export: PDF` and `Save a copy` are palette commands, so you can give each its own key in **Settings → Hotkeys**.

Older versions can be exported from [File history](/docs/history/).
