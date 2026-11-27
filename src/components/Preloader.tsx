"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { backgroundSound } from "@/lib/background-sound";
import { parseInline, type InlineNode } from "@/lib/markup";

// The shortest time the opening stays up, so the words can be read.
const MIN_MS = 2600;

// Shown once per browser tab: the first time the visitor opens the site.
// Coming back to the home page later (a link, the logo, a reload) skips it.
// The tab remembers it in sessionStorage; `shownThisLoad` covers moves inside
// the site that don't reload the page.
let shownThisLoad = false;
const SEEN_KEY = "andy-lenart:intro-seen";
// Runs before the page is painted, so a returning visitor never sees the black screen flash.
const SEEN_SCRIPT = `try{sessionStorage.getItem("${SEEN_KEY}")&&document.documentElement.classList.add("intro-seen")}catch(e){}`;
const remember = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
};
// Read once per page load: whether the tab had already seen it before this load.
let seenAtLoad: boolean | undefined;
const seenBefore = () => {
  if (seenAtLoad === undefined) {
    try {
      seenAtLoad = sessionStorage.getItem(SEEN_KEY) !== null;
    } catch {
      seenAtLoad = false;
    }
  }
  return seenAtLoad;
};
const noSubscribe = () => () => {};

type Piece = { text: string; b?: boolean; i?: boolean; u?: boolean };

/** The line split into words, each word in pieces that keep their bold, italic or underline. */
function styledWords(lines: string[]) {
  const pieces = (nodes: InlineNode[], style: Omit<Piece, "text">): Piece[] =>
    nodes.flatMap((n) =>
      n.t === "text" ? [{ text: n.v, ...style }] : pieces(n.c, n.t === "a" ? style : { ...style, [n.t]: true }),
    );
  return lines.map((line) => {
    const words: Piece[][] = [[]];
    for (const p of pieces(parseInline(line), {}))
      p.text.split(/(\s+)/).forEach((part, k) => {
        if (k % 2) words.push([]);
        else if (part) words[words.length - 1].push({ ...p, text: part });
      });
    return words.filter((w) => w.length);
  });
}

/**
 * The opening screen (Figma "Desktop - 35"): the line of text rises word by
 * word while the page loads and then stays until the visitor picks "Sound on"
 * or "off"; only then does the black lift away. "On" starts the background
 * track (browsers only allow sound after a click); afterwards the sound wave
 * in the header switches it (SoundWave). Without a track there is nothing to
 * pick, so the screen leaves by itself once the page has loaded. The <audio>
 * itself is the root layout's BackgroundTrack.
 */
export function Preloader({ lines, track }: { lines: string[]; track: string }) {
  const [state, setPhase] = useState<"open" | "leaving" | "gone">(() => (shownThisLoad ? "gone" : "open"));
  // Already seen in this tab: straight to the page (the server can't know, so it renders the screen).
  const seen = useSyncExternalStore(noSubscribe, seenBefore, () => false);
  const phase = seen ? "gone" : state;
  const sound = useSyncExternalStore(backgroundSound.subscribe, backgroundSound.isPlaying, () => false);
  // Whether the visitor has picked on or off yet (until then both read grey, as in the design).
  const [picked, setPicked] = useState(false);
  const leave = useCallback(() => {
    shownThisLoad = true;
    remember();
    setPhase((p) => (p === "open" ? "leaving" : p));
  }, []);

  // No track, no choice to wait for: leave once the page has loaded and the words have had their time.
  useEffect(() => {
    if (phase !== "open" || track) return;
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
  }, [phase, leave, track]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("gone"), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  const turn = (on: boolean) => {
    setPicked(true);
    backgroundSound.turn(on);
  };

  // Each word rises on its own, keeping the styles set in the editor.
  const words = styledWords(lines);
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
      {phase !== "gone" && <script dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }} />}
      {phase !== "gone" && (
        <div
          className={`preloader fixed inset-0 z-[100] flex cursor-default flex-col items-center justify-center bg-black px-6 text-white ${
            phase === "leaving" ? "is-leaving" : ""
          }`}
          // With a track it waits for "on" or "off"; without one a click anywhere skips the wait.
          onClick={track ? undefined : leave}
          aria-label={track ? "Sound on or off?" : "Loading"}
          role={track ? "dialog" : "status"}
          aria-modal={track ? true : undefined}
        >
          <p className="pl-text w-fit max-w-[915px] text-[clamp(32px,4.45vw,64px)] leading-none font-black uppercase">
            {words.map((line, i) => (
              <span key={i} className="block">
                {line.map((word, j) => (
                  <span key={j} className="pl-word" style={{ "--i": n++ } as CSSProperties}>
                    <span>
                      {word.map((p, k) => (
                        <span key={k} className={[p.b && "font-black", p.i && "italic", p.u && "underline"].filter(Boolean).join(" ") || undefined}>
                          {p.text}
                        </span>
                      ))}
                    </span>
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
    </>
  );
}

