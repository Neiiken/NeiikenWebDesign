/* =============================================================
   HERO FUSION — logo crocodile extrudé en 3D + lumière au curseur
   ============================================================= */
(function () {
  var hero = document.querySelector(".hero--fusion");
  if (!hero) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var logo = document.getElementById("heroLogo3d");

  // --- Construit l'extrusion : N copies du crocodile empilées en profondeur ---
  if (logo) {
    var lerp = function (a, b, t) { return Math.round(a + (b - a) * t); };
    // interpole de l'acier clair (avant) vers un gris très sombre (arrière)
    var shade = function (t) {
      return "rgb(" + lerp(0xC3, 0x0d, t) + "," + lerp(0xCD, 0x11, t) + "," + lerp(0xD9, 0x16, t) + ")";
    };
    var N = 16, depth = 2.1, html = "";
    for (var i = N - 1; i >= 0; i--) {          // couches arrière d'abord
      var t = i / (N - 1);
      var z = -i * depth;
      var col = shade(t);
      // la face avant capte une arête terracotta + une ombre portée
      var extra = (i === 0)
        ? "filter:drop-shadow(1px 0 0 rgba(198,96,60,.9)) drop-shadow(0 2px 5px rgba(0,0,0,.6));"
        : "";
      html += '<div class="hly" style="transform:translateZ(' + z + 'px);color:' + col + ';' + extra + '">'
            + '<svg viewBox="0 0 200 60"><use href="#croc"/></svg></div>';
    }
    logo.innerHTML = html;
  }

  // --- Lumière du curseur + inclinaison 3D du logo ---
  var mx = 60, my = 40, tx = 0, ty = 0, raf = 0;
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
    var r = hero.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return;   // seulement au-dessus du hero
    var x = e.clientX - r.left, y = e.clientY - r.top;
    mx = Math.max(0, Math.min(100, x / r.width * 100));
    my = Math.max(0, Math.min(100, y / r.height * 100));
    tx = (mx - 50) / 50 * 12;      // inclinaison douce -12°..12°
    ty = -(my - 50) / 50 * 9;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  apply();
})();
