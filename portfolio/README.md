# Portfolio (ancien)

Site vitrine statique (HTML/CSS/JS). Conservé ici en sous-dossier — le site
déployé à la racine du dépôt est désormais `agence` (voir le README à la
racine). Pour remettre ce portfolio en ligne à la place, il faudrait le
déplacer à la racine du dépôt ou le déployer depuis un dépôt séparé.

## Structure

```
index.html      page principale
css/style.css   styles (thème clair/sombre automatique)
js/script.js    menu mobile + année du footer
```

## Aperçu local

Un petit serveur statique est fourni (`serve.ps1`, PowerShell) :

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

puis ouvrez http://localhost:8080

## Personnaliser

- Éditez le texte dans `index.html` (nom, accroche, à propos, projets, compétences, liens de contact).
- Ajoutez vos images dans `images/` et référencez-les dans `index.html`.

## Publier sur GitHub Pages

Voir le README à la racine du dépôt — c'est `agence/` (déplacé à la racine)
qui est déployé par défaut. Ce dossier `portfolio/` n'est pas servi tel quel
par GitHub Pages tant qu'il reste en sous-dossier.
