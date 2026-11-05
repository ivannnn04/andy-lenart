import { createHash } from "node:crypto";
import { DEFAULT_CONTENT } from "./defaults";
import type { Garment } from "./types";

type Raw = Record<string, unknown>;
const list = (v: unknown): Raw[] => (Array.isArray(v) ? v.filter((x): x is Raw => Boolean(x) && typeof x === "object") : []);
const key = (s: unknown) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * Content saved before cards, garment pages and rooms became one garment
 * kept them in three lists (`collection`, `garments`, `rooms`). Folds them
 * into the built-in garments so nothing edited back then is lost; the
 * result is normalized by the caller and stored in the new shape on the
 * next save.
 */
export function fromLegacy(stored: Raw): unknown[] {
  const pages = list(stored.garments);
  const rooms = list(stored.rooms);
  const cards = list(stored.collection);
  const garments: Raw[] = DEFAULT_CONTENT.garments.map((g) => ({ ...g, room: { ...g.room } }));
  const find = (slug: unknown) => garments.find((g) => g.slug === slug);

  for (const p of pages) {
    const { slug } = p;
    const g = find(slug);
    if (g) Object.assign(g, p, { page: true, room: g.room });
    else garments.push({ ...p, page: true, room: { enabled: false } });
  }
  for (const r of rooms) {
    const { slug, garmentNo, titleLines, ...room } = r;
    void garmentNo;
    const g = find(slug);
    if (g) g.room = { ...(g.room as Raw), ...room, enabled: true };
    else garments.push({ ...(DEFAULT_CONTENT.garments[0] as Garment), slug, titleLines, page: false, room: { ...room, enabled: true } });
  }

  // Cards: match by the page they linked to, else by title; their order is the collection's order.
  const ordered: Raw[] = [];
  for (const c of cards) {
    const g =
      find(c.garmentSlug) ??
      garments.find((g) => [g.cardTitle, (g.titleLines as string[]).join(" ")].some((t) => t && key(t) === key(c.title)));
    if (!g || ordered.includes(g)) continue;
    Object.assign(g, {
      hidden: c.hidden,
      status: c.status ?? g.status,
      statusHref: c.statusHref,
      price: c.price || g.price,
      preview: c.preview ? { ...(g.preview as Raw), ...(c.preview as Raw) } : g.preview,
      cardImage: c.image,
      dimmed: c.dimmed,
      titleSize: c.titleSize,
      tagline: (g.page ? g.tagline : c.description) || g.tagline,
    });
    ordered.push(g);
  }
  return [...ordered, ...garments.filter((g) => !ordered.includes(g))];
}

/**
 * Lyrics the site once shipped with (a placeholder, the machine
 * transcriptions, then earlier timings of the corrected texts), by a hash
 * of the list. A garment saved while it still had them gets the current built-in lyrics; lyrics
 * edited in the admin are left alone.
 */
const REPLACED_LYRICS: Record<string, string[]> = {
  "born-by-the-pelican-sculpture": ["dc5c912c18a54791", "02bc606ab22dc7b7"],
  "paper-walls": ["293f1758c3e06cbe", "453ab96fdce3f5c5", "8685fdebb79d7ca8"],
  symmetrica: ["61db855a231e118c", "d38aa7bef152970b"],
  "aliens-and-herons": ["b5426c8af9574a42", "5dfc16333b6a61e1"],
  "soviet-sunset": ["cbe4a2d37bd6540d", "1f45cfe1f519f65c"],
  "stations-of-comfort": ["4496b8534a7fcd4a", "b22055092e71efff", "3af70522effced07", "6b3e5fce03d0350a"],
  "philosophy-of-form": ["82f2566b848fef8b", "8d62605bf1cf95c7", "95bf2cc76d403c27"],
  "the-blueprint": ["3fa5ab8731eea11d"],
  "the-signatures": ["9aff5db6a3ab0c5f", "77da473e1df4bd26", "31daca72e6381096"],
  funkce: ["6bf97d67526de514", "d8f936445835245c", "7977832bf5acc8c5", "d98f97eaad22db64", "b124288f523a139c", "15450c980c1d0f51"],
};

function withCurrentLyrics(garment: Garment): Garment {
  const old = REPLACED_LYRICS[garment.slug];
  if (!old?.includes(createHash("sha256").update(JSON.stringify(garment.room.lyrics)).digest("hex").slice(0, 16)))
    return garment;
  const lyrics = DEFAULT_CONTENT.garments.find((g) => g.slug === garment.slug)?.room.lyrics ?? garment.room.lyrics;
  return { ...garment, room: { ...garment.room, lyrics } };
}

/** Prices the site once shipped with: a garment still saved with one shows the current built-in price. */
const REPLACED_PRICES: Record<string, string[]> = {
  "born-by-the-pelican-sculpture": ["£1,500"],
};

