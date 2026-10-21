// The sample vault the screenshots are taken in. The drawings are ordinary
// Excalidraw scenes written here; the app renders them for real.

let n = 0;
const id = (p) => `${p}-${++n}`;
const seed = () => 1000 + n * 37;

const INK = "#1e1e1e";
const BLUE = "#1971c2";
const RED = "#e03131";
const GREEN = "#2f9e44";
const FILL = {
  blue: "#a5d8ff",
  green: "#b2f2bb",
  yellow: "#ffec99",
  red: "#ffc9c9",
  violet: "#d0bfff",
  orange: "#ffd8a8",
};

const base = (type, x, y, width, height, o = {}) => ({
  id: id(type),
  type,
  x,
  y,
  width,
  height,
  angle: 0,
  strokeColor: INK,
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 1,
  opacity: 100,
  groupIds: [],
  frameId: null,
  roundness: null,
  seed: seed(),
  version: 1,
  versionNonce: seed(),
  isDeleted: false,
  boundElements: [],
  updated: 1,
  link: null,
  locked: false,
  ...o,
});

// Excalifont is roughly 0.52em per character; Excalidraw re-measures on load.
const measure = (text, size) => {
  const lines = text.split("\n");
  const longest = Math.max(...lines.map((l) => l.length));
  return { w: Math.ceil(longest * size * 0.52), h: Math.ceil(lines.length * size * 1.25) };
};

const text = (x, y, value, o = {}) => {
  const size = o.fontSize ?? 20;
  const { w, h } = measure(value, size);
  return base("text", x, y, w, h, {
    text: value,
    originalText: value,
    fontSize: size,
    fontFamily: 5,
    textAlign: "left",
    verticalAlign: "top",
    containerId: null,
    lineHeight: 1.25,
    autoResize: true,
    strokeWidth: 1,
    ...o,
  });
};

/** A shape with a centred label bound to it. Returns [shape, label]. */
const box = (type, x, y, w, h, label, o = {}) => {
  const shape = base(type, x, y, w, h, {
    roundness: type === "rectangle" ? { type: 3 } : { type: 2 },
    ...o,
  });
  if (!label) return [shape];
  const size = o.fontSize ?? 20;
  const m = measure(label, size);
  const t = text(x + (w - m.w) / 2, y + (h - m.h) / 2, label, {
    fontSize: size,
    textAlign: "center",
    verticalAlign: "middle",
    containerId: shape.id,
    strokeColor: o.strokeColor ?? INK,
  });
  delete shape.fontSize;
  shape.boundElements = [{ type: "text", id: t.id }];
  return [shape, t];
};

const arrow = (from, to, o = {}) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  return base("arrow", x1, y1, Math.abs(x2 - x1), Math.abs(y2 - y1), {
    points: [
      [0, 0],
      [x2 - x1, y2 - y1],
    ],
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
    elbowed: false,
    roundness: { type: 2 },
    ...o,
  });
};

const line = (points, o = {}) => {
  const [x0, y0] = points[0];
  const rel = points.map(([x, y]) => [x - x0, y - y0]);
  const xs = rel.map((p) => p[0]);
  const ys = rel.map((p) => p[1]);
  return base("line", x0, y0, Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), {
    points: rel,
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: null,
    ...o,
  });
};

const scene = (elements, appState = {}) =>
  JSON.stringify({
    type: "excalidraw",
    version: 2,
    source: "vaultdraw",
    elements: elements.flat(),
    appState: { gridSize: 20, viewBackgroundColor: "#ffffff", ...appState },
    files: {},
  });

// --- drawings ---------------------------------------------------------------

const architecture = () =>
  scene([
    text(120, 60, "Vaultdraw, how it fits together", { fontSize: 32 }),
    text(122, 108, "one window, one folder, no server", { fontSize: 18, strokeColor: "#868e96" }),

    box("rectangle", 120, 180, 300, 260, null, { backgroundColor: FILL.blue, fillStyle: "hachure", strokeColor: BLUE }),
    text(140, 196, "Webview", { fontSize: 24, strokeColor: BLUE }),
    box("rectangle", 145, 245, 250, 56, "Excalidraw editor"),
    box("rectangle", 145, 315, 250, 56, "File tree + tabs"),
    text(150, 392, "React 19", { fontSize: 16, strokeColor: "#868e96" }),

    box("rectangle", 560, 180, 300, 260, null, { backgroundColor: FILL.orange, fillStyle: "hachure", strokeColor: "#e8590c" }),
    text(580, 196, "Rust core", { fontSize: 24, strokeColor: "#e8590c" }),
    box("rectangle", 585, 245, 250, 56, "Atomic writes"),
    box("rectangle", 585, 315, 250, 56, "Watcher + search"),
    text(590, 392, "Tauri 2", { fontSize: 16, strokeColor: "#868e96" }),

    arrow([425, 270], [555, 270], { startArrowhead: "arrow" }),
    text(448, 236, "IPC", { fontSize: 18 }),

    box("ellipse", 1000, 220, 220, 180, "your folder\n*.excalidraw", { backgroundColor: FILL.green, fillStyle: "solid" }),
    arrow([865, 310], [995, 310], { startArrowhead: "arrow" }),

    text(1000, 430, "plain files: back up,\nsync or git them", { fontSize: 18, strokeColor: "#868e96" }),

    box("rectangle", 120, 520, 420, 110, null, { strokeStyle: "dashed", strokeColor: "#868e96" }),
    text(140, 538, "Related", { fontSize: 20, strokeColor: "#868e96" }),
    text(140, 572, "[[Roadmap]]  ·  [[Raft]]  ·  [[Weekly review]]", { fontSize: 20 }),

    text(640, 560, "autosave: atomic,\nrevision-checked writes", { fontSize: 20, strokeColor: RED }),
    arrow([760, 545], [700, 445], { strokeColor: RED, roundness: { type: 2 } }),
  ]);

