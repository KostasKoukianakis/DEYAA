import { ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { homeSections, type HomeSection } from "@/data/homeSections";
import { useSectionActive } from "@/hooks/useHomeSectionActive";

interface HeroBottomBarProps {
  sections?: readonly HomeSection[];
  scrollTargetId?: string;
  /** Bottom of hero viewport, or top strip inside data panel */
  position?: "bottom" | "top";
  className?: string;
}

function CornerBracket({ side }: { side: "start" | "end" }) {
  return (
    <span
      className={cn(
        "hero-bottom-bar__corner",
        side === "start" ? "hero-bottom-bar__corner--start" : "hero-bottom-bar__corner--end"
      )}
      aria-hidden
    />
  );
}

export function HeroBottomBar({
  sections = homeSections,
  scrollTargetId = "section-01-data",
  position = "bottom",
  className,
}: HeroBottomBarProps) {
  const { active, scrollTo } = useSectionActive(sections);

  return (
    <footer
      className={cn(
        "hero-bottom-bar",
        position === "top" && "hero-bottom-bar--top",
        className
      )}
      aria-label="Πλοήγηση hero"
    >
      <div className="hero-bottom-bar__inner">
        <div className="hero-bottom-bar__start">
          <CornerBracket side="start" />
          <p className="hero-bottom-bar__tagline">
            <span>Προστατεύουμε — το νερό</span>
          </p>
        </div>

        <div className="hero-bottom-bar__spacer" aria-hidden />

        <button
          type="button"
          className="hero-bottom-bar__scroll"
          onClick={() => scrollTo(scrollTargetId)}
        >
          <ArrowDownRight className="hero-bottom-bar__scroll-icon" aria-hidden strokeWidth={1.35} />
          <span>[ Κύλιση και είσοδος ]</span>
        </button>

        <nav className="hero-bottom-bar__nav" aria-label="Ενότητες σελίδας">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={cn(
                "hero-bottom-bar__nav-btn",
                active === section.id && "hero-bottom-bar__nav-btn--active"
              )}
              aria-current={active === section.id ? "true" : undefined}
              aria-label={section.label}
              onClick={() => scrollTo(section.id)}
            >
              <span className="hero-bottom-bar__nav-text">
                <span className="hero-bottom-bar__nav-face hero-bottom-bar__nav-face--index">
                  [{section.index}]
                </span>
                <span className="hero-bottom-bar__nav-face hero-bottom-bar__nav-face--label">
                  [{section.label}]
                </span>
              </span>
            </button>
          ))}
        </nav>

        <CornerBracket side="end" />
      </div>
    </footer>
  );
}
