# Portfolio

Site vitrine statique (HTML/CSS/JS), pensé pour être hébergé gratuitement via GitHub Pages.

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

1. Créez un dépôt sur GitHub (public), par exemple `portfolio`.
2. Poussez ce dossier dessus :
   ```bash
   git remote add origin https://github.com/<votre-utilisateur>/<votre-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. Dans le dépôt GitHub : **Settings → Pages → Source** → choisissez la branche `main` et le dossier `/ (root)`.
4. Le site sera disponible à `https://<votre-utilisateur>.github.io/<votre-repo>/`.
