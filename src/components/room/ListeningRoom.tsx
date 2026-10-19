import { existsSync } from "node:fs";
import path from "node:path";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { RoomAudioProvider, RoomCurrentLine } from "@/components/room/RoomAudio";
import { RoomHeader } from "@/components/room/RoomHeader";
import { RoomTape } from "@/components/room/RoomTape";
import { fs } from "@/lib/design";
import type { ListeningRoomInfo } from "@/lib/listening-rooms";

/**
 * Placement on the two artboards: [x, y, width, height?] in design px.
 * Mobile is the 390px frame (y measured from below its header, 100px),
 * desktop the 1440px frame (y from below its header, 200px).
 */
type Box = [number, number, number, number?];
/** An item without one of the two boxes is left out of that layout. */
type Place = { m?: Box; d?: Box };

const placeStyle = ({ m, d }: Place, rotate?: number) =>
  ({
    "--mx": m?.[0],
    "--my": m?.[1],
    "--mw": m?.[2],
    "--dx": d?.[0],
    "--dy": d?.[1],
    "--dw": d?.[2],
    ...(m?.[3] ? { "--mr": `${m[2]} / ${m[3]}` } : {}),
    ...(d?.[3] ? { "--dr": `${d[2]} / ${d[3]}` } : {}),
    ...(rotate ? { rotate: `${rotate}deg` } : {}),
  }) as CSSProperties;

type Picture = {
  /** File in public/images; until it exists a placeholder holds its place. */
  file: string;
  alt: string;
  /** Figma layer to export it from. */
  layer: string;
  place: Place;
  /** Hand-lettering sits on top of the photos and keeps its transparency. */
  lettering?: boolean;
  objectPosition?: string;
  rotate?: number;
  /** Blend mode the design gives the layer. */
  blend?: "plus-lighter" | "difference" | "luminosity" | "lighten";
};

// Order is stacking order: the lettering comes after the photo it overlaps.
const PELICAN_PICTURES: Picture[] = [
  {
    file: "room-photo-road.png",
    alt: "Faded colour photo of a road past prefab tower blocks, a car driving by",
    layer: "R1-01944-0028 2",
    place: { m: [69, 437, 250, 179], d: [242, 435, 348, 250] },
  },
  {
    file: "room-hold-on.png",
    alt: "Handwritten: Hold on —",
    layer: "so endlessly 2 3",
    place: { m: [251, 546, 135, 170], d: [496, 587, 188, 237] },
    lettering: true,
  },
  {
    file: "room-photo-sledges.png",
    alt: "Black-and-white photo of children pulling sledges through the snow",
    layer: "R1-01944-0028 1",
    place: { m: [28, 784, 160, 113], d: [154, 872, 238, 167] },
    objectPosition: "bottom",
  },
  {
    file: "room-photo-tortoise.png",
    alt: "Black-and-white photo of hands holding a small tortoise",
    layer: "R1-01944-0028 3",
    place: { m: [199, 784, 160, 113], d: [408, 872, 237, 167] },
  },
  {
    file: "room-so-endlessly.png",
    alt: "Handwritten: So endlessly fragmented",
    layer: "so endlessly 2 1",
    place: { m: [109, 837, 272, 170], d: [274, 950, 404, 252] },
    lettering: true,
  },
  {
    file: "room-photo-pelican.png",
    alt: "Black-and-white photo of the pelican sculpture on its plinth in a reedy pond",
    layer: "R1-01944-0030 1",
    place: { m: [85, 975, 160, 220], d: [723, 557, 273, 375] },
  },
  {
    file: "room-was-that.png",
    alt: "Handwritten: Was that the only way to survive?",
    layer: "was that.... 1",
    place: { m: [115, 953, 293, 183], d: [775, 519, 500, 313] },
    lettering: true,
  },
];

