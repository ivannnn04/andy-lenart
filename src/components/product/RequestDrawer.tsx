"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Arrow } from "@/components/Arrow";
import type { GarmentImage } from "@/lib/garments";
import { CONTACT_EMAIL } from "@/lib/site";
import { emailError } from "@/lib/validate";

const buttonClass =
  "flex w-full items-center justify-center bg-ink px-7 py-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap text-white shadow-[inset_0_0_0_1px_#1a1a1a] transition-colors duration-300 hover:bg-white hover:text-ink motion-reduce:transition-none";
const fieldLabel = "text-[14px] leading-[normal] font-semibold uppercase tracking-[0.1em] text-[#595959]";
const fieldInput =
  "w-full rounded-none border border-[#4d4d4d] bg-white p-4 text-[15px] leading-[normal] text-ink placeholder:text-[#999] focus:border-ink focus:shadow-[inset_0_0_0_1px_#1a1a1a] focus:outline-none aria-invalid:border-error aria-invalid:focus:shadow-[inset_0_0_0_1px_var(--color-error)]";
const outlineButtonClass =
  "flex w-full items-center justify-center border border-ink px-7 py-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap text-ink transition-colors duration-300 hover:bg-ink hover:text-white motion-reduce:transition-none";

// What happens after a request is sent (Figma "06 — Inquiry sent").
const NEXT_STEPS: { title: string; lines: string[] }[] = [
  { title: "Review", lines: ["If selected, you will receive an email with next steps."] },
  {
    title: "Payment & production",
    lines: ["Completed via private link.", "Each piece is made to order in London. Allow\u00a04–\u20606\u00a0weeks."],
  },
  {
    title: "Arrival",
    lines: ["Includes your garment and access keyword to enter your private Listening Room."],
  },
];

const errorText = "text-[13px] leading-[1.4] text-error";

type Field = "name" | "city" | "email" | "consent";
type Errors = Partial<Record<Field, string>>;

function validate(data: FormData): Errors {
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = "Please enter your name.";
  if (!value("city")) errors.city = "Please enter your city.";
  errors.email = emailError(value("email"));
  if (!data.get("consent")) errors.consent = "Please confirm this to send your request.";
  return errors;
}

/**
 * "Request this piece" button and the inquiry drawer it opens (Figma
 * "05 — Inquiry (drawer)"). A native modal <dialog>: focus stays inside,
 * Esc closes it and the page behind is inert. There is no backend yet, so
 * submitting composes the request as an email to the studio.
 */
