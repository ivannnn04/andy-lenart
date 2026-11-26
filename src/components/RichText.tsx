import { Fragment, type ReactNode } from "react";
import { inline } from "@/lib/inline";

/** A list line: starts with "-", "–" or "•" (a space after it is optional). */
const LIST_ITEM = /^\s*[-–•]\s?(?=\S)/;

/**
 * A longer text from the admin panel, shown as it was typed:
 * - an empty line starts a new paragraph;
 * - a single line break starts a new line in the same paragraph;
 * - lines starting with "-" (or "–", "•") become a list;
 * - **double asterisks** make bold.
 */
export function RichText({
  text,
  className = "",
  gap = "0.9em",
  strongClass = "font-bold",
}: {
  text: string;
  className?: string;
  /** Space between paragraphs (and around lists). */
  gap?: string;
  strongClass?: string;
}) {
  const blocks = text
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n/)
    .map((b) => b.replace(/^\n+|\s+$/g, ""))
    .filter((b) => b.trim());

  const out: ReactNode[] = [];
  for (const block of blocks) {
    // A block can mix lines of text and list lines: each run is its own element.
    const runs: { list: boolean; lines: string[] }[] = [];
    for (const line of block.split("\n")) {
      const list = LIST_ITEM.test(line);
      const last = runs[runs.length - 1];
      if (last && last.list === list) last.lines.push(line);
      else runs.push({ list, lines: [line] });
    }
    for (const run of runs) {
      const style = out.length ? { marginTop: gap } : undefined;
      out.push(
        run.list ? (
          <ul key={out.length} style={{ ...style, listStyleType: '"– "' }} className="pl-[1.1em]">
            {run.lines.map((line, i) => (
              <li key={i}>{inline(line.replace(LIST_ITEM, ""), strongClass)}</li>
            ))}
          </ul>
        ) : (
          <p key={out.length} style={style}>
            {run.lines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(line.trim(), strongClass)}
              </Fragment>
            ))}
          </p>
        ),
      );
    }
  }
  return <div className={className}>{out}</div>;
}
