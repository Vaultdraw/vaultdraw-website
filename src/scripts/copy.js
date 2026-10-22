// Copy buttons. Markup: .copy > pre + button.copy__btn[hidden] + .copy__live. Docs <pre> get it added here.
const B = "copy__btn";
for (const pre of document.querySelectorAll(".prose pre")) {
  if (pre.closest(".copy") || pre.querySelector("svg")) continue;
  const w = document.createElement("div");
  w.className = "copy";
  pre.replaceWith(w);
  w.append(pre, Object.assign(document.createElement("button"), { type: "button", className: B, hidden: true, textContent: "Copy" }));
  w.insertAdjacentHTML("beforeend", '<span class="copy__live visually-hidden" aria-live="polite"></span>');
}
for (const w of document.querySelectorAll(".copy")) {
  const b = w.querySelector("." + B), live = w.querySelector(".copy__live");
  let t;
  b.hidden = false;
  b.setAttribute("aria-label", "Copy command");
  b.onclick = async () => {
    try {
      await navigator.clipboard.writeText(w.querySelector("pre").textContent.trim());
    } catch {
      return;
    }
    b.textContent = live.textContent = "Copied";
    clearTimeout(t);
    t = setTimeout(() => ((b.textContent = "Copy"), (live.textContent = "")), 1500);
  };
}
