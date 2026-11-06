import { useEffect } from "react";
import {
  PALLADIO_HERO_ICON_IDS,
  PalladioServiceHeroIcon,
  type PalladioHeroIconId,
} from "@/components/PalladioServiceHeroIcons";
import type { DeyaaServicesHubSection } from "@/data/deyaaServicesHub";

/** Palladio /services/ hero — 7 icons in 5-column grid (row1: 3, row2: 4) */
const HERO_ICON_SLOTS: { id: PalladioHeroIconId; slotClass: string }[] = [
  { id: "water", slotClass: "palladio-services-page__hero-icon--slot-1" },
  { id: "sewerage", slotClass: "palladio-services-page__hero-icon--slot-2" },
  { id: "documents", slotClass: "palladio-services-page__hero-icon--slot-3" },
  { id: "plus", slotClass: "palladio-services-page__hero-icon--slot-4" },
  { id: "pinwheel", slotClass: "palladio-services-page__hero-icon--slot-5" },
  { id: "hourglass", slotClass: "palladio-services-page__hero-icon--slot-6" },
  { id: "ring", slotClass: "palladio-services-page__hero-icon--slot-7" },
];

interface PalladioServicesPageHeroProps {
  headline: string;
  intro: string;
  sections?: DeyaaServicesHubSection[];
  headingId?: string;
}

export function PalladioServicesPageHero({
  headline,
  intro,
  headingId = "services-heading",
}: PalladioServicesPageHeroProps) {
  useEffect(() => {
    const icons = Array.from(
      document.querySelectorAll<HTMLElement>(".palladio-services-page__hero-icon"),
    );
    const shuffled = [...icons].sort(() => Math.random() - 0.5);

    shuffled.forEach((icon, index) => {
      window.setTimeout(() => icon.classList.add("is-visible"), index * 100);
    });

    return () => {
      icons.forEach((icon) => icon.classList.remove("is-visible"));
    };
  }, []);

  return (
    <section id="hero" className="palladio-services-page__hero" aria-labelledby={headingId}>
      <div className="palladio-services-page__hero-inner">
        <div className="palladio-services-page__hero-grid">
          <div className="palladio-services-page__hero-text">
            <h1 id={headingId} className="palladio-services-page__headline">
              {headline}
            </h1>
            <div className="palladio-services-page__hero-intro-wrap">
              <p className="palladio-services-page__intro">{intro}</p>
            </div>
          </div>

          {HERO_ICON_SLOTS.map((slot) => (
            <PalladioServiceHeroIcon
              key={slot.id}
              iconId={slot.id}
              className={`palladio-services-page__hero-icon--desktop ${slot.slotClass}`}
            />
          ))}
        </div>

        <div className="palladio-services-page__hero-icons-mobile" aria-hidden>
          {PALLADIO_HERO_ICON_IDS.map((iconId) => (
            <PalladioServiceHeroIcon key={`mobile-${iconId}`} iconId={iconId} />
          ))}
        </div>
      </div>
    </section>
  );
}
