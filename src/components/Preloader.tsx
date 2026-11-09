"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { backgroundSound } from "@/lib/background-sound";

// The shortest time the opening stays up, so the words can be read.
const MIN_MS = 2600;

// Shown on every load or reload of the page; coming back to the home page
// by a link inside the site (no reload) skips it.
let shownThisLoad = false;

/**
 * The opening screen (Figma "Desktop - 35"): the line of text rises word by
 * word while the page loads, then the black lifts away. "Sound on / off"
 * starts the background track (browsers only allow sound after a click), and
 * a small switch in the corner keeps it at hand afterwards.
 */
export function Preloader({ lines, track }: { lines: string[]; track: string }) {
  const [phase, setPhase] = useState<"open" | "leaving" | "gone">(() => (shownThisLoad ? "gone" : "open"));
  const sound = useSyncExternalStore(backgroundSound.subscribe, backgroundSound.isPlaying, () => false);
  // Whether the visitor has picked on or off yet (until then both read grey, as in the design).
  const [picked, setPicked] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  // The track is shared with the header's sound wave and the corner switch.
  useEffect(() => {
    backgroundSound.attach(audio.current);
    return () => backgroundSound.attach(null);
  }, [track]);

  const leave = useCallback(() => {
    shownThisLoad = true;
    setPhase((p) => (p === "open" ? "leaving" : p));
  }, []);

  // Leave once the page has loaded and the words have had their time.
  useEffect(() => {
    if (phase !== "open") return;
    const started = performance.now();
    let timer: number | undefined;
    const done = () => {
      timer = window.setTimeout(leave, Math.max(0, MIN_MS - (performance.now() - started)));
    };
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    // Never wait on a slow image for long.
    const cap = window.setTimeout(leave, 6000);
    const key = (e: KeyboardEvent) => e.key === "Escape" && leave();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("load", done);
      window.removeEventListener("keydown", key);
      window.clearTimeout(timer);
      window.clearTimeout(cap);
    };
  }, [phase, leave]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("gone"), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  const turn = (on: boolean) => {
    setPicked(true);
    backgroundSound.turn(on);
  };

  const words = lines.map((line) => line.split(/\s+/).filter(Boolean));
  let n = 0;

  const choice = (on: boolean, label: string) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        turn(on);
        if (phase === "open") window.setTimeout(leave, 500);
      }}
      aria-pressed={picked && sound === on}
      className={`transition-colors duration-300 hover:text-white ${picked && sound === on ? "text-white" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <>
      {track && <audio ref={audio} src={track} loop preload="none" />}

      {phase !== "gone" && (
        <div
          className={`preloader fixed inset-0 z-[100] flex cursor-default flex-col items-center justify-center bg-black px-6 text-white ${
            phase === "leaving" ? "is-leaving" : ""
          }`}
          // A click anywhere skips the wait.
          onClick={leave}
          aria-label="Loading"
          role="status"
        >
          <p className="pl-text w-fit max-w-[915px] text-[clamp(32px,4.45vw,64px)] leading-none font-black uppercase">
            {words.map((line, i) => (
              <span key={i} className="block">
                {line.map((word, j) => (
                  <span key={j} className="pl-word" style={{ "--i": n++ } as CSSProperties}>
                    <span>{word}</span>
                    {j < line.length - 1 && " "}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <span aria-hidden className="pl-bar mt-8 block h-px w-[min(240px,50vw)] bg-[#333] md:mt-10">
            <span className="block h-full bg-white" />
          </span>
          {track && (
            <p className="pl-sound mt-10 text-[13px] tracking-[0.12em] text-[#808080] md:mt-[72px] md:text-[15px]">
              SOUND {choice(true, "ON")} / {choice(false, "OFF")}
            </p>
          )}
        </div>
      )}

      {/* Afterwards: the switch stays in the corner while there is a track. */}
      {track && phase === "gone" && (
        <button
          type="button"
          onClick={() => backgroundSound.toggle()}
          aria-pressed={sound}
          aria-label={sound ? "Sound off" : "Sound on"}
          className="sound-switch fixed bottom-4 left-4 z-50 flex items-center gap-2 text-[12px] tracking-[0.12em] text-white mix-blend-difference md:bottom-6 md:left-6"
        >
          <span aria-hidden className={`sound-bars ${sound ? "is-on" : ""}`}>
            <span />
            <span />
            <span />
          </span>
          SOUND {sound ? "ON" : "OFF"}
        </button>
      )}
    </>
  );
}

