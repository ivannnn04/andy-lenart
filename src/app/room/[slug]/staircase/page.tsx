import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { MobileNav } from "@/components/MobileNav";
import { getGarment } from "@/lib/garments";
import { accessCookie, unsign } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "The Staircase · Andy Lenárt",
  robots: { index: false, follow: false },
};

/**
 * The Staircase — owners' shared space (Figma "11 / 15 — The Staircase").
 * Not built yet: for now it only holds the place the room links to.
 */
export default async function StaircasePage({ params }: PageProps<"/room/[slug]/staircase">) {
  const { slug } = await params;
  if (!getGarment(slug)) notFound();
  const jar = await cookies();
  if (unsign(jar.get(accessCookie(slug))?.value) !== "granted") redirect(`/room/${slug}`);

  return (
    <div className="min-h-dvh bg-black text-white">
      <MobileNav tone="dark" title="The Staircase" />
      <main className="gutter flex flex-col items-start gap-6 pt-16">
        <h1 className="text-[40px] leading-[0.95] font-bold uppercase">The Staircase</h1>
        <p className="text-[18px] leading-[1.5] text-[#efefef]">Opening soon.</p>
        <Link href={`/room/${slug}`} className="link-draw text-[15px] uppercase text-[#efefef]">
          Back to the Listening Room
        </Link>
      </main>
    </div>
  );
}
