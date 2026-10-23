"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { smallButton } from "./fields";

/**
 * Runs a server action, then refreshes the page — or goes to `goTo`
 * (`{slug}` in it is replaced by the slug the action returns).
 */
export function ActionButton({
  action,
  label,
  busyLabel,
  confirmText,
  goTo,
  tone = "default",
  big,
  disabled,
}: {
  action: () => Promise<ActionResult>;
  label: string;
  busyLabel?: string;
  confirmText?: string;
  goTo?: string;
  tone?: "default" | "danger";
  big?: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending || disabled}
      onClick={() => {
        if (confirmText && !confirm(confirmText)) return;
        start(async () => {
          const result = await action();
          if (!result.ok) {
            alert(result.error);
            return;
          }
          if (goTo) router.push(goTo.replace("{slug}", result.slug ?? ""));
          else router.refresh();
        });
      }}
      className={
        big
          ? `rounded-md px-4 py-2 text-[13px] font-semibold disabled:opacity-50 ${
              tone === "danger" ? "border border-error text-error hover:bg-error hover:text-white" : "bg-ink text-white"
            }`
          : `${smallButton} ${tone === "danger" ? "text-error" : ""}`
      }
    >
      {pending ? (busyLabel ?? "…") : label}
    </button>
  );
}
