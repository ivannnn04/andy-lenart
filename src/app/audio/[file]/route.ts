import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { sendTrack } from "@/lib/tracks";

/**
 * The full tracks at their old addresses (/audio/…-track.m4a), now only for
 * the signed-in admin, so the players and the lyric timing in the panel keep
 * working. Everyone else gets "not found"; owners hear the track through
 * their room (/room/[slug]/track). The 30-second previews are ordinary public
 * files and never reach this route.
 */
async function track(request: NextRequest, ctx: RouteContext<"/audio/[file]">) {
  const { file } = await ctx.params;
  if (!(await isAdmin())) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  return sendTrack(request, file);
}

export { track as GET, track as HEAD };
