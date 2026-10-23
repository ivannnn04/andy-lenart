import type { Metadata } from "next";
import Link from "next/link";
import { createGarment, moveGarment, setGarmentHidden } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { HiddenSwitch } from "@/components/admin/HiddenSwitch";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Collection" };

const badge = "rounded-full px-2 py-0.5 text-[11px] font-semibold";

export default async function CollectionList() {
  const { garments } = await getContentFresh();
  const writable = getStorage().writable;
  return (
    <>
      <PageHeader
        title="Collection"
        intro="Every garment in the collection, in the order of the home page. Each one holds its card, its garment page and its Listening Room."
        actions={
          writable && (
            <ActionButton big action={createGarment} label="+ New garment" busyLabel="Creating…" goTo="/admin/collection/{slug}" />
          )
        }
      />
      <ul className="flex flex-col gap-2 pb-12">
        {garments.map((g, i) => {
          const title = g.cardTitle || g.titleLines.join(" ") || "Untitled";
          const cover = g.cardImage?.src ?? g.gallery[0]?.src;
          return (
            <li
              key={g.slug}
              className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#e4e4e0] bg-white p-3 ${
                g.hidden ? "opacity-60" : ""
              }`}
            >
              {writable && (
                <span className="flex flex-col">
                  <ActionButton action={moveGarment.bind(null, g.slug, -1)} label="↑" disabled={i === 0} />
                  <ActionButton action={moveGarment.bind(null, g.slug, 1)} label="↓" disabled={i === garments.length - 1} />
                </span>
              )}
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#eee] text-[15px] font-bold text-[#999]">
                {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail */}
                {cover ? <img src={cover} alt="" className="size-full object-cover" /> : g.no}
              </span>
              <Link href={`/admin/collection/${g.slug}`} className="min-w-0 flex-1 basis-48 hover:underline">
                <span className="block text-[12px] font-bold text-[#888]">No. {g.no}</span>
                <span className="block truncate text-[15px] font-bold">{title}</span>
                <span className="mt-1 flex flex-wrap gap-1.5">
                  <span className={`${badge} ${g.page ? "bg-[#e6f2e6] text-[#2e7d32]" : "bg-[#f0f0ec] text-[#777]"}`}>
                    {g.page ? "Page live" : "No page"}
                  </span>
                  <span className={`${badge} ${g.room.enabled ? "bg-[#e6f2e6] text-[#2e7d32]" : "bg-[#f0f0ec] text-[#777]"}`}>
                    {g.room.enabled ? `Room open · word “${g.room.keyword}”` : "Room closed"}
                  </span>
                </span>
              </Link>
              {writable ? (
                <HiddenSwitch hidden={Boolean(g.hidden)} label={`Show “${title}” on the home page`} action={setGarmentHidden.bind(null, g.slug)} />
              ) : (
                <span className="text-[12px] font-semibold text-[#777]">{g.hidden ? "Hidden" : "On site"}</span>
              )}
              <Link href={`/admin/collection/${g.slug}`} className="text-[13px] font-semibold">
                Edit →
              </Link>
            </li>
          );
        })}
        {!garments.length && <li className="text-[14px] text-[#777]">No garments yet.</li>}
      </ul>
    </>
  );
}
