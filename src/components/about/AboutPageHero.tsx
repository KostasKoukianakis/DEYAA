import { HeroBottomBar } from "@/components/HeroBottomBar";
import { aboutSections } from "@/data/aboutSections";
import { cn } from "@/lib/utils";

const ABOUT_HERO_VIDEO = "/video/eyes.mp4";

interface AboutPageHeroProps {
  className?: string;
}

/** Palladio /group/ hero — fullscreen showreel video + centered headline */
export function AboutPageHero({ className }: AboutPageHeroProps) {
  return (
    <section
      id="about-hero"
      className={cn("about-page-hero", className)}
      aria-labelledby="about-hero-heading"
    >
      <div className="about-page-hero__bg" aria-hidden>
        <video
          className="about-page-hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          <source src={ABOUT_HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="about-page-hero__overlay" />
      </div>

      <div className="about-page-hero__content">
        <h1 id="about-hero-heading" className="about-page-hero__title">
          Ενωμένοι σε <strong>αξίες</strong>, οδηγούμενοι από το <strong>μέλλον</strong>
        </h1>

        <p className="about-page-hero__eyebrow">
          Δεσμευμένοι για την ποιότητα του νερού στον Αποκόρωνα
        </p>
      </div>

      <HeroBottomBar
        sections={aboutSections.filter((s) => s.id !== "about-hero")}
        scrollTargetId="about-history"
        scrollHint="[ Κύλιση και ανακάλυψη της ιστορίας μας ]"
        className="about-page-hero__bar"
      />
    </section>
  );
}
