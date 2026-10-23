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
