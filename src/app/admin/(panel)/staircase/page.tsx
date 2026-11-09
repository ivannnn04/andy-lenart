import type { Metadata } from "next";
import { removeMark, restoreReportedMark, setMarkHidden } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/PageHeader";
import Link from "next/link";
import { allMarks } from "@/lib/content/marks";
import { getContentFresh } from "@/lib/content/store";
import { BUILT_IN_TERMS } from "@/lib/moderation";

export const metadata: Metadata = { title: "The Staircase" };

export default async function StaircaseAdmin() {
  // Marks taken down by reports come first: they wait for a decision.
  const { settings } = await getContentFresh();
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

      <section className="mb-12 rounded-xl border border-[#e4e4e0] bg-white p-4 text-[14px] leading-[1.5]">
        <h2 className="text-[16px] font-bold">Word filter</h2>
        <p className="mt-1 text-[#555]">
          Marks with a slur from the built-in list, or with a link, email or @handle, can&apos;t be posted. Ordinary swearing
          passes. Add your own words, or let one from the list through, in{" "}
          <Link href="/admin/settings" className="underline underline-offset-2">
            Settings
          </Link>
          .
        </p>
        <p className="mt-2 text-[#555]">
          Also blocked: {settings.blockedWords.length ? settings.blockedWords.join(", ") : "nothing yet"}.
          <br />
          Allowed from the list: {settings.allowedWords.length ? settings.allowedWords.join(", ") : "nothing yet"}.
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer font-semibold">Built-in filter list ({BUILT_IN_TERMS.length}) — offensive words</summary>
          <p className="mt-2 text-[12px] text-[#777]">
            Slurs on race, sexuality, gender and religion (dsojevic/profanity-list, MIT). “x*” means one or more “x”.
          </p>
          <p className="mt-2 text-[13px] [overflow-wrap:anywhere] text-[#333]">{BUILT_IN_TERMS.join(" · ")}</p>
        </details>
      </section>
    </>
  );
}
