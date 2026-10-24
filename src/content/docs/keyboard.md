---
title: Keyboard and commands
description: The command palette, default keys, and how to change any of them.
group: Customise
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

## Key sequences, leader and which-key

> **Next release.** Not in the current download yet. It is merged in the app and comes with the next version.

A key can be a sequence of chords, like Vim's `gg` or `<leader> f f`. Sequences are plain text in `[hotkeys]`, so nothing is bound until you write one. With none set, Vaultdraw does no extra work per key and starts no timers.

```toml
[keys]
leader = "Backslash"             # what <leader> means (the default)

[keys.labels]
"<leader> f" = "file"            # a name for the group, shown in the popup

[hotkeys]
"list.first" = ["g g", "Home"]
"palette.files" = ["<leader> f f", "Mod+P"]
```

| Written | Means |
| --- | --- |
| `"g g"` | Press `g`, then `g` |
| `<leader>` | The `keys.leader` key. Change it and every sequence follows. |
| `<C-x>`, `<A-x>`, `<S-x>` | Ctrl+X, Alt+X, Shift+X (they combine: `<C-S-x>`) |
| `<CR>`, `<Esc>`, `<Space>`, `<Tab>`, `<BS>`, `<Del>` | Enter, Escape, Space, Tab, Backspace, Delete |

How it behaves:

- **Esc** cancels a half-typed sequence. **Backspace** goes up one level.
- A key that does not match cancels the sequence. On the canvas and in lists it is swallowed. In a text box it is typed, so you never lose a letter.
- A sequence that starts with a plain key never starts in a text box. Use Mod, Ctrl or Alt there (`Mod+Alt+K Mod+S`).
- If `g` and `g g` are both bound, `g` waits `keys.timeout_ms`, then runs. Press `g` again for the long one.
- Letters follow your keyboard layout. Punctuation is the physical key, so on a non-US keyboard pick a leader that is easy to press, such as `"Alt+K"`.

**Which-key.** After a short delay (`keys.which_key_delay_ms`, 400 ms) a popup lists the keys that can follow, with the command name or the group name. **Up/Down** and **Enter** pick an entry. It loads only the first time you use a sequence. **Keys: show which-key** shows it on demand, and **Keys: cancel pending sequence** cancels. Both are unbound by default.

**In Settings.** **Hotkeys → Sequence** records a sequence chord by chord (Enter saves, Backspace removes the last chord, Esc cancels). A key that starts another command's sequence gets a `prefix` warning. **Key group names** on the same page edits `[keys.labels]`. The six `[keys]` options are in the [config.toml reference](/docs/configuration/#keys).

**Tool keys.** `R`, `E`, `A`, `Q` and the other tool keys are now commands (`tool.rectangle`, `tool.eraser`, `tool.arrow`, `tool.lock` and so on), with the same default keys. Rebind them, remove them or make them sequences like any other command. They work while a drawing is open, not while you type or when a list, the gallery or the graph has focus.

## Tool defaults

Each tool can start with its own style. See [Tool defaults](/docs/tool-defaults/).
