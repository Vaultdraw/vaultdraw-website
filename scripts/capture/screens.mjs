// One entry per screenshot: how to get the app into that state.

const MOD = "Meta"; // the harness runs with macOS chrome

const openPath = async (page, ...names) => {
  for (const name of names) {
    await page.locator(".vault-tree-item__name", { hasText: name }).first().click();
    await page.waitForTimeout(150);
  }
  await page.locator(".vault-editor canvas.interactive").waitFor();
  await page.waitForTimeout(1200);
};

/** Zoom the canvas to fit the drawing (Excalidraw's Shift+1). */
const fit = async (page) => {
  await page.locator(".vault-editor canvas.interactive").click({ position: { x: 5, y: 400 } });
  await page.keyboard.press("Shift+1");
  await page.waitForTimeout(500);
};

const activity = (page, label) =>
  page.locator(".vault-activity-bar__btn", { hasText: "" }).and(page.getByLabel(label, { exact: true })).click();

/**
 * Earlier states of a drawing, as the app would have kept them: the scene
 * growing over an afternoon, with one named checkpoint.
 */
const seedHistory = (page, path) =>
  page.evaluate((path) => {
    const full = JSON.parse(window.__sampleVault[path]);
    const repo = window.__historyRepo;
    const now = Date.now();
    const steps = [
      { keep: 3, ago: 26 * 3600e3, reason: "first" },
      { keep: 9, ago: 5 * 3600e3, reason: "auto" },
      { keep: 14, ago: 3 * 3600e3, reason: "checkpoint", name: "before the review" },
      { keep: 19, ago: 95 * 60e3, reason: "auto" },
      { keep: 23, ago: 40 * 60e3, reason: "leave" },
      { keep: full.elements.length, ago: 6 * 60e3, reason: "auto" },
    ];
    for (const s of steps) {
      const keepIds = new Set(full.elements.slice(0, s.keep).map((e) => e.id));
      const elements = full.elements.filter((e) => keepIds.has(e.id) || keepIds.has(e.containerId));
      repo.inject(path, JSON.stringify({ ...full, elements }), {
        reason: s.reason,
        name: s.name ?? null,
        createdAt: now - s.ago,
        elementCount: elements.length,
      });
    }
  }, path);

export const SCREENS = [
  {
    name: "editor",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
    },
  },
  {
    name: "search",
    run: async (page) => {
      await openPath(page, "Learning", "Distributed systems", "Raft");
      await fit(page);
      await activity(page, "Search");
      await page.waitForTimeout(300);
      await page.keyboard.type("leader", { delay: 40 });
      await page.waitForTimeout(1200);
    },
  },
  {
    name: "graph",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await activity(page, "Graph view");
      await page.waitForTimeout(2000);
      await page.getByRole("button", { name: "Fit", exact: true }).click();
      await page.waitForTimeout(800);
      await page.mouse.move(600, 480);
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, -120);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(1200);
    },
  },
  {
    name: "palette",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
      await page.keyboard.press(`${MOD}+Shift+P`);
      await page.waitForTimeout(300);
      await page.keyboard.type("export", { delay: 40 });
      await page.waitForTimeout(500);
    },
  },
  {
    name: "history",
    run: async (page) => {
      await seedHistory(page, "Projects/Vaultdraw/Architecture.excalidraw");
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
      await activity(page, "History");
      await page.waitForTimeout(1000);
    },
  },
  {
    name: "tags",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
      await page.getByRole("region", { name: "Tags" }).getByRole("button", { name: /^Tag project,/ }).click();
      await page.waitForTimeout(800);
    },
  },
  {
    name: "links",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
      await page.keyboard.press(`${MOD}+Alt+b`);
      await page.locator(".vault-links__row--backlink").first().waitFor();
      await page.waitForTimeout(600);
    },
  },
  {
    name: "tools",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await page.keyboard.press(`${MOD}+Comma`);
      await page.getByRole("tab", { name: "Tools", exact: true }).click();
      await page.getByRole("tablist", { name: "Tools" }).getByRole("tab", { name: "Arrow" }).click();
      await page.getByTestId("tool-default-arrow").waitFor();
      await page.waitForTimeout(800);
    },
  },
  {
    name: "templates",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await page.keyboard.press("Control+Alt+N");
      await page.getByRole("dialog", { name: "New drawing from template" }).waitFor();
      await page.locator(".template-picker__row").first().waitFor();
      await page.waitForTimeout(800);
    },
  },
  {
    name: "import",
    run: async (page) => {
      // The harness's PDF bridge is a fake that renders placeholder pages, so
      // the shot is of the real import dialog only, not of imported pages.
      await page.evaluate(() => {
        const b = window.__pdfBridge;
        b.nextPick = b.makeDoc("raft-paper.pdf", Array.from({ length: 18 }, () => ({ widthPt: 595, heightPt: 842 })));
      });
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
      await page.keyboard.press(`${MOD}+Shift+P`);
      await page.keyboard.type("Import: PDF", { delay: 30 });
      await page.keyboard.press("Enter");
      const d = page.getByRole("dialog", { name: "Import PDF" });
      await d.waitFor();
      await d.getByPlaceholder(/all, or e\.g\./).fill("1-5");
      await page.waitForTimeout(500);
    },
  },
  {
    name: "themes",
    run: async (page) => {
      await openPath(page, "Projects", "Vaultdraw", "Architecture");
      await fit(page);
      await page.keyboard.press(`${MOD}+Comma`);
      await page.getByRole("tab", { name: "Appearance", exact: true }).click();
      await page.waitForTimeout(800);
    },
  },
];
