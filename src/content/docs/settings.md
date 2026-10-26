---
title: Settings
description: Where every option lives, how to find one, and what the main settings do.
group: Customise
order: 1
---

Open **Settings** with **Cmd+,**, or run **Open settings** from the command palette. Every setting is also a line in [`config.toml`](/docs/configuration/), and the two stay in sync.

## Pages and search

The sidebar lists the pages: General, Appearance, Page, Interface, Drawing, Tools, Files, Links, History and Hotkeys. From the next release there is also a Control page. Type in the search box to find a row by name, description or config key (for example `autosave` or `sort`). **Esc** clears the search, and the next **Esc** closes Settings.

Each page also has a palette command: `Settings: Files`, `Settings: Tools`, `Settings: Hotkeys` and so on.

## Global or this vault

The switch at the top of Settings chooses which layer you edit:

- **Global** applies to every vault. It saves to `config.toml` in 0.1.2; from the next release it saves to `overrides.toml` and leaves `config.toml` alone (see [Layers](/docs/configuration/#layers)).
- **This vault** edits only the settings that can differ per vault, and saves them in the vault. Each row shows "Inherited from global" until you change it, then "Overridden" with a **Reset to global** button.

The switch is hidden when no vault is open, and **This vault** is disabled for a read-only vault. See [Per-vault settings](/docs/per-vault-settings/) for which settings it covers.

## Config file buttons

On the General page:

- **Open config folder** opens the folder that holds `config.toml` and `themes/`.
- **Reload** re-reads it. You rarely need this, because saved changes apply live.

If the file has a mistake, the app keeps your last good settings and shows a banner with the line number. See [config.toml reference](/docs/configuration/).

> **Next release.** **General → Config files** lists `config.toml` and `overrides.toml` with their paths and status, an **Open** button each, **Reload**, **Check** and **Reset all Settings changes**. A chip beside a setting says whether its value comes from `config.toml` or `overrides`, with a **Reset to config.toml value** action. See [Where a value comes from](/docs/configuration/#where-a-value-comes-from) and [Check your config](/docs/configuration/#check-your-config).

## Control and AI

> **Next release.** Not in the current download yet.

**Control** has the AI switch (`ai.enabled`, off by default), the AI tools interface under it (`ai.mcp_enabled`), and **Edit notices** (`control.notify_edits`), which shows a notice when a script or AI tool edits the drawing. Turning AI on first shows what an AI app you connect can read and where it sends it. See [AI](/docs/configuration/#ai).

## Accent colour

**Appearance → Accent** replaces the theme's primary colour in light and dark mode. Pick a swatch or enter a hex value. If the colour would be hard to read on the theme, Vaultdraw nudges it until it is, and Settings shows "Adjusted for contrast" with the colour actually used. **Reset**, or an empty value, goes back to the theme's own. Key: `appearance.accent_color`.

## Interface zoom

**Interface → Interface Zoom** scales the whole window from 50 % to 200 %. **Cmd+Shift+`+`**, **`-`** and **`0`** step by 10 and reset to 100 %. Plain **Cmd+`+`**, **`-`** and **`0`** still zoom the canvas, as in Excalidraw. Key: `interface.zoom`.

## Memory

> **Next release.** Not in the current download yet. It is merged in the app and comes with the next version.

**Interface → Memory** has two settings. Deleted images keep their data in memory while an undo step could bring them back. Once none can, Vaultdraw frees it, about 20 seconds after you stop editing. Typing and drawing never wait for it, and saved drawings do not change.

- **Free unused images** (`memory.free_unused_images`, on by default). Turn it off to keep image data until the drawing closes.
- **Undo steps** (`memory.undo_steps`, 1000 by default, 10 to 10000). How many undo steps a drawing keeps. Older steps are dropped, and with them the images only they could restore. Restoring an older version from [History](/docs/history/) still brings its images back.

The palette command `Memory: Free unused images` does it now and shows how much it freed.

## Navigator sort order

**Interface → Navigator Sort Order**, or the sort button in the navigator toolbar. Four orders: name A to Z, name Z to A, modified new to old, modified old to new. Folders always come first. Names compare ignoring case and by number, so "Drawing 2" comes before "Drawing 10". Key: `navigator.sort`.

## Key group names

> **Next release.** Not in the current download yet.

**Hotkeys → Key group names** names a group of key sequences, such as `<leader> f` = "file". The which-key popup shows the name. Add, rename or remove a name; Settings writes `[keys.labels]` and keeps your comments and order. See [Keyboard](/docs/keyboard/#key-sequences-leader-and-which-key).

## Confirm before delete

**Files → Confirm before trashing** is on by default. Turn it off and "Move to Trash" acts immediately. It only affects moving to Trash, which you can undo from the macOS Trash. Key: `files.confirm_delete`.

## Default folder for new drawings

**Files → New drawing folder** takes a path relative to the vault root, such as `Sketches/Inbox`. The folder is created if it doesn't exist. Empty, the default, puts a new drawing next to the open drawing. Key: `files.new_drawing_folder`.

> **Tip:** Other pages are covered where they belong: [Themes](/docs/themes/), [Keyboard and commands](/docs/keyboard/), [Tool defaults](/docs/tool-defaults/), [Page mode](/docs/page-mode/), [Links](/docs/links/), [History](/docs/history/) and [PDF import](/docs/pdf-import/).
