---
title: Install
description: Download Vaultdraw for macOS, open it the first time, and optionally build it from source.
group: Getting started
order: 1
---

Vaultdraw runs on macOS, on Apple Silicon and on Intel. Windows and Linux builds are not available yet.

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

## Updates

There is no automatic update yet. **Help → Check for updates** in the app opens the releases page, and **Settings → About** shows your version. The [changelog](/changelog/) says what changed.

- **DMG:** download the new version from the [releases page]({{releases_url}}).
- **Homebrew:** run `{{brew_upgrade}}`.

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
