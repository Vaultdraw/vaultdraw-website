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

## Hand over a link

```bash
vaultdraw uri 'vaultdraw://open?file=Graphs/BFS'
```

Checks a `vaultdraw://` link and gives it to the running app. It prints `done`, or `asking` when the app waits for you. See [Links and files from outside](/docs/links-from-outside/).

## Export a drawing

```bash
vaultdraw export "Roadmap"                    # Roadmap.png in the current folder
vaultdraw export "Roadmap" -o roadmap.svg     # format from the file name
vaultdraw export "Roadmap" -o - --format svg # to stdout
vaultdraw export Projects --out-dir ~/out     # every drawing in a folder
```

Renders a drawing to PNG, SVG or PDF through the running app, with the same result as **Export** in the file tree. The file is named after the drawing and written in the current folder, unless `-o` gives a file or a folder. `-o -` writes to stdout. It never replaces an existing file unless you pass `--force`. Exports run in the background, so you can keep drawing.

| Option | What it does |
| --- | --- |
| `-o <file or folder>` | Where to write the file |
| `--format` | `png`, `svg` or `pdf` |
| `--scale` | Image scale |
| `--dark` | Export the dark version |
| `--no-background` | Leave out the background |
| `--no-pattern` | Leave out the background pattern |
| `--embed-scene` | Save the drawing inside the image so it can be edited again |
| `--page` | Export whole pages |
| `--frame <id or name>` | Export one frame |
| `--padding <px>` | Space around the drawing, 0 to 200 (PNG and SVG) |
| `--force` | Replace an existing file |

PDF takes only `--no-pattern`.

**A folder.** Give a folder (`.` is the whole vault) and `--out-dir <dir>` to export every drawing in it. The subfolders are kept inside `<dir>`. A drawing that fails is reported and the others still export. The exit code is then 2.

Large exports are handed over through a temporary file, so the `vaultdraw` command itself stays small, a few megabytes even for a 32 MiB image.

## Read and edit the drawing on screen

The `scene` commands are experimental: names and shapes may change.

The `scene` commands work on the drawing that is open in the running app.

```bash
vaultdraw scene read --scope selection   # scope: all, viewport or selection
vaultdraw scene get 3fA9kLm2             # elements by id (ids come from scene read)
vaultdraw scene selection                # the selected elements
echo '[{"op":"add","element":{"type":"rectangle","width":120,"height":80}}]' | vaultdraw scene apply
```

- One `scene apply` is one undo step. Undo reverts the whole batch.
- `--if-version <v>` refuses when the drawing changed since you read it. The `version` is in the `scene read` output. After a timeout, retry with it, so a late first call cannot apply twice.
- `--dry-run` checks the operations and changes nothing.
- Operations are `add`, `update` (an id and properties) and `delete` (an id). One call takes up to 500.
- When a script edits the drawing, the app shows a notice. `control.notify_edits = false` hides it (see [AI and control](/docs/configuration/#control-and-ai)).

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
