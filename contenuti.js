/* =====================================================================
   CONTENUTI DEL SITO — questo è l'unico file da modificare.

   Regole semplici:
   - Le foto stanno in  docs/<cartella>/<cartella>01.jpg, 02.jpg, 03.jpg ...
     (numerate a due cifre, senza buchi). Es.: docs/tttred/tttred01.jpg
   - Per aggiungere foto a un progetto: carica i file con i numeri successivi
     e aggiorna il numero in "foto".
   - Per aggiungere un progetto: copia un blocco { ... } dentro PROGETTI,
     cambia i valori, e carica la cartella di foto.
   - I testi hanno due versioni: it (italiano) ed en (inglese).
     Se scrivi solo una stringa, es. software: "AutoCAD", vale per entrambe.
   - Attenzione alle virgole tra un blocco e l'altro e alle virgolette.
   ===================================================================== */

const SITO = {
  // Dove stanno le foto (cartella del repository).
  // Deve restare "docs/".
  cartellaImmagini: "docs/",

  nome: "Giovanni Terranova",
  marchio: "IngDeNova",
  qualifica: {
    it: "Laureato magistrale in Ingegneria Edile-Architettura\nGeometra abilitato, iscritto all'Albo",
    en: "MSc in Building Engineering and Architecture\nLicensed surveyor (Geometra), registered member"
  },
  sede: {
    it: "Studio Tecnico Terranova\nPaternò (CT)",
    en: "Studio Tecnico Terranova\nPaternò, Sicily"
  },

  // Testo di presentazione in home
  presentazione: {
    it: "Laureato magistrale in Ingegneria Edile-Architettura all'Università di Catania e geometra abilitato, iscritto all'Albo. Dal 2012 lavoro tra studio tecnico, cantiere e ricerca: direzione lavori e riqualificazione energetica nell'ambito del Superbonus 110%, sicurezza cantieri, pratiche edilizie e catastali, e la progettazione e realizzazione del telaio in alluminio di un veicolo solare per la Bridgestone World Solar Challenge 2025. Da novembre 2025 sono titolare dello Studio Tecnico Terranova a Paternò (CT).",
    en: "MSc in Building Engineering and Architecture from the University of Catania and licensed surveyor (Geometra), registered member of the professional board. Since 2012 I have worked across technical practice, construction sites and research: works supervision and energy retrofits under Italy's Superbonus 110% scheme, site safety, building and cadastral permits, and the design and hands-on welding of the aluminium chassis of a solar car for the Bridgestone World Solar Challenge 2025. Since November 2025 I run Studio Tecnico Terranova in Paternò, Sicily."
  },

  contatti: {
    email: "giovanni.terranova.94@gmail.com",
    telefono: "+39 347 1853113",
    indirizzo: {
      it: "Studio Tecnico Terranova\nVia Alcide De Gasperi, 8\n95047 Paternò (CT), Italia",
      en: "Studio Tecnico Terranova\nVia Alcide De Gasperi, 8\n95047 Paternò (CT), Italy"
    },
    linkedin: "https://www.linkedin.com/in/giovanni-terranova",
    // Se vuoi pubblicare un CV in PDF, caricalo nella cartella "nuovo/" e scrivi qui il nome del file.
    cvPdf: ""
  }
};

/* ---------------------------------------------------------------------
   SEZIONI — le grandi tessere in home. L'ordine qui è l'ordine in pagina.
   "copertina" è una foto: "cartella/nomefile.jpg". Se manca, la tessera è gialla.
   "titoloBreve" è l'etichetta corta nel menu (facoltativa).
   "anteprime: "intere"" mostra le immagini intere nelle anteprime (per le tavole);
   senza questa riga le anteprime sono ritagliate a riempire il riquadro (per le foto).
   --------------------------------------------------------------------- */
const SEZIONI = [
  {
    id: "in-campo",
    titolo: { it: "In campo", en: "On site" },
    sottotitolo: {
      it: "Cantieri di riqualificazione energetica, fotovoltaico, centrali termiche e logistica.",
      en: "Energy retrofit sites, photovoltaics, heating plants and site logistics."
    },
    copertina: "tttpvo/tttpvo05.jpg"
  },
  {
    id: "solar",
    titolo: { it: "World Solar Challenge", en: "World Solar Challenge" },
    titoloBreve: { it: "Solar", en: "Solar" },     // etichetta corta per il menu
    sottotitolo: {
      it: "Telaio in alluminio e integrazione dei modelli AI di un veicolo solare, 2024–2025.",
      en: "Aluminium chassis and AI-model integration for a solar car, 2024–2025."
    },
    copertina: ""   // ← metti qui una foto del veicolo appena la carichi, es. "solar/solar01.jpg"
  },
  {
    id: "universita",
    titolo: { it: "Progetti universitari", en: "University projects" },
    titoloBreve: { it: "Università", en: "University" },
    anteprime: "intere",   // le anteprime mostrano la tavola intera (togli questa riga per ritagliarle come le foto)
    sottotitolo: {
      it: "Tavole di progettazione, rilievo, strutture, restauro e urbanistica.",
      en: "Design boards: architecture, survey, structures, restoration and planning."
    },
    copertina: "comarcl/comarcl04.jpg"
  }
];

