"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGarment } from "@/lib/garments";
import {
  LOCK_MINUTES,
  MAX_ATTEMPTS,
  accessCookie,
  gateCookie,
  isKeyword,
  readGate,
  sign,
  writeGate,
} from "@/lib/rooms";

export type GateState =
  | { status: "idle" }
  | { status: "wrong"; attemptsLeft: number }
  | { status: "locked"; lockedUntil: number };

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/room",
};

export async function enterRoom(slug: string, _prev: GateState, form: FormData): Promise<GateState> {
  const garment = getGarment(slug);
  if (!garment) return { status: "idle" };

  const jar = await cookies();
  const gate = readGate(jar.get(gateCookie(slug))?.value);
  const now = Date.now();
  if (gate.lockedUntil > now) return { status: "locked", lockedUntil: gate.lockedUntil };

  if (isKeyword(garment, String(form.get("word") ?? ""))) {
    jar.delete({ name: gateCookie(slug), path: "/room" });
    jar.set(accessCookie(slug), sign("granted"), { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
    redirect(`/room/${slug}`);
  }

  const attempts = gate.attempts + 1;
  if (attempts >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCK_MINUTES * 60_000;
    jar.set(gateCookie(slug), writeGate({ attempts: 0, lockedUntil }), {
      ...cookieOptions,
      maxAge: LOCK_MINUTES * 60,
    });
    return { status: "locked", lockedUntil };
  }
  jar.set(gateCookie(slug), writeGate({ attempts, lockedUntil: 0 }), {
    ...cookieOptions,
    maxAge: 60 * 60,
  });
  return { status: "wrong", attemptsLeft: MAX_ATTEMPTS - attempts };
}
