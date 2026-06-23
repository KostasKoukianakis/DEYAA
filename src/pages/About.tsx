import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layout } from "@/components/layout/Layout";
// import { AboutPageHero } from "@/components/about/AboutPageHero";
import { AboutBoardMembersHero } from "@/components/about/AboutBoardMembersHero";
import { AboutSkyShaderBg } from "@/components/about/AboutSkyShaderBg";
import { AboutHistorySection } from "@/components/about/AboutHistorySection";
import { AboutMissionHubSection } from "@/components/about/AboutMissionHubSection";
import { AboutMissionAreasSection } from "@/components/about/AboutMissionAreasSection";
import { AboutSustainWaterTravel } from "@/components/about/AboutSustainWaterTravel";
import { useAboutHistoryTimelineScroll } from "@/hooks/useAboutHistoryTimelineScroll";
import { useAboutSkyShaderMount } from "@/hooks/useAboutSkyShaderMount";
import { updateAboutPageShaderOpacity } from "@/lib/aboutPageShaderOpacity";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const location = useLocation();
  const historySectionRef = useRef<HTMLElement>(null);
  const historyScrollRef = useRef<HTMLDivElement>(null);

  useAboutHistoryTimelineScroll(historySectionRef, historyScrollRef);
  const skyShaderActive = useAboutSkyShaderMount(location.hash);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth" });
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    updateAboutPageShaderOpacity();
    const onScroll = () => updateAboutPageShaderOpacity();
    window.addEventListener("scroll", onScroll, { passive: true });

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    const timer = window.setTimeout(refresh, 500);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Layout>
      <main className="about-page">
        <AboutSkyShaderBg active={skyShaderActive} />

        {/* <AboutPageHero /> */}
        <AboutBoardMembersHero />

        <AboutHistorySection
          sectionRef={historySectionRef}
          scrollRef={historyScrollRef}
        />

        <AboutMissionHubSection />

        <AboutMissionAreasSection />

        <AboutSustainWaterTravel />
      </main>
    </Layout>
  );
}
