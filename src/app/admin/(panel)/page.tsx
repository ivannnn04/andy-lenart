import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { uploadMode } from "@/lib/admin/media";
import { listRequests, listSubscribers } from "@/lib/content/inbox";
import { allMarks } from "@/lib/content/marks";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Dashboard" };

const card = "rounded-xl border border-[#e4e4e0] bg-white p-5";

function Check({ ok, title, children }: { ok: boolean; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
          ok ? "bg-[#2e7d32]" : "bg-[#c77700]"
        }`}
      >
        {ok ? "✓" : "!"}
      </span>
      <div className="text-[13px] leading-[1.5]">
        <p className="font-semibold">{title}</p>
        <div className="text-[#666]">{children}</div>
      </div>
    </li>
  );
}

export default async function Dashboard() {
  const storage = getStorage();
  const uploads = uploadMode();
  const [content, requests, subscribers, marks] = await Promise.all([
    getContentFresh(),
    listRequests(),
    listSubscribers(),
    allMarks(),
  ]);
  const openRequests = requests.filter((r) => !r.done).length;
  const roomSecret = Boolean(process.env.ROOM_SECRET);

  const stats = [
    { label: "Garments", value: content.garments.length, href: "/admin/collection" },
    { label: "Open Listening Rooms", value: content.garments.filter((g) => g.room.enabled).length, href: "/admin/collection" },
    { label: "Open requests", value: openRequests, href: "/admin/inbox" },
    { label: "Subscribers", value: subscribers.length, href: "/admin/inbox#subscribers" },
    { label: "Marks on the Staircase", value: marks.filter((m) => !m.hidden).length, href: "/admin/staircase" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" intro="Everything on the site, in one place. Changes go live as soon as you save." />

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className={`${card} block transition-colors hover:border-ink`}>
              <span className="block text-[28px] font-bold leading-none">{s.value}</span>
              <span className="mt-1.5 block text-[12px] font-semibold text-[#777]">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 pb-12 lg:grid-cols-2">
        <section className={card}>
          <h2 className="text-[15px] font-bold">Setup</h2>
          <ul className="mt-4 flex flex-col gap-4">
            <Check ok={storage.kind === "redis"} title={storage.kind === "redis" ? "Content storage: Upstash Redis" : storage.kind === "file" ? "Content storage: local files (.data/)" : "Content storage: not connected"}>
              {storage.kind === "redis" ? (
                "Edits, Staircase marks and the inbox are saved."
              ) : storage.kind === "file" ? (
                "Fine for local development. On Vercel, connect Upstash Redis (below)."
              ) : (
                <>
                  Vercel → your project → <strong>Storage</strong> → <strong>Create Database</strong> →{" "}
                  <strong>Upstash for Redis</strong> → connect it to this project, then redeploy. Until then the site shows
                  its built-in content and nothing can be saved.
                </>
              )}
            </Check>
            <Check ok={uploads === "blob"} title={uploads === "blob" ? "File uploads: Vercel Blob" : uploads === "local" ? "File uploads: public/uploads (local)" : "File uploads: not connected"}>
              {uploads === "blob" ? (
                "Photos and audio you upload are stored and served by Vercel Blob."
              ) : (
                <>
                  Vercel → <strong>Storage</strong> → <strong>Create Database</strong> → <strong>Blob</strong> → connect it to
                  this project, then redeploy.
                </>
              )}
            </Check>
            <Check ok={Boolean(process.env.ADMIN_PASSWORD)} title="Admin password">
              {process.env.ADMIN_PASSWORD
                ? "Set with ADMIN_PASSWORD."
                : "Using the development password “admin”. Set ADMIN_PASSWORD in Vercel before going live."}
            </Check>
            <Check ok={roomSecret} title="Room access secret">
              {roomSecret
                ? "ROOM_SECRET signs the Listening Room cookies."
                : "Set ROOM_SECRET (any long random text) so room access cookies can’t be forged."}
            </Check>
          </ul>
        </section>

        <section className={card}>
          <h2 className="text-[15px] font-bold">Latest requests</h2>
          {requests.length ? (
            <ul className="mt-3 divide-y divide-[#eee]">
              {requests.slice(0, 5).map((r) => (
                <li key={r.id} className="py-2.5 text-[13px]">
                  <span className="font-semibold">{r.name}</span> · {r.city} — {r.garment}
                  <span className="block text-[12px] text-[#888]">{new Date(r.createdAt).toLocaleString("en-GB")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] text-[#777]">No requests yet.</p>
          )}
          <Link href="/admin/inbox" className="mt-3 inline-block text-[13px] font-semibold underline">
            Open the inbox
          </Link>
        </section>
      </div>
    </>
  );
}
