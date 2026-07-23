/* =============================================================
   CONFIG — Données « machine » du site (source unique).

   Répartition volontaire :
   · js/config.js  → identité, contact, horaires, nuancier, communes,
                     mentions légales. Tout ce qui est réutilisé par le
                     JSON-LD, les liens tel:/mailto: et les widgets.
   · index.html    → textes éditoriaux (services, méthode, avis, FAQ).
                     Ils restent dans le HTML pour le référencement et
                     pour rester lisibles sans JavaScript.

   ⚠️ Les valeurs « À REMPLIR » sont des espaces réservés. Elles doivent
   être remplacées par les vraies informations avant la mise en ligne
   (mentions légales obligatoires, SIRET, assurance décennale, note
   Google réelle…). Voir README.md, section « Avant la mise en ligne ».
   ============================================================= */
window.SITE_CONFIG = {
  /* ---------- Identité ---------- */
  name: "Sébastien Christol",
  legalName: "Sébastien Christol — Entreprise individuelle", // À REMPLIR (dénomination exacte)
  sector: "Peintre en bâtiment",
  baseline: "Artisan peintre",
  tagline: "25 ans de métier. Peinture intérieure et extérieure, enduits, façades et décoration — à Nîmes et dans tout le Gard.",
  city: "Nîmes",
  department: "Gard (30)",
  // Année de début de métier. SOURCE UNIQUE des « X ans d'expérience » :
  // le hero, le bandeau, le chiffre clé et le JSON-LD en découlent tous,
  // et le compte reste juste sans rien retoucher les années suivantes.
  foundedYear: 2001,

  /* ---------- Contact / conversion ---------- */
  phone: "+33466000000",            // À REMPLIR — format international (href tel:)
  phoneDisplay: "04 66 00 00 00",   // À REMPLIR — format lisible
  mobile: "+33600000000",           // À REMPLIR — laisser "" pour masquer la ligne
  mobileDisplay: "06 00 00 00 00",  // À REMPLIR
  email: "contact@sebastien-christol.fr",          // À REMPLIR
  address: "Nîmes",                                // À REMPLIR — adresse du siège
  postalCode: "30000",                             // À REMPLIR
  mapsQuery: "Sébastien Christol peintre, Nîmes",  // requête itinéraire + carte
  serviceArea: "Nîmes et 40 km alentour",
  responseTime: "Réponse sous 24 h ouvrées",

  /* ---------- Horaires (affichage + Schema.org) ---------- */
  hours: [
    { days: "Lun – Ven", time: "7h30 – 18h00", schema: "Mo-Fr 07:30-18:00" },
    { days: "Samedi",    time: "8h00 – 12h00", schema: "Sa 08:00-12:00" },
    { days: "Dimanche",  time: "Fermé",        schema: null },
  ],

  /* ---------- Preuve sociale ----------
     ⚠️ À recopier depuis la vraie fiche Google Business. Publier une note
     inventée en données structurées est contraire aux règles de Google et
     peut coûter l'affichage des étoiles. Mettre `rating: null` tant que
     les vraies valeurs ne sont pas connues : le bloc disparaît alors. */
  rating: null,
  reviewsCount: null,
  googleBusinessUrl: "",   // URL de la fiche Google Business (vide = masqué)

  /* ---------- Nuancier interactif ----------
     Chaque famille devient un onglet. `hex` pilote la pièce de démonstration
     et, si l'option est activée, l'habillage du site. */
  palette: [
    {
      family: "Blancs & neutres",
      colors: [
        { name: "Blanc chaux",      code: "SC-01", hex: "#F3EFE7" },
        { name: "Lin naturel",      code: "SC-02", hex: "#E7DFD1" },
        { name: "Gris perle",       code: "SC-03", hex: "#D5D3CD" },
        { name: "Ficelle",          code: "SC-04", hex: "#CFC2AC" },
        { name: "Galet",            code: "SC-05", hex: "#A9A69D" },
        { name: "Gris mastic",      code: "SC-06", hex: "#7C7A73" },
      ],
    },
    {
      family: "Terres & ocres",
      colors: [
        { name: "Sable des arènes", code: "SC-10", hex: "#E4C79B" },
        { name: "Ocre de Nîmes",    code: "SC-11", hex: "#D98A34" },
        { name: "Terre de Sienne",  code: "SC-12", hex: "#B4653A" },
        { name: "Terracotta",       code: "SC-13", hex: "#A8503C" },
        { name: "Brique ancienne",  code: "SC-14", hex: "#8C3D30" },
        { name: "Cannelle",         code: "SC-15", hex: "#6E4B33" },
      ],
    },
    {
      family: "Verts & bleus",
      colors: [
        { name: "Vert garrigue",    code: "SC-20", hex: "#8E9B7C" },
        { name: "Olivier",          code: "SC-21", hex: "#6B7A5A" },
        { name: "Vert romarin",     code: "SC-22", hex: "#4A5B4C" },
        { name: "Bleu Camargue",    code: "SC-23", hex: "#9FBCC9" },
        { name: "Bleu lavande",     code: "SC-24", hex: "#7E8CAE" },
        { name: "Bleu profond",     code: "SC-25", hex: "#14304A" },
      ],
    },
    {
      family: "Teintes profondes",
      colors: [
        { name: "Vieux rose",       code: "SC-30", hex: "#C29089" },
        { name: "Prune",            code: "SC-31", hex: "#6B4256" },
        { name: "Vert empire",      code: "SC-32", hex: "#2F4A40" },
        { name: "Bleu nuit",        code: "SC-33", hex: "#22304A" },
        { name: "Anthracite",       code: "SC-34", hex: "#33332F" },
        { name: "Noir de fumée",    code: "SC-35", hex: "#1C1C1A" },
      ],
    },
  ],

  /* Teintes appliquées au chargement de la pièce de démonstration */
  paletteDefaults: {
    murs:      "#E4C79B",
    plafond:   "#F3EFE7",
    boiseries: "#14304A",
  },

  /* ---------- Zone d'intervention (vérificateur de commune) ---------- */
  communes: [
    "Nîmes", "Caissargues", "Bouillargues", "Rodilhan", "Marguerittes", "Redessan",
    "Manduel", "Garons", "Saint-Gilles", "Bellegarde", "Beaucaire", "Milhaud",
    "Bernis", "Uchaud", "Vestric-et-Candiac", "Générac", "Beauvoisin", "Vauvert",
    "Aimargues", "Le Cailar", "Aigues-Mortes", "Codognan", "Vergèze", "Calvisson",
    "Nages-et-Solorgues", "Langlade", "Saint-Dionisy", "Clarensac", "Caveirac",
    "Saint-Côme-et-Maruéjols", "La Calmette", "Dions", "Sainte-Anastasie",
    "Poulx", "Lédenon", "Sernhac", "Meynes", "Remoulins", "Castillon-du-Gard",
    "Uzès", "Saint-Quentin-la-Poterie", "Blauzac", "Collias", "Sanilhac-Sagriès",
    "Sommières", "Aubais", "Junas", "Congénies", "Villevieille", "Boissières",
    "Alès", "Saint-Christol-lès-Alès", "Anduze", "Lédignan", "Quissac",
    "Le Grau-du-Roi", "Bagnols-sur-Cèze", "Villeneuve-lès-Avignon",
  ],

  /* ---------- Mentions légales ---------- */
  legal: {
    updatedAt: "2026-07-23",   // date affichée en tête des mentions légales
    legalForm: "Entreprise individuelle",                       // À REMPLIR
    siret: "À REMPLIR — n° SIRET (14 chiffres)",
    rm: "À REMPLIR — n° au Répertoire des Métiers, CMA du Gard",
    vatNumber: "À REMPLIR — n° TVA intracommunautaire, ou mention « TVA non applicable, art. 293 B du CGI »",
    capital: "",                                                 // si société : capital social
    director: "Sébastien Christol",
    insurer: "À REMPLIR — nom et adresse de l'assureur",
    insurancePolicy: "À REMPLIR — n° de contrat décennale",
    insuranceArea: "France métropolitaine",
    host: "GitHub, Inc. — 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis", // À ADAPTER
    hostUrl: "https://github.com",
    mediator: "À REMPLIR — nom du médiateur de la consommation",
    mediatorUrl: "",
  },
};
