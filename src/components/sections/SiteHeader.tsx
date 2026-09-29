import { Photo } from "@/components/Photo";
import { placer, stage } from "@/lib/design";

const p = placer(0);

const NAV = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Collections", href: "#collection" },
  { label: "Listen", href: "#listen" },
  { label: "Own", href: "#stay-connected" },
];

export function SiteHeader() {
  return (
    <header
      data-reveal-children
      className="stage flex flex-wrap items-center justify-between gap-x-4 gap-y-6 px-4 pt-4 md:p-0"
      style={stage(200)}
    >
      <Photo
        src="/images/radio-wave.png"
        alt="Hand-drawn sound wave"
        width={308}
        height={194}
        sizes="(min-width: 768px) 22vw, 112px"
        className="place w-28"
        // The Figma layer starts 18px above the artboard; this is its visible part.
        style={p(14, 0, 308)}
      />
      <a
        href="#top"
        title="Back to top"
        className="place w-16 transition-transform duration-300 ease-out hover:-rotate-3 hover:scale-105 focus-visible:scale-105 motion-reduce:transition-none"
        style={p(588, 34, 166)}
      >
        <Photo
          src="/images/logo-mark.png"
          alt="Andy Lenárt monogram"
          width={166}
          height={141}
          sizes="(min-width: 768px) 12vw, 64px"
          preload
        />
      </a>
      <nav
        aria-label="Primary"
        // Anchored to its right edge (x=1335 in the design) so it never runs
        // off-screen or into the logo at narrower widths.
        className="place w-full md:left-auto! md:right-[calc(105*var(--u))] md:w-auto!"
        style={p(917, 88, 418)}
      >
        <ul
          className="flex justify-between gap-4 text-[14px] font-black uppercase leading-[0.9] whitespace-nowrap md:gap-[max(12px,calc(25*var(--u)))] md:text-[clamp(11px,calc(18*var(--u)),18px)]"
        >
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="link-draw"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
