"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import type { NavItem } from "@/lib/content/types";

const barText = "text-[16px] leading-[normal] font-medium uppercase";

/**
 * The phone header used on every page: the page's name on the left, the
 * monogram in the middle and "Public" on the right, which opens the
 * full-screen menu. Without a title, "Public" moves to the left (the
 * Listening Room). The menu is a modal <dialog> (focus stays inside, Esc
 * closes it).
 */
export function MobileNav({
  nav,
  title,
  className = "",
  inset = "gutter",
  tone = "light",
  buttonExtra,
  logoWidth = 72,
  top,
}: {
  /** Page name (or a link) on the left; without it "Public" goes there. */
  /** Site navigation (from the admin settings). */
  nav: NavItem[];
  title?: ReactNode;
  className?: string;
  /** Side padding of the bar, to line up with the page's own content. */
  inset?: string;
  /** "dark": white text and monogram on black (the Listening Room). */
  tone?: "light" | "dark";
  /** Drawn beside "Public" (hand-lettering), not part of the button. */
  buttonExtra?: ReactNode;
  /** Width of the monogram, px. */
  logoWidth?: number;
  /**
   * Distances from the top of the bar, px, as in the private pages' designs
   * (page name, "Public", monogram). Without it everything sits mid-height.
   */
  top?: { title: number; button: number; logo: number };
}) {
  const dark = tone === "dark";
  const menu = useRef<HTMLDialogElement>(null);
  const close = () => menu.current?.close();
  const path = usePathname();

  const bar = (button: ReactNode) => (
    // Three columns: the side ones share what the monogram leaves, so a long
    // page name wraps instead of running under it.
    <div
      className={`grid h-[101px] gap-3 ${top ? "items-start" : "items-center"} ${inset}`}
      style={{ gridTemplateColumns: `minmax(0,1fr) ${logoWidth}px minmax(0,1fr)` }}
    >
      {title ? (
        <span className={`${barText} ${top ? "leading-[1.2]" : "leading-[1.1] pb-[0.08em]"}`} style={top && { paddingTop: top.title }}>
          {title}
        </span>
      ) : (
        <div className="flex" style={top && { paddingTop: top.button }}>
          {button}
        </div>
      )}
      <Link
        href="/"
        aria-label="Andy Lenárt — home"
        onClick={(e) => {
          close();
          // Already home: the logo takes you back to the top.
          if (path === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="self-start pt-5"
        style={{ width: logoWidth, ...(top && { paddingTop: top.logo }) }}
      >
        <Image
          src="/images/logo-mark.png"
          alt=""
          width={332}
          height={282}
          sizes={`${logoWidth}px`}
          preload
          className={dark ? "invert" : undefined}
        />
      </Link>
      {title && (
        <div className="relative flex justify-end" style={top && { paddingTop: top.button }}>
          {button}
        </div>
      )}
    </div>
  );

  return (
    <header className={className}>
      {bar(
        <span className="relative">
          <button
            type="button"
            onClick={() => menu.current?.showModal()}
            aria-haspopup="dialog"
            className={`${barText} link-draw relative z-10 shrink-0`}
          >
            Public
          </button>
          {buttonExtra}
        </span>,
      )}

      <dialog
        ref={menu}
        aria-label="Menu"
        className={`site-menu ${dark ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {bar(
          <button type="button" onClick={close} className={`${barText} link-draw shrink-0`}>
            Close
          </button>,
        )}
        <nav aria-label="Primary" className={`pt-10 ${inset}`}>
          <ul className="flex flex-col gap-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="link-draw text-[36px] leading-[1.05] font-black uppercase"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
