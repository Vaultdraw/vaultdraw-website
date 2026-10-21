---
title: Your vault
description: Files, folders, autosave, recovery and what happens when something else edits a drawing.
order: 2
---

A vault is a folder. Folders in it are real directories and drawings are ordinary `.excalidraw` files, the same format excalidraw.com saves. You can back the folder up, sync it or move it however you like.

## The navigator

The file tree on the right lists the vault. It loads folders lazily, so very large vaults open quickly, and it can be resized or hidden (**Cmd+\\**).

- Create, rename, duplicate and move drawings and folders from the toolbar or a row's **⋯** menu.
- Drag drawings and folders onto a folder, or onto the root, to move them.
- **Move to Trash** uses the system Trash, so it can be undone from there. Turn off the confirmation in **Settings → Files**.
- The sort button orders by name or by date modified. Folders always come first, and names compare by number, so "Drawing 2" comes before "Drawing 10".

## Saving

- **Autosave.** Every edit is written about half a second after you stop. The delay is `saving.autosave_delay_ms` in [config.toml](/docs/configuration/).
- **Atomic writes.** A drawing is never half-written: the file on disk is either the old version or the new one. Each write also checks the file hasn't changed since it was read.
- **Crash recovery.** If the app quits before an edit reaches the disk, the edit is offered back on the next launch.
- **Flush on quit.** Quitting waits for pending saves.

## Changes from outside

Sync tools, git and other editors may change your files while Vaultdraw is open. Vaultdraw watches the vault and reloads a drawing that changed on disk. If you had unsaved edits to it, it asks what to keep instead of overwriting either version.

Only one copy of Vaultdraw writes to a vault at a time. A second one opens the same vault read-only.

## Templates

A template is an ordinary drawing in `Templates/` at the vault root (change the folder in **Settings → Files**), or in `templates/` in the config folder to share it across vaults. **New from template…** (Cmd+Option+N) shows them with thumbnails. A drawing made from a template gets fresh element ids, so it never shares anything with the original.

To make one, choose **Save as template…** in a drawing's **⋯** menu.

## Compatibility

Files stay plain Excalidraw. Vaultdraw's extras live in places other apps ignore: page setup and paper style in the drawing's `appState`, links as ordinary `[[text]]`, history and settings beside the drawing in `.excalidraw-vault/`. Opened on excalidraw.com, a drawing shows everything but those extras; saving it there drops the paper pattern.
