// Repaints a screenshot key map with one theme's colours, off the main thread.
// Key map pixels (scripts/capture/recolor-encode.mjs): R, G = palette indices,
// B = blend * 255, alpha 255; alpha 254 = keep the stored colour as is.

/** url -> Promise<ImageData>: each key map is decoded once and reused for every theme. */
const maps = new Map();

const load = (url) => {
  if (!maps.has(url)) {
    maps.set(
      url,
      fetch(url)
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b, { premultiplyAlpha: "none", colorSpaceConversion: "none" }))
        .then((bmp) => {
          const ctx = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d", { willReadFrequently: true });
          ctx.drawImage(bmp, 0, 0);
          return ctx.getImageData(0, 0, bmp.width, bmp.height);
        }),
    );
  }
  return maps.get(url);
};

onmessage = async ({ data: { id, url, colors } }) => {
  try {
    const key = await load(url);
    // colors: "rrggbb" per palette entry, in key-map order.
    const pal = new Uint8Array(colors.length / 2);
    for (let i = 0; i < pal.length; i++) pal[i] = parseInt(colors.substr(i * 2, 2), 16);

    const src = key.data;
    const img = new ImageData(key.width, key.height);
    const out = img.data;
    for (let p = 0; p < src.length; p += 4) {
      if (src[p + 3] === 254) {
        out[p] = src[p];
        out[p + 1] = src[p + 1];
        out[p + 2] = src[p + 2];
      } else {
        const a = src[p] * 3;
        const b = src[p + 1] * 3;
        const t = src[p + 2] / 255;
        out[p] = pal[a] + (pal[b] - pal[a]) * t;
        out[p + 1] = pal[a + 1] + (pal[b + 1] - pal[a + 1]) * t;
        out[p + 2] = pal[a + 2] + (pal[b + 2] - pal[a + 2]) * t;
      }
      out[p + 3] = 255;
    }
    const canvas = new OffscreenCanvas(key.width, key.height);
    canvas.getContext("2d").putImageData(img, 0, 0);
    postMessage({ id, blob: await canvas.convertToBlob({ type: "image/webp", quality: 0.9 }) });
  } catch (e) {
    postMessage({ id, error: String(e) });
  }
};
