import type { Metadata } from "next";
import { removeMark, restoreReportedMark, setMarkHidden } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { allMarks } from "@/lib/content/marks";

export const metadata: Metadata = { title: "The Staircase" };

export default async function StaircaseAdmin() {
  // Marks taken down by reports come first: they wait for a decision.
  const marks = (await allMarks()).sort((a, b) => Number(Boolean(b.reported)) - Number(Boolean(a.reported)));
  return (
    <>
      <PageHeader
        title="The Staircase"
        intro="The wall shared by every room. New marks appear straight away; hide one to take it off the wall, or delete it for good. Visitors can report a mark: after enough reports (Settings) it leaves the wall and waits here, at the top, for you to restore or delete it."
      />
      <ul className="grid gap-3 pb-12 md:grid-cols-2 xl:grid-cols-3">
        {marks.map((m) => (
          <li
            key={m.id}
            className={`flex flex-col gap-3 rounded-xl border bg-white p-4 ${
              m.reported ? "border-[#d33]" : `border-[#e4e4e0] ${m.hidden ? "opacity-55" : ""}`
            }`}
          >
            {m.reported && (
              <p className="text-[12px] font-semibold text-[#c22]">
                Reported by {m.reports?.length ?? 0} {m.reports?.length === 1 ? "visitor" : "visitors"} · off the wall until you decide
              </p>
            )}
            <p className="text-[15px] leading-[1.4] [overflow-wrap:anywhere]">{m.text}</p>
            <p className="text-[12px] text-[#777]">
              {m.name} · {m.city} · No. {m.no}
              {m.room && <> · from /room/{m.room}</>}
              <br />
              {m.createdAt > 1e9 ? new Date(m.createdAt).toLocaleString("en-GB") : "Starter mark from the design"}
              {m.hidden && !m.reported && <strong className="ml-1 text-[#c77700]">· hidden</strong>}
              {!m.hidden && Boolean(m.reports?.length) && (
                <strong className="ml-1 text-[#c77700]">
                  · {m.reports!.length} {m.reports!.length === 1 ? "report" : "reports"}
                </strong>
              )}
            </p>
            <div className="mt-auto flex gap-2">
              {m.reported ? (
                <ActionButton action={restoreReportedMark.bind(null, m.id)} label="Restore" />
              ) : (
                <ActionButton action={setMarkHidden.bind(null, m.id, !m.hidden)} label={m.hidden ? "Show on wall" : "Hide"} />
              )}
              <ActionButton
                tone="danger"
                action={removeMark.bind(null, m.id)}
                label="Delete"
                confirmText="Delete this mark for good?"
              />
            </div>
          </li>
        ))}
        {!marks.length && <li className="text-[14px] text-[#777]">No marks yet.</li>}
      </ul>
    </>
  );
}
