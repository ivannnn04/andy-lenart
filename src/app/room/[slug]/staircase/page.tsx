import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { RoomHeader } from "@/components/room/RoomHeader";
import { StaircaseWall } from "@/components/room/StaircaseWall";
import { getGarment } from "@/lib/garments";
import { accessCookie, unsign } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "The Staircase · Andy Lenárt",
  robots: { index: false, follow: false },
};

const hasImage = (file: string) => existsSync(path.join(process.cwd(), "public/images", file));

const GRAFFITI = "room-staircase-graffiti.png";
const SCRAWL = "room-staircase-scrawl.png";

/**
 * The Staircase — the wall owners of every piece write on (Figma "15 — The
 * Staircase (desktop)" and its bottom sheet). Reached from a Listening Room,
 * so it needs that room's access cookie.
 */
export default async function StaircasePage({ params }: PageProps<"/room/[slug]/staircase">) {
  const { slug } = await params;
  const garment = getGarment(slug);
  if (!garment) notFound();
  const jar = await cookies();
  if (unsign(jar.get(accessCookie(slug))?.value) !== "granted") redirect(`/room/${slug}`);

  return (
    <div className="min-h-dvh overflow-x-clip bg-white text-black">
      <div className="mx-auto w-full max-w-[1440px] [container-type:inline-size]">
        <RoomHeader
          tone="light"
          label="Listening Room"
          href={`/room/${slug}`}
          extra={
            hasImage(SCRAWL) && (
              <Image
                src={`/images/${SCRAWL}`}
                alt=""
                width={155}
                height={110}
                sizes="11vw"
                className="pointer-events-none absolute top-[calc(-6*var(--u))] left-[calc(53*var(--u))] w-[calc(155*var(--u))] max-w-none"
              />
            )
          }
        />

        <main className="gutter flex flex-col items-center pb-32 md:pt-[calc(53*var(--u))] md:pb-[calc(160*var(--u))]">
          {/* The title is printed over the photo in "difference", so it turns light where it crosses it. */}
          <div className="relative isolate flex w-full max-w-[624px] flex-col items-center bg-white pt-10 md:pt-0">
            <div className="relative aspect-[299/284] w-[min(299px,62vw)] md:w-[calc(299*var(--u))]">
              {hasImage(GRAFFITI) ? (
                <Image
                  src={`/images/${GRAFFITI}`}
                  alt="Black-and-white photo of a stairwell wall covered in graffiti"
                  fill
                  sizes="(min-width: 768px) 21vw, 62vw"
                  preload
                  className="object-cover"
                />
              ) : (
                <div role="img" aria-label="Graffiti on a stairwell wall" className="size-full bg-[#2b2b2b]" />
              )}
            </div>
            <h1 className="absolute inset-x-0 top-[calc(50/284*min(299px,62vw)+40px)] text-center font-bold leading-[normal] text-white mix-blend-difference md:top-[calc(50*var(--u))]">
              <span className="block pl-[0.14em] text-[clamp(56px,calc(100*var(--u)),100px)] tracking-[0.14em]">THE</span>
              <span className="-mt-[0.32em] block pl-[0.14em] text-[clamp(40px,calc(90*var(--u)),90px)] tracking-[0.14em]">
                STAIRCASE
              </span>
            </h1>
          </div>

          <p className="mt-5 text-center text-[clamp(20px,calc(32*var(--u)),32px)] leading-[normal]">
            READ &amp; SHARE THOUGHTS <strong className="font-semibold">FREELY.</strong>
          </p>
          <span aria-hidden className="mt-2.5 block h-1.5 w-full max-w-[574px] bg-black md:w-[calc(574*var(--u))]" />

          <StaircaseWall garmentNo={garment.no} />
        </main>
      </div>
    </div>
  );
}
