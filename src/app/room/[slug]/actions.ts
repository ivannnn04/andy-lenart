"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getContent, getRoom } from "@/lib/content/store";
import {
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
  const room = await getRoom(slug);
  if (!room) return { status: "idle" };

  const jar = await cookies();
  const gate = readGate(jar.get(gateCookie(slug))?.value);
  const now = Date.now();
  if (gate.lockedUntil > now) return { status: "locked", lockedUntil: gate.lockedUntil };

  if (isKeyword(room, String(form.get("word") ?? ""))) {
    jar.delete({ name: gateCookie(slug), path: "/room" });
    jar.set(accessCookie(slug), sign("granted"), { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
    redirect(`/room/${slug}`);
  }

  // Set in the admin (Settings); 0 attempts never pauses.
  const { roomAttempts, roomLockMinutes } = (await getContent()).settings;
  const attempts = gate.attempts + 1;
  if (roomAttempts > 0 && attempts >= roomAttempts) {
    const lockedUntil = now + roomLockMinutes * 60_000;
    jar.set(gateCookie(slug), writeGate({ attempts: 0, lockedUntil }), {
      ...cookieOptions,
      maxAge: roomLockMinutes * 60,
    });
    return { status: "locked", lockedUntil };
  }
  jar.set(gateCookie(slug), writeGate({ attempts, lockedUntil: 0 }), {
    ...cookieOptions,
    maxAge: 60 * 60,
  });
  // Without a limit the count still changes each time, so the field clears after every wrong word.
  return { status: "wrong", attemptsLeft: roomAttempts > 0 ? roomAttempts - attempts : -attempts };
}
