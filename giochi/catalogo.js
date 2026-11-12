"use strict";
/* =====================================================================
   CATALOGO DEI 100 GIOCHI
   Per cambiare testi, parole o difficoltà modifica i parametri qui sotto.
   ===================================================================== */
const NATO = ["ALFA", "BRAVO", "CHARLIE", "DELTA", "ECHO"];
const GIOCHI = [];
function add(tipo, cat, nome, varianti) { varianti.forEach((p, i) => GIOCHI.push({ id: GIOCHI.length + 1, tipo, cat, nome: nome + " " + NATO[i], p })); }

/* Struttura file system per i terminali */
const D = c => ({ d: 1, c }), F = t => ({ t }), X = (t, pw) => ({ t, enc: 1, pw });

/* ======================= CRITTOGRAFIA ======================= */
add("cesare", "Crittografia", "INTERCETTAZIONE", [
  { shift: 5, frase: "IL SERVER CADE ALL ALBA", chiave: "VULCANO" },
  { shift: 11, frase: "ATTACCO PREVISTO PER MEZZANOTTE", chiave: "TEMPESTA" },
  { shift: 17, frase: "LA SPIA E NEL PALAZZO", chiave: "SCORPIONE" },
  { shift: 23, frase: "LE TELECAMERE SONO SPENTE", chiave: "MERIDIANA" }
]);
add("atbash", "Crittografia", "SPECCHIO OSCURO", [
  { frase: "IL VIRUS E PRONTO", chiave: "GHIACCIO" },
  { frase: "IL PACCO E AL MOLO SETTE", chiave: "LABIRINTO" },
  { frase: "CAMBIO FREQUENZA STASERA", chiave: "ORIZZONTE" }
]);
add("vigenere", "Crittografia", "CHIAVE DOPPIA", [
  { key: "FALCO", chiave: "COMETA" },
  { key: "ORSO", chiave: "ARGENTO" },
  { key: "LINCE", chiave: "FENICE" }
]);
add("binario", "Crittografia", "FLUSSO BINARIO", [{ chiave: "TUONO" }, { chiave: "PRISMA" }, { chiave: "GRANITO" }]);
add("hex", "Crittografia", "DUMP DI MEMORIA", [{ chiave: "ZAFFIRO" }, { chiave: "ECLISSI" }]);
add("morseScritto", "Crittografia", "TRASCRIZIONE RADIO", [{ chiave: "ALLARME ROSSO" }, { chiave: "BASE SEGRETA" }]);
add("t9", "Crittografia", "SMS FANTASMA", [{ chiave: "SATELLITE" }, { chiave: "PANTERA" }, { chiave: "BUSSOLA" }]);
add("specchio", "Crittografia", "RIFLESSO", [
  { modo: "specchio", frase: "INCONTRO ALLA STAZIONE NORD", chiave: "MIRAGGIO" },
  { modo: "parole", frase: "DISTRUGGERE TUTTI I DOCUMENTI", chiave: "SCINTILLA" }
]);
add("rail", "Crittografia", "BINARI", [
  { n: 2, frase: "IL DRONE PARTE ALLE SEI", chiave: "TORNADO" },
  { n: 3, frase: "ABBIAMO LE CHIAVI DEL SATELLITE", chiave: "VORTICE" }
]);
add("anagramma", "Crittografia", "PASSWORD MESCOLATA", [
  { chiave: "CIFRATURA", def: "trasformare un messaggio per renderlo illeggibile a chi non ha la chiave" },
  { chiave: "INTRUSIONE", def: "accesso non autorizzato a un sistema informatico" },
  { chiave: "PROTOCOLLO", def: "insieme di regole con cui due computer si parlano" },
  { chiave: "CREDENZIALI", def: "nome utente e password che servono per entrare" }
]);
add("a1z26", "Crittografia", "NUMERI MUTI", [{ chiave: "ORACOLO" }, { chiave: "SENTINELLA" }]);
add("polibio", "Crittografia", "SCACCHIERA", [{ chiave: "CRISTALLO" }, { chiave: "VALANGA" }]);
add("coordinate", "Crittografia", "GRIGLIA", [{ chiave: "MAGNETE" }, { chiave: "CORSARO" }, { chiave: "DIAMANTE" }]);
add("pigpen", "Crittografia", "SIMBOLI ANTICHI", [{ chiave: "ARCIERE" }, { chiave: "CONDOR" }]);
add("morse", "Crittografia", "ECO", [
  { chiave: "RADAR", unita: 230 }, { chiave: "BUNKER", unita: 220 }, { chiave: "SONAR", unita: 200 }, { chiave: "PLASMA", unita: 210 }
]);

