#!/usr/bin/env python3
"""Builds every WebP on the site.

Menu items are served on one table: each cutout in art/cutouts/ (made by scripts/cut-out.py) stands on the same
wooden table in front of the same blurred bakery, with the same shadows, footprint and resting line, as a 4:5
"card" (480 and 960 wide) and a 16:10 "wide" for the customizer (720 and 1280 wide). Scenes are cropped from art/photos/ around their focal point at the
aspect and widths listed in scripts/photos.json. Everything gets the same gentle grade (warmer, slightly muted,
lifted blacks) so photos from different photographers read as one shoot. Average colors go to src/data/tones.json.

    python3 scripts/build-images.py
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "art" / "photos"
CUTOUTS = ROOT / "art" / "cutouts"
OUT = ROOT / "public" / "images"
MANIFEST = json.loads((ROOT / "scripts" / "photos.json").read_text())
QUALITY = 76


def crop(img: Image.Image, aspect: tuple[float, float], focus: tuple[float, float]) -> Image.Image:
    w, h = img.size
    target = aspect[0] / aspect[1]
    if w / h > target:
        cw, ch = round(h * target), h
    else:
        cw, ch = w, round(w / target)
    left = min(max(round(focus[0] * w - cw / 2), 0), w - cw)
    top = min(max(round(focus[1] * h - ch / 2), 0), h - ch)
    return img.crop((left, top, left + cw, top + ch))


def grade(img: Image.Image) -> Image.Image:
    img = ImageEnhance.Color(img).enhance(0.9)
    img = ImageEnhance.Contrast(img).enhance(1.06)
    r, g, b = img.split()
    # Warm the highlights a touch, cool nothing, and lift the blacks so shadows feel like film, not ink.
    r = r.point(lambda v: min(255, int(10 + v * 0.98 * 1.03)))
    g = g.point(lambda v: min(255, int(8 + v * 0.97)))
    b = b.point(lambda v: min(255, int(8 + v * 0.93)))
    return Image.merge("RGB", (r, g, b))


def write(img: Image.Image, name: str, widths: list[int], aspect: tuple[float, float], focus) -> None:
    base = grade(crop(img, aspect, focus))
    for w in widths:
        h = round(w * aspect[1] / aspect[0])
        out = OUT / f"{name}-{w}.webp"
        base.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
        print(f"{out.relative_to(ROOT)}  {w}x{h}  {out.stat().st_size / 1024:.0f} KB")


# ——— Tabletop: every menu item is served on the same wooden table in front of the same blurred bakery ———

TABLE = MANIFEST["table"]


def cover(img: Image.Image, w: int, h: int) -> Image.Image:
    scale = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    return img.crop(((img.width - w) // 2, (img.height - h) // 2, (img.width - w) // 2 + w, (img.height - h) // 2 + h))


def table_plate(w: int, h: int, horizon: float) -> Image.Image:
    """Blurred bakery shelves on top, the planks of a wooden table (seen at an angle) below."""
    edge_y = round(h * horizon)
    back = Image.open(PHOTOS / f"{TABLE['backdrop']}.jpg").convert("RGB")
    back = cover(back, w, edge_y + 40).filter(ImageFilter.GaussianBlur(w * 0.018))
    back = ImageEnhance.Brightness(back).enhance(0.82)
    src = Image.open(PHOTOS / "plate-table.jpg").convert("RGB")
    planks = src.crop((0, round(src.height * TABLE["edge"]), src.width, src.height))
    planks = cover(planks, w, h - edge_y)
    planks = ImageEnhance.Color(ImageEnhance.Brightness(planks).enhance(0.74)).enhance(1.15)
    plate = Image.new("RGB", (w, h))
    plate.paste(back.crop((0, 0, w, edge_y)), (0, 0))
    plate.paste(planks, (0, edge_y))
    # A thin dark line where the table edge drops away, and light falling off toward the front.
    ImageDraw.Draw(plate).line((0, edge_y, w, edge_y), fill=(40, 26, 16), width=max(2, h // 400))
    fall = Image.linear_gradient("L").resize((w, h)).point(lambda v: int(max(0, v - 150) * 0.9))
    plate = Image.composite(Image.new("RGB", (w, h), (30, 18, 10)), plate, fall)
    return plate


def tabletop(cut: Image.Image, w: int, h: int, box: tuple[float, float], horizon: float, rest: float) -> Image.Image:
    """Stand a cutout on the table at the same resting line (rest). Items are sized by their visible area, so a
    squat mug and a tall glass read at the same scale; box caps the width and height."""
    visible = sum(cut.getchannel("A").point(lambda v: 1 if v > 128 else 0).histogram()[1:2] or [0])
    target = 0.115 * w * h
    scale = min(box[0] * w / cut.width, box[1] * h / cut.height, (target / visible) ** 0.5)
    item = cut.resize((round(cut.width * scale), round(cut.height * scale)), Image.LANCZOS)
    x = (w - item.width) // 2
    base = round(h * rest)
    y = base - item.height
    canvas = table_plate(w, h, horizon)
    alpha = item.getchannel("A")

    # Ground shadow: the silhouette squashed flat onto the table, falling back and to the right (window light front-left).
    flat_h = max(8, round(item.height * 0.22))
    flat = alpha.resize((item.width, flat_h))
    shadow = Image.new("L", (w, h), 0)
    shadow.paste(flat, (x + round(item.width * 0.08), base - round(flat_h * 0.85)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(w * 0.018)).point(lambda v: int(v * 0.55))
    canvas = Image.composite(Image.new("RGB", (w, h), (24, 14, 8)), canvas, shadow)

    # Contact shadow: a tight dark band right where the item touches the wood.
    contact = Image.new("L", (w, h), 0)
    cw, ch = item.width * 0.8, max(6, item.height * 0.045)
    ImageDraw.Draw(contact).ellipse((w / 2 - cw / 2, base - ch * 0.7, w / 2 + cw / 2, base + ch * 0.5), fill=210)
    contact = contact.filter(ImageFilter.GaussianBlur(ch * 0.6))
    canvas = Image.composite(Image.new("RGB", (w, h), (18, 10, 6)), canvas, contact)

    # Nudge the item's colors toward the scene's warm light so it sits in the room, not on top of it.
    lit = grade(item.convert("RGB"))
    lit = Image.blend(lit, Image.new("RGB", lit.size, (196, 150, 108)), 0.07)
    canvas.paste(lit, (x, y), alpha)
    return canvas


def tone(img: Image.Image) -> str:
    r, g, b = grade(img.resize((1, 1), Image.BOX)).getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def main() -> None:
    (OUT / "menu").mkdir(parents=True, exist_ok=True)
    for old in (OUT / "menu").glob("*.webp"):
        old.unlink()
    tones: dict[str, str] = {}
    for item_id, meta in MANIFEST["items"].items():
        cut = Image.open(CUTOUTS / f"{item_id}.png").convert("RGBA")
        if meta.get("trim_bottom"):
            cut = cut.crop((0, 0, cut.width, round(cut.height * (1 - meta["trim_bottom"]))))
            cut = cut.crop(cut.getchannel("A").getbbox())
        if meta.get("lie"):
            # Shot from above: foreshorten so it lies on the table instead of standing up on it.
            cut = cut.resize((cut.width, round(cut.height * meta["lie"])), Image.LANCZOS)
        for variant, size, widths, box, horizon, rest in (
            ("card", (1200, 1500), [480, 960], (0.62, 0.42), 0.4, 0.8),
            ("wide", (1600, 1000), [720, 1280], (0.44, 0.56), 0.36, 0.86),
        ):
            shot = tabletop(cut, *size, box, horizon, rest)
            for w in widths:
                out = OUT / f"menu/{item_id}-{variant}-{w}.webp"
                shot.resize((w, round(w * size[1] / size[0])), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
                print(f"{out.relative_to(ROOT)}  {out.stat().st_size / 1024:.0f} KB")
        tones[item_id] = tone(shot)
    for name, meta in MANIFEST["scenes"].items():
        img = Image.open(PHOTOS / f"{name}.jpg").convert("RGB")
        write(img, name, meta["widths"], tuple(meta["aspect"]), meta["focus"])
        tones[name] = tone(crop(img, tuple(meta["aspect"]), meta["focus"]))
    # Average color per image, painted behind it while it loads.
    (ROOT / "src" / "data" / "tones.json").write_text(json.dumps(tones, indent=2) + "\n")


if __name__ == "__main__":
    main()
