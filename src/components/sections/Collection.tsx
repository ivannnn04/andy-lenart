import Link from "next/link";
import { Photo } from "@/components/Photo";
import { fs, sp } from "@/lib/design";
import { garmentHref } from "@/lib/garments";

type Garment = {
  no: string;
  title: string;
  description: string;
  status: string;
  /** Makes the status line a link, e.g. to the newsletter sign-up. */
  statusHref?: string;
  /** The garment's own page, once it exists. */
  href?: string;
  price?: string;
  preview?: string;
  image?: { src: string; alt: string };
  /** Chapters further out are shown faded. */
  dimmed?: boolean;
  titleSize?: number;
};

const GARMENTS: Garment[] = [
  {
    no: "01",
    title: "Born by the Pelican Sculpture",
    description: "One can depart, but the place does not release you.",
    status: "Available · 12 left",
    href: garmentHref("born-by-the-pelican-sculpture"),
    price: "£ 1,500",
    preview: "0:30",
    image: {
      src: "/images/garment-01.webp",
      alt: "Garment 01: white coat with hand-drawn black lettering, worn on concrete steps beneath tower blocks",
    },
  },
  {
    no: "02",
    title: "Paper Walls",
    description: "Not yet released",
    status: "Next release · Notify me",
    statusHref: "#stay-connected",
  },
  { no: "03", title: "Symmetrica", description: "Not yet released", status: "Coming soon" },
  {
    no: "04",
    title: "Aliens and Herons (Vetřelci a volavky)",
    description: "Not yet released",
    status: "Coming soon",
    titleSize: 20,
  },
  ...(
    [
      ["05", "The Blueprint"],
      ["06", "Soviet Sunset"],
      ["07", "Stations of Comfort"],
      ["08", "Philosophy of Form"],
      ["09", "The Signatures"],
      ["10", "Funkce"],
    ] as const
  ).map(([no, title]) => ({
    no,
    title,
    description: "Not yet released",
    status: "Coming soon",
    dimmed: true,
  })),
];

const label = "text-[12px] leading-[normal] font-bold tracking-[0.14em] text-muted";

export function Collection() {
  return (
    <section
      data-reveal-children
      id="collection"
      aria-labelledby="collection-title"
      // Phones: a larger 96px gap after the manifesto.
      className="gutter pt-24 md:pt-[max(32px,calc(45*var(--u)))]"
    >
      <p className={label}>THE COLLECTION</p>
      <h2
        id="collection-title"
        className="mt-3 font-bold leading-[normal] text-ink"
        style={{ fontSize: fs(44, 30) }}
      >
        10 DESIGNS 10 TRACKS
      </h2>
      <p className="font-bold leading-[1.2]" style={{ fontSize: fs(24, 16) }}>
        MADE TO ORDER: ALLOW 4 - 6 WEEKS
      </p>

      <ul
        data-reveal-children
        className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-[repeat(4,calc(296*var(--u)))] md:gap-x-[calc(32*var(--u))] md:gap-y-[calc(64*var(--u))]"
        style={{ marginTop: sp(26, 20) }}
      >
        {GARMENTS.map((garment) => (
          <GarmentCard key={garment.no} {...garment} />
        ))}
      </ul>

      {/*
        The panoramic strip with its handwritten caption sitting on top of it.
        The caption's bottom edge meets the strip's top edge; the lower part of
        the caption image is empty, so the lettering floats just above the strip.
        Design: strip 981 wide at x=72, caption 400 wide at x=728 (66.9%).
      */}
      <div className="relative mt-44 md:mt-[calc(146*var(--u))] md:w-[calc(981*var(--u))]">
        <Photo
          src="/images/signature-connectivity.png"
          alt="Handwritten: Connectivity"
          width={400}
          height={229}
          sizes="(min-width: 768px) 28vw, 60vw"
          className="pointer-events-none absolute! right-0 bottom-full w-[60%] md:right-auto md:left-[66.87%] md:w-[40.77%]"
        />
        <Photo
          src="/images/film-strip.webp"
          alt="Panoramic strip of prefab housing blocks and a road sign under a grey sky"
          width={981}
          height={136}
          sizes="(min-width: 768px) 68vw, 100vw"
        />
      </div>
    </section>
  );
}

function GarmentCard({
  no,
  title,
  description,
  status,
  statusHref,
  href,
  price,
  preview,
  image,
  dimmed,
  titleSize = 22,
}: Garment) {
  return (
    <li className={dimmed ? "opacity-80" : undefined}>
      <article className="flex flex-col gap-3.5">
        {image && href ? (
          // The title below is the accessible link; the photo repeats it for pointers.
          <Link href={href} tabIndex={-1} aria-hidden className="block transition-opacity duration-300 hover:opacity-85">
            <Photo
              src={image.src}
              alt=""
              width={296}
              height={380}
              sizes="(min-width: 768px) 21vw, 50vw"
            />
          </Link>
        ) : image ? (
          <Photo
            src={image.src}
            alt={image.alt}
            width={296}
            height={380}
            sizes="(min-width: 768px) 21vw, 50vw"
          />
        ) : (
          <div
            aria-hidden
            className="flex aspect-[296/380] items-center justify-center border border-dashed border-[#bfbfbf] bg-[#f5f5f5] text-[64px] font-bold text-[#d1d1d1]"
          >
            {no}
          </div>
        )}

        <div className="flex items-start justify-between text-[12px] font-medium">
          <span className="font-bold tracking-[0.08em] text-muted">No. {no}</span>
          {preview && (
            <span className="tracking-[0.06em] text-ink">
              <span aria-hidden>▶ </span>
              <span className="sr-only">Track preview, </span>
              {preview}
            </span>
          )}
        </div>

        <h3
          className="font-bold uppercase leading-[normal] text-ink"
          style={{ fontSize: fs(titleSize, 16) }}
        >
          {href ? (
            <Link href={href} className="link-draw">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        <p className="text-[14px] font-normal leading-[1.4] text-muted">{description}</p>

        <div className="flex items-start justify-between font-bold">
          {statusHref ? (
            <a
              href={statusHref}
              className="text-[11px] whitespace-nowrap uppercase tracking-[0.08em] text-subtle link-draw max-[400px]:whitespace-normal"
            >
              {status}
            </a>
          ) : (
            <span
              className={`text-[11px] whitespace-nowrap uppercase tracking-[0.08em] max-[400px]:whitespace-normal ${price ? "text-ink" : "text-subtle"}`}
            >
              {status}
            </span>
          )}
          {price && <span className="text-[13px] whitespace-nowrap text-ink">{price}</span>}
        </div>
      </article>
    </li>
  );
}
