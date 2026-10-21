// A deliberately small highlighter for the few kinds of snippet on the site.
// Returns HTML; colours come from the theme (see .tok-* in CodePanel).

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const span = (cls, s) => `<span class="tok-${cls}">${esc(s)}</span>`;

const RULES = {
  toml: [
    [/^#.*/, "c"],
    [/^\[[^\]]+\]/, "h"],
    [/^"(?:[^"\\]|\\.)*"/, "s"],
    [/^(true|false)\b/, "b"],
    [/^-?\d[\d_.]*/, "n"],
    [/^[A-Za-z_][\w.-]*(?=\s*=)/, "k"],
  ],
  json: [
    [/^"(?:[^"\\]|\\.)*"(?=\s*:)/, "k"],
    [/^"(?:[^"\\]|\\.)*"/, "s"],
    [/^(true|false|null)\b/, "b"],
    [/^-?\d[\d.e+-]*/, "n"],
  ],
  sh: [
    [/^#.*/, "c"],
    [/^"(?:[^"\\]|\\.)*"/, "s"],
    [/^(?<=^|\s)(git|npm|yarn|cd|open|ls|cargo)\b/, "h"],
    [/^--?[\w-]+/, "k"],
  ],
  tree: [
    [/^#.*/, "c"],
    [/^[├└│─ ]+/, "c"],
    [/^[^#/]+\//, "h"],
    [/^[^#/]+\.excalidraw\b/, "k"],
    [/^[^#/]+\.(toml|json)\b/, "s"],
  ],
};

export const highlight = (code, lang) => {
  const rules = RULES[lang];
  if (!rules) return esc(code);
  return code
    .split("\n")
    .map((line) => {
      let out = "";
      let rest = line;
      let plain = "";
      outer: while (rest) {
        for (const [re, cls] of rules) {
          const m = rest.match(re);
          if (m && m[0]) {
            out += esc(plain) + span(cls, m[0]);
            plain = "";
            rest = rest.slice(m[0].length);
            continue outer;
          }
        }
        plain += rest[0];
        rest = rest.slice(1);
      }
      return out + esc(plain);
    })
    .join("\n");
};