/* ---------------------------------------------------------------------
   PROGETTI — ogni blocco è un progetto. Campi:
     sezione     → uno degli id qui sopra
     cartella    → nome della cartella delle foto dentro docs/
     foto        → quante foto ci sono (0 se ancora nessuna)
     copertina   → numero della foto da usare come copertina
     periodo     → testo libero (opzionale)
     titolo, descrizione → it / en
     software, colleghi  → opzionali
     link        → opzionali: [{ testo: {it, en}, url }]
   --------------------------------------------------------------------- */
const PROGETTI = [

  /* ===== IN CAMPO ===== */
  {
    sezione: "in-campo",
    cartella: "tttred",
    foto: 18,
    copertina: 4,
    periodo: "2022 – 2024",
    titolo: { it: "Riqualificazioni energetiche", en: "Energy retrofits" },
    descrizione: {
      it: "Riqualificazione energetica di edifici condominiali con posa di cappotto termico su tamponature verticali e orizzontali, nell'ambito del Superbonus 110%. Project management, controllo dei requisiti di progetto, computi metrici e SAL, verifica delle prescrizioni di sicurezza e dei cronoprogrammi. Oltre 30 edifici seguiti per Tecnovalore, Trieste.",
      en: "Energy retrofit of apartment buildings with external thermal insulation on walls and roofs under the Superbonus 110% scheme. Project management, design-requirement checks, bills of quantities and progress statements, safety and schedule compliance. Over 30 buildings for Tecnovalore, Trieste."
    },
    software: "Primus, AutoCAD"
  },
  {
    sezione: "in-campo",
    cartella: "tttpvo",
    foto: 16,
    copertina: 5,
    periodo: "2022 – 2024",
    titolo: { it: "Impianti fotovoltaici condominiali", en: "Rooftop photovoltaic systems" },
    descrizione: {
      it: "Direzione lavori per l'installazione di impianti fotovoltaici condominiali fino a 20 kWp su coperture piane e a falda, Trieste.",
      en: "Works supervision for the installation of shared rooftop photovoltaic systems up to 20 kWp on flat and pitched roofs, Trieste."
    }
  },
  {
    sezione: "in-campo",
    cartella: "tttcte",
    foto: 47,
    copertina: 9,
    periodo: "2022 – 2024",
    titolo: { it: "Centrali termiche e impianti", en: "Heating plants and building services" },
    descrizione: {
      it: "Assistenza al rilievo e alla manutenzione di centrali termiche condominiali, impianti elettrici e idraulici; sostituzione di unità in copertura.",
      en: "Survey and maintenance support for shared heating plants, electrical and plumbing systems; replacement of rooftop units."
    }
  },
  {
    sezione: "in-campo",
    cartella: "tttlog",
    foto: 21,
    copertina: 10,
    periodo: "2023 – 2024",
    titolo: { it: "Logistica di cantiere", en: "Site logistics" },
    descrizione: {
      it: "Coordinamento di approvvigionamento e installazione su una decina di impianti fotovoltaici residenziali-condominiali gestiti in parallelo, da oltre 6 kWp ciascuno; sollevamenti con autogrù, gestione e contabilità di magazzino. Vulpes Impianti, Trieste.",
      en: "Procurement and installation coordination across about ten residential and multi-family photovoltaic systems run in parallel, each above 6 kWp; crane lifts, warehouse management and stock accounting. Vulpes Impianti, Trieste."
    }
  },

  /* ===== WORLD SOLAR CHALLENGE ===== */
  {
    sezione: "solar",
    cartella: "solar",      // ← crea la cartella docs/solar/ e carica solar01.jpg, solar02.jpg ...
    foto: 0,
    copertina: 1,
    periodo: "2024 – 2025",
    titolo: { it: "Telaio del veicolo solare", en: "Solar car chassis" },
    descrizione: {
      it: "Program & Operation Manager in Archimede Srl, startup di Siracusa, per il veicolo a energia solare della Bridgestone World Solar Challenge 2025 (Australia). Progettazione e modellazione 3D dei telai strutturali, calcoli preliminari su acciaio e compositi, realizzazione diretta del telaio in alluminio con saldatura TIG, elaborati esecutivi, gestione forniture e coordinamento del team tecnico.",
      en: "Program & Operation Manager at Archimede Srl, a Syracuse-based startup, for the solar-powered car entered in the Bridgestone World Solar Challenge 2025 (Australia). 3D design of the structural chassis, preliminary calculations on steel and composites, hands-on TIG welding of the aluminium frame, shop drawings, procurement and technical team coordination."
    },
    software: "Fusion 360, Inventor, Rhinoceros",
    link: [
      { testo: { it: "Telaio TPM (modello 3D)", en: "TPM chassis (3D model)" }, url: "https://a360.co/47MoO6e" },
      { testo: { it: "Telaio SGN (modello 3D)", en: "SGN chassis (3D model)" }, url: "https://a360.co/3ZKJ6e9" },
      { testo: { it: "Telaio QDR (modello 3D)", en: "QDR chassis (3D model)" }, url: "https://a360.co/4gHLite" },
      { testo: { it: "Telaio PWTR (modello 3D)", en: "PWTR chassis (3D model)" }, url: "https://a360.co/4eksnml" },
      { testo: { it: "Telaio SPN (modello 3D)", en: "SPN chassis (3D model)" }, url: "https://a360.co/3N6LcO9" },
      { testo: { it: "Archimede Srl", en: "Archimede Srl" }, url: "https://archimede.world/" },
      { testo: { it: "Bridgestone World Solar Challenge", en: "Bridgestone World Solar Challenge" }, url: "https://worldsolarchallenge.org/" }
    ]
  },
  {
    sezione: "solar",
    cartella: "perceive",   // ← cartella facoltativa per eventuali foto/schemi
    foto: 0,
    copertina: 1,
    periodo: "2025",
    titolo: { it: "Modelli AI per il monitoraggio energetico", en: "AI models for energy monitoring" },
    descrizione: {
      it: "Collaboratore tecnico esterno del PeRCeiVe Lab dell'Università di Catania nel progetto PNRR FAIR (Spoke 10), in collaborazione con Archimede Srl: integrazione dei modelli AI nei sistemi di monitoraggio e controllo del veicolo solare, validazione fisico-ingegneristica delle previsioni tramite bilanci energetici, progettazione CAD delle interfacce di sensori e attuatori. Attività conclusa con relazione tecnica validata dal responsabile scientifico.",
      en: "External technical collaborator at the PeRCeiVe Lab, University of Catania, within the PNRR FAIR project (Spoke 10), together with Archimede Srl: integration of AI models into the solar car's monitoring and control systems, physics-based validation of predictions through energy balances, CAD design of sensor and actuator interfaces. Completed with a technical report approved by the scientific lead."
    }
  },

  /* ===== PROGETTI UNIVERSITARI ===== */
  {
    sezione: "universita",
    cartella: "comarcl",
    foto: 14,
    copertina: 4,
    titolo: { it: "Visitor center a Santa Venera al Pozzo", en: "Visitor centre at Santa Venera al Pozzo" },
    descrizione: {
      it: "Progetto architettonico di un visitor center nell'area archeologica di Santa Venera al Pozzo, Aci Catena (CT).",
      en: "Architectural design of a visitor centre in the archaeological area of Santa Venera al Pozzo, Aci Catena, Sicily."
    },
    software: "AutoCAD, Lumion",
    colleghi: "Rosario D'Amore, Danilo Parlascino"
  },
  {
    sezione: "universita",
    cartella: "comarcll",
    foto: 17,
    copertina: 8,
    titolo: { it: "Athens Hidden Garden", en: "Athens Hidden Garden" },
    descrizione: {
      it: "Bottega artigianale con spazio espositivo, shop e area giochi, inserita in un progetto più ampio che coinvolge la piazza e la mobilità dell'area.",
      en: "Artisan workshop with exhibition space, shop and play area, part of a wider scheme for the square and the mobility of the surrounding district."
    },
    software: "Rhinoceros, Photoshop",
    colleghi: "Andrea Longhitano, Rosario Tosto, Luca Ciccia, Francesco Sciacca"
  },
  {
    sezione: "universita",
    cartella: "arctecll",
    foto: 46,
    copertina: 15,
    titolo: { it: "Edificio a carattere misto", en: "Mixed-use building" },
    descrizione: {
      it: "Progetto architettonico ed esecutivo di un edificio residenziale e commerciale con struttura in calcestruzzo armato, acciaio e XLam: piante, sezioni, prospetti e dettagli costruttivi.",
      en: "Architectural and construction design of a residential and commercial building with reinforced concrete, steel and CLT structure: plans, sections, elevations and construction details."
    },
    software: "Revit, AutoCAD",
    colleghi: "Andrea Longhitano, Francesco Lomeo"
  },
  {
    sezione: "universita",
    cartella: "disarcll",
    foto: 10,
    copertina: 8,
    titolo: { it: "Rilievo della Chiesa di Santa Venera", en: "Survey of the Church of Santa Venera" },
    descrizione: {
      it: "Rilievo integrato della Chiesa di Santa Venera ad Acireale (CT) con laser scanner, stazione totale e triangolazioni con distanziometro; restituzione grafica da nuvola di punti.",
      en: "Integrated survey of the Church of Santa Venera in Acireale, Sicily, using laser scanner, total station and distance-meter triangulation; drawings produced from the point cloud."
    },
    software: "AutoCAD",
    colleghi: "Cosimo D'Alessanro, Alberto Roccasalva, Giulia Finocchiaro, Antonio Finocchiaro"
  },
  {
    sezione: "universita",
    cartella: "resarc",
    foto: 29,
    copertina: 11,
    titolo: { it: "Restauro delle cortine edilizie di Valverde", en: "Restoration of the street fronts of Valverde" },
    descrizione: {
      it: "Progetto di restauro architettonico delle cortine edilizie del centro storico di Valverde (CT): analisi del tessuto, rilievo dei prospetti, mappatura del degrado e interventi.",
      en: "Architectural restoration of the historic street fronts of Valverde, Sicily: urban fabric analysis, elevation survey, decay mapping and interventions."
    },
    software: "AutoCAD",
    colleghi: "Giovanni Gibilisco, Francesco Lomeo, Ester Schillaci"
  },
  {
    sezione: "universita",
    cartella: "reccon",
    foto: 13,
    copertina: 7,
    titolo: { it: "Recupero di un edificio INA-Casa", en: "Refurbishment of an INA-Casa building" },
    descrizione: {
      it: "Progetto di recupero di un edificio di edilizia residenziale pubblica (casa per profughi) a Nesima, Catania.",
      en: "Refurbishment scheme for a public housing block (former refugee housing) in Nesima, Catania."
    },
    software: "AutoCAD",
    colleghi: "Giovanni Gibilisco, Francesco Lomeo, Ester Schillaci"
  },
  {
    sezione: "universita",
    cartella: "tecurb",
    foto: 19,
    copertina: 5,
    titolo: { it: "Rigenerazione urbana di San Cristoforo", en: "Urban regeneration of San Cristoforo" },
    descrizione: {
      it: "Strategia di rigenerazione urbana del quartiere San Cristoforo a Catania: analisi cartografica e sociale del quartiere e interventi puntuali.",
      en: "Urban regeneration strategy for the San Cristoforo district in Catania: mapping and social analysis of the neighbourhood, followed by targeted interventions."
    },
    software: "QGIS, AutoCAD, Photoshop, SketchUp",
    colleghi: "Luigi Leanza, Francesco Lomeo"
  },
  {
    sezione: "universita",
    cartella: "piaterurb",
    foto: 7,
    copertina: 1,
    titolo: { it: "Pianificazione urbanistica di Cibali", en: "Urban planning for Cibali" },
    descrizione: {
      it: "Pianificazione di un ambito del quartiere Cibali a Catania: assetti insediativi e mobilità.",
      en: "Planning of a sector of the Cibali district in Catania: settlement layout and mobility."
    },
    software: "QGIS",
    colleghi: "Francesco Lomeo, Giorgio La Rosa, Vincenzo Corsaro"
  },
  {
    sezione: "universita",
    cartella: "comarcpar",
    foto: 5,
    copertina: 3,
    titolo: { it: "Parco urbano Gioeni", en: "Gioeni urban park" },
    descrizione: {
      it: "Potenziamento dei servizi del Parco Gioeni a Catania e connessione con l'asse viario prospiciente.",
      en: "Upgrade of the facilities of Gioeni Park in Catania and connection with the adjacent road axis."
    },
    software: "SketchUp, AutoCAD, Photoshop",
    // C'era anche una sesta collega indicata solo come "Isabella": completa il nome se vuoi
    colleghi: "Isabella Pistorio, Ester Schillaci, Antonella Marchese, Liliana Teobaldi, Federica Rizzo"
  },
  {
    sezione: "universita",
    cartella: "disautrildig",
    foto: 15,
    copertina: 1,
    titolo: { it: "Disegno e rilievo digitale", en: "Digital drawing and survey" },
    descrizione: {
      it: "Esercitazioni di modellazione 3D, fotogrammetria, nuvole di punti e modellazione parametrica.",
      en: "Exercises in 3D modelling, photogrammetry, point clouds and parametric modelling."
    },
    software: "Rhinoceros, Grasshopper, CloudCompare, Revit, Photoscan, Eyecad",
    colleghi: "Giovanni Marco Salemi"
  },
  {
    sezione: "universita",
    cartella: "teccosacc",
    foto: 2,
    copertina: 2,
    titolo: { it: "Capriata in acciaio", en: "Steel roof truss" },
    descrizione: {
      it: "Progetto e disegni esecutivi di una capriata in acciaio.",
      en: "Design and shop drawings of a steel roof truss."
    },
    software: "Tel2008 (Prof. Aurelio Ghersi), AutoCAD",
    colleghi: "Francesco Lomeo"
  },
  {
    sezione: "universita",
    cartella: "teccoscls",
    foto: 4,
    copertina: 3,
    titolo: { it: "Elementi in calcestruzzo armato", en: "Reinforced concrete elements" },
    descrizione: {
      it: "Progetto di elementi strutturali in calcestruzzo armato, disegni esecutivi delle armature.",
      en: "Design of reinforced concrete structural elements, with reinforcement shop drawings."
    },
    software: "AutoCAD",
    colleghi: "Francesco Lomeo"
  },
  {
    sezione: "universita",
    cartella: "comarclll",
    foto: 2,
    copertina: 2,
    titolo: { it: "Esercitazioni di composizione", en: "Composition exercises" },
    descrizione: {
      it: "Presentazioni di composizione architettonica.",
      en: "Architectural composition presentations."
    },
    software: "SketchUp, Photoshop",
    colleghi: "Isabella Pistorio, Ester Schillaci, Antonella Marchese, Liliana Teobaldi, Federica Rizzo"
  }
];


