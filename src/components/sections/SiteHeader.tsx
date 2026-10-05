import { MobileNav } from "@/components/MobileNav";
import { Photo } from "@/components/Photo";
import { placer, stage } from "@/lib/design";
import { NAV } from "@/lib/nav";

const p = placer(0);

/**
 * Design coordinates per header variant: the homepage header, and the smaller
 * "compact" one used on inner pages (e.g. a garment page).
 */
const VARIANTS = {
  home: {
    height: 200,
    // The Figma layer starts 18px above the artboard; this is its visible part.
    wave: p(14, 0, 308),
    logo: p(588, 34, 166),
    logoHref: "#top",
    logoTitle: "Back to top",
    nav: p(917, 88, 418),
    // Nav right edge sits at x=1335 in the design.
    navRight: "md:right-[calc(105*var(--u))]",
  },
  compact: {
    height: 130,
    wave: p(24, -10, 200),
    logo: p(629, 25, 115),
    logoHref: "/",
    logoTitle: "Home",
    nav: p(913, 57, 418),
    // Nav right edge sits at x=1331 in the design.
    navRight: "md:right-[calc(109*var(--u))]",
  },
} as const;

/**
 * Phones get the compact bar (page name · monogram · "Public" menu) on every
 * page; from md the art-directed header below takes over.
 */
export function SiteHeader({
  variant = "home",
  title,
  inset,
}: {
  variant?: keyof typeof VARIANTS;
  /** Page name shown on the left of the phone header. */
  title: string;
  /** Side padding of the phone header, when the page uses its own. */
  inset?: string;
}) {
  const v = VARIANTS[variant];
  return (
    <>
    <MobileNav title={title} inset={inset} className="md:hidden" />
    <header
      data-reveal-children
      className="stage gutter max-md:hidden"
      style={stage(v.height)}
    >
      <Photo
        src="/images/radio-wave.png"
        alt="Hand-drawn sound wave"
        width={308}
        height={194}
        sizes="(min-width: 768px) 22vw, 112px"
        className="place w-28"
        style={v.wave}
      />
      <a
        href={v.logoHref}
        title={v.logoTitle}
        className="place w-16 transition-transform duration-300 ease-out hover:-rotate-3 hover:scale-105 focus-visible:scale-105 motion-reduce:transition-none"
        style={v.logo}
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
        // Anchored to its right edge so it never runs off-screen or into the
        // logo at narrower widths.
        className={`place w-full md:left-auto! md:w-auto! ${v.navRight}`}
        style={v.nav}
      >
        <ul
          className="flex flex-wrap justify-center gap-x-[clamp(8px,4vw,20px)] gap-y-2 text-[clamp(11px,3.4vw,14px)] font-black uppercase leading-[0.9] whitespace-nowrap md:flex-nowrap md:justify-between md:gap-[max(12px,calc(25*var(--u)))] md:text-[clamp(11px,calc(18*var(--u)),18px)]"
        >
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="link-draw">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
    </>
  );
}
