"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "@/lib/content/types";
import { MobileNav } from "./MobileNav";

/** Pixels scrolled in one direction before the bar shows or hides. */
const TRAVEL = 12;
/** Near the top the page's own header is in view, so the bar stays away. */
const TOP = 200;

/**
 * The menu that slides down from the top when the visitor scrolls back up,
 * so they can always get around, and slides away again as they scroll on.
 * Jumps to a section (the menu's links, "Listen", "Own") scroll by
 * themselves, so the bar keeps out of their way until they land.
 *
 * Rendered into <body>: the page wrapper is a size container, which would
 * otherwise hold a fixed element to itself instead of the screen.
 */
export function StickyNav({
  nav,
  title,
  inset,
  logoHref,
  logoTitle,
}: {
  nav: NavItem[];
  title?: string;
  inset?: string;
  logoHref: string;
  logoTitle: string;
}) {
  // False while rendering on the server, true in the browser (where the portal can go).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let travel = 0;
    let jumping = false;
    let settle = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const step = y - last;
      last = y;
      // Distance covered since the scroll last changed direction.
      travel = Math.sign(step) === Math.sign(travel) ? travel + step : step;
      if (jumping || y < TOP) setShown(false);
      else if (travel <= -TRAVEL) setShown(true);
      else if (travel >= TRAVEL) setShown(false);
    };
    const landed = () => {
      jumping = false;
      last = window.scrollY;
      travel = 0;
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest("a[href*='#']")) return;
      jumping = true;
      setShown(false);
      window.clearTimeout(settle);
      settle = window.setTimeout(landed, 1500);
    };
    const onScrollEnd = () => {
      if (!jumping) return;
      window.clearTimeout(settle);
      settle = window.setTimeout(landed, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  if (!mounted) return null;
  return createPortal(
    <div
      inert={!shown}
      aria-hidden={!shown}
      className={`fixed inset-x-0 top-0 z-40 bg-white text-ink shadow-[0_1px_0_#e5e5e5] transition-transform duration-300 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0" : "-translate-y-[calc(100%+1px)]"
      }`}
    >
      <MobileNav nav={nav} title={title} inset={inset} className="md:hidden" />
      <div className="gutter mx-auto flex h-[72px] max-w-[1440px] items-center justify-between max-md:hidden">
        <a href={logoHref} title={logoTitle} className="w-[46px]">
          <Image src="/images/logo-mark.png" alt="Andy Lenárt monogram" width={332} height={282} sizes="46px" />
        </a>
        <nav aria-label="Primary">
          <ul className="flex gap-6 text-[15px] leading-[0.9] font-black whitespace-nowrap uppercase">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-draw">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>,
    document.body,
  );
}
