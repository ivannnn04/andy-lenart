"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { removeMedia } from "@/app/admin/actions";
import type { MediaFile } from "@/lib/admin/media";
import { ActionButton } from "./ActionButton";
import { uploadFile } from "./client-tools";
import { smallButton } from "./fields";

const size = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const isImage = (name: string) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(name);
const isAudio = (name: string) => /\.(mp3|m4a|aac|wav|ogg)$/i.test(name);

export function MediaLibrary({ files, enabled }: { files: MediaFile[]; enabled: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    try {
      for (const [i, file] of [...list].entries()) {
        setProgress(`Uploading ${i + 1} of ${list.length}: ${file.name}`);
        await uploadFile(file);
      }
      setProgress(null);
      router.refresh();
    } catch (e) {
      setProgress((e as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-12">
      {enabled && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void upload(e.dataTransfer.files);
          }}
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#cfcfca] bg-white px-4 py-8 text-center"
        >
          <p className="text-[14px] font-semibold">Drop files here</p>
          <button type="button" onClick={() => input.current?.click()} className={smallButton}>
            or choose files
          </button>
          <input ref={input} type="file" multiple hidden accept="image/*,audio/*" onChange={(e) => void upload(e.target.files)} />
          {progress && <p className="text-[13px] text-[#666]">{progress}</p>}
        </div>
      )}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {files.map((f) => (
          <li key={f.url} className="flex flex-col overflow-hidden rounded-xl border border-[#e4e4e0] bg-white">
            <div className="flex aspect-square items-center justify-center bg-[#f3f3f0]">
              {isImage(f.name) ? (
                // eslint-disable-next-line @next/next/no-img-element -- thumbnail of any upload
                <img src={f.url} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
              ) : isAudio(f.name) ? (
                <audio controls preload="none" src={f.url} className="w-[90%]" />
              ) : (
                <span className="text-[12px] text-[#888]">File</span>
              )}
            </div>
            <div className="flex flex-col gap-2 p-3">
              <p className="truncate text-[12px] font-semibold" title={f.name}>
                {f.name}
              </p>
              <p className="text-[11px] text-[#888]">{size(f.size)}</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(f.url);
                    setCopied(f.url);
                  }}
                  className={smallButton}
                >
                  {copied === f.url ? "Copied" : "Copy address"}
                </button>
                <ActionButton
                  tone="danger"
                  action={removeMedia.bind(null, f.url)}
                  label="Delete"
                  confirmText={`Delete ${f.name}? Anything still using it will show nothing.`}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {!files.length && <p className="text-[14px] text-[#777]">No uploads yet.</p>}
    </div>
  );
}
