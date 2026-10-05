"use client";

import type { ReactNode } from "react";
import { useRoomAudio } from "@/components/room/RoomAudio";

/**
 * "Touch the tape": the cassette is the play / pause button for the
 * garment's track. It stays still until the music starts, then its reels
 * turn and it rocks gently.
 */
export function RoomTape({ title, children }: { title: string; children: ReactNode }) {
  const { src, playing, toggle } = useRoomAudio();

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!src}
      aria-pressed={playing}
      aria-label={`${playing ? "Pause" : "Play"} ${title}`}
      data-playing={playing || undefined}
      className="room-tape block size-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-default"
    >
      {children}
    </button>
  );
}
