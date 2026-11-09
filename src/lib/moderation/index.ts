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

/**
 * The slurs: dsojevic/profanity-list (MIT, see blocklist.LICENSE), cut down to
 * the slurs, plus the spellings above. In a term, "x*" means one or more "x";
 * a vowel may also be written as a symbol ("n*gga"). Whole words only (with a
 * plural "s"/"es"), so words that merely contain one still pass.
 */
const SLURS = new RegExp(
  `(?<![a-z])(?:${[...blocklist.terms, ...VOWELLESS]
    .map((term) =>
      term
        .replace(/[.+?^${}()|[\]\\-]/g, "\\$&")
        .replace(/\*/g, "+")
        .replace(/\\-| /g, "[\\s_-]*")
        .replace(/[aeiou]/g, "(?:$&|[*#%?!])"),
    )
    .join("|")})(?:e?s)?(?![a-z])`,
);

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

/** Why the fields can't go on the wall, or null. */
export function markProblem(...fields: string[]): string | null {
  if (fields.some((f) => LINKS.some((re) => re.test(f)))) return LINK_ERROR;
  if (fields.some((f) => SLURS.test(plain(f)))) return SLUR_ERROR;
  return null;
}
