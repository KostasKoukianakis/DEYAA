import { AboutMissionAreasChart } from "@/components/about/AboutMissionAreasChart";
import { cn } from "@/lib/utils";

interface AboutMissionAreasSectionProps {
  className?: string;
}

/** Όραμα / Αποστολή / Αξίες / Δομή — white editorial panel (outside sky shader) */
export function AboutMissionAreasSection({ className }: AboutMissionAreasSectionProps) {
  return (
    <section
      id="about-mission-areas"
      className={cn("about-mission-areas palladio-about", className)}
      aria-label="Όραμα, Αποστολή, Αξίες και Οργανωτική Δομή"
    >
      <AboutMissionAreasChart />
    </section>
  );
}
