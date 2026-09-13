# Come aggiornare il sito

Il sito è fatto di quattro file. Ne toccherai uno solo:

| File | A cosa serve | Lo modifico? |
|---|---|---|
| `contenuti.js` | Tutti i testi, i progetti, i contatti, le referenze | **Sì, sempre da qui** |
| `index.html` | Scheletro della pagina | No |
| `stile.css` | Aspetto grafico | No |
| `app.js` | Motore che costruisce le pagine | No |

Le foto stanno nella cartella `docs/` del repository, una sottocartella per progetto.
Non serve nessun programma: tutto si fa dal sito di GitHub (anche dal telefono).

---

## Le foto: la regola d'oro

Ogni progetto ha una cartella con il suo **codice**, e le foto si chiamano `codice` + numero a due cifre:

```
docs/tttred/tttred01.jpg
docs/tttred/tttred02.jpg
docs/tttred/tttred03.jpg
...
```

Regole:
- numeri **a due cifre** (01, 02 … 09, 10, 11), **senza buchi**;
- estensione `.jpg` minuscola;
- il codice della cartella e quello nel nome del file sono uguali.

Quando aggiungi foto, in `contenuti.js` aggiorna il numero `foto:` di quel progetto.

---

## Aggiungere foto a un progetto che esiste già

1. Su GitHub apri la cartella del progetto, es. `docs/tttred/`.
2. Guarda qual è l'ultimo numero (es. `tttred18.jpg`).
3. Rinomina le nuove foto con i numeri successivi (`tttred19.jpg`, `tttred20.jpg`…).
4. In quella cartella: **Add file → Upload files**, trascina le foto, poi **Commit changes**.
5. Apri `contenuti.js` (nella cartella principale del repository), clicca la matita, trova il progetto e cambia `foto: 18` in `foto: 20`. **Commit changes**.

Dopo un minuto circa il sito è aggiornato.

---

## Aggiungere un progetto nuovo

1. Scegli un codice corto, solo lettere minuscole, es. `solar`.
2. Rinomina le foto: `solar01.jpg`, `solar02.jpg`, …
3. Su GitHub, nella cartella `docs/`: **Add file → Upload files**. Prima di trascinare le foto, nel campo del nome scrivi `solar/` (con la barra): GitHub crea la cartella. Poi **Commit changes**.
4. Apri `contenuti.js` → matita. Dentro `PROGETTI = [ … ]` copia un blocco esistente e incollalo dove vuoi che compaia (l'ordine nel file è l'ordine sul sito). Compila:

```js
  {
    sezione: "solar",            // in-campo, solar, universita
    cartella: "solar",           // il codice scelto
    foto: 12,                    // quante foto hai caricato
    copertina: 3,                // quale foto usare come anteprima
    periodo: "2024 – 2025",      // facoltativo
    titolo: { it: "Telaio del veicolo solare", en: "Solar car chassis" },
    descrizione: {
      it: "Testo in italiano.",
      en: "Text in English."
    },
    software: "Fusion 360, Inventor",     // facoltativo
    colleghi: "Nome Cognome, Nome Cognome" // facoltativo
  },
```

5. Controlla che ci sia una **virgola** dopo la parentesi graffa `}` di chiusura (tranne per l'ultimo blocco della lista). **Commit changes**.

Se dopo il salvataggio il sito appare vuoto, c'è quasi sicuramente una virgola o una virgoletta mancante: riapri il file e confronta con un blocco che funziona.

---

## La pagina "Percorso"

Sono tre elenchi in fondo a `contenuti.js`:

- `ESPERIENZE` — i lavori, dal più recente al più vecchio (l'ordine nel file è l'ordine in pagina);
- `FORMAZIONE` — titoli di studio e abilitazioni;
- `LINGUE`.

Per aggiungere un lavoro, copia un blocco dentro `ESPERIENZE` e compila:

```js
  {
    periodo: { it: "gen 2027 – oggi", en: "Jan 2027 – present" },
    ruolo: { it: "Direttore dei lavori", en: "Works supervisor" },
    ente: "Nome dell'azienda",
    luogo: { it: "Città (PR)", en: "City, Italy" },
    attivita: {
      it: ["Prima cosa fatta", "Seconda cosa fatta"],
      en: ["First activity", "Second activity"]
    },
    vedi: "tttred"     // facoltativo: aggiunge "Vedi le foto" verso quel progetto
  },
```

`vedi` va usato solo se esiste un progetto con quel codice e con delle foto; altrimenti togli la riga.

Lo stage a Riga non è pubblicato: in fondo all'elenco c'è il blocco già pronto, dentro un commento `/* ... */`. Se un giorno vorrai pubblicarlo, togli le due righe del commento: resta nella forma generica (senza nome dell'azienda e senza mesi).

---

## Cambiare i testi

- **Presentazione, qualifica, sede**: in cima a `contenuti.js`, dentro `SITO`.
- **Contatti**: `SITO.contatti`. Per pubblicare un CV in PDF, carica il file nella cartella del sito e scrivi il nome in `cvPdf: "CV_Terranova.pdf"`.
- **Titoli e sottotitoli delle sezioni**: dentro `SEZIONI`.
- **Referenze**: dentro `REFERENZE`.

Ogni testo ha `it` e `en`. Se scrivi una sola stringa senza `it`/`en`, vale per tutte e due le lingue.

Per andare a capo dentro un testo scrivi `\n`.

---

## Copertine delle sezioni (le grandi immagini in home)

In `SEZIONI`, il campo `copertina` indica una foto: `"cartella/nomefile.jpg"`.
Se è vuoto (`""`), la tessera è gialla con il titolo grande: è quello che succede oggi per la World Solar Challenge. Appena carichi le foto del veicolo, scrivi ad esempio `copertina: "solar/solar03.jpg"`.

---

## Sezioni

Le sezioni sono tre. Per aggiungerne una, copia un blocco dentro `SEZIONI`, dagli un `id` nuovo (minuscolo, senza spazi) e usa quell'`id` nei progetti.

`anteprime: "intere"` fa vedere le immagini intere nelle anteprime: serve per le tavole. Senza quella riga, le anteprime sono ritagliate a riempire il riquadro, che è meglio per le foto.

---

## Struttura del repository

```
index.html          scheletro del sito
stile.css           grafica
app.js              motore
contenuti.js        ← l'unico file da modificare
font/               caratteri tipografici
docs/<codice>/      le foto, una cartella per progetto
google2d904c41fdf14409.html   verifica di Google: non cancellare
```

---

## Note tecniche (per chi dovesse metterci mano)

- Nessun generatore, nessuna dipendenza: HTML, CSS e JavaScript puri. Funziona su GitHub Pages così com'è.
- I font Barlow e Barlow Condensed sono inclusi in `font/` (licenza SIL Open Font License, file incluso). Nessuna richiesta verso servizi esterni.
- Le pagine sono indirizzi con il cancelletto (`#/s/in-campo`, `#/p/tttred`): si possono condividere e il tasto Indietro funziona, anche per chiudere la foto a schermo intero.
- Le immagini si caricano man mano che si scorre (`loading="lazy"`). Le originali non vengono ridotte: se un giorno il sito diventasse lento sui dati mobili, il passo successivo è generare delle anteprime ridotte, ma per ora non serve.