export function RequestDrawer({
  no,
  title,
  summary,
  photo,
}: {
  no: string;
  title: string;
  /** e.g. "ONE SIZE · £1,500 · 12 remaining" */
  summary: string;
  photo?: GarmentImage;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  // Errors show after the first submit attempt, then update as the visitor types.
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const id = useId();

  const open = () => {
    setSent(false);
    setErrors({});
    setAttempted(false);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  const recheck = (e: FormEvent<HTMLFormElement>) => {
    if (attempted) setErrors(validate(new FormData(e.currentTarget)));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setAttempted(true);
    setErrors(found);
    const first = (["name", "city", "email", "consent"] as const).find((f) => found[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const body = [
      `Piece: No. ${no} — ${title}`,
      `Name: ${field("name")}`,
      `City: ${field("city")}`,
      `Email: ${field("email")}`,
      "",
      field("message") || "(no message)",
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Request: No. ${no} ${title}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <button type="button" onClick={open} aria-haspopup="dialog" className={buttonClass}>
        Request this piece
        <Arrow className="ml-[0.65em]" />
      </button>

      <dialog ref={dialog} aria-labelledby={`${id}-title`} className="drawer">
        {/* Photo and form move as one sheet, rising from the bottom. */}
        <div className="drawer-sheet absolute inset-0 flex">
          {photo?.src && (
            // The garment beside the form; clicking it closes the drawer.
            <div aria-hidden className="relative min-w-0 flex-1 max-md:hidden" onClick={close}>
              {/* Eager, so the photo is ready by the time the drawer opens. */}
              <Image src={photo.src} alt="" fill sizes="60vw" loading="eager" className="object-cover object-[50%_30%]" />
            </div>
          )}

          <div className="ml-auto flex h-full w-full shrink-0 flex-col gap-6 overflow-y-auto bg-white px-4 py-8 text-ink md:w-[clamp(440px,41.667vw,600px)] md:px-14 md:py-12">
          <div className="flex items-start justify-between">
            <p className="text-[12px] leading-[normal] font-semibold uppercase tracking-[0.12em] text-muted">
              {sent ? "Request sent" : "Request"}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-m-2 p-2 transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-black"
            >
              <svg aria-hidden viewBox="0 0 14 14" className="size-3.5" stroke="currentColor" strokeWidth="1.4">
                <path d="M1 1l12 12M13 1 1 13" />
              </svg>
            </button>
          </div>

          {!sent && (
          <div className="flex flex-col gap-1 border-y border-[#d9d9d9] py-4 leading-[normal]">
            <p className="text-[15px] font-semibold">
              No. {no} — <span className="uppercase">{title}</span>
            </p>
            <p className="text-[13px] text-muted">{summary}</p>
          </div>
          )}

          {sent ? (
            <div className="mt-4 flex flex-col gap-6" role="status">
              <h2 id={`${id}-title`} className="text-[32px] leading-[1.2] font-semibold">
                Your request has been received
              </h2>
              <ol className="flex flex-col gap-6">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-5 border-t border-[#d9d9d9] pt-4">
                    <span aria-hidden className="w-[1ch] text-[28px] leading-[normal] font-bold text-[#bfbfbf]">
                      {i + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="text-[17px] leading-[normal] font-semibold">{step.title}</p>
                      <p className="text-[14px] leading-[1.5] text-muted">
                        {step.lines.map((line, j) => (
                          <span key={j} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/#collection" onClick={close} className={`${outlineButtonClass} mt-3.5`}>
                Back to the collection
              </Link>
            </div>
          ) : (
            <>
              <h2 id={`${id}-title`} className="text-[28px] leading-[normal] font-semibold">
                Why this garment?
              </h2>

              <form noValidate onSubmit={submit} onChange={recheck} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1 max-[480px]:gap-6">
                  <label className="flex min-w-0 flex-col gap-2">
                    <span className={fieldLabel}>Name</span>
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      aria-invalid={!!errors.name || undefined}
                      aria-describedby={errors.name ? `${id}-name-error` : undefined}
                      className={fieldInput}
                    />
                    {errors.name && (
                      <span id={`${id}-name-error`} className={errorText}>
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <label className="flex min-w-0 flex-col gap-2">
                    <span className={fieldLabel}>City</span>
                    <input
                      name="city"
                      required
                      autoComplete="address-level2"
                      placeholder="London"
                      aria-invalid={!!errors.city || undefined}
                      aria-describedby={errors.city ? `${id}-city-error` : undefined}
                      className={fieldInput}
                    />
                    {errors.city && (
                      <span id={`${id}-city-error`} className={errorText}>
                        {errors.city}
                      </span>
                    )}
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabel}>Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@email.com"
                    aria-invalid={!!errors.email || undefined}
                    aria-describedby={errors.email ? `${id}-email-error` : undefined}
                    className={fieldInput}
                  />
                  {errors.email && (
                    <span id={`${id}-email-error`} className={errorText}>
                      {errors.email}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabel}>Message</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="What draws you in? Share why you want to be part of this movement"
                    className={`${fieldInput} min-h-[114px] resize-y`}
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[18px] text-[#595959]">
                    <span className="relative flex size-[18px] shrink-0">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                        aria-invalid={!!errors.consent || undefined}
                        aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
                        className="peer size-full cursor-pointer appearance-none rounded-none border border-ink bg-white checked:bg-ink aria-invalid:border-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      />
                      <svg
                        aria-hidden
                        viewBox="0 0 18 18"
                        className="pointer-events-none absolute inset-0 hidden text-white peer-checked:block"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M4.5 9.5l3 3 6-7" />
                      </svg>
                    </span>
                    I understand order approval and payment details are handled via email.
                  </label>
                  {errors.consent && (
                    <span id={`${id}-consent-error`} className={`${errorText} pl-[30px]`}>
                      {errors.consent}
                    </span>
                  )}
                </div>

                <button type="submit" className={buttonClass}>
                  Submit request
                  <Arrow className="ml-[0.65em]" />
                </button>
              </form>

              <p className="text-[13px] leading-[1.4] text-muted">
                Each request is read personally. If selected, you will receive an email to
                complete your purchase.
              </p>
            </>
          )}
          </div>
        </div>
      </dialog>
    </>
  );
}
