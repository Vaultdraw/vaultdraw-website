// The app's screenshots in themes that weren't photographed: a worker repaints
// each screen's key map with the theme's own colours (scripts/capture/recolor.mjs
// builds the key maps and palettes). Loaded only when such a theme is picked.

const KEEP = 24; // repainted images kept in memory (object URLs)

let meta = null;
let worker = null;
let seq = 0;
const pending = new Map();
const results = new Map(); // "screen|theme|scheme" -> Promise<object URL | null>

export const supported = typeof Worker === "function" && typeof OffscreenCanvas === "function";

const send = (url, colors) =>
  new Promise((resolve, reject) => {
    if (!worker) {
      worker = new Worker(new URL("./recolor-worker.js", import.meta.url), { type: "module" });
      worker.onmessage = ({ data }) => {
        const p = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) p?.reject(new Error(data.error));
        else p?.resolve(data.blob);
      };
    }
    const id = ++seq;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, url, colors });
  });

/** An image URL of `screen` in theme `id` and `scheme`, or null when there is no key map for it. */
export const recolored = async (screen, id, scheme) => {
  meta ??= fetch("/recolor/palettes.json").then((r) => (r.ok ? r.json() : null));
  const m = await meta;
  const colors = m?.palettes[scheme]?.[id];
  if (!colors || !m.screens[screen]?.includes(scheme)) return null;

  const key = `${screen}|${id}|${scheme}`;
  if (!results.has(key)) {
    if (results.size >= KEEP) {
      const [oldest, url] = results.entries().next().value;
      results.delete(oldest);
      url.then((u) => u && URL.revokeObjectURL(u));
    }
    results.set(
      key,
      send(`/recolor/${screen}-${scheme}.webp?v=${m.version}`, colors).then(
        (blob) => URL.createObjectURL(blob),
        () => null,
      ),
    );
  }
  return results.get(key);
};
