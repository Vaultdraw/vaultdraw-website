---
title: Tool defaults
description: Give each drawing tool its own starting style, so a dotted orange arrow is one keypress away.
group: Customise
order: 6
---

Each tool can start with its own style: rectangle, diamond, ellipse, arrow, line and text. Pens and the laser have their own settings, covered in [Pens, laser and libraries](/docs/drawing-tools/).

## How it behaves

- **Picking a tool applies its default.** Only the keys you set apply. Everything else keeps the current style.
- **Tools remember.** Each tool keeps the style you last used it with until you quit, across drawings. Set the arrow to dashed red, draw a rectangle, pick the arrow again and it is still dashed red.
- **Nothing leaks.** Leaving a tool puts the shared style back, so an arrow's orange never reaches the next rectangle.
- **Text follows the Text tool** however you create it: double-clicking the canvas, labelling a shape or pasting. Editing existing text never restyles it.

## Set a default

- **In Settings:** **Settings → Tools** has a tab per tool with a live preview. Each value has a **Default** choice that unsets it, and **Reset** clears the tool. A dot marks the tools you changed.
- **From the canvas:** select a shape (or just pick a tool) and run `Tool defaults: Save current style for this tool`. `Tool defaults: Reset Arrow` removes the arrow's defaults.
- **Per vault:** turn on **This vault** to store the tool's style in the vault. See [Per-vault settings](/docs/per-vault-settings/).

## In config.toml

One table per tool, in `config.toml` or a vault's `settings.toml`:

```toml
[tools.arrow]
stroke_color = "#f08c00"
stroke_width = 3            # px, 0.5 to 40
stroke_style = "dotted"     # solid | dashed | dotted
end_arrowhead = "triangle"
```

| Key | Tools | Values |
| --- | --- | --- |
| `stroke_color`, `background_color` | all (background: not arrow or text) | `"#f08c00"` or `"transparent"` |
| `fill_style` | rectangle, diamond, ellipse, line | `hachure`, `cross-hatch`, `solid`, `zigzag` |
| `stroke_width` | all but text | 0.5 to 40 |
| `stroke_style` | all but text | `solid`, `dashed`, `dotted` |
| `roughness` | all but text | 0 architect, 1 artist, 2 cartoonist |
| `roundness` | rectangle, diamond, line | `sharp`, `round` |
| `opacity` | all | 1 to 100 |
| `arrow_type` | arrow | `sharp`, `round`, `elbow` |
| `start_arrowhead`, `end_arrowhead` | arrow | an arrowhead name, such as `arrow`, `bar`, `circle`, `triangle`, `diamond`, or `none` |
| `font_family`, `font_size`, `text_align` | text | a font id (as in `[editor]`), 4 to 400, `left` / `center` / `right` |

An unknown key or bad value turns that tool's defaults off and shows a notice naming the key. Nothing is written into your drawings: new elements just get the style.
