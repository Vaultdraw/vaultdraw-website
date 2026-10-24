---
title: Links and files from outside
description: Open drawings, searches and commands with vaultdraw:// links, and open .excalidraw files with Vaultdraw from Finder.
group: Using Vaultdraw
order: 14
---

A `vaultdraw://` link opens a drawing, a search, a new drawing or a command in your running Vaultdraw. Use it from a note, a web page, a launcher or a script. Files opened from Finder follow the same rules.

> **Next release.** Not in the current download yet. It is merged in the app and comes with the next version.

Nothing happens behind your back. Opening and searching only change what you see. Anything that writes or runs a command asks you first.

## Links

| Link | What it does | Asks first? |
| --- | --- | --- |
| `vaultdraw://` or `vaultdraw://focus` | Brings the window to the front | No |
| `vaultdraw://open?file=Graphs/BFS` | Opens the drawing (`.excalidraw` is optional). Add `&newTab=1` for a new tab | No |
| `vaultdraw://open?vault=DSA&file=Graphs/BFS` | Opens it in the vault named `DSA` | Only if `DSA` is not the open vault |
| `vaultdraw://open?vault=DSA` | Switches to the vault | Yes |
| `vaultdraw://search?query=dijkstra` | Opens search with the text filled in. Nothing runs on a result | No |
| `vaultdraw://new?path=Inbox/Idea` | Creates the drawing and opens it. If it exists, it is only opened | Yes |
| `vaultdraw://cmd?id=appearance.toggleMode` | Runs one command from the palette | Yes |

Values are percent-encoded (a space is `%20`). Unknown parameters are ignored. A link is at most 8,192 bytes.

## What keeps it safe

1. **Names, never paths.** `vault=` is a vault's folder name, matched against the open vault and your recent vaults. A vault you have never opened cannot be opened by a link.
2. **Inside the vault only.** A drawing path is relative to the vault: no leading `/`, no `..`.
3. **No overwrite, no callbacks, no network.** A link never replaces a file and never fetches anything.
4. **One dialog.** If a link wants to switch vault and create a drawing, one dialog lists both. The dialog starts on Cancel and ignores Confirm for the first 0.6 seconds.
5. **Built-in commands only, and not the destructive ones.** A link cannot run a plugin's command, or a command that deletes, moves, renames, imports, exports, installs or quits, unless you list that exact id in `control.uri_allow`.
6. **A limit.** 5 links per 10 seconds for each source: the system, scripts and the palette.
7. **An off switch.** `control.uri_enabled = false` in [`config.toml`](/docs/configuration/#control) turns links and files from outside off. `control.uri_allow` removes the question for what you trust.

## From Terminal and the palette

```bash
vaultdraw uri 'vaultdraw://open?file=Graphs/BFS'
```

The command checks the link first (a bad link exits with code 2), then hands it to the running app. It prints `done`, or `asking` when the app waits for your answer, and it never waits for you. It exits with code 3 when Vaultdraw is not running, like the other [app commands](/docs/cli-app/).

**Links: Open a vaultdraw:// link…** in the palette does the same from inside the app, with the same checks.

## Open With Vaultdraw

`.excalidraw` drawings and `.excalidrawlib` libraries can be opened with Vaultdraw from Finder (**Open With**), with `open -a Vaultdraw file.excalidraw`, or with a second launch that has a file path. Vaultdraw is an alternate app for both types, so your default is not changed. To make it the default, use Finder's **Get Info → Open with → Change All**.

| The file is… | What happens |
| --- | --- |
| In the open vault | It opens at once |
| In another vault you have used | A dialog asks to switch to that vault, then it opens |
| Outside every vault you use | A dialog with three choices: **Copy into vault** (a copy goes to the vault's top folder, a taken name gets a number, nothing is replaced), **Open its folder as a vault**, or **Cancel** |
| A `.excalidrawlib` | A dialog asks to add its items to **my library** (all vaults, the default) or **this vault's library**, or to cancel. Nothing is removed |

Vaultdraw works on files inside a vault, so a file from outside is never edited in place or opened read-only. Files are checked before use: a regular file (not a symbolic link), up to 32 MiB for a drawing and 64 MiB for a library, valid text, and a real drawing or library.

### Linux

Linux is not supported yet. The app has the files and a palette command for it, **Links: Register Vaultdraw for links and files (Linux)**, which shows what it will write under your `~/.local/share` and waits for **Register**. It has been checked by unit tests only, not on a Linux desktop.

## Not yet

A link cannot yet carry a template or content for `new`, point at an element, or open a folder as a vault. A file from outside cannot be opened without copying it or opening its folder as a vault. Windows file types are not registered.
