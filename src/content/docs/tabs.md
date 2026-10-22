---
title: Tabs
description: Open several drawings at once, pin them, reorder them and get them back next time.
group: Using Vaultdraw
order: 2
---

A tab strip above the canvas holds your open drawings, like a browser or Obsidian. A drawing that is already open just gets focus, so there is one tab per drawing.

## Opening drawings

- **Click** a drawing in the navigator: it replaces the current tab.
- **Cmd+click** or **middle-click**: opens it in a new tab.
- **Pinned tabs** are never replaced. Opening a drawing from a pinned tab uses a new tab.
- **Links** open in the current tab with Cmd+click. Add **Shift**, or use middle-click, to open the link in a new tab. In the graph view, Cmd+click or middle-click a node.
- The command **Open drawing in new tab…** picks a drawing from the palette.

If you prefer browser style, set `tabs.open_from_navigator = "new"` in [config.toml](/docs/configuration/).

## Pinning and reordering

- **Pin or unpin tab** (from the tab menu or the palette) keeps a tab at the front, with no close button.
- **Drag** a tab to reorder it, or use **Move tab left/right**. Pinned and unpinned tabs stay in their own groups.
- **Close others**, **close to the right** and **close all** leave pinned tabs open.

## Tab menu and open tabs list

Right-click a tab for its menu: close, close others, pin, copy path, reveal in navigator.

**Cmd+Shift+A** shows a list of open tabs you can search. It is also what a narrow window uses when tabs no longer fit.

## Back and forward

Each tab has its own back and forward history, so following a link and going back works inside that tab.

## Undo

Each tab keeps its scroll, zoom and undo history. Switch away and back, and **Cmd+Z** still works. Undo never reaches into a different drawing. Undo history for background tabs is capped (`tabs.undo_budget_mb`, 32 MB by default) to keep memory low.

## Tabs come back

When you reopen a vault, its tabs come back. Only the visible tab loads at startup. The tab list is stored outside the vault, so nothing extra is written into your folder. Turn this off with `tabs.restore = false`.

## Keys

| Action | Key |
| --- | --- |
| New tab | Cmd+T |
| Close tab | Cmd+W |
| Reopen closed tab | Cmd+Shift+T |
| Go to tab 1 to 8, last tab | Cmd+1 to Cmd+8, Cmd+9 |
| Next / previous tab | Cmd+Shift+] / Cmd+Shift+[ |
| Switch to last used tab | Ctrl+Tab |
| Move tab left / right | Cmd+Option+Shift+[ / ] |
| Show open tabs | Cmd+Shift+A |

Every tab action is a palette command (they start with **Tabs:**) and can be rebound in **Settings → Hotkeys**. **Cmd+W** does not close pinned tabs unless `tabs.close_pinned = true`.

## Options

All options live in the `[tabs]` table of [config.toml](/docs/configuration/).

| Key | Default | Meaning |
| --- | --- | --- |
| `enabled` | `true` | `false` = one drawing at a time |
| `show_strip` | `"always"` | `"never"` = switch with the keyboard only |
| `open_from_navigator` | `"current"` | `"new"` opens each click in a new tab |
| `focus_new` | `true` | Switch to a drawing opened in a new tab |
| `new_tab_position` | `"after_active"` | or `"end"` |
| `ctrl_tab` | `"mru"` | `"order"` = strip order |
| `close_pinned` | `false` | Allow Cmd+W to close pinned tabs |
| `restore` | `true` | Reopen the open tabs when a vault opens |
| `undo_budget_mb` | `32` | Undo history kept for background tabs, 0 to 1024 |
