"use client";

import { useEffect, useRef } from "react";
import { backgroundSound } from "@/lib/background-sound";

/**
 * The site's background track. It lives in the root layout, so the sound
 * wave in the header can switch it on every page (not only the home page),
 * and the music keeps playing while the visitor moves between pages.
 */
export function BackgroundTrack({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    backgroundSound.attach(audio.current);
    return () => backgroundSound.attach(null);
  }, [src]);

  return src ? <audio ref={audio} src={src} loop preload="none" /> : null;
}
