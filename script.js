/* Language toggle (EN / 繁中), email copy, LINE QR dialog, scroll reveal.
   Pure vanilla — no build step, works as-is on GitHub Pages. */

(function () {
  "use strict";

  var STORAGE_KEY = "wesley-lang";
  var body = document.body;
  var toggle = document.getElementById("langToggle");

  // Toggle shows the other language's name.
  var LABELS = { en: "中文", zh: "EN" };

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
  }

  // ---- Email: fill text from base64 (kept out of static HTML) + copy ------
  var emailAddr = "";
  document.querySelectorAll(".email-chip").forEach(function (chip) {
    var addr = decode(chip.getAttribute("data-v") || "");
    if (!addr) return;
    emailAddr = addr;
    var textEl = chip.querySelector(".email-text");
    if (textEl) textEl.textContent = addr;
    chip.setAttribute("aria-label", "Copy email " + addr);

    chip.addEventListener("click", function () {
      var done = function () {
        chip.classList.add("copied");
        setTimeout(function () { chip.classList.remove("copied"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, fallbackCopy);
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        try {
          var ta = document.createElement("textarea");
          ta.value = addr;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          done();
        } catch (e) { /* ignore */ }
      }
    });
  });

  // ---- LINE QR dialog -----------------------------------------------------
  var modal = document.getElementById("lineModal");
  function openModal() { if (modal) { modal.hidden = false; document.body.style.overflow = "hidden"; } }
  function closeModal() { if (modal) { modal.hidden = true; document.body.style.overflow = ""; } }

  document.querySelectorAll(".line-btn").forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });
  if (modal) {
    modal.querySelectorAll("[data-line-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  // ---- Language init + toggle ---------------------------------------------
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

  // ---- Footer year --------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Scroll reveal ------------------------------------------------------
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
