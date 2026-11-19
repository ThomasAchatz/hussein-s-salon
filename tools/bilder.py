#!/usr/bin/env python3
"""Wandelt alle Bilder aus bilder/original/ in AVIF + WebP in mehreren Breiten um.

Aufruf (im Projektordner):   python3 tools/bilder.py
Benötigt: Python 3.9+ und Pillow ≥ 11.2 (pip install --upgrade pillow)

Ergebnis:
  bilder/<name>-<breite>.avif / .webp
  bilder/bilder.json  – Breiten und Seitenverhältnis je Bild (für <picture>/srcset)

Es wird nie hochskaliert: Ist ein Original schmaler als eine Zielbreite,
entsteht nur die Originalbreite. Neue Fotos einfach in bilder/original/ legen
(Name ohne Umlaute/Leerzeichen, z. B. team-hussein.jpg) und das Skript erneut starten.
"""
import json
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
    return 0


if __name__ == "__main__":
    sys.exit(main())
