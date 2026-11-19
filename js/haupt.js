/* ==========================================================================
   Hussein’s Salon – Verhalten
   GSAP, ScrollTrigger und Lenis kommen als lokale Dateien aus vendor/ (globale Objekte).
   ========================================================================== */

const html = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
const feinerZeiger = matchMedia("(hover: hover) and (pointer: fine)").matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const bewegung = !ruhig && !!gsap && !!ScrollTrigger;

let lenis = null;

/* ---------- immer: Grundfunktionen (auch ohne Bewegung) --------------------- */
jahr();
menue();
lichtbox();
formular();
karte();

if (!bewegung) {
  html.classList.remove("js", "mit-vorspann");
} else {
  gsap.registerPlugin(ScrollTrigger);
  weichesScrollen();
  const vorspannDauer = vorspann();
  hero(vorspannDauer);
  textTeilen();
  manifest();
  vorhang();
  lamellenAufdecken();
  leistungenBild();
  galerie();
  team();
  laufband();
  cursor();
  magnete();
  verzerren();
  kopfzeile();
  aktiverLink();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
}

/* ========================================================================== */

function jahr() {
  $$("[data-jahr]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

function weichesScrollen() {
  if (!window.Lenis) return;
  lenis = new window.Lenis({ lerp: 0.1, anchors: { offset: 0 }, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Vorspann -------------------------------------------------------- */
function vorspann() {
  const el = $(".vorspann");
  if (!html.classList.contains("mit-vorspann") || !el) return 0;
  try { sessionStorage.setItem("hs-vorspann", "1"); } catch (e) {}
  lenis?.stop();
  el.style.animation = "none";
  const logo = $(".vorspann__logo", el);
  const tl = gsap.timeline({
    onComplete() { el.remove(); html.classList.remove("mit-vorspann"); lenis?.start(); },
  });
  tl.from(logo.children, { autoAlpha: 0, y: 14, letterSpacing: "0.6em", duration: 0.55, stagger: 0.08, ease: "power3.out" })
    .from($(".vorspann__tipp", el), { autoAlpha: 0, duration: 0.3 }, 0.2)
    .to([logo, $(".vorspann__tipp", el)], { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0.85)
    .to($$(".vorspann__lamellen i", el), { scaleY: 0, duration: 0.5, stagger: { each: 0.035, from: "end" }, ease: "power3.inOut" }, 0.95);
  const ueberspringen = () => tl.progress(1);
  el.addEventListener("click", ueberspringen);
  addEventListener("keydown", ueberspringen, { once: true });
  return 1.15; /* Hero startet, während die Jalousie aufgeht */
}

/* ---------- Text-Splitting -------------------------------------------------- */
function teilen(el, art) {
  if (el.dataset.geteilt) return;
  el.dataset.geteilt = "1";
  const klartext = el.textContent.replace(/\s+/g, " ").trim();
  const sichtbar = document.createElement("span");
  sichtbar.setAttribute("aria-hidden", "true");
  while (el.firstChild) sichtbar.appendChild(el.firstChild);
  const zerlegen = (knoten) => {
    [...knoten.childNodes].forEach((k) => {
      if (k.nodeType === 1) return zerlegen(k);
      if (k.nodeType !== 3 || !k.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      k.textContent.split(/(\s+)/).forEach((stueck) => {
        if (!stueck) return;
        if (/^\s+$/.test(stueck)) return frag.append(" ");
        const wort = document.createElement("span");
        if (art === "woerter") {
          wort.className = "wort";
          wort.textContent = stueck;
        } else {
          wort.className = "teil-wort";
          [...stueck].forEach((z) => {
            const maske = document.createElement("span");
            maske.className = "teil-maske";
            const t = document.createElement("span");
            t.className = "teil";
            t.textContent = z;
            maske.append(t);
            wort.append(maske);
          });
        }
        frag.append(wort);
      });
      k.replaceWith(frag);
    });
  };
  zerlegen(sichtbar);
  const leser = document.createElement("span");
  leser.className = "nur-vorleser";
  leser.textContent = klartext;
  el.append(leser, sichtbar);
}

function textTeilen() {
  $$("[data-teilen]").forEach((el) => {
    if (el.closest(".hero")) return; /* Hero macht das selbst */
    teilen(el, el.dataset.teilen);
    if (el.dataset.teilen !== "zeichen") return;
    gsap.from($$(".teil", el), {
      yPercent: 110, rotate: 6, duration: 1.1, ease: "power4.out", stagger: 0.035,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

/* ---------- 1 · Hero -------------------------------------------------------- */
function hero(verzoegerung) {
  const h = $(".hero");
  if (!h) return;
  $$("[data-teilen]", h).forEach((el) => teilen(el, "zeichen"));
  const box = $("[data-lamellen-hero]", h);
  const deckel = lamellenDeckel(box, 9);
  const tl = gsap.timeline({ delay: verzoegerung + 0.1, defaults: { ease: "power4.out" } });
  tl.set($("h1", h), { opacity: 1 })
    .to($$("i", deckel), { scaleY: 0, duration: 0.9, stagger: 0.06, ease: "power3.inOut" }, 0)
    .from($(".lamellen__bild", h), { scale: 1.25, duration: 1.8, ease: "power3.out" }, 0)
    .from($$(".titel__a .teil", h), { yPercent: 115, rotate: 8, duration: 1.2, stagger: 0.04 }, 0.15)
    .from($$(".titel__b .teil", h), { yPercent: 115, duration: 1, stagger: 0.025 }, 0.45)
    .fromTo($(".titel__vor", h), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.8 }, 0.4)
    .fromTo($(".hero__unten", h), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.8);

  /* Parallax */
  gsap.to($(".lamellen__bild", h), { yPercent: 9, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
  gsap.to($(".titel", h), { y: () => -innerHeight * 0.12, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
}

function lamellenDeckel(el, anzahl = 8) {
  const d = document.createElement("div");
  d.className = "lamellen-deckel";
  d.setAttribute("aria-hidden", "true");
  d.innerHTML = "<i></i>".repeat(anzahl);
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  el.append(d);
  return d;
}

/* ---------- 2 · Manifest: Wort für Wort ------------------------------------- */
function manifest() {
  const sek = $(".manifest");
  const text = $(".manifest__text", sek);
  if (!text) return;
  teilen(text, "woerter");
  const woerter = $$(".wort", text);
  gsap.set(woerter, { color: "#646464" }); /* ≥ 3:1 Kontrast, große Schrift */
  const mm = gsap.matchMedia();
  const bauen = (pin) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sek, start: pin ? "top top" : "top 75%", end: pin ? "+=110%" : "bottom 60%", scrub: 0.6, pin },
    });
    tl.to(woerter, { color: (n, el) => (el.closest(".messing") ? "#c9a46c" : "#f4f2ee"), stagger: 0.1, ease: "none", duration: 0.3 })
      .from($(".manifest__unterschrift", sek), { autoAlpha: 0, y: 16, duration: 0.6 });
    return () => tl.kill();
  };
  mm.add("(min-width: 900px)", () => bauen(true));
  mm.add("(max-width: 899px)", () => bauen(false));
}

/* ---------- Jalousie-Übergang ----------------------------------------------- */
function vorhang() {
  $$(".vorhang").forEach((v) => {
    gsap.fromTo($$("i", v), { scaleY: 1 }, {
      scaleY: 0.04, ease: "none", stagger: 0.08,
      scrollTrigger: { trigger: v, start: "top 85%", end: "bottom 20%", scrub: true },
    });
  });
}

/* ---------- Bilder durch Lamellen aufdecken --------------------------------- */
function lamellenAufdecken() {
  $$(".person__bild, .karte").forEach((el) => {
    const d = lamellenDeckel(el, 8);
    gsap.to($$("i", d), {
      scaleY: 0, duration: 1, stagger: 0.07, ease: "power3.inOut",
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
      onComplete: () => d.remove(),
    });
  });
}

/* ---------- 3 · Leistungen: mitlaufendes Bild ------------------------------- */
function leistungenBild() {
  const box = $(".schwebebild");
  const zeilen = $$(".kategorie li[data-bild]");
  if (!box || !zeilen.length) return;
  const bilder = new Map($$("picture", box).map((p) => [p.dataset.bild, p]));
  const xTo = gsap.quickTo(box, "x", { duration: 0.6, ease: "power3" });
  const yTo = gsap.quickTo(box, "y", { duration: 0.6, ease: "power3" });
  const rTo = gsap.quickTo(box, "rotation", { duration: 0.8, ease: "power3" });
  let letztesX = 0, timer;

  const zeigen = (name) => {
    bilder.forEach((p, n) => p.classList.toggle("zeigen", n === name));
    gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };
  const verstecken = () => gsap.to(box, { autoAlpha: 0, scale: 0.92, duration: 0.3, overwrite: "auto" });
  gsap.set(box, { scale: 0.92, xPercent: -50, yPercent: -50 });

  zeilen.forEach((li) => {
    li.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      zeigen(li.dataset.bild);
    });
    li.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && verstecken());
    li.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      zeilen.forEach((z) => z.classList.toggle("aktiv", z === li));
      const r = li.getBoundingClientRect();
      gsap.set(box, { x: Math.min(innerWidth - 90, Math.max(90, e.clientX)), y: r.top - 70 });
      zeigen(li.dataset.bild);
      clearTimeout(timer);
      timer = setTimeout(() => { verstecken(); li.classList.remove("aktiv"); }, 1800);
    });
  });
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    xTo(e.clientX + 120); yTo(e.clientY);
    rTo(gsap.utils.clamp(-8, 8, (e.clientX - letztesX) * 0.4));
    letztesX = e.clientX;
  });
  lenis?.on("scroll", () => { if (!feinerZeiger) verstecken(); });

  /* Zeilen gleiten ein */
  $$(".kategorie").forEach((k) => {
    gsap.from($$("li", k), {
      y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: k, start: "top 85%", once: true },
    });
    gsap.from($$(".l-linie", k), {
      scaleX: 0, duration: 1.2, stagger: 0.07, ease: "power3.inOut",
      scrollTrigger: { trigger: k, start: "top 85%", once: true },
    });
  });
}

/* ---------- 4 · Galerie: horizontal ----------------------------------------- */
function galerie() {
  const sek = $(".galerie");
  const strecke = $(".strecke", sek);
  if (!strecke) return;
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px)", () => {
    sek.classList.add("horizontal");
    const weg = () => Math.max(0, strecke.scrollWidth - innerWidth);
    const tween = gsap.to(strecke, {
      x: () => -weg(), ease: "none",
      scrollTrigger: { trigger: sek, start: "top top", end: () => "+=" + weg(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    /* Bilder öffnen sich beim Hereinfahren */
    $$(".strecke__bild", strecke).forEach((b) => {
      const d = lamellenDeckel(b, 7);
      gsap.to($$("i", d), {
        scaleY: 0, stagger: 0.05, duration: 0.8, ease: "power3.inOut",
        scrollTrigger: { trigger: b, containerAnimation: tween, start: "left 92%", once: true },
      });
    });
    return () => { sek.classList.remove("horizontal"); gsap.set(strecke, { clearProps: "transform" }); $$(".lamellen-deckel", strecke).forEach((d) => d.remove()); };
  });
  mm.add("(max-width: 899px)", () => {
    $$(".strecke__bild", strecke).forEach((b) => {
      const d = lamellenDeckel(b, 7);
      gsap.to($$("i", d), { scaleY: 0, stagger: 0.05, duration: 0.8, ease: "power3.inOut", scrollTrigger: { trigger: sek, start: "top 70%", once: true } });
    });
    return () => $$(".lamellen-deckel", strecke).forEach((d) => d.remove());
  });
}

/* ---------- 5 · Team: kurz Farbe + Lichtstreifen ---------------------------- */
function team() {
  $$(".person").forEach((p) => {
    ScrollTrigger.create({
      trigger: p, start: "top 60%", end: "bottom 40%",
      onEnter: () => blitz(p), onEnterBack: () => blitz(p),
    });
  });
  function blitz(p) {
    if (feinerZeiger) return; /* am Desktop übernimmt Hover */
    p.classList.add("im-licht");
    setTimeout(() => p.classList.remove("im-licht"), 1400);
  }
}

/* ---------- 6 · Laufband ---------------------------------------------------- */
function laufband() {
  const band = $(".laufband");
  const spur = $(".laufband__spur", band);
  if (!spur) return;
  let x = 0, richtung = -1, schub = 0;
  const breite = () => spur.firstElementChild.offsetWidth;
  lenis?.on("scroll", ({ velocity, direction }) => {
    if (direction) richtung = direction > 0 ? -1 : 1;
    schub = Math.min(Math.abs(velocity) * 0.6, 24);
  });
  let sichtbar = false;
  ScrollTrigger.create({ trigger: band, start: "top bottom", end: "bottom top", onToggle: (s) => (sichtbar = s.isActive) });
  gsap.ticker.add((t, dt) => {
    if (!sichtbar) return;
    const b = breite();
    x += richtung * (0.06 * dt + schub);
    schub *= 0.9;
    if (x <= -b) x += b;
    if (x > 0) x -= b;
    spur.style.transform = `translate3d(${x}px,0,0)`;
  });
}

/* ---------- Cursor ---------------------------------------------------------- */
function cursor() {
  if (!feinerZeiger) return;
  const c = $(".cursor");
  const text = $(".cursor__text", c);
  html.classList.add("cursor-an");
  gsap.set(c, { x: -100, y: -100 });
  const xTo = gsap.quickTo(c, "x", { duration: 0.25, ease: "power3" });
  const yTo = gsap.quickTo(c, "y", { duration: 0.25, ease: "power3" });
  addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const bild = e.target.closest("[data-cursor]");
    const leistung = e.target.closest(".kategorie li");
    const link = e.target.closest("a, button, select, input, textarea, label");
    c.classList.toggle("gross", !!(bild || leistung));
    c.classList.toggle("schere", !!leistung && !bild);
    c.classList.toggle("knopf-nah", !!link && !bild);
    text.textContent = bild ? bild.dataset.cursor : leistung ? "✂" : "";
  });
  document.addEventListener("pointerleave", () => gsap.set(c, { x: -100, y: -100 }));
}

/* ---------- Magnetische Knöpfe ---------------------------------------------- */
function magnete() {
  if (!feinerZeiger) return;
  $$(".magnet").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.45);
    });
    el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, .4)" }));
  });
}