// "Paper Walls" (Figma "02 — PAPER WALLS"); the photos and the line sit under its lettering.
const PAPER_WALLS_PICTURES: Picture[] = [
  {
    file: "room-02-photo-paper-walls.png",
    alt: "Black-and-white photo of two men at a table in front of a bookcase",
    layer: "2026-10-05 14-50 page 5 4",
    place: { m: [73, 1008, 243, 156], d: [718, 602, 464, 298] },
  },
  {
    file: "room-02-photo-decanter.png",
    alt: "Black-and-white photo of a crystal decanter and glasses on a shelf beside a child's portrait",
    layer: "2026-10-05 14-50 page 5 2",
    place: { m: [49, 443, 292, 205], d: [202, 431, 412, 289] },
  },
  {
    file: "room-02-photo-sofa.png",
    alt: "Faded colour photo of a child standing by a sofa in a dim living room",
    layer: "2026-10-05 14-50 page 5 1",
    place: { m: [107, 684, 181, 127], d: [307, 785, 275, 193] },
  },
  {
    file: "room-02-line.png",
    alt: "",
    layer: "lines 2",
    place: { m: [20, 536, 248, 568], d: [202, 566, 248, 568] },
    lettering: true,
  },
  {
    file: "room-02-communal-shame.png",
    alt: "Handwritten: Communal shame",
    layer: "communal shame 2",
    place: { m: [33, 562, 222, 322], d: [180, 651, 275, 399] },
    lettering: true,
  },
];

// "The Blueprint" (Figma "03 — THE BLUEPRINT"). The family photo appears
// three times, smaller each time.
const FAMILY = {
  file: "room-03-photo-family.png",
  alt: "Black-and-white photo of a mother with two small children on her lap",
  layer: "2026-10-05 14-50 page 5 6",
};

const BLUEPRINT_PICTURES: Picture[] = [
  {
    file: "room-03-photo-tv.png",
    alt: "Faded colour photo of an old television on a small table between patterned curtains",
    layer: "2026-10-05 14-50 page 5 6",
    place: { m: [70, 450, 257, 169.8], d: [233, 433, 390.5, 258] },
  },
  {
    file: "room-03-staying.png",
    alt: "Handwritten: Staying",
    layer: "cas 2",
    place: { m: [88.3, 474.1, 252.7, 121.7], d: [260.8, 469.6, 384, 185] },
    lettering: true,
    blend: "plus-lighter",
  },
  {
    file: "room-03-photo-kitchen.png",
    alt: "Black-and-white photo of a woman sitting at a glass table in a living room",
    layer: "2026-10-05 14-50 page 5 5",
    place: { m: [110, 699, 236, 164], d: [327, 774, 335, 233] },
  },
  { ...FAMILY, place: { m: [46, 939, 114.3, 151], d: [729, 634, 200, 264.3] } },
  { ...FAMILY, alt: "", place: { m: [185, 964, 81, 107], d: [966.1, 691.2, 141.8, 187.3] } },
  { ...FAMILY, alt: "", place: { m: [291, 981, 54, 71.3], d: [1148.5, 720.9, 94.5, 124.8] } },
  {
    file: "room-03-asking.png",
    alt: "Handwritten: I am asking, while I know I can't",
    layer: "cas 2 + cas 3",
    place: { m: [212, 1084, 189.5, 77.1], d: [1007.3, 906.2, 331.7, 134.9] },
    lettering: true,
    blend: "difference",
  },
];

// "Soviet Sunset" (Figma "04 — SOVIET SUNSET"). Only the phone collage is
// designed; desktop sets the same pieces in two columns, 1.5× the phone size.
const SUNSET_SQUARE: Picture = {
  file: "room-04-photo-square.png",
  alt: "Faded photo of a crowd with flags filling a square in front of a domed museum",
  layer: "2026-10-05 14-50 page 5 9",
  place: { m: [100.8, 480.7, 172.6, 133.3], d: [295.7, 571.5, 258.9, 200] },
  blend: "luminosity",
};

