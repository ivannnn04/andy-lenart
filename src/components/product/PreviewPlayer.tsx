"use client";

import { useEffect, useRef, useState } from "react";

// Bar heights (px) of the waveform in the design.
const BARS = [
  6, 27, 33, 28, 14, 22, 31, 32, 22, 6, 27, 33, 28, 14, 22, 31, 32, 22, 7, 28, 33, 28, 14, 22,
  32, 31, 21, 7, 28, 33, 27, 13, 23, 32, 31, 21, 7, 28, 33, 27, 13, 23, 32, 31, 21, 8, 29, 33,
];

const toClock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Soft edges so the clipped preview doesn't start or stop with a click.
const FADE_IN = 0.5;
const FADE_OUT = 1.5;

/**
 * 30-second track preview: play/pause, a waveform that fills as it plays and
 * the elapsed time. Without an audio file the button is disabled.
 */
export function PreviewPlayer({ src, duration }: { src?: string; duration: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState<number | null>(null);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onMeta = () => setLength(el.duration);
    const onEnd = () => {
      setPlaying(false);
      el.currentTime = 0;
      setTime(0);
    };
    // Metadata may already be loaded before hydration.
    if (el.readyState >= 1) onMeta();
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  // While playing: follow the playhead every frame (smooth waveform) and
  // shape the volume for the fade in/out.
  useEffect(() => {
    const el = audio.current;
    if (!el || !playing) return;
    let frame = 0;
    const tick = () => {
      const t = el.currentTime;
      const d = el.duration || 0;
      el.volume = Math.max(0, Math.min(1, t / FADE_IN, d ? (d - t) / FADE_OUT : 1));
      setTime(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const progress = length ? time / length : 0;
  const played = Math.round(progress * BARS.length);

  return (
    <div className="flex items-center gap-4 border border-ink py-3.5 pr-5 pl-4">
      {src && <audio ref={audio} src={src} preload="metadata" />}
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-label={src ? (playing ? "Pause preview" : "Play preview") : "Preview coming soon"}
        title={src ? undefined : "Preview coming soon"}
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed"
      >
        {playing ? (
          <svg aria-hidden viewBox="0 0 12 12" className="size-3 fill-current">
            <rect x="2" y="1" width="3" height="10" />
            <rect x="7" y="1" width="3" height="10" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 12 12" className="ml-0.5 size-3 fill-current">
            <path d="M2 1l9 5-9 5z" />
          </svg>
        )}
      </button>
      <div aria-hidden className="flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden">
        {BARS.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] shrink-0 ${i < played ? "bg-ink" : "bg-[#bfbfbf]"}`}
            style={{ height: h }}
          />
        ))}
      </div>
      <p className="shrink-0 text-[12px] font-medium whitespace-nowrap text-body" aria-live="off">
        {toClock(time)} / {duration}
      </p>
    </div>
  );
}
