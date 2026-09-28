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
Below the `lg` breakpoint the same markup falls back to a stacked mobile layout.

### Typeface

The design uses **Neue Haas Grotesk Display Pro** (commercial). It is picked
up automatically when available; otherwise Inter is used. To self-host it, add
the licensed files and load them with `next/font/local` in
`src/app/layout.tsx`, exposing the family first in `--font-sans`.

### Image assets

Export these Figma layers as PNG into `public/images/`:

| File | Figma layer |
| --- | --- |
| `radio-wave.png` | radio-wave-icon-monochrome-… 1 |
| `logo-mark.png` | Illustration_sans_titre 2 copy 1 |
| `hero-coat.png` | R1-17 1 |
| `fragments.png` | fragments 1 |
| `shape-4.png` | Shape 4 1 |
| `departures-banner.png` | 4 49 |
| `img-1924.png` | IMG_1924 1 |
| `photo-block-standing.png` | R1-01944-0035 1 |
| `photo-block-wide.png` | R1-01944-0019 1 |
| `signature.png` | Shape 2 1 / Shape 2 2 (source image, uncropped) |
| `garment-01.png` | IMG_2246 1 |
| `film-strip.png` | R1-04911-0000 1 (source image, uncropped) |
| `line-thick.png` | line thick 1 (source image, uncropped) |
| `newsletter-photo.png` | R1-31 1 |
| `newsletter-mark.png` | Illustration_sans_titre 3 1 |

"Source image, uncropped" layers are cropped in code exactly as in Figma, so
export the original fill image rather than the cropped layer.
