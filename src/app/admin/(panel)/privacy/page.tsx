import type { Metadata } from "next";
import { savePrivacy } from "@/app/admin/actions";
import { DocEditor } from "@/components/admin/DocEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyEditor() {
  const { privacy } = await getContentFresh();
  return (
    <>
      <PageHeader
        title="Privacy policy"
        intro={
          <>
            The page at{" "}
            <a href="/privacy" target="_blank" className="underline">
              /privacy ↗
            </a>
            , linked from the footer. Words in [square brackets] are placeholders still to fill in.
          </>
        }
      />
      <DocEditor schema="privacy" initial={privacy} save={savePrivacy} storageReady={getStorage().writable} />
    </>
  );
}
