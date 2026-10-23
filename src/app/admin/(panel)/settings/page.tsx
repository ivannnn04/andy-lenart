import type { Metadata } from "next";
import { saveSettings } from "@/app/admin/actions";
import { DocEditor } from "@/components/admin/DocEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStorage } from "@/lib/content/storage";
import { getContentFresh } from "@/lib/content/store";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsEditor() {
  const { settings } = await getContentFresh();
  return (
    <>
      <PageHeader title="Settings" intro="Site title, contact email and the menu shown on every page." />
      <DocEditor schema="settings" initial={settings} save={saveSettings} storageReady={getStorage().writable} />
    </>
  );
}
