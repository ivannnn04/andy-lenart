"use client";

import { createContext, useContext, type ReactNode } from "react";
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

/**
 * Lyrics that light up line by line with the track, Spotify-style: the
 * current line is bright, the rest fade back. Before the first play every
 * line reads normally.
 */
export function RoomLyrics({ lines, className = "" }: { lines: { time: number; text: string }[]; className?: string }) {
  const { playing, time } = useRoomAudio();
  const started = playing || time > 0;
  let current = -1;
  lines.forEach((line, i) => {
    if (time >= line.time) current = i;
  });

  return (
    <p className={className}>
      {lines.map((line, i) => (
        <span
          key={line.text}
          aria-current={started && i === current ? "true" : undefined}
          className={`block transition-opacity duration-500 motion-reduce:transition-none ${
            !started || i === current ? "opacity-100" : "opacity-35"
          }`}
        >
          {line.text}
        </span>
      ))}
    </p>
  );
}
