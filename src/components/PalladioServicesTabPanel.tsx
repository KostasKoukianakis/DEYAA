import { Download } from "lucide-react";
import * as Icons from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useActiveDocuments, useIncrementDownloadCount } from "@/hooks/useDocuments";
import { usePalladioServicesTabPanelEffects } from "@/hooks/usePalladioServicesTabPanelEffects";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { PalladioServiceHeroIcon } from "@/components/PalladioServiceHeroIcons";
import { PalladioServiceAccordionGroup } from "@/components/PalladioServiceAccordion";
import type { DeyaaServicesHubSection } from "@/data/deyaaServicesHub";
import { getServiceTabHash } from "@/data/deyaaServicesHub";

function renderLeadWithHighlights(lead: string, highlights?: string[]) {
  if (!highlights?.length) return lead;

  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "g");
  const parts = lead.split(pattern);

  return parts.map((part, index) =>
    highlights.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ServicesDocumentsDownloads() {
  const { data: documents = [], isLoading } = useActiveDocuments();
  const incrementDownload = useIncrementDownloadCount();

  const handleDownload = async (docId: string, filePath: string) => {
    await incrementDownload.mutateAsync(docId);
    window.open(getPublicUrl(STORAGE_BUCKETS.DOCUMENTS, filePath), "_blank");
  };

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Icons.FileText;
    return (Icons as Record<string, typeof Icons.FileText>)[iconName] || Icons.FileText;
  };

  if (isLoading) {
    return <p className="palladio-services-page__accordion-text">Φόρτωση εγγράφων…</p>;
  }

  if (documents.length === 0) {
    return (
      <p className="palladio-services-page__accordion-text">
        Δεν υπάρχουν διαθέσιμα έγγραφα αυτή τη στιγμή.
      </p>
    );
  }

  return (
    <div className="palladio-services-page__docs-grid">
      {documents.map((doc) => {
        const IconComponent = getIconComponent(doc.icon_name);

        return (
          <article key={doc.id} className="palladio-services-page__doc-card">
            <div className="palladio-services-page__doc-head">
              <IconComponent className="palladio-services-page__doc-icon" aria-hidden />
              <h4 className="palladio-services-page__doc-title">{doc.title}</h4>
            </div>
            {doc.description && (
              <p className="palladio-services-page__doc-desc">{doc.description}</p>
            )}
            {doc.category && (
              <span className="palladio-services-page__doc-tag">{doc.category}</span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="palladio-services-page__doc-btn"
              onClick={() => handleDownload(doc.id, doc.file_path)}
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              Κατεβάστε PDF
            </Button>
          </article>
        );
      })}
    </div>
  );
}

interface PalladioServicesTabPanelProps {
  section: DeyaaServicesHubSection;
  isActive: boolean;
}

export function PalladioServicesTabPanel({ section, isActive }: PalladioServicesTabPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const iconColRef = useRef<HTMLDivElement>(null);

  usePalladioServicesTabPanelEffects(panelRef, iconColRef, isActive);

  return (
    <div
      ref={panelRef}
      id={`panel-${section.id}`}
      className={cn(
        "palladio-services-page__panel",
        `item-${section.id}`,
        !isActive && "palladio-services-page__panel--hidden",
      )}
      aria-hidden={!isActive}
      data-tab-id={getServiceTabHash(section.id).slice(1)}
    >
      <div className="palladio-services-page__panel-inner">
        <div className="palladio-services-page__service-heros">
          <div className="palladio-services-page__panel-title-col">
            <h2 className="palladio-services-page__panel-title">{section.title}</h2>
          </div>
          <div className="palladio-services-page__panel-lead-col">
            <h3 className="palladio-services-page__panel-lead">
              {renderLeadWithHighlights(section.lead, section.leadHighlights)}
            </h3>
          </div>
        </div>

        <div className="palladio-services-page__panel-body">
          <div
            ref={iconColRef}
            className="palladio-services-page__panel-icon-col"
            aria-hidden
          >
            <div className="palladio-services-page__panel-icon-spin">
              <PalladioServiceHeroIcon
                iconId={section.id}
                className="palladio-services-page__panel-icon"
              />
            </div>
          </div>

          <div className="palladio-services-page__service-content">
            <PalladioServiceAccordionGroup blocks={section.blocks} />

            {section.id === "documents" && (
              <div className="palladio-services-page__docs">
                <h3 className="palladio-services-page__docs-heading">Διαθέσιμα έντυπα</h3>
                <ServicesDocumentsDownloads />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
