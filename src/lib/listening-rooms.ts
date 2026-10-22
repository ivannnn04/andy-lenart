/**
 * Listening Rooms. Each one lives at /room/[slug] behind its own keyword
 * gate and leads to its own Staircase. A room belongs to a garment (its
 * number and concept text); `collage` picks the room's artwork in
 * components/room/ListeningRoom.tsx.
 */
import { getGarment, type Garment, type GarmentImage } from "@/lib/garments";

export type ListeningRoomInfo = {
  slug: string;
  /** The garment the room belongs to ("No. 01 / DEPARTURES 1322"). */
  garmentNo: string;
  /** Room name, as it breaks in the design. */
  titleLines: string[];
  /** Shown beside the gate on desktop. */
  photo?: GarmentImage;
  /** The concept text whose third word opens the room. */
  concept: string[];
  /** See Garment["room"]. */
  track?: string;
  lyrics: Garment["room"]["lyrics"];
  verse: string[];
  collage:
    | "pelican"
    | "paper-walls" | "blueprint" | "soviet-sunset" | "stations-of-comfort" | "symmetrica"
    | "aliens-and-herons"
    | "philosophy-of-form"
    | "the-signatures"
    | "funkce";
};

function fromGarment(slug: string, collage: ListeningRoomInfo["collage"]): ListeningRoomInfo | undefined {
  const garment = getGarment(slug);
  if (!garment) return undefined;
  return {
    slug,
    garmentNo: garment.no,
    titleLines: garment.titleLines,
    photo: garment.gallery[garment.requestPhoto],
    concept: garment.concept.paragraphs,
    ...garment.room,
    collage,
  };
}

const pelican = fromGarment("born-by-the-pelican-sculpture", "pelican");

