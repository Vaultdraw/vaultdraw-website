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
- **Keys (next release).** Press **Cmd+Option+F** to focus the tree, then `j`/`k` to move, `h`/`l` to close and open folders and Enter to open. See [file tree and list keys](/docs/keyboard/#file-tree-and-list-keys).
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

## Back up and restore

> **Next release (0.2.0).** Not in the current download ({{version}}) yet.

A backup is one zip of your vault that you can keep anywhere. It is made in the background, checked after it is written, and never changes the vault. Nothing runs on a schedule unless you turn it on.

1. Run **Vault: Back up vault…** (or Settings → General → Backup) and pick a folder outside the vault. The zip is `<vault name> backup <date>.zip`.
2. To restore, run **Vault: Restore from backup…**, pick the zip, then a folder. It is extracted into a new folder, never over anything that exists, and you can then open it as a vault.
3. From Terminal, without the app: `vaultdraw backup` and `vaultdraw restore <zip> <dir>`.

The zip holds your drawings, notes, attachments and folders, and by default the vault's settings. File history is left out unless `backup.include_history` is on. Other dot-folders and symbolic links are never included. After writing, the zip is read back and each file's checksum is compared, and a zip that fails is deleted.

`backup.every` (`"off"`, `"daily"` or `"weekly"`), `backup.folder` and `backup.keep` (default 5) set up scheduled backups. A plain zip is limited to under 4 GiB and 65,534 files; a bigger vault is refused with a message.

## Vaults in synced folders

> **Next release (0.2.0).** Not in the current download ({{version}}) yet.

A vault can live in iCloud Drive, Dropbox, Syncthing or OneDrive. Vaultdraw never overwrites a file a sync service changed behind its back: a save checks the file's revision, and a changed file shows the usual conflict banner.

- Conflict copies (`name (conflicted copy …)`, `name.sync-conflict-…`, iCloud's `name 2`) show in the file tree with a `conflict` badge (`sync.conflict_badge`). They are never merged or deleted by themselves.
- In a conflict copy's **⋯** menu, **Compare with original…** shows both versions side by side. Keeping one saves the other in History and moves the conflict copy to the Trash.
- Temporary files such as `x.tmp` and `.syncthing.*` stay out of the tree, search and watcher.

Compare and keep work for `.excalidraw` drawings. OneDrive's `name-COMPUTER.ext` copies are not recognised.

## Read-only drawing files

> **Next release (0.2.0).** Not in the current download ({{version}}) yet.

A drawing whose file has no write permission, or is Locked in Finder, opens in view mode with a banner and a **Save a copy** button. Saving over such a file is refused. Make the file writable and the banner lifts on its own.

## Read-only vault

Only one copy of Vaultdraw writes to a vault at a time. If a vault cannot be written (another copy of Vaultdraw holds it, or the folder is not writable), it opens read-only and the app says why. Fix the cause, then run **Retry opening vault writable** from the palette.

## Switching vault

Run **Open another vault** from the palette. Vaultdraw remembers recent vaults, and each vault keeps its own tabs and settings.

## Compatibility

Files stay plain Excalidraw. Vaultdraw's extras live in places other apps ignore: page setup and paper style inside the drawing's `appState`, links as ordinary `[[text]]`, and history and settings in `.excalidraw-vault/`. Opened on excalidraw.com, a drawing shows everything except those extras, and saving it there drops the paper pattern.