function withCurrentPrice(garment: Garment): Garment {
  if (!REPLACED_PRICES[garment.slug]?.includes(garment.price)) return garment;
  const price = DEFAULT_CONTENT.garments.find((g) => g.slug === garment.slug)?.price;
  return price ? { ...garment, price } : garment;
}

/** Galleries the site once shipped with, by their photos in order. */
const REPLACED_GALLERIES: Record<string, string[]> = {
  "born-by-the-pelican-sculpture": [
    "/images/garment-01.webp",
    "/images/garment-01-2.webp",
    "/images/garment-01-3.webp",
    "/images/garment-01-4.webp",
    "/images/garment-01-5.webp",
  ],
};

function withCurrentGallery(garment: Garment): Garment {
  const old = REPLACED_GALLERIES[garment.slug];
  if (!old || garment.gallery.map((i) => i.src).join() !== old.join()) return garment;
  const fresh = DEFAULT_CONTENT.garments.find((g) => g.slug === garment.slug);
  if (!fresh) return garment;
  // The photo beside the request form stays the same photo.
  const requestSrc = garment.gallery[garment.requestPhoto]?.src;
  const requestPhoto = fresh.gallery.findIndex((i) => i.src === requestSrc);
  return { ...garment, gallery: fresh.gallery, requestPhoto: requestPhoto < 0 ? fresh.requestPhoto : requestPhoto };
}

/** Photos re-exported from Figma at high resolution as WebP; the PNGs are gone. */
const REPLACED_PNGS = new Set([
  "room-photo-road",
  "room-photo-sledges",
  "room-photo-tortoise",
  "room-photo-pelican",
  "room-02-photo-paper-walls",
  "room-02-photo-decanter",
  "room-02-photo-sofa",
  "room-03-photo-family",
  "room-03-photo-tv",
  "room-03-photo-kitchen",
  "room-04-photo-square",
  "room-04-photo-protest",
  "room-05-photo-tower",
  "room-05-photo-bench",
  "room-05-photo-sculpture",
  "room-05-photo-doorway",
  "room-05-photo-fruit",
  "room-06-photo-blocks",
  "room-06-photo-tower",
  "room-06-photo-terraces",
  "room-07-photo-hand",
  "room-07-photo-sculpture",
  "room-08-photo-shadows",
  "room-08-photo-vase",
  "room-09-graffiti",
  "room-09-photo-flats",
  "room-10-photo-building",
  "room-10-photo-flats",
  "room-10-photo-bird",
  "room-10-photo-family",
]);

const currentFile = <T extends { src?: string }>(image: T): T => {
  const name = image.src?.match(/^\/images\/(.+)\.png$/)?.[1];
  return name && REPLACED_PNGS.has(name) ? { ...image, src: `/images/${name}.webp` } : image;
};

function withCurrentFiles(garment: Garment): Garment {
  return {
    ...garment,
    cardImage: garment.cardImage && currentFile(garment.cardImage),
    gallery: garment.gallery.map(currentFile),
    concept: { ...garment.concept, image: currentFile(garment.concept.image) },
    inside: { ...garment.inside, image: currentFile(garment.inside.image) },
    room: { ...garment.room, photo: garment.room.photo && currentFile(garment.room.photo) },
  };
}

/** Built-in content that has since been corrected, brought up to date in a saved garment. */
export const withCurrentDefaults = (garment: Garment) =>
  withCurrentFiles(withCurrentGallery(withCurrentPrice(withCurrentLyrics(garment))));

/** The order the collection once shipped in, before it followed the album. */
const REPLACED_ORDER = [
  "born-by-the-pelican-sculpture",
  "paper-walls",
  "symmetrica",
  "aliens-and-herons",
  "the-blueprint",
  "soviet-sunset",
  "stations-of-comfort",
  "philosophy-of-form",
  "the-signatures",
  "funkce",
];

/**
 * A collection still saved in that old built-in order takes the album
 * order, with the numbers and faded cards that go with it. An order
 * changed in the admin is left alone.
 */
export function withCurrentOrder(garments: Garment[]): Garment[] {
  if (garments.map((g) => g.slug).join() !== REPLACED_ORDER.join()) return garments;
  const at = (slug: string) => DEFAULT_CONTENT.garments.findIndex((g) => g.slug === slug);
  if (garments.some((g) => at(g.slug) < 0)) return garments;
  const oldDimmed = garments.map((g) => Boolean(g.dimmed)).join();
  const builtInDimmed = REPLACED_ORDER.map((_, i) => i >= 4).join();
  return [...garments]
    .sort((a, b) => at(a.slug) - at(b.slug))
    .map((g, i) => {
      const old = REPLACED_ORDER.indexOf(g.slug);
      const fresh = DEFAULT_CONTENT.garments[i];
      return {
        ...g,
        // Only numbers and fading that were still the built-in ones move.
        no: g.no === String(old + 1).padStart(2, "0") ? fresh.no : g.no,
        dimmed: oldDimmed === builtInDimmed ? fresh.dimmed : g.dimmed,
      };
    });
}
