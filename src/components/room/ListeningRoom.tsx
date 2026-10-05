import { existsSync } from "node:fs";
import path from "node:path";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { RoomAudioProvider, RoomLyrics } from "@/components/room/RoomAudio";
import { RoomTape } from "@/components/room/RoomTape";
import { fs } from "@/lib/design";
import type { Garment } from "@/lib/garments";
import { NAV } from "@/lib/nav";

/**
 * Placement on the two artboards: [x, y, width, height?] in design px.
 * Mobile is the 390px frame (y measured from below its header, 100px),
 * desktop the 1440px frame (y from below its header, 200px).
 */
type Box = [number, number, number, number?];
type Place = { m?: Box; d: Box };

const placeStyle = ({ m, d }: Place, rotate?: number) =>
  ({
    "--mx": m?.[0],
    "--my": m?.[1],
    "--mw": m?.[2],
    "--dx": d[0],
    "--dy": d[1],
    "--dw": d[2],
    ...(m?.[3] ? { "--mr": `${m[2]} / ${m[3]}` } : {}),
    ...(d[3] ? { "--dr": `${d[2]} / ${d[3]}` } : {}),
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
const PICTURES: Picture[] = [
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

const TAPE: Picture = {
  file: "room-cassette.webp",
  alt: "A TDK cassette tape",
  layer: "spinning_cassette_realistic 1",
  place: { m: [105, 75, 189, 120], d: [556, 120, 324, 206] },
};

const LISTEN: Picture = {
  file: "room-listen.png",
  alt: "Handwritten: Listen",
  layer: "Unnamed 1",
  // The export already carries the layer's slight tilt.
  place: { m: [171, 131, 202.5, 133.8], d: [669.2, 216.5, 347.4, 229.5] },
  lettering: true,
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
          backgroundImage: `url(/images/${TAPE.file})`,
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
    <div className={`room-item ${place.m ? "" : "max-md:hidden"} ${className}`} style={placeStyle(place, rotate)}>
      {children}
    </div>
  );
}

const linkText = "link-draw font-black uppercase";

/**
 * The Listening Room (Figma "09 — Listening Room (mobile)" and "14 —
 * Listening Room (desktop)"): a black collage around the tape that plays
 * the garment's track. Both layouts are absolute collages measured in
 * their own artboard's units (see .room-stage in globals.css).
 */
export function ListeningRoom({ garment, slug }: { garment: Garment; slug: string }) {
  const staircase = `/room/${slug}/staircase`;

  return (
    <div className="min-h-dvh overflow-x-clip bg-black text-white">
      <div className="mx-auto w-full max-w-[1440px] [container-type:inline-size]">
        <MobileNav
          tone="dark"
          className="md:hidden"
          title={
            <Link href={staircase} className="link-draw">
              The Staircase
            </Link>
          }
        />

        {/* Desktop header: the room's own name in place of the sound wave. */}
        <header className="relative h-[calc(200*var(--u))] px-[calc(98*var(--u))] max-md:hidden">
          <Link
            href={staircase}
            className={`${linkText} absolute top-[calc(112*var(--u))] left-[calc(98*var(--u))] text-[clamp(11px,calc(18*var(--u)),18px)] leading-[0.9]`}
          >
            The Staircase
          </Link>
          <Link
            href="/"
            aria-label="Andy Lenárt — home"
            className="absolute top-[calc(40*var(--u))] left-1/2 w-[calc(121*var(--u))] -translate-x-1/2 transition-transform duration-300 hover:-rotate-3 hover:scale-105 motion-reduce:transition-none"
          >
            <Image src="/images/logo-mark.png" alt="" width={332} height={282} sizes="10vw" className="invert" preload />
          </Link>
          <nav aria-label="Primary" className="absolute top-[calc(112*var(--u))] right-[calc(72*var(--u))]">
            <ul className="flex gap-[max(12px,calc(25*var(--u)))] text-[clamp(11px,calc(18*var(--u)),18px)] leading-[0.9]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkText}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <RoomAudioProvider src={garment.room.track}>
        <main className="room-stage" aria-labelledby="room-title">
          <Placed place={{ m: [95, 38, 200], d: [556, 65, 324] }} className="text-center">
            <p className="font-light leading-[normal] text-[#efefef]" style={{ fontSize: `clamp(12px, calc(24 * var(--u)), 24px)` }}>
              TOUCH THE TAPE
            </p>
          </Placed>

          <Placed place={TAPE.place}>
            <RoomTape title={`the track for No. ${garment.no}`}>
              <span className="relative block size-full">
                <Art picture={TAPE} sizes="(min-width: 768px) 23vw, 50vw" />
                {imageExists(TAPE.file) && REELS.map((cx) => <Reel key={cx} cx={cx} />)}
              </span>
            </RoomTape>
          </Placed>
          <Placed place={LISTEN.place} rotate={LISTEN.rotate} className="pointer-events-none">
            <Art picture={LISTEN} sizes="(min-width: 768px) 24vw, 50vw" />
          </Placed>

          <Placed place={{ m: [48, 265, 300], d: [98, 138, 420] }}>
            <p className="font-light leading-[normal] text-[#efefef] text-[13px] md:text-[clamp(14px,calc(24*var(--u)),24px)]">
              No. {garment.no} / DEPARTURES 1322
            </p>
            <h1
              id="room-title"
              className="mt-[calc(15*var(--m))] w-[calc(220*var(--m))] text-[24px] leading-[0.85] font-bold uppercase md:mt-[calc(13*var(--u))] md:w-[calc(333*var(--u))] md:text-[clamp(24px,calc(40*var(--u)),40px)]"
            >
              Lyrics by one sentence each time
            </h1>
          </Placed>

          {PICTURES.map((picture) => (
            <Placed key={picture.file} place={picture.place} className={picture.lettering ? "pointer-events-none" : ""}>
              <Art picture={picture} sizes="(min-width: 768px) 30vw, 70vw" />
            </Placed>
          ))}

          <Placed place={{ m: [20, 666, 350], d: [175, 744, 481] }} className="text-center">
            <RoomLyrics
              lines={garment.room.lyrics}
              className="font-thin leading-[normal] text-[12px] md:text-[clamp(12px,calc(16*var(--u)),16px)]"
            />
          </Placed>

          <Placed place={{ d: [916, 793, 482] }}>
            <p className="font-medium leading-[normal] uppercase text-[#efefef]" style={{ fontSize: fs(40, 24) }}>
              {garment.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Placed>

          <Placed place={{ m: [0, 1298, 390], d: [420, 1140, 600] }} className="text-center">
            <Link
              href={staircase}
              className="text-[15px] uppercase text-[#efefef] underline underline-offset-4 transition-opacity hover:opacity-70 md:text-[clamp(15px,calc(20*var(--u)),20px)]"
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