const SUNSET_PICTURES: Picture[] = [
  {
    file: "room-04-walls-and-wires.png",
    alt: "Two men in a living room; handwritten: walls and wires",
    layer: "Group 1418:297",
    place: { m: [41, 756, 247.1, 114.2], d: [839.6, 500, 370.6, 171.3] },
  },
  {
    file: "room-04-photo-protest.png",
    alt: "Faded photo of a crowd in front of a monument covered in posters and flags",
    layer: "2026-10-05 14-50 page 5 8",
    place: { m: [56, 909, 273, 166], d: [862.6, 729.5, 409.5, 249] },
    blend: "luminosity",
  },
  {
    file: "room-04-stand.png",
    alt: "Handwritten: Stand",
    layer: "Group 1347:69",
    place: { m: [14.3, 1064, 184.6, 100.7], d: [780, 1050, 240, 131] },
    lettering: true,
  },
];

// "Stations of Comfort" (Figma "05 — STATIONS OF COMFORT"). Only the phone
// collage is designed; desktop sets it in two columns, 1.5× the phone size.
const COMFORT_PICTURES: Picture[] = [
  {
    file: "room-05-abstract.png",
    alt: "",
    layer: "ABSTRACT 1",
    place: { m: [0, 819, 390, 381], d: [720, 579.5, 585, 571.5] },
    lettering: true,
  },
  {
    file: "room-05-photo-tower.png",
    alt: "Dim photo of a tower block against the sky",
    layer: "2026-10-05 14-50 page 5 15",
    place: { m: [75, 960, 229, 158], d: [832.5, 791, 343.5, 237] },
    // The layer is at 20% opacity, so the brush stroke shows through it.
    blend: "lighten",
  },
  {
    file: "room-05-photo-bench.png",
    alt: "Black-and-white photo of an empty park bench",
    layer: "2026-10-05 14-50 page 5 14",
    place: { m: [229, 986, 121, 95], d: [1063.5, 830, 181.5, 142.5] },
  },
  {
    file: "room-05-photo-sculpture.png",
    alt: "Black-and-white photo of a concrete sculpture between bushes in front of a housing block",
    layer: "2026-10-05 14-50 page 5 11",
    place: { m: [48, 464, 122, 165], d: [170, 552.8, 183, 247.5] },
  },
  {
    file: "room-05-photo-doorway.png",
    alt: "Black-and-white photo of a graffitied doorway with a bicycle in front",
    layer: "2026-10-05 14-50 page 5 13",
    place: { m: [190, 464, 110, 165], d: [383, 552.8, 165, 247.5] },
  },
];

const COMFORT_FRUIT: Picture = {
  file: "room-05-photo-fruit.png",
  alt: "Black-and-white photo of a table heaped with fruit",
  layer: "2026-10-05 14-50 page 5 10",
  place: { m: [82, 766, 173, 125], d: [843, 500, 259.5, 187.5] },
};

const TAPE_FILE = "room-cassette.webp";

/** What every room shares; only where it sits differs. */
type Layout = {
  /** Stage height below the header, mobile / desktop design px. */
  height: [number, number];
  touch: Place;
  tape: Place;
  listen: Place;
  intro: Place;
  exit: Place;
};

