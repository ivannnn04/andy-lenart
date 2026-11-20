"use client";

import { useEffect } from "react";

/**
 * Pictures stay put: browsers let any image (and a link around one) be
 * picked up and dragged as a ghost, which makes the collages feel loose.
 * Selected text can still be dragged.
 */
export function NoImageDrag() {
  useEffect(() => {
    const stop = (e: DragEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el.closest("img, picture, svg, video") || (el.matches("a") && el.querySelector("img, svg"))) e.preventDefault();
    };
    document.addEventListener("dragstart", stop);
    return () => document.removeEventListener("dragstart", stop);
  }, []);
  return null;
}
