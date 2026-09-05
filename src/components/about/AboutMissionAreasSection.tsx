import { AboutMissionAreasChart } from "@/components/about/AboutMissionAreasChart";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface AboutMissionAreasSectionProps {
  className?: string;
}

/** Όραμα / Αποστολή / Αξίες / Δομή — white editorial panel (outside sky shader) */
export function AboutMissionAreasSection({ className }: AboutMissionAreasSectionProps) {
  const { t } = useI18n();
  return (
    <section
      id="about-mission-areas"
      className={cn("about-mission-areas palladio-about", className)}
      aria-label={t("about.missionAreas.aria")}
    >
      <AboutMissionAreasChart />
    </section>
  );
}
