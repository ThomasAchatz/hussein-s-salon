#!/usr/bin/env python3
"""Wandelt alle Bilder aus bilder/original/ in AVIF + WebP in mehreren Breiten um.

Aufruf (im Projektordner):   python3 tools/bilder.py
Benötigt: Python 3.9+ und Pillow ≥ 11.2 (pip install --upgrade pillow)

Ergebnis:
  bilder/<name>-<breite>.avif / .webp
  bilder/bilder.json  – Breiten und Seitenverhältnis je Bild (für <picture>/srcset)

Danach werden in allen *.html-Dateien die Blöcke
  <picture data-bild="name" data-alt="…" data-sizes="…" [data-laden="sofort"] [data-img-klasse="…"]></picture>
mit passenden <source>/<img> (srcset, sizes, width/height, loading) neu befüllt.

Es wird nie hochskaliert: Ist ein Original schmaler als eine Zielbreite,
entsteht nur die Originalbreite. Neue Fotos einfach in bilder/original/ legen
(Name ohne Umlaute/Leerzeichen, z. B. team-hussein.jpg) und das Skript erneut starten.
"""
import html
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps, features

BREITEN = [480, 800, 1200, 1600, 2400]
WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "bilder" / "original"
ZIEL = WURZEL / "bilder"
ENDUNGEN = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic"}


def main() -> int:
    if not features.check("avif"):
        print("Pillow ohne AVIF-Unterstützung – bitte 'pip install --upgrade pillow'.")
        return 1
    daten = {}
    for datei in sorted(QUELLE.iterdir()):
        if datei.suffix.lower() not in ENDUNGEN:
            continue
        name = datei.stem
        bild = ImageOps.exif_transpose(Image.open(datei)).convert("RGB")
        b, h = bild.size
        breiten = sorted({w for w in BREITEN if w < b} | {min(b, BREITEN[-1])})
        for w in breiten:
            klein = bild if w == b else bild.resize((w, round(h * w / b)), Image.LANCZOS)
            klein.save(ZIEL / f"{name}-{w}.avif", quality=58, speed=6)
            klein.save(ZIEL / f"{name}-{w}.webp", quality=78, method=6)
        daten[name] = {"breiten": breiten, "b": b, "h": h}
        print(f"{name}: {b}×{h} → {breiten}")
    (ZIEL / "bilder.json").write_text(json.dumps(daten, indent=1, ensure_ascii=False))
    for seite in sorted(WURZEL.glob("*.html")):
        alt = seite.read_text(encoding="utf-8")
        neu = PICTURE.sub(lambda m: picture(m, daten), alt)
        if neu != alt:
            seite.write_text(neu, encoding="utf-8")
            print(f"aktualisiert: {seite.name}")
    return 0


PICTURE = re.compile(r'(<picture\b[^>]*\bdata-bild="([^"]+)"[^>]*>)(.*?)(</picture>)', re.S)


def attr(tag: str, name: str, standard: str = "") -> str:
    m = re.search(rf'\b{name}="([^"]*)"', tag)
    return html.unescape(m.group(1)) if m else standard


def picture(m: re.Match, daten: dict) -> str:
    tag, name = m.group(1), m.group(2)
    if name not in daten:
        print(f"WARNUNG: Bild '{name}' fehlt in bilder/original/")
        return m.group(0)
    d = daten[name]
    sizes = attr(tag, "data-sizes", "100vw")
    sofort = attr(tag, "data-laden") == "sofort"
    klasse = attr(tag, "data-img-klasse")
    esc = lambda t: html.escape(t, quote=True)
    def srcset(fmt):
        return ", ".join(f"bilder/{name}-{w}.{fmt} {w}w" for w in d["breiten"])
    fallback = d["breiten"][min(1, len(d["breiten"]) - 1)]
    laden = 'fetchpriority="high"' if sofort else 'loading="lazy"'
    inhalt = (
        f'<source type="image/avif" srcset="{srcset("avif")}" sizes="{esc(sizes)}">'
        f'<source type="image/webp" srcset="{srcset("webp")}" sizes="{esc(sizes)}">'
        f'<img src="bilder/{name}-{fallback}.webp" width="{d["b"]}" height="{d["h"]}" '
        f'alt="{esc(attr(tag, "data-alt"))}" {laden} decoding="async"'
        + (f' class="{esc(klasse)}"' if klasse else "") + ">"
    )
    return tag + inhalt + m.group(4)


if __name__ == "__main__":
    sys.exit(main())
