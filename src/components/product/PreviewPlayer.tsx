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
 * Playback state for a preview <audio>: play/pause, the playhead (followed
 * every frame while playing) and the fade-shaped, quieter volume.
 */
function usePreviewAudio() {
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
    const onOtherPlay = (e: Event) => {
      if (e.target !== el && !el.paused) {
        el.pause();
        setPlaying(false);
      }
    };
    // Metadata may already be loaded before hydration.
    if (el.readyState >= 1) onMeta();
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    document.addEventListener(PLAY_EVENT, onOtherPlay);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
      document.removeEventListener(PLAY_EVENT, onOtherPlay);
    };
  }, []);

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

  return { audio, playing, time, length, toggle };
}

/**
 * 30-second track preview: play/pause, a waveform that fills as it plays and
 * the elapsed time. Without an audio file the button is disabled.
 */
export function PreviewPlayer({
  src,
  duration,
  waveform = DESIGN_BARS,
}: {
  src?: string;
  duration: string;
  /** Bar heights in px, e.g. measured from the audio itself. */
  waveform?: number[];
}) {
  const { audio, playing, time, length, toggle } = usePreviewAudio();

  const progress = length ? time / length : 0;
  const played = Math.round(progress * waveform.length);

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
        {waveform.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] shrink-0 ${i < played ? "bg-ink" : "bg-[#bfbfbf]"}`}
            style={{ height: h }}
          />
        ))}
      </div>
      <p className="shrink-0 font-ui text-[12px] font-medium whitespace-nowrap text-body" aria-live="off">
        {toClock(time)} / {duration}
      </p>
    </div>
  );
}

/**
 * The collection card's preview: just "▶ 0:30" in the meta row. The triangle
 * turns into a pause sign while the track plays.
 */
export function CardPreview({
  src,
  duration,
  title,
}: {
  src?: string;
  duration: string;
  /** Track name for the button label. */
  title: string;
}) {
  const { audio, playing, toggle } = usePreviewAudio();

  return (
    <>
      {src && <audio ref={audio} src={src} preload="metadata" />}
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-label={`${playing ? "Pause" : "Play"} preview: ${title}, ${duration}`}
        aria-pressed={playing}
        className="inline-flex items-center gap-[0.3em] tracking-[0.06em] text-ink transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-default disabled:hover:opacity-100"
      >
        <svg aria-hidden viewBox="0 0 12 12" className="size-[0.85em] fill-current">
          {playing ? (
            <>
              <rect x="1.5" y="1" width="3.25" height="10" />
              <rect x="7.25" y="1" width="3.25" height="10" />
            </>
          ) : (
            <path d="M1 0.5l10.5 5.5-10.5 5.5z" />
          )}
        </svg>
        {duration}
      </button>
    </>
  );
}
