import "server-only";
import { list } from "@vercel/blob";
import { SEED_MARKS } from "@/lib/content/marks";
import { getStorage, upstashStorage } from "@/lib/content/storage";
import { safeName, supabaseUpload } from "./media";

/** What the site kept in Upstash Redis, by key. */
const SEEDED = "marks-seeded";
const DOCUMENTS = ["content", SEEDED];
const LISTS = ["requests", "subscribers", "marks"];

export type MoveReport = { content: boolean; requests: number; subscribers: number; marks: number; files: number };

/** Whether there is old data to copy: Supabase is connected and Upstash or Vercel Blob still is. */
export function canMoveToSupabase() {
  return getStorage().kind === "supabase" && Boolean(upstashStorage() || process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Copies everything from Upstash Redis and Vercel Blob into Supabase. Safe to
 * run more than once: entries are matched by id, files by name, and the site
 * content is only copied while Supabase has none, so edits made since are kept.
 * Uploaded files are copied to Supabase Storage and the content points to the
 * copies.
 */
export async function moveToSupabase(): Promise<MoveReport> {
  const target = getStorage();
  if (target.kind !== "supabase") throw new Error("Supabase is not connected.");
  const report: MoveReport = { content: false, requests: 0, subscribers: 0, marks: 0, files: 0 };

  const source = upstashStorage();
  if (source) {
    for (const key of DOCUMENTS) {
      const value = await source.get<unknown>(key);
      if (value == null || (await target.get(key)) != null) continue;
      await target.set(key, value);
      if (key === "content") report.content = true;
    }
    for (const key of LISTS) {
      const entries = Object.entries(await source.hGetAll<unknown>(key));
      for (const [id, value] of entries) await target.hSet(key, id, value);
      // Starter marks the admin deleted before the move stay deleted.
      if (key === "marks" && (await source.get(SEEDED))) {
        const kept = new Set(entries.map(([id]) => id));
        for (const mark of SEED_MARKS) if (!kept.has(mark.id)) await target.hDel(key, mark.id);
      }
      report[key as "requests" | "subscribers" | "marks"] = entries.length;
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const moved = new Map<string, string>();
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: "uploads/", cursor, limit: 1000 });
      for (const blob of page.blobs) {
        const res = await fetch(blob.url);
        if (!res.ok) continue;
        const name = safeName(blob.pathname.replace(/^uploads\//, ""));
        const type = res.headers.get("content-type") ?? "application/octet-stream";
        moved.set(blob.url, await supabaseUpload(name, await res.blob(), type));
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    report.files = moved.size;

    // Point the content (and anything else that names a file) at the copies.
    if (moved.size) {
      const content = await target.get<unknown>("content");
      if (content != null) {
        let json = JSON.stringify(content);
        for (const [from, to] of moved) json = json.split(from).join(to);
        await target.set("content", JSON.parse(json));
      }
    }
  }
  return report;
}
