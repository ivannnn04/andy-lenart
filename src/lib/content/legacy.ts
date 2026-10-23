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
