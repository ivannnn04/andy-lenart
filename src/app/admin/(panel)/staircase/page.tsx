import type { Metadata } from "next";
import { removeMark, setMarkHidden } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { allMarks } from "@/lib/content/marks";

export const metadata: Metadata = { title: "The Staircase" };

export default async function StaircaseAdmin() {
  const marks = await allMarks();
  return (
    <>
      <PageHeader
        title="The Staircase"
        intro="The wall shared by every room. New marks appear straight away; hide one to take it off the wall, or delete it for good."
      />
      <ul className="grid gap-3 pb-12 md:grid-cols-2 xl:grid-cols-3">
        {marks.map((m) => (
          <li
            key={m.id}
            className={`flex flex-col gap-3 rounded-xl border border-[#e4e4e0] bg-white p-4 ${m.hidden ? "opacity-55" : ""}`}
          >
            <p className="text-[15px] leading-[1.4] [overflow-wrap:anywhere]">{m.text}</p>
            <p className="text-[12px] text-[#777]">
              {m.name} · {m.city} · No. {m.no}
              {m.room && <> · from /room/{m.room}</>}
              <br />
              {m.createdAt > 1e9 ? new Date(m.createdAt).toLocaleString("en-GB") : "Starter mark from the design"}
              {m.hidden && <strong className="ml-1 text-[#c77700]">· hidden</strong>}
            </p>
            <div className="mt-auto flex gap-2">
              <ActionButton action={setMarkHidden.bind(null, m.id, !m.hidden)} label={m.hidden ? "Show on wall" : "Hide"} />
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
