"use client";

import { useState } from "react";
import { ImageSlot } from "@/components/ImageSlot";
import type { GarmentImage } from "@/lib/garments";

/** Main photo (723×880 in the design) with a row of four 167×250 thumbnails. */
export function Gallery({ images }: { images: GarmentImage[] }) {
  const [active, setActive] = useState(0);
  const thumbs = images.slice(1);

  return (
    <div>
      <ImageSlot
        image={images[active]}
        frame={{ width: 723, height: 880 }}
        sizes="(min-width: 768px) 50vw, 100vw"
        preload={active === 0}
        className="w-full"
      />
      <ul
        className="mt-2 grid grid-cols-4 gap-2 md:mt-[calc(18*var(--u))] md:gap-[calc(17*var(--u))]"
        aria-label="More photos"
      >
        {thumbs.map((image, i) => {
          const index = i + 1;
          const selected = active === index;
          return (
            <li key={image.alt}>
              <button
                type="button"
                onClick={() => setActive(selected ? 0 : index)}
                aria-pressed={selected}
                aria-label={`${selected ? "Back to main photo" : "Show photo"}: ${image.alt}`}
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
    </div>
  );
}
