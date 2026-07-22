/* =============================================================
   HERO FUSION — logo crocodile extrudé en 3D + lumière au curseur
   Optimisé : rect mis en cache, suivi actif seulement quand le
   hero est visible, écritures groupées dans un requestAnimationFrame.
   ============================================================= */
(function () {
  var hero = document.querySelector(".hero--fusion");
  if (!hero) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var logo = document.getElementById("heroLogo3d");

  /* --- Construit l'extrusion : N copies du crocodile empilées en profondeur --- */
  if (logo) {
    var lerp = function (a, b, t) { return Math.round(a + (b - a) * t); };
    // interpole de l'acier clair (avant) vers un gris très sombre (arrière)
    var shade = function (t) {
      return "rgb(" + lerp(0xC3, 0x0d, t) + "," + lerp(0xCD, 0x11, t) + "," + lerp(0xD9, 0x16, t) + ")";
    };
    var N = 16, depth = 2.1, parts = [];
    for (var i = N - 1; i >= 0; i--) {          // couches arrière d'abord
      var t = i / (N - 1);
      var col = shade(t);
      var extra = (i === 0)
        ? "filter:drop-shadow(1px 0 0 rgba(198,96,60,.9)) drop-shadow(0 2px 5px rgba(0,0,0,.6));"
        : "";
      parts.push('<div class="hly" style="transform:translateZ(' + (-i * depth) + 'px);color:' + col + ';' + extra + '">'
        + '<svg viewBox="0 0 200 60"><use href="#croc"/></svg></div>');
    }
    logo.innerHTML = parts.join("");
  }

  /* --- État + rect mis en cache (recalculé seulement au resize/scroll) --- */
  var rect = null, active = true, raf = 0;
  var mx = 60, my = 40, tx = 0, ty = 0;
  function measure() { rect = hero.getBoundingClientRect(); }
  measure();
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("scroll", measure, { passive: true });

  // Ne suit le pointeur que lorsque le hero est à l'écran
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      active = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(hero);
  }

  function apply() {
    hero.style.setProperty("--mx", mx.toFixed(1) + "%");
    hero.style.setProperty("--my", my.toFixed(1) + "%");
    if (logo && !reduce) {
      logo.style.setProperty("--tx", tx.toFixed(2) + "deg");
      logo.style.setProperty("--ty", ty.toFixed(2) + "deg");
    }
    raf = 0;
  }

  window.addEventListener("pointermove", function (e) {
    if (!active || !rect) return;
    if (e.clientY < rect.top || e.clientY > rect.bottom) return;   // seulement au-dessus du hero
    mx = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
    my = Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100));
    tx = (mx - 50) / 50 * 12;      // inclinaison douce -12°..12°
    ty = -(my - 50) / 50 * 9;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  apply();
})();
