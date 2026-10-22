---
title: Page mode and paper
description: Draw on A4, Letter or custom pages, pick a paper pattern, and export the pages as one PDF.
group: Using Vaultdraw
order: 10
---

A drawing can be an infinite canvas (**Normal**) or simulated paper (**Page**), like a notes app. Pages have a fixed width, you scroll down, and the view always fits the page width.

## Turn it on

Open the canvas menu and choose **Page** to set up the open drawing, or run `Page mode: On` from the command palette. **Settings → Page** sets the defaults for new drawings.

| Option | Choices |
| --- | --- |
| Layout | **Separate pages** (sheets with a gap; drawing near the end adds a page) or **Continuous** (one long page that grows) |
| Size | A3, A4, A5, B5, Letter, Legal, iPad 11-inch and 13-inch, Phone, or a custom size in pixels |
| Orientation | Portrait or landscape |
| Paper theme | **Normal** (white), **Old school** (cream, blue lines, red margin) or **Match current theme** |

## Drawing on pages

- You can't start a stroke, drag or paste outside the pages. With separate pages, a shape stays on its own page.
- **PageUp** and **PageDown** jump between pages.
- Switching an existing drawing to page mode keeps everything. Content outside the pages stays visible, and **Fit content to page** moves it in.

## Paper patterns

Any drawing, in page mode or not, can sit on paper: plain, grid, ruled lines (with a margin line), dots, graph paper or isometric. The pattern scrolls and zooms with the drawing.

- **For one drawing:** choose **Paper** in the canvas menu, or **Paper settings…** to tune spacing, colour, opacity and major lines.
- **For new drawings:** **Settings → Appearance → Background Pattern**, or the `[paper]` table in [config.toml](/docs/configuration/#paper).
- **Make app default** uses the open drawing's paper for new drawings. **Use app default** goes back.

## Export a PDF

Run **Export: PDF**, or choose **Export as PDF…** in a drawing's menu in the file tree. Each page becomes one PDF page, made offline. A continuous page is split at the page size. PNG and SVG exports have a **Page shape** switch to export whole pages. See [Export](/docs/export/).

## In the file

Page setup and paper pattern are saved inside the drawing, so it reopens the same. excalidraw.com opens the file as a normal canvas with a plain background, and saving it there drops the paper pattern.

## Commands

Every option is a palette command you can bind a key to: `Page mode: On/Off/Toggle`, `Page layout: Continuous`, `Page size: A4`, `Page orientation: Landscape`, `Paper theme: Old school`, `Page setup…`, `Fit content to page`, `Next page`, `Previous page` and `Export: PDF`.
