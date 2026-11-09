import blocklist from "./blocklist.json";

/**
 * Spellings people use to get a slur past such lists: a vowel left out.
 * (Only where the shortened word is not an ordinary one.)
 */
const VOWELLESS = ["ngga", "nggr", "ngger", "nggers", "niggr", "ngr", "nigg", "fggt", "fgt", "fgot", "fagt", "faggt", "trnny", "chnk", "kyke"];

/**
 * The list the Staircase filter starts with: the slurs from
 * dsojevic/profanity-list (MIT, see blocklist.LICENSE) plus the spellings
 * above. The admin edits it from there (Admin → The Staircase).
 */
export const BUILT_IN_TERMS: string[] = shortest([...blocklist.terms, ...VOWELLESS]);

/**
 * One line per word: the filter already reads "rag head", "rag-head" and
 * "raghead" alike, and adds plurals, so those spellings are left out.
 */
function shortest(terms: string[]) {
  const key = (t: string) => t.replace(/[\s-]/g, "");
  const best = new Map<string, string>();
  // A spaced form reads best, then a hyphenated one.
  const rank = (t: string) => (t.includes(" ") ? 0 : t.includes("-") ? 1 : 2);
  for (const t of terms) {
    const k = key(t);
    const had = best.get(k);
    if (!had || rank(t) < rank(had)) best.set(k, t);
  }
  const keys = new Set(best.keys());
  return [...best.entries()]
    .filter(([k]) => !((k.endsWith("es") && keys.has(k.slice(0, -2))) || (k.endsWith("s") && keys.has(k.slice(0, -1)))))
    .map(([, t]) => t)
    .sort();
}
