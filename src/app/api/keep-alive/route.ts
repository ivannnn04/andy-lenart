import { NextResponse, type NextRequest } from "next/server";
import { getStorage } from "@/lib/content/storage";

// Read at request time, every time: the point is to reach the database.
export const dynamic = "force-dynamic";

/**
 * Called by Vercel on a schedule (vercel.json). A free Supabase project is
 * paused after a week without activity, which takes the site's content,
 * uploads and forms with it; this small read keeps it awake through quiet
 * weeks. It returns nothing about the data.
 */
export async function GET(request: NextRequest) {
  // With CRON_SECRET set in Vercel, only Vercel's own scheduled calls get through.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ ok: false }, { status: 401 });

  const storage = getStorage();
  try {
    if (storage.kind === "supabase") await storage.get("marks-seeded");
    return NextResponse.json({ ok: true, store: storage.kind, at: new Date().toISOString() });
  } catch (error) {
    console.error("Keep-alive: the store did not answer.", error);
    return NextResponse.json({ ok: false, store: storage.kind }, { status: 503 });
  }
}
