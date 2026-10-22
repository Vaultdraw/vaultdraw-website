---
title: Control the app
description: Open drawings, run palette commands, manage tabs and watch events in the running app from Terminal.
group: Command line
order: 3
---

These commands talk to the running app. If it isn't running they exit with code 3.

## Status and vault

```bash
vaultdraw status               # running? which vault and drawing
vaultdraw vault                # the open vault: name, path, read-only
vaultdraw vault open ~/Notes   # open another vault
vaultdraw version              # CLI, API and app versions
```

## Open a drawing

```bash
vaultdraw open "Roadmap"            # in the current tab
vaultdraw open "Roadmap" --new-tab
vaultdraw open "Roadmap" --wait     # return when the tab is closed
```

`--wait` makes Vaultdraw usable as an editor from scripts and git: the command returns when you close the drawing's tab or quit the app.

## Run palette commands

Anything in the command palette can be run by id. The ids are the same as in the `[hotkeys]` table.

```bash
vaultdraw cmd list               # every command (works with the app closed)
vaultdraw cmd run vault.newDrawing
vaultdraw cmd vault.newDrawing   # short form
```

## Tabs

```bash
vaultdraw tabs              # list open tabs
vaultdraw tab focus 2       # by position or id
vaultdraw tab close "Roadmap"
```

## Events

`events` streams what happens in the app as one JSON object per line: first a snapshot, then each change.

```bash
vaultdraw events                     # everything
vaultdraw events --topic file,tab    # vault, file, tab, config, command
```

## Quit

```bash
vaultdraw quit
```

Quitting waits for pending saves, the same as **Cmd+Q**.
