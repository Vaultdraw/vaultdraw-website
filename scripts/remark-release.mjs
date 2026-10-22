// Replaces {{name}} in Markdown text, inline code and link URLs with release values,
// so docs and changelog never hard-code the version. An unknown name fails the build.
import { RELEASE_TOKENS } from "../src/data/release.js";

const TOKEN = /\{\{\s*([a-z_]+)\s*\}\}/g;

const fill = (s, file) =>
  s.replace(TOKEN, (_, name) => {
    if (!(name in RELEASE_TOKENS)) throw new Error(`${file}: unknown release token {{${name}}}`);
    return RELEASE_TOKENS[name];
  });

function walk(node, file) {
  if ((node.type === "text" || node.type === "inlineCode" || node.type === "code") && node.value) {
    node.value = fill(node.value, file);
  }
  if ((node.type === "link" || node.type === "definition") && node.url) {
    // Markdown parsers URL-encode braces in link targets.
    node.url = fill(node.url.replace(/%7B%7B/gi, "{{").replace(/%7D%7D/gi, "}}"), file);
  }
  node.children?.forEach((c) => walk(c, file));
}

export default function remarkRelease() {
  return (tree, vfile) => walk(tree, vfile.path ?? "markdown");
}
