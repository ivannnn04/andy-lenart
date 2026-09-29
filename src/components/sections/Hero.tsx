import { Photo } from "@/components/Photo";
import { fs, placer, stage } from "@/lib/design";

const p = placer(200);

const bigNumber = "place font-bold uppercase leading-[normal] max-md:order-3";

// Phones: "13" and "22" share a row; auto side margins centre that row only.
const centerRowStart = "max-md:ml-auto";
const centerRowEnd = "max-md:mr-auto";

export function Hero() {
  return (
    <section
      data-reveal-children
      aria-label="Departures 1322"
      className="stage flex flex-wrap items-end gap-x-6 gap-y-8 px-4 pt-10 md:p-0"
      style={stage(1500)}
    >
      <Photo
        src="/images/hero-coat.webp"
        alt="Model in a long white coat with graffiti lettering, holding a checked bag, in front of a concrete housing block"
        width={726}
        height={1075}
        sizes="(min-width: 768px) 51vw, 100vw"
        preload
        className="place w-full max-md:order-2"
        style={p(308, 273, 726)}
      />

      <div
        className="place w-full font-normal uppercase leading-[1.5] max-md:order-5"
        // Phones shrink below 16px (down to 4vw) so each line still fits on one row.
        style={p(156, 1438, 600, {
          fontSize: "clamp(min(16px, 4vw), calc(32 * var(--u)), 32px)",
        })}
      >
        {/* Two lines as in the design; each line is kept whole. */}
        <p className="whitespace-nowrap">
          I grew up in a post-communist block
          <br />
          with a mother who was a waitress.
        </p>
        <p className="mt-[1.5em] font-bold">This is how it continues...</p>
      </div>

      <p
        aria-hidden
        className={`${bigNumber} ${centerRowStart}`}
        style={p(1099, 830, 209, { fontSize: fs(206, 96) })}
      >
        13
      </p>

      <Photo
        src="/images/fragments.png"
        alt="Fragments of Roots — hand-lettered title"
        width={630}
        height={394}
        sizes="(min-width: 768px) 44vw, 80vw"
        // Phones: pull the photo up under the lower part of the lettering
        // (ink spans the top ~49% of this frame, whose height is 0.5 × width).
        className="place w-4/5 max-md:order-1 max-md:z-10 max-md:mb-[calc(-34%-2rem)]"
        style={p(-36, 491, 630)}
      />

      {/*
        Phones: "22" and the scrawl share a box so the scrawl can lie over the
        number as in the design. From md up the wrapper is display: contents,
        so both keep their own collage positions.
      */}
      <div className={`relative max-md:order-3 md:static md:contents ${centerRowEnd}`}>
        <p
          aria-hidden
          className={bigNumber}
          style={p(1083, 1000, 243, { fontSize: fs(206, 96) })}
        >
          22
        </p>

        <div
          // Same offset as in the design: 2px right, 21px down on a 243×234 "22".
          className="place max-md:absolute max-md:left-[1%] max-md:top-[9%] max-md:w-full"
          style={p(1085, 1021, 241)}
        >
          <Photo
            src="/images/shape-4.png"
            alt="Handwritten scrawl of words"
            width={241}
            height={241}
            sizes="(min-width: 768px) 17vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}
