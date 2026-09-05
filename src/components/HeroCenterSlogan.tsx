import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

const PALLADIO_ARROW = "/hero/arrow-down.png";

interface HeroCenterSloganProps {
  lead?: string;
  tail?: string;
  className?: string;
}

/** Palladio-style hero headline — centered above bar */
export function HeroCenterSlogan({ lead, tail, className }: HeroCenterSloganProps) {
  const { t } = useI18n();
  const leadText = lead ?? t("home.sloganLead");
  const tailText = tail ?? t("home.sloganTail");

  return (
    <div className={cn("hero-center-slogan hero-entrance-ui", className)}>
      <h1 className="hero-center-slogan__inner">
        <span className="hero-center-slogan__copy">
          <span className="hero-center-slogan__lead">{leadText}</span>
          {tailText ? (
            <span className="hero-center-slogan__tail">
              <span className="hero-center-slogan__place">{tailText}</span>
              <span className="hero-center-slogan__arrow" aria-hidden>
                <img src={PALLADIO_ARROW} alt="" width={97} height={97} decoding="async" draggable={false} />
              </span>
            </span>
          ) : (
            <span className="hero-center-slogan__arrow hero-center-slogan__arrow--solo" aria-hidden>
              <img src={PALLADIO_ARROW} alt="" width={97} height={97} decoding="async" draggable={false} />
            </span>
          )}
        </span>
      </h1>
    </div>
  );
}
