"use server";

import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStorage } from "@/lib/content/storage";
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

/**
 * Tries from this visitor's address at this room's word, counted on the
 * server: the cookie count below is a courtesy to the visitor (it can be
 * cleared), this one is what stops a word from being guessed by trial. The
 * address is kept only as a one-way code. Returns how long to wait, in
 * minutes, or 0 when the try may go ahead.
 */
async function serverPause(slug: string, tries: number, minutes: number, hourly: number) {
  const storage = getStorage();
  if (!storage.writable) return 0;
  const h = await headers();
  const address = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
  const who = createHash("sha256").update(`${process.env.ROOM_SECRET ?? ""}:${address}`).digest("hex").slice(0, 16);
  // Counted even while paused, so hammering the gate never shortens the wait.
  const [recent, hour] = await Promise.all([
    tries > 0 ? storage.incr(`room:${slug}:${who}`, minutes * 60) : 0,
    storage.incr(`room-hour:${slug}:${who}`, 3600),
  ]);
  if (hour > hourly) return 60;
  return tries > 0 && recent > tries ? minutes : 0;
}

export async function enterRoom(slug: string, _prev: GateState, form: FormData): Promise<GateState> {
  const room = await getRoom(slug);
  if (!room) return { status: "idle" };

  const jar = await cookies();
  const gate = readGate(jar.get(gateCookie(slug))?.value);
  const now = Date.now();
  if (gate.lockedUntil > now) return { status: "locked", lockedUntil: gate.lockedUntil };

  // Set in the admin (Settings); 0 attempts never pauses (the hourly limit still holds).
  const { roomAttempts, roomLockMinutes, roomHourlyTries } = (await getContent()).settings;
  const wait = await serverPause(slug, roomAttempts, roomLockMinutes, roomHourlyTries).catch(() => 0);
  if (wait) {
    const lockedUntil = now + wait * 60_000;
    jar.set(gateCookie(slug), writeGate({ attempts: 0, lockedUntil }), { ...cookieOptions, maxAge: wait * 60 });
    return { status: "locked", lockedUntil };
  }

  if (isKeyword(room, String(form.get("word") ?? ""))) {
    jar.delete({ name: gateCookie(slug), path: "/room" });
    jar.set(accessCookie(slug), sign("granted"), { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
    redirect(`/room/${slug}`);
  }

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
