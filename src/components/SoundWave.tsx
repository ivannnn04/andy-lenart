"use client";

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { backgroundSound } from "@/lib/background-sound";

/**
 * The hand-drawn sound wave in the home page header. Where the page has a
 * background track it switches it on and off, and moves while it plays.
 */
export function SoundWave({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const available = useSyncExternalStore(backgroundSound.subscribe, backgroundSound.isAvailable, () => false);
  const playing = useSyncExternalStore(backgroundSound.subscribe, backgroundSound.isPlaying, () => false);
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => backgroundSound.toggle()}
      aria-pressed={available ? playing : undefined}
      aria-label={available ? (playing ? "Stop the music" : "Play the music") : undefined}
      title={available ? (playing ? "Sound off" : "Sound on") : undefined}
      className={`sound-wave block cursor-pointer disabled:cursor-default ${playing ? "is-playing" : ""} ${className ?? ""}`}
      style={style}
    >
      {children}
    </button>
  );
}
