import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageSlot } from "@/components/ImageSlot";
import { Accordion } from "@/components/product/Accordion";
import { Gallery } from "@/components/product/Gallery";
import { PreviewPlayer } from "@/components/product/PreviewPlayer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { fs } from "@/lib/design";
import { GARMENTS, getGarment } from "@/lib/garments";
import { CONTACT_EMAIL } from "@/lib/site";

export function generateStaticParams() {
  return GARMENTS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collection/[slug]">): Promise<Metadata> {
  const garment = getGarment((await params).slug);
  if (!garment) return {};
  return {
    title: `${garment.titleLines.join(" ")} — No. ${garment.no} · Andy Lenárt`,
    description: garment.tagline,
  };
}

const label = "text-[12px] leading-[normal] font-bold uppercase tracking-[0.12em] text-muted";
const sectionLabel = "text-[14px] leading-[normal] font-bold uppercase tracking-[0.14em] md:text-[16px]";
const divider = "h-px w-full bg-[#d1d1d1]";

export default async function GarmentPage({ params }: PageProps<"/collection/[slug]">) {
  const garment = getGarment((await params).slug);
  if (!garment) notFound();

  const title = garment.titleLines.join(" ");
  const requestHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Request: No. ${garment.no} ${title}`,
  )}`;

  return (
    <>
      {/* The inline-size container is what the design unit (--u) measures. */}
      <div
        id="top"
        className="mx-auto w-full max-w-[1440px] overflow-x-clip [container-type:inline-size]"
      >
        <SiteHeader variant="compact" />

        <main>
          {/* Gallery + purchase info */}
          <section data-reveal-children aria-labelledby="garment-title" className="gutter">
            <nav
              aria-label="Breadcrumb"
              className="mt-6 text-[13px] tracking-[0.04em] text-muted md:mt-[calc(25*var(--u))]"
            >
              <Link href="/#collection" className="link-draw">
                ← Collection
              </Link>
              <span aria-hidden className="whitespace-pre">{"  /  "}</span>
              <span aria-current="page">No. {garment.no}</span>
            </nav>

            <div className="mt-4 grid grid-cols-1 items-start gap-10 md:mt-[calc(24*var(--u))] md:grid-cols-[calc(723*var(--u))_minmax(0,1fr)] md:gap-[calc(77*var(--u))]">
              <Gallery images={garment.gallery} />

              {/* Stays in view while the gallery scrolls past (desktop). */}
              <div className="flex flex-col gap-7 md:sticky md:top-6">
                <p className={label}>
                  No. {garment.no} of 10 <span aria-hidden>·</span> Departures 1322
                </p>
                <h1
                  id="garment-title"
                  className="font-bold uppercase leading-[normal] tracking-[-0.01em]"
                  style={{ fontSize: fs(40, 30) }}
                >
                  {garment.titleLines.map((line, i) => (
                    <span key={line} className="block">
                      {line}
                      {i < garment.titleLines.length - 1 && " "}
                    </span>
                  ))}
                </h1>
                <p className="font-normal italic leading-[1.4] text-[#595959]" style={{ fontSize: fs(20, 18) }}>
                  {garment.tagline}
                </p>

                <div className="flex flex-col gap-3">
                  <PreviewPlayer
                    src={garment.preview.src}
                    duration={garment.preview.duration}
                    waveform={garment.preview.waveform}
                  />
                  <p className="text-[13px] font-normal text-muted">
                    Preview · 30 seconds. You’ll find the full track in this garment’s Listening Room.
                  </p>
                </div>

                <div className={divider} />

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <p className="font-bold leading-[normal] text-ink" style={{ fontSize: fs(32, 26) }}>
                    {garment.price}
                  </p>
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#595959]">
                    {garment.availability}
                  </p>
                </div>
                <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#595959]">
                  {garment.size}
                </p>

                <a
                  href={requestHref}
                  className="flex items-center justify-center bg-ink px-7 py-[18px] text-[13px] font-medium uppercase tracking-[0.08em] whitespace-nowrap text-white shadow-[inset_0_0_0_1px_#1a1a1a] transition-colors duration-300 hover:bg-white hover:text-ink motion-reduce:transition-none"
                >
                  Request this piece →
                </a>

                <div className={divider} />

                <Accordion items={garment.details} />
              </div>
            </div>
          </section>

          {/* The concept, its photo and the music credits */}
          <section
            data-reveal-children
            aria-labelledby="concept-title"
            className="gutter mt-16 border-t border-[#d1d1d1] pt-12 pb-10 md:mt-[calc(54*var(--u))] md:grid md:grid-cols-[calc(321*var(--u))_minmax(0,1fr)] md:gap-x-[calc(65*var(--u))] md:pt-[calc(43*var(--u))] md:pb-[calc(33*var(--u))]"
          >
            <div>
              <p className={`${sectionLabel} text-muted`}>The concept</p>
              <h2
                id="concept-title"
                className="mt-3 font-bold uppercase leading-[normal]"
                style={{ fontSize: fs(30, 26) }}
              >
                {garment.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}{" "}
                  </span>
                ))}
              </h2>
            </div>

            <div className="mt-6 md:mt-[calc(31*var(--u))]">
              {garment.concept.paragraphs.map((text, i) => (
                <p
                  key={i}
                  className={`font-normal leading-[1.6] ${i ? "mt-[1.6em]" : ""}`}
                  style={{ fontSize: fs(22, 18) }}
                >
                  {text}
                </p>
              ))}
              <ImageSlot
                image={garment.concept.image}
                sizes="(min-width: 768px) 64vw, 100vw"
                className="mt-10 w-full md:mt-[calc(40*var(--u))] md:-ml-[calc(9*var(--u))] md:w-[calc(918*var(--u))]"
              />
              <blockquote
                className="mt-7 text-center font-normal italic leading-[1.35] md:mt-[calc(28*var(--u))]"
                style={{ fontSize: fs(30, 22) }}
              >
                {garment.concept.quote}
              </blockquote>
            </div>

            <p className={`${sectionLabel} mt-16 text-muted md:mt-[calc(100*var(--u))]`}>Music</p>
            <ul className="mt-4 flex flex-col gap-6 md:mt-[calc(100*var(--u))] md:flex-row md:gap-[calc(80*var(--u))]">
              {garment.credits.map((credit) => (
                <li key={credit.name} className="md:w-[calc(410*var(--u))]">
                  <p className="font-semibold" style={{ fontSize: fs(20, 18) }}>
                    {credit.name}
                  </p>
                  <p className="mt-1.5 font-normal text-muted" style={{ fontSize: fs(18, 16) }}>
                    {credit.role}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* What owning the piece unlocks */}
          <section
            data-reveal-children
            aria-labelledby="inside-title"
            className="gutter grid grid-cols-1 items-start gap-10 border-t border-[#d1d1d1] pt-16 pb-24 md:grid-cols-[calc(656*var(--u))_calc(560*var(--u))] md:gap-[calc(46*var(--u))] md:pt-[calc(129*var(--u))] md:pb-[calc(160*var(--u))]"
          >
            <div>
              <p className={`${sectionLabel} text-[#8c8c8c]`}>Inside this garment</p>
              <h2
                id="inside-title"
                className="mt-5 font-bold uppercase leading-[normal]"
                style={{ fontSize: fs(44, 30) }}
              >
                {garment.inside.title.map((line) => (
                  <span key={line} className="block">
                    {line}{" "}
                  </span>
                ))}
              </h2>
              {garment.inside.paragraphs.map((runs, i) => (
                <p
                  key={i}
                  className={`font-medium leading-[1.55] ${i ? "mt-[1.55em]" : "mt-5"}`}
                  style={{ fontSize: fs(18, 16) }}
                >
                  {runs.map((run, j) =>
                    run.strong ? (
                      <strong key={j} className="font-semibold">
                        {run.text}
                      </strong>
                    ) : (
                      <span key={j}>{run.text}</span>
                    ),
                  )}
                </p>
              ))}
            </div>
            <ImageSlot
              image={garment.inside.image}
              sizes="(min-width: 768px) 39vw, 100vw"
              tone="dark"
              label="Blurred glimpse of room"
              className="w-full"
            />
          </section>
        </main>
      </div>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
