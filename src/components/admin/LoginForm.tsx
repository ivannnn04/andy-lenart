"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { input } from "./fields";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <label htmlFor="password" className="text-[13px] font-semibold">
        Password
      </label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className={input} />
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
