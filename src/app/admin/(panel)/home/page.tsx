import type { Metadata } from "next";
import { saveHome } from "@/app/admin/actions";
import { DocEditor } from "@/components/admin/DocEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Home page" };

export default async function HomeEditor() {
  const { home } = await getContentFresh();
  return (
    <>
      <PageHeader
        title="Home page"
        intro="The texts of the home page. The photos and lettering are part of the hand-placed layout; the collection cards have their own section."
      />
      <DocEditor schema="home" initial={home} save={saveHome} storageReady={getStorage().writable} />
    </>
  );
}
