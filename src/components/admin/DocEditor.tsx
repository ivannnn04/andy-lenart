"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { Fields } from "./fields";
import { SCHEMAS, type SchemaName } from "./schema";

type Obj = Record<string, unknown>;

/**
 * Edits one document (home texts, a garment, a room…) and saves it with
 * `save`. `basePath`: after a save that renames the item, the editor moves
 * to `${basePath}/${slug}`.
 */
export function DocEditor({
  schema,
  initial,
  save,
  basePath,
  storageReady,
}: {
  schema: SchemaName;
  initial: Obj;
  save: (value: Obj) => Promise<ActionResult>;
  basePath?: string;
  storageReady: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState<{ error?: string; at?: number } | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submit = () =>
    startTransition(async () => {
      const result = await save(value).catch((e: Error) => ({ ok: false as const, error: e.message }));
      if (!result.ok) {
        setStatus({ error: result.error });
        return;
      }
      setSaved(value);
      setStatus({ at: Date.now() });
      if (basePath && result.slug && result.slug !== initial.slug) router.replace(`${basePath}/${result.slug}`);
      else router.refresh();
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-6"
    >
      <div className="rounded-xl border border-[#e4e4e0] bg-white p-5 md:p-7">
        <Fields fields={SCHEMAS[schema]} value={value} onChange={setValue} />
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-[#e4e4e0] bg-[#f6f6f3]/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <button
          type="submit"
          disabled={pending || !dirty || !storageReady}
          className="rounded-md bg-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {dirty && (
          <button type="button" onClick={() => setValue(saved)} className="text-[13px] font-semibold text-[#666] underline">
            Discard
          </button>
        )}
        <p role="status" className="text-[13px]">
          {!storageReady ? (
            <span className="text-error">Saving is off: no storage is connected (see Dashboard).</span>
          ) : status?.error ? (
            <span className="text-error">{status.error}</span>
          ) : dirty ? (
            <span className="text-[#8a6d00]">Unsaved changes</span>
          ) : status?.at ? (
            <span className="text-[#2e7d32]">Saved — the site is updated.</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
