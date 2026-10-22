---
title: Tags
description: Tag drawings with #words, browse them in the Tags panel, filter by tag and rename a tag across the vault.
group: Using Vaultdraw
order: 7
---

A tag is a `#word` written anywhere in a drawing's text or frame names. There are no sidecar files: the tag lives in the drawing, so it travels with it.

## Write a tag

Type `#` followed by the tag, such as `#dsa` or `#project/vaultdraw`. A `/` nests tags, so `#project/vaultdraw` sits under `#project`. While you type `#`, a list suggests tags already in the vault.

A tag needs at least one letter and can use letters, digits, `_`, `-` and `/`. Things that only look like tags are ignored: `#123`, hex colours, URL fragments and `# heading`.

## The Tags panel

The Tags panel lists every tag with the number of drawings that use it, nested by `/`. Open it from the activity bar, or run **Tags: Focus tags pane**. **Tags: Toggle sort by name/count** changes the order.

- **Click a tag** to filter the file tree to drawings with that tag. Click it again to clear the filter.
- **Tag chips** next to drawings in the file tree show up to two tags each. Click one to filter. Turn the chips off with `interface.show_tag_chips = false`.

## Filter search by tag

Add `tag:#name` to a [search](/docs/search/). It includes nested tags and combines with words: `tag:#dsa graph` finds drawings tagged `#dsa` that contain "graph". Case and accents are ignored.

## Rename a tag

Run **Tags: Rename tag…**, click the rename button on a tag in the Tags panel, or select the tag and press **r** or **F2**. Vaultdraw rewrites the tag in every drawing that uses it and reports the result, such as "Renamed #dsa to #algorithms in 12 drawings".

## Settings

```toml
[tags]
autocomplete = true   # the list that opens on #
pane_sort = "name"    # name | count
```

Tags also appear in the [graph view](/docs/graph/), and `vaultdraw tags` lists them from Terminal.
