"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { MAX_MARK_LENGTH, SEED_MARKS, type Mark } from "@/lib/staircase";

// Marks left on this device (the wall has no shared database yet).
const STORAGE_KEY = "staircase-marks";

type Errors = Partial<Record<"name" | "city" | "text", string>>;

function validate(data: FormData): Errors {
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = "Add a nickname.";
  if (!value("city")) errors.city = "Add your city.";
  const text = value("text");
  if (!text) errors.text = "Write a thought first.";
  else if (text.length > MAX_MARK_LENGTH) errors.text = `Keep it under ${MAX_MARK_LENGTH} characters.`;
  return errors;
}

// Loosely scattered columns, as on the design's wall: each mark is nudged
// down and sideways by a repeating pattern.
const NUDGES = [
  [0, 0],
  [40, 24],
  [-12, 56],
  [28, 8],
  [64, 40],
  [8, 16],
  [-8, 48],
];

/**
 * "+ leave your mark" button, the bottom sheet it opens (Figma "Bottom
 * sheet") and the wall of marks below.
 */
export function StaircaseWall({ garmentNo }: { garmentNo: string }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const [mine, setMine] = useState<Mark[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [count, setCount] = useState(0);
  const id = useId();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after hydration
      if (Array.isArray(saved)) setMine(saved);
    } catch {
      // Storage unavailable or corrupt: start with the shared wall only.
    }
  }, []);

  const open = () => {
    setErrors({});
    setAttempted(false);
    sheet.current?.showModal();
  };
  const close = () => sheet.current?.close();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setAttempted(true);
    setErrors(found);
    const first = (["name", "city", "text"] as const).find((f) => found[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const mark: Mark = {
      id: `${Date.now()}`,
      text: String(data.get("text")).trim(),
      name: String(data.get("name")).trim(),
      city: String(data.get("city")).trim(),
      no: garmentNo,
    };
    const next = [mark, ...mine];
    setMine(next);
    setFresh(mark.id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Not saved for next time, but it is on the wall now.
    }
    form.reset();
    setCount(0);
    close();
  };

  const marks = [...mine, ...SEED_MARKS];
  const field = (name: keyof Errors) => ({
    "aria-invalid": !!errors[name] || undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const error = (name: keyof Errors) =>
    errors[name] && (
      <span id={`${id}-${name}-error`} className="text-[13px] leading-[1.4] normal-case tracking-normal text-[#ff8a7a]">
        {errors[name]}
      </span>
    );
  const input =
    "w-full rounded-none border-b border-white bg-transparent py-2.5 text-[17px] leading-[normal] font-normal normal-case tracking-normal text-white [--autofill-text:#fff] outline-none placeholder:text-[#737373] focus:border-b-2 aria-invalid:border-[#ff8a7a]";
  const label = "flex flex-col gap-1.5 text-[16px] leading-[normal] font-medium uppercase tracking-[0.1em]";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="mt-[max(20px,calc(29*var(--u)))] bg-black px-6 py-4 text-[clamp(18px,calc(24*var(--u)),24px)] leading-[normal] font-bold text-white shadow-[inset_0_0_0_2px_#000] transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black motion-reduce:transition-none"
      >
        + leave your mark
      </button>

      <ul
        aria-label="Marks left on the Staircase"
        className="mt-16 grid w-full max-w-[1200px] grid-cols-1 gap-x-[calc(48*var(--u))] gap-y-10 sm:grid-cols-2 md:mt-[calc(110*var(--u))] md:grid-cols-3 md:gap-y-[calc(64*var(--u))]"
      >
        {marks.map((mark, i) => {
          const [dy, dx] = NUDGES[i % NUDGES.length];
          const short = mark.text.length <= 8;
          return (
            <li
              key={mark.id}
              className={`staircase-mark md:translate-x-[var(--dx)] md:translate-y-[var(--dy)] ${mark.id === fresh ? "is-fresh" : ""}`}
              style={{ "--dx": `calc(${dx} * var(--u))`, "--dy": `calc(${dy} * var(--u))` } as CSSProperties}
            >
              <blockquote>
                <p
                  className={`max-w-[300px] leading-none text-black ${
                    short ? "text-[clamp(26px,calc(34*var(--u)),34px)]" : "text-[clamp(20px,calc(24*var(--u)),24px)] leading-[1.15]"
                  }`}
                >
                  {mark.text}
                </p>
                <footer className="mt-2 text-[clamp(13px,calc(16*var(--u)),16px)] tracking-[0.04em] text-[#333]">
                  {mark.name} · {mark.city} · {mark.no}
                </footer>
              </blockquote>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={sheet}
        aria-labelledby={`${id}-title`}
        className="staircase-sheet"
        // A click on the dimmed page around the sheet closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="staircase-sheet-panel mx-auto w-full max-w-[849px] bg-black px-6 pt-7 pb-8 text-white">
          <div className="flex items-start justify-between">
            <span aria-hidden className="block h-1 w-10 bg-[#d9d9d9]" />
            <button type="button" onClick={close} aria-label="Close" className="-m-2 p-2 transition-opacity hover:opacity-60">
              <svg aria-hidden viewBox="0 0 14 14" className="size-3.5" stroke="currentColor" strokeWidth="1.4">
                <path d="M1 1l12 12M13 1 1 13" />
              </svg>
            </button>
          </div>
          <h2 id={`${id}-title`} className="mt-9 text-[clamp(28px,4vw,36px)] leading-[normal] font-bold uppercase">
            Share your thoughts
          </h2>

          <form
            noValidate
            onSubmit={submit}
            onChange={(e) => attempted && setErrors(validate(new FormData(e.currentTarget)))}
            className="mt-6 flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[290px_minmax(0,1fr)] sm:gap-4">
              <label className={label}>
                Nickname
                <input name="name" autoComplete="nickname" placeholder="Mira" maxLength={40} className={input} {...field("name")} />
                {error("name")}
              </label>
              <label className={label}>
                City
                <input name="city" autoComplete="address-level2" placeholder="London" maxLength={60} className={input} {...field("city")} />
                {error("city")}
              </label>
            </div>
            <label className={label}>
              Thought
              <textarea
                name="text"
                rows={3}
                maxLength={MAX_MARK_LENGTH}
                placeholder="Impression, feeling, memory..."
                onInput={(e) => setCount(e.currentTarget.value.length)}
                className={`${input} min-h-[99px] resize-none text-[16px]`}
                {...field("text")}
              />
              {error("text")}
            </label>
            <p className="-mt-3 text-[16px] text-[#d9d9d9]" aria-live="polite">
              {count} / {MAX_MARK_LENGTH}
            </p>
            <button
              type="submit"
              className="mx-auto mt-1 h-[50px] w-full max-w-[256px] bg-white text-[20px] font-bold uppercase tracking-[0.06em] text-black shadow-[inset_0_0_0_2px_#fff] transition-colors duration-300 hover:bg-black hover:text-white motion-reduce:transition-none"
            >
              Add to the wall
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
