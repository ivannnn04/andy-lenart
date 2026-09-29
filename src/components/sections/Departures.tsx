import { Photo } from "@/components/Photo";
import { placer, stage } from "@/lib/design";

const p = placer(1700);

export function Departures() {
  return (
    <section
      data-reveal-children
      aria-labelledby="departures-title"
      className="stage mt-16 flex flex-col gap-6 px-4 md:m-0 md:p-0"
      style={stage(1360)}
    >
      <Photo
        src="/images/img-1924.webp"
        alt="Black-and-white photo of the model in the white coat covered in hand-drawn lettering, standing in front of brutalist tower blocks"
        width={666}
        height={965}
        sizes="(min-width: 768px) 47vw, 100vw"
        className="place w-full max-md:order-3"
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
        className="place w-full max-md:order-1"
        style={p(253, 1741, 1082)}
      />
      <h2
        id="departures-title"
        // Phones: as large as fits on one line (13vw, max 96px) and pulled up
        // over the lower part of the signature, as in the desktop collage.
        className="place text-center text-[min(13vw,96px)] font-bold uppercase leading-[normal] max-md:relative max-md:z-10 max-md:order-2 max-md:-mt-[calc(30%+1.5rem)] md:text-[clamp(48px,calc(96*var(--u)),96px)]"
        style={p(361, 1896, 1130)}
      >
        Departures
        <br />
        1322
      </h2>
    </section>
  );
}
