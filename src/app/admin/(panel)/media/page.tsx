import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/PageHeader";
import { listMedia, uploadMode } from "@/lib/admin/media";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const mode = uploadMode();
  const files = await listMedia();
  return (
    <>
      <PageHeader
        title="Media"
        intro={
          mode === "none"
            ? "Uploads are off until Vercel Blob is connected (see Dashboard). Files already in the site (/images, /audio) still work."
            : "Photos and audio you upload. Upload here or straight from any editor; copy a file’s address to use it anywhere."
        }
      />
      <MediaLibrary files={files} enabled={mode !== "none"} />
    </>
  );
}
