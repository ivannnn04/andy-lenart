import type { Metadata } from "next";
import Link from "next/link";
import { createRoom } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Listening Rooms" };

export default async function RoomList() {
  const { rooms } = await getContentFresh();
  return (
    <>
      <PageHeader
        title="Listening Rooms"
        intro="Private pages at /room/<address>, opened with an entry word. Each has its track, lyrics and Staircase."
        actions={<ActionButton big action={createRoom} label="+ New room" busyLabel="Creating…" goTo="/admin/rooms/{slug}" />}
      />
      <div className="overflow-x-auto rounded-xl border border-[#e4e4e0] bg-white">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-[#eee] text-[11px] font-bold uppercase tracking-[0.08em] text-[#888]">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Entry word</th>
              <th className="px-4 py-3">Track</th>
              <th className="px-4 py-3">Lyrics</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {rooms.map((r) => (
              <tr key={r.slug}>
                <td className="px-4 py-3 font-bold">{r.garmentNo}</td>
                <td className="px-4 py-3">
                  <span className="block font-semibold">{r.titleLines.join(" ")}</span>
                  <span className="text-[12px] text-[#888]">/room/{r.slug}</span>
                </td>
                <td className="px-4 py-3 font-mono">{r.keyword || <span className="text-error">not set</span>}</td>
                <td className="px-4 py-3">{r.track ? "✓" : <span className="text-[#c77700]">none</span>}</td>
                <td className="px-4 py-3">{r.lyrics.length} lines</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/rooms/${r.slug}`} className="font-semibold underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-12" />
    </>
  );
}
