"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { KaraokeLetters, sungLetters } from "@/components/room/karaoke";
import { lyricWords, type Lyric } from "@/lib/content/types";
import { analyseAudio, formatTime, imageSize, parseLyrics, parseTime, uploadFile } from "./client-tools";
import type { Field } from "./schema";

type Obj = Record<string, unknown>;

export const input =
  "w-full rounded-md border border-[#d4d4d0] bg-white px-3 py-2 text-[14px] leading-[1.4] text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-black/10";
export const smallButton =
  "inline-flex items-center gap-1.5 rounded-md border border-[#d4d4d0] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-[#f0f0ec] disabled:opacity-50";
const labelText = "text-[13px] font-semibold text-ink";
const helpText = "text-[12px] leading-[1.45] text-[#777]";

const get = (value: Obj, key: string) => (key ? value?.[key] : value);
const set = (value: Obj, key: string, next: unknown): Obj =>
  key ? { ...value, [key]: next } : (next as Obj);

function Label({ field, htmlFor, children }: { field: Field; htmlFor?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={htmlFor} className={labelText}>
        {field.label}
      </label>
      {field.help && <p className={helpText}>{field.help}</p>}
      {children}
    </div>
  );
}

/** Edits `value` (an object) through the given fields. */
export function Fields({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <FieldEditor
          key={field.key || field.label}
          field={field}
          value={get(value, field.key)}
          parent={value}
          onChange={(next) => onChange(set(value, field.key, next))}
        />
      ))}
    </div>
  );
}

function FieldEditor({
  field,
  value,
  parent,
  onChange,
}: {
  field: Field;
  value: unknown;
  parent: Obj;
  onChange: (v: unknown) => void;
}) {
  const id = useId();
  switch (field.kind) {
    case "text":
    case "email":
    case "number":
      return (
        <div className="flex flex-col gap-1.5">
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            type={field.kind === "number" ? "number" : field.kind}
            value={value == null ? "" : String(value)}
            placeholder={field.placeholder}
            onChange={(e) =>
              onChange(field.kind === "number" ? (e.target.value === "" ? undefined : Number(e.target.value)) : e.target.value)
            }
            className={input}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="flex flex-col gap-1.5">
          <Label field={field} htmlFor={id} />
          <textarea
            id={id}
            rows={3}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`${input} resize-y`}
          />
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 size-4 accent-black"
          />
          <span className="flex flex-col gap-0.5">
            <span className={labelText}>{field.label}</span>
            {field.help && <span className={helpText}>{field.help}</span>}
          </span>
        </label>
      );
    case "select":
      return (
        <div className="flex flex-col gap-1.5">
          <Label field={field} htmlFor={id} />
          <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={input}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "lines":
      return (
        <div className="flex flex-col gap-1.5">
          <Label field={field} htmlFor={id} />
          <LinesInput id={id} rows={field.rows ?? 3} value={(value as string[]) ?? []} onChange={onChange} />
        </div>
      );
    case "image":
      return <ImageInput field={field} value={(value as Obj) ?? {}} onChange={onChange} />;
    case "audio":
      return (
        <div className="flex flex-col gap-1.5">
          <Label field={field} />
          <MediaInput accept="audio/*" value={String(value ?? "")} onChange={(src) => onChange(src || undefined)} />
          {typeof value === "string" && value && <audio controls preload="none" src={value} className="h-9 w-full" />}
        </div>
      );
    case "preview":
      return <PreviewInput field={field} value={(value as Obj) ?? {}} onChange={onChange} />;
    case "lyrics":
      return (
        <LyricsInput
          field={field}
          value={(value as Lyric[]) ?? []}
          track={String(parent?.[field.trackKey] ?? "")}
          onChange={onChange}
        />
      );
    case "group":
      return (
        <fieldset className="flex flex-col gap-4 rounded-lg border border-[#e4e4e0] bg-[#fbfbf9] p-4">
          <legend className="px-1 text-[13px] font-bold uppercase tracking-[0.08em] text-[#555]">{field.label}</legend>
          {field.help && <p className={helpText}>{field.help}</p>}
          <Fields fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} />
        </fieldset>
      );
    case "list":
      return <ListInput field={field} value={(value as Obj[]) ?? []} onChange={onChange} />;
  }
}

