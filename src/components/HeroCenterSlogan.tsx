import { cn } from "@/lib/utils";

const PALLADIO_ARROW = "/hero/arrow-down.png";

interface HeroCenterSloganProps {
  text?: string;
  className?: string;
}

/** Palladio-style hero headline — single line, centered above bar */
export function HeroCenterSlogan({
  text = "Όλοι μαζί για το νερό του Αποκόρωνα",
  className,
}: HeroCenterSloganProps) {
  return (
    <div className={cn("hero-center-slogan", className)}>
      <h1 className="hero-center-slogan__inner">
        <span className="hero-center-slogan__text">{text}</span>
        <span className="hero-center-slogan__arrow" aria-hidden>
          <img src={PALLADIO_ARROW} alt="" decoding="async" draggable={false} />
        </span>
      </h1>
    </div>
  );
}
