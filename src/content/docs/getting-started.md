---
title: Getting started
description: Install Vaultdraw, pick a folder, make your first drawing.
order: 1
---

Vaultdraw is a desktop app. It runs on macOS today; Windows and Linux builds are planned.

## Install

The first signed macOS build is not out yet. Until it is, build the app from source. You need Node 18 or newer, Yarn 1 and the [Rust and Tauri prerequisites](https://tauri.app/start/prerequisites/).

```sh
git clone https://github.com/Vaultdraw/vaultdraw
cd vaultdraw
yarn install
yarn desktop:build
```

The packaged app lands in `excalidraw-desktop/src-tauri/target/release/bundle/`. To run it in development mode instead, use `yarn start`.

## Open a vault

On first launch Vaultdraw asks for a folder. Any folder works: an empty one, one that already holds `.excalidraw` files, or a folder inside iCloud Drive, Dropbox or a git repository. That folder is now your vault, and Vaultdraw reopens it next time.

Nothing is copied or converted. The navigator on the right shows the folder as it is on disk, and every change you make there (new, rename, move, duplicate, move to Trash) happens to the real files.

## Draw

- **Cmd+N** makes a new drawing next to the one that is open.
- **Cmd+P** opens any drawing by name. Type a few letters in order: `rft` finds `Raft`.
- **Cmd+Shift+P** runs any command, from editor actions to themes and export.

There is no save button to remember. Half a second after you stop, the drawing is written to disk. Cmd+S still works if you like pressing it.

## Where things live

| What | Where |
| --- | --- |
| Your drawings | The vault folder, as `.excalidraw` files |
| This vault's settings and history | `<vault>/.excalidraw-vault/` |
| Your settings and themes | `~/.config/vaultdraw/` on macOS and Linux, `%APPDATA%\Vaultdraw` on Windows |
| Search index, window state | `~/.local/state/vaultdraw/` (safe to delete) |

Next: [your vault](/docs/vault/) explains what Vaultdraw does to keep those files safe.
