"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "@/lib/content/types";
import { MobileNav } from "./MobileNav";

/** Pixels scrolled in one direction before the bar shows or hides. */
const TRAVEL = 12;
/** Near the top the page's own header is in view, so the bar stays away. */
const TOP = 200;

/**
 * The header that slides down from the top when the visitor scrolls back up,
 * so they can always get around, and slides away again as they scroll on.
 * On desktop it is the page's own header, unchanged: the monogram large in
 * the middle, the menu on the right.
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
  tone = "light",
  children,
}: {
  nav: NavItem[];
  /** The page's name (or a link) on the left of the phone bar. */
  title?: ReactNode;
  inset?: string;
  /** "dark": white on black (the Listening Room). */
  tone?: "light" | "dark";
  /** The desktop header, the same one the page shows at its top. */
  children: ReactNode;
}) {
  const dark = tone === "dark";
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
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        dark ? "bg-black text-white shadow-[0_1px_0_#333]" : "bg-white text-ink shadow-[0_1px_0_#e5e5e5]"
      } ${
        shown ? "translate-y-0" : "-translate-y-[calc(100%+1px)]"
      }`}
    >
      <MobileNav nav={nav} title={title} inset={inset} tone={tone} className="md:hidden" />
      {/* Desktop: the page's own header, at its full size (its lengths are measured against this container, like the page's). */}
      <div className="mx-auto w-full max-w-[1440px] [container-type:inline-size] max-md:hidden">{children}</div>
    </div>,
    document.body,
  );
}
