import { Photo } from "@/components/Photo";
import { fs, placer, stage } from "@/lib/design";

const p = placer(3060);

export function Manifesto() {
  return (
    <section
      id="manifesto"
      aria-label="Manifesto"
      className="stage mt-16 flex flex-col gap-6 px-4 lg:m-0 lg:p-0"
      style={stage(900)}
    >
      <p
        className="place text-center font-medium uppercase leading-[1.25]"
        style={p(132, 3096, 1175, { fontSize: fs(32, 20) })}
      >
        One night I dreamed I broke into the flat I grew up in and found
        strangers asleep in every room. I wasn’t there to take anything.
        <br />I just sat on the floor in grief. That’s where this collection
        began.
      </p>
      <p
        className="place font-bold leading-[1.5] whitespace-nowrap lg:h-[calc(600*var(--u))] lg:rotate-180 lg:[writing-mode:vertical-rl]"
        style={p(252, 3256, 49, { fontSize: fs(32, 20) })}
      >
        DEPARTURES 1322
      </p>
      <p
        className="place font-bold leading-[1.5] whitespace-nowrap max-lg:order-last"
        style={p(859, 3871, 241, { fontSize: fs(32, 20) })}
      >
        COLLECTION 01
      </p>
      <Photo
        src="/images/photo-block-wide.webp"
        alt="Black-and-white photo of a concrete apartment block with enclosed balconies and a bare tree"
        width={790}
        height={538}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="place w-full"
        style={p(310, 3318, 790)}
      />
      <Photo
        src="/images/signature-limbo.png"
        alt="Handwritten: Limbo, past, time, death, birth"
        width={391}
        height={32}
        sizes="(min-width: 1024px) 27vw, 80vw"
        className="place w-4/5 max-lg:order-last"
        style={p(746, 3915, 391)}
      />
    </section>
  );
}
