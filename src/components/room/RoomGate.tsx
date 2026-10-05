"use client";

import { useActionState, useEffect, useState } from "react";
import { enterRoom, type GateState } from "@/app/room/[slug]/actions";

const ERROR_BLUE = "text-[#2137e1]";

/**
 * The keyword form of the Listening Room gate (Figma "07 — Room gate" and
 * "08 — Room gate · wrong word"). The word is checked on the server; this
 * component only shows the result.
 */
export function RoomGate({ slug, initial }: { slug: string; initial: GateState }) {
  const [state, formAction, pending] = useActionState(enterRoom.bind(null, slug), initial);
  const locked = useLockCountdown(state);
  const wrong = state.status === "wrong";

  return (
    <form action={formAction} className="flex flex-col">
      <label htmlFor="room-word" className="sr-only">
        Third word of the concept text
      </label>
      <input
        id="room-word"
        name="word"
        required
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="_"
        disabled={locked !== null}
        aria-invalid={wrong || undefined}
        aria-describedby={wrong ? "room-word-error" : locked !== null ? "room-locked" : undefined}
        // A fresh, empty field after each wrong word.
        key={wrong ? `wrong-${state.attemptsLeft}` : "word"}
        className="h-[54px] w-full rounded-none border-b border-[#333] bg-transparent pt-3.5 pb-2.5 font-(family-name:--font-courier) text-[26px] leading-[normal] text-ink outline-none placeholder:text-[#808080] focus:border-ink disabled:opacity-40"
      />

      {wrong && (
        <p id="room-word-error" role="alert" className={`mt-3.5 flex gap-2 text-[13px] leading-[1.45] ${ERROR_BLUE}`}>
          <svg aria-hidden viewBox="0 0 12 12" className="mt-[0.3em] size-3 shrink-0" stroke="currentColor" strokeWidth="1.3">
            <path d="M1 1l10 10M11 1 1 11" />
          </svg>
          <span>
            Incorrect word. Check the <strong className="font-semibold">concept text</strong> printed
            inside the garment and try again, following the guide above.
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={pending || locked !== null}
        className={`${wrong ? "mt-[30px]" : "mt-6"} flex h-[50px] items-center justify-center bg-ink text-[15px] font-semibold uppercase tracking-[0.1em] text-[#f2f2f2] shadow-[inset_0_0_0_1px_#1a1a1a] transition-colors duration-300 hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink disabled:hover:text-[#f2f2f2] motion-reduce:transition-none`}
      >
        {pending ? "Checking…" : wrong ? "Try again" : "Enter the room"}
      </button>

      {locked !== null && (
        <p id="room-locked" role="status" className="mt-[30px] text-center text-[12px] leading-[1.5] text-black">
          Maximum attempts reached.
          <br />
          The room is locked;{" "}
          <strong className="font-semibold">
            try again in {locked} {locked === 1 ? "minute" : "minutes"}.
          </strong>
        </p>
      )}
    </form>
  );
}

/** Minutes left on a lock (rounded up), or null once the room can be tried again. */
function useLockCountdown(state: GateState) {
  const until = state.status === "locked" ? state.lockedUntil : 0;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const tick = () => setNow(Date.now());
    // Sync to the moment the lock arrived, then keep counting down.
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [until]);
  return until > now ? Math.ceil((until - now) / 60_000) : null;
}
