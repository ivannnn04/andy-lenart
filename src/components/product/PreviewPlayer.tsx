"use client";

import { useEffect, useRef, useState } from "react";

// Placeholder bar heights (px) from the design, used when no waveform is given.
const DESIGN_BARS = [
  6, 27, 33, 28, 14, 22, 31, 32, 22, 6, 27, 33, 28, 14, 22, 31, 32, 22, 7, 28, 33, 28, 14, 22,
  32, 31, 21, 7, 28, 33, 27, 13, 23, 32, 31, 21, 7, 28, 33, 27, 13, 23, 32, 31, 21, 8, 29, 33,
];

const toClock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Playback level (0–1): the preview plays quieter than full volume.
const MAX_VOLUME = 0.45;
// Soft edges so the clipped preview doesn't start or stop with a click.
const FADE_IN = 0.5;
const FADE_OUT = 1.5;

// Starting one preview pauses any other one on the page.
const PLAY_EVENT = "preview:play";

/**
 * 30-second track preview: play/pause, a waveform that fills as it plays and
 * the elapsed time. Without an audio file the button is disabled.
 *
 * `compact` is the collection-card version: no frame, a smaller button, the
 * waveform squeezed to the card width and a single clock (the length at rest,
 * the time left while playing).
 */
export function PreviewPlayer({
  src,
  duration,
  waveform = DESIGN_BARS,
  variant = "full",
  title,
}: {
  src?: string;
  duration: string;
  /** Bar heights in px, e.g. measured from the audio itself. */
  waveform?: number[];
  variant?: "full" | "compact";
  /** Track name for the button label, where the context doesn't give it. */
  title?: string;
}) {
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
    const onOtherPlay = (e: Event) => {
      if (e.target !== el && !el.paused) {
        el.pause();
        setPlaying(false);
      }
    };
    el.addEventListener("ended", onEnd);
    document.addEventListener(PLAY_EVENT, onOtherPlay);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
      document.removeEventListener(PLAY_EVENT, onOtherPlay);
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
      el.volume = MAX_VOLUME * Math.max(0, Math.min(1, t / FADE_IN, d ? (d - t) / FADE_OUT : 1));
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
      el.dispatchEvent(new Event(PLAY_EVENT, { bubbles: true }));
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const progress = length ? time / length : 0;
  const played = Math.round(progress * waveform.length);
  const compact = variant === "compact";

  const name = title ? `: ${title}` : "";
  const buttonLabel = src
    ? `${playing ? "Pause" : "Play"} preview${name}`
    : `Preview coming soon${name}`;

  const button = (
    <button
      type="button"
      onClick={toggle}
      disabled={!src}
      aria-label={buttonLabel}
      title={src ? undefined : "Preview coming soon"}
      className={`flex shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:hover:opacity-100 ${
        compact ? `size-8 ${src ? "bg-ink" : "bg-[#bfbfbf]"}` : "size-11 bg-ink"
      }`}
    >
      {playing ? (
        <svg aria-hidden viewBox="0 0 12 12" className={`fill-current ${compact ? "size-2.5" : "size-3"}`}>
          <rect x="2" y="1" width="3" height="10" />
          <rect x="7" y="1" width="3" height="10" />
        </svg>
      ) : (
        <svg aria-hidden viewBox="0 0 12 12" className={`ml-0.5 fill-current ${compact ? "size-2.5" : "size-3"}`}>
          <path d="M2 1l9 5-9 5z" />
        </svg>
      )}
    </button>
  );

  const audioEl = src && <audio ref={audio} src={src} preload="metadata" />;

  if (compact) {
    return (
      <div className="flex items-center gap-2.5">
        {audioEl}
        {button}
        {/* Every bar gets an equal slice of the width, so all 48 fit any card. */}
        <div aria-hidden className="flex h-5 min-w-0 flex-1 items-center">
          {waveform.map((h, i) => (
            <span key={i} className="flex min-w-0 flex-1 justify-center">
              <span
                className={`w-[60%] max-w-[3px] min-w-px ${
                  i < played ? "bg-ink" : src ? "bg-[#bfbfbf]" : "bg-[#e0e0e0]"
                }`}
                style={{ height: Math.max(2, Math.round(h * 0.6)) }}
              />
            </span>
          ))}
        </div>
        <p
          className={`shrink-0 text-[12px] font-medium tracking-[0.06em] tabular-nums whitespace-nowrap ${
            src ? "text-ink" : "text-subtle"
          }`}
        >
          {length && (playing || time > 0) ? toClock(length - time) : duration}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 border border-ink py-3.5 pr-5 pl-4">
      {audioEl}
      {button}
      <div aria-hidden className="flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden">
        {waveform.map((h, i) => (
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
