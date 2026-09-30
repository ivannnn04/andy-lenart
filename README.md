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