/* ---------- Verzerren beim schnellen Scrollen ------------------------------- */
function verzerren() {
  if (!lenis) return;
  const ziele = $$(".person__bild, .kategorie h3");
  const horizontal = $$(".strecke li");
  const sTo = ziele.map((el) => gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }));
  const hTo = horizontal.map((el) => gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" }));
  lenis.on("scroll", ({ velocity }) => {
    const v = gsap.utils.clamp(-5, 5, velocity * 0.18);
    sTo.forEach((f) => f(v));
    hTo.forEach((f) => f(-v * 0.8));
  });
}

/* ---------- Kopfzeile ein-/ausblenden --------------------------------------- */
function kopfzeile() {
  const k = $(".kopf");
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (s) => {
      if (document.body.classList.contains("menue-offen")) return;
      k.classList.toggle("weg", s.direction === 1 && s.scroll() > innerHeight * 0.6);
    },
  });
}

function aktiverLink() {
  const links = $$(".kopf__nav a");
  links.forEach((a) => {
    const ziel = $(a.getAttribute("href"));
    if (!ziel) return;
    ScrollTrigger.create({
      trigger: ziel, start: "top 50%", end: "bottom 50%",
      onToggle: (s) => a.setAttribute("aria-current", s.isActive ? "true" : "false"),
    });
  });
}

