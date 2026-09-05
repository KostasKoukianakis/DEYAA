import { ExternalLink, LogIn, CheckCircle } from "lucide-react";
import { EServiceGlassCard } from "@/components/EServiceGlassCard";
import type { DeyaaPortalServiceHandoff } from "@/data/deyaaExternalServices";
import { useI18n } from "@/i18n";

interface EServicePortalHandoffProps {
  handoff: DeyaaPortalServiceHandoff;
}

export function EServicePortalHandoff({ handoff }: EServicePortalHandoffProps) {
  const { t } = useI18n();
  return (
    <div className="palladio-eservices__handoff">
      <EServiceGlassCard variant="alert">
        <LogIn className="palladio-eservices__glass-alert-icon" aria-hidden />
        <p className="palladio-eservices__glass-alert-text">
          {t("eServices.handoff.alert")}
        </p>
      </EServiceGlassCard>

      <div className="palladio-eservices__handoff-panels">
        <EServiceGlassCard title={t("eServices.handoff.needTitle")}>
          <ul className="palladio-eservices__glass-list">
            {handoff.requirements.map((item) => (
              <li key={item}>
                <CheckCircle className="palladio-eservices__glass-list-icon" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </EServiceGlassCard>

        <EServiceGlassCard title={t("eServices.handoff.stepsTitle")}>
          <ol className="palladio-eservices__glass-steps">
            {handoff.steps.map((step, index) => (
              <li key={step}>
                <span className="palladio-eservices__glass-step-num">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="palladio-eservices__glass-footnote">
            {t("eServices.handoff.choose", { label: handoff.portalMenuLabel })}
          </p>
        </EServiceGlassCard>
      </div>

      <a
        href={handoff.portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="palladio-eservices__glass-cta palladio-eservices__glass-cta--primary"
      >
        {handoff.ctaLabel}
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}
