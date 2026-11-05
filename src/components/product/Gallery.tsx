"use client";

import { useState } from "react";
import { ImageSlot } from "@/components/ImageSlot";
import type { GarmentImage } from "@/lib/content/types";

/**
 * Main photo (723×880 in the design) with a row of 167×250 thumbnails, one
 * per photo, the main one included, so it is always one tap away.
 */
export function Gallery({ images }: { images: GarmentImage[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <ImageSlot
        // A garment without photos yet shows the placeholder.
        image={images[active] ?? { alt: "", width: 723, height: 880 }}
        frame={{ width: 723, height: 880 }}
        sizes="(min-width: 768px) 50vw, 100vw"
        preload={active === 0}
        className="w-full"
      />
      {images.length > 1 && (
        <ul
          className="mt-2 grid grid-cols-4 gap-2 md:mt-[calc(18*var(--u))] md:gap-[calc(17*var(--u))]"
          aria-label="Photos"
        >
          {images.map((image, index) => {
            const selected = active === index;
            return (
              <li key={`${index}-${image.src ?? image.alt}`}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={selected}
                  aria-label={`Show photo: ${image.alt}`}
                  className={`block w-full outline-offset-2 transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-black ${
                    selected ? "outline-2 outline-black" : ""
                  }`}
                >
                  <ImageSlot
                    image={image}
                    frame={{ width: 167, height: 250 }}
                    sizes="(min-width: 768px) 12vw, 25vw"
                    label="Photo"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
