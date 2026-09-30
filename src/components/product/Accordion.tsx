"use client";

import { useId, useState } from "react";

type Item = { title: string; body?: string };

/**
 * Expandable detail rows. The panel animates its height by transitioning a
 * one-row grid from 0fr to 1fr (works for any content height), and its text
 * fades in slightly after it starts opening.
 */
export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between py-1 text-left text-[15px] text-ink"
              >
                <span className="link-draw">{item.title}</span>
                <span
                  aria-hidden
                  className={`text-[18px] font-light transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`pt-2 pb-1 text-[14px] leading-[1.5] text-body transition-[opacity,translate] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
                    isOpen ? "translate-y-0 opacity-100 delay-150" : "-translate-y-1 opacity-0"
                  }`}
                >
                  {item.body ?? "Details coming soon."}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
