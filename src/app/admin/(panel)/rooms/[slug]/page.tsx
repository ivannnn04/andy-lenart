import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteRoom, saveRoom } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { DocEditor } from "@/components/admin/DocEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Edit room" };

export default async function RoomEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = (await getContentFresh()).rooms.find((r) => r.slug === slug);
  if (!room) notFound();
  const name = room.titleLines.join(" ") || "Room";
  return (
    <>
      <p className="mb-2 text-[13px]">
        <Link href="/admin/rooms" className="font-semibold text-[#666] underline">
          ← Listening Rooms
        </Link>
      </p>
      <PageHeader
        title={name}
        intro={
          <>
            <a href={`/room/${room.slug}`} target="_blank" className="underline">
              /room/{room.slug} ↗
            </a>{" "}
            · Staircase:{" "}
            <a href={`/room/${room.slug}/staircase`} target="_blank" className="underline">
              /room/{room.slug}/staircase ↗
            </a>
          </>
        }
        actions={
          <ActionButton
            big
            tone="danger"
            action={deleteRoom.bind(null, room.slug)}
            label="Delete room"
            confirmText={`Delete the room “${name}”? Its address will stop working.`}
            goTo="/admin/rooms"
          />
        }
      />
      <DocEditor
        key={room.slug}
        schema="room"
        initial={room}
        save={saveRoom.bind(null, room.slug)}
        basePath="/admin/rooms"
        storageReady={getStorage().writable}
      />
    </>
  );
}
