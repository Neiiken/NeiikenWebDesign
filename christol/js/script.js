(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function fr(n) { return String(n).replace(".", ","); }   // 4.9 -> 4,9

  // Réassigné par le nuancier (section 9). Reste inoffensif si le nuancier
  // n'est pas rendu — la bascule de thème peut l'appeler dans tous les cas.
  var applyAccent = function () {};

  /* =========================================================
     1. LIAISON DES DONNÉES (data-bind="…")
     ========================================================= */
  var mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(cfg.mapsQuery || cfg.address || "");

  // Années de métier, déduites de foundedYear : le chiffre reste juste
  // d'une année sur l'autre sans qu'on ait à repasser dans le HTML.
  function yearsInTrade() {
    return cfg.foundedYear ? new Date().getFullYear() - cfg.foundedYear : null;
  }

  var binders = {
    name:        function (el) { el.textContent = cfg.name; },
    legalName:   function (el) { el.textContent = cfg.legalName || cfg.name; },
    baseline:    function (el) { el.textContent = cfg.baseline; },
    tagline:     function (el) { el.textContent = cfg.tagline; },
    sector:      function (el) { el.textContent = cfg.sector; },
    city:        function (el) { el.textContent = cfg.city; },
    department:  function (el) { el.textContent = cfg.department; },
    foundedYear: function (el) { el.textContent = cfg.foundedYear; },
    years:       function (el) { el.textContent = yearsInTrade(); },
    serviceArea: function (el) { el.textContent = cfg.serviceArea; },
    responseTime:function (el) { el.textContent = cfg.responseTime; },
    address:     function (el) { el.textContent = cfg.address; },
    postalCode:  function (el) { el.textContent = cfg.postalCode; },
    phoneText:   function (el) { el.textContent = cfg.phoneDisplay; },
    mobileText:  function (el) { el.textContent = cfg.mobileDisplay; },
    emailText:   function (el) { el.textContent = cfg.email; },
    rating:      function (el) { el.textContent = cfg.rating ? fr(cfg.rating) : ""; },
    reviewsCount:function (el) { el.textContent = cfg.reviewsCount || ""; },
    tel:         function (el) { el.setAttribute("href", "tel:" + cfg.phone); },
    mobileTel:   function (el) { el.setAttribute("href", "tel:" + (cfg.mobile || cfg.phone)); },
    mail:        function (el) { el.setAttribute("href", "mailto:" + cfg.email); },
    directions:  function (el) { el.setAttribute("href", mapsUrl); },
  };
  $$("[data-bind]").forEach(function (el) {
    var fn = binders[el.getAttribute("data-bind")];
    if (fn) fn(el);
  });

  // Blocs conditionnels : on masque plutôt que d'afficher une valeur vide
  if (!cfg.mobile) { var rowMobile = $("#row-mobile"); if (rowMobile) rowMobile.hidden = true; }
  var heroRating = $("#hero-rating");
  if (heroRating && cfg.rating) heroRating.hidden = false;

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Page « Mentions légales » ---------- */
  var legal = cfg.legal || {};
  $$("[data-legal]").forEach(function (el) {
    var v = legal[el.getAttribute("data-legal")];
    el.textContent = v || "—";
  });
  $$("[data-legal-href]").forEach(function (el) {
    var v = legal[el.getAttribute("data-legal-href")];
    if (v) { el.setAttribute("href", v); }
    else {
      // Pas d'URL renseignée : on retire le lien plutôt que d'en laisser un mort
      var span = document.createElement("span");
      span.textContent = el.textContent;
      span.className = "muted";
      el.replaceWith(span);
    }
  });

  var legalDate = $("#legal-date");
  if (legalDate && legal.updatedAt) {
    var d = new Date(legal.updatedAt + "T00:00:00");
    legalDate.textContent = isNaN(d) ? legal.updatedAt
      : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  // L'encadré « à compléter » disparaît de lui-même quand plus rien n'est à remplir
  var todoBox = $("#todo-box");
  if (todoBox) {
    var pending = Object.keys(legal).some(function (k) {
      return typeof legal[k] === "string" && legal[k].indexOf("À REMPLIR") === 0;
    });
    if (!pending) todoBox.hidden = true;
  }

  /* =========================================================
     2. HORAIRES + BADGE OUVERT / FERMÉ
     ========================================================= */
  var hoursList = $("#hours-list");
  if (hoursList && Array.isArray(cfg.hours)) {
    hoursList.innerHTML = cfg.hours.map(function (h) {
      return "<li><strong>" + h.days + "</strong><span>" + h.time + "</span></li>";
    }).join("");
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

  var badge = $("#open-badge");
  if (badge && Array.isArray(cfg.hours)) {
    var open = isOpenNow(cfg.hours);
    if (open !== null) {
      badge.hidden = false;
      badge.textContent = open ? "Ouvert" : "Fermé";
      badge.className = "badge " + (open ? "open" : "closed");
    }
  }

  /* =========================================================
     3. DONNÉES STRUCTURÉES — LocalBusiness + FAQPage
        Le FAQPage est construit depuis le DOM : une seule source
        de vérité, les questions restent dans le HTML.
     ========================================================= */
  var openingSpecs = (cfg.hours || []).filter(function (h) { return h.schema; })
    .map(function (h) {
      var m = h.schema.match(/^([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
      if (!m) return null;
      var order = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      var names = { Mo:"Monday", Tu:"Tuesday", We:"Wednesday", Th:"Thursday", Fr:"Friday", Sa:"Saturday", Su:"Sunday" };
      var days = [], i1 = order.indexOf(m[1]), i2 = m[2] ? order.indexOf(m[2]) : i1;
      for (var i = i1; ; i = (i + 1) % 7) { days.push(names[order[i]]); if (i === i2) break; }
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens: m[3], closes: m[4] };
    }).filter(Boolean);

  var services = $$("#services .svc h3").map(function (h) { return h.textContent.trim(); });

  var ld = {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    name: cfg.legalName || cfg.name,
    alternateName: cfg.name,
    description: cfg.tagline,
    telephone: cfg.phone,
    email: cfg.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: cfg.address,
      postalCode: cfg.postalCode,
      addressLocality: cfg.city,
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    areaServed: (cfg.communes || []).slice(0, 30).map(function (c) {
      return { "@type": "City", name: c };
    }),
    knowsAbout: services,
    foundingDate: cfg.foundedYear ? String(cfg.foundedYear) : undefined,
    priceRange: "€€",
    url: (typeof location !== "undefined" ? location.origin + location.pathname : ""),
    openingHoursSpecification: openingSpecs,
  };
  // La note n'est publiée que si elle provient de vraies données (règles Google)
  if (cfg.rating && cfg.reviewsCount) {
    ld.aggregateRating = { "@type": "AggregateRating", ratingValue: cfg.rating, reviewCount: cfg.reviewsCount };
  }
  if (cfg.googleBusinessUrl) ld.sameAs = [cfg.googleBusinessUrl];

  var faqEntities = $$("#faq-list details").map(function (d) {
    var q = $("summary", d), a = $("p", d);
    if (!q || !a) return null;
    return {
      "@type": "Question",
      name: q.textContent.trim(),
      acceptedAnswer: { "@type": "Answer", text: a.textContent.trim() },
    };
  }).filter(Boolean);

  function injectLd(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  injectLd(ld);
  if (faqEntities.length) injectLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqEntities });

  /* =========================================================
     4. THÈME (auto + bascule mémorisée)
     ========================================================= */
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);

  function isDark() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  var themeBtn = $(".theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    applyAccent();   // l'accent est recalculé pour rester lisible sur le nouveau fond
  });

  /* =========================================================
     5. NAVIGATION — menu mobile, ombre du header, scrollspy
     ========================================================= */
  var navToggle = $(".nav-toggle"), navLinks = $("#nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    $$("a", navLinks).forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var header = $(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var spyLinks = $$(".nav-links a");
  var spySections = $$("main section[id]");
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

  /* =========================================================
     6. RÉVÉLATION AU SCROLL + COMPTEURS
     ========================================================= */
  // Les compteurs calculés (« X ans de métier ») sont résolus avant d'être collectés
  $$("[data-count-since]").forEach(function (el) {
    var since = cfg[el.getAttribute("data-count-since")];
    if (since) el.setAttribute("data-count", String(new Date().getFullYear() - since));
  });

  var reveals = $$(".reveal");
  var counters = $$("[data-count]");

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = performance.now(), dur = 1400;
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    counters.forEach(runCounter);
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        $$("[data-count]", e.target).forEach(runCounter);
        if (e.target.hasAttribute("data-count")) runCounter(e.target);
        ro.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
    counters.forEach(function (el) { if (!el.closest(".reveal")) ro.observe(el); });
  }

  /* =========================================================
     7. BANDEAU DÉFILANT — on duplique le groupe pour une
        boucle sans raccord (l'animation translate de -50 %).
     ========================================================= */
  var bandTrack = $("#band-track");
  if (bandTrack && bandTrack.children.length === 1) {
    var clone = bandTrack.firstElementChild.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    bandTrack.appendChild(clone);
  }

  /* =========================================================
     8. OUTILS COULEUR — conversions + dérivation d'un accent
        toujours lisible sur le fond courant.
     ========================================================= */
  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    var h = 0, s = 0, l = (max + min) / 2;
    if (d) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) h = ((b - r) / d + 2);
      else                h = ((r - g) / d + 4);
      h *= 60;
    }
    return { h: h, s: s * 100, l: l * 100 };
  }
  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60)       { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else              { r = c; b = x; }
    function to(v) { return ("0" + Math.round((v + m) * 255).toString(16)).slice(-2); }
    return "#" + to(r) + to(g) + to(b);
  }
  // Luminance relative (WCAG) — sert à choisir un texte clair ou foncé
  function luminance(hex) {
    var c = hexToRgb(hex);
    var a = [c.r, c.g, c.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  // Choisit l'encre (claire ou foncée) qui contraste le mieux avec le fond donné.
  // On compare les deux rapports WCAG au lieu de fixer un seuil de luminance au jugé :
  // sur les teintes moyennes (mauves, terres), un seuil se trompe de sens.
  function inkOn(hex) {
    var dark = "#141412", light = "#FFFFFF";
    function ratio(a, b) {
      var l1 = luminance(a), l2 = luminance(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }
    return ratio(hex, dark) >= ratio(hex, light) ? dark : light;
  }

  /* Décline la teinte choisie en accent lisible sur le fond courant. */
  function deriveAccent(hex) {
    var c = hexToRgb(hex), hsl = rgbToHsl(c.r, c.g, c.b);
    var dark = isDark();
    var s = Math.min(Math.max(hsl.s, 14), 72);            // évite le gris total et le fluo
    // Bornes de clarté choisies pour garder ≥ 4,5:1 sur le fond du thème courant,
    // y compris pour les teintes les plus claires du nuancier (blanc chaux, sable).
    var l = dark ? Math.max(hsl.l, 70) : Math.min(hsl.l, 33);
    if (dark) l = Math.min(l, 84); else l = Math.max(l, 20);
    return hslToHex(hsl.h, s, l);
  }

  /* =========================================================
     9. NUANCIER INTERACTIF
     ========================================================= */
  var palette = cfg.palette || [];
  var zones = ["murs", "plafond", "boiseries"];
  var zoneLabels = { murs: "Murs", plafond: "Plafond", boiseries: "Boiseries" };
  var defaults = cfg.paletteDefaults || { murs: "#E4C79B", plafond: "#F3EFE7", boiseries: "#14304A" };

  var state = { zone: "murs", family: 0, chosen: {} };
  zones.forEach(function (z) { state.chosen[z] = findColor(defaults[z]) || { name: "—", code: "", hex: defaults[z] }; });

  function findColor(hex) {
    if (!hex) return null;
    var target = String(hex).toLowerCase(), found = null;
    palette.forEach(function (f) {
      f.colors.forEach(function (c) { if (c.hex.toLowerCase() === target) found = c; });
    });
    return found;
  }

  var familySeg = $("#family-seg");
  var swatchWrap = $("#swatches");
  var roomSvg = $("#room");

  if (familySeg && swatchWrap && palette.length) {
    familySeg.innerHTML = palette.map(function (f, i) {
      return '<button type="button" data-family="' + i + '" aria-pressed="' + (i === 0) + '">' + f.family + "</button>";
    }).join("");

    familySeg.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-family]");
      if (!btn) return;
      state.family = +btn.getAttribute("data-family");
      $$("[data-family]", familySeg).forEach(function (b) {
        b.setAttribute("aria-pressed", String(+b.getAttribute("data-family") === state.family));
      });
      renderSwatches();
    });

    function renderSwatches() {
      var colors = palette[state.family].colors;
      var current = state.chosen[state.zone];
      swatchWrap.innerHTML = colors.map(function (c) {
        var on = current && current.hex.toLowerCase() === c.hex.toLowerCase();
        return '<button type="button" class="swatch" data-hex="' + c.hex + '" data-name="' + c.name +
          '" data-code="' + c.code + '" aria-pressed="' + on + '" ' +
          'aria-label="' + c.name + ", référence " + c.code + ', appliquer sur ' + zoneLabels[state.zone].toLowerCase() + '">' +
          '<span class="swatch-color" style="background:' + c.hex + ';--check-ink:' + inkOn(c.hex) + '"></span>' +
          '<span class="swatch-meta"><span class="swatch-name">' + c.name + '</span>' +
          '<span class="swatch-code">' + c.code + "</span></span></button>";
      }).join("");
    }

    swatchWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".swatch");
      if (!btn) return;
      state.chosen[state.zone] = {
        hex: btn.getAttribute("data-hex"),
        name: btn.getAttribute("data-name"),
        code: btn.getAttribute("data-code"),
      };
      renderSwatches();
      applyRoom();
      applyAccent();
    });

    // Choix de la zone : boutons du sélecteur…
    $$("[data-zone-btn]").forEach(function (b) {
      b.addEventListener("click", function () { setZone(b.getAttribute("data-zone-btn")); });
    });
    // …et clic direct sur la pièce
    if (roomSvg) {
      $$("[data-zone]", roomSvg).forEach(function (shape) {
        shape.addEventListener("click", function () { setZone(shape.getAttribute("data-zone")); });
      });
    }

    function setZone(z) {
      if (zones.indexOf(z) === -1) return;
      state.zone = z;
      $$("[data-zone-btn]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-zone-btn") === z));
      });
      if (roomSvg) roomSvg.setAttribute("data-active", z);
      // On bascule sur la famille qui contient la teinte de la zone, si on la connaît
      var cur = state.chosen[z];
      palette.forEach(function (f, i) {
        f.colors.forEach(function (c) { if (cur && c.hex.toLowerCase() === cur.hex.toLowerCase()) state.family = i; });
      });
      $$("[data-family]", familySeg).forEach(function (b) {
        b.setAttribute("aria-pressed", String(+b.getAttribute("data-family") === state.family));
      });
      renderSwatches();
    }

    function applyRoom() {
      zones.forEach(function (z) {
        var c = state.chosen[z];
        root.style.setProperty("--c-" + z, c.hex);
        var lg = $("#lg-" + z);  if (lg) lg.style.background = c.hex;
        var rc = $("#rc-" + z);  if (rc) rc.style.background = c.hex;
        var rv = $("#rv-" + z);  if (rv) rv.textContent = c.name;
        var rh = $("#rh-" + z);  if (rh) rh.textContent = c.code ? c.code + " · " + c.hex.toUpperCase() : c.hex.toUpperCase();
      });
    }

    var skinToggle = $("#skin-site");
    applyAccent = function () {
      var on = skinToggle ? skinToggle.checked : true;
      if (!on) {
        root.style.removeProperty("--accent");
        root.style.removeProperty("--accent-ink");
        root.style.removeProperty("--accent-soft");
        return;
      }
      var src = state.chosen.murs.hex;
      var accent = deriveAccent(src);
      var rgb = hexToRgb(accent);
      root.style.setProperty("--accent", accent);
      root.style.setProperty("--accent-ink", inkOn(accent));
      root.style.setProperty("--accent-soft", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.13)");
    };
    if (skinToggle) skinToggle.addEventListener("change", applyAccent);

    renderSwatches();
    applyRoom();
    applyAccent();

    /* --- Actions du récapitulatif --- */
    function recapText() {
      return zones.map(function (z) {
        var c = state.chosen[z];
        return zoneLabels[z] + " : " + c.name + (c.code ? " (" + c.code + ")" : "") + " " + c.hex.toUpperCase();
      }).join("\n");
    }

    var toastEl = $("#toast"), toastTimer = null;
    function toast(msg) {
      if (!toastEl) return;
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
    }

    var btnCopy = $("#btn-copy");
    if (btnCopy) btnCopy.addEventListener("click", function () {
      var txt = recapText();
      function done() { toast("Références copiées dans le presse-papiers."); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = txt; ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); }
        catch (err) { toast("Copie impossible — sélectionnez les teintes à la main."); }
        document.body.removeChild(ta);
      }
    });

    var btnReset = $("#btn-reset");
    if (btnReset) btnReset.addEventListener("click", function () {
      zones.forEach(function (z) { state.chosen[z] = findColor(defaults[z]) || { name: "—", code: "", hex: defaults[z] }; });
      renderSwatches(); applyRoom(); applyAccent();
      toast("Nuancier réinitialisé.");
    });

    var btnQuote = $("#btn-to-quote");
    if (btnQuote) btnQuote.addEventListener("click", function () {
      var msg = $("#f-message");
      if (msg) {
        var bloc = "Teintes retenues sur le nuancier du site :\n" + recapText();
        msg.value = msg.value.trim() ? msg.value.trim() + "\n\n" + bloc : bloc + "\n\n";
        msg.dispatchEvent(new Event("input", { bubbles: true }));
      }
      var target = $("#devis");
      if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      setTimeout(function () { var n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, reduce ? 0 : 600);
      toast("Vos teintes ont été ajoutées à la demande de devis.");
    });
  }

  /* =========================================================
     10. ZONE D'INTERVENTION — nuage de communes + vérificateur
     ========================================================= */
  var communes = cfg.communes || [];
  var cloud = $("#commune-cloud");
  if (cloud && communes.length) {
    cloud.innerHTML = communes.map(function (c) {
      return '<span class="commune" data-commune="' + c + '">' + c + "</span>";
    }).join("");
  }

  var btnCommunes = $("#btn-communes");
  if (btnCommunes && cloud) {
    btnCommunes.addEventListener("click", function () {
      var open = cloud.classList.toggle("expanded");
      btnCommunes.textContent = open ? "Réduire la liste" : "Voir toutes les communes";
    });
  }

  // « Saint-Côme-et-Maruéjols » → « saint come et maruejols »
  function normalize(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/\p{M}/gu, "")           // retire les accents
      .replace(/[^a-z0-9]+/g, " ").trim()
      .replace(/\bst\b/g, "saint").replace(/\bste\b/g, "sainte");   // « st gilles » → « saint gilles »
  }

  var communeInput = $("#commune-input"), zoneResult = $("#zone-result");
  if (communeInput && zoneResult) {
    var communesNorm = communes.map(function (c) { return { raw: c, norm: normalize(c) }; });
    var autoFilled = "";   // ce que le vérificateur a lui-même écrit dans le formulaire

    communeInput.addEventListener("input", function () {
      var q = normalize(communeInput.value);
      $$(".commune", cloud).forEach(function (el) { el.classList.remove("hit"); });

      if (q.length < 2) { zoneResult.textContent = ""; zoneResult.className = "zone-result"; return; }

      var matches = communesNorm.filter(function (c) { return c.norm.indexOf(q) === 0; });
      if (!matches.length) matches = communesNorm.filter(function (c) { return c.norm.indexOf(q) !== -1; });

      if (matches.length) {
        var names = matches.slice(0, 4).map(function (m) { return m.raw; });
        zoneResult.innerHTML = "Oui, j'interviens à <strong>" + names.join("</strong>, <strong>") + "</strong>" +
          (matches.length > names.length ? " (et " + (matches.length - names.length) + " autres)" : "") +
          ". Déplacement compris dans le devis.";
        zoneResult.className = "zone-result ok";
        matches.forEach(function (m) {
          var el = cloud && cloud.querySelector('[data-commune="' + m.raw + '"]');
          if (el) el.classList.add("hit");
        });
        // La commune trouvée est reprise dans le formulaire de devis — on ne
        // remplace que le vide ou notre propre suggestion, jamais une saisie du visiteur.
        var fc = $("#f-commune");
        if (fc && (!fc.value || fc.value === autoFilled)) {
          fc.value = matches[0].raw;
          autoFilled = matches[0].raw;
        }
      } else {
        zoneResult.innerHTML = "Cette commune n'est pas dans ma liste habituelle — " +
          "<strong>appelez quand même</strong>, je me déplace au-delà selon le chantier.";
        zoneResult.className = "zone-result no";
      }
    });
  }

  /* =========================================================
     11. FORMULAIRE DE DEVIS (démo — à brancher, voir README)
     ========================================================= */
  var form = $("#quote-form"), status = $("#form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Merci de compléter les champs obligatoires (nom, téléphone, projet et consentement).";
        status.className = "form-status err";
        form.reportValidity();
        return;
      }
      // DÉMO : aucun envoi réel. Branchez ici un service first-party
      // (Formspree, votre API, un webhook e-mail) — voir README.md.
      status.textContent = "Merci ! Votre demande est bien enregistrée. Je vous rappelle sous 24 h ouvrées pour convenir d'une visite.";
      status.className = "form-status ok";
      form.reset();
      status.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
  }
})();
