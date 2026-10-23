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

## Admin panel

Everything on the site is managed at **`/admin`**:

| Section | What it edits |
| --- | --- |
| Dashboard | Counts, latest requests and a setup checklist |
| Home page | Hero text, manifesto, "For owners" steps, "Stay connected" texts |
| Collection cards | The ten cards on the home page: order, status, price, 30-second preview, photo, link to the garment page |
| Garments | Each `/collection/<address>` page: title, price, availability, preview (duration and waveform are measured on upload), gallery, details, concept, credits, "Inside this garment" — create and delete garments too |
| Listening Rooms | Each `/room/<address>`: entry word, garment number, collage, gate photo, full track and lyrics (import an `.lrc`/`.srt` file, edit times, play the track against the lines, shift all) |
| The Staircase | Every mark left on the shared wall: hide, show or delete |
| Inbox | "Request this piece" requests and "Stay connected" sign-ups, with CSV downloads |
| Media | Upload, browse, copy and delete photos and audio |
| Settings | Site title and description, contact email, the menu |

Text fields accept `**double asterisks**` for bold. The hand-placed collages
(home page art, the rooms' artwork) stay in code; a room picks one of them.

### Setup on Vercel (once)

1. **Storage** → Create Database → **Upstash for Redis** → connect it to
   this project. It holds the content, the Staircase and the inbox
   (`KV_REST_API_URL` / `KV_REST_API_TOKEN` are added for you).
2. **Storage** → Create Database → **Blob** → connect it to this project.
   It holds uploaded photos and audio (`BLOB_READ_WRITE_TOKEN`).
3. **Settings → Environment Variables**: `ADMIN_PASSWORD` (the admin
   sign-in) and `ROOM_SECRET` (any long random text; signs the room
   cookies). Optionally `ADMIN_SECRET` to sign admin sessions separately.
4. Redeploy.

Until Redis is connected the site shows its built-in content
(`src/lib/content/defaults.ts`) and the admin is read-only; the public forms
fall back to the visitor's email app and the Staircase to the browser. The
admin stays locked in production until `ADMIN_PASSWORD` is set.

In local development no setup is needed: the password is `admin`, content
is saved to `.data/` and uploads to `public/uploads/` (both ignored by git).

### How it fits together

- `src/lib/content/types.ts` — the content model; `defaults.ts` — what
  ships with the site; `store.ts` — reads (cached, refreshed on every save)
  and saves; `storage.ts` — Redis / local files; `marks.ts`, `inbox.ts` —
  the Staircase and the inbox; `normalize.ts` — checks everything the admin
  sends.
- `src/app/admin` — the panel (pages and server actions);
  `src/components/admin` — the form engine (`schema.ts` describes each
  editor's fields), uploads and audio/lyrics tools.
- `src/app/actions.ts` — the public forms (Staircase marks, requests,
  sign-ups), rate-limited per visitor.

## Garment pages

`/collection/[slug]` renders a garment (Figma frame "04 — Garment page"). An
image without `src` shows a labelled placeholder; `preview.src` enables the
audio preview. "Request this piece" opens the inquiry drawer (Figma "05 —
Inquiry (drawer)"); requests land in the admin inbox and show the "request
sent" screen (Figma "06 — Inquiry sent").

## Listening Rooms

`/room/[slug]` is where an owner lands after tapping the NFC tag in their
garment (Figma "07 — Room gate", "08 — wrong word"; the room's photo beside
the form on desktop). Point each garment's tag at `https://<domain>/room/<slug>`.

- The entry word is set per room in the admin. It is checked on the server
  (`src/lib/rooms.ts`) and never sent to the browser. Case and punctuation
  are ignored.
- A correct word sets a signed, httpOnly cookie that keeps the room open on
  that device. Three wrong words lock the gate for ten minutes.
- The page is `noindex`. Once the gate is open the same URL shows the
  Listening Room: a black collage around a cassette that plays the room's
  full track, with the lyrics shown one line at a time as it plays. A line
  too long for the room is set smaller so it never runs into the collage.
- Built-in rooms: Born by the Pelican Sculpture ("andy"), Paper Walls
  ("andy02"), The Blueprint ("andy03"), Soviet Sunset ("andy04"), Stations of
  Comfort ("andy05"), Symmetrica ("andy06"), Aliens and Herons ("andy07"),
  Philosophy of Form ("andy08"), The Signatures ("andy09"), Funkce ("andy10").
  Soviet Sunset's and Stations of Comfort's desktop layouts are not in Figma
  and set the phone pieces in two columns. Room images (`room-0N-*.png`) are
  1× renders of the Figma layers; 2× exports would be sharper.
- The Staircase (`/room/<slug>/staircase`, Figma "15" + its bottom sheet)
  needs the room's access cookie. One wall is shared by every room; marks
  are saved to the store and moderated in the admin.

### Listening Room images

Export these Figma layers (the layer as cropped in the frame, PNG at 2x) into
`public/images/`. Until a file is there, an outlined placeholder with the
layer name holds its place.

| File | Figma layer |
| --- | --- |
| `room-cassette.webp` | spinning_cassette_realistic 1 (static; the reel hubs are turned in CSS while the track plays) |
| `room-listen.png` | Unnamed 1 (the "LISTEN" lettering) |
| `room-photo-road.png` | R1-01944-0028 2 |
| `room-hold-on.png` | so endlessly 2 3 ("hold on —") |
| `room-photo-sledges.png` | R1-01944-0028 1 |
| `room-photo-tortoise.png` | R1-01944-0028 3 |
| `room-so-endlessly.png` | so endlessly 2 1 ("so endlessly fragmented") |
| `room-photo-pelican.png` | R1-01944-0030 1 |
| `room-was-that.png` | was that.... 1 |
| `room-staircase-graffiti.png` | the two "R1-01944-0028 4" crops behind THE STAIRCASE, exported together (299×284) |
| `room-staircase-scrawl.png` | text 4 (the scrawl beside "LISTENING ROOM") |

