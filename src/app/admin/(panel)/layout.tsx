import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/auth";
import { getStorage } from "@/lib/content/storage";

export const metadata: Metadata = {
  title: { template: "%s · Admin", default: "Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const storage = getStorage();
  return (
    <div className="flex min-h-dvh bg-[#f6f6f3] font-ui text-ink max-md:flex-col">
      <aside className="flex shrink-0 flex-col gap-6 border-[#e4e4e0] bg-white px-4 py-5 md:sticky md:top-0 md:h-dvh md:w-60 md:border-r max-md:border-b">
        <div className="flex items-center justify-between md:block">
          <Link href="/admin" className="block">
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#888]">Andy Lenárt</span>
            <span className="block text-[18px] font-bold">Admin</span>
          </Link>
          <a href="/" target="_blank" className="text-[12px] font-semibold text-[#666] underline md:mt-1 md:inline-block">
            View site ↗
          </a>
        </div>
        <AdminNav />
        <form action={logout} className="md:mt-auto">
          <button type="submit" className="text-[13px] font-semibold text-[#666] hover:text-ink">
            Sign out
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1 px-4 pt-6 md:px-8 md:pt-8">
        {!storage.writable && (
          <p className="mb-6 rounded-lg border border-[#f0c36d] bg-[#fff8e5] px-4 py-3 text-[13px] leading-[1.5]">
            <strong>Read-only:</strong> no storage is connected, so changes cannot be saved yet. See the Dashboard for the
            two-minute setup.
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
