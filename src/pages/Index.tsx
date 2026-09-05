import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import { useHomeHeroGate } from "@/contexts/HomeHeroGateContext";
import { ShaderGradientHero } from "@/components/ShaderGradientHero";
import { HeroWaterSpine } from "@/components/HeroWaterSpine";
import { HeroRightPipeNetwork } from "@/components/HeroRightPipeNetwork";
import { HeroBiologicalTank } from "@/components/HeroBiologicalTank";
import { HeroStationDownPipes } from "@/components/HeroStationDownPipes";
import { HeroSubmergedStation } from "@/components/HeroSubmergedStation";
import { HeroBottomBar } from "@/components/HeroBottomBar";
import { HeroCenterSlogan } from "@/components/HeroCenterSlogan";
import { HeroDataPanel } from "@/components/HeroDataPanel";
import { LazyOnVisible } from "@/components/LazyOnVisible";
import {
  usePalladioHorizontalScroll,
  usePalladioSectionHeights,
} from "@/hooks/usePalladioHorizontalScroll";
import { useHeroFirstViewportEntrance } from "@/hooks/useHeroFirstViewportEntrance";
import { useSection02BackgroundFade } from "@/hooks/useSection02BackgroundFade";
import { homeSections } from "@/data/homeSections";

function HubMountNotify({
  onMount,
  children,
}: {
  onMount: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return children;
}

const DeyaaServicesHubSection = lazy(() =>
  import("@/components/DeyaaServicesHubSection").then((m) => ({
    default: m.DeyaaServicesHubSection,
  })),
);
const HeroSustainabilityPanel = lazy(() =>
  import("@/components/HeroSustainabilityPanel").then((m) => ({ default: m.HeroSustainabilityPanel })),
);
const SustainEnvironmentSection = lazy(() =>
  import("@/components/SustainEnvironmentSection").then((m) => ({ default: m.SustainEnvironmentSection })),
);
const DeyaaNewsSection = lazy(() =>
  import("@/components/DeyaaNewsSection").then((m) => ({ default: m.DeyaaNewsSection })),
);
const DeyaaContactSection = lazy(() =>
  import("@/components/DeyaaContactSection").then((m) => ({ default: m.DeyaaContactSection })),
);

export default function Index() {
  const { entranceReady, isFirstVisit, reportReady, completeEntrance } =
    useHomeHeroGate();
  const handleTankReady = useCallback(() => reportReady("tank"), [reportReady]);
  const handleRippleReady = useCallback(() => reportReady("ripple"), [reportReady]);
  const handleShaderReady = useCallback(() => reportReady("shader"), [reportReady]);

  const setHeightRef = useRef<HTMLDivElement>(null);
  const readHeightRef = useRef<HTMLDivElement>(null);
  const unifiedShaderRef = useRef<HTMLDivElement>(null);
  const dataSectionRef = useRef<HTMLElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const servicesHubSetRef = useRef<HTMLDivElement>(null);
  const servicesHubReadRef = useRef<HTMLDivElement>(null);
  const servicesHubPinRef = useRef<HTMLElement>(null);
  const servicesHubScrollRef = useRef<HTMLDivElement>(null);
  const section02Ref = useRef<HTMLDivElement>(null);
  const [hubMounted, setHubMounted] = useState(false);
  const markHubMounted = useCallback(() => setHubMounted(true), []);

  /* pinSpacing:true already adds horizontal scroll room — no manual extra */
  usePalladioSectionHeights(setHeightRef, readHeightRef, {
    includeHorizontalExtra: false,
  });
  usePalladioHorizontalScroll(
    dataSectionRef,
    horizontalScrollRef,
    unifiedShaderRef,
    setHeightRef,
    { pinSpacing: true, scrub: true },
  );
  usePalladioSectionHeights(servicesHubSetRef, servicesHubReadRef, {
    fixedHeight: true,
    includeHorizontalExtra: false,
  }, [hubMounted]);
  usePalladioHorizontalScroll(
    servicesHubPinRef,
    servicesHubScrollRef,
    undefined,
    servicesHubSetRef,
    { pinSpacing: true, scrub: true, refreshKey: hubMounted },
  );
  useHeroFirstViewportEntrance(isFirstVisit && entranceReady, completeEntrance);
  useSection02BackgroundFade(section02Ref);

  return (
    <Layout>
      <div
        ref={setHeightRef}
        id="section-01"
        className={cn(
          "hero-scroll-block relative",
          isFirstVisit
            ? "hero-entrance-pending"
            : "hero-entrance-done hero-entrance-brand-ripple",
        )}
      >
        <div ref={readHeightRef} className="relative w-full">
          <div ref={unifiedShaderRef} className="hero-unified-shader pointer-events-none">
            <div className="hero-unified-shader__inner h-[200svh] w-full">
              <div className="hero-submerged-station-layer pointer-events-none absolute inset-x-0 top-0 z-[2] h-svh">
                <HeroSubmergedStation />
              </div>
              <ShaderGradientHero
                className="h-full"
                ripple
                persistScene
                scrollExtensionVh={100}
                pointerBoundsRef={unifiedShaderRef}
                topImage="/hero/homepageimage.webp"
                onRippleSceneReady={handleRippleReady}
                onShaderSceneReady={handleShaderReady}
              />
              <HeroWaterSpine />
              <HeroStationDownPipes scrollTriggerId="section-01" />
            </div>
          </div>

          <div className="hero-bio-tank-layer pointer-events-none absolute inset-x-0 top-0 z-[12] w-full">
            <div className="hero-bio-tank-layer__inner relative h-[200svh] w-full overflow-visible">
              <HeroBiologicalTank onFirstFrameReady={handleTankReady} />
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

      <div id="section-02" ref={section02Ref} className="section-02-enter relative z-20">
        <div className="section-02-enter__bg" aria-hidden />
        <LazyOnVisible minHeight="100vh">
          <Suspense fallback={null}>
            <HeroSustainabilityPanel sectionIndex="02" />
            <SustainEnvironmentSection />
          </Suspense>
        </LazyOnVisible>
      </div>

      <LazyOnVisible minHeight="100vh">
        <Suspense fallback={null}>
          <HubMountNotify onMount={markHubMounted}>
            <DeyaaServicesHubSection
              id="section-03"
              sectionIndex="03"
              className="relative z-20"
              setHeightRef={servicesHubSetRef}
              readHeightRef={servicesHubReadRef}
              pinSectionRef={servicesHubPinRef}
              scrollRef={servicesHubScrollRef}
            />
          </HubMountNotify>
        </Suspense>
      </LazyOnVisible>

      <LazyOnVisible minHeight="100vh">
        <Suspense fallback={null}>
          <DeyaaNewsSection id="section-04" sectionIndex="04" className="relative z-20" />
        </Suspense>
      </LazyOnVisible>

      <LazyOnVisible minHeight="80vh">
        <Suspense fallback={null}>
          <DeyaaContactSection id="section-05" sectionIndex="05" className="relative z-20" />
        </Suspense>
      </LazyOnVisible>
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
