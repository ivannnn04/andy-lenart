"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Home page" },
  { href: "/admin/collection", label: "Collection" },
  { href: "/admin/staircase", label: "The Staircase" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto md:flex-col max-md:-mx-1 max-md:pb-1">
        {SECTIONS.map((s) => {
          const active = s.href === "/admin" ? path === s.href : path.startsWith(s.href);
          return (
            <li key={s.href}>
              <Link
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-md px-3 py-2 text-[14px] font-semibold transition-colors ${
                  active ? "bg-ink text-white" : "text-[#444] hover:bg-[#f0f0ec]"
                }`}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
