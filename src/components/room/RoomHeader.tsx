import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { NAV } from "@/lib/nav";

const linkText = "link-draw font-black uppercase";

/**
 * Header of the private pages (Listening Room, Staircase): the way to the
 * other private page on the left, the monogram in the middle and the site
 * navigation on the right; the phone bar below md. `tone` sets black-on-white
 * or white-on-black.
 */
export function RoomHeader({
  tone,
  label,
  href,
  extra,
}: {
  tone: "light" | "dark";
  label: string;
  href: string;
  /** Something drawn beside the label on desktop (hand-lettering). */
  extra?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <>
      <MobileNav
        tone={tone}
        className="md:hidden"
        title={
          <Link href={href} className="link-draw">
            {label}
          </Link>
        }
      />

      <header className="relative h-[calc(200*var(--u))] max-md:hidden">
        <div className="absolute top-[calc(112*var(--u))] left-[calc(98*var(--u))]">
          <Link href={href} className={`${linkText} relative z-10 text-[clamp(11px,calc(18*var(--u)),18px)] leading-[0.9]`}>
            {label}
          </Link>
          {extra}
        </div>
        <Link
          href="/"
          aria-label="Andy Lenárt — home"
          className="absolute top-[calc(40*var(--u))] left-1/2 w-[calc(121*var(--u))] -translate-x-1/2 transition-transform duration-300 hover:-rotate-3 hover:scale-105 motion-reduce:transition-none"
        >
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={332}
            height={282}
            sizes="10vw"
            className={dark ? "invert" : undefined}
            preload
          />
        </Link>
        <nav aria-label="Primary" className="absolute top-[calc(112*var(--u))] right-[calc(72*var(--u))]">
          <ul className="flex gap-[max(12px,calc(25*var(--u)))] text-[clamp(11px,calc(18*var(--u)),18px)] leading-[0.9]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkText}>
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