const LAYOUTS: Record<ListeningRoomInfo["collage"], Layout> = {
  pelican: {
    height: [1380, 1258],
    touch: { m: [95, 38, 200], d: [556, 65, 324] },
    tape: { m: [105, 75, 189, 120], d: [556, 120, 324, 206] },
    // The export already carries the layer's slight tilt.
    listen: { m: [171, 131, 202.5, 133.8], d: [669.2, 216.5, 347.4, 229.5] },
    intro: { m: [48, 265, 300], d: [98, 138, 420] },
    exit: { m: [0, 1298, 390], d: [420, 1140, 600] },
  },
  "paper-walls": {
    height: [1466, 1258],
    touch: { m: [95, 54, 200], d: [556, 65, 324] },
    tape: { m: [103, 91, 189, 120], d: [556, 120, 324, 206] },
    listen: { m: [169, 147, 202.5, 133.8], d: [669.2, 216.5, 347.4, 229.5] },
    intro: { m: [46, 281, 300], d: [98, 138, 420] },
    exit: { m: [0, 1298, 390], d: [420, 1164, 600] },
  },
  blueprint: {
    height: [1466, 1258],
    touch: { m: [95, 54, 200], d: [556, 65, 324] },
    tape: { m: [103, 91, 189, 120], d: [556, 120, 324, 206] },
    listen: { m: [169, 147, 202.5, 133.8], d: [669.2, 216.5, 347.4, 229.5] },
    intro: { m: [46, 281, 300], d: [98, 138, 420] },
    exit: { m: [0, 1298, 390], d: [420, 1164, 600] },
  },
  "soviet-sunset": {
    height: [1466, 1330],
    touch: { m: [95, 54, 200], d: [556, 65, 324] },
    tape: { m: [103, 91, 189, 120], d: [556, 120, 324, 206] },
    listen: { m: [169, 147, 202.5, 133.8], d: [669.2, 216.5, 347.4, 229.5] },
    intro: { m: [46, 281, 300], d: [98, 138, 420] },
    exit: { m: [0, 1298, 390], d: [420, 1236, 600] },
  },
  "stations-of-comfort": {
    height: [1466, 1330],
    touch: { m: [95, 54, 200], d: [556, 65, 324] },
    tape: { m: [103, 91, 189, 120], d: [556, 120, 324, 206] },
    listen: { m: [169, 147, 202.5, 133.8], d: [669.2, 216.5, 347.4, 229.5] },
    intro: { m: [46, 281, 300], d: [98, 138, 420] },
    exit: { m: [0, 1298, 390], d: [420, 1236, 600] },
  },
};

// The cassette photo is 1177×748; its reel hubs sit at x 342 / 837, y 322.
const CASSETTE = { w: 1177, h: 748, cy: 322, r: 95 };
const REELS = [342, 837];

/**
 * A reel hub cut out of the photo as a circle; it turns while the track
 * plays (see .room-reel in globals.css).
 */
function Reel({ cx }: { cx: number }) {
  const { w, h, cy, r } = CASSETTE;
  const d = 2 * r;
  return (
    <span
      aria-hidden
      className="room-reel absolute aspect-square overflow-hidden rounded-full"
      style={{ left: `${((cx - r) / w) * 100}%`, top: `${((cy - r) / h) * 100}%`, width: `${(d / w) * 100}%` }}
    >
      <span
        className="absolute block"
        style={{
          left: `${(-(cx - r) / d) * 100}%`,
          top: `${(-(cy - r) / d) * 100}%`,
          width: `${(w / d) * 100}%`,
          height: `${(h / d) * 100}%`,
          backgroundImage: `url(/images/${TAPE_FILE})`,
          backgroundSize: "100% 100%",
        }}
      />
    </span>
  );
}


const imageExists = (file: string) => existsSync(path.join(process.cwd(), "public/images", file));

function Art({ picture, sizes }: { picture: Picture; sizes: string }) {
  if (!imageExists(picture.file)) {
    // Until the file is exported from Figma: a quiet outline with the layer name.
    return (
      <div
        role="img"
        aria-label={picture.alt}
        className={`flex size-full items-center justify-center p-1 text-center text-[10px] leading-tight text-white/40 ${
          picture.lettering ? "border border-dashed border-white/20" : "bg-[#1c1c1c]"
        }`}
      >
        {picture.layer}
      </div>
    );
  }
  return (
    <Image
      src={`/images/${picture.file}`}
      alt={picture.alt}
      fill
      sizes={sizes}
      className={picture.lettering ? "object-contain" : "object-cover"}
      style={picture.objectPosition ? { objectPosition: picture.objectPosition } : undefined}
    />
  );
}

function Placed({
  place,
  rotate,
  className = "",
  children,
}: {
  place: Place;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`room-item ${place.m ? "" : "max-md:hidden"} ${place.d ? "" : "md:hidden"} ${className}`}
      style={placeStyle(place, rotate)}
    >
      {children}
    </div>
  );
}

