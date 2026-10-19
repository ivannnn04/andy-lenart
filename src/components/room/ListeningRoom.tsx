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

function Pictured({ picture }: { picture: Picture }) {
  return (
    <Placed place={picture.place} className={picture.lettering ? "pointer-events-none" : ""}>
      <Art picture={picture} sizes="(min-width: 768px) 30vw, 70vw" />
    </Placed>
  );
}

/**
 * A Listening Room (Figma "09 — Listening Room (mobile)", "14 — Listening
 * Room (desktop)" and "02 — PAPER WALLS"): a black collage around the tape
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

          {room.collage === "pelican" ? <PelicanCollage room={room} /> : <PaperWallsCollage />}

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
