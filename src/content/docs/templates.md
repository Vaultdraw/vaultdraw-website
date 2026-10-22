---
title: Templates
description: Start new drawings from a template, for the layouts you use over and over.
group: Using Vaultdraw
order: 4
---

A template is an ordinary `.excalidraw` file, so any drawing can become one and you can edit a template like any other drawing.

## Where templates live

| Kind | Folder | Used by |
| --- | --- | --- |
| **Vault templates** | `Templates/` at the vault root | that vault |
| **Global templates** | `templates/` in the config folder (`~/.config/vaultdraw/templates/`) | every vault |

Change the vault folder in **Settings → Files → Templates Folder** (`files.templates_folder`). Like other per-vault settings it can be stored in `<vault>/.excalidraw-vault/settings.toml`.

## Start from a template

1. Press **Cmd+Option+N**, or click **New from template…** in the header, or use the button in an empty vault.
2. Type to search. Each template has a thumbnail.
3. Move with the arrow keys and press **Enter**.

The picker groups templates as **This vault** and **All vaults**, with a **Blank** row. The new drawing gets fresh element ids, so it never shares them with its template, and it keeps the template's canvas background. In a read-only vault the Blank row is hidden and creating a drawing shows an error.

## Make a template

1. Open the drawing's **⋯** menu in the file tree and choose **Save as template…**.
2. Pick **This vault** or **All vaults**.

Saving never overwrites an existing template: a number is added to the name. In a read-only vault only **All vaults** is offered. You can also run `Templates: Save drawing as template` from the command palette.

Templates are left out of the Recent list. They still show in the file tree.