export const ROOMS: ListeningRoomInfo[] = [
  ...(pelican ? [pelican] : []),
  {
    // Figma "02 — PAPER WALLS".
    slug: "paper-walls",
    garmentNo: "02",
    titleLines: ["Paper Walls"],
    photo: {
      src: "/images/room-02-photo-paper-walls.png",
      alt: "Black-and-white photo of two men at a table in front of a bookcase",
      width: 464,
      height: 298,
    },
    concept: pelican?.concept ?? [],
    track: "/audio/paper-walls-track.m4a",
    // From the track's .lrc file (stray "you" lines and a "*scream*" tag left out).
    lyrics: [
      { time: 26.77, text: "Dílení se stin" },
      { time: 30.04, text: "overlapping with yours." },
      { time: 34.9, text: "Beautiful dance of voices." },
      { time: 41.01, text: "so far." },
      { time: 42.87, text: "I read Starling" },
      { time: 48.08, text: "any link in the" },
      { time: 52.02, text: "I'm a tiny, spoutin' a so-dry" },
      { time: 58.8, text: "about you." },
      { time: 71.48, text: "The sound of your love." },
      { time: 76.34, text: "crying" },
      { time: 79.16, text: "Sound." },
      { time: 80.92, text: "you exchange." },
      { time: 84.37, text: "Where my life begins, where yours ends." },
      { time: 88.95, text: "Where my life ends and your begins." },
      { time: 94, text: "She's in the vest middle." },
      { time: 95.8, text: "So sit down, let's talk" },
      { time: 99.64, text: "Chum." },
      { time: 100.88, text: "Meho života" },
      { time: 104.18, text: "Your eyes reflecting in my window." },
      { time: 110.23, text: "transparent walls" },
      { time: 112.66, text: "Your hopes." },
      { time: 116.28, text: "every layer" },
      { time: 118.32, text: "with every little story." },
      { time: 121.78, text: "I love you." },
      { time: 123.99, text: "Always trusting them." },
      { time: 128.21, text: "And you, always trust in them." },
      { time: 138.64, text: "and when the sun" },
      { time: 140.72, text: "That she's thinking great walls" },
      { time: 143.76, text: "You know." },
      { time: 147.03, text: "It's the morning." },
    ],
    verse: [],
    collage: "paper-walls",
  },
  {
    // Figma "03 — THE BLUEPRINT". It plays the first track until its own is added.
    slug: "the-blueprint",
    garmentNo: "03",
    titleLines: ["The Blueprint"],
    photo: {
      src: "/images/room-03-photo-family.png",
      alt: "Black-and-white photo of a mother with two small children on her lap",
      width: 201,
      height: 265,
    },
    concept: pelican?.concept ?? [],
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
    verse: [],
    collage: "blueprint",
  },
  {
    // Figma "04 — SOVIET SUNSET".
    slug: "soviet-sunset",
    garmentNo: "04",
    titleLines: ["Soviet Sunset"],
    photo: {
      src: "/images/room-04-photo-protest.png",
      alt: "Faded colour photo of a crowd in front of a monument covered in posters and flags",
      width: 273,
      height: 166,
    },
    concept: pelican?.concept ?? [],
    track: "/audio/soviet-sunset-track.m4a",
    // From the track's .srt file: stray "you" lines, *tags* and ♪ marks left
    // out, long lines split into phrases timed across their cue.
    lyrics: [
      { time: 47.54, text: "The archaeological work is never completely free." },
      { time: 54.42, text: "It is a collective work." },
      { time: 81.2, text: "standing" },
      { time: 87.06, text: "The other side." },
      { time: 91.86, text: "We witness" },
      { time: 103.35, text: "frozen in moments" },
      { time: 111.67, text: "Frozen in patterns." },
      { time: 120.85, text: "De Belis mes polis." },
      { time: 128.53, text: "Ta-ta." },
      { time: 134.64, text: "Zippy Unity." },
      { time: 160.66, text: "After using the houses," },
      { time: 163.35, text: "he lost his uniform and became more" },
      { time: 167.45, text: "and more intelligent and open-minded." },
      { time: 175.19, text: "I'm not." },
      { time: 183.09, text: "Yes, they were. I'm a genius." },
      { time: 191.03, text: "Best in the world, I don't know" },
      { time: 196.66, text: "I'm sure of all you have." },
      { time: 209.46, text: "I'm sorry." },
    ],
    verse: [],
    collage: "soviet-sunset",
  },
  {
    // Figma "05 — STATIONS OF COMFORT". It plays the first track until its own is added.
    slug: "stations-of-comfort",
    garmentNo: "05",
    titleLines: ["Stations of Comfort"],
    photo: {
      src: "/images/room-05-photo-sculpture.png",
      alt: "Black-and-white photo of a concrete sculpture between bushes in front of a housing block",
      width: 122,
      height: 165,
    },
    concept: pelican?.concept ?? [],
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
    verse: [],
    collage: "stations-of-comfort",
  },
  {
    // Figma "06 — SYMMETRICA".
    slug: "symmetrica",
    garmentNo: "06",
    titleLines: ["Symmetrica"],
    photo: {
      src: "/images/room-06-photo-tower.png",
      alt: "Black-and-white photo of a long housing block above trees",
      width: 275,
      height: 250,
    },
    concept: pelican?.concept ?? [],
    track: "/audio/symmetrica-track.m4a",
    // From the track's .srt file: stray "you" lines and *tags* left out, long
    // lines split into phrases timed across their cue.
    lyrics: [
      { time: 50.71, text: "Modern method of transport is used to build a large settlement for 50,000 inhabitants." },
      { time: 70.77, text: "Propanisat is its omnivore." },
      { time: 89.43, text: "that exposed me." },
      { time: 94.36, text: "For life itself." },
      { time: 97.36, text: "where I see the meaning of myself being one with stone." },
      { time: 102.71, text: "Taste yourself." },
      { time: 105.81, text: "The recognition." },
      { time: 108.4, text: "of oneself" },
      { time: 111.09, text: "I thought I was going to..." },
      { time: 113.75, text: "Such as this one here." },
      { time: 116.79, text: "Where is this guy?" },
      { time: 119.57, text: "Yeah, I'm in" },
      { time: 125.2, text: "Today, the first 10,000 inhabitants have found their new home." },
      { time: 135.22, text: "And as I stood there, in the dark," },
      { time: 137.76, text: "I saw that I was standing in a world made out of patterns," },
      { time: 142.1, text: "light and structure." },
      { time: 143.59, text: "Projected onto the walls, I could no longer see the skies." },
      { time: 149.01, text: "Ceramic pie square," },
      { time: 150.21, text: "that is the definition of who I am and will be." },
      { time: 153.65, text: "What I will dream of, where I will go." },
      { time: 156.31, text: "And staining ideals, I will go wherever you can trust thorns." },
      { time: 161.3, text: "Spin Kopa, standing on the sea." },
      { time: 164.79, text: "prettier than any place." },
      { time: 166.94, text: "You will never stop shaping me." },
      { time: 169.72, text: "The one farm that is me." },
    ],
    verse: [],
    collage: "symmetrica",
  },
  {
    // Figma "07 — ALIENS AND HERONS".
    slug: "aliens-and-herons",
    garmentNo: "07",
    titleLines: ["Aliens and Herons"],
    photo: {
      src: "/images/room-07-photo-hand.png",
      alt: "Black-and-white photo of a hand resting on a weathered stone sculpture",
      width: 306,
      height: 451,
    },
    concept: pelican?.concept ?? [],
    track: "/audio/aliens-and-herons-track.m4a",
    // From the track's .srt file (a stray "you" left out).
    lyrics: [
      { time: 90.45, text: "creating imagery." },
      { time: 92.05, text: "Thank you." },
      { time: 95.83, text: "leaving" },
      { time: 98.07, text: "Your silhouette." },
      { time: 100.72, text: "in that black and white tone" },
      { time: 105.75, text: "I'm exposing." },
      { time: 108.34, text: "All light." },
      { time: 110.61, text: "Náruči včerejších d" },
      { time: 113.27, text: "That's why I have you." },
      { time: 115.86, text: "Do you have a tabby" },
      { time: 118.2, text: "Such a scary expression." },
      { time: 120.79, text: "I see my days." },
      { time: 123.38, text: "Great" },
      { time: 125.91, text: "in the familiarity" },
      { time: 133.46, text: "In the crystal floor" },
      { time: 138.71, text: "My son." },
      { time: 143.44, text: "Cok ticha odráží se." },
      { time: 148.6, text: "I'm closer." },
      { time: 151.06, text: "The sound of silence echoes." },
      { time: 155.99, text: "falling to their ground." },
      { time: 163.76, text: "I'll be at the cabin." },
      { time: 166.68, text: "Can't speak." },
      { time: 168.79, text: "Space to high." },
      { time: 171.38, text: "I'm fragile." },
      { time: 178.96, text: "Basically, it's a minute." },
      { time: 181.56, text: "Like this stillness? Is there only blocks?" },
      { time: 194.16, text: "and blocks" },
      { time: 196.37, text: "And you're better now." },
    ],
    verse: [],
    collage: "aliens-and-herons",
  },
  {
    // Figma "08 — PHILOSOPHY OF FORM". It plays the first track until its own is added.
    slug: "philosophy-of-form",
    garmentNo: "08",
    titleLines: ["Philosophy of Form"],
    photo: {
      src: "/images/room-08-photo-shadows.png",
      alt: "Black-and-white photo of a tower block with leaf shadows across it",
      width: 350,
      height: 446,
    },
    concept: pelican?.concept ?? [],
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
    verse: [],
    collage: "philosophy-of-form",
  },
  {
    // Figma "09 — THE SIGNATURES". It plays the first track until its own is added.
    slug: "the-signatures",
    garmentNo: "09",
    titleLines: ["The Signatures"],
    photo: {
      src: "/images/room-09-graffiti.png",
      alt: "Black-and-white photos of graffiti tags layered over each other",
      width: 421,
      height: 553,
    },
    concept: pelican?.concept ?? [],
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
    verse: [],
    collage: "the-signatures",
  },
  {
    // Figma "10 — FUNKCE". It plays the first track until its own is added.
    slug: "funkce",
    garmentNo: "10",
    titleLines: ["Funkce"],
    photo: {
      src: "/images/room-10-photo-family.png",
      alt: "Faded colour photo of a family around a coffee table with bottles and fruit",
      width: 394,
      height: 270,
    },
    concept: pelican?.concept ?? [],
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
    verse: [],
    collage: "funkce",
  },
];

export const getRoom = (slug: string) => ROOMS.find((room) => room.slug === slug);
