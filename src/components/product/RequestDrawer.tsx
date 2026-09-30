"use client";

import Image from "next/image";
import { useId, useRef, useState, type FormEvent } from "react";
import { Arrow } from "@/components/Arrow";
import type { GarmentImage } from "@/lib/garments";
import { CONTACT_EMAIL } from "@/lib/site";

const buttonClass =
  "flex w-full items-center justify-center bg-ink px-7 py-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap text-white shadow-[inset_0_0_0_1px_#1a1a1a] transition-colors duration-300 hover:bg-white hover:text-ink motion-reduce:transition-none";
const fieldLabel = "text-[14px] leading-[normal] font-medium uppercase tracking-[0.1em] text-[#595959]";
const fieldInput =
  "w-full rounded-none border border-[#4d4d4d] bg-white p-4 text-[15px] leading-[normal] text-ink placeholder:text-[#999] focus:border-ink focus:shadow-[inset_0_0_0_1px_#1a1a1a] focus:outline-none";

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
  const id = useId();

  const open = () => {
    setSent(false);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
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

      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        className="drawer"
        // A click on the dialog itself (outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {photo?.src && (
          // The garment beside the drawer; clicking it closes the drawer too.
          <div aria-hidden className="drawer-photo absolute inset-y-0 left-0 max-md:hidden" onClick={close}>
            {/* Eager, so the photo is ready by the time the drawer opens. */}
            <Image src={photo.src} alt="" fill sizes="60vw" loading="eager" className="object-cover object-[50%_30%]" />
          </div>
        )}

        <div className="drawer-panel absolute inset-y-0 right-0 flex w-full flex-col gap-6 overflow-y-auto bg-white px-4 py-8 text-ink md:w-[clamp(440px,41.667vw,600px)] md:px-14 md:py-12">
          <div className="flex items-start justify-between">
            <p className="text-[12px] leading-[normal] font-medium uppercase tracking-[0.12em] text-muted">
              Request
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

          <div className="flex flex-col gap-1 border-y border-[#d9d9d9] py-4 leading-[normal]">
            <p className="text-[15px] font-bold">
              No. {no} — <span className="uppercase">{title}</span>
            </p>
            <p className="text-[13px] text-muted">{summary}</p>
          </div>

          {sent ? (
            <div className="flex flex-col gap-4" role="status">
              <h2 id={`${id}-title`} className="text-[28px] leading-[normal] font-bold">
                Almost there
              </h2>
              <p className="text-[15px] leading-[1.5] text-[#595959]">
                Your email app should open with the request ready to send. If it
                doesn’t, write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-draw text-ink">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <button type="button" onClick={close} className={`${buttonClass} mt-2`}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 id={`${id}-title`} className="text-[28px] leading-[normal] font-bold">
                Why this garment?
              </h2>

              <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex min-w-0 flex-col gap-2">
                    <span className={fieldLabel}>Name</span>
                    <input name="name" required autoComplete="name" placeholder="Your name" className={fieldInput} />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2">
                    <span className={fieldLabel}>City</span>
                    <input name="city" autoComplete="address-level2" placeholder="London" className={fieldInput} />
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
                    className={fieldInput}
                  />
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

                <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.4] text-[#595959]">
                  <span className="relative mt-px flex size-[18px] shrink-0">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="peer size-full cursor-pointer appearance-none rounded-none border border-ink bg-white checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
      </dialog>
    </>
  );
}
