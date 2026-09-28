import Image from "next/image";
import type { CSSProperties } from "react";

/** Figma-style crop: size and offset of the image inside its frame, in %. */
export type Crop = { width: string; height: string; left: string; top: string };

type PhotoProps = {
  src: string;
  /** Empty string for purely decorative images. */
  alt: string;
  /** Frame size in design px — sets the aspect ratio. */
  width: number;
  height: number;
  sizes: string;
  crop?: Crop;
  objectPosition?: string;
  preload?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Photo({
  src,
  alt,
  width,
  height,
  sizes,
  crop,
  objectPosition,
  preload,
  className = "",
  style,
}: PhotoProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}`, ...style }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={crop ? "max-w-none" : "object-cover"}
        style={
          crop
            ? { ...crop, right: "auto", bottom: "auto" }
            : objectPosition
              ? { objectPosition }
              : undefined
        }
      />
    </div>
  );
}
