---
title: Configuration
description: The config folder, config.toml, and settings per vault.
order: 6
---

All settings live in one folder, as in kitty, Ghostty or Zed.

| OS | Config folder |
| --- | --- |
| macOS, Linux | `$XDG_CONFIG_HOME/vaultdraw`, else `~/.config/vaultdraw` |
| Windows | `%APPDATA%\Vaultdraw` |

```text
vaultdraw/
├── config.toml   your settings
└── themes/       colour themes
```

`config.toml` is created on first launch, with a comment explaining each key.

## How it behaves

- **Settings and the file stay in sync.** Changing something in Settings rewrites only that value and keeps your comments and layout. Editing the file updates the app.
- **Live reload.** Save the file and the change applies. Delete a line to go back to the default.
- **Typos are safe.** If the file can't be parsed, the app keeps the last good settings and shows the line with the error. A value of the wrong type falls back to its default and is reported the same way.

**Settings → Open config folder** opens the folder; **Reload** re-reads it.

## The keys

```toml
[appearance]
theme = "Default"             # a built-in theme or one in themes/
mode = "system"               # light | dark | system
sync_canvas = false           # canvas follows the theme's colours
canvas_background = "#ffffff" # for new drawings when sync_canvas is off
accent_color = ""             # "#rrggbb" replaces the theme's accent

[editor]                      # defaults for new elements
font_family = 5               # 5 Excalifont, 6 Nunito, 8 Comic Shanns, 1 Virgil, 2 Helvetica, 3 Cascadia
font_size = 20
stroke_color = "#1e1e1e"
background_color = "transparent"
fill_style = "solid"          # solid | hachure | cross-hatch
stroke_width = 2
roughness = 1                 # 0 architect, 1 artist, 2 cartoonist

[paper]
style = "plain"               # plain | grid | lines | dots | graph | isometric

[page]                        # see Pages and PDF
mode = "normal"               # normal | page
size = "a4"

[saving]
autosave_delay_ms = 500       # idle time before an edit is written

[interface]
zoom = 100                    # whole-app zoom, 50 to 200

[navigator]
sort = "name_asc"             # name_asc | name_desc | modified_desc | modified_asc

[files]
confirm_delete = true
new_drawing_folder = ""       # relative to the vault; "" = next to the open drawing
templates_folder = "Templates"
```

Links, hotkeys, tools, PDF import and page mode have their own tables; each is described on its page.

## Settings per vault

Some settings can differ per vault: sort order, the folder for new drawings, the templates folder, paper style, tool styles and history. Switch the scope at the top of Settings to **This vault**, or edit `<vault>/.excalidraw-vault/settings.toml`:

```toml
[navigator]
sort = "modified_desc"

[files]
new_drawing_folder = "Sketches/Inbox"
```

The vault's value wins, then `config.toml`, then the default. Because the file is inside the vault, it travels with it when you copy, sync or back the folder up.
