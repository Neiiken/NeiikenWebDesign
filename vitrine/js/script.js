(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Petits utilitaires ---------- */
  function each(sel, fn) { document.querySelectorAll(sel).forEach(fn); }
  function fr(n) { return String(n).replace(".", ","); } // 4.9 -> 4,9

  var mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(cfg.mapsQuery || cfg.address || "");
  var mapsEmbed = "https://maps.google.com/maps?q=" +
    encodeURIComponent(cfg.mapsQuery || cfg.address || "") + "&z=14&output=embed";

  /* ---------- Data binding (data-bind="…") ---------- */
  var binders = {
    name:        function (el) { el.textContent = cfg.name; },
    legalName:   function (el) { el.textContent = cfg.legalName || cfg.name; },
    tagline:     function (el) { el.textContent = cfg.tagline; },
    sector:      function (el) { el.textContent = cfg.sector; },
    city:        function (el) { el.textContent = cfg.city; },
    years:       function (el) { el.textContent = cfg.yearsInBusiness; },
    serviceArea: function (el) { el.textContent = cfg.serviceArea; },
    emergency:   function (el) { el.textContent = cfg.emergency; },
    address:     function (el) { el.textContent = cfg.address; },
    rating:      function (el) { el.textContent = fr(cfg.rating); },
    reviewsCount:function (el) { el.textContent = cfg.reviewsCount; },
    phoneText:   function (el) { el.textContent = cfg.phoneDisplay; },
    emailText:   function (el) { el.textContent = cfg.email; },
    tel:         function (el) { el.setAttribute("href", "tel:" + cfg.phone); },
    mail:        function (el) { el.setAttribute("href", "mailto:" + cfg.email); },
    directions:  function (el) { el.setAttribute("href", mapsUrl); },
    googleBusiness: function (el) { el.setAttribute("href", cfg.googleBusinessUrl || mapsUrl); },
  };
  each("[data-bind]", function (el) {
    var fn = binders[el.getAttribute("data-bind")];
    if (fn) fn(el);
  });

  document.title = cfg.name + " — " + cfg.sector + " à " + cfg.city;

  /* ---------- Horaires + badge ouvert/fermé ---------- */
  var hoursList = document.getElementById("hours-list");
  if (hoursList && Array.isArray(cfg.hours)) {
    hoursList.innerHTML = cfg.hours.map(function (h) {
      return "<li><strong>" + h.days + "</strong><span>" + h.time + "</span></li>";
    }).join("");
  }
  // Estimation "ouvert maintenant" à partir des créneaux Schema (Mo-Fr 08:00-19:00…)
  var badge = document.getElementById("open-badge");
  if (badge && Array.isArray(cfg.hours)) {
    var open = isOpenNow(cfg.hours);
    if (open !== null) {
      badge.hidden = false;
      badge.textContent = open ? "Ouvert" : "Fermé";
      badge.className = "badge " + (open ? "open" : "closed");
    }
  }

  function isOpenNow(hours) {
    var dayMap = { Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6, Su: 0 };
    var now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var found = false;
    for (var i = 0; i < hours.length; i++) {
      var s = hours[i].schema;
      if (!s) continue;
      var m = s.match(/^([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
      if (!m) continue;
      found = true;
      var d1 = dayMap[m[1]], d2 = m[2] ? dayMap[m[2]] : d1;
      var inRange = d1 <= d2 ? (day >= d1 && day <= d2) : (day >= d1 || day <= d2);
      if (!inRange) continue;
      var start = (+m[3]) * 60 + (+m[4]), end = (+m[5]) * 60 + (+m[6]);
      if (mins >= start && mins <= end) return true;
    }
    return found ? false : null;
  }

  /* ---------- JSON-LD LocalBusiness (SEO local) ---------- */
  var openingSpecs = (cfg.hours || []).filter(function (h) { return h.schema; })
    .map(function (h) {
      var m = h.schema.match(/^([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
      if (!m) return null;
      var order = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      var names = { Mo:"Monday",Tu:"Tuesday",We:"Wednesday",Th:"Thursday",Fr:"Friday",Sa:"Saturday",Su:"Sunday" };
      var days = [], i1 = order.indexOf(m[1]), i2 = m[2] ? order.indexOf(m[2]) : i1;
      for (var i = i1; ; i = (i + 1) % 7) { days.push(names[order[i]]); if (i === i2) break; }
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens: m[3], closes: m[4] };
    }).filter(Boolean);

  var ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: cfg.legalName || cfg.name,
    description: cfg.tagline,
    telephone: cfg.phone,
    email: cfg.email,
    address: { "@type": "PostalAddress", streetAddress: cfg.address, addressLocality: cfg.city, addressCountry: "FR" },
    areaServed: cfg.serviceArea,
    priceRange: cfg.priceRange || "€€",
    url: (typeof location !== "undefined" ? location.origin + location.pathname : ""),
    openingHoursSpecification: openingSpecs,
    aggregateRating: { "@type": "AggregateRating", ratingValue: cfg.rating, reviewCount: cfg.reviewsCount }
  };
  if (cfg.googleBusinessUrl) ld.sameAs = [cfg.googleBusinessUrl];
  var ldScript = document.createElement("script");
  ldScript.type = "application/ld+json";
  ldScript.textContent = JSON.stringify(ld);
  document.head.appendChild(ldScript);

  /* ---------- Année du footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Thème (auto + bascule manuelle) ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);

  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
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

  /* ---------- Ombre du header au scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Reveal au scroll ---------- */
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

  /* ---------- Carte : chargement au clic (perf) ---------- */
  var facade = document.getElementById("map-facade");
  var mapWrap = document.getElementById("map-embed");
  if (facade && mapWrap) {
    facade.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = mapsEmbed;
      iframe.loading = "lazy";
      iframe.title = "Carte — " + cfg.name;
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      iframe.allowFullscreen = true;
      mapWrap.innerHTML = "";
      mapWrap.appendChild(iframe);
    });
  }

  /* ---------- Formulaire de contact (démo, sans backend) ---------- */
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
      // Démo : à brancher sur un service d'e-mail (Formspree, etc.) ou une API first-party.
      status.textContent = "Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 24h.";
      status.className = "form-status ok";
      form.reset();
    });
  }
})();
