import "server-only";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { del, list } from "@vercel/blob";
import { supabaseConfig, supabaseFetch } from "@/lib/content/storage";

/**
 * Uploaded files: the "media" bucket in Supabase Storage when Supabase is
 * connected, else Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise
 * public/uploads in local development.
 */
export type UploadMode = "supabase" | "blob" | "local" | "none";

export function uploadMode(): UploadMode {
  if (supabaseConfig()) return "supabase";
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV !== "production" ? "local" : "none";
}

export const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");

export type MediaFile = { url: string; name: string; size: number; uploadedAt: number };

/** Supabase Storage bucket and folder for uploads (see supabase/schema.sql). */
export const BUCKET = "media";
const FOLDER = "uploads";

/** Public address of a file in the bucket. */
export const supabasePublicUrl = (name: string) =>
  `${supabaseConfig()?.url}/storage/v1/object/public/${BUCKET}/${FOLDER}/${encodeURIComponent(name)}`;

/** A one-off address the admin's browser uploads a file to, and where the file will then be served. */
export async function supabaseUploadTarget(fileName: string) {
  const name = `${Date.now().toString(36)}-${safeName(fileName)}`;
  const res = await supabaseFetch(`/storage/v1/object/upload/sign/${BUCKET}/${FOLDER}/${encodeURIComponent(name)}`, {
    method: "POST",
  });
  const { url } = (await res.json()) as { url: string };
  return { uploadUrl: `${supabaseConfig()?.url}/storage/v1${url}`, url: supabasePublicUrl(name) };
}

/** Puts a file into the bucket from the server (used when copying old uploads across). */
export async function supabaseUpload(name: string, body: Blob, contentType: string) {
  await supabaseFetch(`/storage/v1/object/${BUCKET}/${FOLDER}/${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": contentType, "x-upsert": "true" },
    body,
  });
  return supabasePublicUrl(name);
}

export async function listMedia(): Promise<MediaFile[]> {
  const mode = uploadMode();
  if (mode === "supabase") {
    const files: MediaFile[] = [];
    const PAGE = 1000;
    for (let offset = 0; ; offset += PAGE) {
      const res = await supabaseFetch(`/storage/v1/object/list/${BUCKET}`, {
        method: "POST",
        body: JSON.stringify({ prefix: FOLDER, limit: PAGE, offset, sortBy: { column: "created_at", order: "desc" } }),
      });
      const rows = (await res.json()) as { id: string | null; name: string; created_at: string; metadata?: { size?: number } }[];
      for (const r of rows)
        if (r.id) // folders have no id
          files.push({ url: supabasePublicUrl(r.name), name: r.name, size: r.metadata?.size ?? 0, uploadedAt: +new Date(r.created_at) });
      if (rows.length < PAGE) break;
    }
    return files.sort((a, b) => b.uploadedAt - a.uploadedAt);
  }
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
  const prefix = mode === "supabase" ? supabasePublicUrl("") : "";
  if (mode === "supabase" && url.startsWith(prefix)) {
    const name = decodeURIComponent(url.slice(prefix.length));
    await supabaseFetch(`/storage/v1/object/${BUCKET}`, {
      method: "DELETE",
      body: JSON.stringify({ prefixes: [`${FOLDER}/${name}`] }),
    });
  } else if (mode === "blob" && /^https:\/\//.test(url)) await del(url);
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
