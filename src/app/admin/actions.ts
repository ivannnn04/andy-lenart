"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { assertAdmin, checkPassword, SESSION_COOKIE, sessionMaxAge, sessionValue } from "@/lib/admin/auth";
import { deleteMedia as removeMediaFile } from "@/lib/admin/media";
import { deleteRequest, deleteSubscriber, setRequestDone, withinLimit } from "@/lib/content/inbox";
import { deleteMark, updateMark } from "@/lib/content/marks";
import * as normalize from "@/lib/content/normalize";
import { saveContent } from "@/lib/content/store";
import type { Garment, SiteContent } from "@/lib/content/types";

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

/** Saves under `slug` (the address it had), so renaming the address moves it. */
export async function saveGarment(slug: string, value: unknown) {
  return run(async () => {
    const garment = normalize.garment(value);
    await saveContent((c) => {
      if (garment.slug !== slug && c.garments.some((g) => g.slug === garment.slug))
        throw new Error(`Another garment already uses the address “${garment.slug}”.`);
      const at = c.garments.findIndex((g) => g.slug === slug);
      const garments = at < 0 ? [...c.garments, garment] : c.garments.map((g, i) => (i === at ? garment : g));
      return { ...c, garments };
    });
    return { slug: garment.slug };
  });
}

export async function deleteGarment(slug: string) {
  return run(async () => {
    await saveContent((c) => ({ ...c, garments: c.garments.filter((g) => g.slug !== slug) }));
  });
}

/** Shows or hides the garment's card on the home page. */
export async function setGarmentHidden(slug: string, hidden: boolean) {
  return run(async () => {
    await saveContent((c) => ({
      ...c,
      garments: c.garments.map((g) => (g.slug === slug ? { ...g, hidden: hidden || undefined } : g)),
    }));
  });
}

/** Moves a garment up (-1) or down (1) in the collection's order. */
export async function moveGarment(slug: string, by: -1 | 1) {
  return run(async () => {
    await saveContent((c) => {
      const from = c.garments.findIndex((g) => g.slug === slug);
      const to = from + by;
      if (from < 0 || to < 0 || to >= c.garments.length) return c;
      const garments = [...c.garments];
      [garments[from], garments[to]] = [garments[to], garments[from]];
      return { ...c, garments };
    });
  });
}

export async function createGarment() {
  return run(async () => {
    let slug = "";
    await saveContent((c: SiteContent) => {
      slug = "new-garment";
      for (let n = 2; c.garments.some((g) => g.slug === slug); n++) slug = `new-garment-${n}`;
      const blank: Garment = {
        slug,
        no: String(c.garments.length + 1).padStart(2, "0"),
        titleLines: ["New garment"],
        hidden: true,
        status: "Coming soon",
        tagline: "Not yet released",
        price: "",
        preview: { duration: "0:30" },
        page: false,
        availability: "",
        remaining: "",
        size: "One size",
        gallery: [],
        requestPhoto: 0,
        details: [{ title: "Fabric & Making" }, { title: "Sizing" }, { title: "Shipping" }],
        concept: { paragraphs: [], image: { alt: "", width: 1836, height: 1056 }, quote: "" },
        credits: [],
        inside: { title: [], paragraphs: [], image: { alt: "", width: 560, height: 360 } },
        room: { enabled: false, keyword: "", lyrics: [], verse: [], collage: "pelican" },
      };
      return { ...c, garments: [...c.garments, blank] };
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
