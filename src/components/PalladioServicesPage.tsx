import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShaderGradientHero } from "@/components/ShaderGradientHero";
import { PalladioServicesPageHero } from "@/components/PalladioServicesPageHero";
import { PalladioServicesTabs } from "@/components/PalladioServicesTabs";
import { PalladioServicesTabPanel } from "@/components/PalladioServicesTabPanel";
import { usePalladioServicesPageEntrance } from "@/hooks/usePalladioServicesPageEntrance";
import {
  deyaaServicesHubSections,
  getServiceTabHash,
  getServiceTabIdFromHash,
  type DeyaaServiceTabId,
  type DeyaaServicesHubSection,
} from "@/data/deyaaServicesHub";

interface PalladioServicesPageProps {
  headline: string;
  intro: string;
  sections: DeyaaServicesHubSection[];
}

export function PalladioServicesPage({ headline, intro, sections }: PalladioServicesPageProps) {
  const pageRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const [activeId, setActiveId] = useState<DeyaaServiceTabId>(sections[0]?.id ?? "water");

  useEffect(() => {
    const fromHash = getServiceTabIdFromHash(location.hash);
    if (fromHash) {
      setActiveId(fromHash);
    }
  }, [location.hash]);

  const handleTabSelect = (id: DeyaaServiceTabId, scrollToTabs = false) => {
    setActiveId(id);
    window.history.replaceState(null, "", getServiceTabHash(id));

    if (scrollToTabs) {
      document.getElementById("services-content")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        "a[href*='#item-']",
      );
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      const samePage =
        url.origin === window.location.origin &&
        url.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "");

      if (!samePage) return;

      const tabId = getServiceTabIdFromHash(url.hash);
      if (!tabId) return;

      event.preventDefault();
      handleTabSelect(tabId, true);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [location.pathname]);

  usePalladioServicesPageEntrance(pageRef);

  return (
    <article ref={pageRef} className="palladio-services-page palladio-services-page--shader">
      <ShaderGradientHero
        className="palladio-services-page__shader-bg"
        bottomGrain
        organicSpot
      />
      <main className="palladio-services-page__main" id="services">
        <PalladioServicesPageHero headline={headline} intro={intro} sections={sections} />

        <section className="palladio-services-page__content" id="services-content">
          <PalladioServicesTabs
            sections={sections}
            activeId={activeId}
            onTabSelect={(id) => handleTabSelect(id)}
          />

          <div className="palladio-services-page__content-stack" id="content">
            {sections.map((section) => (
              <PalladioServicesTabPanel
                key={section.id}
                section={section}
                isActive={activeId === section.id}
              />
            ))}
          </div>
        </section>
      </main>

      <div className="palladio-services-page__spacer" aria-hidden />
    </article>
  );
}
