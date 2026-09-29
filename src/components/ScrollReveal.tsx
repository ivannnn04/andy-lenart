"use client";

import { useEffect } from "react";

/** Delay between items that scroll into view together (ms), and its cap. */
const STAGGER = 90;
const MAX_DELAY = 360;

/**
 * Fades elements in as they scroll into view. Direct children of any
 * `[data-reveal-children]` container are revealed (a child that is itself
 * such a container is skipped, so its own children animate instead).
 *
 * Only elements that start below or above the viewport are hidden, so
 * nothing already on screen flickers while the page hydrates.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-children] > *"),
    ).filter((el) => !el.hasAttribute("data-reveal-children"));

    const offscreen = items.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= window.innerHeight || rect.bottom <= 0;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          );

        entering.forEach((el, i) => {
          el.style.setProperty("--reveal-delay", `${Math.min(i * STAGGER, MAX_DELAY)}ms`);
          el.classList.add("is-revealed");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of offscreen) {
      el.setAttribute("data-reveal-item", "");
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
