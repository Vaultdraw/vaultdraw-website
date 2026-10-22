// Mermaid diagrams are rendered once, locally, and the SVGs are committed in src/mermaid/,
// so a build without a browser (Vercel, CI) never needs Playwright's Chromium.
//
//   mermaidFromCache  runs before rehype-mermaid: a diagram with a cached SVG is replaced by it;
//                     one without is wrapped so rehype-mermaid renders it (locally only).
//   mermaidToCache    runs after rehype-mermaid: saves each fresh render to the cache.
//
// The cache key hashes the diagram source and the Mermaid config, so editing either re-renders.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

const DIR = new URL("../src/mermaid/", import.meta.url);
const ON_CI = Boolean(process.env.CI || process.env.VERCEL);

const isMermaidPre = (node) =>
  node.type === "element" &&
  node.tagName === "pre" &&
  node.children.some(
    (c) => c.type === "element" && c.tagName === "code" && (c.properties?.className ?? []).includes("language-mermaid"),
  );

const textOf = (node) => (node.type === "text" ? node.value : (node.children ?? []).map(textOf).join(""));

const svgNode = (svg) => fromHtml(svg, { fragment: true, space: "svg" }).children[0];

/** Calls fn(node, index, parent) for every element, children first, so replacements are safe. */
function eachElement(node, fn) {
  (node.children ?? []).forEach((child, i) => {
    eachElement(child, fn);
    if (child.type === "element") fn(child, i, node);
  });
}

export function mermaidFromCache({ mermaidConfig = {} } = {}) {
  const salt = JSON.stringify(mermaidConfig);
  return (tree, file) => {
    eachElement(tree, (node, i, parent) => {
      if (!isMermaidPre(node)) return;
      const key = createHash("sha256").update(salt).update(textOf(node)).digest("hex").slice(0, 16);
      const cached = new URL(`${key}.svg`, DIR);
      if (existsSync(cached)) {
        parent.children[i] = svgNode(readFileSync(cached, "utf8"));
      } else if (ON_CI) {
        throw new Error(
          `${file.path}: a Mermaid diagram has no rendered SVG in src/mermaid/. ` +
            `Run "npm run build" locally (it uses Playwright's Chromium) and commit src/mermaid/.`,
        );
      } else {
        parent.children[i] = { type: "element", tagName: "div", properties: { dataMermaidKey: key }, children: [node] };
      }
    });
  };
}

export function mermaidToCache() {
  return (tree) => {
    eachElement(tree, (node, i, parent) => {
      const key = node.properties?.dataMermaidKey;
      if (node.tagName !== "div" || !key) return;
      const svg = node.children.find((c) => c.type === "element" && c.tagName === "svg");
      if (!svg) return;
      // rehype-mermaid numbers ids per page (mermaid-0, -1, …); a key-based id stays unique wherever the SVG lands.
      const oldId = String(svg.properties.id);
      const html = toHtml(svg, { space: "svg" }).replace(
        new RegExp(`(?<![\\w-])${oldId}(?!\\d)`, "g"),
        `mermaid-${key.slice(0, 8)}`,
      );
      mkdirSync(DIR, { recursive: true });
      writeFileSync(new URL(`${key}.svg`, DIR), html);
      parent.children[i] = svgNode(html);
    });
  };
}
