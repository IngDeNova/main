# Cyberwar 100

100 minigiochi a tema guerra cibernetica (crittografia, hacking, difesa, analisi, intelligence).
Sito statico: solo HTML, CSS e JavaScript, nessun server o database.

## Pubblicare su GitHub Pages
1. Su github.com crea un nuovo repository (es. `cyberwar100`), pubblico.
2. "Add file" → "Upload files": trascina TUTTI i file di questa cartella → "Commit changes".
3. Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, cartella `/ (root)` → Save.
4. Dopo 1-2 minuti il sito è su `https://TUO-UTENTE.github.io/cyberwar100/`

## File
- `index.html` menu con ricerca e filtri
- `gioco.html?id=N` il singolo gioco (link diretto, es. `gioco.html?id=42`)
- `catalogo.js` elenco dei 100 giochi: qui si cambiano parole, testi e difficoltà
- `motori.js` la logica dei tipi di gioco
- `comune.js`, `stile.css` funzioni e grafica comuni

I giochi completati sono ricordati solo nel browser di chi gioca.
