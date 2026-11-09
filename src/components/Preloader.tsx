"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

// The shortest time the opening stays up, so the words can be read.
const MIN_MS = 2600;
const VOLUME = 0.6;

// Shown on every load or reload of the page; coming back to the home page
// by a link inside the site (no reload) skips it.
let shownThisLoad = false;

// Whether this browser lets the page change the volume (iOS does not).
let volumeWorks: boolean | undefined;
const canFade = () => {
  if (volumeWorks === undefined) {
    const probe = new Audio();
    probe.volume = 0.5;
    volumeWorks = probe.volume === 0.5;
  }
  return volumeWorks;
};

/**
 * The opening screen (Figma "Desktop - 35"): the line of text rises word by
 * word while the page loads, then the black lifts away. "Sound on / off"
 * starts the background track (browsers only allow sound after a click), and
 * a small switch in the corner keeps it at hand afterwards.
 */
export function Preloader({ lines, track }: { lines: string[]; track: string }) {
  const [phase, setPhase] = useState<"open" | "leaving" | "gone">(() => (shownThisLoad ? "gone" : "open"));
  const [sound, setSound] = useState(false);
  // Whether the visitor has picked on or off yet (until then both read grey, as in the design).
  const [picked, setPicked] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef<number>(undefined);

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

  const ramp = (to: number, then?: () => void) => {
    const el = audio.current;
    if (!el) return;
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const next = el.volume + (to > el.volume ? 0.04 : -0.06);
      if ((to > el.volume && next >= to) || (to <= el.volume && next <= to)) {
        el.volume = Math.max(0, Math.min(1, to));
        window.clearInterval(fade.current);
        then?.();
      } else el.volume = Math.max(0, Math.min(1, next));
    }, 60);
  };

  const turn = (on: boolean) => {
    const el = audio.current;
    setSound(on);
    setPicked(true);
    if (!el) return;
    // iPhones and iPads don't let a page set the volume: no fade there, just play and pause.
    const smooth = canFade();
    if (on) {
      if (smooth) el.volume = 0;
      el.play().then(() => smooth && ramp(VOLUME)).catch(() => setSound(false));
    } else if (smooth) ramp(0, () => el.pause());
    else el.pause();
  };

  // Any other sound on the page (a garment's preview) takes over from the background track.
  useEffect(() => {
    const other = (e: Event) => {
      if (e.target !== audio.current && sound) {
        audio.current?.pause();
        setSound(false);
      }
    };
    document.addEventListener("play", other, true);
    return () => document.removeEventListener("play", other, true);
  }, [sound]);

  useEffect(() => () => window.clearInterval(fade.current), []);

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
          onClick={() => turn(!sound)}
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

