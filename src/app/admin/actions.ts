"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { assertAdmin, checkPassword, SESSION_COOKIE, sessionMaxAge, sessionValue } from "@/lib/admin/auth";
import { deleteMedia as removeMediaFile } from "@/lib/admin/media";
import { deleteRequest, deleteSubscriber, setRequestDone, withinLimit } from "@/lib/content/inbox";
import { deleteMark, updateMark } from "@/lib/content/marks";
import * as normalize from "@/lib/content/normalize";
import { saveContent } from "@/lib/content/store";
import type { Garment, Room, SiteContent } from "@/lib/content/types";

export type ActionResult = { ok: true; slug?: string } | { ok: false; error: string };

async function run(work: () => Promise<{ slug?: string } | void>): Promise<ActionResult> {
  try {
    await assertAdmin();
    const result = await work();
    return { ok: true, ...(result ?? {}) };
  } catch (error) {
    return { ok: false, error: (error as Error).message || "Could not save." };
  }
}

// --- Sign in / out -----------------------------------------------------------

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const ip = ((await headers()).get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (!(await withinLimit("login", ip, 10))) return "Too many attempts — try again in an hour.";
  if (!checkPassword(String(form.get("password") ?? ""))) return "Wrong password.";
  (await cookies()).set(SESSION_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// --- Content -----------------------------------------------------------------

export async function saveSettings(value: unknown) {
  return run(async () => {
    await saveContent((c) => ({ ...c, settings: normalize.settings(value) }));
  });
}

export async function saveHome(value: unknown) {
  return run(async () => {
    await saveContent((c) => ({ ...c, home: normalize.home(value) }));
  });
}

export async function saveCollection(value: unknown) {
  return run(async () => {
    const list = Array.isArray(value) ? value : (value as { cards?: unknown[] })?.cards;
    const cards = Array.isArray(list) ? list.map(normalize.card) : [];
    await saveContent((c) => ({ ...c, collection: cards }));
  });
}

/** Saves under `slug` (the URL it had), so renaming the slug moves it. */
function upsert<T extends { slug: string }>(list: T[], slug: string, item: T, kind: string) {
  if (item.slug !== slug && list.some((x) => x.slug === item.slug))
    throw new Error(`Another ${kind} already uses the address “${item.slug}”.`);
  const at = list.findIndex((x) => x.slug === slug);
  return at < 0 ? [...list, item] : list.map((x, i) => (i === at ? item : x));
}

export async function saveGarment(slug: string, value: unknown) {
  return run(async () => {
    const garment = normalize.garment(value);
    await saveContent((c) => ({ ...c, garments: upsert(c.garments, slug, garment, "garment") }));
    return { slug: garment.slug };
  });
}

export async function deleteGarment(slug: string) {
  return run(async () => {
    await saveContent((c) => ({ ...c, garments: c.garments.filter((g) => g.slug !== slug) }));
  });
}

function freeSlug(list: { slug: string }[], base: string) {
  let slug = base;
  for (let n = 2; list.some((x) => x.slug === slug); n++) slug = `${base}-${n}`;
  return slug;
}

export async function createGarment() {
  return run(async () => {
    let slug = "";
    await saveContent((c: SiteContent) => {
      slug = freeSlug(c.garments, "new-garment");
      const blank: Garment = {
        slug,
        no: String(c.garments.length + 1).padStart(2, "0"),
        titleLines: ["New garment"],
        tagline: "",
        price: "",
        availability: "",
        remaining: "",
        size: "One size",
        preview: { duration: "0:30" },
        gallery: [],
        requestPhoto: 0,
        details: [{ title: "Fabric & Making" }, { title: "Sizing" }, { title: "Shipping" }],
        concept: { paragraphs: [], image: { alt: "", width: 1836, height: 1056 }, quote: "" },
        credits: [],
        inside: { title: [], paragraphs: [], image: { alt: "", width: 560, height: 360 } },
      };
      return { ...c, garments: [...c.garments, blank] };
    });
    return { slug };
  });
}

export async function saveRoom(slug: string, value: unknown) {
  return run(async () => {
    const room = normalize.room(value);
    await saveContent((c) => ({ ...c, rooms: upsert(c.rooms, slug, room, "room") }));
    return { slug: room.slug };
  });
}

export async function deleteRoom(slug: string) {
  return run(async () => {
    await saveContent((c) => ({ ...c, rooms: c.rooms.filter((r) => r.slug !== slug) }));
  });
}

export async function createRoom() {
  return run(async () => {
    let slug = "";
    await saveContent((c) => {
      slug = freeSlug(c.rooms, "new-room");
      const blank: Room = {
        slug,
        garmentNo: String(c.rooms.length + 1).padStart(2, "0"),
        titleLines: ["New room"],
        keyword: "",
        lyrics: [],
        verse: [],
        collage: "pelican",
      };
      return { ...c, rooms: [...c.rooms, blank] };
    });
    return { slug };
  });
}

// --- The Staircase -----------------------------------------------------------

export async function setMarkHidden(id: string, hidden: boolean) {
  return run(() => updateMark(id, { hidden }));
}

export async function removeMark(id: string) {
  return run(() => deleteMark(id));
}

// --- Inbox -------------------------------------------------------------------

export async function markRequestDone(id: string, done: boolean) {
  return run(() => setRequestDone(id, done));
}

export async function removeRequest(id: string) {
  return run(() => deleteRequest(id));
}

export async function removeSubscriber(id: string) {
  return run(() => deleteSubscriber(id));
}

// --- Media -------------------------------------------------------------------

export async function removeMedia(url: string) {
  return run(() => removeMediaFile(url));
}
