import { Fragment, type ReactNode } from "react";
import { parseInline, plainText as plain, type InlineNode } from "@/lib/markup";

/**
 * Text from the admin panel with its marks shown: **bold**, _italic_,
 * ++underline++ and [links](https://…) (see src/lib/markup.ts).
 * `links: false` where the text already sits inside a link.
 */
export function inline(text: string, strongClass = "font-bold", { links = true }: { links?: boolean } = {}): ReactNode {
  const render = (nodes: InlineNode[]): ReactNode =>
    nodes.map((n, i) => {
      if (n.t === "text") return <Fragment key={i}>{n.v}</Fragment>;
      if (n.t === "b")
        return (
          <strong key={i} className={strongClass}>
            {render(n.c)}
          </strong>
        );
      if (n.t === "i") return <em key={i}>{render(n.c)}</em>;
      if (n.t !== "a")
        return (
          <span key={i} className="underline underline-offset-[0.15em]">
            {render(n.c)}
          </span>
        );
      if (!links) return <Fragment key={i}>{render(n.c)}</Fragment>;
      const external = /^https?:\/\//i.test(n.href);
      return (
        <a
          key={i}
          href={n.href}
          className="underline underline-offset-2 transition-opacity hover:opacity-60"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {render(n.c)}
        </a>
      );
    });
  return render(parseInline(text));
}

/** The text without its marks, for places that only take plain text (tab titles, labels for screen readers). */
export const plainText = plain;

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
