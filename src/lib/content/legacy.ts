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
 * transcriptions, then the corrected texts without end times), by a hash
 * of the list. A garment saved while it still had them gets the current built-in lyrics; lyrics
 * edited in the admin are left alone.
 */
const REPLACED_LYRICS: Record<string, string[]> = {
  "born-by-the-pelican-sculpture": ["dc5c912c18a54791", "02bc606ab22dc7b7"],
  "paper-walls": ["293f1758c3e06cbe", "453ab96fdce3f5c5"],
  symmetrica: ["61db855a231e118c", "d38aa7bef152970b"],
  "aliens-and-herons": ["b5426c8af9574a42", "5dfc16333b6a61e1"],
  "soviet-sunset": ["cbe4a2d37bd6540d", "1f45cfe1f519f65c"],
  "stations-of-comfort": ["4496b8534a7fcd4a", "b22055092e71efff"],
  "philosophy-of-form": ["82f2566b848fef8b", "8d62605bf1cf95c7"],
  "the-blueprint": ["3fa5ab8731eea11d"],
  "the-signatures": ["9aff5db6a3ab0c5f", "77da473e1df4bd26"],
  funkce: ["6bf97d67526de514", "d8f936445835245c"],
};

export function withCurrentLyrics(garment: Garment): Garment {
  const old = REPLACED_LYRICS[garment.slug];
  if (!old?.includes(createHash("sha256").update(JSON.stringify(garment.room.lyrics)).digest("hex").slice(0, 16)))
    return garment;
  const lyrics = DEFAULT_CONTENT.garments.find((g) => g.slug === garment.slug)?.room.lyrics ?? garment.room.lyrics;
  return { ...garment, room: { ...garment.room, lyrics } };
}
