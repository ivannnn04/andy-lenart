"use client";

import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from "react";
import { parseBlocks, parseInline, safeHref, type InlineNode } from "@/lib/markup";

/**
 * A text field that edits like a word processor: select text and use the
 * buttons (or Ctrl/⌘+B, I, U) for bold, italic, underline, links and lists.
 * What it stores is the site's small text format (src/lib/markup.ts), so the
 * pages show exactly what was set here.
 *
 * mode "rich":   paragraphs (Enter), line breaks (Shift+Enter), lists, headings if allowed
 * mode "lines":  one entry per paragraph (Enter starts the next), styling inside lines
 * mode "inline": a single line with styling
 */
type Mode = "rich" | "lines" | "inline";

// --- Stored text → editor HTML --------------------------------------------------

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inlineHtml(text: string) {
  const render = (nodes: InlineNode[]): string =>
    nodes
      .map((n) => {
        if (n.t === "text") return escHtml(n.v);
        if (n.t === "a") return `<a href="${escHtml(n.href)}">${render(n.c)}</a>`;
        return `<${n.t}>${render(n.c)}</${n.t}>`;
      })
      .join("");
  return render(parseInline(text));
}

function toHtml(value: string | string[], mode: Mode, headings: boolean) {
  if (mode === "inline") return inlineHtml(String(value ?? ""));
  if (mode === "lines") return (Array.isArray(value) ? value : []).map((l) => `<p>${inlineHtml(l) || "<br>"}</p>`).join("");
  return parseBlocks(String(value ?? ""), { headings })
    .map((b) => {
      if (b.t === "h") return `<h2>${inlineHtml(b.v)}</h2>`;
      if (b.t === "p") return `<p>${b.lines.map(inlineHtml).join("<br>")}</p>`;
      return `<${b.t}>${b.items.map((i) => `<li>${inlineHtml(i)}</li>`).join("")}</${b.t}>`;
    })
    .join("");
}

// --- Editor HTML → stored text --------------------------------------------------

const BLOCK = new Set(["P", "DIV", "UL", "OL", "LI", "H1", "H2", "H3", "H4", "BLOCKQUOTE", "SECTION"]);

/** Plain characters that would otherwise read as marks. */
const escText = (s: string) =>
  s
    .replace(/ /g, " ")
    .replace(/([\\*_[\]])/g, "\\$1")
    .replace(/\+\+/g, "\\+\\+");

/** Marks hug the words: spaces stay outside them. */
function wrap(mark: string, inner: string) {
  const m = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m || !m[2]) return inner;
  return `${m[1]}${mark}${m[2]}${mark}${m[3]}`;
}

function inlineOf(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return escText(node.textContent ?? "");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const tag = el.tagName;
  if (tag === "BR") return "\n";
  let inner = [...el.childNodes].map(inlineOf).join("");
  if (BLOCK.has(tag)) inner = `\n${inner}\n`;
  const style = el.style;
  const href = tag === "A" ? (el.getAttribute("href") ?? "") : "";
  if (href && safeHref(href) && inner.trim()) inner = `[${inner.trim()}](${href.trim()})`;
  if (tag === "U" || /underline/.test(style.textDecoration || style.textDecorationLine)) inner = wrap("++", inner);
  if (tag === "I" || tag === "EM" || style.fontStyle === "italic") inner = wrap("_", inner);
  if (tag === "B" || tag === "STRONG" || /^(bold|bolder|[6-9]00)$/.test(style.fontWeight)) inner = wrap("**", inner);
  return inner;
}

type Out = { t: "p"; text: string } | { t: "ul" | "ol"; items: string[] } | { t: "h"; text: string };

function blocksOf(root: Node): Out[] {
  const out: Out[] = [];
  let loose = "";
  const flush = () => {
    if (loose.trim()) out.push({ t: "p", text: loose });
    loose = "";
  };
  for (const child of root.childNodes) {
    const el = child as HTMLElement;
    const tag = child.nodeType === Node.ELEMENT_NODE ? el.tagName : "";
    if (tag === "UL" || tag === "OL") {
      flush();
      const items = [...el.children]
        .filter((li) => li.tagName === "LI")
        .map((li) => inlineOf(li).replace(/\s*\n+\s*/g, " ").trim())
        .filter(Boolean);
      if (items.length) out.push({ t: tag === "UL" ? "ul" : "ol", items });
    } else if (tag && BLOCK.has(tag)) {
      flush();
      // Some browsers wrap blocks inside blocks.
      if ([...el.children].some((c) => BLOCK.has(c.tagName))) out.push(...blocksOf(el));
      else {
        const text = [...el.childNodes].map(inlineOf).join("");
        out.push(/^H[1-4]$/.test(tag) ? { t: "h", text: text.replace(/\s*\n+\s*/g, " ") } : { t: "p", text });
      }
    } else loose += inlineOf(child);
  }
  flush();
  return out;
}

