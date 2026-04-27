(() => {
  const root = document.documentElement;
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const storageKey = "kz-site-theme";

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem(storageKey, next);
    setTheme(next);
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeNav() {
    setNavOpen(false);
  }

  function onDocumentClick(e) {
    if (!nav || !navToggle) return;
    if (!nav.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (nav.contains(target) || navToggle.contains(target)) return;
    closeNav();
  }

  function highlightActiveSection() {
    const anchors = navLinks
      .map((a) => {
        const id = a.getAttribute("href")?.slice(1);
        const el = id ? document.getElementById(id) : null;
        return { a, el };
      })
      .filter((x) => x.el);

    const y = window.scrollY + 120;
    let active = anchors[0]?.a ?? null;

    for (const { a, el } of anchors) {
      if (!el) continue;
      if (el.offsetTop <= y) active = a;
    }

    for (const link of navLinks) link.removeAttribute("aria-current");
    if (active) active.setAttribute("aria-current", "page");
  }

  // Init theme
  setTheme(getPreferredTheme());
  themeToggle?.addEventListener("click", toggleTheme);

  // Mobile nav
  navToggle?.addEventListener("click", () => {
    if (!nav) return;
    setNavOpen(!nav.classList.contains("is-open"));
  });
  nav?.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest("a")) closeNav();
  });
  document.addEventListener("click", onDocumentClick);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeNav();
  });

  // Active section highlighting
  highlightActiveSection();
  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(highlightActiveSection);
  });
})();
