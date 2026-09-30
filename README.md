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
its file is added; `preview.src` enables the audio preview. Garment 01 still
needs these files in `public/images/`:

| Figma layer | Used for |
| --- | --- |
| (not in design yet) | the Listening Room image |
