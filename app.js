/* IngDeNova — motore del sito. Non serve modificarlo per aggiornare i contenuti. */
(function () {
  "use strict";

  /* ---------- Testi dell'interfaccia ---------- */
  const UI = {
    it: {
      home: "Home", referenze: "Referenze", contatti: "Contatti", chiSono: "Chi sono",
      percorso: "Percorso", esperienza: "Esperienza", formazione: "Formazione e abilitazioni",
      lingue: "Lingue", vediFoto: "Vedi le foto", sottoPercorso: "Dodici anni tra studio tecnico, cantiere e ricerca.",
      indietro: "Indietro", tutteLeSezioni: "Tutte le sezioni",
      foto: "foto", unaFoto: "foto", raccolte: "raccolte", unaRaccolta: "raccolta",
      tocca: "Tocca una foto per ingrandirla", fotoInArrivo: "Fotografie in arrivo.",
      periodo: "Periodo", software: "Strumenti", colleghi: "Con", link: "Link",
      responsabile: "Responsabile su LinkedIn", azienda: "Pagina aziendale",
      email: "Email", telefono: "Telefono", indirizzo: "Studio", linkedin: "LinkedIn",
      cv: "Curriculum in PDF", scarica: "Scarica",
      chiudi: "Chiudi", precedente: "Foto precedente", successiva: "Foto successiva",
      suggerimento: "Pizzica per ingrandire, scorri per cambiare foto",
      titoloHome: "Portfolio", noSezione: "Sezione non trovata.", noProgetto: "Progetto non trovato."
    },
    en: {
      home: "Home", referenze: "References", contatti: "Contact", chiSono: "About me",
      percorso: "Career", esperienza: "Experience", formazione: "Education and credentials",
      lingue: "Languages", vediFoto: "See the photos", sottoPercorso: "Twelve years across technical practice, construction sites and research.",
      indietro: "Back", tutteLeSezioni: "All sections",
      foto: "photos", unaFoto: "photo", raccolte: "collections", unaRaccolta: "collection",
      tocca: "Tap a photo to enlarge it", fotoInArrivo: "Photos coming soon.",
      periodo: "Period", software: "Tools", colleghi: "With", link: "Links",
      responsabile: "Manager on LinkedIn", azienda: "Company page",
      email: "Email", telefono: "Phone", indirizzo: "Office", linkedin: "LinkedIn",
      cv: "CV as PDF", scarica: "Download",
      chiudi: "Close", precedente: "Previous photo", successiva: "Next photo",
      suggerimento: "Pinch to zoom, swipe to change photo",
      titoloHome: "Portfolio", noSezione: "Section not found.", noProgetto: "Project not found."
    }
  };

  /* ---------- Lingua ---------- */
  let lingua = (function () {
    try { const s = localStorage.getItem("lingua"); if (s === "it" || s === "en") return s; } catch (e) {}
    return (navigator.language || "it").toLowerCase().startsWith("it") ? "it" : "en";
  })();
  const t = (k) => UI[lingua][k] || k;
  const tx = (v) => (v == null ? "" : typeof v === "string" ? v : (v[lingua] || v.it || v.en || ""));

  function impostaLingua(l) {
    lingua = l;
    try { localStorage.setItem("lingua", l); } catch (e) {}
    document.documentElement.lang = l;
    render();
  }

  /* ---------- Utilità ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nl = (s) => esc(s).replace(/\n/g, "<br>");
  const pad = (n) => String(n).padStart(2, "0");
  const base = () => SITO.cartellaImmagini.replace(/\/?$/, "/");
  const urlFoto = (p, n) => base() + p.cartella + "/" + p.cartella + pad(n) + "." + (p.formato || "jpg");
  const urlCopertinaSezione = (s) => (s.copertina ? base() + s.copertina : "");
  const progettiDi = (id) => PROGETTI.filter((p) => p.sezione === id);
  const sezioneDi = (id) => SEZIONI.find((s) => s.id === id);
  const progettoDi = (c) => PROGETTI.find((p) => p.cartella === c);
  const plur = (n, uno, molti) => n + " " + (n === 1 ? t(uno) : t(molti));

  /* ---------- Intestazione (cartiglio) ---------- */
  function renderMenu(rotta) {
    const nav = [
      { href: "#/", testo: t("home"), attiva: rotta.tipo === "home" },
      ...SEZIONI.map((s) => ({ href: "#/s/" + s.id, testo: tx(s.titoloBreve || s.titolo), attiva: rotta.sezione === s.id })),
      { href: "#/percorso", testo: t("percorso"), attiva: rotta.tipo === "percorso" },
      { href: "#/referenze", testo: t("referenze"), attiva: rotta.tipo === "referenze" },
      { href: "#/contatti", testo: t("contatti"), attiva: rotta.tipo === "contatti" }
    ];
    return nav.map((v) => `<a href="${v.href}"${v.attiva ? ' aria-current="page"' : ""}>${esc(v.testo)}</a>`).join("");
  }

  function renderCartiglio() {
    return `
      <div class="cartiglio-griglia">
        <div class="cella cella-nome">
          <a href="#/">${esc(SITO.nome)}<small>${esc(SITO.marchio)}</small></a>
        </div>
        <div class="cella cella-qualifica">${nl(tx(SITO.qualifica))}</div>
        <div class="cella cella-sede">${nl(tx(SITO.sede))}</div>
        <div class="cella cella-lingua ultima" role="group" aria-label="Lingua / Language">
          <button type="button" data-lingua="it" aria-pressed="${lingua === "it"}" lang="it">IT</button>
          <button type="button" data-lingua="en" aria-pressed="${lingua === "en"}" lang="en">EN</button>
        </div>
      </div>`;
  }

  /* ---------- Pagine ---------- */
  function paginaHome() {
    const tessere = SEZIONI.map((s) => {
      const ps = progettiDi(s.id);
      const nFoto = ps.reduce((a, p) => a + (p.foto || 0), 0);
      const cop = urlCopertinaSezione(s);
      const figura = cop
        ? `<div class="figura"><img src="${esc(cop)}" alt="" loading="lazy"></div>`
        : `<div class="figura gialla"><h2>${esc(tx(s.titolo))}</h2></div>`;
      return `
        <a class="tessera" href="#/s/${esc(s.id)}">
          ${figura}
          <div class="testo">
            ${cop ? `<h2>${esc(tx(s.titolo))}</h2>` : ""}
            <p class="sotto">${esc(tx(s.sottotitolo))}</p>
            <p class="conta">${plur(ps.length, "unaRaccolta", "raccolte")}${nFoto ? ", " + plur(nFoto, "unaFoto", "foto") : ""}</p>
          </div>
        </a>`;
    }).join("");
    return `
      <div class="sezioni">${tessere}</div>
      <section class="pagina">
        <div class="testata"><h1>${esc(t("chiSono"))}</h1></div>
        <p class="prosa">${esc(tx(SITO.presentazione))}</p>
      </section>`;
  }

  function paginaSezione(id) {
    const s = sezioneDi(id);
    if (!s) return `<p class="prosa">${esc(t("noSezione"))}</p>`;
    const intere = s.anteprime === "intere" ? " intera" : "";
    const voci = progettiDi(id).map((p) => {
      const n = p.foto || 0;
      const figura = n
        ? `<div class="figura${intere}"><img src="${esc(urlFoto(p, Math.min(p.copertina || 1, n)))}" alt="" loading="lazy"></div>`
        : `<div class="figura vuota"><span>${esc(t("fotoInArrivo"))}</span></div>`;
      const conta = [p.periodo, n ? plur(n, "unaFoto", "foto") : ""].filter(Boolean).join(", ");
      return `
        <a class="voce" href="#/p/${esc(p.cartella)}">
          ${figura}
          <div class="testo">
            <h3>${esc(tx(p.titolo))}</h3>
            ${conta ? `<p class="conta">${esc(conta)}</p>` : ""}
          </div>
        </a>`;
    }).join("");
    return `
      <a class="torna" href="#/">← ${esc(t("tutteLeSezioni"))}</a>
      <div class="testata">
        <h1>${esc(tx(s.titolo))}</h1>
        <p class="sotto">${esc(tx(s.sottotitolo))}</p>
      </div>
      <div class="griglia">${voci}</div>`;
  }

  function paginaProgetto(cartella) {
    const p = progettoDi(cartella);
    if (!p) return `<p class="prosa">${esc(t("noProgetto"))}</p>`;
    const s = sezioneDi(p.sezione);
    const n = p.foto || 0;
    const righe = [];
    if (p.periodo) righe.push([t("periodo"), esc(tx(p.periodo))]);
    if (p.software) righe.push([t("software"), esc(tx(p.software))]);
    if (p.colleghi) righe.push([t("colleghi"), esc(tx(p.colleghi))]);
    if (p.link && p.link.length) {
      righe.push([t("link"), `<ul>${p.link.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(tx(l.testo))}</a></li>`).join("")}</ul>`]);
    }
    const dettagli = righe.length
      ? `<dl class="dettagli">${righe.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join("")}</dl>`
      : "";
    let foto = "";
    if (n) {
      const items = [];
      for (let i = 1; i <= n; i++) {
        items.push(`<button type="button" data-foto="${i}" aria-label="${esc(tx(p.titolo))} ${i}/${n}">
          <img src="${esc(urlFoto(p, i))}" alt="${esc(tx(p.titolo))} — ${i}/${n}" loading="${i <= 2 ? "eager" : "lazy"}" decoding="async"></button>`);
      }
      const intere = s && s.anteprime === "intere" ? " intere" : "";
      foto = `<p class="avviso-foto">${esc(t("tocca"))}</p><div class="foto${n === 1 ? " singola" : ""}${intere}">${items.join("")}</div>`;
    } else {
      foto = `<p class="avviso-foto">${esc(t("fotoInArrivo"))}</p>`;
    }
    return `
      <a class="torna" href="#/s/${esc(p.sezione)}">← ${esc(s ? tx(s.titolo) : t("indietro"))}</a>
      <div class="testata">
        <h1>${esc(tx(p.titolo))}</h1>
      </div>
      <div class="scheda">
        <p class="prosa">${esc(tx(p.descrizione))}</p>
        ${dettagli}
      </div>
      ${foto}`;
  }

  function paginaPercorso() {
    const tappe = ESPERIENZE.map((e) => {
      const atti = (tx(e.attivita) || []).map((a) => `<li>${esc(a)}</li>`).join("");
      const p = progettoDi(e.vedi);
      return `
        <article class="tappa">
          <p class="quando">${esc(tx(e.periodo))}</p>
          <div class="cosa">
            <h3>${esc(tx(e.ruolo))}</h3>
            <p class="dove">${esc(tx(e.ente))}${e.luogo ? " · " + esc(tx(e.luogo)) : ""}</p>
            <ul>${atti}</ul>
            ${p && p.foto ? `<p class="vedi"><a href="#/p/${esc(p.cartella)}">${esc(t("vediFoto"))}</a></p>` : ""}
          </div>
        </article>`;
    }).join("");
    const titoli = FORMAZIONE.map((f) => `
      <article class="tappa">
        <p class="quando">${esc(tx(f.periodo))}</p>
        <div class="cosa">
          <h3>${esc(tx(f.titolo))}</h3>
          <p class="dove">${esc(tx(f.ente))}</p>
          ${f.nota ? `<p class="nota">${esc(tx(f.nota))}</p>` : ""}
        </div>
      </article>`).join("");
    const lingue = LINGUE.map((l) => `
      <article class="tappa">
        <p class="quando">${esc(tx(l.lingua))}</p>
        <div class="cosa"><p class="dove">${esc(tx(l.livello))}</p></div>
      </article>`).join("");
    return `
      <a class="torna" href="#/">← ${esc(t("home"))}</a>
      <div class="testata">
        <h1>${esc(t("percorso"))}</h1>
        <p class="sotto">${esc(t("sottoPercorso"))}</p>
      </div>
      <h2 class="fascia">${esc(t("esperienza"))}</h2>
      <div class="percorso">${tappe}</div>
      <h2 class="fascia">${esc(t("formazione"))}</h2>
      <div class="percorso">${titoli}</div>
      <h2 class="fascia">${esc(t("lingue"))}</h2>
      <div class="percorso">${lingue}</div>`;
  }

  function paginaReferenze() {
    const voci = REFERENZE.map((r) => `
      <div class="referenza">
        <h3>${esc(r.nome)}</h3>
        <p class="cosa">${esc(tx(r.cosa))}</p>
        <p class="azioni">
          ${r.responsabile ? `<a href="${esc(r.responsabile)}" target="_blank" rel="noopener">${esc(t("responsabile"))}</a>` : ""}
          ${r.azienda ? `<a href="${esc(r.azienda)}" target="_blank" rel="noopener">${esc(t("azienda"))}</a>` : ""}
        </p>
      </div>`).join("");
    return `
      <a class="torna" href="#/">← ${esc(t("home"))}</a>
      <div class="testata"><h1>${esc(t("referenze"))}</h1></div>
      <div class="referenze">${voci}</div>`;
  }

  function paginaContatti() {
    const c = SITO.contatti;
    const tel = (c.telefono || "").replace(/[^\d+]/g, "");
    const voci = [
      c.email && [t("email"), `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`],
      c.telefono && [t("telefono"), `<a href="tel:${esc(tel)}">${esc(c.telefono)}</a>`],
      c.linkedin && [t("linkedin"), `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener">${esc(c.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</a>`],
      c.indirizzo && [t("indirizzo"), nl(tx(c.indirizzo))],
      c.cvPdf && [t("cv"), `<a href="${esc(c.cvPdf)}" download>${esc(t("scarica"))}</a>`]
    ].filter(Boolean);
    return `
      <a class="torna" href="#/">← ${esc(t("home"))}</a>
      <div class="testata"><h1>${esc(t("contatti"))}</h1></div>
      <div class="contatti">
        ${voci.map(([k, v]) => `<div class="contatto"><p class="etichetta">${esc(k)}</p><p class="valore">${v}</p></div>`).join("")}
      </div>`;
  }

  function renderPie() {
    const anno = new Date().getFullYear();
    return `
      <a href="#/percorso">${esc(t("percorso"))}</a>
      <a href="#/referenze">${esc(t("referenze"))}</a>
      <a href="#/contatti">${esc(t("contatti"))}</a>
      <a href="${esc(SITO.contatti.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <span class="copy">© ${anno} ${esc(SITO.nome)}</span>`;
  }

  /* ---------- Rotte ---------- */
  function rottaCorrente() {
    const h = (location.hash || "#/").replace(/^#\/?/, "");
    const parti = h.split("/").filter(Boolean);
    if (!parti.length) return { tipo: "home" };
    if (parti[0] === "s" && parti[1]) return { tipo: "sezione", sezione: decodeURIComponent(parti[1]) };
    if (parti[0] === "p" && parti[1]) {
      const p = progettoDi(decodeURIComponent(parti[1]));
      return { tipo: "progetto", cartella: decodeURIComponent(parti[1]), sezione: p ? p.sezione : "" };
    }
    if (parti[0] === "percorso") return { tipo: "percorso" };
    if (parti[0] === "referenze") return { tipo: "referenze" };
    if (parti[0] === "contatti") return { tipo: "contatti" };
    return { tipo: "home" };
  }

  let progettoAperto = null;

  function render() {
    const r = rottaCorrente();
    let html = "", titolo = SITO.nome;
    progettoAperto = null;
    switch (r.tipo) {
      case "sezione": { const s = sezioneDi(r.sezione); html = paginaSezione(r.sezione); if (s) titolo = tx(s.titolo) + " — " + SITO.nome; break; }
      case "progetto": { const p = progettoDi(r.cartella); html = paginaProgetto(r.cartella); if (p) { titolo = tx(p.titolo) + " — " + SITO.nome; progettoAperto = p; } break; }
      case "percorso": html = paginaPercorso(); titolo = t("percorso") + " — " + SITO.nome; break;
      case "referenze": html = paginaReferenze(); titolo = t("referenze") + " — " + SITO.nome; break;
      case "contatti": html = paginaContatti(); titolo = t("contatti") + " — " + SITO.nome; break;
      default: html = paginaHome(); titolo = SITO.nome + " — " + t("titoloHome");
    }
    document.getElementById("cartiglio").innerHTML = renderCartiglio();
    document.getElementById("menu").innerHTML = renderMenu(r);
    document.getElementById("app").innerHTML = html;
    document.getElementById("pie").innerHTML = renderPie();
    document.title = titolo;
    document.documentElement.lang = lingua;
    const attivo = document.querySelector('#menu a[aria-current="page"]');
    if (attivo && attivo.scrollIntoView) attivo.scrollIntoView({ block: "nearest", inline: "center" });
  }

  /* ---------- Schermo intero: zoom con due dita, scorrimento tra foto ---------- */
  const Schermo = (function () {
    const el = document.getElementById("schermo");
    const tela = el.querySelector(".tela");
    const img = el.querySelector("img");
    const conta = el.querySelector(".conta");
    const bPrec = el.querySelector(".prec");
    const bSucc = el.querySelector(".succ");
    let aperto = false, indice = 1, totale = 1, progetto = null;
    let scala = 1, tx0 = 0, ty0 = 0;           // trasformazione corrente
    let puntatori = new Map();                  // dita attive
    let inizio = null;                          // stato all'inizio del gesto
    let ultimoTocco = 0;

    function applica(anim) {
      if (anim === false) img.classList.add("trascino"); else img.classList.remove("trascino");
      img.style.transform = `translate(${tx0}px, ${ty0}px) scale(${scala})`;
    }
    function limita() {
      // tiene l'immagine dentro lo schermo (l'origine della trasformazione è in alto a sinistra;
      // a scala 1 l'immagine è centrata dal layout)
      const w = img.offsetWidth, h = img.offsetHeight;
      const bw = tela.clientWidth, bh = tela.clientHeight;
      const ox = (bw - w) / 2, oy = (bh - h) / 2;     // posizione naturale (flex center) a scala 1
      const sw = w * scala, sh = h * scala;
      // posizione effettiva in alto a sinistra: ox + tx0 ; larghezza sw
      let minTx, maxTx, minTy, maxTy;
      if (sw <= bw) { minTx = maxTx = (bw - sw) / 2 - ox; } else { maxTx = -ox; minTx = bw - sw - ox; }
      if (sh <= bh) { minTy = maxTy = (bh - sh) / 2 - oy; } else { maxTy = -oy; minTy = bh - sh - oy; }
      tx0 = Math.min(maxTx, Math.max(minTx, tx0));
      ty0 = Math.min(maxTy, Math.max(minTy, ty0));
    }
    function zoomVerso(px, py, nuovaScala) {
      // mantiene fermo il punto (px,py) dello schermo
      const w = img.offsetWidth, h = img.offsetHeight;
      const ox = (tela.clientWidth - w) / 2, oy = (tela.clientHeight - h) / 2;
      const ix = (px - ox - tx0) / scala, iy = (py - oy - ty0) / scala; // punto nell'immagine
      scala = Math.min(6, Math.max(1, nuovaScala));
      tx0 = px - ox - ix * scala; ty0 = py - oy - iy * scala;
      limita(); applica();
    }
    function mostra(i, anim) {
      indice = Math.min(totale, Math.max(1, i));
      img.src = urlFoto(progetto, indice);
      img.alt = tx(progetto.titolo) + " — " + indice + "/" + totale;
      conta.textContent = indice + " / " + totale;
      bPrec.disabled = indice === 1; bSucc.disabled = indice === totale;
      scala = 1; tx0 = 0; ty0 = 0; applica(anim);
      // precarica la successiva
      if (indice < totale) { const pre = new Image(); pre.src = urlFoto(progetto, indice + 1); }
    }
    function apri(p, i) {
      progetto = p; totale = p.foto; aperto = true;
      el.setAttribute("data-aperto", "true");
      document.body.setAttribute("data-bloccato", "true");
      el.querySelector(".suggerimento").textContent = t("suggerimento");
      el.querySelector(".chiudi").setAttribute("aria-label", t("chiudi"));
      bPrec.setAttribute("aria-label", t("precedente")); bSucc.setAttribute("aria-label", t("successiva"));
      mostra(i, false);
      history.pushState({ schermo: true }, "");
      el.querySelector(".chiudi").focus();
    }
    function chiudi(daStoria) {
      if (!aperto) return;
      aperto = false;
      el.removeAttribute("data-aperto");
      document.body.removeAttribute("data-bloccato");
      img.removeAttribute("src");
      if (!daStoria && history.state && history.state.schermo) history.back();
      const b = document.querySelector(`.foto button[data-foto="${indice}"]`);
      if (b) b.focus();
    }

    // Gesti
    tela.addEventListener("pointerdown", (e) => {
      tela.setPointerCapture(e.pointerId);
      puntatori.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (puntatori.size === 1) {
        inizio = { x: e.clientX, y: e.clientY, tx: tx0, ty: ty0, scala, t: Date.now(), mosso: false };
      } else if (puntatori.size === 2) {
        const [a, b] = [...puntatori.values()];
        inizio = { dist: Math.hypot(a.x - b.x, a.y - b.y), scala, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, tx: tx0, ty: ty0, mosso: true };
      }
    });
    tela.addEventListener("pointermove", (e) => {
      if (!puntatori.has(e.pointerId) || !inizio) return;
      puntatori.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (puntatori.size === 2) {
        const [a, b] = [...puntatori.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        const nuova = inizio.scala * (d / inizio.dist);
        scala = inizio.scala; tx0 = inizio.tx; ty0 = inizio.ty;
        zoomVerso(inizio.cx, inizio.cy, nuova);
        tx0 += cx - inizio.cx; ty0 += cy - inizio.cy; limita(); applica(false);
      } else if (puntatori.size === 1) {
        const dx = e.clientX - inizio.x, dy = e.clientY - inizio.y;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) inizio.mosso = true;
        if (scala > 1) { tx0 = inizio.tx + dx; ty0 = inizio.ty + dy; limita(); applica(false); }
        else { tx0 = dx * 0.6; applica(false); }  // a scala 1: trascina orizzontalmente per cambiare foto
      }
    });
    function fine(e) {
      if (!puntatori.has(e.pointerId)) return;
      puntatori.delete(e.pointerId);
      if (puntatori.size === 1) { const [r] = [...puntatori.values()]; inizio = { x: r.x, y: r.y, tx: tx0, ty: ty0, scala, t: Date.now(), mosso: true }; return; }
      if (puntatori.size > 0) return;
      if (!inizio) return;
      const dx = e.clientX - inizio.x, dt = Date.now() - inizio.t;
      if (scala === 1 && inizio.mosso) {
        if (Math.abs(dx) > 60 && dt < 600) { dx < 0 ? mostra(indice + 1) : mostra(indice - 1); }
        else { tx0 = 0; ty0 = 0; applica(); }
      } else if (!inizio.mosso) {
        const ora = Date.now();
        if (ora - ultimoTocco < 300) {            // doppio tocco: ingrandisce o riporta a 1
          if (scala > 1) { scala = 1; tx0 = 0; ty0 = 0; applica(); } else zoomVerso(e.clientX, e.clientY, 2.5);
          ultimoTocco = 0;
        } else ultimoTocco = ora;
      } else { limita(); applica(); }
      inizio = null;
    }
    tela.addEventListener("pointerup", fine);
    tela.addEventListener("pointercancel", fine);
    tela.addEventListener("wheel", (e) => {
      e.preventDefault();
      zoomVerso(e.clientX, e.clientY, scala * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
    }, { passive: false });

    el.querySelector(".chiudi").addEventListener("click", () => chiudi(false));
    bPrec.addEventListener("click", () => mostra(indice - 1));
    bSucc.addEventListener("click", () => mostra(indice + 1));
    document.addEventListener("keydown", (e) => {
      if (!aperto) return;
      if (e.key === "Escape") chiudi(false);
      else if (e.key === "ArrowRight") mostra(indice + 1);
      else if (e.key === "ArrowLeft") mostra(indice - 1);
    });
    window.addEventListener("popstate", () => { if (aperto) chiudi(true); });
    window.addEventListener("resize", () => { if (aperto) { limita(); applica(false); } });

    return { apri, aperto: () => aperto };
  })();

  /* ---------- Eventi globali ---------- */
  document.addEventListener("click", (e) => {
    const bl = e.target.closest("[data-lingua]");
    if (bl) { impostaLingua(bl.getAttribute("data-lingua")); return; }
    const bf = e.target.closest(".foto button[data-foto]");
    if (bf && progettoAperto) { Schermo.apri(progettoAperto, Number(bf.getAttribute("data-foto"))); return; }
  });
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  render();
})();
