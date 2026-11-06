import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_CONTENT } from "./defaults";
import { getStorage } from "./storage";
import { fromLegacy, withCurrentDefaults, withCurrentOrder, withCurrentPrivacy } from "./legacy";
import { garment as normalizeGarment } from "./normalize";
import type { Room, SiteContent } from "./types";

const KEY = "content";
export const CONTENT_TAG = "content";

/** The stored document, each top-level section falling back to the defaults. */
async function readContent(): Promise<SiteContent> {
  const stored = await getStorage().get<Partial<SiteContent> & Record<string, unknown>>(KEY);
  const legacy = stored && ("collection" in stored || "rooms" in stored);
  return {
    settings: stored?.settings ?? DEFAULT_CONTENT.settings,
    home: stored?.home ?? DEFAULT_CONTENT.home,
    privacy: stored?.privacy ? withCurrentPrivacy(stored.privacy) : DEFAULT_CONTENT.privacy,
    // Checked on the way out too, so an older saved shape never breaks a page.
    garments: legacy
      ? withCurrentOrder(fromLegacy(stored).map(normalizeGarment).map(withCurrentDefaults))
      : Array.isArray(stored?.garments)
        ? withCurrentOrder(stored.garments.map(normalizeGarment).map(withCurrentDefaults))
        : DEFAULT_CONTENT.garments,
  };
}

/**
 * The site's content. Cached across requests and refreshed whenever the
 * admin panel saves (saveContent revalidates the tag and every page), and
 * at least once a minute, so a change made straight in the database (e.g.
 * Supabase's table editor) also shows on the site.
 */
export const getContent = unstable_cache(
  readContent,
  // Per deployment, so new built-in content (and code) never meets an older cache.
  ["site-content", process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

/** Uncached read, for the admin panel (always shows what is stored now). */
export const getContentFresh = readContent;

export async function saveContent(update: (content: SiteContent) => SiteContent) {
  const storage = getStorage();
  if (!storage.writable) throw new Error("No storage is connected, so changes cannot be saved.");
  const next = update(await readContent());
  await storage.set(KEY, next);
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return next;
}

/** A garment whose page is published. */
export async function getGarment(slug: string) {
  return (await getContent()).garments.find((g) => g.slug === slug && g.page);
}

/** The garment's Listening Room, when it is switched on. */
export async function getRoom(slug: string): Promise<Room | undefined> {
  const garment = (await getContent()).garments.find((g) => g.slug === slug);
  if (!garment?.room.enabled) return undefined;
  const { enabled, ...room } = garment.room;
  void enabled;
  return { ...room, slug: garment.slug, garmentNo: garment.no, titleLines: garment.titleLines };
}

export const garmentHref = (slug: string) => `/collection/${slug}`;