/* ---------------------------------------------------------------------
   PERCORSO — esperienze di lavoro, dalla più recente alla più vecchia.
   L'ordine qui è l'ordine in pagina.
     periodo   → testo libero
     ruolo, ente, luogo, attivita → it / en
     vedi      → (facoltativo) codice di un progetto: aggiunge "Vedi le foto"
   --------------------------------------------------------------------- */
const ESPERIENZE = [
  {
    periodo: { it: "nov 2025 – oggi", en: "Nov 2025 – present" },
    ruolo: { it: "Titolare", en: "Owner" },
    ente: "Studio Tecnico Geom. Terranova",
    luogo: { it: "Paternò (CT)", en: "Paternò, Sicily" },
    attivita: {
      it: [
        "Pratiche edilizie (CILA, SCIA e affini) e rapporti diretti con gli enti competenti",
        "Atti catastali tramite DOCFA, incluse pratiche di introduzione in mappa",
        "Rilievi topografici per committenza privata",
        "Consulenza tecnica su degradi edilizi e tecniche di risanamento",
        "Progettazione architettonica ed esecutiva, redazione elaborati grafici",
        "Computi metrici estimativi, contabilità lavori, assistenza tecnica in cantiere"
      ],
      en: [
        "Building permits (CILA, SCIA and similar) and direct dealings with local authorities",
        "Cadastral filings through DOCFA, including new-building map entries",
        "Land surveys for private clients",
        "Technical advice on building decay and remediation techniques",
        "Architectural and construction design, drawing production",
        "Bills of quantities, works accounting, on-site technical assistance"
      ]
    }
  },
  {
    periodo: { it: "apr 2024 – ott 2025", en: "Apr 2024 – Oct 2025" },
    ruolo: { it: "Program & Operation Manager", en: "Program & Operation Manager" },
    ente: "Archimede Srl",
    luogo: { it: "Siracusa", en: "Syracuse, Sicily" },
    attivita: {
      it: [
        "Pianificazione operativa e coordinamento del progetto, dalla definizione dei requisiti alla verifica dell'esecuzione",
        "Progettazione e modellazione 3D dei telai strutturali del veicolo solare",
        "Calcoli preliminari e dimensionamento di elementi in acciaio e materiali compositi",
        "Realizzazione diretta del telaio in alluminio tramite saldatura TIG",
        "Gestione forniture, rapporti con fornitori e coordinamento del team tecnico"
      ],
      en: [
        "Operational planning and project coordination, from requirements to execution checks",
        "3D design and modelling of the solar car's structural chassis",
        "Preliminary calculations and sizing of steel and composite elements",
        "Hands-on construction of the aluminium chassis by TIG welding",
        "Procurement, supplier relations and technical team coordination"
      ]
    },
    vedi: "solar"
  },
  {
    periodo: { it: "ago – set 2025", en: "Aug – Sep 2025" },
    ruolo: { it: "Collaboratore tecnico esterno", en: "External technical collaborator" },
    ente: { it: "PeRCeiVe Lab — Università degli Studi di Catania", en: "PeRCeiVe Lab — University of Catania" },
    luogo: { it: "Catania · progetto PNRR FAIR, Spoke 10", en: "Catania · PNRR FAIR project, Spoke 10" },
    attivita: {
      it: [
        "Supporto al deploy e all'integrazione dei modelli AI nei sistemi di monitoraggio e controllo del veicolo solare",
        "Validazione fisico-ingegneristica delle previsioni AI tramite bilanci energetici",
        "Progettazione CAD delle interfacce fisiche di sensori e attuatori",
        "Attività conclusa nei tempi previsti, con relazione tecnica validata dal responsabile scientifico"
      ],
      en: [
        "Support for deploying and integrating AI models into the solar car's monitoring and control systems",
        "Physics-based validation of AI predictions against conventional energy balances",
        "CAD design of the physical interfaces for sensors and actuators",
        "Completed on schedule, with a technical report approved by the scientific lead"
      ]
    },
    vedi: "perceive"
  },
  {
    periodo: { it: "ott – dic 2024", en: "Oct – Dec 2024" },
    ruolo: { it: "Disegnatore BIM", en: "BIM draftsman" },
    ente: "GLE Ingegneria Srl",
    luogo: { it: "Catania · cantiere Silicon Carbide Campus STMicroelectronics", en: "Catania · Silicon Carbide Campus, STMicroelectronics site" },
    attivita: {
      it: [
        "Disegno tecnico BIM (Autodesk Revit) a supporto della progettazione e dell'esecuzione",
        "Impianto per la produzione di semiconduttori al carburo di silicio, nell'ambito dell'EU Chips Act"
      ],
      en: [
        "BIM technical drawing (Autodesk Revit) supporting design and construction",
        "Silicon carbide semiconductor plant, part of the EU Chips Act"
      ]
    }
  },
  {
    periodo: { it: "ago – nov 2024", en: "Aug – Nov 2024" },
    ruolo: { it: "Responsabile sviluppo qualità", en: "Quality development manager" },
    ente: "Designare Srl",
    luogo: { it: "Catania", en: "Catania" },
    attivita: {
      it: [
        "Studi di fattibilità, analisi finanziarie e costi-benefici, valutazioni preliminari",
        "Elaborati tecnici dettagliati e specifiche progettuali",
        "Coordinamento degli stakeholder e raccolta dei feedback per l'allineamento degli obiettivi",
        "Supervisione dell'implementazione e conformità ai piani; interfaccia con fornitori e appaltatori",
        "Attività di audit interno e gestione di controversie e contestazioni sui lavori"
      ],
      en: [
        "Feasibility studies, financial and cost-benefit analyses, preliminary assessments",
        "Detailed technical documents and design specifications",
        "Stakeholder coordination and feedback gathering to align objectives",
        "Oversight of implementation and plan compliance; interface with suppliers and contractors",
        "Internal audits and handling of disputes and claims over the works"
      ]
    }
  },
  {
    periodo: { it: "giu – lug 2024", en: "Jun – Jul 2024" },
    ruolo: { it: "Addetto al Servizio di Prevenzione e Protezione (ASPP)", en: "Health and safety officer (ASPP)" },
    ente: "GDS Ingegneria",
    luogo: { it: "Catania · cantiere Silicon Carbide Campus STMicroelectronics", en: "Catania · Silicon Carbide Campus, STMicroelectronics site" },
    attivita: {
      it: [
        "Supervisione e verifica in campo dell'applicazione delle prescrizioni di sicurezza (D.Lgs. 81/2008)",
        "Controllo del rispetto di procedure e misure di prevenzione da parte delle imprese esecutrici",
        "Segnalazione delle non conformità e verifica delle azioni correttive",
        "Cantiere industriale di grande scala"
      ],
      en: [
        "On-site supervision and verification of safety requirements (Italian Legislative Decree 81/2008)",
        "Checks on contractors' compliance with procedures and preventive measures",
        "Reporting of non-conformities and follow-up on corrective actions",
        "Large-scale industrial construction site"
      ]
    }
  },
  {
    periodo: { it: "apr 2023 – mag 2024", en: "Apr 2023 – May 2024" },
    ruolo: { it: "Specialista sul campo", en: "Field specialist" },
    ente: "Vulpes Impianti Srl",
    luogo: { it: "Trieste", en: "Trieste" },
    attivita: {
      it: [
        "Tecnico di cantiere su commesse fotovoltaiche: avanzamento lavori e supervisione delle squadre",
        "Coordinamento di approvvigionamento e installazione su una decina di impianti residenziali-condominiali in parallelo, da oltre 6 kWp ciascuno",
        "Gestione e contabilità di magazzino",
        "Rilievi in campo e redazione di elaborati grafici"
      ],
      en: [
        "Site engineer on photovoltaic contracts: progress monitoring and crew supervision",
        "Procurement and installation coordination across about ten residential and multi-family systems in parallel, each above 6 kWp",
        "Warehouse management and stock accounting",
        "Field surveys and drawing production"
      ]
    },
    vedi: "tttlog"
  },
  {
    periodo: { it: "gen 2022 – mag 2024", en: "Jan 2022 – May 2024" },
    ruolo: { it: "Consulente tecnico", en: "Technical consultant" },
    ente: "Tecnovalore Srl",
    luogo: { it: "Trieste · general contractor Superbonus 110%", en: "Trieste · Superbonus 110% general contractor" },
    attivita: {
      it: [
        "Project management: coordinamento del cantiere, controllo dei requisiti e revisione dei progetti architettonici",
        "Riqualificazione energetica di oltre 30 edifici condominiali con cappotto termico",
        "Direzione lavori per impianti fotovoltaici condominiali fino a 20 kWp",
        "Assistenza al rilievo e alla manutenzione di centrali termiche, impianti elettrici e idraulici",
        "Computi metrici estimativi e SAL; controllo qualità degli approvvigionamenti",
        "Verifica delle prescrizioni di sicurezza e del rispetto dei cronoprogrammi"
      ],
      en: [
        "Project management: site coordination, requirement checks and architectural design review",
        "Energy retrofit of over 30 apartment buildings with external thermal insulation",
        "Works supervision for shared photovoltaic systems up to 20 kWp",
        "Survey and maintenance support for heating plants, electrical and plumbing systems",
        "Bills of quantities and progress statements; procurement quality control",
        "Safety and schedule compliance checks"
      ]
    },
    vedi: "tttred"
  },
  {
    periodo: "2021",
    ruolo: { it: "Direttore di cantiere", en: "Site manager" },
    ente: "G2D Sas di Pollero Davide & C.",
    luogo: { it: "Albenga (SV)", en: "Albenga, Liguria" },
    attivita: {
      it: [
        "Progettazione e supervisione di opere di efficientamento energetico e ristrutturazione su villette uni/bifamiliari",
        "Coordinamento delle imprese esecutrici e controllo dell'avanzamento rispetto al cronoprogramma",
        "Computi metrici estimativi e SAL",
        "Gestione forniture e conferimenti in discarica",
        "Controllo delle prescrizioni di sicurezza in cantiere",
        "Rilievi, restituzione grafica e relazioni tecniche"
      ],
      en: [
        "Design and construction supervision of energy-efficiency and renovation works on single and two-family houses",
        "Coordination of contractors and progress monitoring against the schedule",
        "Bills of quantities and progress statements",
        "Supply management and waste disposal",
        "Site safety compliance checks",
        "Surveys, drawings and technical reports"
      ]
    }
  },
  {
    periodo: "2021",
    ruolo: { it: "Geometra", en: "Surveyor (Geometra)" },
    ente: "Studio Tecnico Geom. Gualdi",
    luogo: { it: "Imperia", en: "Imperia, Liguria" },
    attivita: {
      it: [
        "Redazione e revisione di progetti architettonici ed esecutivi per interventi di ristrutturazione edilizia",
        "Incarico parallelo a quello in G2D Sas, in stretta collaborazione sullo stesso territorio"
      ],
      en: [
        "Preparation and review of architectural and construction designs for renovation works",
        "Held alongside the G2D Sas role, working closely on the same territory"
      ]
    }
  },
  {
    periodo: { it: "2012 – 2015 · 2016 – 2018", en: "2012 – 2015 · 2016 – 2018" },
    ruolo: { it: "Praticante e poi collaboratore geometra", en: "Trainee, then collaborating surveyor" },
    ente: "Studio Tecnico Geom. Terranova",
    luogo: { it: "Paternò (CT) · studio di famiglia", en: "Paternò, Sicily · family practice" },
    attivita: {
      it: [
        "Circa cinque anni di formazione sul campo: praticantato propedeutico all'Esame di Stato (2015) e successiva collaborazione con responsabilità crescenti",
        "Rilievi topografici e architettonici sul campo",
        "Restituzione grafica dei rilievi su CAD",
        "Redazione di elaborati progettuali",
        "Predisposizione di pratiche edilizie e catastali"
      ],
      en: [
        "About five years of hands-on training: traineeship leading to the 2015 state examination, then a collaboration with growing responsibility",
        "Land and building surveys in the field",
        "CAD drawing of survey data",
        "Preparation of design documents",
        "Preparation of building and cadastral filings"
      ]
    }
  }

  /* Stage in agenzia immobiliare a Riga (2026): per ora non pubblicato.
     Se vuoi aggiungerlo, usa sempre la forma generica, senza nome dell'azienda e senza mesi:
  ,{
    periodo: "2026",
    ruolo: { it: "Stage", en: "Internship" },
    ente: { it: "Agenzia immobiliare", en: "Real estate agency" },
    luogo: { it: "Riga (Lettonia)", en: "Riga, Latvia" },
    attivita: {
      it: ["Follow-up di interventi di manutenzione su immobili in vendita, in un contesto di lavoro internazionale"],
      en: ["Follow-up of maintenance works on properties for sale, in an international working environment"]
    }
  }
  */
];

