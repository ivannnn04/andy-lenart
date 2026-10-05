import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MobileNav } from "@/components/MobileNav";
import { RoomGate } from "@/components/room/RoomGate";
import { getGarment } from "@/lib/garments";
import { accessCookie, gateCookie, readGate, unsign } from "@/lib/rooms";
import type { GateState } from "./actions";

// The typewriter face of the keyword field.
const courier = Courier_Prime({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-courier" });

export const metadata: Metadata = {
  title: "Listening Room · Andy Lenárt",
  // Private: reached by tapping the garment, never through search.
  robots: { index: false, follow: false },
};

/** A lock still running when the page loads shows straight away. */
function gateState(cookie: string | undefined): GateState {
  const { lockedUntil } = readGate(cookie);
  return lockedUntil > Date.now() ? { status: "locked", lockedUntil } : { status: "idle" };
}

const label = "text-[13px] leading-[normal] uppercase tracking-[0.1em] text-muted";

/**
 * Listening Room entrance — the page an owner lands on after tapping the
 * NFC tag in their garment (Figma "07 — Room gate (after NFC tap)", mobile).
 * Desktop adds the garment photo beside the gate.
 */
export default async function RoomPage({ params }: PageProps<"/room/[slug]">) {
  const { slug } = await params;
  const garment = getGarment(slug);
  if (!garment) notFound();

  const jar = await cookies();
  const granted = unsign(jar.get(accessCookie(slug))?.value) === "granted";
  const initial = gateState(jar.get(gateCookie(slug))?.value);
  const photo = garment.gallery[garment.requestPhoto];

  return (
    <div className={`${courier.variable} grid min-h-dvh md:grid-cols-2`}>
      {photo?.src && (
        <div className="relative max-md:hidden">
          <div className="sticky top-0 h-dvh">
            <Image src={photo.src} alt={photo.alt} fill sizes="50vw" preload className="object-cover object-[50%_30%]" />
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[536px] flex-col pb-16">
        <MobileNav title="Listening Room" inset="px-7" />

        <main className="mt-10 flex w-full flex-col px-7 md:my-auto md:pb-[101px]">
          <p className={label}>Listening Room · No. {garment.no}</p>
          <h1 className="mt-6 text-[40px] leading-[0.95] font-bold uppercase md:text-[56px]">
            {garment.titleLines.join(" ")}
          </h1>

          {granted ? (
            <div className="mt-6 flex flex-col gap-6" role="status">
              <p className="text-[20px] leading-[1.5] text-ink">
                The room is open. Your track and the Staircase will appear here.
              </p>
              <Link href={`/collection/${slug}`} className="link-draw self-start text-[13px] uppercase tracking-[0.1em] text-muted">
                About this garment
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-6 text-[20px] leading-[1.5] text-ink">
                Enter the <strong className="font-semibold">third word</strong> of the concept text,
                found inside your garment.
              </p>
              <p className="mt-0.5 text-[12px] leading-[normal] uppercase tracking-[0.1em] text-muted">
                (Excludes title &amp; collection name)
              </p>
              <div className="mt-2.5">
                <RoomGate slug={slug} initial={initial} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
