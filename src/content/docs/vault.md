---
title: Vault and files
description: "How Vaultdraw treats your folder: the navigator, autosave, crash recovery and changes made outside the app."
group: Using Vaultdraw
order: 1
---

A vault is a folder. Folders in it are real directories, and drawings are ordinary `.excalidraw` files, the same format excalidraw.com saves. You can back the folder up, sync it or move it however you like.

## The navigator

The file tree lists the vault. It loads folders lazily, so large vaults open quickly. Show or hide it with **Cmd+\\**.

- **Create, rename, duplicate, move.** Use the toolbar, a row's **⋯** menu or the command palette. A folder's menu has **New folder**.
- **Drag and drop.** Drag drawings and folders onto a folder, or onto the root, to move them.
- **Move to Trash.** Uses the system Trash, so you can undo it from there. Turn off the confirmation in **Settings → Files**.
- **Sort.** By name or by date modified, from the sort button or the **Sort:** commands. Folders always come first, and numbers sort naturally, so "Drawing 2" comes before "Drawing 10".
- **Reveal in Finder.** Run **Reveal drawing in Finder** or **Reveal vault folder** from the palette.

## New drawings and Finder files

**Cmd+N** makes a new drawing next to the one that is open. To change that, set **Settings → Files → New drawing folder** to a folder inside the vault. Leave it empty for "next to the open drawing".

Drag files from Finder onto the canvas to place them in the drawing. Dropping a PDF opens the [PDF import](/docs/pdf-import/) dialog. **Import file** in the canvas right-click menu places images at the point you clicked.

## Saving

```mermaid
flowchart LR
  A["Open"] --> B["Edit"]
  B --> C["Autosave"]
  C --> D["File history"]
  C --> B
```

*A drawing is opened and edited. Each pause in editing triggers an autosave, and saves feed the file history.*

- **Autosave.** Edits are written about half a second after you stop. The delay is `saving.autosave_delay_ms` in [config.toml](/docs/configuration/). **Cmd+S** still works.
- **Atomic writes.** A drawing is never half-written: the file on disk is either the old version or the new one. Each write also checks that the file has not changed since Vaultdraw read it.
- **Flush on quit.** Quitting waits for pending saves.
- **History.** Earlier versions are kept so you can go back. See [File history](/docs/history/).

## Crash recovery

Before each save, Vaultdraw writes a snapshot of the edit to `.excalidraw-vault/recovery/` inside the vault, and removes it once the save succeeds. If the app quits before an edit reaches the file, the edit is still there.

Two commands help:

- **Open recovered drawings** opens what was recovered.
- **Reveal recovery folder** shows the folder in Finder.

## Changes from outside

Sync tools, git and other editors may change your files while Vaultdraw is open. Vaultdraw watches the vault and reloads a drawing that changed on disk. If you had unsaved edits to it, it asks what to keep instead of overwriting either version. A version of your drawing is saved to history before an outside change is applied.

## Read-only vault

Only one copy of Vaultdraw writes to a vault at a time. If a vault cannot be written (another copy of Vaultdraw holds it, or the folder is not writable), it opens read-only and the app says why. Fix the cause, then run **Retry opening vault writable** from the palette.

## Switching vault

Run **Open another vault** from the palette. Vaultdraw remembers recent vaults, and each vault keeps its own tabs and settings.

## Compatibility

Files stay plain Excalidraw. Vaultdraw's extras live in places other apps ignore: page setup and paper style inside the drawing's `appState`, links as ordinary `[[text]]`, and history and settings in `.excalidraw-vault/`. Opened on excalidraw.com, a drawing shows everything except those extras, and saving it there drops the paper pattern.
