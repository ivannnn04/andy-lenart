import { Photo } from "@/components/Photo";
import { fs, placer, sp } from "@/lib/design";
import { CONTACT_EMAIL } from "@/lib/site";
import { StayConnectedForm } from "./StayConnectedForm";

const p = placer(7185);

export function StayConnected() {
  return (
    <section
      data-reveal-children
      id="stay-connected"
      aria-labelledby="stay-connected-title"
      className="gutter relative"
      style={{ paddingTop: sp(238, 96), paddingBottom: sp(193, 80) }}
    >
      <div data-reveal-children className="md:pl-[calc(26*var(--u))]">
        <h2
          id="stay-connected-title"
          className="font-bold uppercase leading-none md:max-w-[calc(688*var(--u))]"
          style={{ fontSize: fs(72, 40) }}
        >
          Hear when the next piece is out
        </h2>
        <p
          className="font-medium leading-[1.2] md:max-w-[calc(723*var(--u))]"
          style={{ marginTop: sp(24, 16), fontSize: fs(24, 18) }}
        >
          Follow the collection. Receive an email when the next garment is ready.
        </p>
        <StayConnectedForm />
      </div>

      <div
        className="place relative mt-16 w-3/4 max-md:ml-auto"
        style={p(895, 7382, 434)}
      >
        <Photo
          src="/images/newsletter-photo.webp"
          alt="Black-and-white photo of the model in the white coat with a string bag, standing on concrete steps below brutalist towers"
          width={434}
          height={642}
          sizes="(min-width: 768px) 30vw, 75vw"
        />
        <Photo
          src="/images/newsletter-mark.png"
          alt="White Andy Lenárt monogram and hand-lettered name over the photo"
          width={164}
          height={116}
          sizes="(min-width: 768px) 12vw, 28vw"
          className="absolute! left-[31.1%] top-[43.9%] w-[37.8%]"
        />
      </div>

      <p className="md:pl-[calc(19*var(--u))]" style={{ marginTop: sp(142, 80) }}>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-bold leading-[1.2] break-all link-sweep"
          style={{ fontSize: fs(93, 28) }}
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </section>
  );
}
