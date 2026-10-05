"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { NAV } from "@/lib/nav";

const barText = "text-[16px] leading-[normal] font-semibold uppercase";

/**
 * The phone header used on every page: the page's name on the left, the
 * monogram in the middle and "Public" on the right, which opens the
 * full-screen menu. Without a title, "Public" moves to the left (the
 * Listening Room). The menu is a modal <dialog> (focus stays inside, Esc
 * closes it).
 */
export function MobileNav({
  title,
  className = "",
  inset = "gutter",
  tone = "light",
}: {
  /** Page name (or a link) on the left; without it "Public" goes there. */
  title?: ReactNode;
  className?: string;
  /** Side padding of the bar, to line up with the page's own content. */
  inset?: string;
  /** "dark": white text and monogram on black (the Listening Room). */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const menu = useRef<HTMLDialogElement>(null);
  const close = () => menu.current?.close();

  const bar = (button: ReactNode) => (
    // Three columns: the side ones share what the monogram leaves, so a long
    // page name wraps instead of running under it.
    <div className={`grid h-[101px] grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] items-center gap-3 ${inset}`}>
      {title ? (
        <span className={`${barText} leading-[1.1] pb-[0.08em]`}>{title}</span>
      ) : (
        <div className="flex">{button}</div>
      )}
      <Link
        href="/"
        aria-label="Andy Lenárt — home"
        onClick={close}
        className="w-[72px] self-start pt-5 transition-transform duration-300 hover:-rotate-3 hover:scale-105 motion-reduce:transition-none"
      >
        <Image
          src="/images/logo-mark.png"
          alt=""
          width={332}
          height={282}
          sizes="72px"
          preload
          className={dark ? "invert" : undefined}
        />
      </Link>
      {title && <div className="flex justify-end">{button}</div>}
    </div>
  );

  return (
    <header className={className}>
      {bar(
        <button
          type="button"
          onClick={() => menu.current?.showModal()}
          aria-haspopup="dialog"
          className={`${barText} link-draw shrink-0`}
        >
          Public
        </button>,
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
            {NAV.map((item) => (
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
