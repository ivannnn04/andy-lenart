import type { ReactNode } from "react";

export function PageHeader({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[640px]">
        <h1 className="text-[26px] leading-[1.15] font-bold">{title}</h1>
        {intro && <p className="mt-1.5 text-[14px] leading-[1.5] text-[#666]">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
