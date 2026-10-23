/**
 * Shape checks for what the admin panel sends: everything is coerced to the
 * types the site expects, so a bad field can never break a page.
 */
import {
  COLLAGES,
  type Collage,
  type Garment,
  type GarmentImage,
  type HomeContent,
  type Lyric,
  type NavItem,
  type RoomContent,
  type Settings,
} from "./types";

type Raw = Record<string, unknown>;

const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
export const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const optStr = (v: unknown, max = 5000) => str(v, max) || undefined;
const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const lines = (v: unknown, max = 500) => arr(v).map((s) => str(s, max)).filter(Boolean);

/** Lower-case letters, digits and dashes — for URLs. */
export const slugify = (v: unknown) =>
  str(v, 120)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Site paths, anchors, mailto and http(s) links only. */
export function href(v: unknown): string | undefined {
  const s = str(v, 500);
  if (!s) return undefined;
  return /^(\/|#|https?:\/\/|mailto:)/i.test(s) ? s : undefined;
}

/** Media from this site (/…) or from storage over https. */
export function mediaSrc(v: unknown): string | undefined {
  const s = str(v, 1000);
  return /^(\/(?!\/)|https:\/\/)/.test(s) ? s : undefined;
}

export function image(v: unknown): GarmentImage {
  const o = obj(v);
  return {
    src: mediaSrc(o.src),
    alt: str(o.alt, 400),
    width: Math.max(1, Math.round(num(o.width, 4))),
    height: Math.max(1, Math.round(num(o.height, 5))),
  };
}

export function lyrics(v: unknown): Lyric[] {
  return arr(v)
    .map((l) => ({ time: Math.max(0, Math.round(num(obj(l).time) * 100) / 100), text: str(obj(l).text, 300) }))
    .filter((l) => l.text)
    .sort((a, b) => a.time - b.time);
}

function roomContent(v: unknown): RoomContent {
  const o = obj(v);
  const photo = image(o.photo);
  const collage = str(o.collage) as Collage;
  return {
    enabled: o.enabled === true,
    keyword: str(o.keyword, 80),
    photo: photo.src ? photo : undefined,
    track: mediaSrc(o.track),
    lyrics: lyrics(o.lyrics),
    verse: lines(o.verse, 300),
    collage: COLLAGES.includes(collage) ? collage : "pelican",
  };
}

export function garment(v: unknown): Garment {
  const o = obj(v);
  const preview = obj(o.preview);
  const concept = obj(o.concept);
  const inside = obj(o.inside);
  const gallery = arr(o.gallery).map(image);
  const card = obj(o.cardImage);
  const cardSrc = mediaSrc(card.src);
  const titleSize = num(o.titleSize, 0);
  return {
    slug: slugify(o.slug) || "untitled",
    no: str(o.no, 10),
    titleLines: lines(o.titleLines, 120),

    hidden: o.hidden === true || undefined,
    cardTitle: optStr(o.cardTitle, 200),
    titleSize: titleSize >= 12 && titleSize <= 40 ? titleSize : undefined,
    status: str(o.status, 120),
    statusHref: href(o.statusHref),
    cardImage: cardSrc ? { src: cardSrc, alt: str(card.alt, 400) } : undefined,
    dimmed: o.dimmed === true || undefined,

    tagline: str(o.tagline, 400),
    price: str(o.price, 60),
    preview: {
      src: mediaSrc(preview.src),
      duration: str(preview.duration, 10) || "0:30",
      waveform: arr(preview.waveform).length
        ? arr(preview.waveform).map((h) => Math.min(33, Math.max(4, Math.round(num(h, 4)))))
        : undefined,
    },

    page: o.page === true,
    availability: str(o.availability, 120),
    remaining: str(o.remaining, 120),
    size: str(o.size, 120),
    gallery,
    requestPhoto: Math.min(Math.max(0, Math.round(num(o.requestPhoto))), Math.max(0, gallery.length - 1)),
    details: arr(o.details)
      .map((d) => ({ title: str(obj(d).title, 200), body: optStr(obj(d).body) }))
      .filter((d) => d.title),
    concept: { paragraphs: lines(concept.paragraphs, 3000), image: image(concept.image), quote: str(concept.quote, 500) },
    credits: arr(o.credits)
      .map((c) => ({ name: str(obj(c).name, 200), role: str(obj(c).role, 300) }))
      .filter((c) => c.name),
    inside: { title: lines(inside.title, 200), paragraphs: lines(inside.paragraphs, 3000), image: image(inside.image) },

    room: roomContent(o.room),
  };
}

const navItem = (v: unknown): NavItem => ({ label: str(obj(v).label, 60), href: href(obj(v).href) ?? "/" });

export function settings(v: unknown): Settings {
  const o = obj(v);
  return {
    siteTitle: str(o.siteTitle, 200),
    siteDescription: str(o.siteDescription, 500),
    contactEmail: str(o.contactEmail, 200),
    nav: arr(o.nav).map(navItem).filter((n) => n.label),
  };
}

export function home(v: unknown): HomeContent {
  const o = obj(v);
  const owners = obj(o.owners);
  const stay = obj(o.stayConnected);
  return {
    heroLines: lines(o.heroLines, 200),
    heroTagline: str(o.heroTagline, 200),
    manifesto: lines(o.manifesto, 1000),
    owners: {
      label: str(owners.label, 100),
      title: str(owners.title, 200),
      steps: arr(owners.steps)
        .map((s) => ({ title: str(obj(s).title, 200), body: str(obj(s).body, 1000) }))
        .filter((s) => s.title),
      statement: str(owners.statement, 300),
      statementBold: str(owners.statementBold, 300),
    },
    stayConnected: { title: str(stay.title, 200), subtitle: str(stay.subtitle, 500) },
  };
}
