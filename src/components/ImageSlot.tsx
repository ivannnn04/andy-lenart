import type { CSSProperties } from "react";
import { Photo } from "@/components/Photo";
import type { GarmentImage } from "@/lib/garments";

type ImageSlotProps = {
  image: GarmentImage;
  /** Frame proportions from the design (defaults to the image's own). */
  frame?: { width: number; height: number };
  sizes: string;
  preload?: boolean;
  /** Dark placeholder with crossed lines, as the design's room glimpse. */
  tone?: "light" | "dark";
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/** A photo, or — until its file exists — a labelled placeholder of the same size. */
export function ImageSlot({
  image,
  frame = image,
  sizes,
  preload,
  tone = "light",
  label = "Photo coming soon",
  className = "",
  style,
}: ImageSlotProps) {
  if (image.src) {
    return (
      <Photo
        src={image.src}
        alt={image.alt}
        width={frame.width}
        height={frame.height}
        sizes={sizes}
        preload={preload}
        className={className}
        style={style}
      />
    );
  }

  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={`relative flex items-center justify-center overflow-hidden ${
        dark ? "bg-[#4d4d4d] text-[#b3b3b3]" : "border border-dashed border-[#bfbfbf] bg-[#f5f5f5] text-subtle"
      } ${className}`}
      style={{ aspectRatio: `${frame.width} / ${frame.height}`, ...style }}
    >
      {dark && (
        <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#666" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#666" strokeWidth="1" />
        </svg>
      )}
      <span
        aria-hidden
        className={`relative px-2.5 py-1.5 text-center font-ui text-[11px] font-medium uppercase tracking-[0.08em] ${dark ? "bg-[#4d4d4d]" : ""}`}
      >
        {label}
      </span>
    </div>
  );
}
