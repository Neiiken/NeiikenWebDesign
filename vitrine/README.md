# Vitrine locale — Template 2026

Site vitrine **one-page** pour entreprises locales référencées sur Google (fiche
Google Business) mais sans site web. Conçu pour convertir une visite « près de moi »
en appel, itinéraire ou demande de devis — et pour être **dupliqué en quelques minutes**
d'un client à l'autre.

## Ce qui est inclus

- **Bento grid « en un coup d'œil »** (note Google, services, chiffre clé, zone, horaires, urgence).
- **Palette expressive** (violet / corail / menthe) pilotée par variables CSS.
- **Dark mode** automatique (préférence système) + bascule manuelle mémorisée.
- **Click-to-call** partout + **bouton d'appel flottant** sur mobile.
- **Itinéraire Google Maps** + carte chargée au clic (0 requête au chargement).
- **Données structurées Schema.org `LocalBusiness`** générées automatiquement (SEO local).
- **Avis clients**, galerie, formulaire de contact avec confirmation visuelle.
- Animations **CSS uniquement** (bon pour l'INP / Lighthouse), respect de `prefers-reduced-motion`.
- Accessibilité : lien d'évitement, focus visibles, contrastes AA, navigation clavier.

## Structure

```
index.html         page (contenu éditorial, bon pour le SEO)
css/style.css       styles — bloc BRAND en haut pour les couleurs
js/config.js        ← SOURCE UNIQUE de personnalisation (données client)
js/script.js        binding, JSON-LD, horaires, thème, interactions
serve.ps1           petit serveur local (port 8090)
```

## Personnaliser pour un nouveau client (3 étapes)

1. **`js/config.js`** — nom, téléphone, adresse, horaires, note Google, liens, etc.
   Tout le texte machine (tel:, itinéraire, JSON-LD, badge ouvert/fermé) en découle.
2. **`css/style.css`, bloc `BRAND`** — changez `--brand`, `--brand-2`, `--brand-3`
   pour reskiner tout le site.
3. **`index.html`** — ajustez les textes éditoriaux (à propos, services, avis) et
   remplacez les balises `<title>` / `<meta name="description">`.

> Les blocs galerie (`.ph`) sont des dégradés de démonstration. Remplacez-les par de
> vraies photos : `<img src="images/chantier.webp" width="800" height="1000" loading="lazy" alt="…">`
> (format WebP/AVIF + `width`/`height` explicites pour éviter tout décalage visuel / CLS).

## Aperçu local

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

puis ouvrez http://localhost:8090

## Notes performance & RGPD

- Le rendu ne dépend d'aucun JS lourd ; la carte Google ne se charge qu'au clic.
- Le formulaire est une démo sans backend : branchez-le sur un service first-party
  (Formspree, votre API…) et n'ajoutez de tracking qu'avec un consentement clair.
- Pour la production : compressez les images, servez en HTTP/2, activez la mise en cache.