/** A textarea for a list of strings; keeps what is being typed (blank lines too) until it loses focus. */
function LinesInput({
  id,
  rows,
  value,
  onChange,
}: {
  id: string;
  rows: number;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <textarea
      id={id}
      rows={Math.max(rows, value.length)}
      value={draft ?? value.join("\n")}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
      onBlur={() => setDraft(null)}
      className={`${input} resize-y`}
    />
  );
}

function useUpload(onDone: (url: string, file: File) => void | Promise<void>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const start = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await onDone(await uploadFile(file), file);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, start };
}

function UploadButton({ accept, busy, onFile }: { accept: string; busy: boolean; onFile: (f?: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" disabled={busy} onClick={() => ref.current?.click()} className={smallButton}>
        {busy ? "Uploading…" : "Upload"}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}

function MediaInput({
  accept,
  value,
  onChange,
  onUploaded,
}: {
  accept: string;
  value: string;
  onChange: (src: string) => void;
  onUploaded?: (url: string, file: File) => void | Promise<void>;
}) {
  const upload = useUpload(async (url, file) => {
    onChange(url);
    await onUploaded?.(url, file);
  });
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          value={value}
          placeholder="/images/… or https://…"
          onChange={(e) => onChange(e.target.value)}
          className={`${input} font-mono text-[12px]`}
        />
        <UploadButton accept={accept} busy={upload.busy} onFile={upload.start} />
      </div>
      {upload.error && <p className="text-[12px] text-error">{upload.error}</p>}
    </div>
  );
}

function ImageInput({ field, value, onChange }: { field: Field; value: Obj; onChange: (v: unknown) => void }) {
  const src = String(value.src ?? "");
  const update = (patch: Obj) => onChange({ alt: "", width: 4, height: 5, ...value, ...patch });
  return (
    <div className="flex flex-col gap-2">
      <Label field={field} />
      <div className="flex gap-3">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e4e4e0] bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:12px_12px]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- any URL, preview only
            <img src={src} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[11px] text-[#999]">No image</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <MediaInput
            accept="image/*"
            value={src}
            onChange={(s) => update({ src: s || undefined })}
            onUploaded={async (url, file) => update({ src: url, ...(await imageSize(file).catch(() => ({}))) })}
          />
          <input
            value={String(value.alt ?? "")}
            placeholder="Description for screen readers (alt text)"
            onChange={(e) => update({ alt: e.target.value })}
            className={input}
          />
          <div className="flex items-center gap-2 text-[12px] text-[#777]">
            Size
            <input
              type="number"
              value={Number(value.width ?? 0)}
              onChange={(e) => update({ width: Number(e.target.value) })}
              className={`${input} w-24!`}
            />
            ×
            <input
              type="number"
              value={Number(value.height ?? 0)}
              onChange={(e) => update({ height: Number(e.target.value) })}
              className={`${input} w-24!`}
            />
            {"optional" in field && field.optional && src && (
              <button type="button" onClick={() => onChange(undefined)} className={smallButton}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewInput({ field, value, onChange }: { field: Field; value: Obj; onChange: (v: unknown) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wantsWave = field.kind === "preview" && field.waveform;
  const measure = async (source: File | string) => {
    setBusy(true);
    setError(null);
    try {
      const { duration, waveform } = await analyseAudio(source);
      return wantsWave ? { duration, waveform } : { duration };
    } catch {
      setError("Could not read this audio in the browser to measure it.");
      return {};
    } finally {
      setBusy(false);
    }
  };
  const src = String(value.src ?? "");
  const waveform = (value.waveform as number[]) ?? [];
  return (
    <div className="flex flex-col gap-2">
      <Label field={field} />
      <MediaInput
        accept="audio/*"
        value={src}
        onChange={(s) => onChange({ ...value, src: s || undefined })}
        onUploaded={async (url, file) => onChange({ ...value, src: url, ...(await measure(file)) })}
      />
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#777]">
        Shown duration
        <input
          value={String(value.duration ?? "0:30")}
          onChange={(e) => onChange({ ...value, duration: e.target.value })}
          className={`${input} w-20!`}
        />
        {src && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => onChange({ ...value, ...(await measure(src)) })}
            className={smallButton}
          >
            {busy ? "Measuring…" : wantsWave ? "Measure duration & waveform" : "Measure duration"}
          </button>
        )}
      </div>
      {error && <p className="text-[12px] text-error">{error}</p>}
      {src && <audio controls preload="none" src={src} className="h-9 w-full" />}
      {wantsWave && waveform.length > 0 && (
        <div aria-label="Waveform" className="flex h-[33px] items-center gap-[2px]">
          {waveform.map((h, i) => (
            <span key={i} className="w-[3px] rounded-full bg-ink" style={{ height: h }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListInput({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Obj[];
  onChange: (v: Obj[]) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setOpen(to);
  };
  return (
    <div className="flex flex-col gap-2">
      <Label field={field} />
      <ol className="flex flex-col gap-2">
        {value.map((item, i) => {
          const title = String((field.titleKey ? item?.[field.titleKey] : "") || `Item ${i + 1}`);
          const isOpen = open === i;
          const hidden = field.hiddenKey ? item?.[field.hiddenKey] === true : false;
          return (
            <li key={i} className={`rounded-lg border border-[#e4e4e0] ${hidden ? "bg-[#f3f3f0]" : "bg-white"}`}>
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left text-[13px] font-semibold"
                >
                  <span aria-hidden className={`text-[10px] transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    ▶
                  </span>
                  <span className="text-[#999]">{i + 1}.</span>
                  <span className={`truncate ${hidden ? "text-[#999] line-through" : ""}`}>{title}</span>
                  {hidden && <span className="shrink-0 rounded bg-[#e4e4e0] px-1.5 py-0.5 text-[11px] text-[#666]">Hidden</span>}
                </button>
                {field.hiddenKey && (
                  <Toggle
                    on={!hidden}
                    label={`${hidden ? "Show" : "Hide"} “${title}” on the site`}
                    onChange={(on) =>
                      onChange(value.map((x, j) => (j === i ? { ...x, [field.hiddenKey as string]: on ? undefined : true } : x)))
                    }
                  />
                )}
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className={smallButton} aria-label="Move up">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === value.length - 1}
                  className={smallButton}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove “${title}”?`)) {
                      onChange(value.filter((_, j) => j !== i));
                      setOpen(null);
                    }
                  }}
                  className={`${smallButton} text-error`}
                >
                  Remove
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-[#eee] p-4">
                  <Fields fields={field.fields} value={item ?? {}} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div>
        <button
          type="button"
          onClick={() => {
            onChange([...value, structuredClone(field.blank)]);
            setOpen(value.length);
          }}
          className={smallButton}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

/** The lyric lines with their start times, an importer and a player to check the timing. */
/** Where the word tapping is: the line and the word to tap next. `only`: stop after this line. */
type SyncAt = { line: number; word: number; only: boolean };

const seconds = (n: number) => Math.round(n * 100) / 100;

function LyricsInput({
  field,
  value,
  track,
  onChange,
}: {
  field: Field;
  value: Lyric[];
  track: string;
  onChange: (v: Lyric[]) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [now, setNow] = useState(0);
  const [shift, setShift] = useState("0");
  const [message, setMessage] = useState<string | null>(null);
  const [sync, setSync] = useState<SyncAt | null>(null);
  const history = useRef<{ value: Lyric[]; at: SyncAt }[]>([]);

  // Follows the player every frame while it plays, so the karaoke preview is smooth.
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    let frame = 0;
    const tick = () => {
      setNow(el.currentTime);
      if (!el.paused) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const show = () => setNow(el.currentTime);
    el.addEventListener("play", start);
    el.addEventListener("seeked", show);
    el.addEventListener("pause", show);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("play", start);
      el.removeEventListener("seeked", show);
      el.removeEventListener("pause", show);
    };
  }, [track]);

  const current = value.findLastIndex((l) => now >= l.time);
  const update = (i: number, patch: Partial<Lyric>) => onChange(value.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const sorted = (lines: Lyric[]) => [...lines].sort((a, b) => a.time - b.time);
  const hasWords = (l: Lyric) => l.words?.length === lyricWords(l.text).length;

  const importText = (text: string) => {
    const lines = parseLyrics(text);
    if (!lines.length) {
      setMessage("No timed lines found — use an .lrc or .srt file.");
      return;
    }
    if (value.length && !confirm(`Replace the ${value.length} lines here with ${lines.length} imported lines?`)) return;
    onChange(lines);
    setMessage(`Imported ${lines.length} lines. Stray “you” lines, *tags* and ♪ marks were left out.`);
  };

  const startSync = (line: number, only: boolean) => {
    const el = audio.current;
    if (!el || !value[line]) return;
    history.current = [];
    setMessage(null);
    setSync({ line, word: 0, only });
    el.currentTime = Math.max(0, value[line].time - 3);
    void el.play();
  };

  const stopSync = (note?: string) => {
    setSync(null);
    audio.current?.pause();
    if (note) setMessage(note);
  };

  /** Marks the start of the next word at the player's position. */
  const tap = () => {
    const el = audio.current;
    const line = sync && value[sync.line];
    if (!sync || !line || !el) return;
    const t = seconds(el.currentTime);
    history.current.push({ value, at: sync });
    const words = [...(sync.word ? (line.words ?? []).slice(0, sync.word) : []), t];
    const { end, ...rest } = line;
    const next: Lyric = { ...rest, words, ...(sync.word === 0 && { time: t }) };
    // An end before the last word no longer holds.
    if (end !== undefined && end > t) next.end = end;
    onChange(value.map((l, j) => (j === sync.line ? next : l)));
    if (sync.word + 1 < lyricWords(line.text).length) setSync({ ...sync, word: sync.word + 1 });
    else if (!sync.only && sync.line + 1 < value.length) setSync({ ...sync, line: sync.line + 1, word: 0 });
    else stopSync("Word times set — save to keep them.");
  };

  const undo = () => {
    const last = history.current.pop();
    if (!last) return;
    onChange(last.value);
    setSync(last.at);
    if (audio.current) audio.current.currentTime = Math.max(0, audio.current.currentTime - 2);
  };

  useEffect(() => {
    if (!sync) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space") {
        e.preventDefault();
        tap();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        undo();
      } else if (e.key === "Escape") stopSync();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const syncLine = sync ? value[sync.line] : undefined;

  return (
    <div className="flex flex-col gap-3">
      <Label field={field} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => file.current?.click()} className={smallButton}>
          Import .lrc / .srt
        </button>
        <input
          ref={file}
          type="file"
          accept=".lrc,.srt,.txt,text/plain"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) importText(await f.text());
          }}
        />
        {track && value.length > 0 && (
          <button type="button" onClick={() => startSync(Math.max(0, current), false)} className={smallButton}>
            ♪ Tap words from the highlighted line
          </button>
        )}
        <span className="ml-2 text-[12px] text-[#777]">Shift all by</span>
        <input value={shift} onChange={(e) => setShift(e.target.value)} className={`${input} w-20!`} aria-label="Seconds" />
        <span className="text-[12px] text-[#777]">s</span>
        <button
          type="button"
          onClick={() => {
            const by = Number(shift);
            const move = (t: number) => Math.max(0, seconds(t + by));
            if (Number.isFinite(by) && by)
              onChange(
                value.map((l) => ({
                  ...l,
                  time: move(l.time),
                  ...(l.end !== undefined && { end: move(l.end) }),
                  ...(l.words && { words: l.words.map(move) }),
                })),
              );
          }}
          className={smallButton}
        >
          Apply
        </button>
      </div>
      <p className={helpText}>
        For karaoke that follows the voice exactly, tap the words: the track plays and you press Space (or the Tap
        button) as each word starts. Backspace steps back, Esc stops. Lines with tapped words are marked ♪.
      </p>
      {message && <p className={helpText}>{message}</p>}
      {track ? (
        <div className="sticky top-2 z-10 flex flex-col gap-2 rounded-lg border border-[#e4e4e0] bg-white p-2 shadow-sm">
          <audio ref={audio} controls preload="metadata" src={track} className="h-9 w-full" />
          {sync && syncLine ? (
            <div className="flex flex-col items-center gap-2 rounded-md bg-[#fff6d6] p-3">
              <p className="text-center text-[15px] font-bold uppercase">
                {lyricWords(syncLine.text).map((w, i) => (
                  <span
                    key={i}
                    className={i < sync.word ? "text-ink" : i === sync.word ? "text-ink underline decoration-2 underline-offset-4" : "text-[#aaa]"}
                  >
                    {w}{" "}
                  </span>
                ))}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={tap}
                  className="rounded-md bg-ink px-6 py-2.5 text-[13px] font-semibold text-white"
                >
                  Tap “{lyricWords(syncLine.text)[sync.word]}” (Space)
                </button>
                <button type="button" onClick={undo} className={smallButton}>
                  Undo
                </button>
                <button type="button" onClick={() => stopSync()} className={smallButton}>
                  Stop
                </button>
              </div>
            </div>
          ) : (
            <p className="min-h-[1.4em] text-center text-[13px] font-bold uppercase">
              {current >= 0 && value[current] ? (
                <KaraokeLetters text={value[current].text} sung={sungLetters(value[current], value[current + 1]?.time, now)} />
              ) : (
                "…"
              )}
            </p>
          )}
        </div>
      ) : (
        <p className={helpText}>Add the full track above to play it against the lines.</p>
      )}
      <ol className="flex max-h-[520px] flex-col gap-1 overflow-y-auto rounded-lg border border-[#e4e4e0] bg-white p-2">
        {value.map((line, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 rounded-md px-1 py-0.5 ${
              sync?.line === i || (!sync && i === current) ? "bg-[#fff6d6]" : ""
            }`}
          >
            <TimeInput value={line.time} onChange={(time) => update(i, { time })} />
            <input
              value={line.text}
              onChange={(e) => update(i, { text: e.target.value })}
              className={`${input} min-w-0 flex-1 py-1.5`}
              aria-label={`Line ${i + 1}`}
            />
            {track && (
              <button
                type="button"
                title={hasWords(line) ? "Words tapped — tap them again" : "Tap this line’s words"}
                aria-label={`Tap the words of line ${i + 1}`}
                onClick={() => startSync(i, true)}
                className={`${smallButton} ${hasWords(line) ? "border-[#2e7d32]! text-[#2e7d32]" : "text-[#999]"}`}
              >
                ♪
              </button>
            )}
            {track && (
              <button
                type="button"
                title="Set to the player’s position"
                onClick={() => update(i, { time: seconds(audio.current?.currentTime ?? 0) })}
                className={smallButton}
              >
                ⏱
              </button>
            )}
            {track && (
              <button
                type="button"
                title="Play from here"
                onClick={() => {
                  if (!audio.current) return;
                  audio.current.currentTime = line.time;
                  void audio.current.play();
                }}
                className={smallButton}
              >
                ▶
              </button>
            )}
            <button
              type="button"
              aria-label="Remove line"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className={`${smallButton} text-error`}
            >
              ✕
            </button>
          </li>
        ))}
        {!value.length && <li className={`${helpText} p-2`}>No lines yet.</li>}
      </ol>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(sorted([...value, { time: seconds(audio.current?.currentTime ?? value.at(-1)?.time ?? 0), text: "" }]))}
          className={smallButton}
        >
          + Add line
        </button>
        <button type="button" onClick={() => onChange(sorted(value))} className={smallButton}>
          Sort by time
        </button>
      </div>
    </div>
  );
}

function TimeInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      value={draft ?? formatTime(value)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const t = parseTime(draft ?? "");
        if (draft !== null && Number.isFinite(t)) onChange(t);
        setDraft(null);
      }}
      aria-label="Start time (m:ss.xx)"
      className={`${input} w-[86px]! shrink-0 py-1.5 font-mono text-[12px]`}
    />
  );
}

/** An on/off switch ("On site" / "Hidden"). */
export function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={label}
      onClick={() => onChange(!on)}
      className="flex shrink-0 items-center gap-2 rounded-md px-1.5 py-1 text-[12px] font-semibold text-[#555] hover:bg-[#f0f0ec]"
    >
      <span
        aria-hidden
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-[#2e7d32]" : "bg-[#c9c9c4]"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : ""}`}
        />
      </span>
      <span className="w-12 text-left">{on ? "On site" : "Hidden"}</span>
    </button>
  );
}