/** Tidies one paragraph's lines (line breaks kept, empty ones dropped at the ends). */
const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.replace(/\s+$/, "").replace(/^\s+/, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "")
    .replace(/\n{2,}/g, "\n");

function fromEditor(root: HTMLElement, mode: Mode, headings: boolean): string | string[] {
  if (mode === "inline") return inlineOf(root).replace(/\s*\n+\s*/g, " ").trim();
  const blocks = blocksOf(root);
  if (mode === "lines")
    return blocks
      .flatMap((b) => (b.t === "p" || b.t === "h" ? [b.text.replace(/\s*\n+\s*/g, " ")] : b.items))
      .map((l) => l.trim())
      .filter(Boolean);
  return blocks
    .map((b) => {
      if (b.t === "ul") return b.items.map((i) => `- ${i}`).join("\n");
      if (b.t === "ol") return b.items.map((i, k) => `${k + 1}. ${i}`).join("\n");
      if (b.t === "h") return headings ? `## ${b.text.trim()}` : b.text.trim();
      if (b.t === "p") return lines(b.text);
      return "";
    })
    .filter((b) => b.trim())
    .join("\n\n");
}

// --- The editor ------------------------------------------------------------------

type Command = "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList";

const run = (command: string, arg?: string) => document.execCommand(command, false, arg);

