import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SustainMeshShaderBackground } from "@/components/SustainMeshShaderBackground";
import { SustainWaterReveal } from "@/components/SustainWaterReveal";
import { IsoBadgeArc } from "@/components/IsoBadgeArc";

interface SustainEnvironmentSectionProps {
  id?: string;
  className?: string;
  /** Palladio-style hero word (like «SUSTAIN») */
  heroWord?: string;
}

/** Palladio sostenere — hero word, blob center, copy top-right, pill CTA center. */
export function SustainEnvironmentSection({
  id,
  className,
  heroWord = "Βιωσιμότητα",
}: SustainEnvironmentSectionProps) {
  return (
    <section
      id={id}
      className={cn("sustain-environment", className)}
      aria-label="Βιωσιμότητα — Περιβάλλον"
    >
      <SustainMeshShaderBackground />

      <div className="sustain-environment__inner">
        <h2 className="sustain-environment__hero-word">{heroWord}</h2>
        <SustainWaterReveal className="sustain-environment__drop" />

        <aside className="sustain-environment__rail">
          <p className="sustain-environment__lead">
            Σε μια υπηρεσία που αγγίζει την καθημερινότητα κάθε οικογένειας, κάθε επιλογή μας
            μετράει. Η βιώσιμη διαχείριση του νερού, από την πηγή μέχρι την βρύση, είναι για
            εμάς δέσμευση, όχι slogan.
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

            <Link to="/about/mission" className="sustain-environment__detail-link">
              Λεπτομέρειες για τη δέσμευσή μας
            </Link>
          </div>
        </aside>

        <div className="sustain-environment__center">
          <Link to="/about/mission" className="sustain-environment__cta">
            Μάθετε περισσότερα
          </Link>
        </div>
      </div>
    </section>
  );
}