/* ---------- Menü (mobil) ---------------------------------------------------- */
function menue() {
  const knopf = $(".menue-knopf");
  const m = $("#menue");
  if (!knopf || !m) return;
  const beschriftung = $(".menue-knopf__text", knopf);
  const auf = (offen) => {
    knopf.setAttribute("aria-expanded", String(offen));
    beschriftung.textContent = offen ? "Schließen" : "Menü";
    document.body.classList.toggle("menue-offen", offen);
    $(".kopf").classList.remove("weg");
    if (offen) {
      m.hidden = false;
      lenis?.stop();
      if (bewegung) {
        gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
        gsap.from($$("li a", m), { yPercent: 110, duration: 0.8, stagger: 0.06, ease: "power4.out", delay: 0.25 });
      }
      $("a", m).focus({ preventScroll: true });
    } else {
      lenis?.start();
      m.hidden = true;
    }
  };
  knopf.addEventListener("click", () => auf(knopf.getAttribute("aria-expanded") !== "true"));
  $$("a", m).forEach((a) => a.addEventListener("click", (e) => {
    const ziel = a.getAttribute("href");
    auf(false);
    if (ziel.startsWith("#") && lenis) { e.preventDefault(); lenis.scrollTo(ziel); }
  }));
  addEventListener("keydown", (e) => {
    if (m.hidden) return;
    if (e.key === "Escape") { auf(false); knopf.focus(); }
    if (e.key === "Tab") {
      const fokus = [knopf, ...$$("a", m)];
      const i = fokus.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); fokus[fokus.length - 1].focus(); }
      else if (!e.shiftKey && i === fokus.length - 1) { e.preventDefault(); fokus[0].focus(); }
    }
  });
}

