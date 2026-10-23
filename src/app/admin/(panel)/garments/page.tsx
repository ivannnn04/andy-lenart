import type { Metadata } from "next";
import Link from "next/link";
import { createGarment } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Garments" };

export default async function GarmentList() {
  const { garments } = await getContentFresh();
  return (
    <>
      <PageHeader
        title="Garments"
        intro="Each garment has its own page at /collection/<address>: gallery, price, preview, concept, credits."
        actions={<ActionButton big action={createGarment} label="+ New garment" busyLabel="Creating…" goTo="/admin/garments/{slug}" />}
      />
      <ul className="flex flex-col gap-2 pb-12">
        {garments.map((g) => {
          const cover = g.gallery[0]?.src;
          return (
            <li key={g.slug}>
              <Link
                href={`/admin/garments/${g.slug}`}
                className="flex items-center gap-4 rounded-xl border border-[#e4e4e0] bg-white p-3 transition-colors hover:border-ink"
              >
                <span className="size-14 shrink-0 overflow-hidden rounded-md bg-[#eee]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail */}
                  {cover && <img src={cover} alt="" className="size-full object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-bold text-[#888]">No. {g.no}</span>
                  <span className="block truncate text-[15px] font-bold">{g.titleLines.join(" ")}</span>
                  <span className="block text-[12px] text-[#777]">
                    /collection/{g.slug} · {g.price || "no price"}
                  </span>
                </span>
                <span className="text-[13px] font-semibold">Edit →</span>
              </Link>
            </li>
          );
        })}
        {!garments.length && <li className="text-[14px] text-[#777]">No garments yet.</li>}
      </ul>
    </>
  );
}
