import type { CSSProperties } from "react";

/** A length in design pixels (1440px artboard), scaled with the viewport. */
export const u = (px: number) => `calc(${px} * var(--u))`;

/** Font size that scales with the artboard but never drops below `min` px. */
export const fs = (px: number, min: number) =>
  `clamp(${min}px, ${u(px)}, ${px}px)`;

/** Spacing that scales with the artboard but never drops below `min` px. */
export const sp = (px: number, min: number) => `max(${min}px, ${u(px)})`;

/** Height of a collage stage, in design px. */
export const stage = (height: number) => ({ "--h": height }) as CSSProperties;

/**
 * Returns a `place` helper for a stage whose top edge sits at `originY` on
 * the Figma artboard, so coordinates can be copied from the design verbatim.
 */
export const placer =
  (originY: number) =>
  (x: number, y: number, w: number, style?: CSSProperties) =>
    ({ "--x": x, "--y": y - originY, "--w": w, ...style }) as CSSProperties;
