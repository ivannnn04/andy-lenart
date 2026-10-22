"use client";

import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePreviewAudio } from "@/components/product/PreviewPlayer";

type RoomAudio = { src?: string; playing: boolean; time: number; toggle: () => void };

const Context = createContext<RoomAudio | null>(null);

/**
 * One player for the whole room: the tape starts and pauses it, the lyrics
 * follow its playhead.
 */
export function RoomAudioProvider({ src, children }: { src?: string; children: ReactNode }) {
  const { audio, playing, time, toggle } = usePreviewAudio();
  return (
    <Context.Provider value={{ src, playing, time, toggle }}>
      {src && <audio ref={audio} src={src} preload="metadata" />}
      {children}
    </Context.Provider>
  );
}

export function useRoomAudio() {
  const value = useContext(Context);
  if (!value) throw new Error("useRoomAudio needs a RoomAudioProvider");
  return value;
}

type Line = { time: number; text: string };

/** Index of the line being sung at `time` (-1 before the first one). */
const lineAt = (lines: Line[], time: number) => lines.findLastIndex((line) => time >= line.time);

/**
 * The lyric of the moment, one sentence at a time (Spotify-style): it
 * follows the track and each new line fades in. Before the music starts it
 * shows the first line.
 *
 * `maxLines` ([phone, desktop]) is the room the collage leaves for the line:
 * a longer one is set a little smaller so it never runs into the pictures.
 */
export function RoomCurrentLine({
  lines,
  maxLines,
  className = "",
}: {
  lines: Line[];
  maxLines?: [number, number];
  className?: string;
}) {
  const { time } = useRoomAudio();
  const line = lines[Math.max(0, lineAt(lines, time))];
  const span = useRef<HTMLSpanElement>(null);
  const [phoneLines, desktopLines] = maxLines ?? [0, 0];

  useLayoutEffect(() => {
    const el = span.current;
    if (!el || !phoneLines) return;
    const fit = () => {
      const limit = matchMedia("(min-width: 768px)").matches ? desktopLines : phoneLines;
      for (let scale = 1; scale >= 0.6; scale -= 0.05) {
        el.style.fontSize = `${scale}em`;
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        if (el.getBoundingClientRect().height <= lineHeight * limit + 1) return;
      }
    };
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el.parentElement ?? el);
    return () => watch.disconnect();
  }, [line?.text, phoneLines, desktopLines]);

  if (!line) return null;
  return (
    // Not announced line by line: that would talk over the music.
    <p aria-live="off" className={className}>
      <span ref={span} key={line.text} className="room-line block">
        {line.text}
      </span>
    </p>
  );
}
