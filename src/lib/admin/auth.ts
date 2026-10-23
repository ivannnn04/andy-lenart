import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin sign-in: one password (ADMIN_PASSWORD) and a signed, httpOnly
 * session cookie. Changing the password signs every session out.
 *
 * In local development the password defaults to "admin"; in production the
 * panel stays locked until ADMIN_PASSWORD is set.
 */
export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 14;

export function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin" : undefined);
}

const secret = () =>
  process.env.ADMIN_SECRET ?? process.env.ROOM_SECRET ?? `andy-lenart-dev-admin:${adminPassword() ?? ""}`;

const hmac = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");
const passwordTag = () => createHash("sha256").update(adminPassword() ?? "").digest("base64url").slice(0, 12);

const equal = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function checkPassword(attempt: string) {
  const password = adminPassword();
  if (!password) return false;
  // Compare digests so the timing does not depend on the password's length.
  const digest = (s: string) => createHash("sha256").update(s).digest("base64url");
  return equal(digest(attempt), digest(password));
}

export function sessionValue() {
  const value = `${Date.now() + SESSION_DAYS * 86_400_000}.${passwordTag()}`;
  return `${value}.${hmac(value)}`;
}

export const sessionMaxAge = SESSION_DAYS * 86_400;

export function isValidSession(cookie: string | undefined) {
  if (!cookie || !adminPassword()) return false;
  const dot = cookie.lastIndexOf(".");
  if (dot < 0) return false;
  const value = cookie.slice(0, dot);
  if (!equal(cookie.slice(dot + 1), hmac(value))) return false;
  const [expires, tag] = value.split(".");
  return Number(expires) > Date.now() && tag === passwordTag();
}

export async function isAdmin() {
  return isValidSession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For admin pages: back to the sign-in page when not signed in. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** For admin actions and routes: throws when not signed in. */
export async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Not signed in.");
}
