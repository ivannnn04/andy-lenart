"use client";

import type { FormEvent } from "react";
import { fs, sp } from "@/lib/design";
import { CONTACT_EMAIL } from "@/lib/site";

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "message", label: "Message", type: "text", autoComplete: "off", required: false },
] as const;

const fieldText = "font-normal uppercase leading-none";

/**
 * There is no mailing-list backend yet, so submitting opens the visitor's
 * mail client with a pre-filled message to the studio address.
 */
export function StayConnectedForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Stay connected",
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col md:w-[calc(700*var(--u))]"
      style={{ marginTop: sp(109, 40), gap: sp(88, 40), fontSize: fs(40, 22) }}
    >
      <div className="flex flex-col" style={{ gap: sp(40, 16) }}>
        {FIELDS.map((field) => (
          <label key={field.name} className="block border-b-2 border-black">
            <span className="sr-only">{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              placeholder={field.label}
              className={`${fieldText} w-full bg-transparent px-2 outline-none placeholder:text-black/50 focus-visible:placeholder:text-black/30`}
              // Fixed box height: browsers won't honour a line-height below
              // `normal` on inputs, so padding alone overshoots the design.
              style={{ height: sp(102, 56) }}
            />
          </label>
        ))}
      </div>
      <button
        type="submit"
        className={`${fieldText} bg-black px-4 whitespace-nowrap text-white md:px-16 shadow-[inset_0_0_0_2px_#000] transition-colors duration-300 hover:bg-white hover:text-black motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}
        style={{ paddingBlock: sp(32, 20) }}
      >
        <span className="link-draw">Stay connected</span>
      </button>
    </form>
  );
}