/* ---------- Lichtbox mit Wischen -------------------------------------------- */
function lichtbox() {
  const d = $(".lichtbox");
  const knoepfe = $$(".strecke__bild");
  if (!d || !knoepfe.length || typeof d.showModal !== "function") return;
  const img = $("img", d);
  const zaehler = $(".lichtbox__zaehler", d);
  let i = 0;
  const zeigen = (n, richtung = 0) => {
    i = (n + knoepfe.length) % knoepfe.length;
    const quelle = $("img", knoepfe[i]);
    img.src = quelle.currentSrc || quelle.src;
    img.alt = quelle.alt;
    zaehler.textContent = `${String(i + 1).padStart(2, "0")} / ${String(knoepfe.length).padStart(2, "0")}`;
    if (bewegung && richtung) gsap.fromTo(img, { x: 60 * richtung, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" });
  };
  knoepfe.forEach((k, n) => k.addEventListener("click", () => {
    zeigen(n);
    d.showModal();
    lenis?.stop();
    if (bewegung) gsap.fromTo(img, { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "power4.out" });
  }));
  d.addEventListener("close", () => lenis?.start());
  $(".lichtbox__zu", d).addEventListener("click", () => d.close());
  $(".lichtbox__pfeil--vor", d).addEventListener("click", () => zeigen(i + 1, 1));
  $(".lichtbox__pfeil--zurueck", d).addEventListener("click", () => zeigen(i - 1, -1));
  d.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") zeigen(i + 1, 1);
    if (e.key === "ArrowLeft") zeigen(i - 1, -1);
  });
  $(".lichtbox__buehne", d).addEventListener("click", (e) => { if (e.target !== img) d.close(); });
  let startX = null, startY = 0;
  d.addEventListener("pointerdown", (e) => { startX = e.clientX; startY = e.clientY; });
  d.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) zeigen(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
}

