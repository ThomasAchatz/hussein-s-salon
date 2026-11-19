# Hussein’s Salon – Website

Onepager für Hussein’s Salon, Damen- und Herrenfriseur in Straubing. *Your hair, our masterpiece.*
Reines HTML, CSS und JavaScript – **kein Build-Schritt**, keine fremden Server, keine Cookies.

```
index.html            Onepager
impressum.html        Impressum (Platzhalter)
datenschutz.html      Datenschutzerklärung (Platzhalter)
css/basis.css         Schriften, Farben, Korn, Logo, Knopf
css/seite.css         alle Abschnitte
js/haupt.js           Vorspann, Lenis, GSAP-Effekte, Galerie, Lichtbox, Formular, Karte
vendor/               GSAP 3.15.1, ScrollTrigger, Lenis 1.3.27 (+ LIZENZEN.md)
schriften/            Jost + Bodoni Moda Italic als woff2
bilder/original/      Originalfotos (hier neue Fotos ablegen)
bilder/               erzeugte AVIF/WebP-Dateien, og-bild.jpg
tools/bilder.py       Bildumwandlung + Befüllen der <picture>-Tags
```

Offene Inhalte: siehe **[PLATZHALTER.md](PLATZHALTER.md)**. Konzept: [KONZEPT.md](KONZEPT.md).

## Lokal ansehen

ES-Module funktionieren nicht per Doppelklick (`file://`), deshalb kurz einen lokalen Server starten:

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen. Den Vorspann sieht man nur einmal pro Tab (neuer Tab = neuer Vorspann).

## Neue Fotos einbauen

1. Foto in `bilder/original/` legen (jpg/png, Name ohne Umlaute/Leerzeichen). Am einfachsten einen vorhandenen
   Namen überschreiben, z. B. `inhaber-duo.jpg` – dann vorher die alte `inhaber-duo.png` löschen.
2. Umwandeln (braucht Python 3 und `pip install --upgrade pillow`):
   ```bash
   python3 tools/bilder.py
   ```
   Das Skript erzeugt AVIF/WebP in 480–2400 px und schreibt `srcset`, `sizes`, Breite/Höhe in alle `<picture data-bild="…">`.
3. Neues Bild an einer neuen Stelle: `<picture data-bild="name" data-alt="Beschreibung" data-sizes="50vw"></picture>` ins HTML, Skript laufen lassen.

## Veröffentlichen

### Variante A: GitHub Pages (kostenlos, schon vorbereitet)

1. Diesen Branch in `main` übernehmen (Pull Request auf GitHub erstellen und mergen).
2. Auf GitHub im Repository: **Settings → Pages**.
3. Unter *Build and deployment*: **Source = Deploy from a branch**, **Branch = `main`**, Ordner **`/ (root)`** → **Save**.
4. Nach 1–2 Minuten ist die Seite unter **https://thomasachatz.github.io/hussein-s-salon/** online.

Hinweis: Auf einer `github.io`-Unterseite wird `robots.txt` von Suchmaschinen nicht gelesen (nur an der Domain-Wurzel). Mit eigener Domain funktioniert sie.

### Variante B: Cloudflare Pages (kostenlos, schnell in Europa)

1. https://dash.cloudflare.com → **Workers & Pages → Erstellen → Pages → Mit Git verbinden** → dieses Repository wählen.
2. *Framework preset*: **None**, *Build command*: **leer lassen**, *Build output directory*: **`/`**.
3. **Speichern und bereitstellen** → Adresse `https://<projekt>.pages.dev`.
4. Im Datenschutz unter „Hosting“ dann Cloudflare statt GitHub eintragen.

### Eigene Domain (z. B. `husseins-salon.de`)

1. Domain bei einem Anbieter (IONOS, Strato, INWX, Cloudflare …) registrieren.
2. **GitHub Pages:** *Settings → Pages → Custom domain* eintragen und **Enforce HTTPS** anhaken. Beim Domain-Anbieter:
   - `www` → **CNAME** auf `thomasachatz.github.io`
   - Wurzel (`@`) → **A-Records** `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   
   **Cloudflare Pages:** im Projekt *Custom domains → Set up a domain* – Cloudflare führt durch die DNS-Einträge.
3. Alle Adressen in der Seite umstellen (canonical, Open Graph, strukturierte Daten, Sitemap, robots.txt):
   ```bash
   grep -rl "thomasachatz.github.io/hussein-s-salon" --include=*.html --include=*.xml --include=*.txt . | xargs sed -i 's#https://thomasachatz.github.io/hussein-s-salon#https://www.husseins-salon.de#g'
   ```
4. Danach in der [Google Search Console](https://search.google.com/search-console) die Domain bestätigen,
   `sitemap.xml` einreichen und ein [Google-Unternehmensprofil](https://www.google.com/business/) mit derselben Adresse/Telefonnummer pflegen.

## Prüfstand (Stand der Abgabe)

- Lighthouse Handy: Leistung 94 · Barrierefreiheit 100 · Best Practices 100 · SEO 100
- Kein seitliches Scrollen bei 360 px, iPhone 13 und 1440 px; keine Konsolenfehler; keine externen Anfragen
- `prefers-reduced-motion`: kein Vorspann, kein Lenis, keine Animationen, alles sofort sichtbar
