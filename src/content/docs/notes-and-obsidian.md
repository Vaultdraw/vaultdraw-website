---
title: Notes and Obsidian
description: Open Markdown notes in a tab, open an Obsidian vault in place, or import it as drawings.
group: Using Vaultdraw
order: 12
---

Markdown notes (`.md`) open in a tab next to your drawings. An Obsidian vault is a folder of notes, so it opens as a vault as it is. You can also turn notes into drawings.

## Notes in tabs

Notes are on by default (`[extensions] notes`). Off, nothing of them loads. The reading view and the editor are separate lazy chunks.

- **Reading view.** CommonMark with tables, task lists and coloured code blocks, plus Obsidian's `[[links]]`, `![[embeds]]`, callouts, `#tags`, `==highlights==`, `$math$` and front matter shown as properties. A link to a missing note creates it. The HTML is sanitised, and web images load only if `notes.remote_images` is on, so a note never makes a request by itself.
- **Editor.** CodeMirror with Markdown colouring and optional Vim keys (`notes.vim`). **Cmd+E** switches between reading and editing.
- **Safe saving.** A save checks the revision it read, so a note changed outside the app is never overwritten. A conflict shows **Reload from disk** and **Keep mine**, and every replaced version is kept in `.excalidraw-vault/note-history/`.
- **Quitting.** Cmd+Q, closing the window and switching vault write every open note first.

Links reach a place too: `[[Note#Heading]]` scrolls to the heading, and `[[Note#^block]]` to the paragraph that ends in `^block`. Clicking a task checkbox ticks it; turn that off with `notes.toggle_tasks`. Search reads notes only when `search.notes` is on.

## Markdown mode in drawings

A drawing's text can use Markdown too. With **Markdown mode** on, typing `# ` makes a heading, `- ` a bullet, `> ` a quote and `[ ] ` a task, and `**bold**`, `*italic*` and `` `code` `` are drawn bold, italic or monospaced with the marks hidden. Text already in the drawing converts when you turn the mode on, or with **Markdown: Convert existing text** in the palette (`markdown.convert_on_enable = false` turns the automatic part off). Click a ☐ or ☑ box to tick it. The text keeps its marks, so the file stays plain Markdown.

## Open an Obsidian vault in place

Choose the vault folder with **Open vault**. Your notes, links and tags work where they are, and nothing is converted. Vaultdraw skips the `.obsidian`, `.trash` and `.git` folders.

## Import Obsidian vault

**Import Obsidian vault…** in the main menu turns the notes into page-mode drawings, in a folder of the open vault or in a new vault (**Import Obsidian vault into a new vault…**).

1. Pick the Obsidian vault folder.
2. Pick where it goes: a folder of the open vault, or a new vault.
3. Wait, or press Cancel. It stops after the current file.

What happens:

- The folder structure is kept. `[[links]]` are rewritten to point at the converted drawings, and `![[images]]` are embedded.
- `.excalidraw.md` drawings, plain and compressed, become `.excalidraw` files. Other files are copied.
- The source is only read, and nothing is overwritten. Importing the same vault again goes into a fresh folder (`<Vault> (import 2)`).
- A file that fails, or an image that stays a box, is listed in a drawing named `Import report`. A clean import writes none.

A single `.md` file also imports: use **Import file…**, drop it on the canvas, or use the palette. A long note continues in parts of about 1,000 elements.

## Settings

Notes and import are `config.toml` keys, documented in the [configuration reference](/docs/configuration/). Markdown import is the official `markdown-import` plugin (see [Plugins](/docs/plugins/)); it loads only when you import.

```toml
[plugin.markdown-import]
font = "default"             # "default" or "document"
font_size = 16               # 8 to 72
page_size = "a4"             # a3, a4, a5, b5, letter or legal
part_elements = 1000         # a longer note is split into parts
obsidian_attachments = true  # copy images and other files
obsidian_links = "drawing"   # or "text" to keep links as written
obsidian_excalidraw = true   # convert .excalidraw.md drawings
```
