import { useId, useState } from "react";
import { PalladioFooterBulletIcon } from "@/components/PalladioFooterBulletIcon";
import { PalladioServiceDecorIcon } from "@/components/PalladioServiceDecorIcon";
import { cn } from "@/lib/utils";
import type { ServiceContentBlock } from "@/data/deyaaServicesHub";

function getAccordionHeading(title: string) {
  const colonIndex = title.indexOf(":");
  return colonIndex === -1 ? title : title.slice(0, colonIndex).trim();
}

export function PalladioServiceAccordion({
  block,
  isOpen,
  onToggle,
}: {
  block: ServiceContentBlock;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <article className={cn("palladio-services-page__accordion", isOpen && "is-active")}>
      <button
        type="button"
        className="palladio-services-page__accordion-title"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <h3 className="palladio-services-page__accordion-heading">
          {getAccordionHeading(block.title)}
        </h3>
      </button>

      <div
        id={panelId}
        className={cn("palladio-services-page__accordion-content", isOpen && "is-open")}
      >
        <div className="palladio-services-page__accordion-inner">
          {block.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="palladio-services-page__accordion-text">
              {paragraph}
            </p>
          ))}

          {block.introBeforeBullets && (
            <p className="palladio-services-page__accordion-intro">{block.introBeforeBullets}</p>
          )}

          {block.bullets && block.bullets.length > 0 && (
            <ul className="palladio-services-page__accordion-list">
              {block.bullets.map((bullet) => (
                <li key={bullet.label} className="palladio-services-page__accordion-list-item">
                  <PalladioFooterBulletIcon className="palladio-services-page__accordion-bullet" />
                  <div className="palladio-services-page__accordion-list-body">
                    <strong>{bullet.label}</strong>
                    <p>{bullet.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="palladio-services-page__accordion-watermark" aria-hidden>
          <PalladioServiceDecorIcon iconId={block.decorIconId} />
        </div>
      )}
    </article>
  );
}

export function PalladioServiceAccordionGroup({ blocks }: { blocks: ServiceContentBlock[] }) {
  const [openBlockIds, setOpenBlockIds] = useState<Set<string>>(() => new Set());

  return (
    <div className="palladio-services-page__accordion-group">
      {blocks.map((block) => (
        <PalladioServiceAccordion
          key={block.id}
          block={block}
          isOpen={openBlockIds.has(block.id)}
          onToggle={() =>
            setOpenBlockIds((current) => {
              const next = new Set(current);
              if (next.has(block.id)) {
                next.delete(block.id);
              } else {
                next.add(block.id);
              }
              return next;
            })
          }
        />
      ))}
    </div>
  );
}
