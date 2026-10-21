---
title: Keyboard and commands
description: The command palette, default keys, and how to change any of them.
order: 5
---

## The palette

One palette with two modes, as in VS Code.

- **Cmd+P** goes to a drawing. Recent ones come first.
- **Cmd+Shift+P** (or **Cmd+/**) runs a command. The input starts with `>`; delete it to switch back to drawings.

Type a few letters in order, not necessarily next to each other: `vdg` finds `vault-design`. **Enter** runs and puts focus back on the canvas, **Cmd+Enter** runs and keeps the palette open, and **Tab** narrows to a family, so on "Theme: Dracula" it lists every `Theme: …`.

Commands mode has every Excalidraw editor action (tools, align, group, layers, lock, grid, zen mode, export) and every Vaultdraw feature as its own entry: `Theme: <name>`, `Mode: Dark`, `Paper: Grid`, `Export: PDF`, `Settings: Hotkeys` and so on. Entries that can't run right now are hidden.

## Default keys

`Mod` is Cmd on macOS and Ctrl on Windows and Linux.

| Key | Command |
| --- | --- |
| Mod+P | Go to drawing |
| Mod+Shift+P, Mod+/ | Show all commands |
| Mod+N | New drawing |
| Mod+Alt+N | New from template |
| Mod+S | Save drawing |
| Mod+Shift+F | Search vault |
| Mod+Shift+H | History |
| Mod+Alt+G | Graph view |
| Mod+Alt+L | Local graph |
| Mod+Alt+B | Backlinks panel |
| Mod+Alt+K | Link selection to drawing |
| Shift+Mod+E | Export image |
| Mod+\\ | Show or hide the navigator |
| Mod+, | Settings |
| Mod+Shift+= / - / 0 | Interface zoom in, out, reset |

Plain Mod + `=`, `-` and `0` zoom the canvas, as in Excalidraw.

## Changing keys

**Settings → Hotkeys** lists every command with its keys. **+** records a new key, **×** removes one, **↺** resets the command. Keys that clash with another command or with an Excalidraw shortcut are shown in red with what they clash with; keys the system owns, such as Cmd+Q, are refused.

The same changes live in `config.toml`, as a list of keys per command id. Only your changes are stored:

```toml
[hotkeys]
"file.save" = ["Mod+S", "Alt+S"]   # add a key (list the default too)
"vault.newDrawing" = []            # unassign
"view.toggleNavigator" = ["Mod+B"] # change
```

A drawing can get its own key too: **Assign hotkey to this drawing** in the palette.

## Tool defaults

Each tool can start with its own style, so a dotted orange arrow is one keypress away. Set them in **Settings → Tools**, or select a shape and run `Tool defaults: Save current style for this tool`. In `config.toml` each tool has a table:

```toml
[tools.arrow]
stroke_color = "#f08c00"
stroke_width = 3
stroke_style = "dotted"
```
