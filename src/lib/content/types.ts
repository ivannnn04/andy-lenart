/**
 * Everything the admin panel edits. The whole site's content is one
 * `SiteContent` document; Staircase marks and inbox entries are kept apart
 * (see marks.ts / inbox.ts) because visitors add to them.
 *
 * Text fields may use **double asterisks** for bold (see lib/inline.tsx).
 */

export type GarmentImage = {
  src?: string;
  alt: string;
  /** Intrinsic size of the file (or of the design frame for placeholders). */
  width: number;
  height: number;
};

export type Lyric = { time: number; text: string };

/** The 30-second clip on the cards and the garment page. */
export type Preview = {
  src?: string;
  duration: string;
  /**
   * Bar heights (px, 4–33) measured from the clip — RMS loudness of 48
   * equal slices in dB, the top 12 dB spread over the range. The admin
   * computes it when a clip is uploaded.
   */
  waveform?: number[];
};

export type Garment = {
  slug: string;
  no: string;
  /** Title as it breaks in the design. */
  titleLines: string[];
  tagline: string;
  price: string;
  availability: string;
  /** Stock line in the request drawer, e.g. "12 remaining". */
  remaining: string;
  size: string;
  preview: Preview;
  gallery: GarmentImage[];
  /** Gallery index of the photo shown beside the request drawer. */
  requestPhoto: number;
  details: { title: string; body?: string }[];
  concept: { paragraphs: string[]; image: GarmentImage; quote: string };
  credits: { name: string; role: string }[];
  inside: { title: string[]; paragraphs: string[]; image: GarmentImage };
};

/** The hand-placed collages in components/room/ListeningRoom.tsx. */
export const COLLAGES = [
  "pelican",
  "paper-walls",
  "blueprint",
  "soviet-sunset",
  "stations-of-comfort",
  "symmetrica",
  "aliens-and-herons",
  "philosophy-of-form",
  "the-signatures",
  "funkce",
] as const;
export type Collage = (typeof COLLAGES)[number];

export type Room = {
  slug: string;
  /** The garment the room belongs to ("No. 01 / DEPARTURES 1322"). */
  garmentNo: string;
  titleLines: string[];
  /** Entry word. Case and punctuation are ignored. */
  keyword: string;
  /** Shown beside the gate on desktop. */
  photo?: GarmentImage;
  /** The full track the tape plays. */
  track?: string;
  /** Each line with the time (seconds into the track) it starts. */
  lyrics: Lyric[];
  /** Fixed text printed in the collage (the first room only). */
  verse: string[];
  collage: Collage;
};

export type CollectionCard = {
  no: string;
  title: string;
  description: string;
  status: string;
  /** Makes the status line a link, e.g. to the newsletter sign-up. */
  statusHref?: string;
  /** Links the card to /collection/<slug>. */
  garmentSlug?: string;
  price?: string;
  preview?: { src?: string; duration: string };
  image?: { src: string; alt: string };
  /** Chapters further out are shown faded. */
  dimmed?: boolean;
  titleSize?: number;
};

export type NavItem = { label: string; href: string };

export type HomeContent = {
  heroLines: string[];
  heroTagline: string;
  /** The manifesto quote; each entry is a line on desktop. */
  manifesto: string[];
  owners: {
    label: string;
    title: string;
    steps: { title: string; body: string }[];
    statement: string;
    statementBold: string;
  };
  stayConnected: { title: string; subtitle: string };
};

export type Settings = {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  nav: NavItem[];
};

export type SiteContent = {
  settings: Settings;
  home: HomeContent;
  collection: CollectionCard[];
  garments: Garment[];
  rooms: Room[];
};

/** Longest thought a visitor can leave on the Staircase. */
export const MAX_MARK_LENGTH = 240;

export type Mark = {
  id: string;
  text: string;
  name: string;
  city: string;
  /** Number of the garment its author owns. */
  no: string;
  /** Room it was left from (empty for the starter marks). */
  room?: string;
  createdAt: number;
  hidden?: boolean;
};

export type PieceRequest = {
  id: string;
  createdAt: number;
  garment: string;
  name: string;
  city: string;
  email: string;
  message: string;
  done?: boolean;
};

export type Subscriber = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  message: string;
};
