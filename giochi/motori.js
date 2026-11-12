"use strict";
/* =====================================================================
   MOTORI DI GIOCO
   Ogni motore: { brief(p), info(p), render(g, p) }  — p = parametri dal catalogo
   ===================================================================== */
const E = {};

/* ---------- strumenti di cifratura ---------- */
const caesar = (s, k) => s.replace(/[A-Z]/g, c => AB[(AB.indexOf(c) + k + 26) % 26]);
const atbash = s => s.replace(/[A-Z]/g, c => AB[25 - AB.indexOf(c)]);
function vigenere(s, key) { let j = 0; return s.replace(/[A-Z]/g, c => AB[(AB.indexOf(c) + AB.indexOf(key[j++ % key.length])) % 26]); }
function railFence(s, n) { const r = Array.from({ length: n }, () => []); let i = 0, d = 1; for (const c of s) { r[i].push(c); if (i === 0) d = 1; else if (i === n - 1) d = -1; i += d; } return r.map(x => x.join("")).join(""); }
const groups = (s, n) => s.match(new RegExp(".{1," + n + "}", "g")).join(" ");
const T9 = { A: "2", B: "22", C: "222", D: "3", E: "33", F: "333", G: "4", H: "44", I: "444", J: "5", K: "55", L: "555", M: "6", N: "66", O: "666", P: "7", Q: "77", R: "777", S: "7777", T: "8", U: "88", V: "888", W: "9", X: "99", Y: "999", Z: "9999" };
const MORSE = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.." };
const POLY = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const polyOf = c => { const i = POLY.indexOf(c === "J" ? "I" : c); return "" + (Math.floor(i / 5) + 1) + (i % 5 + 1); };
const bin8 = c => c.charCodeAt(0).toString(2).padStart(8, "0");
const hex2 = c => c.charCodeAt(0).toString(16).toUpperCase();
const words = s => s.split(" ").filter(Boolean);

/* tabelle per i suggerimenti */
const tbl = (rows, cols) => `<div class="tblw"><table class="tbl">${rows.map(r => "<tr>" + r.map(c => `<td>${c}</td>`).join("") + "</tr>").join("")}</table></div>`;
const chunk = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };
const INFO = {
  morse: () => tbl(chunk(Object.keys(MORSE).map(k => `<b>${k}</b> ${MORSE[k].replace(/\./g, "·").replace(/-/g, "—")}`), 4)),
  atbash: () => tbl([AB.split("").map(c => `<b>${c}</b>`), AB.split("").reverse()]).replace("<table", '<table style="font-size:12px"'),
  bin: () => tbl(chunk(AB.split("").map(c => `<b>${c}</b> ${bin8(c)}`), 3)),
  hex: () => tbl(chunk(AB.split("").map(c => `<b>${c}</b> ${hex2(c)}`), 5)),
  a1z: () => tbl(chunk(AB.split("").map((c, i) => `<b>${c}</b> ${i + 1}`), 6)),
  t9: () => tbl([["<b>1</b>", "<b>2</b> ABC", "<b>3</b> DEF"], ["<b>4</b> GHI", "<b>5</b> JKL", "<b>6</b> MNO"], ["<b>7</b> PQRS", "<b>8</b> TUV", "<b>9</b> WXYZ"], ["*", "<b>0</b> spazio", "#"]]),
  poly: () => tbl([["", "<b>1</b>", "<b>2</b>", "<b>3</b>", "<b>4</b>", "<b>5</b>"]].concat(chunk(POLY.split(""), 5).map((r, i) => [`<b>${i + 1}</b>`].concat(r.map(c => c === "I" ? "I/J" : c))))),
  vig: () => tbl([[""].concat(AB.split("").map(c => `<b>${c}</b>`))].concat(AB.split("").map((r, i) => [`<b>${r}</b>`].concat(AB.split("").map((_, j) => AB[(i + j) % 26]))))).replace("<table", '<table style="font-size:10px"')
};

/* motore generico per i cifrari "testo -> risposta" */
function cifrario(g, display, answer, tool, label, ph) {
  g.innerHTML = `<div class="box"><div class="lbl">${label || "MESSAGGIO INTERCETTATO"}</div><div class="cipher">${display}</div></div>${tool || ""}<div class="lbl">RISPOSTA</div>${rispostaHTML(ph)}`;
  legaRisposta(v => v === norm(answer));
}
const msgChiave = p => `${p.frase}. CHIAVE ${p.chiave}`;

