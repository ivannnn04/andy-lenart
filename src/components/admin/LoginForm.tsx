"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/admin/actions";
import { input } from "./fields";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  const [shown, setShown] = useState(false);
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <label htmlFor="password" className="text-[13px] font-semibold">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={shown ? "text" : "password"}
          autoComplete="current-password"
          required
          autoFocus
          className={`${input} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? "Hide password" : "Show password"}
          aria-pressed={shown}
          title={shown ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-[#777] hover:text-ink focus-visible:outline-2 focus-visible:outline-black"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {shown && <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-ink px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
