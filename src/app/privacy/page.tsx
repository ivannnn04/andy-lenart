import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { getContent } from "@/lib/content/store";
import { inline } from "@/lib/inline";

export async function generateMetadata(): Promise<Metadata> {
  const { privacy, settings } = await getContent();
  return { title: `${privacy.title} · ${settings.siteTitle}` };
}

/** **Bold** runs, and email addresses as links. */
function rich(text: string): ReactNode {
  return text.split(/([\w.+-]+@[\w-]+\.[\w.-]*\w)/g).map((part, i) =>
    i % 2 ? (
      <a key={i} href={`mailto:${part}`} className="underline underline-offset-2">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{inline(part, "font-medium")}</Fragment>
    ),
  );
}

/** The policy text: blocks split by blank lines; "## " headings, "- " lists. */
function PolicyText({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("## "))
      return (
        <h2 key={i} className="mt-12 text-[22px] leading-[normal] font-bold text-ink first:mt-0">
          {block.slice(3)}
        </h2>
      );
    const lines = block.split("\n");
    if (lines.every((l) => l.startsWith("- ")))
      return (
        <ul key={i} className="mt-4 flex list-disc flex-col gap-3 pl-5">
          {lines.map((l, j) => (
            <li key={j}>{rich(l.slice(2))}</li>
          ))}
        </ul>
      );
    return (
      <p key={i} className="mt-4">
        {lines.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {rich(l)}
          </Fragment>
        ))}
      </p>
    );
  });
}

export default async function PrivacyPage() {
  const { privacy } = await getContent();
  return (
    <>
      <div className="overflow-x-clip">
        {/* The inline-size container is what the design unit (--u) measures. */}
        <div id="top" className="mx-auto w-full max-w-[1440px] [container-type:inline-size]">
          <SiteHeader variant="compact" title="Privacy" />
          <main className="gutter pt-10 pb-24 md:pt-[calc(40*var(--u))] md:pb-[calc(120*var(--u))]">
            <article className="max-w-[760px]">
              <h1 className="text-[32px] leading-[normal] font-bold uppercase md:text-[44px]">{privacy.title}</h1>
              {privacy.updated && (
                <p className="mt-3 text-[12px] leading-[normal] font-medium uppercase tracking-[0.12em] text-muted">
                  Last updated {privacy.updated}
                </p>
              )}
              <div className="mt-10 text-[17px] leading-[1.55] font-normal text-body md:text-[18px]">
                <PolicyText body={privacy.body} />
              </div>
            </article>
          </main>
        </div>
      </div>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
