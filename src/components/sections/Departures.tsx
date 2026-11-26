import { Photo } from "@/components/Photo";
import { placer, stage } from "@/lib/design";

const p = placer(1700);

export function Departures() {
  return (
    <section
      data-reveal-children
      aria-labelledby="departures-title"
      className="stage gutter mt-16 flex flex-col gap-6 md:m-0"
      style={stage(1360)}
    >
      <Photo
        src="/images/img-1924.webp"
        alt="Black-and-white photo of the model in the white coat covered in hand-drawn lettering, standing in front of brutalist tower blocks"
        width={666}
        height={965}
        sizes="(min-width: 768px) 47vw, 100vw"
        // Phones: pulled up so the signature's lower part lies over it.
        className="place w-full max-md:order-3 max-md:-mt-[calc(19%+1.5rem)]"
        style={p(82, 2053, 666)}
      />
      <Photo
        src="/images/photo-block-standing.webp"
        alt="Model in the white coat holding a string bag of oranges, standing on a pavement in front of a concrete housing block"
        width={411}
        height={608}
        sizes="(min-width: 768px) 29vw, 70vw"
        className="place w-3/4 self-end max-md:order-4"
        style={p(839, 2315, 411)}
      />
      <Photo
        src="/images/departures-banner.webp"
        alt="Brush-stroke signature"
        width={1082}
        height={514}
        sizes="(min-width: 768px) 76vw, 100vw"
        objectPosition="bottom"
        // Phones: starts around the middle of the heading and runs down over
        // the top of the photo (heading ≈ 31.5vw tall at 13vw × 2 lines).
        className="place w-full max-md:z-10 max-md:order-2 max-md:-mt-[calc(17vw+1.5rem)]"
        style={p(253, 1741, 1082)}
      />
      <h2
        id="departures-title"
        // Phones: as large as fits on one line (13vw, max 96px), centred above
        // the signature that overlaps it. Desktop (Andy's revised design): both
        // lines set to the right, "1322" under the end of "Departures", higher
        // up so the number clears the photo; set in white with "difference",
        // so it reads black on the page and the brush stroke shows through
        // light where it crosses the first letters.
        className="place text-center text-[min(13vw,96px)] font-bold uppercase leading-[normal] max-md:relative max-md:z-20 max-md:order-1 md:text-right md:text-[clamp(48px,calc(100*var(--u)),100px)] md:leading-[1.04] md:text-white md:mix-blend-difference"
        style={p(361, 1839, 911)}
      >
        Departures
        <br />
        {/* The figures end a little short of the "S" above, as drawn. */}
        <span className="md:pr-[0.07em]">1322</span>
      </h2>
    </section>
  );
}
