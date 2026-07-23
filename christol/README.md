# Sébastien Christol — Artisan peintre à Nîmes

Site vitrine **one-page** pour un peintre en bâtiment intervenant à Nîmes et dans le Gard.
Direction artistique **« Nuancier & matière »** : la peinture est traitée comme la matière
première du site — grain de plâtre, ruban de masquage, coulure, éventail de nuancier, et
un **nuancier interactif** qui repeint une pièce de démonstration en direct.

## La pièce maîtresse : le nuancier interactif

Section `#nuancier`. Le visiteur choisit une **zone** (murs, plafond, boiseries) puis une
**teinte** parmi 24 réparties en 4 familles. La pièce de démonstration (SVG en perspective)
se repeint instantanément, et — si l'option est cochée — **tout le site s'habille** de la
teinte retenue : boutons, icônes, chiffres clés, soulignés.

Deux détails qui font la différence commerciale :

- **« Joindre au devis »** recopie les trois teintes dans le formulaire de contact et y
  amène le visiteur. La demande arrive déjà qualifiée.
- **« Copier les références »** met les noms et codes dans le presse-papiers.

La teinte du site n'est jamais appliquée telle quelle : `deriveAccent()` (dans `js/script.js`)
la décline en une version dont le contraste reste **≥ 4,5:1** sur le fond du thème courant,
et `inkOn()` choisit l'encre claire ou foncée en comparant les deux rapports WCAG. Les
24 teintes ont été vérifiées dans les deux thèmes.

## Ce qui est inclus

- **10 fiches de services** dépliables couvrant tout le métier : intérieur, façades et
  ravalement, enduits, revêtements muraux, décoratif, boiseries, traitement, sols souples,
  rénovation locative, copropriétés et professionnels.
- **Nuancier interactif** (ci-dessus), **vérificateur de commune** (58 communes, tolérant
  aux accents, aux tirets et aux « st / ste »), **compteurs animés**, accordéons de services
  et de FAQ, bandeau défilant, révélation au scroll.
- **Dark mode** automatique (préférence système) + bascule manuelle mémorisée.
- **Données structurées** `HousePainter` + `FAQPage`, la FAQ étant lue depuis le DOM :
  une seule source de vérité, les questions restent dans le HTML.
- **Click-to-call** partout + bouton d'appel flottant sur mobile.
- **Mentions légales complètes** : éditeur, hébergeur, assurance décennale, médiation de la
  consommation, RGPD, cookies, propriété intellectuelle, et une clause sur le caractère
  indicatif du rendu des couleurs du nuancier.
- Zéro requête externe (polices auto-hébergées), accessibilité : lien d'évitement, focus
  visibles, `aria-pressed` sur tous les sélecteurs, `prefers-reduced-motion` respecté.

## Structure

```
index.html            page principale — TEXTES ÉDITORIAUX (services, méthode, avis, FAQ)
mentions-legales.html mentions légales & confidentialité
css/style.css         styles — bloc BRAND en haut pour les couleurs
css/fonts.css         @font-face des polices auto-hébergées
js/config.js          ← DONNÉES CLIENT : identité, contact, horaires, nuancier, communes, légal
js/script.js          liaison des données, JSON-LD, nuancier, thème, interactions
assets/fonts/         Inter + Space Grotesk (sous-ensemble latin)
images/               vos photos de chantier (vide pour l'instant)
serve.ps1             serveur local (port 8091)
```

**Répartition volontaire** : `js/config.js` porte tout ce qui est réutilisé par la machine
(liens `tel:`, JSON-LD, widgets). Les textes éditoriaux restent dans `index.html` pour le
référencement et pour rester lisibles sans JavaScript.

## Aperçu local

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

puis ouvrez http://localhost:8091

## Avant la mise en ligne — obligatoire

Le site n'est **pas publiable en l'état**. Les valeurs marquées `À REMPLIR` dans
`js/config.js` sont des espaces réservés ; tant qu'il en reste une, un encadré d'alerte
s'affiche en haut des mentions légales (il disparaît tout seul une fois tout renseigné).

1. **Coordonnées** — `phone`, `phoneDisplay`, `mobile`, `email`, `address`, `postalCode`.
   Le numéro actuel (`04 66 00 00 00`) est fictif.
2. **Mentions légales** (`legal`) — SIRET, n° au Répertoire des Métiers de la CMA du Gard,
   TVA, **assureur et n° de contrat décennale** (mention obligatoire pour un artisan du
   bâtiment, art. L. 111-4 du code de la consommation), **médiateur de la consommation**
   (obligatoire, art. L. 612-1), et l'hébergeur réel si ce n'est pas GitHub Pages.
3. **Note Google** — `rating` et `reviewsCount` sont à `null` : le bloc étoiles reste masqué
   et la note n'apparaît pas dans le JSON-LD. Ne les remplissez qu'avec les **vraies valeurs**
   de la fiche Google Business : publier une note inventée en données structurées est
   contraire aux règles de Google et peut coûter l'affichage des étoiles.
4. **Avis clients** — les quatre avis de `index.html` sont des exemples réalistes. Remplacez-les
   par de vrais avis (avec l'accord des clients) ou supprimez la section.
5. **Réalisations** — les six tuiles sont des aplats de démonstration. Remplacez-les par de
   vraies photos : ce sont elles qui déclenchent les appels.
   ```html
   <article class="work"><img src="images/facade-caissargues.webp" width="800" height="1000"
     loading="lazy" alt="Façade ravalée à Caissargues" class="ph"> …
   ```
   Format WebP/AVIF avec `width`/`height` explicites pour éviter tout décalage visuel (CLS).
6. **Formulaire** — il est en démo, il n'envoie rien. Branchez-le sur un service first-party
   (Formspree, une API, un webhook e-mail) dans `js/script.js`, section 11.
7. **Chiffres clés** — `data-count` dans `index.html` (1200 chantiers, 40 km…) : à ajuster.
   Les **années de métier** font exception : elles découlent de `foundedYear` dans
   `js/config.js` (2001 → 25 ans) via `data-count-since`, et le hero, le bandeau, le chiffre
   clé et le `foundingDate` du JSON-LD s'alignent dessus. Seuls les `<meta description>`
   et `og:*` portent « 25 ans » en dur : à reprendre si l'année de départ change.
8. **URL canonique** — `<link rel="canonical">` et `og:*` dans les deux pages HTML.

## Personnaliser pour un autre client

1. `js/config.js` — identité, contact, horaires, communes.
2. `css/style.css`, bloc `BRAND` — `--brand`, `--brand-2`, `--brand-3`, `--brand-4` reskinent
   tout le site.
3. `js/config.js`, `palette` — le nuancier accepte n'importe quelles familles et teintes ;
   `paletteDefaults` fixe les couleurs affichées au chargement.
4. `index.html` — textes éditoriaux, `<title>` et `<meta name="description">`.

## Notes performance & RGPD

- Aucune requête vers un service tiers : les polices sont servies depuis `assets/fonts/`.
  Rien à déclarer côté cookies tant qu'aucun outil de mesure d'audience n'est ajouté.
- Le seul stockage local est la préférence de thème (`localStorage`), qui ne quitte pas
  l'appareil et ne permet aucune identification.
- Toutes les animations sont en CSS et coupées par `prefers-reduced-motion`.
- Si vous ajoutez un outil de mesure d'audience, il faudra une bannière de consentement
  conforme CNIL **avant** tout dépôt de cookie non essentiel.
