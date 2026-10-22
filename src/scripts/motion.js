// One-shot motion that CSS can't do on its own: the hero sketch draws itself,
// element by element, the way it was drawn in Excalidraw. Skipped entirely
// when the visitor prefers reduced motion (the sketch is then just shown).

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

const draw = (svg) => {
  // Excalidraw exports one top-level <g> per element, in drawing order.
  const groups = [...svg.children].filter((el) => el.tagName === "g");
  const ease = "cubic-bezier(.55,.05,.25,1)";
  groups.forEach((g, i) => {
    const delay = 150 + i * 85;
    for (const path of g.querySelectorAll("path")) {
      const len = path.getTotalLength();
      if (!len) continue;
      // Dashed strokes would draw solid; let them fade in instead.
      if (path.getAttribute("stroke-dasharray")) {
        path.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: delay + 100, fill: "backwards" });
        continue;
      }
      path.style.strokeDasharray = `${len}`;
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: Math.min(750, 260 + len * 0.6),
        delay,
        easing: ease,
        fill: "backwards",
      }).onfinish = () => (path.style.strokeDasharray = "");
    }
    for (const text of g.querySelectorAll("text")) {
      text.animate([{ opacity: 0, transform: "translateY(3px)" }, { opacity: 1, transform: "none" }], {
        duration: 400,
        delay: delay + 200,
        easing: "ease-out",
        fill: "backwards",
      });
    }
  });
  svg.style.visibility = "visible";
};

for (const svg of document.querySelectorAll(".sketch--draw svg")) {
  if (calm) svg.style.visibility = "visible";
  else draw(svg);
}
