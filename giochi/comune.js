"use strict";
/* Funzioni comuni */
const $ = (s, e) => (e || document).querySelector(s);
const $$ = (s, e) => [...(e || document).querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = s => String(s || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "");
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fmtMS = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

/* ---- audio ---- */
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === "suspended") AC.resume(); return AC; }
document.addEventListener("pointerdown", ac, { once: true });
function tone(freq, dur, type, vol, when) {
  const a = ac(); if (!a) return; const t0 = a.currentTime + (when || 0), v = vol || 0.05;
  const o = a.createOscillator(), g = a.createGain(); o.type = type || "square"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(v, t0 + 0.005);
  g.gain.setValueAtTime(v, t0 + Math.max(0.01, dur - 0.01)); g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
}
const sfx = {
  key: () => tone(1200, 0.03, "square", 0.02),
  ok: () => { tone(660, 0.08); tone(990, 0.12, "square", 0.05, 0.09); },
  err: () => tone(160, 0.25, "sawtooth", 0.07),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, "square", 0.05, i * 0.12)),
  boom: () => { tone(80, 0.8, "sawtooth", 0.12); tone(50, 1.0, "square", 0.1, 0.05); }
};

/* ---- stato: giochi completati (solo in questo browser) ---- */
const DONE_KEY = "cyberwar100-completati";
function getDone() { try { return JSON.parse(localStorage.getItem(DONE_KEY)) || []; } catch (e) { return []; } }
function setDone(id) { try { const d = getDone(); if (!d.includes(id)) { d.push(id); localStorage.setItem(DONE_KEY, JSON.stringify(d)); } } catch (e) { } }

/* ---- timer gestiti dal gioco corrente (puliti al riavvio) ---- */
const TIMERS = [];
const later = (f, ms) => { const h = setTimeout(f, ms); TIMERS.push(h); return h; };
const every = (f, ms) => { const h = setInterval(f, ms); TIMERS.push(h); return h; };
function clearTimers() { TIMERS.forEach(h => { clearTimeout(h); clearInterval(h); }); TIMERS.length = 0; }

/* ---- risposte testuali ---- */
let WIN = () => { };
const rispostaHTML = (ph) => `<div class="ans"><input id="ans" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${ph || "risposta"}"><button class="pri" id="go">INVIA</button></div><div class="msg" id="msg"></div>`;
function legaRisposta(controlla, normalizza) {
  const inp = $("#ans"), msg = $("#msg");
  const go = () => {
    const v = (normalizza || norm)(inp.value); if (!v) return;
    if (controlla(v)) { msg.className = "msg ok"; msg.textContent = "ACCESSO CONSENTITO"; inp.blur(); later(WIN, 600); }
    else errore(msg, "ACCESSO NEGATO — RISPOSTA ERRATA", inp);
  };
  $("#go").onclick = go; inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
}
function errore(msgEl, testo, shakeEl) {
  sfx.err(); if (msgEl) { msgEl.className = "msg err"; msgEl.textContent = testo; }
  if (shakeEl) { shakeEl.classList.remove("shake"); void shakeEl.offsetWidth; shakeEl.classList.add("shake"); }
}
function msgOk(el, t) { el.className = "msg ok"; el.textContent = t; }
