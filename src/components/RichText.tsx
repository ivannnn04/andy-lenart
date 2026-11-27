import { Fragment } from "react";
import { inline } from "@/lib/inline";
import { parseBlocks } from "@/lib/markup";

/**
 * A longer text from the admin panel, shown as it was written in the editor:
 * paragraphs, line breaks, bullet and numbered lists, and bold, italic,
 * underline and links inside them (see src/lib/markup.ts).
 */
export function RichText({
  text,
  className = "",
  gap = "0.9em",
  strongClass = "font-bold",
  headings = false,
  headingClass = "font-bold",
}: {
  text: string;
  className?: string;
  /** Space between paragraphs, lists and headings. */
  gap?: string;
  strongClass?: string;
  /** Whether "## " lines are headings (the privacy policy). */
  headings?: boolean;
  headingClass?: string;
}) {
  return (
    <div className={className}>
      {parseBlocks(text, { headings }).map((block, i) => {
        const style = i ? { marginTop: gap } : undefined;
        if (block.t === "h")
          return (
            <h2 key={i} style={style} className={headingClass}>
              {inline(block.v, strongClass)}
            </h2>
          );
        if (block.t !== "p") {
          const List = block.t;
          return (
            <List key={i} style={{ ...style, listStyleType: block.t === "ul" ? '"– "' : "decimal" }} className="pl-[1.2em]">
              {block.items.map((item, j) => (
                <li key={j}>{inline(item, strongClass)}</li>
              ))}
            </List>
          );
        }
        return (
          <p key={i} style={style}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(line, strongClass)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