/* ---------------------------------------------------------------------
   FORMAZIONE, ABILITAZIONI E LINGUE — mostrate in fondo alla pagina Percorso.
   --------------------------------------------------------------------- */
const FORMAZIONE = [
  {
    periodo: { it: "2012 – 2024", en: "2012 – 2024" },
    titolo: { it: "Laurea magistrale a ciclo unico in Ingegneria Edile-Architettura (LM-4)", en: "MSc in Building Engineering and Architecture (LM-4, single-cycle)" },
    ente: { it: "Università degli Studi di Catania", en: "University of Catania" },
    nota: {
      it: "Tesi: «Progettazione di un bivacco» — rifugio d'alta quota sull'Etna ottenuto dal riuso di un container marittimo, con approccio di economia circolare, studio dei vincoli paesaggistici, computo metrico e pianificazione del cantiere. Percorso condotto in parallelo ad attività lavorative continue.",
      en: "Thesis: “Design of a mountain bivouac” — a high-altitude shelter on Mount Etna built by reusing a shipping container, with a circular-economy approach, landscape-constraint analysis, bill of quantities and construction planning. Studied alongside continuous professional work."
    }
  },
  {
    periodo: "2015",
    titolo: { it: "Abilitazione all'esercizio della libera professione di Geometra", en: "Professional licence as Geometra (surveyor)" },
    ente: { it: "Esame di Stato · iscrizione all'Albo dei Geometri", en: "State examination · registered with the professional board" }
  },
  {
    periodo: "2024",
    titolo: { it: "Formazione in Sicurezza dei Cantieri — Allegato XIV D.Lgs. 81/2008", en: "Construction site safety training — Annex XIV, Legislative Decree 81/2008" },
    ente: { it: "Università degli Studi di Catania, certificazione di Ateneo", en: "University of Catania, official certificate" }
  },
  {
    periodo: "2012",
    titolo: { it: "Diploma di Istituto Tecnico per Geometri", en: "Technical diploma in surveying" },
    ente: { it: "I.I.S.S. «Giovanni Falcone»", en: "I.I.S.S. “Giovanni Falcone”" }
  }
];

