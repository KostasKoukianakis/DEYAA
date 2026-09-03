import { cn } from "@/lib/utils";

const PALLADIO_ARROW = "/hero/arrow-down.png";

interface HeroCenterSloganProps {
  text?: string;
  className?: string;
}

function splitHeroSlogan(text: string) {
  const afterGia = text.match(/^(.+?\s+για)\s+(.+)$/i);
  if (afterGia) {
    return { lead: afterGia[1], tail: afterGia[2] };
  }

  const words = text.trim().split(/\s+/);
  if (words.length <= 4) {
    return { lead: text, tail: "" };
  }

  const midpoint = Math.ceil(words.length / 2);
  return {
    lead: words.slice(0, midpoint).join(" "),
    tail: words.slice(midpoint).join(" "),
  };
}

/** Palladio-style hero headline — centered above bar */
export function HeroCenterSlogan({
  text = "Όλοι μαζί για το νερό του Αποκόρωνα",
  className,
}: HeroCenterSloganProps) {
  const { lead, tail } = splitHeroSlogan(text);

  return (
    <div className={cn("hero-center-slogan hero-entrance-ui", className)}>
      <h1 className="hero-center-slogan__inner">
        <span className="hero-center-slogan__copy">
          <span className="hero-center-slogan__lead">{lead}</span>
          {tail ? (
            <span className="hero-center-slogan__tail">
              <span className="hero-center-slogan__place">{tail}</span>
              <span className="hero-center-slogan__arrow" aria-hidden>
                <img src={PALLADIO_ARROW} alt="" decoding="async" draggable={false} />
              </span>
            </span>
          ) : (
            <span className="hero-center-slogan__arrow hero-center-slogan__arrow--solo" aria-hidden>
              <img src={PALLADIO_ARROW} alt="" decoding="async" draggable={false} />
            </span>
          )}
        </span>
      </h1>
    </div>
  );
}