/* ======================= HACKING ======================= */
add("terminale", "Hacking", "INFILTRAZIONE", [
  { codice: "NX4821", obiettivo: "Trovate l'archivio segreto dell'amministratore e decifratelo.", aiuto: "La password dell'admin è il nome del suo gatto: cercate nella cartella <b>/home/admin</b>. La cronologia dei comandi (.bash_history) dice dove si trova l'archivio.",
    fs: () => D({
      home: D({ operatore: D({ "leggimi.txt": F("I file riservati sono custoditi dall'amministratore.\nLa sua cartella e' /home/admin\nAttenzione: alcuni file sono nascosti (ls -a)."), "spesa.txt": F("- caffe'\n- crocchette per il gatto dell'admin") }),
        admin: D({ "note.txt": F("La mia password e' SEMPRE il nome del mio gatto.\nNon ricordo dove metto l'archivio... per fortuna la shell ha la cronologia."), ".bash_history": F("ls\ncat foto/gatto.jpg\ncd /srv/.segreti\ndecrypt archivio.enc ********"),
          foto: D({ "gatto.jpg": F("[IMMAGINE]\n  /\\_/\\\n ( o.o )\n  > ^ <\nDidascalia: \"Il mio gatto RUGGINE che dorme sul server <3\""), "vacanze.jpg": F("[IMMAGINE] Didascalia: \"Sardegna 2025. Niente wifi.\"") }) }) }),
      srv: D({ pubblico: D({ "index.html": F("<h1>NEMESIS - in manutenzione</h1>") }), ".segreti": D({ "archivio.enc": X("=== ARCHIVIO NEMESIS ===\nCODICE DI SBLOCCO: NX4821\nOra digita: submit NX4821", "RUGGINE") }) }),
      tmp: D({})
    }) },
  { codice: "ZT9035", obiettivo: "Un agente nemico ha nascosto un backup sul server. Scoprite chi è e trovate il codice.", aiuto: "Leggete il registro <b>/var/log/accessi.log</b>: chi si è collegato in piena notte? Poi andate nella sua cartella in /home e cercate i file nascosti.",
    fs: () => D({
      home: D({ operatore: D({ "leggimi.txt": F("Stanotte qualcuno ha copiato un backup segreto nella SUA cartella personale.\nI registri di sistema sono in /var/log") }),
        mbianchi: D({ "todo.txt": F("- consegnare report\n- ferie ad agosto") }), kvolkov: D({ "lista.txt": F("niente di interessante qui..."), ".backup": D({ "codice.txt": F("BACKUP NEMESIS - CODICE: ZT9035\nOra digita: submit ZT9035") }) }),
        lverdi: D({ ".cache": D({ "tmp.txt": F("file temporaneo vuoto") }) }) }),
      var: D({ log: D({ "accessi.log": F("09:02 login mbianchi\n09:15 login lverdi\n12:40 logout mbianchi\n18:05 logout lverdi\n03:12 login kvolkov   <-- fuori orario\n03:47 logout kvolkov"), "errori.log": F("nessun errore critico") }) }),
      etc: D({ passwd: F("mbianchi:x:1001\nlverdi:x:1002\nkvolkov:x:1003\noperatore:x:1004") })
    }) },
  { codice: "K7Q2W9", obiettivo: "Il codice è diviso in tre frammenti (ALFA, BETA, GAMMA) nascosti nel server. Uniteli nell'ordine ALFA-BETA-GAMMA.", aiuto: "I frammenti sono in <b>/tmp</b> (file nascosto), in <b>/home/admin/documenti</b> e in <b>/etc</b> (file nascosto e cifrato: la password è nella posta dell'operatore).",
    fs: () => D({
      home: D({ operatore: D({ "leggimi.txt": F("Missione: recuperare i frammenti ALFA, BETA e GAMMA.\nIl codice finale e' ALFA+BETA+GAMMA, senza spazi."), "posta.txt": F("Da: admin\nOggetto: password GAMMA\nLa password del file gamma e' TRIDENTE. Cancella questa mail!") }),
        admin: D({ documenti: D({ "beta.txt": F("frammento BETA: Q2"), "ricette.txt": F("carbonara: niente panna!") }) }) }),
      tmp: D({ ".alfa": F("frammento ALFA: K7"), "cache.dat": F("0000000000") }),
      etc: D({ ".gamma.enc": X("frammento GAMMA: W9", "TRIDENTE"), hosts: F("127.0.0.1 localhost") })
    }) }
]);
add("mastermind", "Hacking", "GRIMALDELLO", [
  { simboli: "0123456789".split(""), len: 4, tent: 8 },
  { simboli: "0123456789".split(""), len: 4, tent: 7 },
  { simboli: "ABCDEFGH".split(""), len: 4, tent: 8 },
  { simboli: "RVBGOP".split(""), colori: ["#ef4444", "#22c55e", "#3b82f6", "#facc15", "#f97316", "#a855f7"], len: 4, tent: 8 },
  { simboli: "RVBGOPC".split(""), colori: ["#ef4444", "#22c55e", "#3b82f6", "#facc15", "#f97316", "#a855f7", "#22d3ee"], len: 4, tent: 9 }
]);
add("logica", "Hacking", "CIRCUITO", [{}, {}, {}]);
add("bindec", "Hacking", "LUCCHETTO BINARIO", [{ n: 3, max: 255 }, { n: 4, max: 127 }]);
add("typing", "Hacking", "TASTIERA ROVENTE", [
  { sec: 14, cmd: ["nmap -sS 10.0.0.1", "ssh root@nemesis.net", "cat /etc/shadow", "rm -rf /tmp/virus", "sudo kill -9 6666"] },
  { sec: 12, cmd: ["ping -c 4 satellite.mil", "chmod 600 chiavi.key", "tar -xzf piano.tgz", "grep -r password /srv", "shutdown -h now"] }
]);