const LINGUE = [
  { lingua: { it: "Italiano", en: "Italian" }, livello: { it: "madrelingua", en: "native" } },
  { lingua: { it: "Inglese", en: "English" }, livello: { it: "B2", en: "B2" } },
  { lingua: { it: "Tedesco", en: "German" }, livello: { it: "base (A2)", en: "basic (A2)" } },
  { lingua: { it: "Russo", en: "Russian" }, livello: { it: "base (A1)", en: "basic (A1)" } }
];

/* ---------------------------------------------------------------------
   REFERENZE — aziende con cui ho collaborato, con contatto LinkedIn del responsabile.
   --------------------------------------------------------------------- */
const REFERENZE = [
  {
    nome: "Archimede Srl",
    cosa: { it: "Startup tecnologica · Siracusa", en: "Tech startup · Syracuse, Sicily" },
    responsabile: "https://www.linkedin.com/in/riccardo-puglisi-lt/",
    azienda: "https://www.linkedin.com/company/archimede-world/"
  },
  {
    nome: "Designare Srl",
    cosa: { it: "Studio d'ingegneria · Catania", en: "Engineering firm · Catania" },
    responsabile: "https://www.linkedin.com/in/salvatorealessandroindovino/",
    azienda: "https://www.linkedin.com/company/designaresrl/"
  },
  {
    nome: "Tecnovalore Srl",
    cosa: { it: "General contractor Superbonus 110% · Trieste", en: "General contractor, Superbonus 110% · Trieste" },
    responsabile: "https://www.linkedin.com/in/davide-gualdi-232ab945/",
    azienda: "https://www.linkedin.com/company/tecnovalore/"
  },
  {
    nome: "Vulpes Impianti Srl",
    cosa: { it: "Installazione impianti fotovoltaici · Trieste", en: "Photovoltaic installer · Trieste" },
    responsabile: "https://www.linkedin.com/in/roberto-ughetti-a3909a272/"
  },
  {
    nome: "Studio Gualdi",
    cosa: { it: "Studio tecnico · Imperia", en: "Technical practice · Imperia" },
    responsabile: "https://www.linkedin.com/in/daniele-gualdi-0a412092/"
  },
  {
    nome: "G2D Sas di Davide Pollero",
    cosa: { it: "Impresa edile · Albenga", en: "Building contractor · Albenga" },
    responsabile: "https://www.linkedin.com/in/daniele-gualdi-0a412092/"
  }
];
