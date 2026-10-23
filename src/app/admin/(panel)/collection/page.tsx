import type { Metadata } from "next";
import { saveCollection } from "@/app/admin/actions";
import { DocEditor } from "@/components/admin/DocEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Collection cards" };

export default async function CollectionEditor() {
  const { collection, garments } = await getContentFresh();
  return (
    <>
      <PageHeader
        title="Collection cards"
        intro={
          <>
            The ten cards on the home page. To link a card to its garment page, put the garment’s address in “Garment
            page” — available: {garments.map((g) => g.slug).join(", ") || "none yet"}.
          </>
        }
      />
      <DocEditor schema="collection" initial={{ cards: collection }} save={saveCollection} storageReady={getStorage().writable} />
    </>
  );
}
