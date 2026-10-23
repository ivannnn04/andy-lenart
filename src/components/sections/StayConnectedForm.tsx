"use client";

import { useId, useState, type FormEvent } from "react";
import { fs, sp } from "@/lib/design";
import { subscribe } from "@/app/actions";
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
 * Sign-ups go to the admin inbox; without a store connected, submitting
 * opens the visitor's mail client with a pre-filled message instead. Validation is
 * our own (not the browser's bubbles): messages appear under the fields after
 * the first submit and update as the visitor types.
 */
export function StayConnectedForm({ email }: { email: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ done?: boolean; error?: string }>({});
  const id = useId();

  function handleChange(event: FormEvent<HTMLFormElement>) {
    if (attempted) setErrors(validate(new FormData(event.currentTarget)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    setSending(true);
    const result = await subscribe({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    }).catch(() => ({ ok: false as const, error: "Something went wrong — please try again." }));
    setSending(false);
    if (!result.ok) {
      setStatus({ error: result.error });
      return;
    }
    if (result.stored) {
      form.reset();
      setStatus({ done: true });
      return;
    }
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
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
      {(status.done || status.error) && (
        <p role="status" className={`text-[16px] leading-[1.4] normal-case md:text-[18px] ${status.error ? "text-error" : ""}`}>
          {status.error ?? "Thank you — we’ll write when the next garment is ready."}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className={`${fieldText} disabled:opacity-60 font-semibold! bg-black px-4 whitespace-nowrap text-white md:px-16 shadow-[inset_0_0_0_2px_#000] transition-colors duration-300 hover:bg-white hover:text-black motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}
        style={{ paddingBlock: sp(32, 20) }}
      >
        Stay connected
      </button>
    </form>
  );
}