/* ---------------- CRITTOGRAFIA ---------------- */
E.cesare = {
  brief: p => `Messaggio cifrato con il <b>Cifrario di Cesare</b>: ogni lettera è spostata in avanti dello stesso numero di posizioni. Ogni messaggio di NEMESIS contiene la parola <b>CHIAVE</b> seguita dalla parola segreta. Trovate lo spostamento e inviate la parola segreta.`,
  info: p => `Cercate nel messaggio una parola di 6 lettere che potrebbe essere CHIAVE e confrontate le lettere. Usate la ruota: impostato lo spostamento giusto, sotto ogni lettera cifrata leggete quella in chiaro.`,
  render(g, p) {
    let s = 0;
    const tool = `<div class="box"><div class="lbl">RUOTA DI DECRITTAZIONE</div><div class="wheel"><div class="wr" id="wTop"></div><div class="wr" id="wBot"></div></div>
      <div class="row" style="justify-content:center;margin-top:10px"><button id="wL">◄</button><span id="wS" style="min-width:150px;text-align:center"></span><button id="wR">►</button></div></div>`;
    cifrario(g, esc(caesar(msgChiave(p), p.shift)), p.chiave, tool);
    const draw = () => { $("#wTop").innerHTML = '<span class="h">CIFRATO</span>' + AB.split("").map(c => `<span>${c}</span>`).join("");
      $("#wBot").innerHTML = '<span class="h">CHIARO</span>' + AB.split("").map((c, i) => `<span>${AB[(i - s + 26) % 26]}</span>`).join(""); $("#wS").textContent = "SPOSTAMENTO " + s; };
    $("#wL").onclick = () => { s = (s + 25) % 26; sfx.key(); draw(); }; $("#wR").onclick = () => { s = (s + 1) % 26; sfx.key(); draw(); }; draw();
  }
};
E.atbash = {
  brief: () => `NEMESIS usa l'<b>Atbash</b>, il cifrario a specchio: la A diventa Z, la B diventa Y, e così via. Decifrate il messaggio e inviate la parola che segue <b>CHIAVE</b>.`,
  info: () => `Tabella di conversione (riga sopra = cifrato, riga sotto = in chiaro; funziona anche al contrario):` + INFO.atbash(),
  render: (g, p) => cifrario(g, esc(atbash(msgChiave(p))), p.chiave)
};
E.vigenere = {
  brief: p => `Messaggio cifrato con il <b>Cifrario di Vigenère</b>. La chiave di cifratura è il nome in codice dell'agente che l'ha spedito: lo trovate nel suggerimento. Il messaggio decifrato è la parola segreta.`,
  info: p => `Nome in codice dell'agente (chiave): <b class="big">${p.key}</b><br>Metodo: scrivete la chiave ripetuta sotto il messaggio. Per ogni lettera, nella tabella cercate la <b>riga</b> della lettera della chiave, trovate in quella riga la lettera cifrata: l'intestazione della sua <b>colonna</b> è la lettera in chiaro.` + INFO.vig(),
  render: (g, p) => cifrario(g, esc(vigenere(p.chiave, p.key)), p.chiave)
};
E.binario = {
  brief: () => `Intercettato un flusso di dati in <b>binario</b>. Ogni gruppo di 8 bit è una lettera in codice ASCII. Convertite e inviate la parola.`,
  info: () => `Tabella ASCII delle lettere maiuscole:` + INFO.bin(),
  render: (g, p) => cifrario(g, p.chiave.split("").map(bin8).join(" "), p.chiave, "", "FLUSSO DATI")
};
E.hex = {
  brief: () => `Un dump di memoria in <b>esadecimale</b>: ogni coppia di simboli è una lettera in codice ASCII. Convertite e inviate la parola.`,
  info: () => `Tabella ASCII esadecimale delle lettere maiuscole:` + INFO.hex(),
  render: (g, p) => cifrario(g, p.chiave.split("").map(hex2).join(" "), p.chiave, "", "DUMP DI MEMORIA 0x7FF3A0")
};
E.morseScritto = {
  brief: () => `Trascrizione di una trasmissione in <b>codice Morse</b>. Le lettere sono separate da uno spazio, le parole da una barra. Inviate il messaggio (senza spazi).`,
  info: () => `Tabella Morse:` + INFO.morse(),
  render: (g, p) => cifrario(g, words(p.chiave).map(w => w.split("").map(c => MORSE[c].replace(/\./g, "·").replace(/-/g, "—")).join("&nbsp;&nbsp; ")).join("&nbsp;&nbsp; / &nbsp;&nbsp;"), p.chiave, "", "TRASCRIZIONE RADIO")
};
E.t9 = {
  brief: () => `Un SMS di NEMESIS scritto con una <b>vecchia tastiera di cellulare</b>: per ottenere una lettera si preme il tasto più volte (es. 2 = A, 22 = B, 222 = C). Ogni gruppo di cifre è una lettera. Inviate la parola.`,
  info: () => `Tastiera del telefono:` + INFO.t9(),
  render: (g, p) => cifrario(g, words(p.chiave).map(w => w.split("").map(c => T9[c]).join(" ")).join(" &nbsp;/&nbsp; "), p.chiave, "", "SMS INTERCETTATO")
};
E.a1z26 = {
  brief: () => `Messaggio in <b>codice numerico</b>: ogni numero è la posizione di una lettera nell'alfabeto inglese di 26 lettere. Inviate la parola.`,
  info: () => `A=1 ... Z=26:` + INFO.a1z(),
  render: (g, p) => cifrario(g, words(p.chiave).map(w => w.split("").map(c => AB.indexOf(c) + 1).join("-")).join(" &nbsp;/&nbsp; "), p.chiave, "", "SEQUENZA NUMERICA")
};
E.polibio = {
  brief: () => `Messaggio cifrato con la <b>Scacchiera di Polibio</b>: ogni lettera è una coppia di cifre, <b>riga</b> e poi <b>colonna</b> di una griglia 5×5. Inviate la parola.`,
  info: () => `Scacchiera di Polibio (I e J condividono la casella):` + INFO.poly(),
  render: (g, p) => cifrario(g, p.chiave.split("").map(polyOf).join(" "), p.chiave, "", "COORDINATE CIFRATE")
};
E.rail = {
  brief: p => `Messaggio cifrato con il <b>cifrario a binari</b> (rail fence) su <b>${p.n} binari</b>: il testo, senza spazi, è stato scritto a zig-zag su ${p.n} righe e poi letto riga per riga. I gruppi da 5 servono solo a leggere meglio. Inviate la parola dopo <b>CHIAVE</b>.`,
  info: p => `Esempio con ${p.n} binari e la parola ATTACCOALBUIO:<pre class="pre">${p.n === 2 ? "A . T . C . O . L . U . O\n. T . A . C . A . B . I ." : "A . . . C . . . L . . . O\n. T . A . C . A . B . I .\n. . T . . . O . . . U . ."}</pre>Testo cifrato: ${railFence("ATTACCOALBUIO", p.n)}. Contate le lettere, dividetele nelle righe (la prima e l'ultima riga hanno meno lettere) e rileggete a zig-zag.`,
  render: (g, p) => cifrario(g, groups(railFence(msgChiave(p).replace(/[^A-Z]/g, ""), p.n), 5), p.chiave)
};
E.specchio = {
  brief: p => `NEMESIS nasconde i messaggi deformando il testo: ${p.modo === "specchio" ? "è scritto <b>allo specchio</b>" : p.modo === "sottosopra" ? "è <b>capovolto</b>" : "ogni parola è scritta <b>al contrario</b>"}. Leggetelo e inviate la parola che segue <b>CHIAVE</b>.`,
  info: p => p.modo === "parole" ? "Leggete ogni parola dall'ultima lettera alla prima." : "Provate a scrivere il messaggio su carta lettera per lettera, oppure... uno specchio vero aiuta!",
  render(g, p) {
    const m = msgChiave(p), d = p.modo === "parole" ? words(m).map(w => w.split("").reverse().join("")).join(" ") : m;
    cifrario(g, `<span style="display:inline-block;transform:${p.modo === "specchio" ? "scaleX(-1)" : p.modo === "sottosopra" ? "rotate(180deg)" : "none"}">${esc(d)}</span>`, p.chiave);
  }
};
E.anagramma = {
  brief: () => `Una password intercettata è stata <b>rimescolata</b>. È un termine di sicurezza informatica in italiano. Rimettete in ordine le lettere.`,
  info: p => `Definizione: <b>${p.def}</b>`,
  render(g, p) { let s; do s = shuffle(p.chiave.split("")).join(""); while (s === p.chiave); cifrario(g, s.split("").join(" "), p.chiave, "", "LETTERE INTERCETTATE"); }
};
E.coordinate = {
  brief: () => `Il messaggio è nascosto in una griglia di lettere. Le <b>coordinate</b> intercettate indicano, in ordine, le lettere da leggere: la lettera è la <b>riga</b>, il numero è la <b>colonna</b>. Inviate la parola.`,
  info: () => `Esempio: C4 = riga C, colonna 4. Leggete le coordinate nell'ordine in cui sono scritte.`,
  render(g, p) {
    const N = 6, R = "ABCDEF", grid = Array.from({ length: N * N }, () => pick(AB)), cells = shuffle([...Array(N * N).keys()]).slice(0, p.chiave.length);
    cells.forEach((c, i) => grid[c] = p.chiave[i]);
    const coords = cells.map(c => R[Math.floor(c / N)] + (c % N + 1)).join("  ");
    const t = `<div class="tblw"><table class="tbl grid6"><tr><td></td>${[1, 2, 3, 4, 5, 6].map(n => `<td><b>${n}</b></td>`).join("")}</tr>${[...R].map((r, i) => `<tr><td><b>${r}</b></td>${grid.slice(i * N, i * N + N).map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
    cifrario(g, coords, p.chiave, `<div class="box">${t}</div>`, "COORDINATE");
  }
};
function pigSVG(ch) {
  const i = AB.indexOf(ch); let s = '<svg viewBox="0 0 50 50" class="pig">';
  const L = (a, b, c, d) => s += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;
  if (i < 18) { const k = i % 9, r = Math.floor(k / 3), c = k % 3; if (c > 0) L(10, 10, 10, 40); if (c < 2) L(40, 10, 40, 40); if (r > 0) L(10, 10, 40, 10); if (r < 2) L(10, 40, 40, 40); if (i >= 9) s += '<circle cx="25" cy="25" r="4"/>'; }
  else { const k = (i - 18) % 4; if (k === 0) { L(10, 10, 25, 35); L(25, 35, 40, 10); } if (k === 1) { L(10, 10, 35, 25); L(35, 25, 10, 40); } if (k === 2) { L(40, 10, 15, 25); L(15, 25, 40, 40); } if (k === 3) { L(10, 40, 25, 15); L(25, 15, 40, 40); } if (i >= 22) s += `<circle cx="${[25, 22, 28, 25][k]}" cy="${[22, 25, 25, 28][k]}" r="4"/>`; }
  return s + "</svg>";
}
E.pigpen = {
  brief: () => `Messaggio scritto con il <b>cifrario Pigpen</b> (il "cifrario dei massoni"): ogni lettera è un simbolo fatto di linee e punti. Inviate la parola.`,
  info: () => `Chiave dei simboli:<div class="pigkey">${AB.split("").map(c => `<span>${pigSVG(c)}<b>${c}</b></span>`).join("")}</div>`,
  render: (g, p) => cifrario(g, `<div class="pigmsg">${words(p.chiave).map(w => w.split("").map(pigSVG).join("")).join('<span class="sp"></span>')}</div>`, p.chiave, "", "SIMBOLI INTERCETTATI")
};
E.morse = {
  brief: () => `Una radio di NEMESIS trasmette una parola in <b>codice Morse</b>, con luce e suono. <b>Punto</b> = breve, <b>linea</b> = lungo. Tra le lettere c'è una pausa più lunga. Alzate il volume (o guardate la luce).`,
  info: () => `Consiglio: usate LENTO e scrivete punti e linee su carta prima di tradurre.` + INFO.morse(),
  render(g, p) {
    g.innerHTML = `<div class="box center"><div class="lbl">RICEVITORE</div><div class="lamp" id="lamp"></div>
      <div class="row" style="justify-content:center"><button class="pri" id="play">▶ ASCOLTA</button><button id="slow">▶ LENTO</button></div><div class="lbl" id="st" style="margin-top:8px">&nbsp;</div></div><div class="lbl">PAROLA</div>` + rispostaHTML();
    const play = mult => {
      clearTimers(); $("#lamp").classList.remove("on"); ac(); const u = p.unita * mult; let t = 400; $("#st").textContent = "TRASMISSIONE IN CORSO...";
      p.chiave.split("").forEach(ch => { MORSE[ch].split("").forEach(s => { const d = s === "." ? u : 3 * u;
        later(() => { $("#lamp").classList.add("on"); tone(620, d / 1000, "sine", 0.15); }, t); later(() => $("#lamp").classList.remove("on"), t + d); t += d + u; }); t += 2 * u; });
      later(() => $("#st").textContent = "FINE TRASMISSIONE", t);
    };
    $("#play").onclick = () => play(1); $("#slow").onclick = () => play(1.8);
    legaRisposta(v => v === p.chiave);
  }
};

/* ---------------- HACKING ---------------- */
E.mastermind = {
  brief: p => `Il bunker di NEMESIS è protetto da un codice di <b>${p.len} simboli tutti diversi</b> scelti tra: <b>${p.simboli.join(" ")}</b>. Dopo ogni tentativo: <b>●</b> = simbolo giusto al posto giusto, <b>○</b> = simbolo presente ma al posto sbagliato. Avete <b>${p.tent} tentativi</b>, poi il codice cambia.`,
  info: p => `Strategia: nei primi due tentativi usate simboli tutti diversi tra loro (es. i primi ${p.len} e poi i successivi ${p.len}). Contando i simboli capite quali sono nel codice; poi spostateli uno alla volta per trovare la posizione.`,
  render(g, p) {
    const S = p.simboli, col = p.colori;
    const sym = x => col ? `<span class="dot" style="background:${col[S.indexOf(x)]}"></span>` : x;
    g.innerHTML = `<div class="slots" id="slots"></div><div class="pad" id="pad" style="grid-template-columns:repeat(${Math.min(5, S.length)},1fr)">${S.map(x => `<button data-k="${x}">${sym(x)}</button>`).join("")}</div>
      <div class="row" style="justify-content:center;margin-top:8px"><button id="del">⌫ CANCELLA</button><button class="pri" id="ok">PROVA</button></div>
      <div class="msg center" id="msg"></div><div class="box"><div class="lbl">TENTATIVI <span id="left"></span></div><div id="gl"></div></div>`;
    let code, tent, cur = [], fine = false;
    const nuovo = () => { code = shuffle(S).slice(0, p.len); tent = []; };
    window.__mm = () => code.slice();
    const score = x => { let a = 0, b = 0; x.forEach((c, i) => { if (code[i] === c) a++; else if (code.includes(c)) b++; }); return [a, b]; };
    const draw = () => {
      $("#slots").innerHTML = Array.from({ length: p.len }, (_, i) => `<div class="slot">${cur[i] !== undefined ? sym(cur[i]) : '<span class="blink" style="color:var(--dim)">_</span>'}</div>`).join("");
      $("#gl").innerHTML = tent.slice().reverse().map(x => { const [a, b] = score(x); return `<div class="gl"><span>${x.map(sym).join(col ? "" : " ")}</span><span class="fb">${"●".repeat(a)}${"○".repeat(b)}${a + b ? "" : "—"}</span></div>`; }).join("") || '<span style="color:var(--dim)">nessuno</span>';
      $("#left").textContent = "— RIMASTI " + (p.tent - tent.length);
    };
    const msg = $("#msg");
    const press = k => { if (fine) return;
      if (k === "del") cur.pop();
      else if (k === "ok") {
        if (cur.length < p.len) return errore(msg, `Servono ${p.len} simboli`);
        if (new Set(cur).size < p.len) return errore(msg, "I simboli devono essere tutti diversi");
        tent.push(cur); const [a] = score(cur); cur = [];
        if (a === p.len) { fine = true; draw(); msgOk(msg, "CODICE CORRETTO"); later(WIN, 700); return; }
        if (tent.length >= p.tent) { nuovo(); errore(msg, "TENTATIVI ESAURITI — NUOVO CODICE GENERATO"); } else msg.textContent = "";
      } else if (cur.length < p.len) cur.push(k);
      sfx.key(); draw(); };
    $("#pad").onclick = e => { const b = e.target.closest("button"); if (b) press(b.dataset.k); };
    $("#del").onclick = () => press("del"); $("#ok").onclick = () => press("ok");
    document.onkeydown = e => { const k = e.key.toUpperCase(); if (S.includes(k)) press(k); else if (e.key === "Backspace") press("del"); else if (e.key === "Enter") press("ok"); };
    nuovo(); draw();
  }
};
E.terminale = {
  brief: p => `Siete dentro il server di NEMESIS. ${p.obiettivo} Comandi: <b>help, ls, cd, cat</b>. Quando trovate il codice digitate <b>submit CODICE</b>.`,
  info: p => p.aiuto + `<br><br>Ricordate: <b>ls -a</b> mostra i file nascosti (quelli che iniziano con il punto), <b>cd ..</b> torna indietro, il tasto TAB completa i nomi.`,
  render(g, p) {
    const FS = p.fs(), HOME = ["home", "operatore"];
    g.innerHTML = `<div class="term" id="term"><div class="out" id="out"></div><div class="inl"><span class="pr" id="pr"></span><input id="cmd" autocomplete="off" autocapitalize="none" spellcheck="false"></div></div>`;
    const out = $("#out"), inp = $("#cmd"); let cwd = HOME.slice(), hist = [], hp = 0, fine = false;
    const path = q => "/" + q.join("/"), short = () => { const q = path(cwd); return q.startsWith("/home/operatore") ? "~" + q.slice(15) : q; };
    const prompt = () => $("#pr").textContent = "operatore@nemesis:" + short() + "$";
    const print = (t, c) => { const s = document.createElement("span"); if (c) s.className = c; s.textContent = t + "\n"; out.appendChild(s); out.scrollTop = out.scrollHeight; };
    const printH = h => { const s = document.createElement("span"); s.innerHTML = h + "\n"; out.appendChild(s); out.scrollTop = out.scrollHeight; };
    const resolve = q => { let parts = q.startsWith("/") ? [] : cwd.slice(); if (q.startsWith("~")) { parts = HOME.slice(); q = q.slice(1); } q.split("/").forEach(x => { if (!x || x === ".") return; if (x === "..") parts.pop(); else parts.push(x.toLowerCase()); }); return parts; };
    const node = parts => { let n = FS; for (const x of parts) { if (!n.d || !n.c[x]) return null; n = n.c[x]; } return n; };
    const C = {
      help: () => print("Comandi:\n  ls [-a]       elenca i file (-a anche quelli nascosti)\n  cd <dir>      entra in una cartella (cd .. indietro)\n  cat <file>    legge un file\n  pwd           dove mi trovo\n  decrypt <file> <password>\n  submit <codice>\n  clear"),
      pwd: () => print(path(cwd)), clear: () => { out.innerHTML = ""; }, whoami: () => print("operatore"),
      ls: a => { const all = a.includes("-a"), tg = a.filter(x => x !== "-a")[0], n = node(tg ? resolve(tg) : cwd); if (!n) return print("ls: '" + tg + "' non esiste", "e"); if (!n.d) return print(tg);
        printH(Object.keys(n.c).filter(k => all || k[0] !== ".").sort().map(k => n.c[k].d ? `<span class="d">${esc(k)}/</span>` : esc(k)).join("   ") || "(vuota)"); },
      cd: a => { if (!a[0]) { cwd = HOME.slice(); return; } const q = resolve(a[0]), n = node(q); if (!n) return print("cd: " + a[0] + ": non esiste", "e"); if (!n.d) return print("cd: è un file, usa cat", "e"); cwd = q; },
      cat: a => { if (!a[0]) return print("uso: cat <file>", "e"); const n = node(resolve(a[0])); if (!n) return print("cat: " + a[0] + ": non esiste", "e"); if (n.d) return print("cat: è una cartella, usa cd", "e"); if (n.enc) return print("[FILE CIFRATO] usa: decrypt " + a[0] + " <password>", "e"); print(n.t); },
      decrypt: a => { if (a.length < 2) return print("uso: decrypt <file> <password>", "e"); const n = node(resolve(a[0])); if (!n || n.d) return print("decrypt: file inesistente", "e"); if (!n.enc) return print("decrypt: il file non è cifrato", "e");
        if (norm(a[1]) !== norm(n.pw)) { sfx.err(); return print("ERRORE: password errata.", "e"); } sfx.ok(); print("Decifratura... [##########] 100%\n" + n.t, "y"); },
      submit: a => { if (norm(a.join("")) === norm(p.codice)) { fine = true; print(">>> CODICE ACCETTATO", "y"); inp.blur(); later(WIN, 700); } else { sfx.err(); print("Codice rifiutato.", "e"); } },
      sudo: () => print("Bel tentativo. Incidente segnalato.", "e")
    };
    inp.addEventListener("keydown", e => {
      if (fine) return;
      if (e.key === "Enter") { const v = inp.value; inp.value = ""; if (v.trim()) { hist.push(v); hp = hist.length; } printH(`<span class="pr">${esc($("#pr").textContent)}</span> ${esc(v)}`);
        const ps = v.trim().split(/\s+/).filter(Boolean); if (ps.length) { const f = C[ps[0].toLowerCase()]; if (f) f(ps.slice(1)); else print(ps[0] + ": comando non trovato (scrivi help)", "e"); } prompt(); }
      else if (e.key === "ArrowUp") { if (hp > 0) inp.value = hist[--hp]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { if (hp < hist.length) inp.value = hist[++hp] || ""; e.preventDefault(); }
      else if (e.key === "Tab") { e.preventDefault(); const ws = inp.value.split(" "), last = ws[ws.length - 1], i = last.lastIndexOf("/"), dir = i >= 0 ? last.slice(0, i + 1) : "", pre = last.slice(i + 1).toLowerCase(), n = node(dir ? resolve(dir) : cwd);
        if (n && n.d) { const m = Object.keys(n.c).filter(k => k.startsWith(pre) && (pre[0] === "." || k[0] !== ".")); if (m.length === 1) { ws[ws.length - 1] = dir + m[0] + (n.c[m[0]].d ? "/" : ""); inp.value = ws.join(" "); } else if (m.length > 1) print(m.join("   ")); } }
    });
    $("#term").onclick = () => inp.focus();
    print("NEMESIS NET v6.6.6 — connessione stabilita.\nIniziate con:  ls   e   cat leggimi.txt", "y"); prompt(); later(() => inp.focus(), 50);
  }
};
E.logica = {
  brief: () => `Il pannello di controllo di NEMESIS ha 4 interruttori (<b>A B C D</b>) e 3 spie collegate da <b>porte logiche</b>. Trovate la combinazione che accende <b>tutte e tre</b> le spie.`,
  info: () => `<b>AND</b>: vero solo se entrambi sono veri. <b>OR</b>: vero se almeno uno è vero. <b>NOT</b>: inverte. <b>XOR</b>: vero se sono diversi.<br>Partite dalla spia con la condizione più restrittiva (quella con AND) e fissate prima quegli interruttori.`,
  render(g, p) {
    const V = ["A", "B", "C", "D"], ops = ["AND", "OR", "XOR"];
    const lit = () => { const v = pick(V); return Math.random() < .35 ? { s: "NOT " + v, f: x => !x[v] } : { s: v, f: x => x[v] }; };
    const expr = () => { const a = lit(), b = lit(), o = pick(ops), c = lit(), o2 = pick(ops);
      const f1 = x => o === "AND" ? a.f(x) && b.f(x) : o === "OR" ? a.f(x) || b.f(x) : a.f(x) !== b.f(x);
      return { s: `(${a.s} ${o} ${b.s}) ${o2} ${c.s}`, f: x => o2 === "AND" ? f1(x) && c.f(x) : o2 === "OR" ? f1(x) || c.f(x) : f1(x) !== c.f(x) }; };
    const combos = [...Array(16).keys()].map(n => ({ A: !!(n & 8), B: !!(n & 4), C: !!(n & 2), D: !!(n & 1) }));
    let L; do L = [expr(), expr(), expr()]; while (combos.filter(x => L.every(e => e.f(x))).length !== 1 || L.some(e => !V.some(v => e.s.includes(v))));
    const st = { A: false, B: false, C: false, D: false }; let fine = false;
    g.innerHTML = `<div class="sw">${V.map(v => `<button data-v="${v}" class="swb"><b>${v}</b><span></span></button>`).join("")}</div><div id="lamps"></div><div class="msg center" id="msg"></div>`;
    const draw = () => { $$(".swb").forEach(b => { const on = st[b.dataset.v]; b.classList.toggle("on", on); $("span", b).textContent = on ? "1 ON" : "0 OFF"; });
      $("#lamps").innerHTML = L.map((e, i) => `<div class="lampline ${e.f(st) ? "on" : ""}"><span class="ldot"></span><span>SPIA ${i + 1} = ${e.s}</span></div>`).join("");
      if (!fine && L.every(e => e.f(st))) { fine = true; msgOk($("#msg"), "SISTEMA SBLOCCATO"); later(WIN, 900); } };
    g.querySelector(".sw").onclick = e => { const b = e.target.closest("button"); if (!b || fine) return; st[b.dataset.v] = !st[b.dataset.v]; sfx.key(); draw(); };
    draw();
  }
};
E.bindec = {
  brief: p => `Il lucchetto digitale chiede un codice numerico. Sullo schermo ci sono <b>${p.n} numeri in binario</b>: convertiteli in decimale e scriveteli uno dopo l'altro, senza spazi.`,
  info: () => `Ogni cifra binaria vale, da destra a sinistra: 1, 2, 4, 8, 16, 32, 64, 128. Sommate i valori dove c'è un 1.<br>Esempio: 00101101 = 32 + 8 + 4 + 1 = <b>45</b>.`,
  render(g, p) { const ns = Array.from({ length: p.n }, () => rint(10, p.max)); cifrario(g, ns.map(n => n.toString(2).padStart(8, "0")).join("<br>"), ns.join(""), "", "REGISTRI DEL LUCCHETTO", "es. 4512"); }
};
E.typing = {
  brief: p => `Il firewall si riapre tra pochi secondi! Digitate i <b>${p.cmd.length} comandi</b> esattamente come appaiono, ognuno entro <b>${p.sec} secondi</b>. Se il tempo scade si riparte dal primo.`,
  info: () => `Attenzione a spazi, trattini e punti. Le maiuscole non contano. Uno detta, l'altro scrive!`,
  render(g, p) {
    g.innerHTML = `<div class="box center"><div class="lbl" id="cnt"></div><div class="cmdshow" id="show"></div><div class="led" id="led" style="display:inline-block;margin:8px 0">--</div></div>
      <input id="ty" autocomplete="off" autocapitalize="none" spellcheck="false" style="text-transform:none;letter-spacing:0" placeholder="scrivi qui il comando"><div class="msg center" id="msg"></div><div class="center"><button class="pri" id="go">INIZIA</button></div>`;
    let i = 0, left = 0, live = false;
    const show = () => { $("#cnt").textContent = `COMANDO ${i + 1}/${p.cmd.length}`; $("#show").textContent = p.cmd[i]; left = p.sec; $("#led").textContent = left + "s"; $("#ty").value = ""; $("#ty").focus(); };
    const start = () => { clearTimers(); i = 0; live = true; $("#go").style.display = "none"; $("#msg").textContent = ""; show();
      every(() => { if (!live) return; left--; $("#led").textContent = left + "s"; if (left <= 0) { live = false; errore($("#msg"), "TEMPO SCADUTO — RIPARTITE DAL PRIMO"); $("#go").style.display = ""; $("#go").textContent = "RIPROVA"; } }, 1000); };
    $("#go").onclick = start;
    $("#ty").addEventListener("input", () => { if (!live) return; if ($("#ty").value.trim().toLowerCase() === p.cmd[i].toLowerCase()) { sfx.ok(); i++; if (i >= p.cmd.length) { live = false; clearTimers(); msgOk($("#msg"), "ACCESSO OTTENUTO"); later(WIN, 600); } else show(); } });
    $("#show").textContent = p.cmd[0]; $("#cnt").textContent = "PRONTI?";
  }
};

/* ---------------- DIFESA ---------------- */
E.firewall = {
  brief: () => `Il firewall ha spezzato la rete. <b>Toccate i segmenti per ruotarli</b> finché <b>tutti</b> i nodi sono collegati al nucleo centrale (giallo) e diventano verdi. Nessun tubo può puntare nel vuoto.`,
  info: () => `Partite dai bordi e dagli angoli: un tubo non può mai puntare fuori dalla griglia. I pezzi con un pallino sono terminali: hanno un solo collegamento.`,
  render(g, p) {
    const N = p.n, cs = Math.max(40, Math.min(70, Math.floor((Math.min(innerWidth, 560) - 40) / N)));
    g.innerHTML = `<div class="pipes" id="pp" style="grid-template-columns:repeat(${N},var(--cs));--cs:${cs}px"></div><div class="msg center" id="msg"></div>`;
    const D = [[-1, 0, 1, 4], [0, 1, 2, 8], [1, 0, 4, 1], [0, -1, 8, 2]], r1 = m => ((m << 1) | (m >> 3)) & 15, rN = (m, n) => { for (let i = 0; i < n; i++) m = r1(m); return m; };
    const conn = Array(N * N).fill(0), seen = Array(N * N).fill(false), src = Math.floor(N / 2) * N + Math.floor(N / 2), st = [src]; seen[src] = true;
    while (st.length) { const c = st[st.length - 1], y = Math.floor(c / N), x = c % N; const o = shuffle(D).filter(([dy, dx]) => { const ny = y + dy, nx = x + dx; return ny >= 0 && nx >= 0 && ny < N && nx < N && !seen[ny * N + nx]; });
      if (!o.length) { st.pop(); continue; } const [dy, dx, b, ob] = o[0], n = (y + dy) * N + (x + dx); conn[c] |= b; conn[n] |= ob; seen[n] = true; st.push(n); if (Math.random() < .35) { const k = Math.floor(Math.random() * st.length); st.push(st.splice(k, 1)[0]); } }
    const rot = conn.map(() => rint(0, 3));
    const power = () => { const m = conn.map((c, i) => rN(c, rot[i])), on = Array(N * N).fill(false), q = [src]; on[src] = true;
      while (q.length) { const c = q.shift(), y = Math.floor(c / N), x = c % N; D.forEach(([dy, dx, b, ob]) => { const ny = y + dy, nx = x + dx; if (ny < 0 || nx < 0 || ny >= N || nx >= N) return; const k = ny * N + nx; if (!on[k] && (m[c] & b) && (m[k] & ob)) { on[k] = true; q.push(k); } }); } return on; };
    const svg = (m, s, deg) => { const P = { 1: [50, 0], 2: [100, 50], 4: [50, 100], 8: [0, 50] }; let h = '<svg viewBox="0 0 100 100">'; [1, 2, 4, 8].forEach(b => { if (m & b) h += `<line x1="50" y1="50" x2="${P[b][0]}" y2="${P[b][1]}"/>`; });
      if (s) h += '<circle cx="50" cy="50" r="18"/>'; else if (deg === 1) h += '<circle cx="50" cy="50" r="14"/>'; return h + "</svg>"; };
    let fine = false;
    const draw = () => { const on = power(); $("#pp").innerHTML = conn.map((c, i) => `<button data-i="${i}" class="${on[i] ? "on" : ""} ${i === src ? "src" : ""}">${svg(rN(c, rot[i]), i === src, [1, 2, 4, 8].filter(b => c & b).length)}</button>`).join("");
      const n = on.filter(Boolean).length; $("#msg").textContent = `NODI ONLINE: ${n}/${N * N}`; if (n === N * N && !fine) { fine = true; msgOk($("#msg"), "RETE RIPRISTINATA"); later(WIN, 900); } };
    $("#pp").onclick = e => { if (fine) return; const b = e.target.closest("button"); if (!b) return; rot[+b.dataset.i] = (rot[+b.dataset.i] + 1) % 4; sfx.key(); draw(); };
    if (power().every(Boolean)) rot[0] = (rot[0] + 1) % 4;
    window.__solve = () => { rot.fill(0); draw(); };
    draw();
  }
};
const WCOL = { rosso: "#e02424", blu: "#2563eb", giallo: "#facc15", bianco: "#f5f5f5", nero: "#111" };
function virusSol(w, serial) {
  const n = w.length, cnt = c => w.filter(x => x === c).length, odd = +serial[serial.length - 1] % 2 === 1, vowel = /[AEIOU]/.test(serial);
  if (n === 3) { if (w[0] === "nero") return 2; if (cnt("blu") >= 2) return w.indexOf("blu"); if (cnt("giallo") === 0) return 1; return 0; }
  if (n === 4) { if (!odd && cnt("rosso") >= 1) return w.indexOf("rosso"); if (cnt("bianco") === 2) return 3; if (w[1] === "giallo") return 2; return 1; }
  if (n === 5) { if (cnt("nero") === 0) return 4; if (cnt("rosso") > cnt("blu")) return w.lastIndexOf("rosso"); if (odd) return 0; return 2; }
  if (cnt("giallo") === 1) return w.indexOf("giallo"); if (cnt("bianco") === 0) return 1; if (vowel) return 5; return 4;
}
E.virus = {
  brief: p => `Il virus di NEMESIS ha <b>${p.moduli} moduli a cavi</b>. Per ognuno tagliate il cavo giusto seguendo il <b>MANUALE DELL'ARTIFICIERE</b> (nel suggerimento). Avete <b>${fmtMS(p.sec)}</b>. Cavo sbagliato o tempo scaduto = esplosione. Il suggerimento non costa nulla: giocate in due, uno legge il manuale e l'altro guarda i cavi!`,
  info: () => `<b>MANUALE DELL'ARTIFICIERE</b> — leggete le regole della sezione giusta dall'alto in basso: la <b>prima</b> regola vera dice quale cavo tagliare. I cavi si contano dall'alto. Vocali: A E I O U. Lo zero è pari.
    <h4>3 CAVI</h4><ol><li>Primo cavo nero → taglia il terzo.</li><li>Due o più cavi blu → taglia il primo cavo blu.</li><li>Nessun cavo giallo → taglia il secondo.</li><li>Altrimenti → taglia il primo.</li></ol>
    <h4>4 CAVI</h4><ol><li>Ultima cifra del n° di serie PARI e almeno un rosso → taglia il primo cavo rosso.</li><li>Esattamente due cavi bianchi → taglia il quarto.</li><li>Il secondo cavo è giallo → taglia il terzo.</li><li>Altrimenti → taglia il secondo.</li></ol>
    <h4>5 CAVI</h4><ol><li>Nessun cavo nero → taglia il quinto.</li><li>Più cavi rossi che blu → taglia l'ultimo cavo rosso.</li><li>Ultima cifra del n° di serie DISPARI → taglia il primo.</li><li>Altrimenti → taglia il terzo.</li></ol>
    <h4>6 CAVI</h4><ol><li>Esattamente un cavo giallo → taglia il cavo giallo.</li><li>Nessun cavo bianco → taglia il secondo.</li><li>Il n° di serie contiene una vocale → taglia il sesto.</li><li>Altrimenti → taglia il quinto.</li></ol>`,
  render(g, p) {
    let gen, panel, left, live = false;
    const nuovo = () => { clearTimers(); const serial = pick(AB) + pick(AB) + rint(0, 9) + "-" + pick(AB) + rint(0, 9) + rint(0, 9);
      gen = { serial, panels: Array.from({ length: p.moduli }, () => Array.from({ length: rint(3, 6) }, () => pick(Object.keys(WCOL)))) }; panel = 0; left = p.sec; live = true; draw();
      every(() => { if (!live) return; left--; const l = $("#led"); if (l) l.textContent = fmtMS(left); if (left <= 10) tone(1400, 0.05, "square", 0.04); if (left <= 0) boom("TEMPO SCADUTO"); }, 1000); };
    const boom = why => { live = false; clearTimers(); sfx.boom(); const b = document.createElement("div"); b.className = "boom"; document.body.appendChild(b); setTimeout(() => b.remove(), 1000);
      g.innerHTML = `<div class="box center"><h2 style="color:var(--r)">${why}<br>DISPOSITIVO ESPLOSO</h2><p class="brief">NEMESIS ha caricato un nuovo virus con cavi diversi.</p><button class="pri" id="again">NUOVO DISPOSITIVO</button></div>`; $("#again").onclick = nuovo; };
    const draw = () => { const w = gen.panels[panel];
      g.innerHTML = `<div class="dev"><div class="devtop"><span style="color:#aaa;font-size:12px">MODULO ${panel + 1}/${p.moduli}</span><span>N° SERIE <span class="serial">${gen.serial}</span></span><span class="led" id="led">${fmtMS(left)}</span></div>
        <div class="wires">${w.map((c, i) => `<div class="wire" data-i="${i}"><span class="num">${i + 1}</span><span class="tm"></span><span class="cab" style="background:${WCOL[c]}"></span><span class="tm"></span></div>`).join("")}</div>
        <div style="color:#888;font-size:12px;margin-top:8px">Toccate un cavo per tagliarlo. Si contano dall'alto (1).</div></div>`;
      $$(".wire").forEach(d => d.onclick = () => { if (!live) return; const i = +d.dataset.i; d.classList.add("cut");
        if (i === virusSol(w, gen.serial)) { sfx.ok(); live = false; later(() => { if (panel < p.moduli - 1) { panel++; live = true; draw(); } else { clearTimers(); g.innerHTML = '<h2 class="center">VIRUS NEUTRALIZZATO</h2>'; WIN(); } }, 600); }
        else later(() => boom("CAVO SBAGLIATO"), 250); }); };
    window.__virus = () => gen && virusSol(gen.panels[panel], gen.serial);
    g.innerHTML = `<div class="box center"><p class="brief">Aprite il <b>SUGGERIMENTO</b> (il manuale) e decidete chi legge e chi guarda i cavi.</p><button class="pri" id="arm">ATTIVA DISPOSITIVO</button></div>`; $("#arm").onclick = nuovo;
  }
};
E.lightsout = {
  brief: p => `${p.n * p.n} server sono infetti (accesi in rosso). Toccando un server lo riavviate, ma si riavviano anche quelli ${p.croce ? "<b>sopra, sotto, a destra e a sinistra</b>" : "<b>in diagonale</b>"}. Spegnete <b>tutti</b> i server infetti.`,
  info: p => p.croce ? `Tecnica "insegui le luci": spegnete la prima riga riga per riga toccando il server <b>sotto</b> ogni luce accesa. Arrivati in fondo, le luci rimaste nell'ultima riga vi dicono quali server della prima riga toccare; poi ripetete.` : `Ogni server tocca solo quelli in diagonale: le caselle si dividono come i colori della scacchiera, che non si influenzano tra loro. Risolvete prima i "bianchi" e poi i "neri".`,
  render(g, p) {
    const N = p.n, on = Array(N * N).fill(false), nb = i => { const y = Math.floor(i / N), x = i % N, d = p.croce ? [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]] : [[0, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]; return d.map(([a, b]) => [y + a, x + b]).filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N).map(([a, b]) => a * N + b); };
    const sol = [];
    while (!on.some(Boolean)) for (let k = 0; k < p.mosse; k++) { const i = rint(0, N * N - 1); sol.push(i); nb(i).forEach(j => on[j] = !on[j]); }
    window.__lights = () => sol.slice();
    g.innerHTML = `<div class="lo" id="lo" style="grid-template-columns:repeat(${N},1fr)"></div><div class="msg center" id="msg"></div><div class="center"><button id="cnt" disabled></button></div>`;
    let mosse = 0, fine = false;
    const draw = () => { $("#lo").innerHTML = on.map((v, i) => `<button data-i="${i}" class="${v ? "on" : ""}">${v ? "☣" : "✓"}</button>`).join(""); $("#cnt").textContent = "MOSSE: " + mosse;
      if (!fine && !on.some(Boolean)) { fine = true; msgOk($("#msg"), "RETE DISINFETTATA"); later(WIN, 800); } };
    $("#lo").onclick = e => { const b = e.target.closest("button"); if (!b || fine) return; nb(+b.dataset.i).forEach(j => on[j] = !on[j]); mosse++; sfx.key(); draw(); };
    draw();
  }
};
E.pacchetti = {
  brief: p => `Pacchetti di dati arrivati in disordine: ogni pacchetto ha un numero di sequenza scritto in <b>${p.base === 2 ? "binario" : p.base === 16 ? "esadecimale" : "decimale"}</b>. Toccateli nell'ordine giusto (dal più piccolo) per ricostruire la parola.`,
  info: p => p.base === 2 ? "In binario: 1=1, 10=2, 11=3, 100=4, 101=5, 110=6, 111=7, 1000=8, 1001=9, 1010=10, 1011=11, 1100=12." : p.base === 16 ? "In esadecimale dopo il 9 vengono A=10, B=11, C=12, D=13, E=14, F=15; poi 10=16, 11=17..." : "Ordinate i numeri dal più piccolo al più grande.",
  render(g, p) {
    const W = p.chiave, seq = shuffle([...Array(30).keys()].map(n => n + 1)).slice(0, W.length).sort((a, b) => a - b);
    const items = shuffle(W.split("").map((c, i) => ({ c, n: seq[i] })));
    g.innerHTML = `<div class="pk" id="pk">${items.map((it, i) => `<button data-i="${i}"><span class="sq">SEQ ${it.n.toString(p.base).toUpperCase()}</span><b>${it.c}</b></button>`).join("")}</div>
      <div class="box center"><div class="lbl">RICOSTRUZIONE</div><div class="code" id="rec" style="font-size:30px;min-height:44px"></div></div><div class="msg center" id="msg"></div>`;
    let got = [];
    $("#pk").onclick = e => { const b = e.target.closest("button"); if (!b || b.disabled) return; const it = items[+b.dataset.i];
      if (it.n === seq[got.length]) { got.push(it.c); b.disabled = true; sfx.key(); $("#rec").textContent = got.join("");
        if (got.length === W.length) { msgOk($("#msg"), "MESSAGGIO RICOSTRUITO"); later(WIN, 700); } }
      else { got = []; $$("#pk button").forEach(x => x.disabled = false); $("#rec").textContent = ""; errore($("#msg"), "ORDINE SBAGLIATO — PACCHETTI RIMESCOLATI", $("#pk")); } };
  }
};
E.whack = {
  brief: p => `Il nemico sta inviando pacchetti malevoli! Toccate i <b>pacchetti rossi</b> prima che spariscano. Non toccate quelli <b>verdi</b> (traffico legittimo): ogni errore toglie 2 punti. Fate <b>${p.target} punti</b> in ${p.sec} secondi.`,
  info: () => `Tenete gli occhi al centro della griglia: vedrete meglio i lampi ai lati. Meglio lasciar perdere un pacchetto che colpirne uno verde.`,
  render(g, p) {
    g.innerHTML = `<div class="row" style="justify-content:space-between"><span class="lbl" id="pt">PUNTI 0/${p.target}</span><span class="led" id="led" style="font-size:22px">${p.sec}s</span></div><div class="wk" id="wk">${Array.from({ length: 9 }, (_, i) => `<button data-i="${i}"></button>`).join("")}</div><div class="center"><button class="pri" id="go">INIZIA</button></div><div class="msg center" id="msg"></div>`;
    let pts = 0, left = 0, live = false; const cells = $$("#wk button"), state = Array(9).fill(0);
    const set = (i, v) => { state[i] = v; cells[i].className = v === 1 ? "bad" : v === 2 ? "good" : ""; cells[i].textContent = v === 1 ? "☠" : v === 2 ? "✉" : ""; };
    const spawn = () => { if (!live) return; const free = [...Array(9).keys()].filter(i => !state[i]); if (free.length) { const i = pick(free), v = Math.random() < .7 ? 1 : 2; set(i, v); later(() => { if (state[i] === v) set(i, 0); }, p.vita); } later(spawn, rint(350, 650)); };
    const start = () => { clearTimers(); pts = 0; left = p.sec; live = true; cells.forEach((_, i) => set(i, 0)); $("#go").style.display = "none"; $("#msg").textContent = ""; $("#pt").textContent = `PUNTI 0/${p.target}`; spawn();
      every(() => { left--; $("#led").textContent = left + "s"; if (left <= 0) { live = false; clearTimers(); cells.forEach((_, i) => set(i, 0)); errore($("#msg"), `TEMPO SCADUTO (${pts} punti)`); $("#go").style.display = ""; $("#go").textContent = "RIPROVA"; } }, 1000); };
    $("#wk").onclick = e => { const b = e.target.closest("button"); if (!b || !live) return; const i = +b.dataset.i;
      if (state[i] === 1) { pts++; sfx.key(); } else if (state[i] === 2) { pts = Math.max(0, pts - 2); sfx.err(); } else return; set(i, 0); $("#pt").textContent = `PUNTI ${pts}/${p.target}`;
      if (pts >= p.target) { live = false; clearTimers(); cells.forEach((_, k) => set(k, 0)); msgOk($("#msg"), "ATTACCO RESPINTO"); later(WIN, 600); } };
    $("#go").onclick = start;
  }
};
E.campo = {
  brief: p => `Una scansione delle porte del server nemico: ${p.n * p.n} porte, di cui <b>${p.mine} sono trappole</b> (honeypot). Toccate una porta per scansionarla: il numero indica quante trappole ci sono nelle 8 porte vicine. Scansionate tutte le porte sicure. Tenete premuto (o usate la modalità bandiera) per segnare una trappola.`,
  info: () => `È come il Campo Minato. Un "1" vicino a una sola casella coperta significa che quella è una trappola. Uno "0" apre automaticamente le caselle vicine. La prima porta che toccate è sempre sicura.`,
  render(g, p) {
    const N = p.n; let mines = null, open = Array(N * N).fill(false), flag = Array(N * N).fill(false), fine = false, flagMode = false;
    const nb = i => { const y = Math.floor(i / N), x = i % N, o = []; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { if (!a && !b) continue; const ny = y + a, nx = x + b; if (ny >= 0 && nx >= 0 && ny < N && nx < N) o.push(ny * N + nx); } return o; };
    const cnt = i => nb(i).filter(j => mines[j]).length;
    g.innerHTML = `<div class="center" style="margin-bottom:8px"><button id="fm">⚑ MODALITÀ BANDIERA: NO</button></div><div class="ms" id="ms" style="grid-template-columns:repeat(${N},1fr)"></div><div class="msg center" id="msg"></div>`;
    const place = first => { mines = Array(N * N).fill(false); const safe = new Set([first, ...nb(first)]); shuffle([...Array(N * N).keys()].filter(i => !safe.has(i))).slice(0, p.mine).forEach(i => mines[i] = true); window.__mines = () => mines.slice(); };
    const flood = i => { if (open[i] || flag[i]) return; open[i] = true; if (cnt(i) === 0) nb(i).forEach(flood); };
    const draw = () => { $("#ms").innerHTML = open.map((o, i) => `<button data-i="${i}" class="${o ? "op" : ""} ${fine === "boom" && mines[i] ? "mine" : ""}">${o ? (cnt(i) || "") : flag[i] ? "⚑" : fine === "boom" && mines[i] ? "☠" : ""}</button>`).join("");
      if (!fine && mines && open.filter(Boolean).length === N * N - p.mine) { fine = true; msgOk($("#msg"), "SCANSIONE COMPLETATA"); later(WIN, 700); } };
    const act = (i, asFlag) => { if (fine) return; if (open[i]) return;
      if (asFlag) { flag[i] = !flag[i]; sfx.key(); return draw(); } if (flag[i]) return;
      if (!mines) place(i);
      if (mines[i]) { fine = "boom"; draw(); errore($("#msg"), "TRAPPOLA! L'ALLARME È SCATTATO", $("#ms")); g.insertAdjacentHTML("beforeend", '<div class="center"><button class="pri" id="again">RIPROVA</button></div>'); $("#again").onclick = () => E.campo.render(g, p); return; }
      flood(i); sfx.key(); draw(); };
    let pressT = null, longp = false;
    $("#ms").addEventListener("pointerdown", e => { const b = e.target.closest("button"); if (!b) return; longp = false; pressT = setTimeout(() => { longp = true; act(+b.dataset.i, true); }, 450); });
    $("#ms").addEventListener("pointerup", () => clearTimeout(pressT));
    $("#ms").addEventListener("click", e => { const b = e.target.closest("button"); if (!b || longp) return; act(+b.dataset.i, flagMode); });
    $("#ms").addEventListener("contextmenu", e => { e.preventDefault(); const b = e.target.closest("button"); if (b && !longp) act(+b.dataset.i, true); });
    $("#fm").onclick = () => { flagMode = !flagMode; $("#fm").textContent = "⚑ MODALITÀ BANDIERA: " + (flagMode ? "SÌ" : "NO"); $("#fm").classList.toggle("pri", flagMode); };
    draw();
  }
};
E.labirinto = {
  brief: p => `Siete un pacchetto dati dentro la rete nemica. Raggiungete il <b>server bersaglio</b> (◎) partendo dall'ingresso (▣). Usate le frecce (o i tasti freccia).${p.nebbia ? " La rete è oscurata: vedete solo le zone vicine e quelle già esplorate." : ""}`,
  info: () => `Regola della mano destra: tenete sempre un muro alla vostra destra e prima o poi uscirete. Funziona in ogni labirinto senza isole.`,
  render(g, p) {
    const N = p.n, wall = Array.from({ length: N * N }, () => [1, 1, 1, 1]), seen = Array(N * N).fill(false), st = [0]; seen[0] = true; // N E S W
    const D = [[-1, 0, 0, 2], [0, 1, 1, 3], [1, 0, 2, 0], [0, -1, 3, 1]];
    while (st.length) { const c = st[st.length - 1], y = Math.floor(c / N), x = c % N, o = shuffle(D).filter(([a, b]) => { const ny = y + a, nx = x + b; return ny >= 0 && nx >= 0 && ny < N && nx < N && !seen[ny * N + nx]; });
      if (!o.length) { st.pop(); continue; } const [a, b, w, ow] = o[0], n = (y + a) * N + x + b; wall[c][w] = 0; wall[n][ow] = 0; seen[n] = true; st.push(n); }
    let pos = 0, fine = false; const goal = N * N - 1, vis = Array(N * N).fill(false);
    g.innerHTML = `<div class="mz" id="mz" style="grid-template-columns:repeat(${N},1fr)"></div><div class="arrows"><span></span><button data-d="0">▲</button><span></span><button data-d="3">◄</button><button data-d="2">▼</button><button data-d="1">►</button></div><div class="msg center" id="msg"></div>`;
    const draw = () => { const py = Math.floor(pos / N), px = pos % N; vis[pos] = true;
      $("#mz").innerHTML = wall.map((w, i) => { const y = Math.floor(i / N), x = i % N, near = Math.abs(y - py) <= 1 && Math.abs(x - px) <= 1, hid = p.nebbia && !near && !vis[i];
        return `<div class="${hid ? "fog" : ""}" style="border-top:${w[0] ? 2 : 0}px solid var(--g);border-right:${w[1] ? 2 : 0}px solid var(--g);border-bottom:${w[2] ? 2 : 0}px solid var(--g);border-left:${w[3] ? 2 : 0}px solid var(--g)">${i === pos ? "▣" : i === goal ? "◎" : ""}</div>`; }).join("");
      if (!fine && pos === goal) { fine = true; msgOk($("#msg"), "SERVER RAGGIUNTO"); later(WIN, 600); } };
    const move = d => { if (fine || wall[pos][d]) return; pos += [-N, 1, N, -1][d]; sfx.key(); draw(); };
    g.querySelector(".arrows").onclick = e => { const b = e.target.closest("button"); if (b) move(+b.dataset.d); };
    document.onkeydown = e => { const k = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key]; if (k !== undefined) { e.preventDefault(); move(k); } };
    window.__maze = () => { pos = goal; draw(); };
    draw();
  }
};

