---
title: Drawings from the command line
description: List, search, read, write, create and move drawings with vaultdraw, with or without the app open.
group: Command line
order: 2
---

These commands work whether the app is running or not. See [the vaultdraw command](/docs/cli/) for how that works.

## Find drawings

```bash
vaultdraw ls                     # the vault root, folders first
vaultdraw ls Projects -r         # a folder, recursively
vaultdraw search "meeting"       # names, text and tags
vaultdraw search "tag:#dsa graph" --limit 5
vaultdraw tags                   # every tag with its drawing count
vaultdraw links "Roadmap"        # links in a drawing
vaultdraw links "Roadmap" --backlinks
```

Search uses the same index and rules as [search in the app](/docs/search/).

## Read and write

```bash
vaultdraw cat "Roadmap" > roadmap.json         # print the scene JSON
vaultdraw write "Roadmap" < roadmap.json       # replace it from stdin
vaultdraw write "Ideas/New" --create < scene.json
```

`write` refuses if the drawing changed since it was read, so it never overwrites edits made in the meantime. `--expected-revision <R>` makes that check explicit, and `--create` fails if the drawing already exists. A version is saved to [file history](/docs/history/) before a write.

## Create, move and trash

```bash
vaultdraw new "Sketches/Idea"                  # a blank drawing
vaultdraw new "Sketches/Copy" --from scene.json
vaultdraw mv "Sketches/Idea" "Archive/"        # trailing / moves into a folder
vaultdraw mv "Old name" "New name"             # rename
vaultdraw trash "Archive/Idea"                 # to the system Trash
```

Moving or renaming updates links to the drawing, as in the app.

## Settings

```bash
vaultdraw config path                     # where config.toml is
vaultdraw config get appearance.theme
vaultdraw config set appearance.theme "Nord"
vaultdraw config set tabs.restore false
```

Values are parsed as JSON, otherwise taken as text. The app picks up changes live.

## Scripts

Add `--json` to get stable JSON. For example, with `jq`:

```bash
vaultdraw search "invoice" --json | jq -r '.results[].path'
```
