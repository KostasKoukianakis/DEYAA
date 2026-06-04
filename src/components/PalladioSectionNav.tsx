import { useHomeSectionActive } from "@/hooks/useHomeSectionActive";
import { homeSections } from "@/data/homeSections";
import { cn } from "@/lib/utils";

export function PalladioSectionNav() {
  const { active, scrollTo } = useHomeSectionActive();

  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex 2xl:right-8"
      aria-label="Ενότητες σελίδας"
    >
      {homeSections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollTo(section.id)}
          className={cn(
            "group flex items-center gap-2 text-right transition-opacity cursor-pointer",
            active === section.id ? "opacity-100" : "opacity-45 hover:opacity-80"
          )}
          aria-current={active === section.id ? "true" : undefined}
        >
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
            {section.label}
          </span>
          <span
            className={cn(
              "font-sans text-xs font-bold tabular-nums",
              active === section.id ? "text-white" : "text-white/80"
            )}
          >
            [{section.index}]
          </span>
        </button>
      ))}
    </nav>
  );
}
