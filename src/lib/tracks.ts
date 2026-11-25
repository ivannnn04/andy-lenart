import "server-only";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

/**
 * The full tracks of the Listening Rooms. They are not in /public, so nobody
 * can fetch one by guessing its address: a room's track is only sent to
 * someone who has entered that room (/room/[slug]/track), and to the admin
 * (/audio/[file], so the players in the panel keep working).
 */
const DIR = path.join(process.cwd(), "private", "audio");

/** "/audio/funkce-track.m4a" → the built-in track's file name, when the address is one. */
export function builtInTrack(src: string | undefined) {
  const name = src?.match(/^\/audio\/([\w.-]+)$/)?.[1];
  return name && !name.startsWith(".") ? name : undefined;
}

const TYPES: Record<string, string> = { ".m4a": "audio/mp4", ".mp3": "audio/mpeg", ".aac": "audio/aac", ".wav": "audio/wav", ".ogg": "audio/ogg" };

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

/** Sends the file, whole or the part a player asks for (players seek with Range requests). */
export async function sendTrack(request: Request, name: string) {
  if (!/^[\w.-]+$/.test(name) || name.startsWith(".")) return notFound();
  const file = path.join(DIR, name);
  const size = await stat(file).then((s) => (s.isFile() ? s.size : -1), () => -1);
  if (size < 0) return notFound();

  const headers = new Headers({
    "Content-Type": TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
    "Accept-Ranges": "bytes",
    // Private to the listener: never stored by shared caches.
    "Cache-Control": "private, max-age=3600",
    "X-Robots-Tag": "noindex",
  });

  const range = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  let start = 0;
  let end = size - 1;
  let status = 200;
  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      if (range[2]) end = Math.min(Number(range[2]), size - 1);
    } else {
      // "bytes=-500": the last 500 bytes.
      start = Math.max(0, size - Number(range[2]));
    }
    if (start > end || start >= size) {
      headers.set("Content-Range", `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    status = 206;
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  }
  headers.set("Content-Length", String(end - start + 1));
  if (request.method === "HEAD") return new Response(null, { status, headers });
  const body = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(body, { status, headers });
}
