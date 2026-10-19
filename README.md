# Little Kiln

Site for a small roastery and bake house in a converted pottery kiln. Two real pages, Home (`/`) and Menu (`/menu/`),
sharing one order bag. Vite + TypeScript + Tailwind CSS v4, written against the React API and run on Preact.

```bash
npm install
npm run dev       # http://localhost:5173 and http://localhost:5173/menu/
npm run build     # type-check, build, prerender both pages to dist/
npm run preview
npm run images    # re-crop, grade and encode the photos to WebP
```

## Structure

```
index.html, menu/index.html   The two pages (Vite multi-page build)
src/
  home.tsx, menu.tsx          Page entries; mount.tsx hydrates the prerendered HTML
  entry-server.tsx            Build-time renderer used by scripts/prerender.mjs
  data/menu.ts                Items, pick-one choice groups, paid/free extras (prices in cents)
  lib/price.ts                Pricing, defaults, conditional groups, build summaries
  lib/cart.ts                 Order bag store (localStorage, synced across tabs)
  lib/hours.ts                Opening hours and live open/closed status
  components/
    Shell.tsx, Header.tsx, Footer.tsx, CartSheet.tsx, ItemImage.tsx
    Sheet.tsx                 Drawer/bottom sheet: portal, focus trap, Esc, scroll lock, error boundary
    home/                     Hero (animated espresso pour SVG), Marquee, Signatures (photo rail), BuildTeaser (live receipt), Story, Visit
    menu/                     MenuPage, MenuCard, ItemSheet (the customizer)
scripts/
  photos.json                 Photo sources, focal points, pick points, output shapes
  cut-out.py                  art/photos/<item>.jpg -> art/cutouts/<item>.png (needs rembg)
  build-images.py             Studio shots from cutouts, scene crops -> public/images/**/*.webp
```

## Menu and customization

Every item lists `choices` (pick-one groups such as size, temperature, ice, milk, sweetness) and `extras`
(free extras, syrups by the pump, boosts, toppings, sides). A choice can carry a price delta (`price: 70` for oat
milk, `-50` for a small). Extras with `price: 0` are free; `max > 1` gives a stepper (pumps, shots, scoops).
A group with `showWhen` only appears when another group matches: the Ice group shows once a drink is set to Iced.
Identical builds merge into one line in the bag.

## Images

Real photography from Pexels (free for commercial use, no attribution required; source pages are listed in
`scripts/photos.json`). Originals live in `art/photos/`.

- **Menu items are served on one table.** `scripts/cut-out.py` cuts each item out of its photo (rembg) into
  `art/cutouts/`. `npm run images` stands every cutout on the same wooden table (`art/photos/plate-table.jpg`) in
  front of the same blurred bakery, with matching ground and contact shadows, sized by visible area so a mug and a
  glass read at the same scale. Per item, `lie` foreshortens things shot from above (toast, a saucer) so they lie
  flat, and `trim_bottom` crops off a reflection.
- **Scenes** (Home and Menu atmosphere shots) are cropped around their `focus` point.
- One shared colour grade runs over everything, and WebP is written at two widths. `src/data/tones.json` holds
  the placeholder colours.

To swap an item's photo: replace `art/photos/<item-id>.jpg`, run the cut-out for it (set `pick` in
`scripts/photos.json` to a point on the object if the photo has other things in it), then `npm run images`:

```bash
python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]" scipy   # once
.venv/bin/python scripts/cut-out.py <item-id>
npm run images
```

## Performance

- Both pages are prerendered at build time, so text and the hero image paint before any JavaScript runs.
- The Home hero is an animated SVG (`home/PourIllustration.tsx`), transform/opacity only, no image request.
- Preact via aliases in `vite.config.ts`: the shared runtime is about 18 KB gzipped instead of about 79 KB with
  React. Remove the aliases to run on React unchanged.
- The customizer and the order sheet are separate chunks, fetched when the browser is idle or on hover.
- Photos are served through `srcset` at two widths, sized with width/height (no layout shift), lazy below the
  fold, with a colour placeholder; the hero photo is preloaded.
- Motion is transform/opacity only. Later menu sections use `content-visibility: auto`.
- Page changes use cross-document View Transitions (pure CSS); `prefers-reduced-motion` turns all motion off.
- Ordering is client-side only. Wire `place` in `CartSheet.tsx` to your POS or backend.
