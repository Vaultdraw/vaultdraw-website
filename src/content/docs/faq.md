---
title: FAQ
description: Short answers to common questions about Vaultdraw.
group: Help
order: 1
---

## Is Vaultdraw free? Is it open source?

Yes. It is MIT licensed, and the code is on [GitHub](https://github.com/Vaultdraw/vaultdraw).

## Does it work offline?

Yes. Everything runs on your computer. Fonts and other assets are bundled with the app, and Mermaid diagrams and LaTeX formulas are converted offline. There is no account and no cloud.

## Does it collect any data?

No. There is no telemetry. See [Privacy and your data](/docs/privacy/).

## Does it open drawings from excalidraw.com?

Yes. Drawings are plain `.excalidraw` files, the same format excalidraw.com saves, so you can move files in both directions.

A few Vaultdraw extras don't travel:

- `[[links]]` show as plain text on excalidraw.com. Nothing is lost when a file is saved there.
- The paper pattern and page setup are ignored on excalidraw.com, and saving there drops the paper pattern.

## What about drawings from the Obsidian Excalidraw plugin?

Vaultdraw opens `.excalidraw` files. It also reads relative file links such as `./x.excalidraw`, so shape links in drawings made with that plugin work.

## Can I sync a vault with iCloud, Dropbox or git?

Yes. A vault is just a folder, so any tool that syncs folders works. If something changes a drawing while Vaultdraw is open, Vaultdraw picks the change up without losing your unsaved edits.

In a git repository, you can keep file history out of commits. Run the history command to exclude it from git; it adds `/.excalidraw-vault/history/` to the vault's `.gitignore`. See [File history](/docs/history/).

## Does it run on Windows or Linux?

Not yet. {{version}} is macOS only (Apple Silicon and Intel).

## Why does macOS refuse to open it?

The app is not signed with an Apple Developer certificate yet. See [Install](/docs/install/#open-it-the-first-time) for the one-time steps. If it says "damaged", or the `vaultdraw` command stops with `Killed: 9`, run `{{unquarantine}}`.

## How do I update?

There is no automatic update yet. **Help → Check for updates** in the app (or `Help: Check for updates` in the command palette) opens the [releases page]({{releases_url}}), where you download the new DMG. If you installed with Homebrew, run `{{brew_upgrade}}`. **Settings → About** shows the version you have.

## Can I change the keys?

Yes, every command can be rebound. See [Keyboard](/docs/keyboard/).

## Can I use it from Terminal?

Yes, with the `vaultdraw` command. See [the command line](/docs/cli/).

## Are there plugins?

An experimental plugin host ships in {{version}}. See [Plugins](/docs/plugins/).

## Where do I report a bug or ask for a feature?

In the app, **Help → Report a bug** or **Help → Request a feature**. Each opens a GitHub issue already filled in with a template and your Vaultdraw and macOS versions (no file paths or vault names). You can also open an [issue on GitHub](https://github.com/Vaultdraw/vaultdraw/issues) directly.
