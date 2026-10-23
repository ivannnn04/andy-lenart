import type { Metadata } from "next";
import { markRequestDone, removeRequest, removeSubscriber } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { listRequests, listSubscribers } from "@/lib/content/inbox";

export const metadata: Metadata = { title: "Inbox" };

const date = (t: number) => new Date(t).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
const exportLink = "rounded-md border border-[#d4d4d0] bg-white px-3 py-1.5 text-[12px] font-semibold hover:bg-[#f0f0ec]";

export default async function Inbox() {
  const [requests, subscribers] = await Promise.all([listRequests(), listSubscribers()]);
  return (
    <>
      <PageHeader title="Inbox" intro="Requests for a piece and sign-ups from “Hear when the next piece is out”." />

      <section aria-labelledby="requests" className="mb-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="requests" className="text-[17px] font-bold">
            Requests <span className="text-[#999]">({requests.length})</span>
          </h2>
          <a href="/admin/inbox/export?kind=requests" className={exportLink}>
            Download CSV
          </a>
        </div>
        <ul className="flex flex-col gap-3">
          {requests.map((r) => (
            <li key={r.id} className={`rounded-xl border border-[#e4e4e0] bg-white p-4 ${r.done ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-[13px] leading-[1.5]">
                  <p className="text-[15px] font-bold">
                    {r.name} <span className="font-normal text-[#777]">· {r.city}</span>
                  </p>
                  <p>
                    <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Your request: ${r.garment}`)}`} className="underline">
                      {r.email}
                    </a>
                  </p>
                  <p className="text-[#777]">
                    {r.garment} · {date(r.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <ActionButton action={markRequestDone.bind(null, r.id, !r.done)} label={r.done ? "Mark as open" : "Mark as done"} />
                  <ActionButton tone="danger" action={removeRequest.bind(null, r.id)} label="Delete" confirmText="Delete this request?" />
                </div>
              </div>
              {r.message && <p className="mt-3 whitespace-pre-wrap border-t border-[#eee] pt-3 text-[14px] leading-[1.5]">{r.message}</p>}
            </li>
          ))}
          {!requests.length && <li className="text-[14px] text-[#777]">No requests yet.</li>}
        </ul>
      </section>

      <section aria-labelledby="subscribers-title" id="subscribers" className="pb-12">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="subscribers-title" className="text-[17px] font-bold">
            Subscribers <span className="text-[#999]">({subscribers.length})</span>
          </h2>
          <a href="/admin/inbox/export?kind=subscribers" className={exportLink}>
            Download CSV
          </a>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#e4e4e0] bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#eee] text-[11px] font-bold uppercase tracking-[0.08em] text-[#888]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="max-w-[320px] px-4 py-3 text-[#555]">{s.message}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#777]">{date(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <ActionButton tone="danger" action={removeSubscriber.bind(null, s.id)} label="Delete" confirmText={`Remove ${s.email}?`} />
                  </td>
                </tr>
              ))}
              {!subscribers.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-[#777]">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
