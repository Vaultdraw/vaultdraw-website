---
title: PDF import
description: Turn PDF pages into images in a drawing so you can write on them.
group: Using Vaultdraw
order: 11
---

Import a PDF to annotate it: slides, papers, worksheets. Each page becomes an image in the open drawing.

## Import

1. Run **Import: PDF…**, choose **Import PDF…** in the canvas menu, or drop a `.pdf` on the canvas.
2. Pick the pages: `all`, or a range such as `1-5, 8, 10-`.
3. Press **Enter**. Progress shows "Rendering page n of N", and cancelling leaves the drawing untouched.

A password-protected PDF asks for its password in the same dialog. The password is never stored.

## What you get

- The whole import is one undo step.
- Pages are locked, so writing on them doesn't drag them. **Unlock all** frees them.
- In a normal drawing the pages go in a column below what is already there. In [page mode](/docs/page-mode/) each PDF page goes on its own drawing page.

Pages are rendered by macOS, offline, and stored as ordinary images in the drawing, so it still opens on excalidraw.com. The PDF itself is not copied into the vault.

## Large PDFs

A drawing is capped at 32 MiB. Large PDFs are imported at a lower resolution to keep memory low. If a drawing would get too big, the import stops and says how many pages it imported. The dialog warns before importing more than 50 pages.

## Settings

In **Settings → Files**, or the `[pdf_import]` table of [config.toml](/docs/configuration/):

```toml
[pdf_import]
max_side = 1440        # longest side in pixels, 600 to 3000
format = "jpeg"        # jpeg | png
quality = 0.85         # JPEG quality, 0.5 to 1
lock_pages = true      # lock imported pages
warn_pages = 50        # warn above this many pages
pixel_budget_mp = 60   # decoded-pixel budget in megapixels, 10 to 400
```
