import { COLLAGES } from "@/lib/content/types";

/**
 * The admin editors are built from these descriptions: each field says what
 * kind of value lives under `key` and how to edit it.
 */
export type Field =
  /**
   * `format`: "inline" gives a text field the formatting toolbar (titles,
   * labels); "plain" keeps a textarea as plain text. Textareas have the full
   * editor (paragraphs, lists) unless plain; `headings` adds a heading button.
   */
  | {
      kind: "text" | "textarea" | "number" | "email";
      key: string;
      label: string;
      help?: string;
      placeholder?: string;
      rows?: number;
      format?: "plain" | "inline";
      headings?: boolean;
    }
  | { kind: "checkbox"; key: string; label: string; help?: string }
  | { kind: "select"; key: string; label: string; help?: string; options: { value: string; label: string }[] }
  /** string[], one per line */
  | { kind: "lines"; key: string; label: string; help?: string; rows?: number; maxRows?: number; format?: "plain" }
  /** { src, alt, width, height } */
  | { kind: "image"; key: string; label: string; help?: string; optional?: boolean }
  /** a URL to an audio file */
  | { kind: "audio"; key: string; label: string; help?: string }
  /** { src, duration, waveform } — the 30-second clip */
  | { kind: "preview"; key: string; label: string; help?: string; waveform?: boolean }
  /** [{ time, text }], played against the track under `trackKey` */
  | { kind: "lyrics"; key: string; label: string; help?: string; trackKey: string }
  | { kind: "group"; key: string; label: string; help?: string; fields: Field[] }
  /**
   * [{ src, alt, width, height }] shown as a grid: add many at once, drag to
   * reorder, replace, remove. `requestKey` names the sibling number that picks
   * the photo beside the request form (kept on the same photo when reordering).
   */
  | { kind: "gallery"; key: string; label: string; help?: string; requestKey?: string }
  | {
      kind: "list";
      key: string;
      label: string;
      help?: string;
      fields: Field[];
      /** Key whose value titles each item in the list. */
      titleKey?: string;
      /** Key of a boolean that hides the item on the site; adds an on/off switch to each row. */
      hiddenKey?: string;
      blank: Record<string, unknown>;
    };

/** A plain list of fields, or tabs (each optionally scoped to a key of the document). */
export type Schema = Field[] | { tabs: { label: string; key?: string; fields: Field[] }[] };

/** Formatting is done with the editor's toolbar; nothing to explain in the help texts any more. */
const bold = "";
const rich = "Enter starts a new paragraph, Shift+Enter a new line.";
const lineBreaks = "Shift+Enter starts a new line.";

const image = (key: string, label: string, help?: string, optional?: boolean): Field => ({
  kind: "image",
  key,
  label,
  help,
  optional,
});

