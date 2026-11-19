# Hussein’s Salon – Konzept

**Leitidee:** Die Seite ist der Trailer zu einem Film Noir mit dem Titel *Your Hair, Our Masterpiece*.
Es gibt eine Farbe (Messing #b08d57), der Rest ist Schwarz, Weiß und Grau. Licht fällt nur durch Lamellen.

## Schriften (selbst gehostet, `schriften/`)
- **Jost** (variabel 100–900, meist 200/300): Logo, Navigation, Fließtext, große Versal-Zeilen
- **Bodoni Moda Italic** (variabel): einzelne wilde Akzentwörter („Masterpiece“, „Material“, Zahlen)
- Gemischt in einer Zeile: `OUR` (Jost 200, versal) + *Masterpiece* (Bodoni Italic)

## Wiederkehrende Effekte
- **Jalousie:** Bilder öffnen sich durch 8–10 Lamellen (`clip-path`/Maske je Lamelle versetzt); Streifenschatten
  wandern langsam über Flächen; zwischen Abschnitten schließt und öffnet sich ein Lamellenvorhang.
- **Filmkorn** fest über allem, **Vignette** an den Bildrändern.
- **Cursor** (Desktop): kleiner Ring → über Bildern „Ansehen“, über Leistungen eine Schere. Am Handy aus.
- **Magnetische Knöpfe**, Überschriften in Wörter/Buchstaben geteilt, leichtes Verzerren (skewY) bei schnellem Scrollen.
- Lenis (weiches Scrollen) + GSAP ScrollTrigger. `prefers-reduced-motion`: alles aus, alles sofort sichtbar.

## Abschnitte
| # | Abschnitt | Animation |
|---|-----------|-----------|
| 0 | **Vorspann** (nur 1. Besuch, ≤ 1,5 s, Klick/Taste überspringt) | Schwarz → Logo blendet in Lamellen auf → Jalousie öffnet sich nach oben |
| 1 | **Hero** – Inhaber-Doppelporträt, Claim, „Termin buchen“ | Parallax auf Foto, Claim Buchstabe für Buchstabe, Streifen wandern |
| 2 | **Manifest** – „Haare sind unser Material. …“ | gepinnt, Wort für Wort von Grau zu Weiß, ein Wort in Bodoni/Messing |
| 3 | **Leistungen** – Damen · Herren · Bart/Styling · Farbe, Preise als Platzhalter | Zeilen gleiten ein; Hover/Tippen: Bild folgt dem Cursor, öffnet sich in Lamellen |
| 4 | **Galerie** – horizontale Bildstrecke, gemischte Formate | gepinnt, vertikales Scrollen schiebt horizontal; am Handy wischbar; Klick → Vollbild mit Wischen |
| 5 | **Team** – S/W-Porträts | beim Hover/im Blickfeld: Farbe kommt kurz zurück, Lichtstreifen zieht darüber |
| 6 | **Laufband** – „DAMEN · HERREN · STRAUBING · YOUR HAIR, OUR MASTERPIECE ·“ | Bodoni Italic riesig, Richtung/Tempo folgt dem Scrollen |
| 7 | **Besuch** – Adresse, Telefon, Öffnungszeiten, Instagram-Link, Kontaktformular, Karte per Zwei-Klick | Jalousie-Übergang, Karte erst nach Einwilligung |
| 8 | **Footer** – Impressum, Datenschutz, Instagram | Logo groß über volle Breite |

## Kontaktformular ohne Server
GitHub Pages kann keine Formulare verarbeiten. Variante ohne Drittanbieter: Das Formular baut eine E-Mail
(`mailto:`) mit Name, Wunschtermin und Leistung vor – keine Daten verlassen den Browser, DSGVO-unkritisch.
Später möglich: Formspree/Web3Forms o. ä. (dann Datenschutzerklärung ergänzen, AV-Vertrag).

## Hero-Varianten (Bildschirmfotos in `entwurf/bildschirmfotos/`)
- **A – Das Plakat:** Foto randlos in voller Höhe, schräge Jalousie-Schatten wandern darüber; Claim riesig
  unten links, Abspann-Zeile „In den Hauptrollen …“.
- **B – Der Vorspann:** schwarze Bühne, Foto als Hochformat in offenen Lamellen rechts; „Your hair,“ in Bodoni
  riesig darüber, „OUR MASTERPIECE“ in Jost mit Differenz-Mischung; Billing-Block wie auf einem Filmplakat.

Hinweis: Die aktuellen Fotos sind Instagram-Ausschnitte (≈ 280 px breit). Für das randlose Hero (A) braucht es
später ein echtes Foto in hoher Auflösung; B verträgt kleinere Bilder besser.
