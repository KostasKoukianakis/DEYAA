import { ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { homeSections, type HomeSection } from "@/data/homeSections";
import { useSectionActive } from "@/hooks/useHomeSectionActive";
import { useI18n } from "@/i18n";

interface HeroBottomBarProps {
  sections?: readonly HomeSection[];
  scrollTargetId?: string;
  scrollHint?: string;
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
  scrollHint,
  position = "bottom",
  className,
}: HeroBottomBarProps) {
  const { t } = useI18n();
  const { active, scrollTo } = useSectionActive(sections);
  const hint = scrollHint ?? t("home.scrollHint");

  const sectionLabel = (section: HomeSection) => {
    if (section.id.startsWith("about-")) return t(`about.sections.${section.id}`);
    return t(`home.sections.${section.id}`);
  };

  return (
    <footer
      className={cn(
        "hero-bottom-bar hero-entrance-ui",
        position === "top" && "hero-bottom-bar--top",
        className
      )}
      aria-label={t("home.heroNav")}
    >
      <div className="hero-bottom-bar__inner">
        <div className="hero-bottom-bar__start">
          <CornerBracket side="start" />
          <p className="hero-bottom-bar__tagline">
            <span>{t("home.tagline")}</span>
          </p>
        </div>

        <div className="hero-bottom-bar__spacer" aria-hidden />

        <button
          type="button"
          className="hero-bottom-bar__scroll"
          onClick={() => scrollTo(scrollTargetId)}
        >
          <ArrowDownRight className="hero-bottom-bar__scroll-icon" aria-hidden strokeWidth={1.35} />
          <span>{hint}</span>
        </button>

        <nav className="hero-bottom-bar__nav" aria-label={t("home.pageSections")}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={cn(
                "hero-bottom-bar__nav-btn",
                active === section.id && "hero-bottom-bar__nav-btn--active"
              )}
              aria-current={active === section.id ? "true" : undefined}
              aria-label={sectionLabel(section)}
              onClick={() => scrollTo(section.id)}
            >
              <span className="hero-bottom-bar__nav-text">
                <span className="hero-bottom-bar__nav-face hero-bottom-bar__nav-face--index">
                  [{section.index}]
                </span>
                <span className="hero-bottom-bar__nav-face hero-bottom-bar__nav-face--label">
                  [{sectionLabel(section)}]
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
