"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { copyToSupabase } from "@/app/admin/actions";
import { smallButton } from "./fields";

/** Copies what the site kept in Upstash Redis and Vercel Blob into Supabase. */
export function MoveToSupabase() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState<string>();
  return (
    <div className="mt-2 flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={pending}
        className={smallButton}
        onClick={() =>
          start(async () => {
            const result = await copyToSupabase();
            if (!result.ok) {
              alert(result.error);
              return;
            }
            const r = result.report;
            setDone(
              `Copied: ${r.content ? "site content, " : ""}${r.requests} requests, ${r.subscribers} subscribers, ${r.marks} Staircase marks, ${r.files} files.`,
            );
            router.refresh();
          })
        }
      >
        {pending ? "Copying… (this can take a minute)" : "Copy old data into Supabase"}
      </button>
      {done && <p className="text-[12px] text-[#2e7d32]">{done}</p>}
    </div>
  );
}
