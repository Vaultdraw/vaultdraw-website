---
title: Privacy and your data
description: What Vaultdraw stores, where it stores it, and what it never does.
group: About
order: 1
---

Vaultdraw has no account, no cloud and no telemetry. Fonts and assets are bundled, and Mermaid diagrams, formulas and PDF pages are converted on your computer. Your drawings never leave the folder. See [Network](#network) for the few features that use the internet and the one switch that turns them off.

## Where your data lives

```mermaid
flowchart TB
  subgraph V["Your vault folder"]
    D[".excalidraw drawings"]
    H[".excalidraw-vault/: settings, history, recovery"]
  end
  subgraph C["Config folder ~/.config/vaultdraw"]
    T["config.toml, themes, templates, library"]
  end
  subgraph S["State folder ~/.local/state/vaultdraw"]
    I["search index, thumbnails, recent vaults"]
  end
```

*Drawings and their history live in your vault. Your settings live in the config folder. Caches live in the state folder.*

| Folder | Holds | Safe to delete? |
| --- | --- | --- |
| Your vault | Your drawings, plus `.excalidraw-vault/` with the vault's settings, [file history](/docs/history/) and crash recovery | It is your data |
| `~/.config/vaultdraw/` | `config.toml`, themes, global templates, your personal library | Resets your settings |
| `~/.local/state/vaultdraw/` | Search index, thumbnails, graph layout, recent vaults, open tabs | Yes, it is rebuilt |

Nothing leaves your Mac unless you put the vault in a folder that syncs, such as iCloud Drive or Dropbox. That choice is yours.

## Open formats

Drawings are standard `.excalidraw` JSON, settings are TOML, and themes are JSON. You can read, back up or move all of it without Vaultdraw.

## Plugins

[Plugins](/docs/plugins/) run with full access inside the app. Only enable plugins you trust. With no plugins enabled, the plugin host isn't loaded.

Each plugin is gated by a permission prompt, and a plugin that has never run always asks first. Community plugins cannot take an official plugin's id. After two crashed launches in a row the app starts with no plugins. The official plugins are bundled, on by default and switchable; the community plugin list does not exist yet.

## Network

The internet is on by default and nothing asks first. Vaultdraw uses it only for features you use: browsing and installing community themes and plugins, and showing the pictures of a web page you import or paste. About fifteen seconds after the app starts it also asks GitHub once whether a newer version exists, and shows a small notice only if there is one. There is no telemetry and nothing else runs in the background.

**Offline mode** turns all of that off in one place: **Settings → General → Offline mode**, the palette command **Offline mode: on or off**, or `network.offline = true` in `config.toml`. While it is on, a small **Offline** badge sits in the header, no request leaves the app, and each feature says why it is off. You can also turn off one thing: the update check (`updates.check_on_startup`), theme downloads, the plugin list or web pictures (`network.allow_*`). See [Configuration](/docs/configuration/).

## Data safety

- Quitting, closing the window and switching vault write every open note first.
- Renaming or moving a drawing onto a name that differs only by accent or Unicode form can no longer replace another file.
- Saving never replaces a read-only or Finder-locked drawing. Such files open in view mode with **Save a copy**.
- Repeated failed saves keep one recovery copy per drawing, so recovery storage does not fill up.
- `vaultdraw://cmd` links run only an allow list of safe commands.
- Downloads (themes, the plugin list, web pictures) use only public addresses, with size limits and timeouts, and themes and plugins are checked against a checksum.

## Open source

The code is MIT licensed on [GitHub](https://github.com/Vaultdraw/vaultdraw), so you can check all of this yourself.
