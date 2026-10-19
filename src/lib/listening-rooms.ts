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
    // Figma "02 — PAPER WALLS". It plays the first track until its own is added.
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
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
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
    // Figma "04 — SOVIET SUNSET". It plays the first track until its own is added.
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
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
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
    // Figma "06 — SYMMETRICA". It plays the first track until its own is added.
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
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
    verse: [],
    collage: "symmetrica",
  },
  {
    // Figma "07 — ALIENS AND HERONS". It plays the first track until its own is added.
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
    track: pelican?.track,
    lyrics: pelican?.lyrics ?? [],
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
