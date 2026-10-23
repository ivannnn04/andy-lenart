import { COLLAGES } from "@/lib/content/types";

/**
 * The admin editors are built from these descriptions: each field says what
 * kind of value lives under `key` and how to edit it.
 */
export type Field =
  | { kind: "text" | "textarea" | "number" | "email"; key: string; label: string; help?: string; placeholder?: string }
  | { kind: "checkbox"; key: string; label: string; help?: string }
  | { kind: "select"; key: string; label: string; help?: string; options: { value: string; label: string }[] }
  /** string[], one per line */
  | { kind: "lines"; key: string; label: string; help?: string; rows?: number }
  /** { src, alt, width, height } */
  | { kind: "image"; key: string; label: string; help?: string; optional?: boolean }
  /** a URL to an audio file */
  | { kind: "audio"; key: string; label: string; help?: string }
  /** { src, duration, waveform } — the 30-second clip */
  | { kind: "preview"; key: string; label: string; help?: string; waveform?: boolean }
  /** [{ time, text }], played against the track under `trackKey` */
  | { kind: "lyrics"; key: string; label: string; help?: string; trackKey: string }
  | { kind: "group"; key: string; label: string; help?: string; fields: Field[] }
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

const bold = "Use **double asterisks** for bold.";

const image = (key: string, label: string, help?: string, optional?: boolean): Field => ({
  kind: "image",
  key,
  label,
  help,
  optional,
});

export const SCHEMAS = {
  settings: [
    { kind: "text", key: "siteTitle", label: "Site title", help: "Shown in the browser tab and search results." },
    { kind: "textarea", key: "siteDescription", label: "Site description", help: "For search results and link previews." },
    { kind: "email", key: "contactEmail", label: "Contact email", help: "Shown at the bottom of the home page." },
    {
      kind: "list",
      key: "nav",
      label: "Navigation",
      help: "Menu on every page. Links: /#section, /page or https://…",
      titleKey: "label",
      blank: { label: "New link", href: "/" },
      fields: [
        { kind: "text", key: "label", label: "Label" },
        { kind: "text", key: "href", label: "Link" },
      ],
    },
  ],
  home: [
    { kind: "lines", key: "heroLines", label: "Hero text", help: "One line per line, as it breaks on the page.", rows: 2 },
    { kind: "text", key: "heroTagline", label: "Hero tagline (bold)" },
    { kind: "lines", key: "manifesto", label: "Manifesto quote", help: "Each line starts a new line on desktop.", rows: 4 },
    {
      kind: "group",
      key: "owners",
      label: "For owners",
      fields: [
        { kind: "text", key: "label", label: "Small label" },
        { kind: "text", key: "title", label: "Heading" },
        {
          kind: "list",
          key: "steps",
          label: "Steps",
          titleKey: "title",
          blank: { title: "New step", body: "" },
          fields: [
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "body", label: "Text", help: bold },
          ],
        },
        { kind: "text", key: "statement", label: "Statement" },
        { kind: "text", key: "statementBold", label: "Statement, bold line" },
      ],
    },
    {
      kind: "group",
      key: "stayConnected",
      label: "Stay connected",
      fields: [
        { kind: "text", key: "title", label: "Heading" },
        { kind: "textarea", key: "subtitle", label: "Text" },
      ],
    },
  ],
  garment: {
    tabs: [
      {
        label: "Card",
        fields: [
          { kind: "text", key: "slug", label: "Address", help: "Used for both /collection/<address> and /room/<address>. Don’t change it once the NFC tags are written." },
          { kind: "text", key: "no", label: "Number", placeholder: "01" },
          { kind: "lines", key: "titleLines", label: "Title", help: "One line per line, as it breaks on the page and in the room.", rows: 2 },
          { kind: "checkbox", key: "hidden", label: "Hidden from the home page" },
          { kind: "text", key: "cardTitle", label: "Card title", help: "Optional, when the card shows a different title (e.g. with a translation)." },
          { kind: "textarea", key: "tagline", label: "Card text / tagline", help: "Under the card’s title, and the tagline on the garment page." },
          { kind: "text", key: "status", label: "Status line", placeholder: "Coming soon" },
          { kind: "text", key: "statusHref", label: "Status link", help: "Optional, e.g. #stay-connected." },
          { kind: "text", key: "price", label: "Price", placeholder: "£1,500", help: "Shown on the card and the page; leave empty to hide." },
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
          { kind: "text", key: "availability", label: "Availability", placeholder: "Limited edition · 12 remaining" },
          { kind: "text", key: "remaining", label: "Stock line in the request drawer", placeholder: "12 remaining" },
          { kind: "text", key: "size", label: "Size", placeholder: "One size" },
          {
            kind: "list",
            key: "gallery",
            label: "Gallery",
            titleKey: "alt",
            blank: { alt: "", width: 1253, height: 1875 },
            fields: [image("", "Photo")],
          },
          { kind: "number", key: "requestPhoto", label: "Photo beside the request form", help: "Its position in the gallery, from 0." },
          {
            kind: "list",
            key: "details",
            label: "Details (accordion)",
            titleKey: "title",
            blank: { title: "New section", body: "" },
            fields: [
              { kind: "text", key: "title", label: "Title" },
              { kind: "textarea", key: "body", label: "Text", help: "Empty shows “Details coming soon”." },
            ],
          },
          {
            kind: "group",
            key: "concept",
            label: "The concept",
            fields: [
              { kind: "lines", key: "paragraphs", label: "Paragraphs", help: `One paragraph per line. ${bold}`, rows: 6 },
              image("image", "Photo"),
              { kind: "text", key: "quote", label: "Quote" },
            ],
          },
          {
            kind: "list",
            key: "credits",
            label: "Music credits",
            titleKey: "name",
            blank: { name: "", role: "" },
            fields: [
              { kind: "text", key: "name", label: "Name" },
              { kind: "text", key: "role", label: "Role" },
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
          { kind: "lines", key: "verse", label: "Printed verse", help: "Fixed text in the collage (the first room’s design only).", rows: 4 },
        ],
      },
    ],
  },
} satisfies Record<string, Schema>;

export type SchemaName = keyof typeof SCHEMAS;
