/**
 * Checks for a mark on the Staircase, so the wall stays an open space for
 * unfiltered thoughts: ordinary swearing and raw opinions pass, while the
 * words on the admin's list (slurs, to begin with), links and handles do not.
 * Anything else is left to visitors' reports (see `reportMark`).
 */

/** A term as a pattern: "x*" is one or more "x", a vowel may be a symbol ("n*gga"). */
const pattern = (term: string) =>
  term
    .replace(/[.+?^${}()|[\]\\-]/g, "\\$&")
    .replace(/\*/g, "+")
    .replace(/\\-| /g, "[\\s_-]*")
    .replace(/[aeiou]/g, "(?:$&|[*#%?!])");

/**
 * The admin's list as one pattern. Whole words only (with a plural "s"/"es"),
 * so words that merely contain one still pass. Each word is read like the
 * marks are (look-alikes as letters).
 */
let cached: { key: string; re: RegExp } | undefined;
function listed(words: string[]) {
  const key = words.join("\n");
  if (cached?.key === key) return cached.re;
  const terms = words.map((w) => letters(w).replace(/[^a-z *-]/g, "").trim()).filter((w) => /[a-z]/.test(w)).map(pattern);
  cached = { key, re: terms.length ? new RegExp(`(?<![a-z])(?:${terms.join("|")})(?:e?s)?(?![a-z])`) : /(?!)/ };
  return cached.re;
}

/** Look-alike digits and symbols read as letters, accents dropped. */
const LOOKALIKE: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "9": "g", "@": "a", $: "s" };
const letters = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[0134579@$]/g, (c) => LOOKALIKE[c]);
const plain = (text: string) =>
  letters(text)
    // Letters split up to slip through: "n.i.g.g.a", "n-i-g-g-a", "n i g g a".
    .replace(/(?<=[a-z])[._-]+(?=[a-z])/g, "")
    .replace(/(?<=(?:^|[^a-z])[a-z]) (?=[a-z](?:[^a-z]|$))/g, "")
    // The one everyday phrase that holds a listed word.
    .replace(/\bspick?[\s-]+(?:and|&|n)[\s-]+span\b/g, "");

const TLD =
  "com|net|org|io|co|uk|me|info|biz|xyz|app|dev|ly|gg|tv|ru|ua|cz|sk|pl|de|fr|it|es|eu|us|online|site|link|shop|store|club|top|live|pro|ai|to|cc|tk";

const LINKS = [
  /\b(?:https?|ftp):\/\//i,
  /\bwww\s*\./i,
  // name.com, bit.ly/…
  new RegExp(`\\b[a-z0-9-]{2,}\\.(?:${TLD})\\b`, "i"),
  // email
  /[\w.+-]+@[\w-]+\.[a-z]{2,}/i,
  // @handle (not "@ 5pm")
  /(?:^|[^\w])@[a-z0-9_.]{2,}/i,
];

export const LINK_ERROR = "Links, emails and @handles can't be posted on the wall.";
export const SLUR_ERROR = "This can't go on the wall. Please say it another way.";

/** Why the fields can't go on the wall, or null. `words`: the admin's filter list (Settings → filterWords). */
export function markProblem(fields: string[], words: string[]): string | null {
  if (fields.some((f) => LINKS.some((re) => re.test(f)))) return LINK_ERROR;
  const re = listed(words);
  if (fields.some((f) => re.test(plain(f)))) return SLUR_ERROR;
  return null;
}
