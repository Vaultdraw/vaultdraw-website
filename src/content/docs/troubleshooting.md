---
title: Troubleshooting
description: Fixes for the problems you are most likely to hit, from the first open to a vault that won't save.
group: Help
order: 2
---

## macOS won't open the app

Vaultdraw isn't signed with an Apple Developer certificate yet. Right-click it in Applications and choose **Open**, or go to **System Settings → Privacy & Security** and click **Open Anyway**. If macOS says the app is "damaged":

```bash
xattr -dr com.apple.quarantine /Applications/Vaultdraw.app
```

See [Install](/docs/install/#open-it-the-first-time).

## The vault opened read-only

Only one copy of Vaultdraw writes to a vault at a time. The app says why the vault is read-only: another copy holds it, or the folder isn't writable. Fix the cause, then run **Retry opening vault writable**.

## A settings change didn't apply

If `config.toml` has a mistake, the app keeps your last good settings and shows a banner with the line number, such as `config.toml line 7: <error>`. Fix that line and save. A value of the wrong type falls back to its default. See [config.toml reference](/docs/configuration/#how-it-behaves).

## The theme looks wrong

If `theme` names a theme that doesn't exist, Vaultdraw uses Default and shows a warning. Check the file name in `themes/` matches. See [Themes](/docs/themes/#adding-a-theme).

## Search misses a drawing

On a large vault, the first index takes a while. The status line shows "Indexing n of N drawings…", and results cover only what is done so far. If results still look wrong, quit and delete the index folder (`~/.local/state/vaultdraw/index/`). It is rebuilt on the next launch, and nothing in your vault is touched.

## The app quit before my edit was saved

Edits are written to a recovery folder before each save. Run **Open recovered drawings** to get them back, or **Reveal recovery folder** to look yourself. See [Vault and files](/docs/vault/#crash-recovery).

## I need an older version of a drawing

Press **Cmd+Shift+H** for [File history](/docs/history/).

## A key does nothing

Another command may use it. **Settings → Hotkeys** shows clashes in red, and the **Conflicts** filter lists them. See [Keyboard](/docs/keyboard/#changing-keys).

## The command line says the app is not running

Commands like `open` and `tabs` need the app: start it and try again. File commands such as `ls` and `search` work without it. See [the vaultdraw command](/docs/cli/#with-or-without-the-app).

## Still stuck

Open an [issue on GitHub](https://github.com/Vaultdraw/vaultdraw/issues) with your macOS version, what you did and what happened.
