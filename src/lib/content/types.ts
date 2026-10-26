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

/**
 * One line of a song. `time` is when it starts; `end`, when the voice stops
 * (optional); `words`, when each word of `text` starts (optional, one per
 * word) — the karaoke follows them when they are there.
 */
export type Lyric = { time: number; text: string; end?: number; words?: number[] };

/** The words of a lyric line, as `Lyric.words` counts them. */
export const lyricWords = (text: string) => text.trim().split(/\s+/).filter(Boolean);

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

/** A garment's private Listening Room at /room/<garment slug>. */
export type RoomContent = {
  /** Off: the room's address shows "not found". */
  enabled: boolean;
  /** Entry word. Case and punctuation are ignored. */
  keyword: string;
  /** Shown beside the gate on desktop. */
  photo?: GarmentImage;
  /** The full track the tape plays. */
  track?: string;
  /** Each line with the time (seconds into the track) it starts. */
  lyrics: Lyric[];
  /** Fixed text printed in the collage (the first room's design only). */
  verse: string[];
  collage: Collage;
};

/**
 * One piece of the collection: its card on the home page, its page at
 * /collection/<slug> (once released) and its Listening Room at /room/<slug>.
 */
export type Garment = {
  slug: string;
  no: string;
  /** Title as it breaks in the design (page and room). */
  titleLines: string[];

  // The card on the home page
  /** Off: the card is not shown on the home page. */
  hidden?: boolean;
  /** Card title when it differs from the title, e.g. with a translation. */
  cardTitle?: string;
  /** Card title size in px (default 22). */
  titleSize?: number;
  /** Status line, e.g. "Available · 12 left" or "Coming soon". */
  status: string;
  /** Makes the status line a link, e.g. #stay-connected. */
  statusHref?: string;
  /** Card photo; without one the card shows its number. */
  cardImage?: { src: string; alt: string };
  /** Chapters further out are shown faded. */
  dimmed?: boolean;

  // Shared by the card and the page
  /** Card text and the page's tagline. */
  tagline: string;
  price: string;
  preview: Preview;

  // The garment page
  /** Off: no page yet (the card does not link anywhere). */
  page: boolean;
  availability: string;
  /** Stock line in the request drawer, e.g. "12 remaining". */
  remaining: string;
  size: string;
  gallery: GarmentImage[];
  /** Gallery index of the photo shown beside the request drawer. */
  requestPhoto: number;
  details: { title: string; body?: string }[];
  concept: { paragraphs: string[]; image: GarmentImage; quote: string };
  credits: { name: string; role: string }[];
  inside: { title: string[]; paragraphs: string[]; image: GarmentImage };

  room: RoomContent;
};

/** A Listening Room as the room pages use it (from its garment). */
export type Room = Omit<RoomContent, "enabled"> & { slug: string; garmentNo: string; titleLines: string[] };

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
  /** The collection, in the order of the home page. */
  garments: Garment[];
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
