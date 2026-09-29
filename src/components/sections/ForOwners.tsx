import type { ReactNode } from "react";
import { Photo } from "@/components/Photo";
import { fs, sp, u } from "@/lib/design";

const STEPS: { title: string; body: ReactNode }[] = [
  {
    title: "Tap the garment",
    body: "Bring your smartphone to the garment logo in order to enter your Listening Room.",
  },
  {
    title: "Enter your word",
    body: "Inside the garment, you will find a concept text. Enter the requested word to gain access.",
  },
  {
    title: "Listen and leave a mark",
    body: (
      <>
        Hear the full track, then enter The Staircase: a{" "}
        <strong className="font-bold">collective wall</strong> shared by everyone
        who <strong className="font-bold">owns a piece</strong> from this
        collection, wherever they are.
      </>
    ),
  },
];

export function ForOwners() {
  return (
    <section
      id="listen"
      aria-labelledby="owners-title"
      className="gutter"
      style={{ paddingTop: sp(66, 64) }}
    >
      <p className="text-[12px] leading-[normal] font-medium tracking-[0.14em] text-muted">FOR OWNERS</p>
      <h2
        id="owners-title"
        className="mt-3 font-bold leading-[normal]"
        style={{ fontSize: fs(44, 30) }}
      >
        EVERY GARMENT HOLDS A WORLD OF SOUND
      </h2>

      <ol className="flex flex-col" style={{ marginTop: sp(30, 24), gap: sp(40, 32) }}>
        {STEPS.map((step, i) => (
          <li key={step.title}>
            <span aria-hidden className="block font-bold leading-[normal]" style={{ fontSize: fs(64, 48) }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-bold leading-[normal] text-ink" style={{ fontSize: fs(22, 20) }}>
              {step.title}
            </h3>
            <p
              className="mt-1.5 leading-[1.55] text-body lg:max-w-[calc(1227*var(--u))]"
              style={{ fontSize: fs(20, 16) }}
            >
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="relative" style={{ marginTop: sp(59, 48) }}>
        <Photo
          src="/images/line-thick.png"
          alt="Hand-drawn underline"
          width={583}
          height={156}
          sizes="115vw"
          crop={{ width: "282.75%", height: "660.2%", left: "-102.18%", top: "-203.2%" }}
          className="pointer-events-none absolute! hidden lg:block"
          style={{ left: u(5), top: u(16), width: u(583) }}
        />
        <p className="relative leading-[1.2]" style={{ fontSize: fs(40, 24) }}>
          THE ALBUM LIVES INSIDE THE COLLECTION.
          <br />
          <span className="font-medium">WHEN THE LAST PIECE IS SOLD, IT GOES EVERYWHERE.</span>
        </p>
      </div>
    </section>
  );
}
