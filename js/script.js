(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};
  function each(sel, fn) { document.querySelectorAll(sel).forEach(fn); }

  /* ---------- Data binding ---------- */
  var binders = {
    brand:     function (el) { el.textContent = cfg.brand; },
    role:      function (el) { el.textContent = cfg.role; },
    baseline:  function (el) { el.textContent = cfg.baseline; },
    emailText: function (el) { el.textContent = cfg.email; },
    phoneText: function (el) { el.textContent = cfg.phoneDisplay || ""; },
    mail:      function (el) { el.setAttribute("href", "mailto:" + cfg.email); },
    tel:       function (el) { el.setAttribute("href", "tel:" + cfg.phone); },
    demo:      function (el) { if (cfg.demoUrl) el.setAttribute("href", cfg.demoUrl); },
    github:    function (el) { el.setAttribute("href", cfg.githubUrl || "#"); },
    linkedin:  function (el) { el.setAttribute("href", cfg.linkedinUrl || "#"); },
  };
  each("[data-bind]", function (el) {
    var fn = binders[el.getAttribute("data-bind")];
    if (fn) fn(el);
  });

  /* ---------- Téléphone : affiché seulement s'il est renseigné ---------- */
  var phoneItem = document.getElementById("phone-item");
  if (phoneItem && cfg.phone) phoneItem.hidden = false;

  /* ---------- Secteurs ---------- */
  var sectorsEl = document.getElementById("sectors");
  if (sectorsEl && Array.isArray(cfg.sectors)) {
    sectorsEl.innerHTML = cfg.sectors.map(function (s) {
      return '<li><span class="s-emoji" aria-hidden="true">' + s.icon + "</span>" + s.label + "</li>";
    }).join("");
  }

  /* ---------- Année ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Thème (auto + bascule) ---------- */
  var root = document.documentElement, saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var cur = root.getAttribute("data-theme") || (sysDark ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Menu mobile ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Ombre header ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Reveal ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Scrollspy ---------- */
  var spySections = document.querySelectorAll("main section[id]");
  var spyLinks = document.querySelectorAll(".nav-links a");
  if ("IntersectionObserver" in window && spyLinks.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spySections.forEach(function (s) { so.observe(s); });
  }

  /* ---------- Formulaire (démo, sans backend) ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Merci de compléter les champs requis.";
        status.className = "form-status err";
        form.reportValidity();
        return;
      }
      status.textContent = "Merci ! Votre demande est bien reçue. Je vous réponds sous 24h.";
      status.className = "form-status ok";
      form.reset();
    });
  }
})();