function PelicanCollage({ room }: { room: ListeningRoomInfo }) {
  return (
    <>
      {PELICAN_PICTURES.map((picture) => (
        <Pictured key={picture.file} picture={picture} />
      ))}

      <Placed place={{ m: [20, 666, 350], d: [175, 744, 481] }} className="text-center">
        <p className="font-normal leading-[normal] text-[12px] md:text-[clamp(12px,calc(16*var(--u)),16px)]">
          {room.verse.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Placed>

      <Placed place={{ d: [916, 793, 482] }}>
        <p className="font-bold leading-[normal] uppercase text-[#efefef]" style={{ fontSize: fs(40, 24) }}>
          {room.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Placed>
    </>
  );
}

const lettering = "font-bold leading-[0.85] whitespace-nowrap text-white";

function PaperWallsCollage() {
  return (
    <>
      {PAPER_WALLS_PICTURES.map((picture) => (
        <Pictured key={picture.file} picture={picture} />
      ))}

      <Placed place={{ m: [129, 1067, 200], d: [830, 720, 330] }} className="pointer-events-none">
        <p className={`${lettering} text-[20px] md:text-[clamp(20px,calc(32*var(--u)),32px)]`}>
          <span className="block">zvuk</span>
          <span className="block">we live in walls</span>
        </p>
      </Placed>
      <Placed place={{ m: [186, 895, 190], d: [191, 1121, 300] }}>
        <p className={`${lettering} text-[16px] md:text-[clamp(16px,calc(24*var(--u)),24px)]`}>
          <span className="block">If I left yesterday,</span>
          <span className="block">would today’s silence</span>
          <span className="block">surprise you?</span>
        </p>
      </Placed>

      <Placed place={{ d: [718, 918, 143] }} className="text-center">
        <p className="font-medium leading-[normal] whitespace-nowrap text-[#efefef]" style={{ fontSize: fs(20, 14) }}>
          PAPER WALLS
        </p>
      </Placed>
      <Placed place={{ m: [0, 1418, 390] }} className="text-center">
        <p className="text-[16px] font-medium leading-[normal] text-[#efefef]">02 / PAPER WALLS</p>
      </Placed>
    </>
  );
}

const BLEND = {
  "plus-lighter": "mix-blend-plus-lighter",
  difference: "mix-blend-difference",
  luminosity: "mix-blend-luminosity",
  lighten: "mix-blend-lighten",
};

// The big SUN / SET letters break inside their narrow boxes, as in the design.
const bigLetters =
  "text-center font-medium leading-[1.2] text-[#efefef] text-[calc(90*var(--m))] md:text-[calc(135*var(--u))]";

function SovietSunsetCollage() {
  return (
    <>
      <Placed place={{ m: [17, 433, 172.4], d: [170, 500, 258.6] }} className="pointer-events-none">
        <p aria-hidden className={bigLetters}>
          <span className="block">SU</span>
          <span className="block">N</span>
        </p>
      </Placed>
      <Placed place={{ m: [189.4, 576.8, 161.6], d: [428.6, 715.8, 242.4] }} className="pointer-events-none mix-blend-difference">
        <p aria-hidden className={bigLetters}>
          <span className="block">SE</span>
          <span className="block">T</span>
        </p>
      </Placed>
      <Pictured picture={SUNSET_SQUARE} />

      <Placed place={{ m: [29, 678, 310], d: [188, 867.5, 465] }}>
        <blockquote className="font-bold leading-[1.1] text-white text-[12px] md:text-[clamp(14px,calc(18*var(--u)),18px)]">
          <span className="block">‘Let us not falsify words and concepts.</span>
          <span className="block">What is crooked cannot be straight,</span>
          <span className="block">even if we say so a hundred times.’</span>
        </blockquote>
      </Placed>

      {SUNSET_PICTURES.map((picture) => (
        <Pictured key={picture.file} picture={picture} />
      ))}

      <Placed place={{ d: [972, 992, 300] }} className="text-right">
        <p className="font-bold leading-[normal] whitespace-nowrap text-[#efefef]" style={{ fontSize: fs(36, 20) }}>
          SOVIET SUNSET
        </p>
      </Placed>
      <Placed place={{ m: [0, 1419, 390] }} className="text-center">
        <p className="text-[16px] font-medium leading-[normal] text-[#efefef]">04 / SOVIET SUNSET</p>
      </Placed>
    </>
  );
}

function BlueprintCollage() {
  return (
    <>
      {BLUEPRINT_PICTURES.slice(0, 3).map((picture) => (
        <Pictured key={picture.file} picture={picture} />
      ))}

      {/* Set slightly out of focus, as in the design. */}
      <Placed place={{ m: [53, 674, 160], d: [233, 735, 361] }} className="pointer-events-none">
        <p className="font-medium leading-[normal] whitespace-pre text-[#efefef] blur-[1px]">
          <span className="block text-[16px] md:text-[clamp(16px,calc(30*var(--u)),30px)]">absence met</span>
          <span className="block text-[20px] md:text-[clamp(20px,calc(32*var(--u)),32px)]">
            {"with      "}
            <span className="font-bold line-through">isolation</span>
          </span>
        </p>
      </Placed>

      <Placed place={{ d: [729, 580, 162] }} className="text-center">
        <p className="font-medium leading-[normal] whitespace-nowrap text-[#efefef]" style={{ fontSize: fs(20, 14) }}>
          THE BLUEPRINT
        </p>
      </Placed>

      {BLUEPRINT_PICTURES.slice(3).map((picture, i) => (
        <Pictured key={`${picture.file}-${i}`} picture={picture} />
      ))}

      <Placed place={{ m: [0, 1419, 390] }} className="text-center">
        <p className="text-[16px] font-medium leading-[normal] text-[#efefef]">03 / THE BLUEPRINT</p>
      </Placed>
    </>
  );
}

function StationsOfComfortCollage() {
  return (
    <>
      {COMFORT_PICTURES.map((picture) => (
        <Pictured key={picture.file} picture={picture} />
      ))}

      <Placed place={{ m: [96, 428.8, 200], d: [242, 500, 300] }} className="pointer-events-none mix-blend-difference">
        <p aria-hidden className="font-bold leading-[1.1] text-white text-[calc(64*var(--m))] md:text-[calc(96*var(--u))]">
          1322
        </p>
      </Placed>

      <Pictured picture={COMFORT_FRUIT} />

      <Placed place={{ m: [66, 665, 300], d: [197, 854.3, 460] }}>
        <p className="font-medium leading-[normal] text-[#efefef] text-[14px] md:text-[clamp(16px,calc(21*var(--u)),21px)]">
          <span className="block">Ritualistic simplicity.</span>
          <span className="block">Testing life early.</span>
          <span className="block font-bold">Places designed to design us in return.</span>
        </p>
      </Placed>

      <Placed place={{ m: [179, 1135, 200], d: [988.5, 1053.5, 300] }}>
        <p className="font-medium leading-[normal] whitespace-nowrap text-[#efefef] text-[12px] md:text-[clamp(13px,calc(18*var(--u)),18px)]">
          …with smoke and a few bottles.
        </p>
      </Placed>
      <Placed place={{ m: [266, 1154.3, 81, 41], d: [1119, 1082.4, 121.5, 61.5] }} className="pointer-events-none">
        <Art picture={{ file: "room-05-and-more.png", alt: "Handwritten: and more", layer: "Group 2085663286", place: {}, lettering: true }} sizes="120px" />
      </Placed>

      <Placed place={{ d: [170, 990, 500] }}>
        <p className="font-bold leading-[normal] whitespace-nowrap text-[#efefef]" style={{ fontSize: fs(36, 20) }}>
          STATIONS OF COMFORT
        </p>
      </Placed>
      <Placed place={{ m: [0, 1418, 390] }} className="text-center">
        <p className="text-[16px] font-medium leading-[normal] text-[#efefef]">05 / STATIONS OF COMFORT</p>
      </Placed>
    </>
  );
}

function Pictured({ picture }: { picture: Picture }) {
  return (
    <Placed
      place={picture.place}
      className={`${picture.lettering ? "pointer-events-none" : ""} ${picture.blend ? BLEND[picture.blend] : ""}`}
    >
      <Art picture={picture} sizes="(min-width: 768px) 30vw, 70vw" />
    </Placed>
  );
}

/**
 * A Listening Room (Figma "09 — Listening Room (mobile)", "14 — Listening
 * Room (desktop)", "02 — PAPER WALLS", "03 — THE BLUEPRINT", "04 — SOVIET SUNSET" and "05 —
 * STATIONS OF COMFORT"): a black collage around the tape
 * that plays the room's track. Both layouts are absolute collages measured
 * in their own artboard's units (see .room-stage in globals.css).
 */
export function ListeningRoom({ room }: { room: ListeningRoomInfo }) {
  const staircase = `/room/${room.slug}/staircase`;
  const layout = LAYOUTS[room.collage];
  const tape: Picture = {
    file: TAPE_FILE,
    alt: "A TDK cassette tape",
    layer: "spinning_cassette_realistic 1",
    place: layout.tape,
  };
  const listen: Picture = {
    file: "room-listen.png",
    alt: "Handwritten: Listen",
    layer: "Unnamed 1",
    place: layout.listen,
    lettering: true,
  };

  return (
    <div className="min-h-dvh overflow-x-clip bg-black text-white">
      <div className="mx-auto w-full max-w-[1440px] [container-type:inline-size]">
        <RoomHeader tone="dark" label="The Staircase" href={staircase} />

        <RoomAudioProvider src={room.track}>
        <main
          className="room-stage"
          aria-labelledby="room-title"
          style={{ "--mh": layout.height[0], "--dh": layout.height[1] } as CSSProperties}
        >
          <Placed place={layout.touch} className="text-center">
            <p className="font-normal leading-[normal] text-[#efefef]" style={{ fontSize: `clamp(12px, calc(24 * var(--u)), 24px)` }}>
              TOUCH THE TAPE
            </p>
          </Placed>

          <Placed place={tape.place}>
            <RoomTape title={`the track of ${room.titleLines.join(" ")}`}>
              <span className="relative block size-full">
                <Art picture={tape} sizes="(min-width: 768px) 23vw, 50vw" />
                {imageExists(TAPE_FILE) && REELS.map((cx) => <Reel key={cx} cx={cx} />)}
              </span>
            </RoomTape>
          </Placed>
          <Placed place={listen.place} className="pointer-events-none">
            <Art picture={listen} sizes="(min-width: 768px) 24vw, 50vw" />
          </Placed>

          <Placed place={layout.intro}>
            <p className="font-normal leading-[normal] text-[#efefef] text-[13px] md:text-[clamp(14px,calc(24*var(--u)),24px)]">
              No. {room.garmentNo} / DEPARTURES 1322
            </p>
            <h1 id="room-title" className="sr-only">
              Listening Room — {room.titleLines.join(" ")}
            </h1>
            <RoomCurrentLine
              lines={room.lyrics}
              className="mt-[calc(15*var(--m))] w-[calc(220*var(--m))] text-[24px] leading-[0.85] font-bold uppercase md:mt-[calc(13*var(--u))] md:w-[calc(333*var(--u))] md:text-[clamp(24px,calc(40*var(--u)),40px)]"
            />
          </Placed>

          {room.collage === "pelican" && <PelicanCollage room={room} />}
          {room.collage === "paper-walls" && <PaperWallsCollage />}
          {room.collage === "blueprint" && <BlueprintCollage />}
          {room.collage === "soviet-sunset" && <SovietSunsetCollage />}
          {room.collage === "stations-of-comfort" && <StationsOfComfortCollage />}

          <Placed place={layout.exit} className="text-center">
            <Link
              href={staircase}
              className="text-[15px] font-medium uppercase text-[#efefef] underline underline-offset-4 transition-opacity hover:opacity-70 md:text-[clamp(15px,calc(20*var(--u)),20px)]"
            >
              Exit to the Staircase
            </Link>
          </Placed>
        </main>
        </RoomAudioProvider>
      </div>
    </div>
  );
}
