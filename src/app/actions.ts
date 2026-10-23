"use server";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { addRequest, addSubscriber, withinLimit } from "@/lib/content/inbox";
import { addMark, MAX_MARK_LENGTH } from "@/lib/content/marks";
import { str } from "@/lib/content/normalize";
import { getStorage } from "@/lib/content/storage";
import { getRoom } from "@/lib/content/store";
import type { Mark } from "@/lib/content/types";
import { accessCookie, unsign } from "@/lib/rooms";
import { emailError } from "@/lib/validate";

/**
 * What the public forms send. `stored: false` means no store is connected
 * (the forms then fall back to what they did before: the browser keeps the
 * mark, the email client sends the message).
 */
export type PublicResult = { ok: true; stored: boolean; mark?: Mark } | { ok: false; error: string };

async function visitor() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
}

const tooMany: PublicResult = { ok: false, error: "Too many messages from here — please try again later." };

/** A mark on the Staircase; only someone who opened the room can leave one. */
export async function leaveMark(slug: string, input: { name: string; city: string; text: string }): Promise<PublicResult> {
  const room = await getRoom(slug);
  if (!room) return { ok: false, error: "This room does not exist." };
  if (unsign((await cookies()).get(accessCookie(slug))?.value) !== "granted")
    return { ok: false, error: "Open the Listening Room first." };
  const mark: Mark = {
    id: randomUUID(),
    name: str(input.name, 40),
    city: str(input.city, 60),
    text: str(input.text, MAX_MARK_LENGTH),
    no: room.garmentNo,
    room: room.slug,
    createdAt: Date.now(),
  };
  if (!mark.name || !mark.city || !mark.text) return { ok: false, error: "Please fill in every field." };
  if (!getStorage().writable) return { ok: true, stored: false, mark };
  if (!(await withinLimit("mark", await visitor(), 10))) return tooMany;
  await addMark(mark);
  return { ok: true, stored: true, mark };
}

/** "Request this piece". */
export async function sendRequest(input: {
  garment: string;
  name: string;
  city: string;
  email: string;
  message: string;
}): Promise<PublicResult> {
  const request = {
    id: randomUUID(),
    createdAt: Date.now(),
    garment: str(input.garment, 200),
    name: str(input.name, 120),
    city: str(input.city, 120),
    email: str(input.email, 200),
    message: str(input.message, 4000),
  };
  if (!request.name || !request.city || emailError(request.email)) return { ok: false, error: "Please check the form." };
  if (!getStorage().writable) return { ok: true, stored: false };
  if (!(await withinLimit("request", await visitor(), 10))) return tooMany;
  await addRequest(request);
  return { ok: true, stored: true };
}

/** "Hear when the next piece is out". */
export async function subscribe(input: { name: string; email: string; message: string }): Promise<PublicResult> {
  const subscriber = {
    id: randomUUID(),
    createdAt: Date.now(),
    name: str(input.name, 120),
    email: str(input.email, 200),
    message: str(input.message, 2000),
  };
  if (!subscriber.name || emailError(subscriber.email)) return { ok: false, error: "Please check the form." };
  if (!getStorage().writable) return { ok: true, stored: false };
  if (!(await withinLimit("subscribe", await visitor(), 10))) return tooMany;
  await addSubscriber(subscriber);
  return { ok: true, stored: true };
}