/* ---------------- ANALISI ---------------- */
const hms = s => [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(x => String(x).padStart(2, "0")).join(":");
function logUI(g, rows, label, check, nrm, ph) {
  g.innerHTML = `<div class="flt"><input id="flt" placeholder="filtro: scrivi per cercare" autocomplete="off" autocapitalize="none"><button id="clr">✕</button></div>
    <div class="logs" id="logs">${rows.map(r => `<div class="${r.c || ""}">${esc(r.t)}</div>`).join("")}</div><div class="lbl" style="margin-top:12px">${label}</div>` + rispostaHTML(ph);
  const rs = $$("#logs div"), apply = () => { const q = $("#flt").value.trim().toLowerCase(); rs.forEach(r => r.style.display = !q || r.textContent.toLowerCase().includes(q) ? "" : "none"); };
  $("#flt").addEventListener("input", apply); $("#clr").onclick = () => { $("#flt").value = ""; apply(); };
  $("#logs").onclick = e => { const r = e.target.closest("#logs div"); if (r) r.classList.toggle("mk"); };
  legaRisposta(check, nrm);
}
E.log = {
  brief: p => ({
    brute: `Il SOC ha estratto il registro degli accessi. L'intruso: <b>1)</b> ha sbagliato la password <b>almeno 3 volte</b> prima di entrare; <b>2)</b> usa un <b>IP esterno</b> (quelli interni iniziano con 10. o 192.168.); <b>3)</b> una volta dentro ha scaricato file da <b>/classified</b>. Trovate il suo IP.`,
    esfiltra: `Qualcuno sta portando fuori dati. Il colpevole ha trasferito <b>più di 500 MB in totale</b> verso l'esterno <b>fuori dall'orario di lavoro</b> (prima delle 08:00 o dopo le 19:00). Trovate il suo nome utente.`,
    viaggio: `Un account è stato rubato: ha fatto accesso da <b>due paesi diversi a meno di 2 ore di distanza</b>, cosa impossibile per una persona sola. Trovate il nome utente.`
  })[p.tipo],
  info: p => ({ brute: "Scrivete <b>classified</b> nel filtro: vedrete pochi IP. Poi filtrate ognuno di quegli IP e verificate le 3 condizioni.", esfiltra: "Filtrate per nome utente e sommate i MB delle righe con orario notturno. Attenzione a chi trasferisce tanto ma di giorno.", viaggio: "Filtrate per nome utente e guardate i paesi e gli orari. Spostarsi da un paese all'altro richiede molte ore." })[p.tipo] + " Toccando una riga la evidenziate.",
  render(g, p) {
    const used = new Set(), uniq = f => { let v; do v = f(); while (used.has(v)); used.add(v); return v; };
    const ext = () => uniq(() => pick([185, 91, 203, 45, 77, 103, 154, 212]) + "." + rint(1, 254) + "." + rint(1, 254) + "." + rint(2, 254));
    const int = () => uniq(() => Math.random() < .5 ? "10.0." + rint(0, 9) + "." + rint(2, 250) : "192.168.1." + rint(2, 250));
    const users = shuffle(["mrossi", "gneri", "sferri", "acosta", "pgalli", "lmarino", "fbruno", "ccolombo", "dricci", "egreco", "vleone", "tmancini"]);
    const ev = [];
    if (p.tipo === "brute") {
      const files = ["piano.pdf", "sat.db", "rete.xls", "agenti.csv"], cls = () => "/classified/" + pick(files);
      const sess = (ip, fails, ok, paths, u) => { let t = rint(0, 5 * 3600); for (let i = 0; i < fails; i++) { ev.push([t, `${hms(t)} ${ip.padEnd(15)} LOGIN_FAIL ${u}`, "fail"]); t += rint(5, 40); }
        if (ok === "ban") return ev.push([t, `${hms(t)} ${ip.padEnd(15)} BLOCCATO`, "ban"]); ev.push([t, `${hms(t)} ${ip.padEnd(15)} LOGIN_OK ${u}`, "okk"]); t += rint(30, 200); paths.forEach(q => { ev.push([t, `${hms(t)} ${ip.padEnd(15)} GET ${q}`, "get"]); t += rint(20, 300); }); };
      const A = ext(); sess(A, rint(3, 4), 1, [cls(), cls()], "admin"); sess(ext(), 5, "ban", [], "admin"); sess(ext(), 1, 1, [cls()], users[0]); sess(int(), 3, 1, [cls()], users[1]); sess(ext(), 3, 1, ["/pubblico/news.html"], "guest");
      users.slice(2, 7).forEach(u => sess(int(), Math.random() < .3 ? 1 : 0, 1, [pick(["/intranet/mensa", "/intranet/turni.pdf", "/posta/inbox"])], u));
      ev.sort((a, b) => a[0] - b[0]); window.__ans = () => A;
      return logUI(g, ev.map(e => ({ t: e[1], c: e[2] })), "IP DELL'INTRUSO", v => v === A, s => String(s || "").replace(/\s/g, "").replace(/,/g, "."), "es. 1.2.3.4");
    }
    if (p.tipo === "esfiltra") {
      const U = users.slice(0, 7), A = U[0], tx = (u, t, mb) => ev.push([t, `${hms(t)} ${u.padEnd(9)} UPLOAD ${String(mb).padStart(4)} MB -> ${pick(["cloud-drive.net", "mega-files.io", "dropzone.cc", "backup-x.org"])}`]);
      const night = () => pick([rint(0, 7 * 3600), rint(19 * 3600 + 60, 23 * 3600 + 3000)]), day = () => rint(8 * 3600 + 60, 18 * 3600 + 3000);
      [220, 180, 160].forEach(mb => tx(A, night(), mb + rint(0, 30)));
      tx(U[1], day(), 400); tx(U[1], day(), 380);                         // tanto ma di giorno
      tx(U[2], night(), 150); tx(U[2], night(), 120); tx(U[2], day(), 300); // di notte meno di 500
      tx(U[3], night(), 480);                                               // 480 di notte: non basta
      U.slice(4).forEach(u => { for (let k = 0; k < 3; k++) tx(u, Math.random() < .3 ? night() : day(), rint(5, 90)); });
      ev.sort((a, b) => a[0] - b[0]); window.__ans = () => A;
      return logUI(g, ev.map(e => ({ t: e[1], c: "get" })), "NOME UTENTE", v => v === norm(A), null, "es. mrossi");
    }
    // viaggio
    const C = ["ITALIA", "FRANCIA", "GERMANIA", "SPAGNA", "OLANDA", "RUSSIA", "BRASILE", "CINA", "USA", "GIAPPONE"];
    const U = users.slice(0, 7), A = U[0], lg = (u, t, c) => ev.push([t, `${hms(t)} LOGIN ${u.padEnd(9)} da ${c}`]);
    const t0 = rint(8 * 3600, 12 * 3600); lg(A, t0, "ITALIA"); lg(A, t0 + rint(40, 100) * 60, pick(["BRASILE", "CINA", "RUSSIA"])); lg(A, t0 + 5 * 3600, "ITALIA");
    const t1 = rint(6 * 3600, 9 * 3600); lg(U[1], t1, "ITALIA"); lg(U[1], t1 + rint(9, 11) * 3600, "USA");          // lontani nel tempo: possibile
    lg(U[2], t1 + 1800, "FRANCIA"); lg(U[2], t1 + 1800 + rint(50, 100) * 60, "FRANCIA");                              // stesso paese
    U.slice(3).forEach(u => { const c = pick(["ITALIA", "ITALIA", "SPAGNA", "GERMANIA"]); for (let k = 0; k < 3; k++) lg(u, rint(7 * 3600, 20 * 3600), c); });
    ev.sort((a, b) => a[0] - b[0]); window.__ans = () => A;
    logUI(g, ev.map(e => ({ t: e[1], c: "okk" })), "NOME UTENTE", v => v === norm(A), null, "es. mrossi");
  }
};
E.phishing = {
  brief: () => `Sono arrivate queste e-mail. Selezionate <b>tutte e sole</b> quelle di <b>phishing</b> (truffe che vogliono rubare credenziali o installare virus), poi premete VERIFICA.`,
  info: () => `Controllate il <b>dominio del mittente</b> e del link (lettere scambiate, domini strani o aggiunti dopo il nome vero), la <b>fretta</b> ("entro 24 ore!"), le richieste di <b>password o pagamenti</b>, gli <b>allegati eseguibili</b> (.exe, .zip, .js). Il nome vero deve stare subito prima di .it/.com.`,
  render(g, p) {
    const items = shuffle(p.mail.map((m, i) => Object.assign({ i }, m)));
    g.innerHTML = items.map((m, k) => `<label class="mail"><input type="checkbox" data-k="${k}"><span><b>${esc(m.da)}</b><br>${esc(m.ogg)}<br><small>${esc(m.det)}</small></span></label>`).join("") + `<button class="pri" id="ver" style="width:100%;margin-top:8px">VERIFICA</button><div class="msg" id="msg"></div>`;
    $("#ver").onclick = () => { const sel = $$(".mail input").map(c => c.checked), wrong = items.filter((m, k) => !!m.ph !== sel[k]).length;
      if (!wrong) { msgOk($("#msg"), "CORRETTO: MINACCE BLOCCATE"); later(WIN, 600); } else errore($("#msg"), `Ci sono ${wrong} errori. Riprovate.`); };
    window.__ph = () => items.map(m => !!m.ph);
  }
};
E.password = {
  brief: p => `Il sistema accetta solo password che rispettano la policy:<ul class="cond">${p.regole.map(r => `<li>${r}</li>`).join("")}</ul>Toccate l'<b>unica</b> password valida.`,
  info: () => `Controllate le regole una alla volta ed eliminate le password che ne violano almeno una.`,
  render(g, p) {
    const items = shuffle(p.lista.map((x, i) => ({ x, ok: i === 0 })));
    g.innerHTML = `<div class="pwl">${items.map((it, k) => `<button data-k="${k}">${esc(it.x)}</button>`).join("")}</div><div class="msg center" id="msg"></div>`;
    g.querySelector(".pwl").onclick = e => { const b = e.target.closest("button"); if (!b) return; if (items[+b.dataset.k].ok) { b.classList.add("ok"); msgOk($("#msg"), "PASSWORD ACCETTATA"); later(WIN, 600); } else { b.disabled = true; errore($("#msg"), "PASSWORD RIFIUTATA"); } };
    window.__pw = () => items.findIndex(i => i.ok);
  }
};
E.sequenze = {
  brief: () => `Il generatore di chiavi di NEMESIS produce numeri secondo regole precise. Trovate il <b>numero successivo</b> di ogni sequenza.`,
  info: p => p.aiuti.map((a, i) => `<b>Sequenza ${i + 1}:</b> ${a}`).join("<br>"),
  render(g, p) {
    g.innerHTML = p.seq.map((s, i) => `<div class="box"><div class="lbl">SEQUENZA ${i + 1}</div><div class="cipher">${s[0].join(", ")}, ?</div><input data-i="${i}" inputmode="numeric" autocomplete="off"></div>`).join("") + `<button class="pri" id="go" style="width:100%">VERIFICA</button><div class="msg" id="msg"></div>`;
    $("#go").onclick = () => { const ins = $$("#game input[data-i]"), wrong = ins.filter(x => x.value.trim() !== String(p.seq[+x.dataset.i][1]));
      if (!wrong.length) { msgOk($("#msg"), "CHIAVI GENERATE"); later(WIN, 600); } else errore($("#msg"), `${wrong.length} risposta/e errata/e`); };
  }
};
E.checksum = {
  brief: p => `Ecco i file scaricati dal server. Un file è corrotto: il suo <b>codice di controllo</b> non rispetta la regola. Regola: ${p.regola === "sette" ? "<b>la somma di tutte le cifre del codice deve essere un multiplo di 7</b>" : "<b>l'ultima cifra deve essere uguale alla somma delle altre cifre, considerando solo l'ultima cifra della somma</b> (es. 3-4-5 → 12 → 2)"}. Toccate il file corrotto.`,
  info: p => p.regola === "sette" ? "Multipli di 7: 7, 14, 21, 28, 35, 42, 49, 56, 63..." : "Esempio: 5 8 2 7 → 5+8+2 = 15 → l'ultima cifra deve essere 5, ma è 7: corrotto.",
  render(g, p) {
    const gen = good => { for (;;) { const d = Array.from({ length: 6 }, () => rint(0, 9)); if (p.regola === "sette") { const s = d.reduce((a, b) => a + b, 0); if ((s % 7 === 0) === good) return d.join(""); } else { const s = d.slice(0, 5).reduce((a, b) => a + b, 0) % 10; d[5] = good ? s : (s + rint(1, 9)) % 10; return d.join(""); } } };
    const names = shuffle(["piano_attacco.pdf", "chiavi.key", "satelliti.db", "agenti.csv", "mappa.png", "rete.xls", "codici.txt", "drone.cfg"]);
    const bad = rint(0, 7), items = names.map((n, i) => ({ n, c: gen(i !== bad), bad: i === bad }));
    g.innerHTML = `<div class="pwl">${items.map((it, k) => `<button data-k="${k}"><span style="color:var(--dim)">${it.n}</span><br><b style="letter-spacing:4px">${it.c.split("").join(" ")}</b></button>`).join("")}</div><div class="msg center" id="msg"></div>`;
    g.querySelector(".pwl").onclick = e => { const b = e.target.closest("button"); if (!b) return; if (items[+b.dataset.k].bad) { b.classList.add("ok"); msgOk($("#msg"), "FILE CORROTTO ISOLATO"); later(WIN, 600); } else { b.disabled = true; errore($("#msg"), "Questo file è integro."); } };
    window.__cs = () => bad;
  }
};

/* ---------------- INTELLIGENCE ---------------- */
E.dossier = {
  brief: p => `Abbiamo l'account dell'agente nemico <b>${esc(p.agente)}</b> ma non la password. Usate il <b>recupero password</b>: rispondete alle domande di sicurezza usando il <b>fascicolo segreto</b> (nel suggerimento).`,
  info: p => `<b>FASCICOLO SEGRETO — ${esc(p.agente)}</b><ul>${p.fatti.map(f => `<li>${esc(f)}</li>`).join("")}</ul>`,
  render(g, p) {
    g.innerHTML = `<div class="box"><div class="lbl">NEMESIS MAIL — RECUPERO ACCOUNT</div>${p.dom.map((q, i) => `<div class="q"><div class="lbl" style="color:var(--txt)">${i + 1}. ${esc(q[0])}</div><input data-i="${i}" autocomplete="off" autocapitalize="characters" spellcheck="false"></div>`).join("")}
      <button class="pri" id="go" style="width:100%;margin-top:10px">RECUPERA ACCOUNT</button><div class="msg" id="msg"></div></div>`;
    $("#go").onclick = () => { const w = $$("#game input").filter(i => !p.dom[+i.dataset.i][1].split("|").map(norm).includes(norm(i.value)));
      if (!w.length) { msgOk($("#msg"), "ACCOUNT RECUPERATO"); later(WIN, 600); } else errore($("#msg"), `ACCESSO NEGATO — ${w.length} risposta/e errata/e`, $(".box", g)); };
  }
};
E.memory = {
  brief: p => `Abbinate le <b>firme dei virus</b>: girate due carte alla volta e trovate tutte le ${p.coppie} coppie uguali${p.errori ? `. Avete al massimo <b>${p.errori} errori</b>, poi le carte si rimescolano` : ""}.`,
  info: () => `Procedete con ordine (riga per riga) e dite ad alta voce cosa vedete: due memorie sono meglio di una.`,
  render(g, p) {
    const SYM = shuffle(["☢", "☣", "⚠", "⚙", "✉", "☎", "⌘", "⚡", "☠", "⚑", "✈", "⌛", "♞", "☂", "✂", "⚓"]).slice(0, p.coppie);
    let cards, first, lock, found, err;
    const reset = () => { cards = shuffle(SYM.concat(SYM)); first = null; lock = false; found = 0; err = 0; draw(); $("#msg").textContent = ""; };
    g.innerHTML = `<div class="lbl center" id="st"></div><div class="mem" id="mem" style="grid-template-columns:repeat(4,1fr)"></div><div class="msg center" id="msg"></div>`;
    const draw = () => { $("#mem").innerHTML = cards.map((c, i) => `<button data-i="${i}"><span>${c}</span></button>`).join(""); st(); };
    const st = () => $("#st").textContent = `COPPIE ${found}/${p.coppie}` + (p.errori ? ` — ERRORI ${err}/${p.errori}` : "");
    $("#mem").onclick = e => { const b = e.target.closest("button"); if (!b || lock || b.classList.contains("up")) return; b.classList.add("up"); sfx.key();
      if (first === null) { first = b; return; }
      if (cards[+first.dataset.i] === cards[+b.dataset.i]) { first.classList.add("ok"); b.classList.add("ok"); first = null; found++; st(); if (found === p.coppie) { msgOk($("#msg"), "FIRME ABBINATE"); later(WIN, 600); } }
      else { lock = true; err++; st(); const a = first; first = null; later(() => { a.classList.remove("up"); b.classList.remove("up"); lock = false;
        if (p.errori && err >= p.errori) { errore($("#msg"), "TROPPI ERRORI — CARTE RIMESCOLATE"); later(reset, 900); } }, 800); } };
    window.__mem = () => cards.slice();
    reset();
  }
};
E.simon = {
  brief: p => `Per agganciare il satellite serve un handshake. Il sistema mostra una sequenza di segnali: <b>ripetetela</b>. Ogni turno si allunga di uno. Arrivate a <b>${p.len} segnali</b>. Se sbagliate si riparte da capo.`,
  info: () => `Dividetevi i colori: ognuno memorizza solo quando compare il suo. Ripetete la sequenza a voce mentre la guardate.`,
  render(g, p) {
    const P = [{ c: "#22c55e", f: 415 }, { c: "#ef4444", f: 310 }, { c: "#facc15", f: 252 }, { c: "#3b82f6", f: 209 }, { c: "#a855f7", f: 466 }, { c: "#f97316", f: 349 }].slice(0, p.pads);
    g.innerHTML = `<div class="center"><div class="lbl" id="lvl">LIVELLO 0/${p.len}</div><div class="simon" id="sm" style="grid-template-columns:repeat(${p.pads > 4 ? 3 : 2},1fr)">${P.map((x, i) => `<button data-i="${i}" style="background:${x.c};border-color:${x.c};color:${x.c}"><span style="color:#000">${i + 1}</span></button>`).join("")}</div>
      <button class="pri" id="st">AVVIA HANDSHAKE</button><div class="msg" id="msg"></div></div>`;
    const btns = $$("#sm button"); let seq = [], pos = 0, input = false;
    const flash = (i, d) => { btns[i].classList.add("lit"); tone(P[i].f, d / 1000, "triangle", 0.12); later(() => btns[i].classList.remove("lit"), d); };
    const msg = (t, c) => { $("#msg").className = "msg " + (c || ""); $("#msg").textContent = t; };
    const show = () => { input = false; pos = 0; $("#lvl").textContent = `LIVELLO ${seq.length}/${p.len}`; msg("OSSERVATE..."); const sp = Math.max(330, p.vel - seq.length * 25);
      seq.forEach((s, k) => later(() => flash(s, sp * .7), 600 + k * sp)); later(() => { input = true; msg("TOCCA A VOI", "warn"); }, 600 + seq.length * sp); };
    const press = i => { if (!input) return; flash(i, 220);
      if (i !== seq[pos]) { input = false; errore(null); msg("HANDSHAKE FALLITO — RIPROVATE", "err"); $("#st").style.visibility = "visible"; $("#st").textContent = "RIPROVA"; return; }
      if (++pos === seq.length) { input = false; if (seq.length >= p.len) { msg("SATELLITE AGGANCIATO", "ok"); later(WIN, 800); return; } seq.push(rint(0, p.pads - 1)); later(show, 700); } };
    $("#st").onclick = () => { ac(); clearTimers(); seq = [rint(0, p.pads - 1)]; $("#st").style.visibility = "hidden"; show(); };
    $("#sm").onclick = e => { const b = e.target.closest("button"); if (b) press(+b.dataset.i); };
    document.onkeydown = e => { const k = +e.key; if (k >= 1 && k <= p.pads) press(k - 1); };
    window.__simon = () => ({ seq, input });
  }
};
E.slide = {
  brief: p => `Il chip di decrittazione è stato smontato. Fate scorrere i pezzi nello spazio vuoto per ${p.parola ? `formare la parola <b>riga per riga</b>` : "rimettere i numeri <b>in ordine da 1 a 8</b>"}, con lo spazio vuoto in basso a destra.`,
  info: p => `Sistemate prima la riga in alto, poi la colonna a sinistra: il resto diventa un piccolo 2×2 da far girare.${p.parola ? ` La parola da formare è <b>${p.parola}</b>.` : ""}`,
  render(g, p) {
    const T = p.parola ? p.parola.split("") : ["1", "2", "3", "4", "5", "6", "7", "8"], goal = T.concat([""]); let b = goal.slice(), e = 8, last = -1, fine = false;
    const nbs = i => [i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1].filter(x => x >= 0 && x < 9);
    for (let k = 0; k < 60; k++) { const n = pick(nbs(e).filter(x => x !== last)); last = e; [b[e], b[n]] = [b[n], b[e]]; e = n; }
    if (b.join() === goal.join()) { const n = nbs(e)[0]; [b[e], b[n]] = [b[n], b[e]]; e = n; }
    g.innerHTML = `<div class="sl" id="sl"></div><div class="msg center" id="msg"></div>`;
    const draw = () => { $("#sl").innerHTML = b.map((c, i) => `<button data-i="${i}" class="${c ? "" : "empty"}">${c}</button>`).join(""); if (!fine && b.join() === goal.join()) { fine = true; msgOk($("#msg"), "CHIP RICOMPOSTO"); later(WIN, 600); } };
    $("#sl").onclick = ev => { const x = ev.target.closest("button"); if (!x || fine) return; const i = +x.dataset.i; if (!nbs(e).includes(i)) return; [b[e], b[i]] = [b[i], b[e]]; e = i; sfx.key(); draw(); };
    window.__slide = () => { b = goal.slice(); e = 8; draw(); };
    draw();
  }
};
