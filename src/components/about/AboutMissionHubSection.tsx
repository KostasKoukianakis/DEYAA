import { AboutCollaborationOrbit } from "@/components/about/AboutCollaborationOrbit";
import { cn } from "@/lib/utils";

interface AboutMissionHubSectionProps {
  className?: string;
}

/**
 * Palladio /innovation/ — collaborations orbit (sky shader zone).
 */
export function AboutMissionHubSection({ className }: AboutMissionHubSectionProps) {
  return (
    <section
      id="about-vision"
      className={cn("about-mission-hub palladio-about", className)}
      aria-label="Συνεργασίες και οικοσύστημα"
    >
      <header className="about-mission-hub__section-header palladio-about__anchor-row">
        <span className="palladio-about__anchor-label">Όραμα / Αποστολή / Δομή</span>
        <span className="palladio-about__anchor-index">[02]</span>
      </header>

      <AboutCollaborationOrbit />
    </section>
  );
}
