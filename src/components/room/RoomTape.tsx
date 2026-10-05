"use client";

import type { ReactNode } from "react";
import { usePreviewAudio } from "@/components/product/PreviewPlayer";

/**
 * "Touch the tape": the cassette is the play / pause button for the
 * garment's track. It rocks gently while the track plays.
 */
export function RoomTape({ src, title, children }: { src?: string; title: string; children: ReactNode }) {
  const { audio, playing, toggle } = usePreviewAudio();

  return (
    <>
      {src && <audio ref={audio} src={src} preload="metadata" />}
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-pressed={playing}
        aria-label={`${playing ? "Pause" : "Play"} ${title}`}
        data-playing={playing || undefined}
        className="room-tape block size-full cursor-pointer transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-default motion-reduce:transition-none"
      >
        {children}
      </button>
    </>
  );
}
