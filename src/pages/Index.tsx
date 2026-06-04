import { useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { ShaderGradientHero } from "@/components/ShaderGradientHero";
import { HeroWaterSpine } from "@/components/HeroWaterSpine";
import { HeroRightPipeNetwork } from "@/components/HeroRightPipeNetwork";
import { HeroBottomBar } from "@/components/HeroBottomBar";
import { HeroCenterSlogan } from "@/components/HeroCenterSlogan";
import { HeroDataPanel } from "@/components/HeroDataPanel";
import { HeroSustainabilityPanel } from "@/components/HeroSustainabilityPanel";
import { SustainEnvironmentSection } from "@/components/SustainEnvironmentSection";
import { DeyaaServicesHubSection } from "@/components/DeyaaServicesHubSection";
import { DeyaaNewsSection } from "@/components/DeyaaNewsSection";
import { DeyaaContactSection } from "@/components/DeyaaContactSection";
import {
  usePalladioHorizontalScroll,
  usePalladioSectionHeights,
} from "@/hooks/usePalladioHorizontalScroll";
import { homeSections } from "@/data/homeSections";

export default function Index() {
  const setHeightRef = useRef<HTMLDivElement>(null);
  const readHeightRef = useRef<HTMLDivElement>(null);
  const unifiedShaderRef = useRef<HTMLDivElement>(null);
  const dataSectionRef = useRef<HTMLElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const servicesHubSetRef = useRef<HTMLDivElement>(null);
  const servicesHubReadRef = useRef<HTMLDivElement>(null);
  const servicesHubPinRef = useRef<HTMLElement>(null);
  const servicesHubScrollRef = useRef<HTMLDivElement>(null);

  usePalladioSectionHeights(setHeightRef, readHeightRef);
  usePalladioHorizontalScroll(
    dataSectionRef,
    horizontalScrollRef,
    unifiedShaderRef,
    setHeightRef,
  );
  usePalladioSectionHeights(servicesHubSetRef, servicesHubReadRef, {
    fixedHeight: true,
    includeHorizontalExtra: false,
  });
  usePalladioHorizontalScroll(
    servicesHubPinRef,
    servicesHubScrollRef,
    undefined,
    servicesHubSetRef,
    { pinSpacing: true, scrub: true },
  );

  return (
    <Layout>
      <div ref={setHeightRef} id="section-01" className="hero-scroll-block relative">
        <div ref={readHeightRef} className="relative w-full">
          <div ref={unifiedShaderRef} className="hero-unified-shader pointer-events-none">
            <div className="hero-unified-shader__inner h-[200svh] w-full">
              <ShaderGradientHero
                className="h-full"
                ripple
                scrollExtensionVh={100}
                pointerBoundsRef={unifiedShaderRef}
                topImage="/hero/homepageimage.webp"
              />
              <HeroWaterSpine />
            </div>
          </div>

          <div
            className="pointer-events-none relative z-10 h-svh w-full"
            aria-label="Hero"
          >
            <HeroRightPipeNetwork scrollTriggerId="section-01" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-svh">
              <HeroCenterSlogan />
              <HeroBottomBar sections={homeSections} scrollTargetId="section-01-data" />
            </div>
          </div>

          <HeroDataPanel
            id="section-01-data"
            sectionIndex="01"
            sectionRef={dataSectionRef}
            scrollRef={horizontalScrollRef}
          />
        </div>
      </div>

      <div id="section-02" className="relative z-20">
        <HeroSustainabilityPanel sectionIndex="02" />
        <SustainEnvironmentSection />
      </div>

      <DeyaaServicesHubSection
        id="section-03"
        sectionIndex="03"
        className="relative z-20"
        setHeightRef={servicesHubSetRef}
        readHeightRef={servicesHubReadRef}
        pinSectionRef={servicesHubPinRef}
        scrollRef={servicesHubScrollRef}
      />

      <DeyaaNewsSection id="section-04" sectionIndex="04" className="relative z-20" />

      <DeyaaContactSection id="section-05" sectionIndex="05" className="relative z-20" />
    </Layout>
  );
}

/*
 * ─── Previous homepage (PalladioScrollPanels layout) — kept for reference ───
 *
 * import { Link } from "react-router-dom";
 * import { Layout } from "@/components/layout/Layout";
 * import { Button } from "@/components/ui/button";
 * import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 * import {
 *   CreditCard,
 *   Gauge,
 *   Droplets,
 *   Waves,
 *   AlertCircle,
 *   FileText,
 *   ChevronRight,
 *   Calendar,
 * } from "lucide-react";
 * import ydreyshImage from "@/assets/YDREYSH.webp";
 * import apoxetefshImage from "@/assets/APOXETEFSH.webp";
 * import dikaiologhtikaImage from "@/assets/DIKAIOLOGHTIKA.webp";
 * import { PalladioScrollPanels } from "@/components/PalladioScrollPanels";
 * import { PalladioSectionNav } from "@/components/PalladioSectionNav";
 * import { SectionHeader } from "@/components/layout/SectionHeader";
 * import { ScrollReveal } from "@/components/ScrollReveal";
 * import paymentsBg from "@/pages/images/payments.png";
 * import metritisBg from "@/pages/images/Metrhths.png";
 * import nowaterBg from "@/pages/images/nowater.png";
 * import lhpsharxeioyBg from "@/pages/images/lhpsharxeioy.png";
 *
 * ...announcements, quickLinks, and full JSX layout...
 *
 * export default function IndexLegacy() {
 *   return (
 *     <Layout>
 *       <PalladioSectionNav />
 *       <PalladioScrollPanels quickLinks={quickLinks} />
 *       ...sections 03 & 04...
 *     </Layout>
 *   );
 * }
 */
