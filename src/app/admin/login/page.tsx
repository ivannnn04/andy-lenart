import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminPassword, isAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Sign in · Admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = Boolean(adminPassword());
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f6f6f3] px-4 font-ui">
      <div className="w-full max-w-sm rounded-xl border border-[#e4e4e0] bg-white p-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#777]">Andy Lenárt</p>
        <h1 className="mt-2 text-[24px] font-bold">Admin</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-[14px] leading-[1.5] text-[#555]">
            The admin panel is locked: set an <code className="font-mono">ADMIN_PASSWORD</code> environment variable
            in Vercel (Project → Settings → Environment Variables) and redeploy.
          </p>
        )}
      </div>
    </main>
  );
}
