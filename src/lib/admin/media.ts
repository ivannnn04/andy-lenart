import "server-only";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { del, list } from "@vercel/blob";

/**
 * Uploaded files: Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise
 * public/uploads in local development.
 */
export type UploadMode = "blob" | "local" | "none";

export function uploadMode(): UploadMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV !== "production" ? "local" : "none";
}

export const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");

export type MediaFile = { url: string; name: string; size: number; uploadedAt: number };

export async function listMedia(): Promise<MediaFile[]> {
  const mode = uploadMode();
  if (mode === "blob") {
    const files: MediaFile[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: "uploads/", cursor, limit: 1000 });
      for (const b of page.blobs)
        files.push({ url: b.url, name: b.pathname.replace(/^uploads\//, ""), size: b.size, uploadedAt: +b.uploadedAt });
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return files.sort((a, b) => b.uploadedAt - a.uploadedAt);
  }
  if (mode === "local") {
    const names = await readdir(LOCAL_DIR).catch(() => [] as string[]);
    const files = await Promise.all(
      names.map(async (name) => {
        const info = await stat(path.join(LOCAL_DIR, name));
        return { url: `/uploads/${name}`, name, size: info.size, uploadedAt: info.mtimeMs };
      }),
    );
    return files.sort((a, b) => b.uploadedAt - a.uploadedAt);
  }
  return [];
}

export async function deleteMedia(url: string) {
  const mode = uploadMode();
  if (mode === "blob" && /^https:\/\//.test(url)) await del(url);
  else if (mode === "local" && url.startsWith("/uploads/"))
    await unlink(path.join(LOCAL_DIR, path.basename(url))).catch(() => {});
}

/** A safe file name: letters, digits, dots, dashes. */
export const safeName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-100) || "file";
