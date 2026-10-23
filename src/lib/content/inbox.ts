import "server-only";
import { getStorage } from "./storage";
import type { PieceRequest, Subscriber } from "./types";

/** Requests for a piece and "stay connected" sign-ups, newest first. */
const REQUESTS = "requests";
const SUBSCRIBERS = "subscribers";

const newestFirst = <T extends { createdAt: number }>(items: T[]) => items.sort((a, b) => b.createdAt - a.createdAt);

export const listRequests = async () =>
  newestFirst(Object.values(await getStorage().hGetAll<PieceRequest>(REQUESTS)));
export const listSubscribers = async () =>
  newestFirst(Object.values(await getStorage().hGetAll<Subscriber>(SUBSCRIBERS)));

export const addRequest = (request: PieceRequest) => getStorage().hSet(REQUESTS, request.id, request);
export const addSubscriber = (subscriber: Subscriber) => getStorage().hSet(SUBSCRIBERS, subscriber.id, subscriber);

export async function setRequestDone(id: string, done: boolean) {
  const storage = getStorage();
  const current = (await storage.hGetAll<PieceRequest>(REQUESTS))[id];
  if (current) await storage.hSet(REQUESTS, id, { ...current, done });
}

export const deleteRequest = (id: string) => getStorage().hDel(REQUESTS, id);
export const deleteSubscriber = (id: string) => getStorage().hDel(SUBSCRIBERS, id);

/**
 * At most `limit` submissions per visitor per hour for a kind of form (the
 * forms are public, so this keeps the store from being flooded).
 */
export async function withinLimit(kind: string, visitor: string, limit: number) {
  const storage = getStorage();
  if (!storage.writable) return true;
  return (await storage.incr(`limit:${kind}:${visitor}`, 3600)) <= limit;
}
