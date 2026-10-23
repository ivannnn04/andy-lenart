import { ScrollReveal } from "@/components/ScrollReveal";
import { Collection } from "@/components/sections/Collection";
import { Departures } from "@/components/sections/Departures";
import { ForOwners } from "@/components/sections/ForOwners";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { StayConnected } from "@/components/sections/StayConnected";
import { getContent } from "@/lib/content/store";

export default async function Home() {
  const { home, garments, settings } = await getContent();
  return (
    <>
      {/* The inline-size container is what the design unit (--u) measures. */}
      <div
        id="top"
        className="mx-auto w-full max-w-[1440px] overflow-x-clip [container-type:inline-size]"
      >
        <SiteHeader title="Home" />
        <main>
          <Hero lines={home.heroLines} tagline={home.heroTagline} />
          <Departures />
          <Manifesto lines={home.manifesto} />
          <Collection garments={garments} />
          <ForOwners owners={home.owners} />
          <StayConnected text={home.stayConnected} email={settings.contactEmail} />
        </main>
      </div>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
