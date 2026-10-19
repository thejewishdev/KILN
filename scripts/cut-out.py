#!/usr/bin/env python3
"""Cuts each menu item out of its photo and saves a transparent PNG to art/cutouts/<item-id>.png.

Only needed when a photo in art/photos/ changes; the cutouts are kept in the repo so the normal image build
(scripts/build-images.py) needs nothing but Pillow. Requires rembg, numpy and scipy:

    python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]" scipy
    .venv/bin/python scripts/cut-out.py            # all items
    .venv/bin/python scripts/cut-out.py croissant  # one item

Per item, scripts/photos.json can set `pick`: an [x, y] point (fractions of the photo) on the object to keep,
when the photo has other things in it (a cookie rack next to the chai, a teapot behind the cup).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "art" / "photos"
OUT = ROOT / "art" / "cutouts"
ITEMS = json.loads((ROOT / "scripts" / "photos.json").read_text())["items"]


def clean_mask(alpha: np.ndarray, pick: list[float] | None) -> np.ndarray:
    solid = alpha > 128
    # Opening removes thin strands (a milk stream, a straw shadow) without eating the object's edge.
    solid = ndimage.binary_opening(solid, structure=np.ones((9, 9)))
    labels, n = ndimage.label(solid)
    if n == 0:
        return alpha
    sizes = ndimage.sum(solid, labels, range(1, n + 1))
    if pick:
        h, w = alpha.shape
        py, px = int(pick[1] * h), int(pick[0] * w)
        keep = labels[py, px]
        if keep == 0:  # point fell between components: take the nearest one
            dist, (iy, ix) = ndimage.distance_transform_edt(labels == 0, return_indices=True)
            keep = labels[iy[py, px], ix[py, px]]
        wanted = labels == keep
    else:
        wanted = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * 0.04])
    # Grow back slightly and keep the original soft edge inside that region.
    region = ndimage.binary_dilation(wanted, iterations=6)
    return np.where(region, alpha, 0).astype(np.uint8)


def main(only: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    session = new_session("isnet-general-use")
    for item_id, meta in ITEMS.items():
        if only and item_id not in only:
            continue
        img = Image.open(PHOTOS / f"{item_id}.jpg").convert("RGB")
        img.thumbnail((1600, 1600))
        cut = remove(img, session=session, post_process_mask=True)
        alpha = clean_mask(np.array(cut.getchannel("A")), meta.get("pick"))
        mask = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
        rgba = img.copy()
        rgba.putalpha(mask)
        rgba = rgba.crop(mask.getbbox())
        rgba.save(OUT / f"{item_id}.png", optimize=True)
        print(f"{item_id}: {rgba.size[0]}x{rgba.size[1]}")


if __name__ == "__main__":
    main(sys.argv[1:])
