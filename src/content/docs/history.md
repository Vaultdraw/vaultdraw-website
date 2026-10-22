---
title: File history
description: Automatic versions, checkpoints, time travel and restore.
group: Using Vaultdraw
order: 9
---

Vaultdraw keeps earlier versions of every drawing, so "I ruined this an hour ago" is a two-click fix.

## Opening it

Press **Cmd+Shift+H**, click the history button in the header, or choose **History** in a drawing's **⋯** menu. The panel lists versions newest first, each with a thumbnail and why it was taken: automatic, on close, before an outside change, before a restore, or a checkpoint you named.

**Time travel** expands the panel into a full view: scrub through versions with the slider, with the changes since the previous version highlighted.

## Versions and checkpoints

- **Automatic versions** are taken while you work, every five minutes by default.
- **Checkpoints** are versions you make on purpose and can name ("before the review").
- A version is also taken before anything replaces the drawing: an outside change, a restore, discarding edits.

Older versions are thinned out: by default every version from the last hour is kept, then one per hour for a day, then one per day for 30 days, within a 500 MB size cap. All of this is in **Settings → History**, globally or per vault.

## Restoring

From a version you can restore it (the current drawing is versioned first, so restoring is undoable), restore it as a copy, export it as a `.excalidraw` file or an image, or copy the selected elements out of it.

## Where it is stored

History lives inside the vault, in `.excalidraw-vault/history/`, so it travels and syncs with the folder. It follows a drawing when you rename or move it; a duplicate starts fresh. Moving a drawing to Trash keeps its history hidden for seven days, so putting the file back brings its history back too.

In a vault that is a git repository, the panel offers once to add the history folder to `.gitignore`. It never changes `.gitignore` without that click.
