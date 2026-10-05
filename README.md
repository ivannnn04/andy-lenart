# Andy Lenart

Website for Andy Lenart, built with [Next.js](https://nextjs.org) (App Router), TypeScript and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint

## Design

The homepage implements the Figma frame **Desktop - 34** (1440 × 8574).
Collage sections use the design's own coordinates: `--u` in
`src/app/globals.css` is one design pixel, scaled down below 1440px wide, and
`placer()` in `src/lib/design.ts` positions elements from their Figma x/y.
Below the `md` breakpoint (768px) the same markup falls back to a stacked mobile layout.

### Typeface

The design uses **Neue Haas Grotesk Display Pro** (commercial). It is picked
up automatically when available; otherwise Inter is used. To self-host it, add
the licensed files and load them with `next/font/local` in
`src/app/layout.tsx`, exposing the family first in `--font-sans`.

Weights used map to the family's cuts: 300 = 45 Light, 400 = 55 Roman,
500 = 65 Medium, 700 = 75 Bold, 900 = 95 Black. Button labels are 600
(`font-semibold`): real in Inter, while Neue Haas has no 600 cut, so the
browser shows its Bold there. Arrows are drawn as SVG
because the fonts' Latin subsets have no arrow glyphs.

### Image assets

Export these Figma layers as PNG into `public/images/`:

| File | Figma layer |
| --- | --- |
| `radio-wave.png` | radio-wave-icon-monochrome-… 1 (added) |
| `logo-mark.png` | Illustration_sans_titre 2 copy 1 (added) |
| `hero-coat.webp` | R1-17 1 (added) |
| `fragments.png` | fragments 1 (added) |
| `shape-4.png` | Shape 4 1 (added; exported upright) |
| `departures-banner.webp` | 4 49 (added) |
| `img-1924.webp` | IMG_1924 1 (added) |
| `photo-block-standing.webp` | R1-01944-0035 1 (added) |
| `photo-block-wide.webp` | R1-01944-0019 1 (added) |
| `signature-limbo.png` | Shape 2 2 (added, pre-cropped) |
| `signature-connectivity.png` | Shape 2 1 (added, pre-cropped) |
| `garment-01.webp` | IMG_2246 1 (added) |
| `film-strip.webp` | R1-04911-0000 1 (added, pre-cropped) |
| `line-thick.png` | line thick 1 (added, pre-cropped) |
| `newsletter-photo.webp` | R1-31 1 (added, 1x — a 2x export would be sharper) |
| `newsletter-mark.png` | Illustration_sans_titre 3 1 (added) |

"Source image, uncropped" layers are cropped in code exactly as in Figma, so
export the original fill image rather than the cropped layer.

## Garment pages

`/collection/[slug]` renders a garment from `src/lib/garments.ts` (Figma frame
"04 — Garment page"). An image without `src` shows a labelled placeholder until
its file is added; `preview.src` enables the audio preview.
"Request this piece" opens the inquiry drawer (Figma "05 — Inquiry
(drawer)"). With no backend yet, submitting it opens the visitor's email app
with the request addressed to `CONTACT_EMAIL` and shows the "request
sent" screen (Figma "06 — Inquiry sent"); swap `submit` in
`RequestDrawer.tsx` for a form endpoint to receive requests directly. Garment 01 still
needs these files in `public/images/`:

| Figma layer | Used for |
| --- | --- |
| (not in design yet) | the Listening Room image |

## Listening Room gate

`/room/[slug]` is where an owner lands after tapping the NFC tag in their
garment (Figma "07 — Room gate", "08 — wrong word"; mobile first, with the
garment photo beside the form on desktop). It uses the same header as the
other pages. Point each garment's tag at
`https://<domain>/room/<slug>`, e.g. `/room/born-by-the-pelican-sculpture`.

- The keyword is the third word of the garment's concept text in
  `src/lib/garments.ts` (for No. 01: "is"). It is checked on the server
  (`src/lib/rooms.ts`) and never sent to the browser.
- A correct word sets a signed, httpOnly cookie that keeps the room open on
  that device. Three wrong words lock the gate for ten minutes.
- Set `ROOM_SECRET` (any long random string) in the deployment environment;
  it signs those cookies.
- The page is `noindex`. Once the gate is open the same URL shows the
  Listening Room (Figma "09" mobile, "14" desktop): a black collage around a
  cassette that plays the garment's track. For review the No. 01 keyword is
  temporarily "andy" (`KEYWORD_OVERRIDE` in `src/lib/rooms.ts`).
- The Staircase (`/room/<slug>/staircase`) is a placeholder for now.

### Listening Room images

Export these Figma layers (the layer as cropped in the frame, PNG at 2x) into
`public/images/`. Until a file is there, an outlined placeholder with the
layer name holds its place.

| File | Figma layer |
| --- | --- |
| `room-cassette.webp` | spinning_cassette_realistic 1 |
| `room-listen.png` | Unnamed 1 (the "LISTEN" lettering) |
| `room-photo-road.png` | R1-01944-0028 2 |
| `room-hold-on.png` | so endlessly 2 3 ("hold on —") |
| `room-photo-sledges.png` | R1-01944-0028 1 |
| `room-photo-tortoise.png` | R1-01944-0028 3 |
| `room-so-endlessly.png` | so endlessly 2 1 ("so endlessly fragmented") |
| `room-photo-pelican.png` | R1-01944-0030 1 |
| `room-was-that.png` | was that.... 1 |

