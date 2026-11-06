import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PalladioFooterBulletIcon } from "@/components/PalladioFooterBulletIcon";
import { PalladioServiceDecorIcon, type ServiceDecorIconId } from "@/components/PalladioServiceDecorIcon";
import { PalladioServiceHeroIcon } from "@/components/PalladioServiceHeroIcons";
import { WaterQualityHero } from "@/components/WaterQualityHero";
import { ShaderGradientHero } from "@/components/ShaderGradientHero";
import {
  WATER_QUALITY_CATEGORIES,
  waterQualityFallbackRecords,
  type WaterQualityCategory,
  type WaterQualityRecordView,
} from "@/data/deyaaWaterQuality";
import { usePublishedWaterQualityRecords } from "@/hooks/useWaterQuality";
import { usePalladioServicesPageEntrance } from "@/hooks/usePalladioServicesPageEntrance";
import { usePalladioServicesTabPanelEffects } from "@/hooks/usePalladioServicesTabPanelEffects";
import { useI18n } from "@/i18n";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { cn } from "@/lib/utils";

const CATEGORY_DECOR: Record<WaterQualityCategory, ServiceDecorIconId> = {
  analysis: "flask-conical",
  monitoring: "clipboard-list",
  statistics: "file-text",
  lab_report: "flask-conical",
  education: "file-text",
};

