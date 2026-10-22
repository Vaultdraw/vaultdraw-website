---
title: Settings
description: Where every option lives, how to find one, and what the main settings do.
group: Customise
order: 1
---

Open **Settings** with **Cmd+,**, or run **Open settings** from the command palette. Every setting is also a line in [`config.toml`](/docs/configuration/), and the two stay in sync.

## Pages and search

The sidebar lists the pages: General, Appearance, Page, Interface, Drawing, Tools, Files, Links, History and Hotkeys. Type in the search box to find a row by name, description or config key (for example `autosave` or `sort`). **Esc** clears the search, and the next **Esc** closes Settings.

Each page also has a palette command: `Settings: Files`, `Settings: Tools`, `Settings: Hotkeys` and so on.

## Global or this vault

The switch at the top of Settings chooses which layer you edit:

- **Global** edits `config.toml`. It applies to every vault.
- **This vault** edits only the settings that can differ per vault, and saves them in the vault. Each row shows "Inherited from global" until you change it, then "Overridden" with a **Reset to global** button.

The switch is hidden when no vault is open, and **This vault** is disabled for a read-only vault. See [Per-vault settings](/docs/per-vault-settings/) for which settings it covers.

## Config file buttons

On the General page:

- **Open config folder** opens the folder that holds `config.toml` and `themes/`.
- **Reload** re-reads it. You rarely need this, because saved changes apply live.

If the file has a mistake, the app keeps your last good settings and shows a banner with the line number. See [config.toml reference](/docs/configuration/).

## Accent colour

**Appearance → Accent** replaces the theme's primary colour in light and dark mode. Pick a swatch or enter a hex value. If the colour would be hard to read on the theme, Vaultdraw nudges it until it is, and Settings shows "Adjusted for contrast" with the colour actually used. **Reset**, or an empty value, goes back to the theme's own. Key: `appearance.accent_color`.

## Interface zoom

**Interface → Interface Zoom** scales the whole window from 50 % to 200 %. **Cmd+Shift+`+`**, **`-`** and **`0`** step by 10 and reset to 100 %. Plain **Cmd+`+`**, **`-`** and **`0`** still zoom the canvas, as in Excalidraw. Key: `interface.zoom`.

## Navigator sort order

**Interface → Navigator Sort Order**, or the sort button in the navigator toolbar. Four orders: name A to Z, name Z to A, modified new to old, modified old to new. Folders always come first. Names compare ignoring case and by number, so "Drawing 2" comes before "Drawing 10". Key: `navigator.sort`.

## Confirm before delete

**Files → Confirm before trashing** is on by default. Turn it off and "Move to Trash" acts immediately. It only affects moving to Trash, which you can undo from the macOS Trash. Key: `files.confirm_delete`.

## Default folder for new drawings

**Files → New drawing folder** takes a path relative to the vault root, such as `Sketches/Inbox`. The folder is created if it doesn't exist. Empty, the default, puts a new drawing next to the open drawing. Key: `files.new_drawing_folder`.

> **Tip:** Other pages are covered where they belong: [Themes](/docs/themes/), [Keyboard and commands](/docs/keyboard/), [Tool defaults](/docs/tool-defaults/), [Page mode](/docs/page-mode/), [Links](/docs/links/), [History](/docs/history/) and [PDF import](/docs/pdf-import/).