const roadmap = () =>
  scene([
    text(100, 60, "Roadmap", { fontSize: 36 }),
    ...["Now", "Next", "Later"].map((h, i) => text(100 + i * 330, 140, h, { fontSize: 24, strokeColor: [GREEN, BLUE, "#868e96"][i] })),
    box("rectangle", 100, 190, 280, 80, "Signed macOS build", { backgroundColor: FILL.green }),
    box("rectangle", 100, 290, 280, 80, "Windows + Linux", { backgroundColor: FILL.green }),
    box("rectangle", 430, 190, 280, 80, "Plugins", { backgroundColor: FILL.blue }),
    box("rectangle", 430, 290, 280, 80, "CLI: export from\nthe terminal", { backgroundColor: FILL.blue }),
    box("rectangle", 760, 190, 280, 80, "Presentation mode", { backgroundColor: FILL.yellow }),
    text(100, 420, "see [[Architecture]] and [[Weekly review]]", { fontSize: 20 }),
  ]);

const raft = () => {
  const nodes = [
    [520, 120, "leader", FILL.yellow],
    [260, 330, "follower", FILL.blue],
    [780, 330, "follower", FILL.blue],
    [380, 560, "follower", FILL.blue],
    [660, 560, "candidate", FILL.red],
  ];
  const els = nodes.map(([x, y, l, c]) => box("ellipse", x, y, 160, 110, l, { backgroundColor: c }));
  return scene([
    text(80, 50, "Raft: leader election", { fontSize: 32 }),
    ...els,
    arrow([560, 235], [380, 330]),
    arrow([640, 235], [800, 330]),
    arrow([580, 235], [460, 555]),
    arrow([620, 235], [720, 555], { strokeStyle: "dashed" }),
    text(80, 120, "1. heartbeats every 50 ms\n2. no heartbeat → become candidate\n3. majority votes → new leader", { fontSize: 18 }),
    text(860, 600, "term 7", { fontSize: 18, strokeColor: RED }),
    text(80, 230, "see also [[Consistent hashing]]\nand [[Reading list]]", { fontSize: 18, strokeColor: "#868e96" }),
  ]);
};

const hashing = () => {
  const cx = 480;
  const cy = 380;
  const r = 220;
  const dots = [0, 50, 110, 170, 220, 290].map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    return box("ellipse", cx + r * Math.cos(a) - 22, cy + r * Math.sin(a) - 22, 44, 44, null, {
      backgroundColor: [FILL.blue, FILL.green, FILL.yellow, FILL.red, FILL.violet, FILL.orange][i],
    });
  });
  return scene([
    text(80, 60, "Consistent hashing", { fontSize: 32 }),
    base("ellipse", cx - r, cy - r, 2 * r, 2 * r, { roundness: { type: 2 } }),
    ...dots,
    text(760, 300, "a key walks clockwise\nto the next node", { fontSize: 20 }),
    arrow([750, 330], [690, 380]),
    text(80, 680, "used by [[Raft]]? no: by the storage layer", { fontSize: 18, strokeColor: "#868e96" }),
  ]);
};

const graphs = () => {
  const pts = [
    [200, 200], [400, 140], [420, 340], [620, 220], [640, 420], [260, 420],
  ];
  const nodes = pts.map(([x, y], i) => box("ellipse", x, y, 70, 70, String.fromCharCode(65 + i), { backgroundColor: i === 0 ? FILL.yellow : "transparent" }));
  const c = (i) => [pts[i][0] + 35, pts[i][1] + 35];
  return scene([
    text(80, 60, "BFS from A", { fontSize: 32 }),
    ...nodes,
    ...[[0, 1], [0, 5], [1, 2], [1, 3], [2, 4], [3, 4], [5, 2]].map(([a, b]) => line([c(a), c(b)], { strokeWidth: 1 })),
    text(780, 200, "queue: A → B F → C D → E", { fontSize: 20, strokeColor: BLUE }),
    text(780, 260, "from [[Reading list]]", { fontSize: 18, strokeColor: "#868e96" }),
  ]);
};