/* ======================= DIFESA ======================= */
add("firewall", "Difesa", "BRECCIA", [{ n: 5 }, { n: 5 }, { n: 6 }]);
add("virus", "Difesa", "ARTIFICIERE", [{ moduli: 3, sec: 180 }, { moduli: 3, sec: 150 }, { moduli: 4, sec: 210 }]);
add("lightsout", "Difesa", "QUARANTENA", [{ n: 4, croce: true, mosse: 5 }, { n: 5, croce: true, mosse: 6 }, { n: 5, croce: false, mosse: 6 }]);
add("whack", "Difesa", "CONTRAEREA", [{ target: 15, sec: 30, vita: 1100 }, { target: 20, sec: 35, vita: 950 }]);
add("campo", "Difesa", "SCANSIONE PORTE", [{ n: 6, mine: 5 }, { n: 7, mine: 7 }]);
add("labirinto", "Difesa", "LABIRINTO DI RETE", [{ n: 8 }, { n: 10 }, { n: 8, nebbia: true }]);
add("pacchetti", "Difesa", "PACCHETTI PERSI", [{ base: 2, chiave: "FIREWALL" }, { base: 16, chiave: "ANTIVIRUS" }, { base: 10, chiave: "CRITTOGRAFIA" }]);

/* ======================= ANALISI ======================= */
add("log", "Analisi", "SEGUGIO", [{ tipo: "brute" }, { tipo: "esfiltra" }, { tipo: "viaggio" }]);
add("phishing", "Analisi", "ESCA", [
  { mail: [
    { ph: 1, da: "assistenza@poste-italiane-verifica.com", ogg: "Il tuo conto è sospeso! Verifica entro 24 ore", det: "Link: http://poste-italiane-verifica.com/login" },
    { da: "noreply@amazon.it", ogg: "Il tuo ordine è stato spedito", det: "Link: https://www.amazon.it/ordini" },
    { ph: 1, da: "it-support@micros0ft.com", ogg: "La tua password scade oggi", det: "Link: http://micros0ft.com/reset" },
    { da: "segreteria@comune.milano.it", ogg: "Avviso: chiusura uffici venerdì", det: "Nessun link, nessun allegato" },
    { ph: 1, da: "corriere@dhl-consegne.info", ogg: "Pacco in giacenza: paga 1,99 € di spedizione", det: "Link: http://dhl-consegne.info/paga" },
    { da: "mario.bianchi@azienda.it", ogg: "Verbale della riunione di lunedì", det: "Allegato: verbale.pdf (collega del tuo ufficio)" }] },
  { mail: [
    { ph: 1, da: "sicurezza@intesasanpaolo.com.accesso-sicuro.net", ogg: "Accesso anomalo rilevato sul tuo conto", det: "Link: https://intesasanpaolo.com.accesso-sicuro.net" },
    { da: "notifiche@linkedin.com", ogg: "Hai 3 nuovi messaggi", det: "Link: https://www.linkedin.com/messaging" },
    { ph: 1, da: "direttore.generale.azienda@gmail.com", ogg: "Urgente e riservato: bonifico a un fornitore", det: "Chiede un bonifico di 18.000 € senza passare dall'amministrazione" },
    { da: "fatture@enel.it", ogg: "La tua bolletta di marzo", det: "Link: https://www.enel.it/area-clienti" },
    { ph: 1, da: "hr@azienda-it.com", ogg: "Aggiornamento stipendi 2027", det: "Allegato: stipendi_2027.xlsx.exe" },
    { da: "it@azienda.it", ogg: "Manutenzione server sabato notte", det: "Nessuna richiesta di password, nessun link" }] },
  { mail: [
    { ph: 1, da: "premi@apple-store-vincite.com", ogg: "Hai vinto un iPhone!", det: "Inserisci i dati della carta per pagare la spedizione" },
    { da: "no-reply@accounts.google.com", ogg: "Nuovo accesso da Chrome su Windows", det: "Link: https://myaccount.google.com" },
    { ph: 1, da: "billing@netfIix-pagamenti.com", ogg: "Pagamento rifiutato: aggiorna la carta", det: "Link: http://netfIix-pagamenti.com/carta" },
    { da: "info@trenitalia.it", ogg: "Il tuo biglietto Milano-Roma", det: "Allegato: biglietto.pdf (hai comprato tu il biglietto)" },
    { ph: 1, da: "agenziaentrate@rimborsi-fiscali.org", ogg: "Hai diritto a un rimborso di 482 €", det: "Link: http://rimborsi-fiscali.org/modulo" },
    { da: "newsletter@ilsole24ore.com", ogg: "Le notizie del giorno", det: "Link: https://www.ilsole24ore.com" }] },
  { mail: [
    { ph: 1, da: "admin@azienda.it.security-check.ru", ogg: "Casella piena: conferma la tua password", det: "Link: http://azienda.it.security-check.ru" },
    { da: "calendar-notification@google.com", ogg: "Invito: riunione progetto alle 15:00", det: "Organizzatore: collega@azienda.it" },
    { ph: 1, da: "spedizioni@brt-consegna.co", ogg: "Impossibile consegnare il tuo pacco", det: "Allegato: etichetta_spedizione.zip" },
    { da: "comunicazioni@inps.it", ogg: "Nuova comunicazione nell'area riservata", det: "Nessun link: accedi dal sito ufficiale" },
    { ph: 1, da: "amministratore.delegato@outlook.com", ogg: "Comprami 5 gift card, è urgente", det: "Mandami i codici delle carte via SMS, sono in riunione" },
    { da: "service@paypal.it", ogg: "Ricevuta del tuo pagamento di 12,50 €", det: "Link: https://www.paypal.com/it" }] }
]);
add("password", "Analisi", "POLICY", [
  { regole: ["almeno 10 caratteri", "almeno una lettera maiuscola", "almeno un numero", "almeno un simbolo tra ! @ # $ % & *", "nessuno spazio"],
    lista: ["Falco#2026xy", "falco#2026xy", "Falco2026xyz", "Fa#2026", "Falco #2026x", "FALCO#RENNA", "Volpe!rossa", "Tigre&Bianca"] },
  { regole: ["da 8 a 12 caratteri", "inizia con una lettera", "contiene esattamente 2 numeri", "non contiene la parola nemesis (né maiuscola né minuscola)", "almeno un simbolo"],
    lista: ["Orso_88blu", "8Orso_8blu", "Orso_888blu", "Nemesis_42", "Orsoblu88", "Or_8b8", "Orso_88bluverde!", "Lupo!7grigio"] },
  { regole: ["almeno 12 caratteri", "almeno 2 lettere maiuscole", "nessuna sequenza di 4 cifre di fila (niente date)", "non contiene il nome utente mrossi", "almeno un simbolo"],
    lista: ["BlackOut!Sette7x", "Blackout!sette7x", "BlackOut!1987xy", "MRossi!Password", "BlackOutSette7x", "Black!Out", "PASSWORD!2025A", "Cielo!stellato"] }
]);
add("sequenze", "Analisi", "GENERATORE", [
  { seq: [[[2, 4, 8, 16, 32], 64], [[1, 1, 2, 3, 5, 8, 13], 21], [[3, 6, 11, 18, 27], 38]], aiuti: ["ogni numero è il doppio del precedente", "ogni numero è la somma dei due precedenti", "le differenze sono 3, 5, 7, 9..."] },
  { seq: [[[1, 4, 9, 16, 25], 36], [[2, 3, 5, 7, 11, 13], 17], [[7, 10, 16, 25, 37], 52]], aiuti: ["sono numeri moltiplicati per sé stessi (1×1, 2×2...)", "sono i numeri primi (divisibili solo per 1 e per sé stessi)", "le differenze sono 3, 6, 9, 12..."] }
]);
add("checksum", "Analisi", "INTEGRITÀ", [{ regola: "sette" }, { regola: "ultima" }]);

