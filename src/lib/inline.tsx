import { Fragment, type ReactNode } from "react";

/**
 * Text from the admin panel may mark bold runs with **double asterisks**;
 * this turns them into <strong>.
 */
export function inline(text: string, strongClass = "font-bold"): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className={strongClass}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** As `inline`, and each line break typed in the admin starts a new line. */
export function inlineLines(text: string, strongClass = "font-bold"): ReactNode {
  return text
    .replace(/\r\n?/g, "\n")
    .trim()
    .split("\n")
    .map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {inline(line, strongClass)}
      </Fragment>
    ));
}
