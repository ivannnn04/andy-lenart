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
// down and sideways by a repeating pattern (as margin / padding, so it takes
// up room and a mark never runs into its neighbours).
const NUDGES = [
  [0, 0],
  [40, 24],
  [-12, 56],
  [28, 8],
  [64, 40],
  [8, 16],
  [-8, 48],
];

// On phones the wall is a single column; each mark is indented by its own
// amount (phone design px, scaled down on narrower screens).
const PHONE_INDENTS = [0, 111, 9, 57, 9, 39, 143, 0, 46, 0];

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
  const label =
    "flex flex-col gap-1 text-[12px] leading-[normal] font-normal uppercase tracking-[0.1em] md:gap-1.5 md:text-[16px] md:font-medium";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="mt-[13px] bg-black px-6 py-4 text-[15px] leading-[normal] md:mt-[max(20px,calc(29*var(--u)))] md:text-[clamp(18px,calc(24*var(--u)),24px)] font-bold text-white shadow-[inset_0_0_0_2px_#000] transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black motion-reduce:transition-none"
      >
        + leave your mark
      </button>

      <ul
        aria-label="Marks left on the Staircase"
        className="mt-[61px] grid w-full max-w-[1200px] grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16 md:mt-[calc(110*var(--u))] md:grid-cols-3 md:gap-x-[max(40px,calc(96*var(--u)))] md:gap-y-[max(56px,calc(96*var(--u)))]"
      >
        {marks.map((mark, i) => {
          const [dy, dx] = NUDGES[i % NUDGES.length];
          const mx = PHONE_INDENTS[i % PHONE_INDENTS.length];
          const short = mark.text.length <= 8;
          const long = mark.text.length > 60;
          return (
            <li
              key={mark.id}
              className={`staircase-mark min-w-0 max-sm:pl-[var(--mx)] sm:max-md:mt-[var(--ty)] sm:max-md:pl-[var(--tx)] md:mt-[var(--dy)] md:pl-[var(--dx)] ${mark.id === fresh ? "is-fresh" : ""}`}
              style={
                {
                  "--mx": `min(${mx}px, ${((mx / 390) * 100).toFixed(2)}vw)`,
                  // Tablets (two columns): the phone indents, halved, plus the desktop drops.
                  "--tx": `${Math.round(mx * 0.5)}px`,
                  "--ty": `${dy}px`,
                  "--dx": `calc(${dx} * var(--u))`,
                  "--dy": `calc(${dy} * var(--u))`,
                } as CSSProperties
              }
            >
              <blockquote>
                <p
                  className={`max-w-[min(300px,100%)] leading-none [overflow-wrap:anywhere] text-black ${
                    short
                      ? "text-[34px] md:text-[clamp(26px,calc(34*var(--u)),34px)]"
                      : `${long ? "text-[14px] leading-[1.45]" : "text-[20px] leading-[1.15]"} md:text-[clamp(20px,calc(24*var(--u)),24px)] md:leading-[1.15]`
                  }`}
                >
                  {mark.text}
                </p>
                <footer className="mt-1.5 text-[13px] tracking-[0.04em] text-[#333] md:mt-2 md:text-[clamp(13px,calc(16*var(--u)),16px)]">
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
        <div className="staircase-sheet-panel mx-auto w-full max-w-[849px] bg-black px-6 pt-7 pb-9 text-white md:pb-8">
          <div className="flex items-start justify-between">
            <span aria-hidden className="block h-1 w-10 bg-[#d9d9d9]" />
            {/* Phones close it by tapping above the sheet, as in the design; desktop gets a cross. */}
            <button type="button" onClick={close} aria-label="Close" className="-m-2 p-2 transition-opacity hover:opacity-60 max-md:hidden">
              <svg aria-hidden viewBox="0 0 14 14" className="size-3.5" stroke="currentColor" strokeWidth="1.4">
                <path d="M1 1l12 12M13 1 1 13" />
              </svg>
            </button>
          </div>
          <h2 id={`${id}-title`} className="mt-[50px] text-[24px] leading-[normal] font-bold uppercase md:mt-9 md:text-[36px]">
            Share your thoughts
          </h2>

          <form
            noValidate
            onSubmit={submit}
            onChange={(e) => attempted && setErrors(validate(new FormData(e.currentTarget)))}
            className="mt-[50px] flex flex-col gap-5 md:mt-6"
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-[290px_minmax(0,1fr)]">
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
                className={`${input} min-h-[86px] resize-none text-[15px] md:min-h-[99px] md:text-[16px]`}
                {...field("text")}
              />
              {error("text")}
            </label>
            <p className="-mt-3 text-[12px] text-[#d9d9d9] md:text-[16px]" aria-live="polite">
              {count} / {MAX_MARK_LENGTH}
            </p>
            <button
              type="submit"
              className="mx-auto mt-[15px] h-[50px] w-full bg-white text-[15px] font-bold uppercase tracking-[0.06em] md:mt-1 md:max-w-[256px] md:text-[20px] text-black shadow-[inset_0_0_0_2px_#fff] transition-colors duration-300 hover:bg-black hover:text-white motion-reduce:transition-none"
            >
              Add to the wall
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
