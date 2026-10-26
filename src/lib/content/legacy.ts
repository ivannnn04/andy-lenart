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
 * Lyrics the site once shipped with (machine transcriptions), by a hash of
 * the list. A garment saved while it still had them gets the corrected
 * built-in lyrics; lyrics edited in the admin are left alone.
 */
const REPLACED_LYRICS: Record<string, string> = {
  "born-by-the-pelican-sculpture": "dc5c912c18a54791",
  "paper-walls": "293f1758c3e06cbe",
  symmetrica: "61db855a231e118c",
  "aliens-and-herons": "b5426c8af9574a42",
  "soviet-sunset": "cbe4a2d37bd6540d",
  "stations-of-comfort": "4496b8534a7fcd4a",
  "philosophy-of-form": "82f2566b848fef8b",
  "the-signatures": "9aff5db6a3ab0c5f",
  funkce: "6bf97d67526de514",
};

export function withCurrentLyrics(garment: Garment): Garment {
  const old = REPLACED_LYRICS[garment.slug];
  if (!old || createHash("sha256").update(JSON.stringify(garment.room.lyrics)).digest("hex").slice(0, 16) !== old)
    return garment;
  const lyrics = DEFAULT_CONTENT.garments.find((g) => g.slug === garment.slug)?.room.lyrics ?? garment.room.lyrics;
  return { ...garment, room: { ...garment.room, lyrics } };
}
