---
title: Plugin API 1.0
description: What the frozen plugin API promises, how version numbers change, and which areas are still experimental.
group: Plugins
order: 2
---

The plugin API is frozen at 1.0. A plugin written for 1.0 keeps working on every 1.x version of Vaultdraw. This page says what is frozen, how changes are numbered, and what a plugin author does about it.

## What 1.0 promises

| Covered | Where it is pinned |
| --- | --- |
| Every name, signature and type in `@vaultdraw/api` | `sdk/api/etc/api-surface.d.ts`, checked by a test |
| Every `plugin.toml` key, permission and what a permission allows | `sdk/api/plugin.schema.json` and the [manifest reference](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/manifest.md) |
| App events (`vault.opened`, `drawing.saved` and the others) and their payloads | The same snapshot |
| Error codes (`PluginErrorCode`) a call can reject with | The same snapshot |
| The `vaultdraw-plugin` commands, options, exit codes and `--json` output | [SDK reference](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/reference.md) |

Not covered:

- **Experimental areas.** See [below](#experimental-areas).
- **Wording and layout** of toasts, dialogs and the plugin list. Also timing, and the order of events of different kinds.
- **The list of `check` codes and error codes.** A minor release can add one. Keep a default branch in your code.
- **Anything not in the types or the docs.** If you reach it another way, you keep it working at your own risk.

## Version numbers

Two numbers are in use.

| Number | Where you see it | Changes |
| --- | --- | --- |
| API level | `api = 1` in `plugin.toml`, `ctx.host.api.level` | Only in a major release |
| API revision | `ctx.host.api.revision`, the version of `@vaultdraw/api` | With every change, by semantic versioning |

The revision follows the API, not the app. Several app releases can share one revision.

| Change | Example | Meaning |
| --- | --- | --- |
| Patch | 1.0.1 | A fix. No type changes. |
| Minor | 1.1.0 | An addition (a member, event, manifest key, permission or error code) or a deprecation. Nothing a 1.0 plugin uses stops working. |
| Major | 2.0.0 | Removals and incompatible changes. Only a major release removes a deprecated name. |

## Deprecations

A deprecated name keeps working until 2.0. Vaultdraw warns you before then:

1. The name is tagged `@deprecated` in the types, with its replacement.
2. The plugin log shows `deprecated: …` once per plugin and session. `vaultdraw-plugin check` warns where it can see the use.
3. The name works for the rest of the 1.x line.
4. The next major release removes it, and the [API change log](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/api/CHANGELOG.md) says so.

Deprecated today:

| Deprecated | Use instead |
| --- | --- |
| `ToastOptions.action` | `actions` |
| `ctx.manifest.dir` | Ask the host for the path it gives you |
| `api = 0` in `plugin.toml` | `api = 1` |

## Saying what your plugin needs

Three keys in `plugin.toml` tell the app what your plugin needs:

```toml
id = "hello-command"
name = "Hello"
version = "0.1.0"
api = 1
min_app = "0.1.0"
min_api = "1.0.0"
main = "main.js"
```

| Key | Says | What an older app does |
| --- | --- | --- |
| `api = 1` | The API level the plugin was written for | Refuses the plugin when the level is newer than the app's |
| `min_api = "1.2.0"` | The oldest API revision the plugin uses | Refuses it and says: "Needs plugin API ≥ 1.2.0" |
| `min_app = "0.4.0"` | The oldest app version it runs on | Refuses it and says: "Needs app ≥ 0.4.0" |

Versions compare by semantic version, major number first. `1.0.0` is newer than `0.37.0`.

**Tip.** Ask the app at run time when you can. `ctx.host.has("scene.batch")` is true when a member exists, so your plugin can fall back. Use `min_api` only when there is no sensible fallback.

A plugin from a newer API never loads half-way. The plugin list shows it as not compatible, with the reason, and nothing runs.

## Experimental areas

These areas are outside the promise. They may change or go in a minor release. The types carry an `@experimental` tag.

| Area | Members | Added | Used by |
| --- | --- | --- | --- |
| Thumbnails | `ctx.thumbnails` | 1.0 | The `gallery` plugin |
| Graph | `ctx.vault.graph` | 1.0 | The `graph` plugin |
| Table | `ctx.vault.table` | 1.0 | The `table` plugin |
| Network | `ctx.net` (permission `net`) | 1.1 | The `ai-assistant` plugin |
| Secret | `ctx.secret` (permission `secret`) | 1.1 | The `ai-assistant` plugin |
| Text fold | `ctx.text.fold(text)` | 1.2 | The `graph` plugin |

Revisions 1.1 and 1.2 are not in a release yet. Check the [API change log](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/api/CHANGELOG.md) for the current state.

## How the promise is kept

- A test compares the public declarations with a stored snapshot. A change fails the test until the snapshot is updated.
- The update needs a new version in `sdk/api/package.json`. It refuses a removal or a changed signature unless the major version rose.
- Every version has an entry in the [API change log](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/api/CHANGELOG.md).

## SDK docs

The full developer reference is in the source repository, in `sdk/docs`:

| Read | For |
| --- | --- |
| [Getting started](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/getting-started.md) | Your first plugin in five minutes |
| [Manifest](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/manifest.md) | Every `plugin.toml` key |
| [Permissions](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/permissions.md) | What each permission allows |
| [Reference](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/reference.md) | The API and the `vaultdraw-plugin` tool |
| [Stability](https://github.com/Vaultdraw/vaultdraw/blob/main/sdk/docs/stability.md) | The full promise, this page's source |

For the plugins that ship with the app and how to switch them off, see [Plugins](/docs/plugins/).
