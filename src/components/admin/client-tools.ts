"use client";

import { upload } from "@vercel/blob/client";
import type { Lyric } from "@/lib/content/types";

// --- Uploads -------------------------------------------------------------------

let mode: Promise<string> | undefined;

/** Uploads a file to the site's storage and returns its URL. */
export async function uploadFile(file: File): Promise<string> {
  mode ??= fetch("/api/admin/upload")
    .then((r) => r.json())
    .then((r) => r.mode ?? "none");
  const how = await mode;
  if (how === "blob") {
    const name = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9.-]+/g, "-");
    const blob = await upload(`uploads/${name}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
    return blob.url;
  }
  if (how === "local") {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload?local", { method: "POST", body });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Upload failed.");
    return json.url;
  }
  throw new Error("No file storage is connected (set up Vercel Blob — see the dashboard).");
}

/** Natural size of an image file. */
export function imageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// --- Audio ---------------------------------------------------------------------

export const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/**
 * Duration and the 48-bar waveform of a clip: RMS loudness of 48 equal
 * slices in dB, the top 12 dB spread over 4–33 px (as the site draws it).
 */
export async function analyseAudio(source: File | string) {
  const data = typeof source === "string" ? await (await fetch(source)).arrayBuffer() : await source.arrayBuffer();
  const context = new AudioContext();
  try {
    const buffer = await context.decodeAudioData(data);
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
    const slice = Math.floor(buffer.length / 48);
    const rms = Array.from({ length: 48 }, (_, s) => {
      let sum = 0;
      for (let i = s * slice; i < (s + 1) * slice; i++) {
        let v = 0;
        for (const c of channels) v += c[i];
        v /= channels.length;
        sum += v * v;
      }
      return Math.sqrt(sum / Math.max(1, slice));
    });
    const max = Math.max(...rms, 1e-9);
    const waveform = rms.map((r) => {
      const db = 20 * Math.log10(Math.max(r, 1e-9) / max);
      return Math.round(4 + 29 * Math.min(1, Math.max(0, (db + 12) / 12)));
    });
    return { seconds: buffer.duration, duration: formatDuration(buffer.duration), waveform };
  } finally {
    void context.close();
  }
}

// --- Lyrics --------------------------------------------------------------------

const MAX = 64;

/** Splits a long line into phrases (sentence ends, then commas, then words). */
function phrases(text: string) {
  if (text.length <= MAX) return [text];
  const out: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    if (cur && cur.length + 1 + word.length > MAX) {
      out.push(cur);
      cur = word;
    } else cur = `${cur} ${word}`.trim();
    if ((/[.?!]$/.test(cur) && cur.length >= 20) || (cur.endsWith(",") && cur.length >= 35)) {
      out.push(cur);
      cur = "";
    }
  }
  if (cur) out.push(cur);
  if (out.length > 1 && out[out.length - 1].length < 16 && out[out.length - 2].length + 1 + out[out.length - 1].length <= MAX + 8)
    out.splice(-2, 2, `${out[out.length - 2]} ${out[out.length - 1]}`);
  return out;
}

/** Leaves out what speech recognition adds: stray "you", *tags*, ♪ marks, "…". */
function clean(text: string) {
  const t = text
    .replace(/\s*♪\s*♪\s*/g, ", ")
    .replace(/♪/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^,\s*|,\s*$/g, "");
  if (t.toLowerCase() === "you" || /^\*.*$/.test(t) || /^[-.…\s]*$/.test(t)) return "";
  return t;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Lyrics from an .srt or .lrc file. Long subtitle lines are split into
 * phrases, timed across their cue by length; subtitles also give each
 * line's end (when the voice stops).
 */
export function parseLyrics(source: string): Lyric[] {
  const lines: Lyric[] = [];
  const srt = [
    ...source.matchAll(/(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)[^\n]*\n([\s\S]+?)(?:\n\s*\n|$)/g),
  ];
  if (srt.length) {
    for (const m of srt) {
      const t = (h: string, mi: string, s: string, ms: string) => +h * 3600 + +mi * 60 + +s + +ms / 10 ** ms.length;
      const start = t(m[1], m[2], m[3], m[4]);
      const end = t(m[5], m[6], m[7], m[8]);
      const text = clean(m[9]);
      if (!text) continue;
      const parts = phrases(text);
      const total = parts.reduce((n, p) => n + p.length, 0);
      let at = start;
      for (const p of parts) {
        const next = at + ((end - start) * p.length) / total;
        lines.push({ time: round(at), text: p, end: round(next) });
        at = next;
      }
    }
    return lines;
  }
  for (const m of source.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]([^\n]*)/g)) {
    const text = clean(m[3]);
    if (text) for (const p of phrases(text)) lines.push({ time: round(+m[1] * 60 + +m[2]), text: p });
  }
  return lines;
}

/** "1:23.45" ⇄ 83.45 */
export const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`;
export function parseTime(v: string) {
  const m = v.trim().match(/^(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  return m ? round((m[1] ? +m[1] * 60 : 0) + +m[2]) : NaN;
}
