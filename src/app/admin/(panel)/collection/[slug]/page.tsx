import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteGarment, saveGarment } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/ActionButton";
import { DocEditor } from "@/components/admin/DocEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Edit garment" };

export default async function GarmentEditor({ params }: PageProps<"/admin/collection/[slug]">) {
  const { slug } = await params;
  const garment = (await getContentFresh()).garments.find((g) => g.slug === slug);
  if (!garment) notFound();
  const title = garment.titleLines.join(" ") || "Garment";
  const link = "underline";
  return (
    <>
      <p className="mb-2 text-[13px]">
        <Link href="/admin/collection" className="font-semibold text-[#666] underline">
          ← Collection
        </Link>
      </p>
      <PageHeader
        title={`${garment.no ? `${garment.no} · ` : ""}${title}`}
        intro={
          <span className="flex flex-wrap gap-x-4">
            {garment.page ? (
              <a href={`/collection/${garment.slug}`} target="_blank" className={link}>
                Garment page ↗
              </a>
            ) : (
              <span>Garment page not published</span>
            )}
            {garment.room.enabled ? (
              <a href={`/room/${garment.slug}`} target="_blank" className={link}>
                Listening Room ↗
              </a>
            ) : (
              <span>Listening Room closed</span>
            )}
          </span>
        }
        actions={
          <ActionButton
            big
            tone="danger"
            action={deleteGarment.bind(null, garment.slug)}
            label="Delete garment"
            confirmText={`Delete “${title}”? Its card, page and Listening Room will be gone.`}
            goTo="/admin/collection"
          />
        }
      />
      <DocEditor
        key={garment.slug}
        schema="garment"
        initial={garment}
        save={saveGarment.bind(null, garment.slug)}
        basePath="/admin/collection"
        storageReady={getStorage().writable}
      />
    </>
  );
}
