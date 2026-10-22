---
title: Mermaid and LaTeX
description: Insert Mermaid diagrams and LaTeX formulas, converted offline on your computer.
group: Using Vaultdraw
order: 13
---

Both work offline: nothing is sent anywhere to convert them.

## Mermaid diagrams

Choose **Insert Mermaid diagram…** in the canvas menu, or run it from the command palette. Type or paste Mermaid text and a preview updates as you type. **Insert** places it on the canvas.

Flowcharts and similar diagrams become normal Excalidraw shapes you can edit. Gantt charts, pie charts and mind maps are inserted as images.

## LaTeX formulas

Run **Formula: Insert formula** from the command palette.

1. Type LaTeX, such as `\int_0^1 x^2\,dx`. The preview updates as you type.
2. Turn on **Display** for a larger, centred formula.
3. Press **Cmd+Enter** to insert.

Pasting `$…$`, `$$…$$`, `\(…\)` or `\[…\]` strips the delimiters. `$$` and `\[` switch on Display.

To change a formula, double-click it, select it and press **Enter**, or run **Formula: Edit formula**. Its position, size and angle stay the same.

## In the file

A formula is saved as a standard image with its LaTeX source kept alongside, so:

- excalidraw.com shows the formula as an image.
- PNG, SVG and PDF exports include it.
- [Search](/docs/search/) finds the source, so `\int` is findable like text.

Formulas added to a library show as broken images, as with any image in a library.
