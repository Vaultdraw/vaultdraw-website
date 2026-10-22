// Inline SVG helpers for the logo components.

/** Rounds path coordinates to one decimal: the logo's paths carry ~15 digits that no screen can show. */
export const roundPaths = (svg) =>
  svg.replace(/\sd="([^"]*)"/g, (_m, d) => ` d="${d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(+n * 10) / 10))}"`);

/** The logo's fixed colours (dark source files) -> theme variables (palette.js). */
const COLORS = {
  "#c4a7e7": "var(--logo-folder)",
  "#ebbcba": "var(--logo-draw)",
  "#9ccfd8": "var(--logo-pen)",
  "#e0def4": "var(--logo-ink)",
  "#715d6b": "color-mix(in srgb, var(--logo-draw) 38%, var(--panel))",
  "#536476": "color-mix(in srgb, var(--logo-pen) 38%, var(--panel))",
};

/**
 * One of the logo SVGs, recoloured by the theme: its viewBox and inner markup.
 * Presentation attributes can't take var(), so colours become inline styles;
 * clip-path ids get `prefix` so several logos can share a page.
 */
export const themeSvg = (raw, prefix) => {
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1];
  const inner = roundPaths(raw)
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/id="[a-z]-dark-([\w-]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#[a-z]-dark-([\w-]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/<(\w+)\b([^>]*?)(\/?)>/g, (tag, name, attrs, close) => {
      const decls = [];
      let rest = attrs.replace(/\s(fill|stroke)="(#[0-9a-fA-F]{6})"/g, (m, prop, hex) => {
        const v = COLORS[hex.toLowerCase()];
        if (!v) return m;
        decls.push(`${prop}:${v}`);
        return "";
      });
      if (!decls.length) return tag;
      const css = decls.join(";");
      if (/\sstyle="/.test(rest)) rest = rest.replace(/\sstyle="([^"]*)"/, (_m, s) => ` style="${s.replace(/;?$/, ";")}${css}"`);
      else rest += ` style="${css}"`;
      return `<${name}${rest}${close}>`;
    });
  return { viewBox, inner };
};
