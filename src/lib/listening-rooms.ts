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
  collage: "pelican" | "paper-walls";
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
];

export const getRoom = (slug: string) => ROOMS.find((room) => room.slug === slug);
