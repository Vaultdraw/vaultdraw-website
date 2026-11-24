---
title: Install
description: Download Vaultdraw for macOS or Linux, open it the first time, and optionally build it from source.
group: Getting started
order: 1
---

Vaultdraw {{version}} runs on macOS (Apple Silicon and Intel) and on Linux ({{linux_archs}}), see [Linux](#linux). Windows is in progress, see [Windows (coming)](#windows-coming).

## Install the app

**[Download Vaultdraw for macOS]({{dmg_url}})**\
v{{version}} · Apple Silicon & Intel · {{size_mb}} MB

Open the DMG and drag **Vaultdraw** to **Applications**. One universal build covers both kinds of Mac. Older versions are on the [releases page]({{releases_url}}).

**Optional: check the download.** The release includes a [SHA256SUMS]({{sums_url}}) file. Put it next to the DMG and run:

```bash
shasum -a 256 -c SHA256SUMS
```

The expected output is `{{dmg_name}}: OK`.

### Or with Homebrew

```bash
{{brew_install}}
```

Installs the app and the `vaultdraw` command. Homebrew needs the same [first-open step](#open-it-the-first-time) as the DMG.

To upgrade or uninstall:

```bash
{{brew_upgrade}}
```

```bash
{{brew_uninstall}}
```

To also remove your settings and caches, use the zap option. Your vaults are never touched.

```bash
{{brew_zap}}
```

## Open it the first time

Vaultdraw is not signed with an Apple Developer certificate yet, so macOS says it can't verify the developer. Open it once in one of these ways:

- Right-click (Control-click) Vaultdraw in Applications, choose **Open**, then **Open** again.
- Or try to open it, then go to **System Settings → Privacy & Security**, scroll to the message about Vaultdraw and click **Open Anyway**.

If macOS says the app is "damaged", or the `vaultdraw` command stops with `Killed: 9`, remove the quarantine flag in Terminal and try again:

```bash
{{unquarantine}}
```

After the first open, it starts like any other app.

## Windows (coming)

> **Not released yet.** Windows support is in progress. There is no Windows download and no release date.

The Windows build is not in {{version}}. Until it is released, use the macOS or Linux download.

## Linux

The release has a package for each kind of distribution. The package manager installs the libraries Vaultdraw needs (WebKitGTK 4.1, GTK 3 and poppler). Download the file from the [release page]({{release_url}}), then run the command in the folder it is in.

| Distribution | File | Install |
| --- | --- | --- |
| Debian, Ubuntu, Mint | `.deb` | `{{linux_install_deb}}` |
| Fedora, RHEL-like | `.rpm` | `{{linux_install_rpm}}` |
| Arch, Manjaro | AUR package `vaultdraw-bin` | `{{aur_install}}` or `{{aur_install_paru}}` |
| Any other | AppImage | see below |

### AppImage

Needs no install and no root:

```bash
{{linux_run_appimage}}
```

For a menu entry and file association, run **Links: Register Vaultdraw for links and files** from the command palette.

### Check the download

Put [SHA256SUMS]({{sums_url}}) next to the file and run:

```bash
{{linux_checksum}}
```

The line for your file should end in `OK`. The builds are unsigned.

### Start and uninstall

Open **Vaultdraw** from the application menu. In a terminal, `excalidraw-vault` starts the app and `vaultdraw` is the [command line tool](/docs/cli/), both in `/usr/bin` after a package install. Uninstalling removes only the program files; your vaults, settings and state stay in your home folder.

| Distribution | Uninstall |
| --- | --- |
| Debian, Ubuntu | `{{linux_uninstall_deb}}` |
| Fedora, RHEL-like | `{{linux_uninstall_rpm}}` |
| Arch | `{{linux_uninstall_aur}}` |

### Limits

The Linux builds are new. They were installed, started and removed headless on Debian 12, Fedora and Arch, not on every desktop. If a window looks wrong on Wayland, start it with `GDK_BACKEND=x11 excalidraw-vault`.

On a vault bigger than the system's inotify watch limit, Vaultdraw polls the vault instead of watching it (`files.watch_poll_ms`, default 5000) and tells you once on open. To get the normal watcher back, raise `fs.inotify.max_user_watches` and reopen the vault.

## Updates

There is no automatic update yet. **Help → Check for updates** in the app opens the releases page, and **Settings → About** shows your version. The [changelog](/changelog/) says what changed.

- **DMG:** download the new version from the [releases page]({{releases_url}}).
- **Homebrew:** run `{{brew_upgrade}}`.
- **Linux:** install the new package over the old one, or update the AUR package with your helper.

## Install the `vaultdraw` command

If you used Homebrew, it is already installed. Otherwise open the command palette (**Cmd+Shift+P**) and run **Install 'vaultdraw' command in PATH**. See [the command line](/docs/cli/) for what it can do.

## Build from source

You need Node 18 or newer, Yarn 1 and the [Tauri prerequisites](https://tauri.app/start/prerequisites/).

```bash
git clone https://github.com/Vaultdraw/vaultdraw
cd vaultdraw
yarn install
yarn start           # run the app in dev mode
yarn desktop:build   # build the packaged app
```

Next: [your first vault](/docs/first-vault/).
