import { Photo } from "@/components/Photo";
import { fs, placer, stage } from "@/lib/design";

const p = placer(200);

const bigNumber = "place font-bold uppercase leading-[normal] max-lg:order-3";

export function Hero() {
  return (
    <section
      aria-label="Departures 1322"
      className="stage flex flex-wrap items-end gap-x-6 gap-y-8 px-4 pt-10 lg:p-0"
      style={stage(1500)}
    >
      <Photo
        src="/images/hero-coat.webp"
        alt="Model in a long white coat with graffiti lettering, holding a checked bag, in front of a concrete housing block"
        width={726}
        height={1075}
        sizes="(min-width: 1024px) 51vw, 100vw"
        preload
        className="place w-full max-lg:order-2"
        style={p(308, 273, 726)}
      />

      <div
        className="place w-full font-light uppercase leading-[1.5] max-lg:order-5"
        style={p(156, 1438, 600, { fontSize: fs(32, 20) })}
      >
        <p>I grew up in a post-communist block with a mother who was a waitress.</p>
        <p className="mt-[1.5em] font-bold">This is how it continues...</p>
      </div>

      <p
        aria-hidden
        className={bigNumber}
        style={p(1099, 830, 209, { fontSize: fs(206, 96) })}
      >
        13
      </p>

      <Photo
        src="/images/fragments.png"
        alt="Fragments of Roots — hand-lettered title"
        width={630}
        height={394}
        sizes="(min-width: 1024px) 44vw, 80vw"
        className="place w-4/5 max-lg:order-1"
        style={p(-36, 491, 630)}
      />

      <p
        aria-hidden
        className={bigNumber}
        style={p(1083, 1000, 243, { fontSize: fs(206, 96) })}
      >
        22
      </p>

      <div
        className="place hidden lg:block"
        style={p(1085, 1021, 241)}
      >
        <Photo
          src="/images/shape-4.png"
          alt="Handwritten scrawl of words"
          width={241}
          height={241}
          sizes="17vw"
        />
      </div>
    </section>
  );
}
