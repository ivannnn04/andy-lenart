import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getRoom } from "@/lib/content/store";
import { accessCookie, unsign } from "@/lib/rooms";
import { builtInTrack, sendTrack } from "@/lib/tracks";

const refused = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

/** The room's full track, for someone who has entered the room (its access cookie). */
async function track(request: NextRequest, ctx: RouteContext<"/room/[slug]/track">) {
  const { slug } = await ctx.params;
  const room = await getRoom(slug);
  if (!room) return refused();
  if (unsign((await cookies()).get(accessCookie(slug))?.value) !== "granted") return refused();
  const name = builtInTrack(room.track);
  return name ? sendTrack(request, name) : refused();
}

export { track as GET, track as HEAD };
