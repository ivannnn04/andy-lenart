import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Where the admin panel keeps its data:
 *
 * - "redis": Upstash Redis (Vercel → Storage → Upstash for Redis). Used
 *   whenever its REST URL and token are in the environment.
 * - "file": JSON files in .data/ — local development only.
 * - "none": production without Redis. Everything reads as empty and the
 *   site falls back to the content it ships with; saving is disabled.
 */
export type StorageKind = "redis" | "file" | "none";

type Hash<T> = Record<string, T>;

export interface Storage {
  kind: StorageKind;
  writable: boolean;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  hGetAll<T>(key: string): Promise<Hash<T>>;
  hSet<T>(key: string, field: string, value: T): Promise<void>;
  hDel(key: string, field: string): Promise<void>;
  /** Counter that expires `ttl` seconds after it is first set (rate limits). */
  incr(key: string, ttl: number): Promise<number>;
}

const PREFIX = "andy-lenart:";

function redisStorage(url: string, token: string): Storage {
  const redis = new Redis({ url, token });
  return {
    kind: "redis",
    writable: true,
    get: async <T>(key: string) => (await redis.get<T>(PREFIX + key)) ?? null,
    set: async (key, value) => {
      await redis.set(PREFIX + key, value);
    },
    hGetAll: async <T>(key: string) => ((await redis.hgetall<Hash<T>>(PREFIX + key)) ?? {}) as Hash<T>,
    hSet: async (key, field, value) => {
      await redis.hset(PREFIX + key, { [field]: value });
    },
    hDel: async (key, field) => {
      await redis.hdel(PREFIX + key, field);
    },
    incr: async (key, ttl) => {
      const count = await redis.incr(PREFIX + key);
      if (count === 1) await redis.expire(PREFIX + key, ttl);
      return count;
    },
  };
}

function fileStorage(dir: string): Storage {
  const file = (key: string) => path.join(dir, `${key.replace(/[^a-z0-9-]/gi, "_")}.json`);
  async function read<T>(key: string): Promise<T | null> {
    try {
      return JSON.parse(await readFile(file(key), "utf8")) as T;
    } catch {
      return null;
    }
  }
  async function write(key: string, value: unknown) {
    await mkdir(dir, { recursive: true });
    // Write then rename, so a crash never leaves half a file.
    const tmp = `${file(key)}.tmp`;
    await writeFile(tmp, JSON.stringify(value, null, 2));
    await rename(tmp, file(key));
  }
  const counters = new Map<string, { count: number; until: number }>();
  return {
    kind: "file",
    writable: true,
    get: read,
    set: write,
    hGetAll: async <T>(key: string) => (await read<Hash<T>>(key)) ?? {},
    hSet: async (key, field, value) => write(key, { ...((await read<Hash<unknown>>(key)) ?? {}), [field]: value }),
    hDel: async (key, field) => {
      const all = (await read<Hash<unknown>>(key)) ?? {};
      delete all[field];
      await write(key, all);
    },
    incr: async (key, ttl) => {
      const now = Date.now();
      const entry = counters.get(key);
      const next = entry && entry.until > now ? { ...entry, count: entry.count + 1 } : { count: 1, until: now + ttl * 1000 };
      counters.set(key, next);
      return next.count;
    },
  };
}

const noStorage: Storage = {
  kind: "none",
  writable: false,
  get: async () => null,
  set: async () => {
    throw new Error("No storage is connected.");
  },
  hGetAll: async () => ({}),
  hSet: async () => {
    throw new Error("No storage is connected.");
  },
  hDel: async () => {
    throw new Error("No storage is connected.");
  },
  incr: async () => 0,
};

let storage: Storage | undefined;

export function getStorage(): Storage {
  if (storage) return storage;
  // Vercel's Upstash integration sets KV_REST_API_*; a direct Upstash setup sets UPSTASH_REDIS_REST_*.
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) storage = redisStorage(url, token);
  else if (process.env.NODE_ENV !== "production" || process.env.CONTENT_DIR)
    storage = fileStorage(process.env.CONTENT_DIR ?? path.join(process.cwd(), ".data"));
  else storage = noStorage;
  return storage;
}
