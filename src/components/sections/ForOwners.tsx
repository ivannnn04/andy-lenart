import { Photo } from "@/components/Photo";
import type { HomeContent } from "@/lib/content/types";
import { fs, sp } from "@/lib/design";
import { inline } from "@/lib/inline";

export function ForOwners({ owners }: { owners: HomeContent["owners"] }) {
  return (
    <section
      data-reveal-children
      id="listen"
      aria-labelledby="owners-title"
      className="gutter"
      style={{ paddingTop: sp(66, 64) }}
    >
      <p className="text-[12px] leading-[normal] font-bold tracking-[0.14em] text-muted">{owners.label}</p>
      <h2
        id="owners-title"
        className="mt-3 font-bold leading-[normal]"
        style={{ fontSize: fs(44, 30) }}
      >
        {owners.title}
      </h2>

      <ol data-reveal-children className="flex flex-col" style={{ marginTop: sp(30, 24), gap: sp(40, 32) }}>
        {owners.steps.map((step, i) => (
          <li key={step.title}>
            <span aria-hidden className="block font-bold leading-[normal]" style={{ fontSize: fs(64, 48) }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-bold leading-[normal] text-ink" style={{ fontSize: fs(22, 20) }}>
              {step.title}
            </h3>
            <p
              className="mt-1.5 font-medium leading-[1.55] text-body md:max-w-[calc(1227*var(--u))]"
              style={{ fontSize: fs(20, 16) }}
            >
              {inline(step.body)}
            </p>
          </li>
        ))}
      </ol>

      <div className="relative max-md:flex max-md:flex-col" style={{ marginTop: sp(59, 48) }}>
        <Photo
          src="/images/line-thick.png"
          alt="Hand-drawn underline"
          width={583}
          height={156}
          sizes="(min-width: 768px) 41vw, 80vw"
          // Phones: a block under the statement (the stroke sits at ~61% of the
          // image height, so it is pulled up to land ~8px below the text).
          // From md: behind the text at the design position.
          className="pointer-events-none w-4/5 max-md:order-last max-md:-mt-[calc(13%-8px)] md:absolute! md:top-[calc(16*var(--u))] md:left-[calc(5*var(--u))] md:w-[calc(583*var(--u))]"
        />
        <p className="relative text-[22px] font-medium leading-[1.2] md:text-[clamp(24px,calc(40*var(--u)),40px)]">
          {owners.statement}
          <br />
          <span className="font-bold">{owners.statementBold}</span>
        </p>
      </div>
    </section>
  );
}