/* ---------- Kontaktformular → fertige E-Mail (mailto) ----------------------- */
function formular() {
  const f = $("[data-formular]");
  if (!f) return;
  const status = $(".formular__status", f);
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = f.elements.name;
    if (!name.value.trim()) {
      name.setAttribute("aria-invalid", "true");
      status.textContent = "Bitte geben Sie Ihren Namen an.";
      name.focus();
      return;
    }
    name.removeAttribute("aria-invalid");
    const w = (n) => f.elements[n].value.trim();
    const betreff = `Terminanfrage – ${w("leistung")}`;
    const text = [
      "Hallo Hussein’s Salon,", "", "ich möchte gerne einen Termin anfragen.", "",
      `Name: ${w("name")}`, `Telefon: ${w("telefon") || "–"}`, `Leistung: ${w("leistung")}`,
      `Wunschtermin: ${w("wunschtermin") || "–"}`, "", w("nachricht"), "", "Viele Grüße",
    ].join("\n");
    const adresse = f.dataset.mail;
    status.textContent = adresse.includes("[")
      ? "Hinweis: Die E-Mail-Adresse des Salons ist noch ein Platzhalter – bitte rufen Sie uns an."
      : "Ihr Mailprogramm öffnet sich mit der fertigen Anfrage.";
    location.href = `mailto:${adresse}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
  });
}

/* ---------- Karte: Zwei-Klick-Lösung ---------------------------------------- */
function karte() {
  const box = $("[data-karte]");
  const knopf = box && $("[data-karte-laden]", box);
  if (!knopf) return;
  knopf.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.title = "Karte: Hussein’s Salon, Fraunhoferstraße 17, 94315 Straubing";
    f.src = "https://www.google.com/maps?q=Fraunhoferstra%C3%9Fe%2017%2C%2094315%20Straubing&z=16&output=embed";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.allowFullscreen = true;
    box.replaceChildren(f);
    f.focus();
  });
}
