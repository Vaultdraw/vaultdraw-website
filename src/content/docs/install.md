---
title: Install
description: Download Vaultdraw for macOS, open it the first time, and optionally build it from source.
group: Getting started
order: 1
---

Vaultdraw runs on macOS, on Apple Silicon and on Intel. Windows and Linux builds are not available yet.

## Install the app

1. Download `Vaultdraw_0.1.1_universal.dmg` from the [latest release](https://github.com/Vaultdraw/vaultdraw/releases/latest).
2. Open the DMG and drag **Vaultdraw** to **Applications**.

One universal build covers both Apple Silicon and Intel Macs.

**Optional: check the download.** The release includes a `SHA256SUMS` file. Put it next to the DMG and run:

```bash
shasum -a 256 -c SHA256SUMS
```

## Open it the first time

Vaultdraw is not signed with an Apple Developer certificate yet, so macOS says it can't verify the developer. Open it once in one of these ways:

- Right-click (Control-click) Vaultdraw in Applications, choose **Open**, then **Open** again.
- Or try to open it, then go to **System Settings → Privacy & Security**, scroll to the message about Vaultdraw and click **Open Anyway**.

If macOS says the app is "damaged", remove the quarantine flag in Terminal and open it again:

```bash
xattr -dr com.apple.quarantine /Applications/Vaultdraw.app
```

After the first open, it starts like any other app.

## Updates

There is no automatic update yet. Check the [releases page](https://github.com/Vaultdraw/vaultdraw/releases) for new versions and the [changelog](/changelog/) for what changed.

## Install the `vaultdraw` command

The app can also be used from Terminal. Open the command palette (**Cmd+Shift+P**) and run **Install 'vaultdraw' command in PATH**. See [the command line](/docs/cli/) for what it can do.

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