const weekly = () =>
  scene([
    text(80, 50, "Weekly review, w42", { fontSize: 32 }),
    box("rectangle", 80, 130, 260, 200, "shipped\nsmooth tabs\nhistory panel", { backgroundColor: FILL.green, roundness: null }),
    box("rectangle", 370, 130, 260, 200, "stuck on\nnotarisation", { backgroundColor: FILL.red, roundness: null }),
    box("rectangle", 660, 130, 260, 200, "next\nsearch ranking\nshare to PDF", { backgroundColor: FILL.yellow, roundness: null }),
    text(80, 380, "links: [[Architecture]] [[Reading list]]", { fontSize: 20 }),
  ]);

const reading = () =>
  scene([
    text(80, 50, "Reading list", { fontSize: 32 }),
    text(80, 120, "☐ Designing Data-Intensive Applications\n☑ In Search of an Understandable\n   Consensus Algorithm\n☐ Local-first software\n☐ The Raft paper, again", { fontSize: 22 }),
    text(560, 130, "→ notes in [[Raft]]", { fontSize: 20, strokeColor: BLUE }),
  ]);

const meeting = () =>
  scene([
    text(80, 50, "Meeting", { fontSize: 32 }),
    text(80, 110, "date ·  people ·  goal", { fontSize: 18, strokeColor: "#868e96" }),
    box("rectangle", 80, 160, 360, 260, null, { roundness: null }),
    text(100, 175, "Notes", { fontSize: 20 }),
    box("rectangle", 470, 160, 300, 260, null, { roundness: null }),
    text(490, 175, "Decisions", { fontSize: 20 }),
    text(80, 450, "file under [[Weekly review]]", { fontSize: 18, strokeColor: "#868e96" }),
  ]);

const inbox = () =>
  scene([
    text(100, 100, "quick idea: drag a PDF in\nand draw on top of it", { fontSize: 24 }),
    arrow([420, 170], [520, 240]),
    box("rectangle", 520, 230, 200, 140, "page 1", { strokeStyle: "dashed" }),
    text(100, 420, "→ [[Roadmap]]", { fontSize: 20 }),
  ]);

export const VAULT_NAME = "Sketchbook";

export const DRAWINGS = {
  "Projects/Vaultdraw/Architecture.excalidraw": architecture,
  "Projects/Vaultdraw/Roadmap.excalidraw": roadmap,
  "Learning/Distributed systems/Raft.excalidraw": raft,
  "Learning/Distributed systems/Consistent hashing.excalidraw": hashing,
  "Learning/Graphs.excalidraw": graphs,
  "Notes/Weekly review.excalidraw": weekly,
  "Notes/Reading list.excalidraw": reading,
  "Templates/Meeting.excalidraw": meeting,
  "Inbox.excalidraw": inbox,
};

/** path → scene JSON, built fresh so ids are stable run to run. */
export const buildVault = () => {
  n = 0;
  return Object.fromEntries(Object.entries(DRAWINGS).map(([p, f]) => [p, f()]));
};

// --- sketches: drawings exported as SVG for the site itself ------------------

const heroSketch = () =>
  scene([
    // the folder: a body and a tab
    line([[0, 168], [0, 150], [70, 150], [86, 168]], { strokeWidth: 2 }),
    box("rectangle", 0, 168, 220, 136, "Sketchbook/", { backgroundColor: FILL.yellow, fillStyle: "hachure", fontSize: 24, roundness: { type: 3 } }),

    box("rectangle", 330, 40, 214, 56, "Raft.excalidraw", { backgroundColor: FILL.blue, fillStyle: "hachure", fontSize: 18 }),
    box("rectangle", 350, 206, 214, 56, "Roadmap.excalidraw", { backgroundColor: FILL.green, fillStyle: "hachure", fontSize: 18 }),
    box("rectangle", 320, 372, 214, 56, "Inbox.excalidraw", { backgroundColor: FILL.red, fillStyle: "hachure", fontSize: 18 }),

    arrow([226, 200], [322, 76]),
    arrow([228, 236], [342, 234]),
    arrow([224, 278], [314, 394]),

    arrow([480, 102], [480, 198], { strokeStyle: "dashed", strokeColor: RED, startArrowhead: "arrow" }),
    text(498, 136, "[[link]]", { fontSize: 18, strokeColor: RED }),

    text(10, 340, "just files.", { fontSize: 22, strokeColor: RED }),
    text(10, 372, "no account, no cloud", { fontSize: 18 }),
  ]);

export const SKETCHES = {
  hero: heroSketch,
};
