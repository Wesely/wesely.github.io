/* Language toggle (EN / 繁中) + scroll reveal.
   Pure vanilla — no build step, works as-is on GitHub Pages. */

(function () {
  "use strict";

  var STORAGE_KEY = "wesley-lang";
  var body = document.body;
  var toggle = document.getElementById("langToggle");

  // Each language shows the other language's name as the toggle label.
  var LABELS = { en: "中文", zh: "EN" };

  // Contact buttons: type → href builder + accessible label per language.
  // Values live base64-encoded in data-v so no plaintext is in the HTML source.
  var CONTACTS = {
    email: { build: function (v) { return "mailto:" + v; }, en: "Email", zh: "電子郵件" },
    phone: { build: function (v) { return "tel:" + v; }, en: "Phone", zh: "電話" },
    line:  { build: function (v) { return "https://line.me/ti/p/~" + v; }, en: "LINE", zh: "LINE" }
  };

  function decode(b64) {
    try { return decodeURIComponent(escape(atob(b64))); }
    catch (e) { return ""; }
  }

  function applyLang(lang) {
    var isZh = lang === "zh";
    body.classList.toggle("lang-zh", isZh);
    body.classList.toggle("lang-en", !isZh);
    document.documentElement.lang = isZh ? "zh-Hant-TW" : "en";
    if (toggle) toggle.textContent = LABELS[lang];

    // Refresh contact button labels in the active language.
    var btns = document.querySelectorAll(".icon-btn[data-contact]");
    btns.forEach(function (btn) {
      var spec = CONTACTS[btn.getAttribute("data-contact")];
      if (spec) {
        btn.setAttribute("aria-label", spec[lang]);
        btn.setAttribute("title", spec[lang]);
      }
    });
  }

  // Assemble the real hrefs once, at runtime — never present in static HTML.
  function buildContacts() {
    document.querySelectorAll(".icon-btn[data-contact]").forEach(function (btn) {
      var spec = CONTACTS[btn.getAttribute("data-contact")];
      var v = decode(btn.getAttribute("data-v") || "");
      if (spec && v) btn.setAttribute("href", spec.build(v));
    });
  }

  buildContacts();

  // Initial language: stored preference → browser hint → English.
  function initialLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (stored === "en" || stored === "zh") return stored;
    var nav = (navigator.language || "").toLowerCase();
    return nav.indexOf("zh") === 0 ? "zh" : "en";
  }

  applyLang(initialLang());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = body.classList.contains("lang-zh") ? "en" : "zh";
      applyLang(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  // Current year in footer.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Scroll reveal — tag every section and animate on entry.
  var sections = document.querySelectorAll("main > section");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    sections.forEach(function (s) {
      s.classList.add("reveal");
      io.observe(s);
    });
  }
})();
