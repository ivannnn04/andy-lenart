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

export default async function GarmentEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const garment = (await getContentFresh()).garments.find((g) => g.slug === slug);
  if (!garment) notFound();
  return (
    <>
      <p className="mb-2 text-[13px]">
        <Link href="/admin/garments" className="font-semibold text-[#666] underline">
          ← Garments
        </Link>
      </p>
      <PageHeader
        title={garment.titleLines.join(" ") || "Garment"}
        intro={
          <a href={`/collection/${garment.slug}`} target="_blank" className="underline">
            /collection/{garment.slug} ↗
          </a>
        }
        actions={
          <ActionButton
            big
            tone="danger"
            action={deleteGarment.bind(null, garment.slug)}
            label="Delete garment"
            confirmText={`Delete “${garment.titleLines.join(" ")}”? Its page will be gone.`}
            goTo="/admin/garments"
          />
        }
      />
      <DocEditor
        key={garment.slug}
        schema="garment"
        initial={garment}
        save={saveGarment.bind(null, garment.slug)}
        basePath="/admin/garments"
        storageReady={getStorage().writable}
      />
    </>
  );
}
