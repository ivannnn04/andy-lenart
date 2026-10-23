"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { Toggle } from "./fields";

/** On site / Hidden switch that saves straight away. */
export function HiddenSwitch({
  hidden,
  label,
  action,
}: {
  hidden: boolean;
  label: string;
  action: (hidden: boolean) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [shown, setShown] = useOptimistic(!hidden);
  return (
    <Toggle
      on={shown}
      label={label}
      onChange={(on) =>
        start(async () => {
          setShown(on);
          const result = await action(!on);
          if (!result.ok) alert(result.error);
          router.refresh();
        })
      }
    />
  );
}
