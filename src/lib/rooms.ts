/**
 * Listening Room access (server only — never import this from a client
 * component, it holds the logic that checks the keyword).
 *
 * An owner taps the NFC tag in their garment, lands on /room/[slug] and
 * enters the keyword: the third word of the concept text printed inside the
 * garment (not counting the title or collection name). A correct word sets a
 * signed, httpOnly cookie that keeps the room open on that device. Wrong
 * words are counted in a second signed cookie; after MAX_ATTEMPTS the gate
 * locks for LOCK_MINUTES.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Garment } from "@/lib/garments";

export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 10;

// Set ROOM_SECRET in the deployment's environment; the fallback only keeps
// local development working.
const SECRET = process.env.ROOM_SECRET ?? "andy-lenart-dev-room-secret";

/** Lower-case letters and digits only, so "Is," / " is " / "IS" all match. */
const normalise = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export function roomKeyword(garment: Garment) {
  const words = garment.concept.paragraphs.join(" ").split(/\s+/).map(normalise).filter(Boolean);
  return words[2] ?? "";
}

export const isKeyword = (garment: Garment, attempt: string) => {
  const keyword = roomKeyword(garment);
  return keyword !== "" && normalise(attempt) === keyword;
};

export const accessCookie = (slug: string) => `room_${slug}`;
export const gateCookie = (slug: string) => `room_gate_${slug}`;

const signature = (value: string) => createHmac("sha256", SECRET).update(value).digest("base64url");

export const sign = (value: string) => `${value}.${signature(value)}`;

/** The signed value, or null when the cookie is missing or was tampered with. */
export function unsign(cookie: string | undefined) {
  if (!cookie) return null;
  const dot = cookie.lastIndexOf(".");
  if (dot < 0) return null;
  const value = cookie.slice(0, dot);
  const given = Buffer.from(cookie.slice(dot + 1));
  const expected = Buffer.from(signature(value));
  return given.length === expected.length && timingSafeEqual(given, expected) ? value : null;
}

export type GateRecord = { attempts: number; lockedUntil: number };

export function readGate(cookie: string | undefined): GateRecord {
  const [attempts, lockedUntil] = (unsign(cookie) ?? "0|0").split("|").map(Number);
  return { attempts: attempts || 0, lockedUntil: lockedUntil || 0 };
}

export const writeGate = ({ attempts, lockedUntil }: GateRecord) => sign(`${attempts}|${lockedUntil}`);