function isCategory(value: string | null): value is WaterQualityCategory {
  return Boolean(value && WATER_QUALITY_CATEGORIES.includes(value as WaterQualityCategory));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderLeadWithHighlights(lead: string, highlights: string[]) {
  if (!highlights.length) return lead;
  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "g");
  return lead.split(pattern).map((part, index) =>
    highlights.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function WaterQualityRecordAccordion({
  record,
  isOpen,
  onToggle,
}: {
  record: WaterQualityRecordView;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t, formatDate } = useI18n();
  const panelId = useId();
  const fileUrl = record.filePath
    ? getPublicUrl(STORAGE_BUCKETS.WATER_QUALITY, record.filePath)
    : null;
  const dateIso = record.samplingDate ?? record.publishedAt;

  return (
    <article className={cn("palladio-services-page__accordion", isOpen && "is-active")}>
      <button
        type="button"
        className="palladio-services-page__accordion-title"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <h3 className="palladio-services-page__accordion-heading">{record.title}</h3>
      </button>

      <div
        id={panelId}
        className={cn("palladio-services-page__accordion-content", isOpen && "is-open")}
      >
        <div className="palladio-services-page__accordion-inner">
          <p className="palladio-services-page__accordion-text">{record.summary}</p>

          {(record.location || dateIso) && (
            <ul className="palladio-services-page__accordion-list">
              {record.location ? (
                <li className="palladio-services-page__accordion-list-item">
                  <PalladioFooterBulletIcon className="palladio-services-page__accordion-bullet" />
                  <div className="palladio-services-page__accordion-list-body">
                    <strong>{t("waterQuality.location")}</strong>
                    <p>{record.location}</p>
                  </div>
                </li>
              ) : null}
              {dateIso ? (
                <li className="palladio-services-page__accordion-list-item">
                  <PalladioFooterBulletIcon className="palladio-services-page__accordion-bullet" />
                  <div className="palladio-services-page__accordion-list-body">
                    <strong>
                      {record.samplingDate
                        ? t("waterQuality.sampling")
                        : t("waterQuality.published")}
                    </strong>
                    <p>
                      <time dateTime={dateIso}>{formatDate(dateIso)}</time>
                    </p>
                  </div>
                </li>
              ) : null}
            </ul>
          )}

          {fileUrl ? (
            <a
              href={fileUrl}
              className="palladio-water-quality__file-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("waterQuality.download")}
              {record.fileName ? ` · ${record.fileName}` : ""}
            </a>
          ) : (
            <p className="palladio-services-page__accordion-intro">{t("waterQuality.pendingFile")}</p>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="palladio-services-page__accordion-watermark" aria-hidden>
          <PalladioServiceDecorIcon iconId={CATEGORY_DECOR[record.category]} />
        </div>
      )}
    </article>
  );
}

function WaterQualityTabPanel({
  category,
  records,
  isActive,
  isLoading,
  isError,
}: {
  category: WaterQualityCategory;
  records: WaterQualityRecordView[];
  isActive: boolean;
  isLoading: boolean;
  isError: boolean;
}) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const iconColRef = useRef<HTMLDivElement>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  usePalladioServicesTabPanelEffects(panelRef, iconColRef, isActive);

  const highlights = [
    t(`waterQuality.leadHighlights.${category}.0`),
    t(`waterQuality.leadHighlights.${category}.1`),
  ].filter((value) => value && !value.includes("leadHighlights"));

  return (
    <div
      ref={panelRef}
      id={`panel-${category}`}
      className={cn(
        "palladio-services-page__panel",
        `item-${category}`,
        !isActive && "palladio-services-page__panel--hidden",
      )}
      aria-hidden={!isActive}
    >
      <div className="palladio-services-page__panel-inner">
        <div className="palladio-services-page__service-heros">
          <div className="palladio-services-page__panel-title-col">
            <h2 className="palladio-services-page__panel-title">
              {t(`waterQuality.categories.${category}`)}
            </h2>
          </div>
          <div className="palladio-services-page__panel-lead-col">
            <h3 className="palladio-services-page__panel-lead">
              {renderLeadWithHighlights(t(`waterQuality.leads.${category}`), highlights)}
            </h3>
            <p className="palladio-water-quality__legal">{t("waterQuality.legal")}</p>
          </div>
        </div>

        <div className="palladio-services-page__panel-body">
          <div ref={iconColRef} className="palladio-services-page__panel-icon-col" aria-hidden>
            <div className="palladio-services-page__panel-icon-spin">
              <PalladioServiceHeroIcon
                iconId="water"
                className="palladio-services-page__panel-icon"
              />
            </div>
          </div>

          <div className="palladio-services-page__service-content">
            {isError && (
              <p className="palladio-services-page__accordion-text">{t("waterQuality.error")}</p>
            )}
            {isLoading && (
              <p className="palladio-services-page__accordion-text">{t("waterQuality.loading")}</p>
            )}
            {!isLoading && records.length === 0 && (
              <p className="palladio-services-page__accordion-text">{t("waterQuality.empty")}</p>
            )}
            {!isLoading && records.length > 0 && (
              <div className="palladio-services-page__accordion-group">
                {records.map((record) => (
                  <WaterQualityRecordAccordion
                    key={record.id}
                    record={record}
                    isOpen={openIds.has(record.id)}
                    onToggle={() => {
                      setOpenIds((current) => {
                        const next = new Set(current);
                        if (next.has(record.id)) next.delete(record.id);
                        else next.add(record.id);
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WaterQualityPage() {
  const { t } = useI18n();
  const pageRef = useRef<HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = usePublishedWaterQualityRecords();

  const activeCategory = isCategory(searchParams.get("category"))
    ? searchParams.get("category")!
    : "analysis";

  usePalladioServicesPageEntrance(pageRef);

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("waterQuality.title")} · ΔΕΥΑΑ`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  const items = useMemo(() => {
    if (data && data.length > 0) return data;
    return waterQualityFallbackRecords;
  }, [data]);

  return (
    <article
      ref={pageRef}
      className="palladio-services-page palladio-services-page--shader palladio-water-quality"
    >
      <ShaderGradientHero className="palladio-services-page__shader-bg" bottomGrain organicSpot />
      <main className="palladio-services-page__main" id="water-quality">
        <WaterQualityHero
          headline={t("waterQuality.title")}
          intro={t("waterQuality.description")}
          headingId="water-quality-heading"
        />

        <section className="palladio-services-page__content" id="water-quality-content">
          <nav className="palladio-services-page__tabs" aria-label={t("waterQuality.tabsAria")}>
            {WATER_QUALITY_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  id={`item-${category}`}
                  type="button"
                  className={cn("palladio-services-page__tab", isActive && "is-active")}
                  aria-current={isActive ? "true" : undefined}
                  aria-controls={`panel-${category}`}
                  onClick={() => setSearchParams({ category })}
                >
                  <span>{t(`waterQuality.categories.${category}`)}</span>
                </button>
              );
            })}
          </nav>

          <div className="palladio-services-page__content-stack">
            {WATER_QUALITY_CATEGORIES.map((category) => (
              <WaterQualityTabPanel
                key={category}
                category={category}
                records={items.filter((item) => item.category === category)}
                isActive={activeCategory === category}
                isLoading={isLoading}
                isError={isError}
              />
            ))}
          </div>
        </section>
      </main>
      <div className="palladio-services-page__spacer" aria-hidden />
    </article>
  );
}
