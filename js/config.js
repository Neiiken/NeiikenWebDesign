/* =============================================================
   CONFIG — Toutes tes infos au même endroit.
   Modifie ce fichier pour mettre à jour le site (coordonnées,
   secteurs, liens). Les couleurs sont dans css/style.css (bloc BRAND).
   ============================================================= */
window.SITE_CONFIG = {
  // Identité
  firstName: "Aymeric",
  lastName: "Cambier",
  brand: "Aymeric Cambier",                 // nom affiché (mets un nom de studio si tu veux)
  role: "Créateur de sites internet",
  baseline: "Je crée le site qui manque à votre entreprise.",
  city: "France",                           // ta zone (ex. « Lyon et alentours »)

  // Contact / conversion
  email: "aymeric.cambier@gmail.com",
  phone: "",                                // format international ex. +33612345678 (laisse vide si non souhaité)
  phoneDisplay: "",                         // ex. 06 12 34 56 78
  calendlyUrl: "",                          // lien de prise de RDV (Calendly…) — optionnel

  // Démo / réalisations
  demoUrl: "vitrine/index.html",            // le template vitrine sert d'exemple live

  // Secteurs ciblés (affichés en bandeau)
  sectors: [
    { icon: "🔧", label: "Artisans & BTP" },
    { icon: "🍽️", label: "Restaurants & cafés" },
    { icon: "💆", label: "Santé & bien-être" },
    { icon: "🛍️", label: "Commerces de proximité" },
    { icon: "✂️", label: "Beauté & coiffure" },
    { icon: "⚖️", label: "Professions libérales" },
  ],

  // Liens
  githubUrl: "https://github.com/",
  linkedinUrl: "https://www.linkedin.com/",
};
