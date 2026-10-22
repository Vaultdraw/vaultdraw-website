// Fails when a built page links to a site path (href="/...") that is not in dist/,
// or to a #fragment that is not an id on the target page. Run after `astro build`.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html")) yield path;
  }
}

function target(path) {
  const clean = path.replace(/\/$/, "");
  for (const file of [join(DIST, clean, "index.html"), join(DIST, `${clean}.html`), join(DIST, clean)]) {
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  return undefined;
}

const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

let broken = 0;
for (const page of htmlFiles(DIST)) {
  const html = readFileSync(page, "utf8");
  for (const [, href] of html.matchAll(/href="(\/[^"]*|#[^"]*)"/g)) {
    if (href.startsWith("//")) continue;
    const [path, hash] = href.split("#");
    const file = path ? target(decodeURI(path)) : page;
    const ok = file && (!hash || idsOf(file).has(decodeURIComponent(hash)));
    if (!ok) {
      broken++;
      console.error(`${page.slice(DIST.length)}: ${href}`);
    }
  }
}
if (broken) {
  console.error(`${broken} broken internal link(s)`);
  process.exit(1);
}
console.log("Internal links OK");
