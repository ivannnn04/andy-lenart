/**
 * The small text format the admin's editor writes and the site reads. It is
 * stored as plain text, so the content stays readable and safe:
 *
 *   **bold**   _italic_   ++underline++   [link text](https://…)
 *   an empty line between paragraphs, a single line break inside one,
 *   "- item" bullet lists, "1. item" numbered lists, "## Heading".
 *
 * A backslash keeps a mark character as it is (\*, \_, \+, \[, \]).
 */

export type InlineNode =
  | { t: "text"; v: string }
  | { t: "b" | "i" | "u"; c: InlineNode[] }
  | { t: "a"; href: string; c: InlineNode[] };

export type Block =
  | { t: "p"; lines: string[] }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "h"; v: string };

const word = /[\p{L}\p{N}]/u;

/** Links may go to the web, an email address, or a page of this site. */
export const safeHref = (href: string) => /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href.trim());

function closing(s: string, mark: string, from: number) {
  for (let j = from; j < s.length; j++) {
    if (s[j] === "\\") {
      j++;
      continue;
    }
    if (s.startsWith(mark, j)) {
      // Italic closes only at the end of a word (so "snake_case" stays as it is).
      if (mark === "_" && (word.test(s[j + 1] ?? "") || !s[j - 1]?.trim())) continue;
      return j;
    }
  }
  return -1;
}

export function parseInline(s: string): InlineNode[] {
  const out: InlineNode[] = [];
  let text = "";
  const flush = () => {
    if (text) out.push({ t: "text", v: text });
    text = "";
  };
  for (let i = 0; i < s.length; ) {
    const c = s[i];
    if (c === "\\" && i + 1 < s.length && /[*_+[\]\\]/.test(s[i + 1])) {
      text += s[i + 1];
      i += 2;
      continue;
    }
    if (s.startsWith("**", i) || s.startsWith("++", i)) {
      const mark = s.slice(i, i + 2);
      const j = closing(s, mark, i + 2);
      if (j > i + 2) {
        flush();
        out.push({ t: mark === "**" ? "b" : "u", c: parseInline(s.slice(i + 2, j)) });
        i = j + 2;
        continue;
      }
    }
    // Italic opens at the start of a word.
    if (c === "_" && !word.test(s[i - 1] ?? "") && s[i + 1]?.trim()) {
      const j = closing(s, "_", i + 1);
      if (j > i + 1) {
        flush();
        out.push({ t: "i", c: parseInline(s.slice(i + 1, j)) });
        i = j + 1;
        continue;
      }
    }
    if (c === "[") {
      const m = s.slice(i).match(/^\[((?:\\.|[^\]\\])+)\]\(([^)\s]+)\)/);
      if (m && safeHref(m[2])) {
        flush();
        out.push({ t: "a", href: m[2], c: parseInline(m[1]) });
        i += m[0].length;
        continue;
      }
    }
    text += c;
    i++;
  }
  flush();
  return out;
}

/** The text with its marks taken out (tab titles, screen-reader labels, word counts). */
export function plainText(s: string): string {
  const walk = (nodes: InlineNode[]): string => nodes.map((n) => (n.t === "text" ? n.v : walk(n.c))).join("");
  return walk(parseInline(s));
}

const BULLET = /^\s*[-–•]\s?(?=\S)/;
const NUMBER = /^\s*\d+[.)]\s+(?=\S)/;
const HEADING = /^\s*#{2,3}\s+(?=\S)/;

/** Paragraphs, lists and (where wanted) headings of a longer text. */
export function parseBlocks(text: string, { headings = false } = {}): Block[] {
  const blocks: Block[] = [];
  const chunks = text
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n/)
    .filter((b) => b.trim());
  for (const chunk of chunks) {
    for (const raw of chunk.replace(/^\n+|\s+$/g, "").split("\n")) {
      const line = raw.replace(/\s+$/, "");
      const last = blocks[blocks.length - 1];
      if (headings && HEADING.test(line)) blocks.push({ t: "h", v: line.replace(HEADING, "") });
      else if (BULLET.test(line)) {
        if (last?.t === "ul" && last.items) last.items.push(line.replace(BULLET, ""));
        else blocks.push({ t: "ul", items: [line.replace(BULLET, "")] });
      } else if (NUMBER.test(line)) {
        if (last?.t === "ol") last.items.push(line.replace(NUMBER, ""));
        else blocks.push({ t: "ol", items: [line.replace(NUMBER, "")] });
      } else if (last?.t === "p" && !last.lines.includes("\u0000end")) last.lines.push(line.trim());
      else blocks.push({ t: "p", lines: [line.trim()] });
    }
    // The empty line ends the paragraph.
    const last = blocks[blocks.length - 1];
    if (last?.t === "p") last.lines.push("\u0000end");
  }
  for (const b of blocks) if (b.t === "p") b.lines = b.lines.filter((l) => l !== "\u0000end");
  return blocks.filter((b) => b.t !== "p" || b.lines.some((l) => l.trim()));
}
