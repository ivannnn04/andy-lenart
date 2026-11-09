import "server-only";
import { getStorage } from "./storage";
import { MAX_MARK_LENGTH, type Mark, type PublicMark } from "./types";

/**
 * The Staircase: one wall shared by every room. The starter marks from the
 * design are written to the store the first time it is read, so the admin
 * can hide or delete them like any other.
 */
const KEY = "marks";
const SEEDED = "marks-seeded";

export { MAX_MARK_LENGTH };

export const SEED_MARKS: Mark[] = [
  { id: "s1", text: "my mother was a waitress too.", name: "L.", city: "Lisbon", no: "04", createdAt: 7 },
  { id: "s2", text: "concrete remembers more than we do", name: "—", city: "Riga", no: "01", createdAt: 6 },
  { id: "s3", text: "13/22", name: "anon", city: "Brno", no: "01", createdAt: 5 },
  { id: "s4", text: "heard the track on the night bus.", name: "tomas", city: "London", no: "02", createdAt: 4 },
  { id: "s5", text: "never been to one. now I have.", name: "jj", city: "Berlin", no: "03", createdAt: 3 },
  {
    id: "s6",
    text: "I wore it to my grandmother's flat for the last time.",
    name: "mira",
    city: "Kraków",
    no: "03",
    createdAt: 2,
  },
  {
    id: "s7",
    text: "walls too thin — I could hear the neighbours argue and",
    name: "sofi",
    city: "Tallinn",
    no: "02",
    createdAt: 1,
  },
];

/** Every mark, newest first (hidden ones included). */
export async function allMarks(): Promise<Mark[]> {
  const storage = getStorage();
  if (!storage.writable) return SEED_MARKS;
  if (!(await storage.get<boolean>(SEEDED))) {
    for (const mark of SEED_MARKS) await storage.hSet(KEY, mark.id, mark);
    await storage.set(SEEDED, true);
  }
  const marks = Object.values(await storage.hGetAll<Mark>(KEY));
  return marks.sort((a, b) => b.createdAt - a.createdAt);
}

/** What visitors see on the wall (without who reported what). */
export async function visibleMarks(): Promise<PublicMark[]> {
  return (await allMarks()).filter((m) => !m.hidden).map(({ reports, reported, ...mark }) => (void reports, void reported, mark));
}

/**
 * A visitor's report. Each visitor counts once; at `threshold` reports the
 * mark leaves the wall until the admin restores or deletes it. Marks the
 * admin has hidden themselves are left as they are.
 */
export async function reportMark(id: string, visitor: string, threshold: number) {
  const storage = getStorage();
  const mark = (await storage.hGetAll<Mark>(KEY))[id];
  if (!mark || mark.hidden) return;
  const reports = mark.reports ?? [];
  if (reports.includes(visitor)) return;
  const next = [...reports, visitor];
  const hide = next.length >= threshold;
  await storage.hSet(KEY, id, { ...mark, reports: next, ...(hide && { hidden: true, reported: true }) });
}

export async function addMark(mark: Mark) {
  await getStorage().hSet(KEY, mark.id, mark);
}

export async function updateMark(id: string, change: Partial<Mark>) {
  const storage = getStorage();
  const current = (await storage.hGetAll<Mark>(KEY))[id];
  if (current) await storage.hSet(KEY, id, { ...current, ...change, id });
}

/** Back on the wall, its reports cleared. */
export async function restoreMark(id: string) {
  await updateMark(id, { hidden: false, reported: false, reports: [] });
}

export async function deleteMark(id: string) {
  await getStorage().hDel(KEY, id);
}