/* ======================= INTELLIGENCE ======================= */
add("dossier", "Intelligence", "INGEGNERIA SOCIALE", [
  { agente: "Viktor Krane", fatti: ["Nome in codice: CORVO", "Nato a Danzica il 14 marzo 1987", "Ex ingegnere delle telecomunicazioni", "Reclutato da NEMESIS nel 2019", "Vive con il suo cane, un pastore tedesco di nome Zar", "Tifoso della Dinamo Kiev", "Ha paura dei piccioni"],
    dom: [["Come si chiama il tuo animale domestico?", "ZAR"], ["In che città sei nato?", "DANZICA|GDANSK"], ["In che anno sei entrato in NEMESIS?", "2019"]] },
  { agente: "Elena Moravec", fatti: ["Nata a Brno nel 1990", "Vive con la gatta Mirtilla", "Laureata in matematica a Praga", "La sua prima auto era una Skoda Fabia rossa", "La madre, da nubile, si chiamava Jana Novak", "Colore preferito: verde", "Tifosa dello Sparta"],
    dom: [["Qual è il cognome da nubile di tua madre?", "NOVAK"], ["Di che marca era la tua prima auto?", "SKODA"], ["In che città ti sei laureata?", "PRAGA|PRAHA"]] },
  { agente: "Tomás Reyes", fatti: ["Nato a Valencia il 12 luglio 1985", "Pilota di droni per NEMESIS", "Ha una figlia di nome Lucía", "Piatto preferito: paella", "Ha frequentato la scuola elementare San Jorge", "Soprannome: El Zorro", "Giocava a calcio con la maglia numero 23"],
    dom: [["Come si chiamava la tua scuola elementare?", "SANJORGE"], ["Come si chiama tua figlia?", "LUCIA"], ["Che numero di maglia avevi?", "23"]] },
  { agente: "Ingrid Solberg", fatti: ["Nata a Bergen, Norvegia", "Ha un husky di nome Koda", "Ex campionessa nazionale di scacchi", "Film preferito: Matrix", "Il nonno Olav era un pescatore", "Primo concerto a 15 anni: Metallica", "Beve solo tè verde"],
    dom: [["Qual è il tuo film preferito?", "MATRIX"], ["Come si chiamava tuo nonno?", "OLAV"], ["Di che band era il tuo primo concerto?", "METALLICA"]] }
]);
add("memory", "Intelligence", "FIRME VIRALI", [{ coppie: 8, errori: 0 }, { coppie: 8, errori: 12 }]);
add("simon", "Intelligence", "STRETTA DI MANO", [{ pads: 4, len: 8, vel: 650 }, { pads: 4, len: 7, vel: 500 }, { pads: 6, len: 6, vel: 650 }]);
add("slide", "Intelligence", "CHIP", [{}, { parola: "PASSWORD" }]);

/* codice di conferma mostrato a fine gioco */
const PAROLE_CODICE = ["AQUILA", "LINCE", "COBRA", "DRAGO", "PUMA", "LUPO", "SQUALO", "VIPERA", "FALCO", "ORSO", "TIGRE", "CONDOR", "PANTERA", "GHEPARDO", "CORVO", "ORCA", "SCORPIONE", "LEONE", "VOLPE", "GUFO"];
const codiceDi = id => PAROLE_CODICE[(id * 7) % PAROLE_CODICE.length] + "-" + String(id).padStart(3, "0");
