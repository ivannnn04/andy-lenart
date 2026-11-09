import blocklist from "./blocklist.json";

/**
 * Checks for a mark on the Staircase, so the wall stays an open space for
 * unfiltered thoughts: ordinary swearing and raw opinions pass, while the
 * most severe slurs, links and handles do not. Anything else is left to
 * visitors' reports (see `reportMark`).
 */

/**
 * Spellings people use to get a slur past such lists: a vowel left out.
 * (Only where the shortened word is not an ordinary one.)
 */
const VOWELLESS = ["ngga", "nggr", "ngger", "nggers", "niggr", "ngr", "nigg", "fggt", "fgt", "fgot", "fagt", "faggt", "trnny", "chnk", "kyke"];

/** The built-in list, as the admin sees it. */
export const BUILT_IN_TERMS: string[] = [...blocklist.terms, ...VOWELLESS];

/** A term as a pattern: "x*" is one or more "x", a vowel may be a symbol ("n*gga"). */
const pattern = (term: string) =>
  term
    .replace(/[.+?^${}()|[\]\\-]/g, "\\$&")
    .replace(/\*/g, "+")
    .replace(/\\-| /g, "[\\s_-]*")
    .replace(/[aeiou]/g, "(?:$&|[*#%?!])");


/**
 * The slurs: dsojevic/profanity-list (MIT, see blocklist.LICENSE), cut down to
 * the slurs, plus the spellings above, plus what the admin adds (Settings),
 * less what the admin allows. Whole words only (with a plural "s"/"es"), so
 * words that merely contain one still pass.
 */
let cached: { key: string; re: RegExp } | undefined;
function slurs(block: string[], allow: string[]) {
  const key = JSON.stringify([block, allow]);
  if (cached?.key === key) return cached.re;
  const allowed = new Set(allow.map((w) => w.toLowerCase().trim()));
  const terms = [
    ...BUILT_IN_TERMS.filter((t) => !allowed.has(t) && !allowed.has(t.replace(/\*/g, ""))).map(pattern),
    // Read like the marks are: look-alikes as letters, then letters only.
    ...block.map((w) => plain(w).replace(/[^a-z\s-]/g, "").trim()).filter(Boolean).map(pattern),
  ];
  cached = { key, re: terms.length ? new RegExp(`(?<![a-z])(?:${terms.join("|")})(?:e?s)?(?![a-z])`) : /(?!)/ };
  return cached.re;
}

/** Look-alike digits and symbols read as letters, accents dropped. */
const LOOKALIKE: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "9": "g", "@": "a", $: "s" };
const plain = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[0134579@$]/g, (c) => LOOKALIKE[c])
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

/** Why the fields can't go on the wall, or null. `words`: the admin's additions and exceptions. */
export function markProblem(fields: string[], words: { block?: string[]; allow?: string[] } = {}): string | null {
  if (fields.some((f) => LINKS.some((re) => re.test(f)))) return LINK_ERROR;
  const re = slurs(words.block ?? [], words.allow ?? []);
  if (fields.some((f) => re.test(plain(f)))) return SLUR_ERROR;
  return null;
}
