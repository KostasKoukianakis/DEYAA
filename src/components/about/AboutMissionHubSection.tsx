import { AboutCollaborationOrbit } from "@/components/about/AboutCollaborationOrbit";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface AboutMissionHubSectionProps {
  className?: string;
}

/**
 * Palladio /innovation/ — collaborations orbit (sky shader zone).
 */
export function AboutMissionHubSection({ className }: AboutMissionHubSectionProps) {
  const { t } = useI18n();
  return (
    <section
      id="about-vision"
      className={cn("about-mission-hub palladio-about", className)}
      aria-label={t("about.vision.collabAria")}
    >
      <header className="about-mission-hub__section-header palladio-about__anchor-row">
        <span className="palladio-about__anchor-label">{t("about.vision.label")}</span>
        <span className="palladio-about__anchor-index">[02]</span>
      </header>

      <AboutCollaborationOrbit />
    </section>
  );
}
