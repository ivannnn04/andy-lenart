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

type Line = { time: number; text: string };

/** Index of the line being sung at `time` (-1 before the first one). */
const lineAt = (lines: Line[], time: number) => lines.findLastIndex((line) => time >= line.time);

/**
 * The lyric of the moment, one sentence at a time (Spotify-style): it
 * follows the track and each new line fades in. Before the music starts it
 * shows the first line.
 */
export function RoomCurrentLine({ lines, className = "" }: { lines: Line[]; className?: string }) {
  const { time } = useRoomAudio();
  const line = lines[Math.max(0, lineAt(lines, time))];
  if (!line) return null;
  return (
    // Not announced line by line: that would talk over the music.
    <p aria-live="off" className={className}>
      <span key={line.text} className="room-line block">
        {line.text}
      </span>
    </p>
  );
}
