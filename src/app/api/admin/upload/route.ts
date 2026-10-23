import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { LOCAL_DIR, safeName, uploadMode } from "@/lib/admin/media";

/** Images, audio and lyric files the admin can upload. */
const ALLOWED = ["image/*", "audio/*", "video/mp4", "text/plain", "application/x-subrip", "application/octet-stream"];
const MAX_BYTES = 200 * 1024 * 1024;

/** How uploads work here ("blob", "local" or "none"). */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ mode: uploadMode() });
}

export async function POST(request: NextRequest) {
  const mode = uploadMode();

  // Local development: the file itself comes in the request.
  if (request.nextUrl.searchParams.has("local")) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    if (mode !== "local") return NextResponse.json({ error: "Local uploads are off." }, { status: 400 });
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file." }, { status: 400 });
    const name = `${Date.now().toString(36)}-${safeName(file.name)}`;
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${name}` });
  }

  // Vercel Blob: the browser uploads straight to storage with a short-lived
  // token issued here (only to a signed-in admin).
  if (mode !== "blob") return NextResponse.json({ error: "No file storage is connected." }, { status: 400 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Not signed in.");
        if (!pathname.startsWith("uploads/")) throw new Error("Bad path.");
        return { allowedContentTypes: ALLOWED, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