export const SCHEMAS = {
  staircase: [
    {
      kind: "number",
      key: "markReports",
      label: "Reports that hide a mark",
      help: "A mark reported by this many visitors leaves the wall and waits at the top of the list below for you to restore or delete it (1–20).",
    },
    {
      kind: "lines",
      key: "filterWords",
      format: "plain",
      label: "Blocked words",
      maxRows: 16,
      help: "A mark with any of these as a whole word can't be posted; plurals and spellings like “n*me”, “n4me”, “n.a.m.e” are caught too. One word or phrase per line; “x*” means one or more “x”. Delete a line to allow that word. Starts with slurs on race, sexuality, gender and religion (dsojevic/profanity-list); ordinary swearing is not on it. Marks already on the wall stay.",
      rows: 8,
    },
  ],
  settings: [
    { kind: "text", key: "siteTitle", label: "Site title", help: "Shown in the browser tab and search results." },
    { kind: "textarea", key: "siteDescription", label: "Site description", help: "For search results and link previews.", format: "plain" },
    { kind: "email", key: "contactEmail", label: "Contact email", help: "Shown at the bottom of the home page." },
    {
      kind: "number",
      key: "roomAttempts",
      label: "Listening Room: wrong words allowed before it locks",
      help: "After this many wrong entry words in a row the room locks for the minutes below. 0 never locks (up to 20).",
    },
    {
      kind: "number",
      key: "roomLockMinutes",
      label: "Listening Room: lock time, minutes",
      help: "How long the room stays locked after that (1–60).",
    },
    {
      kind: "number",
      key: "roomHourlyTries",
      label: "Listening Room: most tries per hour from one visitor",
      help: "A cap that holds even when the lock is off; after it the room stays locked for the rest of the hour (5–200).",
    },
    {
      kind: "list",
      key: "nav",
      label: "Navigation",
      help: "Menu on every page. Links: /#section, /page or https://…",
      titleKey: "label",
      blank: { label: "New link", href: "/" },
      fields: [
        { kind: "text", key: "label", label: "Label", format: "inline" },
        { kind: "text", key: "href", label: "Link" },
      ],
    },
  ],
  home: [
    { kind: "lines", key: "heroLines", label: "Hero text", help: "One line per line, as it breaks on the page.", rows: 2 },
    { kind: "text", key: "heroTagline", label: "Hero tagline (bold)", format: "inline" },
    {
      kind: "group",
      key: "preloader",
      label: "Opening screen",
      help: "Shown each time the home page is opened or reloaded. With a track it stays until the visitor picks Sound on or off.",
      fields: [
        { kind: "lines", key: "lines", label: "Text", help: "One line per line (up to 4).", rows: 2 },
        {
          kind: "audio",
          key: "track",
          label: "Background track",
          help: "Plays when the visitor picks “Sound on”, and keeps playing on the home page until they turn it off. Empty hides “Sound on / off”.",
        },
      ],
    },
    { kind: "lines", key: "manifesto", label: "Manifesto quote", help: "Each line starts a new line on desktop.", rows: 4 },
    {
      kind: "group",
      key: "owners",
      label: "For owners",
      fields: [
        { kind: "text", key: "label", label: "Small label", format: "inline" },
        { kind: "text", key: "title", label: "Heading", format: "inline" },
        {
          kind: "list",
          key: "steps",
          label: "Steps",
          titleKey: "title",
          blank: { title: "New step", body: "" },
          fields: [
            { kind: "text", key: "title", label: "Title", format: "inline" },
            { kind: "textarea", key: "body", label: "Text", help: lineBreaks },
          ],
        },
        { kind: "text", key: "statement", label: "Statement", format: "inline" },
        { kind: "text", key: "statementBold", label: "Statement, bold line", format: "inline" },
      ],
    },
    {
      kind: "group",
      key: "stayConnected",
      label: "Stay connected",
      fields: [
        { kind: "text", key: "title", label: "Heading", format: "inline" },
        { kind: "textarea", key: "subtitle", label: "Text", help: lineBreaks },
      ],
    },
  ],
  privacy: [
    { kind: "text", key: "title", label: "Title", format: "inline" },
    { kind: "text", key: "updated", label: "Last updated", placeholder: "1 December 2026", format: "inline" },
    {
      kind: "textarea",
      key: "body",
      label: "Text",
      headings: true,
      rows: 30,
      help: "Enter starts a new paragraph, Shift+Enter a new line; the H button makes a heading. Email addresses become links.",
    },
  ],
  garment: {
    tabs: [
      {
        label: "Card",
        fields: [
          { kind: "text", key: "slug", label: "Address", help: "Used for both /collection/<address> and /room/<address>. Don’t change it once the NFC tags are written." },
          { kind: "text", key: "no", label: "Number", placeholder: "01" },
          { kind: "lines", key: "titleLines", label: "Title", help: `One line per line, as it breaks on the page and in the room. ${bold}`, rows: 2 },
          { kind: "checkbox", key: "hidden", label: "Hidden from the home page" },
          { kind: "text", key: "cardTitle", format: "inline", label: "Card title", help: "Optional, when the card shows a different title (e.g. with a translation)." },
          { kind: "textarea", key: "tagline", label: "Card text / tagline", help: `Under the card’s title, and the tagline on the garment page. ${lineBreaks}` },
          { kind: "text", key: "status", label: "Status line", placeholder: "Coming soon", format: "inline" },
          { kind: "text", key: "statusHref", label: "Status link", help: "Optional, e.g. #stay-connected." },
          { kind: "text", key: "price", format: "inline", label: "Price", placeholder: "£1,500", help: "Shown on the card and the page; leave empty to hide." },
          { kind: "preview", key: "preview", label: "30-second preview", waveform: true },
          image("cardImage", "Card photo", "Leave empty for the numbered placeholder.", true),
          { kind: "number", key: "titleSize", label: "Card title size (px)", help: "Optional; default 22." },
          { kind: "checkbox", key: "dimmed", label: "Card shown faded (a later chapter)" },
        ],
      },
      {
        label: "Garment page",
        fields: [
          { kind: "checkbox", key: "page", label: "Page published", help: "On: the page at /collection/<address> is live and the card links to it." },
          { kind: "text", key: "availability", label: "Availability", placeholder: "Limited edition · 12 remaining", format: "inline" },
          { kind: "text", key: "remaining", label: "Stock line in the request drawer", placeholder: "12 remaining", format: "inline" },
          { kind: "text", key: "size", label: "Size", placeholder: "One size", format: "inline" },
          {
            kind: "gallery",
            key: "gallery",
            label: "Photos",
            help: "The first photo is the main one on the page. Add several at once (button or drop files here), drag to change the order, click a photo to replace it or edit its description.",
            requestKey: "requestPhoto",
          },
          {
            kind: "list",
            key: "details",
            label: "Details (accordion)",
            titleKey: "title",
            blank: { title: "New section", body: "" },
            fields: [
              { kind: "text", key: "title", label: "Title" },
              { kind: "textarea", key: "body", label: "Text", help: `${rich} Empty shows “Details coming soon”.`, rows: 8 },
            ],
          },
          {
            kind: "group",
            key: "concept",
            label: "The concept",
            fields: [
              { kind: "lines", key: "paragraphs", label: "Paragraphs", help: `One paragraph per line. ${bold}`, rows: 6 },
              image("image", "Photo"),
              { kind: "text", key: "quote", label: "Quote", format: "inline" },
            ],
          },
          {
            kind: "list",
            key: "credits",
            label: "Music credits",
            titleKey: "name",
            blank: { name: "", role: "" },
            fields: [
              { kind: "text", key: "name", label: "Name", format: "inline" },
              { kind: "text", key: "role", label: "Role", format: "inline" },
            ],
          },
          {
            kind: "group",
            key: "inside",
            label: "Inside this garment",
            fields: [
              { kind: "lines", key: "title", label: "Heading", rows: 2 },
              { kind: "lines", key: "paragraphs", label: "Paragraphs", help: `One paragraph per line. ${bold}`, rows: 4 },
              image("image", "Photo", "Empty shows the dark placeholder."),
            ],
          },
        ],
      },
      {
        label: "Listening Room",
        key: "room",
        fields: [
          { kind: "checkbox", key: "enabled", label: "Room open", help: "On: /room/<address> works — point the garment’s NFC tag there." },
          { kind: "text", key: "keyword", label: "Entry word", help: "What owners type to open the room. Case and punctuation don’t matter." },
          {
            kind: "group",
            key: "gate",
            label: "Entry page",
            help: "What the page before the room says. Empty a field to bring back the original text.",
            fields: [
              { kind: "textarea", key: "text", label: "Instruction", help: "Above the field, e.g. which word of the concept text to enter. A line break starts a new line.", rows: 2 },
              { kind: "text", key: "note", label: "Small line under it", format: "inline" },
              { kind: "textarea", key: "error", label: "After a wrong word", rows: 3 },
            ],
          },
          {
            kind: "select",
            key: "collage",
            label: "Collage",
            help: "The artwork of the room (hand-placed from Figma).",
            options: COLLAGES.map((c) => ({ value: c, label: c.replace(/-/g, " ") })),
          },
          image("photo", "Photo beside the entry form", "Desktop only.", true),
          { kind: "audio", key: "track", label: "Full track", help: "Plays when the tape is touched. AAC (.m4a) or MP3." },
          {
            kind: "lyrics",
            key: "lyrics",
            label: "Lyrics",
            trackKey: "track",
            help: "One line at a time, from the time it starts. Import an .lrc or .srt file, or edit here.",
          },
          { kind: "lines", key: "verse", label: "Printed verse", help: `Fixed text in the collage (the first room’s design only). One line each; on phones the fourth line sits lower, broken after its comma. ${bold}`, rows: 4 },
        ],
      },
    ],
  },
} satisfies Record<string, Schema>;

export type SchemaName = keyof typeof SCHEMAS;
