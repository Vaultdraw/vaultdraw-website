---
title: Search, links and graph
description: Find text inside every drawing, link drawings like a wiki, and see the whole vault as a graph.
order: 3
---

## Search

Type in the box at the top of the navigator, or press **Cmd+Shift+F** to jump there. Search looks at drawing names and paths, text elements, labels inside shapes and arrows, and frame names.

Results are grouped by drawing with up to five highlighted snippets each. Click a snippet and the drawing opens zoomed to that element, with it selected.

- Case, accents and character width are ignored: `cafe` finds `Café`.
- A term can match inside a word: `graph` finds `Dijkstra graphs`.
- Every word must appear in the drawing, but not necessarily in the same element.
- Chinese, Japanese and Korean text is searched as written.

The index lives in the state folder, never in your vault. It is rebuilt when missing and safe to delete.

## Links

Type `[[Name]]` in any text: free text, shape labels or arrow labels. `[[Name|label]]` shows a different label, and `[[Folder/Name]]` picks between two drawings with the same name. Typing `[[` opens a list of drawings that narrows as you type; its last row creates a new drawing.

On the canvas a link is drawn in the link colour and underlined. The file still stores plain `[[Name]]` text, so the drawing reads the same anywhere else.

- **Cmd+click** a link to open it. **Option+Cmd+←** and **→** go back and forward.
- **Shift+F** puts a letter on every visible link; type it to follow the link.
- **Option+Cmd+K** links the selected shape to a drawing.
- Hover a link for a moment to preview the drawing it points to.

Rename or move a drawing inside Vaultdraw and every link to it is updated, in every drawing. A toast says how many.

### Backlinks

**Option+Cmd+B** shows the backlinks panel under the navigator: the drawings that link here, the links going out, and unlinked mentions of this drawing's name.

## Graph view

**Option+Cmd+G** shows every drawing as a dot and every link as a line. **Option+Cmd+L** shows the local graph: the open drawing and those within one to three links of it.

Dots with more links are bigger, drawings in the same top-level folder share a colour, and links to drawings that don't exist yet are hollow. Drag a dot and its neighbours follow; scroll to zoom.

| Key | Action |
| --- | --- |
| h j k l, or arrows | Move to the nearest dot |
| Enter | Open the drawing |
| F | Put a letter on every dot |
| / | Filter: a name, `path:Folder` or `tag:#x` |
| Shift+L | Global or local |
| 1 2 3 | Local depth |
| Esc | Back to the drawing, where you left it |

The layout is computed off the main thread and saved, so the graph reopens in the same shape.
