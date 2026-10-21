# Plan

Status: built 2026-10-22 (the owner asked to go straight to building). Deploy is out of scope for now.

## Pages

| Path | What |
| --- | --- |
| `/` | Hero (wordmark, sketch, editor screenshot) and seven sections: folder, find, history, keyboard, extras, themes, get |
| `/docs/` | Index and eight pages: getting started, vault, search and links, history, keyboard, configuration, themes, pages and PDF |
| `/changelog/` | Dated development notes until there are releases |
| `/download/` | Platform status and build-from-source |
| `/404` | An unresolved `[[link]]` |

## Components

`Base` and `Docs` layouts; `Header`, `ThemeSwitch`, `Footer`; `Shot` (themed screenshot), `Sketch` (themed Excalidraw SVG), `CodePanel` (file tabs, line numbers), `SectionHead`, `Note` (hand-drawn margin note), `ThemeGrid`.

## Checks before calling a change done

- `npm run build` passes.
- No horizontal scroll at 375 px; keyboard reaches every control with a visible focus ring.
- Lighthouse mobile: performance, accessibility, best practices ≥ 95.
