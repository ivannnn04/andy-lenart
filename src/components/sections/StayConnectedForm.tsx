"use client";

import { useId, useState, type FormEvent } from "react";
import { fs, sp } from "@/lib/design";
import { CONTACT_EMAIL } from "@/lib/site";
import { emailError } from "@/lib/validate";

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "message", label: "Message", type: "text", autoComplete: "off", required: false },
] as const;

type Errors = Partial<Record<"name" | "email", string>>;

function validate(data: FormData): Errors {
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = "Please enter your name.";
  const email = emailError(value("email"));
  if (email) errors.email = email;
  return errors;
}

const fieldText = "font-normal uppercase leading-none";

/**
 * There is no mailing-list backend yet, so submitting opens the visitor's
 * mail client with a pre-filled message to the studio address. Validation is
 * our own (not the browser's bubbles): messages appear under the fields after
 * the first submit and update as the visitor types.
 */
export function StayConnectedForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const id = useId();

  function handleChange(event: FormEvent<HTMLFormElement>) {
    if (attempted) setErrors(validate(new FormData(event.currentTarget)));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setAttempted(true);
    setErrors(found);
    const first = FIELDS.find((f) => f.name in found);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
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
      noValidate
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="flex w-full flex-col md:w-[calc(700*var(--u))]"
      style={{ marginTop: sp(109, 40), gap: sp(88, 40), fontSize: fs(40, 22) }}
    >
      <div className="flex flex-col" style={{ gap: sp(40, 16) }}>
        {FIELDS.map((field) => {
          const error = errors[field.name as keyof Errors];
          const errorId = `${id}-${field.name}-error`;
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <label className={`block border-b-2 ${error ? "border-error" : "border-black"}`}>
                <span className="sr-only">{field.label}</span>
                <input
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  placeholder={field.label}
                  aria-invalid={!!error || undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={`${fieldText} w-full bg-transparent px-2 outline-none placeholder:text-black/50 focus-visible:placeholder:text-black/30`}
                  // Fixed box height: browsers won't honour a line-height below
                  // `normal` on inputs, so padding alone overshoots the design.
                  style={{ height: sp(102, 56) }}
                />
              </label>
              {error && (
                <span id={errorId} className="px-2 text-[14px] leading-[1.4] text-error md:text-[15px]">
                  {error}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className={`${fieldText} font-semibold! bg-black px-4 whitespace-nowrap text-white md:px-16 shadow-[inset_0_0_0_2px_#000] transition-colors duration-300 hover:bg-white hover:text-black motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}
        style={{ paddingBlock: sp(32, 20) }}
      >
        Stay connected
      </button>
    </form>
  );
}
