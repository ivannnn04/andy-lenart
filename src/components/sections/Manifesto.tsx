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
        src="/images/photo-block-wide.png"
        alt="Model in the painted coat beside a row of concrete apartment blocks"
        width={790}
        height={538}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="place w-full"
        style={p(310, 3318, 790)}
      />
      <Photo
        src="/images/signature.png"
        alt=""
        width={391}
        height={32}
        sizes="(min-width: 1024px) 52vw, 180vw"
        crop={{ width: "189.77%", height: "2318.75%", left: "-29.41%", top: "-1459.38%" }}
        className="place w-4/5 max-lg:order-last"
        style={p(746, 3915, 391)}
      />
    </section>
  );
}
