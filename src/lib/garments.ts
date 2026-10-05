/**
 * Garment pages. Each entry drives /collection/[slug]. An image without `src`
 * renders as a placeholder until its file is added to public/images.
 */

export type GarmentImage = {
  src?: string;
  alt: string;
  /** Intrinsic size of the file (or of the design frame for placeholders). */
  width: number;
  height: number;
};

/** A run of body text; `strong` runs are set in the medium weight. */
export type RichText = { text: string; strong?: boolean }[];

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
  /**
   * `waveform`: bar heights (px, 4–33) measured from the clip itself — RMS
   * loudness of 48 equal slices, perceptually scaled.
   */
  preview: { src?: string; duration: string; waveform?: number[] };
  /**
   * The Listening Room: the full track the tape plays, and its lyrics with
   * the time (seconds into the track) each line starts, for the
   * Spotify-style display (one line at a time); `verse` is the fixed text
   * printed in the collage.
   */
  room: { track?: string; lyrics: { time: number; text: string }[]; verse: string[] };
  gallery: GarmentImage[];
  /** Gallery index of the photo shown beside the request drawer. */
  requestPhoto: number;
  details: { title: string; body?: string }[];
  concept: {
    paragraphs: string[];
    image: GarmentImage;
    quote: string;
  };
  credits: { name: string; role: string }[];
  inside: {
    title: string[];
    paragraphs: RichText[];
    image: GarmentImage;
  };
};

export const GARMENTS: Garment[] = [
  {
    slug: "born-by-the-pelican-sculpture",
    no: "01",
    titleLines: ["Born by the", "Pelican Sculpture"],
    tagline: "One can depart, but the place does not release you.",
    price: "£1,500",
    availability: "Limited edition · 12 remaining",
    remaining: "12 remaining",
    size: "One size",
    preview: {
      src: "/audio/garment-01-preview.mp3",
      duration: "0:30",
      waveform: [
        4, 12, 14, 13, 10, 14, 20, 25, 27, 29, 33, 30, 28, 25, 26, 28, 31, 31, 26, 23, 21, 23, 25, 28,
        24, 21, 21, 19, 21, 25, 21, 22, 26, 28, 27, 28, 28, 26, 23, 26, 22, 27, 29, 25, 25, 27, 26, 26,
      ],
    },
    room: {
      track: "/audio/garment-01-track.mp3",
      // Placeholder timings until the real ones are known.
      lyrics: [
        { time: 4, text: "I look for truth in the early 2000s." },
        { time: 12, text: "I look for reimagined fragments of me," },
        { time: 20, text: "and the rest of you, in the simplicity of early technology." },
        { time: 30, text: "I pull the white noise closer to me, hoping it will take me along." },
      ],
      verse: [
        "I look for truth in the early 2000s.",
        "I look for reimagined fragments of me,",
        "and the rest of you, in the simplicity of early technology.",
        "I pull the white noise closer to me, hoping it will take me along.",
      ],
    },
    gallery: [
      {
        src: "/images/garment-01.webp",
        alt: "White coat with hand-drawn black lettering, worn on concrete steps beneath tower blocks",
        width: 590,
        height: 760,
      },
      {
        src: "/images/garment-01-2.webp",
        alt: "Model in the coat with painted beige sleeves, a blue checked bag over her shoulder, in front of a brutalist housing block",
        width: 1253,
        height: 1875,
      },
      {
        src: "/images/garment-01-3.webp",
        alt: "Close-up of the coat's spray-painted lettering, a string bag of oranges on her arm, a balconied tower behind",
        width: 1253,
        height: 1875,
      },
      {
        src: "/images/garment-01-4.webp",
        alt: "Model in the coat on concrete steps beside a handrail, holding a large blue checked bag",
        width: 1253,
        height: 1875,
      },
      {
        src: "/images/garment-01-5.webp",
        alt: "Model on a concrete ledge swinging a string bag of oranges against a blue sky and tower blocks",
        width: 1253,
        height: 1875,
      },
    ],
    requestPhoto: 3,
    details: [
      { title: "Fabric & Making" },
      { title: "Sizing" },
      { title: "Shipping" },
      { title: "Sound tech & Listening Rooms" },
    ],
    concept: {
      paragraphs: [
        "To return is always, in some way, to depart. We carry the concept of home like a subtle, persistent weight. Opening this collection, the first piece explores our pull towards places we can no longer reach, and why certain environments, objects, and felt stillness hold onto us even after we’ve let go.",
        "It is haunting how deeply we are carved out by the everyday world around us.",
      ],
      image: {
        src: "/images/garment-01-concept.webp",
        alt: "Black-and-white photo of a hand resting on a tiled wall sprayed with graffiti, tower blocks behind",
        width: 1836,
        height: 1056,
      },
      quote: "“Lying in squares made out of concrete.”",
    },
    credits: [
      { name: "Jasiek Szczepańczyk", role: "Music composer, Producer & Audio Engineer" },
      { name: "Andy Lenárt", role: "Lyricist, Spoken Word Artist & Creative Director" },
    ],
    inside: {
      title: ["Listening Room only", "its owners can enter"],
      paragraphs: [
        [
          { text: "Wearing this coat gives you access to a " },
          { text: "private listening space.", strong: true },
          { text: " Tapping the garment and inputting the keyword printed inside unlocks your design’s distinct " },
          { text: "ambient track", strong: true },
          { text: ", part of a 10-piece sound collection." },
        ],
        [
          { text: "Each room leads directly into " },
          { text: "The Staircase: a communal digital space", strong: true },
          { text: " where owners of every piece connect to share their thoughts." },
        ],
      ],
      image: { alt: "Blurred glimpse of the Listening Room", width: 560, height: 360 },
    },
  },
];

export const getGarment = (slug: string) => GARMENTS.find((g) => g.slug === slug);

export const garmentHref = (slug: string) => `/collection/${slug}`;
