import { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SustainMeshShaderBackground } from "@/components/SustainMeshShaderBackground";
import { SustainWaterReveal } from "@/components/SustainWaterReveal";
import { IsoBadgeArc } from "@/components/IsoBadgeArc";
import { useSustainMeshBurst } from "@/hooks/useSustainMeshBurst";
import { useSustainLeadReveal } from "@/hooks/useSustainLeadReveal";

interface SustainEnvironmentSectionProps {
  id?: string;
  className?: string;
  /** Palladio-style hero word (like «SUSTAIN») */
  heroWord?: string;
}

const SUSTAIN_LEAD_TEXT =
  "Σε μια υπηρεσία που αγγίζει την καθημερινότητα κάθε οικογένειας, κάθε επιλογή μας μετράει. Η βιώσιμη διαχείριση του νερού, από την πηγή μέχρι την βρύση, είναι για εμάς δέσμευση, όχι slogan.";

/** Palladio sostenere — hero word, blob center, copy top-right, pill CTA center. */
export function SustainEnvironmentSection({
  id,
  className,
  heroWord = "Βιωσιμότητα",
}: SustainEnvironmentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroWordRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const burstRef = useSustainMeshBurst(sectionRef, heroWordRef);
  useSustainLeadReveal(sectionRef, leadRef);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("sustain-environment", className)}
      aria-label="Βιωσιμότητα — Περιβάλλον"
    >
      <SustainMeshShaderBackground burstRef={burstRef} />

      <div className="sustain-environment__inner">
        <h2 ref={heroWordRef} className="sustain-environment__hero-word">
          {heroWord}
        </h2>
        <SustainWaterReveal className="sustain-environment__drop" />

        <aside className="sustain-environment__rail">
          <p ref={leadRef} className="sustain-environment__lead">
            {SUSTAIN_LEAD_TEXT.split(/\s+/).map((word, index) => (
              <span key={index} className="sustain-environment__lead-word">
                {index > 0 ? " " : null}
                {word}
              </span>
            ))}
          </p>

          <div className="sustain-environment__badge-stack">
            <div className="sustain-environment__badge" aria-label="Πιστοποίηση ISO 14001">
              <div className="sustain-environment__badge-medal">
                <IsoBadgeArc />
                <div className="sustain-environment__badge-body">
                  <span className="sustain-environment__badge-brand">ΔΕΥΑΑ</span>
                  <span className="sustain-environment__badge-sub">Περιβαλλοντική Διαχείριση</span>
                  <span className="sustain-environment__badge-rule" aria-hidden />
                  <span className="sustain-environment__badge-date">2026</span>
                </div>
              </div>
            </div>

            <Link to="/about#about-vision" className="sustain-environment__detail-link">
              Λεπτομέρειες για τη δέσμευσή μας
            </Link>
          </div>
        </aside>

        <div className="sustain-environment__center">
          <Link to="/about#about-vision" className="sustain-environment__cta">
            Μάθετε περισσότερα
          </Link>
        </div>
      </div>
    </section>
  );
}
