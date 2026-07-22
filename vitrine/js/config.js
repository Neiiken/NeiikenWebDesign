/* =============================================================
   CONFIG — Source unique de personnalisation par entreprise.
   Dupliquez le dossier, changez CE fichier (+ les couleurs dans
   css/style.css section BRAND, + les images du dossier /images),
   et le site est prêt pour un nouveau client.
   ============================================================= */
window.SITE_CONFIG = {
  // Identité
  name: "Martin Plomberie",
  legalName: "Martin Plomberie SARL",
  tagline: "Votre plombier de confiance à Lyon, 7j/7 en cas d'urgence.",
  sector: "Plombier",              // ex. Restaurant, Coiffeur, Kinésithérapeute…
  city: "Lyon",
  yearsInBusiness: 15,

  // Contact / conversion
  phone: "+33478000000",            // format international, sans espaces (href tel:)
  phoneDisplay: "04 78 00 00 00",   // format lisible affiché
  email: "contact@martin-plomberie.fr",
  address: "12 rue de la République, 69002 Lyon",
  // Requête utilisée pour l'itinéraire + la carte (nom + adresse)
  mapsQuery: "Martin Plomberie, 12 rue de la République, 69002 Lyon",
  serviceArea: "Lyon et 20 km alentour",
  emergency: "Dépannage d'urgence 24h/24 · 7j/7",

  // Horaires (affichage + Schema.org)
  hours: [
    { days: "Lun – Ven", time: "8h00 – 19h00", schema: "Mo-Fr 08:00-19:00" },
    { days: "Samedi",    time: "9h00 – 17h00", schema: "Sa 09:00-17:00" },
    { days: "Dimanche",  time: "Urgences uniquement", schema: null },
  ],

  // Preuve sociale (à recopier depuis la fiche Google Business)
  rating: 4.9,
  reviewsCount: 127,

  // Liens externes
  googleBusinessUrl: "https://www.google.com/maps",   // remplacer par l'URL de la fiche
  social: {
    facebook: "",
    instagram: "",
  },

  // Divers
  priceRange: "€€",
};
