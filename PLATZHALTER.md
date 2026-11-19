# Was Hussein noch liefern muss

Alle Platzhalter stehen im Code in eckigen Klammern `[…]` – mit `grep -rn "\[" *.html` findet man sie.

## Inhalte (index.html)
- [ ] **Name des zweiten Inhabers** (links im Foto) – Hero-Abspann, Manifest-Unterschrift, Team
- [ ] **Nachnamen** beider Inhaber (Team)
- [ ] **Team:** Namen und Rollen der Mitarbeitenden; sind die Personen auf `bart-spiegel` und `team-empfang` wirklich Team? Weitere Personen?
- [ ] **Preise** für alle 16 Leistungen (stehen als `ab [00] €`) – und ob die Liste der Leistungen so stimmt
- [ ] **Öffnungszeiten** (Abschnitt „Besuch“ **und** strukturierte Daten im `<head>` → `openingHoursSpecification`)
- [ ] **E-Mail-Adresse** des Salons → `data-mail="[info@beispiel.de]"` am Formular
- [ ] Manifest-Text absegnen („Haare sind unser Material …“)

## Fotos (`bilder/original/`, danach `python3 tools/bilder.py`)
Die jetzigen Bilder sind Ausschnitte aus Instagram-Screenshots (≈ 280 px breit) und nur Platzhalter.
- [ ] **Doppelporträt der Inhaber** (Anzug, Schere/Föhn) ist eingebaut, stammt aber aus einem Handy-Screenshot (1027 px breit). Bitte die **Originaldatei** schicken → als `bilder/original/inhaber-hero.jpg` ablegen (alte `.png` löschen); die Team-Porträts `team-inhaber-links` / `team-hussein` sind Ausschnitte daraus und können ebenso ersetzt werden
- [ ] **10–15 Arbeiten** in hoher Auflösung (gleiche Dateinamen wie jetzt überschreiben = keine HTML-Änderung nötig)
- [ ] Einverständnis der abgebildeten Kundinnen und Kunden zur Veröffentlichung (DSGVO/KUG)
- [ ] Logo als Vektor (SVG/PDF), falls das nachgesetzte Jost-Logo ersetzt werden soll

## Rechtliches
- [ ] **impressum.html:** Inhaber/Rechtsform, E-Mail, USt-IdNr., Meistertitel, Handwerksrolle/Betriebsnummer, Kammer, Verantwortlicher, ggf. Fotograf
- [ ] **datenschutz.html:** Inhaber, E-Mail, E-Mail-Anbieter, Stand; Hoster anpassen, falls nicht GitHub Pages
- [ ] Beide Texte von einer Fachperson prüfen lassen

## Technik
- [ ] Bei eigener Domain alle Adressen umstellen (siehe README → „Eigene Domain“)
