import { lyricWords, type Lyric } from "@/lib/content/types";

/* The karaoke of the Listening Room, also previewed in the admin. */

/** Index of the line being sung at `time` (-1 before the first one). */
export const lineAt = (lines: Lyric[], time: number) => lines.findLastIndex((line) => time >= line.time);

/** Seconds a sung letter takes, roughly, where the timing doesn't say. */
const SECONDS_PER_LETTER = 0.1;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * How many letters of `line` have been sung at `time` (fractional). With
 * word times each word lights up from its own start; with an end time the
 * line is spread over the time the voice takes; otherwise it goes at a
 * singing pace. It is always done before the next line starts.
 */
export function sungLetters(line: Lyric, next: number | undefined, time: number) {
  const words = lyricWords(line.text).map((w) => [...w].length);
  const total = words.reduce((a, b) => a + b, 0);
  const until = line.end ?? next ?? Infinity;
  if (line.words?.length === words.length) {
    const k = line.words.findLastIndex((t) => time >= t);
    if (k < 0) return 0;
    const start = line.words[k];
    const gap = (line.words[k + 1] ?? until) - start;
    const length = Math.min(gap, words[k] * SECONDS_PER_LETTER * 1.5 + 0.1);
    return words.slice(0, k).reduce((a, b) => a + b, 0) + words[k] * clamp01((time - start) / length);
  }
  const length = line.end
    ? line.end - line.time
    : Math.min(total * SECONDS_PER_LETTER + 0.4, next === undefined ? Infinity : (next - line.time) * 0.9);
  return total * clamp01((time - line.time) / length);
}

/** The line's letters: sung ones lit, the rest waiting (see .room-letter). */
export function KaraokeLetters({ text, sung }: { text: string; sung: number }) {
  let index = 0;
  return (
    <span aria-hidden>
      {text.split(/(\s+)/).map((word, w) =>
        /^\s*$/.test(word) ? (
          word
        ) : (
          // A word never breaks across lines.
          <span key={w} className="whitespace-nowrap">
            {[...word].map((letter, l) => (
              <span key={l} className={`room-letter${index++ < sung ? " is-sung" : ""}`}>
                {letter}
              </span>
            ))}
          </span>
        ),
      )}
    </span>
  );
}
