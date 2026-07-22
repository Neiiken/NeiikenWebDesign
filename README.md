# Aymeric Cambier — Site commercial

Site de présentation pour vendre la prestation de création de sites internet
à des entreprises locales qui n'en ont pas encore. Il présente le problème,
la solution, la méthode, les secteurs ciblés, un exemple concret (le template
`vitrine/`) et un formulaire de contact. Palette minimaliste noir / gris /
blanc. Pas de page tarifs — le prix se discute au devis.

Ce dossier est la **racine du site déployé** (page d'accueil).

## Structure du dépôt

```
index.html        page d'accueil (ce site)
css/style.css      styles — bloc BRAND en haut pour les couleurs
js/config.js       ← TES INFOS : nom, email, téléphone, secteurs, liens
js/script.js       binding, rendu des secteurs, thème, interactions

vitrine/           démo client (template site vitrine local business)
portfolio/         ancien portfolio personnel, conservé en sous-dossier
serve.ps1          petit serveur statique pour l'aperçu local
```

Le dossier `vitrine/` sert de **démonstration** : le bouton « Voir un exemple »
l'ouvre. Garde-le au même niveau que ce fichier.

## Personnaliser (l'essentiel dans `js/config.js`)

- `brand` : ton nom affiché (ou un nom de studio).
- `email`, `phone`, `phoneDisplay` : laisse `phone` vide pour masquer le bloc appel.
- `sectors` : la liste des secteurs ciblés (emoji + libellé) affichée en bandeau.
- `calendlyUrl`, `githubUrl`, `linkedinUrl`, `demoUrl` : tes liens.
- Couleurs : bloc `BRAND` dans `css/style.css` (4 nuances : `--brand`, `--brand-2`, `--brand-3`, `--brand-4`).

## Aperçu local

Depuis la racine du dépôt :

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

puis ouvre http://localhost:8080

## Publier sur GitHub Pages (gratuit)

1. Crée un dépôt vide sur GitHub (public).
2. Depuis ce dossier :
   ```bash
   git remote add origin https://github.com/<ton-utilisateur>/<ton-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source** → branche `main`, dossier `/ (root)`.
4. Le site est en ligne à `https://<ton-utilisateur>.github.io/<ton-repo>/`
   (ou directement à `https://<ton-utilisateur>.github.io/` si le dépôt s'appelle `<ton-utilisateur>.github.io`).

## À faire avant la mise en production

- Brancher le **formulaire** sur un service first-party (Formspree, une API, un
  webhook e-mail) — il est en démo pour l'instant.
- Remplacer l'aperçu de démo par une **capture réelle** de tes plus beaux sites.
- Ajouter tes **mentions légales** et, si tracking, une bannière de consentement RGPD.
