import { Photo } from "@/components/Photo";
import { fs, placer, stage } from "@/lib/design";

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
      className="stage flex flex-wrap items-center justify-between gap-x-4 gap-y-6 px-4 pt-4 lg:p-0"
      style={stage(200)}
    >
      <Photo
        src="/images/radio-wave.png"
        alt="Hand-drawn sound wave"
        width={308}
        height={212}
        sizes="(min-width: 1024px) 22vw, 112px"
        className="place w-28"
        style={p(14, -18, 308)}
      />
      <a
        href="#top"
        title="Back to top"
        className="place w-16"
        style={p(588, 34, 166)}
      >
        <Photo
          src="/images/logo-mark.png"
          alt="Andy Lenárt monogram"
          width={166}
          height={141}
          sizes="(min-width: 1024px) 12vw, 64px"
          preload
        />
      </a>
      <nav aria-label="Primary" className="place w-full" style={p(917, 88, 418)}>
        <ul
          className="flex justify-between gap-4 font-black uppercase leading-[0.9] whitespace-nowrap"
          style={{ fontSize: fs(18, 14) }}
        >
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="underline-offset-4 hover:underline focus-visible:underline"
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
