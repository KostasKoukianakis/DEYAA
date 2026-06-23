import { cn } from "@/lib/utils";
import { getServiceTabHash, type DeyaaServiceTabId, type DeyaaServicesHubSection } from "@/data/deyaaServicesHub";

interface PalladioServicesTabsProps {
  sections: DeyaaServicesHubSection[];
  activeId: DeyaaServiceTabId;
  onTabSelect: (id: DeyaaServiceTabId) => void;
}

export function PalladioServicesTabs({ sections, activeId, onTabSelect }: PalladioServicesTabsProps) {
  return (
    <nav
      id="tabs"
      className="palladio-services-page__tabs"
      aria-label="Κατηγορίες υπηρεσιών"
    >
      {sections.map((section) => {
        const isActive = activeId === section.id;
        const tabId = getServiceTabHash(section.id).slice(1);

        return (
          <button
            key={section.id}
            id={tabId}
            type="button"
            className={cn("palladio-services-page__tab", isActive && "is-active")}
            aria-current={isActive ? "true" : undefined}
            aria-controls={`panel-${section.id}`}
            onClick={() => onTabSelect(section.id)}
          >
            <span>{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