function Button({
  label,
  title,
  active,
  onClick,
  children,
}: {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      aria-pressed={active}
      // Keeps the selection in the text while the button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-[13px] text-ink transition-colors hover:bg-[#ebebe7] ${
        active ? "bg-[#e1e1dc]" : ""
      }`}
    >
      {children}
    </button>
  );
}

export function RichEditor({
  id,
  value,
  mode,
  headings = false,
  rows = 3,
  placeholder,
  onChange,
  labelledBy,
}: {
  id?: string;
  value: string | string[];
  mode: Mode;
  headings?: boolean;
  rows?: number;
  placeholder?: string;
  onChange: (v: string | string[]) => void;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const emitted = useRef<string | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [empty, setEmpty] = useState(true);
  const editorId = useId();
  const key = JSON.stringify(value ?? "");

  // Shows the stored text, unless it is what this editor just wrote (keeps the caret).
  useEffect(() => {
    const el = ref.current;
    if (!el || emitted.current === key) return;
    el.innerHTML = toHtml(value, mode, headings);
    emitted.current = key;
    setEmpty(!el.textContent?.trim());
  }, [key, value, mode, headings]);

  // Which buttons are on, as the caret moves.
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      const sel = document.getSelection();
      if (!el || !sel?.anchorNode || !el.contains(sel.anchorNode)) return;
      const state: Record<string, boolean> = {};
      for (const c of ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList"] as Command[]) {
        try {
          state[c] = document.queryCommandState(c);
        } catch {
          state[c] = false;
        }
      }
      let node: Node | null = sel.anchorNode;
      while (node && node !== el) {
        if (node.nodeName === "A") state.link = true;
        if (node.nodeName === "H2") state.heading = true;
        node = node.parentNode;
      }
      setActive(state);
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const save = () => {
    const el = ref.current;
    if (!el) return;
    const next = fromEditor(el, mode, headings);
    emitted.current = JSON.stringify(next);
    setEmpty(!el.textContent?.trim());
    onChange(next);
  };

  const apply = (command: string, arg?: string) => {
    ref.current?.focus();
    run(command, arg);
    save();
  };

  const link = () => {
    if (active.link) return apply("unlink");
    const href = prompt("Link address — https://…, mailto:name@example.com or a page of the site such as /privacy");
    if (!href) return;
    if (!safeHref(href)) return alert("Use an address starting with https://, http://, mailto: or /");
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed) {
      ref.current?.focus();
      run("insertHTML", `<a href="${escHtml(href)}">${escHtml(href)}</a>`);
      save();
    } else apply("createLink", href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && !e.shiftKey && ["b", "i", "u"].includes(e.key.toLowerCase())) {
      e.preventDefault();
      apply({ b: "bold", i: "italic", u: "underline" }[e.key.toLowerCase()] as string);
      return;
    }
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      link();
      return;
    }
    if (e.key === "Enter" && mode === "inline") e.preventDefault();
    // In a list of lines every Enter starts the next line.
    if (e.key === "Enter" && e.shiftKey && mode === "lines") {
      e.preventDefault();
      run("insertParagraph");
    }
  };

  // Pasted text comes in as plain text (no fonts or colours from elsewhere).
  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    let text = e.clipboardData.getData("text/plain");
    if (mode === "inline") text = text.replace(/\s*\n+\s*/g, " ");
    run("insertText", text);
    save();
  };

  const minHeight = mode === "inline" ? undefined : `${Math.min(12, Math.max(2, rows)) * 1.55 + 1.1}em`;

  return (
    <div className="rich-editor-wrap overflow-hidden rounded-md border border-[#d4d4d0] bg-white transition-colors focus-within:border-ink focus-within:ring-2 focus-within:ring-black/10">
      <div role="toolbar" aria-label="Text formatting" aria-controls={id ?? editorId} className="flex flex-wrap items-center gap-0.5 border-b border-[#ecece8] bg-[#fafaf8] px-1.5 py-1">
        <Button label="Bold" title="Bold (Ctrl/⌘+B)" active={active.bold} onClick={() => apply("bold")}>
          <b>B</b>
        </Button>
        <Button label="Italic" title="Italic (Ctrl/⌘+I)" active={active.italic} onClick={() => apply("italic")}>
          <i className="font-serif">I</i>
        </Button>
        <Button label="Underline" title="Underline (Ctrl/⌘+U)" active={active.underline} onClick={() => apply("underline")}>
          <u>U</u>
        </Button>
        <span aria-hidden className="mx-1 h-4 w-px bg-[#dcdcd8]" />
        <Button label={active.link ? "Remove link" : "Link"} title={active.link ? "Remove the link" : "Make the selected text a link (Ctrl/⌘+K)"} active={active.link} onClick={link}>
          <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 013.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 014.5 9l1-1" />
          </svg>
        </Button>
        {mode === "rich" && (
          <>
            <span aria-hidden className="mx-1 h-4 w-px bg-[#dcdcd8]" />
            <Button label="Bullet list" title="Bullet list" active={active.insertUnorderedList} onClick={() => apply("insertUnorderedList")}>
              <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor">
                <circle cx="3" cy="4" r="1.2" />
                <circle cx="3" cy="8" r="1.2" />
                <circle cx="3" cy="12" r="1.2" />
                <rect x="6" y="3.3" width="8" height="1.4" rx=".7" />
                <rect x="6" y="7.3" width="8" height="1.4" rx=".7" />
                <rect x="6" y="11.3" width="8" height="1.4" rx=".7" />
              </svg>
            </Button>
            <Button label="Numbered list" title="Numbered list" active={active.insertOrderedList} onClick={() => apply("insertOrderedList")}>
              <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor">
                <text x="0.5" y="5.5" fontSize="5" fontFamily="sans-serif">1</text>
                <text x="0.5" y="9.5" fontSize="5" fontFamily="sans-serif">2</text>
                <text x="0.5" y="13.5" fontSize="5" fontFamily="sans-serif">3</text>
                <rect x="6" y="3.3" width="8" height="1.4" rx=".7" />
                <rect x="6" y="7.3" width="8" height="1.4" rx=".7" />
                <rect x="6" y="11.3" width="8" height="1.4" rx=".7" />
              </svg>
            </Button>
            {headings && (
              <Button label="Heading" title="Heading" active={active.heading} onClick={() => apply("formatBlock", active.heading ? "<p>" : "<h2>")}>
                <span className="text-[12px] font-bold">H</span>
              </Button>
            )}
          </>
        )}
        <span aria-hidden className="mx-1 h-4 w-px bg-[#dcdcd8]" />
        <Button
          label="Clear formatting"
          title="Clear formatting of the selected text"
          onClick={() => {
            ref.current?.focus();
            run("removeFormat");
            run("unlink");
            save();
          }}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 3.5h8M8 3.5l-2.5 9M10.5 9.5l4 4m0-4l-4 4" />
          </svg>
        </Button>
        <Button label="Undo" title="Undo (Ctrl/⌘+Z)" onClick={() => apply("undo")}>
          <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5.5 4L2.5 7l3 3M3 7h6.5a4 4 0 010 8H8" />
          </svg>
        </Button>
        <Button label="Redo" title="Redo (Ctrl/⌘+Shift+Z)" onClick={() => apply("redo")}>
          <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.5 4l3 3-3 3M13 7H6.5a4 4 0 000 8H8" />
          </svg>
        </Button>
      </div>
      <div className="relative">
        {empty && placeholder && (
          <span aria-hidden className="pointer-events-none absolute top-2 left-3 text-[14px] text-[#999]">
            {placeholder}
          </span>
        )}
        <div
          id={id ?? editorId}
          ref={ref}
          role="textbox"
          aria-multiline={mode !== "inline"}
          aria-labelledby={labelledBy}
          contentEditable
          suppressContentEditableWarning
          spellCheck
          onFocus={() => {
            try {
              run("defaultParagraphSeparator", "p");
              run("styleWithCSS", "false");
            } catch {
              // Older browsers: their own defaults are handled when saving.
            }
          }}
          onInput={save}
          onBlur={save}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          className={`rich-editor px-3 py-2 text-[14px] leading-[1.55] text-ink outline-none ${mode === "inline" ? "whitespace-nowrap overflow-x-auto" : ""}`}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
