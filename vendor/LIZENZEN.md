# Fremde Bestandteile – Versionen und Lizenzen

Alles liegt lokal im Projekt, nichts wird von fremden Servern geladen.

| Datei | Projekt | Version | Lizenz |
|-------|---------|---------|--------|
| `vendor/gsap.min.js` | GSAP (GreenSock) | 3.15.1 | GSAP Standard „No Charge“ License – kostenlos, auch kommerziell: https://gsap.com/standard-license |
| `vendor/ScrollTrigger.min.js` | GSAP ScrollTrigger | 3.15.1 | wie GSAP |
| `vendor/lenis.min.js` | Lenis (darkroom.engineering) | 1.3.27 | MIT – siehe `vendor/LICENSE-lenis.txt` |
| `schriften/jost-var.woff2` | Jost (Indestructible Type), variabel 100–900, Latin | Fontsource 5.3.0 | SIL Open Font License 1.1 – siehe `schriften/OFL-jost.txt` |
| `schriften/bodoni-moda-italic-var.woff2` | Bodoni Moda Italic (Indestructible Type), variabel, Latin | Fontsource 5.3.0 | SIL Open Font License 1.1 – siehe `schriften/OFL-bodoni-moda.txt` |

Bezugsquelle: npm (`gsap`, `lenis`, `@fontsource-variable/jost`, `@fontsource-variable/bodoni-moda`).
Aktualisieren: neue Version per `npm pack <paket>@<version>` holen, Dateien ersetzen, Tabelle anpassen.
