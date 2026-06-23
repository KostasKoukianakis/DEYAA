import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnnouncementsHeroPipes } from "@/components/AnnouncementsHeroPipes";
import { useTenders } from "@/hooks/useTenders";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { DeyaaContactSection } from "@/components/DeyaaContactSection";
import { useAnnouncementsArchiveEntrance } from "@/hooks/useAnnouncementsArchiveEntrance";
import { usePalladioNewsArchiveHover } from "@/hooks/usePalladioNewsArchiveHover";
import {
  contractTypeLabels,
  deyaaTendersArchiveCopy,
  deyaaTendersFallback,
  DIAVGEIA_URL,
  ESHDIS_URL,
  getAvailableYears,
  inferContractType,
  statusLabel,
  tenderFilters,
  tenderTypeFilters,
  type TenderArchiveItem,
  type TenderFilterSlug,
  type TenderStatus,
  type TenderTypeFilter,
  type TenderYearFilter,
} from "@/data/deyaaTendersArchive";

type ViewMode = "cards" | "table";

function formatGreekDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysUntilDeadline(iso: string): number | null {
  const deadline = new Date(iso);
  if (Number.isNaN(deadline.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
}

function deadlineCountdownLabel(iso: string): string | null {
  const days = daysUntilDeadline(iso);
  if (days === null) return null;
  if (days < 0) return null;
  if (days === 0) return "Λήγει σήμερα";
  if (days === 1) return "1 ημέρα";
  return `${days} ημέρες`;
}

function mapTendersToItems(
  tenders: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    deadline: string;
    budget: string | null;
    status: string;
    announcement_pdf_path: string | null;
    tender_documents_path: string | null;
  }>,
): TenderArchiveItem[] {
  return tenders.map((tender, index) => {
    const year = tender.date?.slice(0, 4) ?? "2026";
    return {
      id: tender.id,
      title: tender.title,
      description: tender.description,
      date: formatGreekDate(tender.date),
      dateIso: tender.date,
      deadline: formatGreekDate(tender.deadline),
      deadlineIso: tender.deadline,
      budget: tender.budget,
      status: (tender.status as TenderStatus) ?? "current",
      announcementPdfPath: tender.announcement_pdf_path,
      tenderDocumentsPath: tender.tender_documents_path,
      refNumber: `${String(index + 1).padStart(2, "0")}-${year}`,
      contractType: inferContractType(tender.title),
      cpv: null,
    };
  });
}

function sortTenders(items: TenderArchiveItem[]): TenderArchiveItem[] {
  const current = items
    .filter((item) => item.status === "current")
    .sort(
      (a, b) =>
        new Date(a.deadlineIso).getTime() - new Date(b.deadlineIso).getTime(),
    );
  const past = items
    .filter((item) => item.status !== "current")
    .sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime());
  return [...current, ...past];
}

function useTenderDocUrls(item: TenderArchiveItem) {
  const announcementUrl = item.announcementPdfPath
    ? getPublicUrl(STORAGE_BUCKETS.TENDERS, item.announcementPdfPath)
    : null;
  const documentsUrl = item.tenderDocumentsPath
    ? getPublicUrl(STORAGE_BUCKETS.TENDERS, item.tenderDocumentsPath)
    : null;
  return { announcementUrl, documentsUrl };
}

interface TenderListRowProps {
  item: TenderArchiveItem;
  index: number;
}

function TenderListRow({ item, index }: TenderListRowProps) {
  const copy = deyaaTendersArchiveCopy;
  const isOpen = item.status === "current";
  const countdown = isOpen ? deadlineCountdownLabel(item.deadlineIso) : null;
  const { announcementUrl, documentsUrl } = useTenderDocUrls(item);

  return (
    <article
      className={cn(
        "palladio-news-archive__item",
        `palladio-news-archive__item--mod-${index % 3}`,
      )}
      data-id={item.id}
      data-index={index}
    >
      <div className="palladio-news-archive__item-link palladio-tenders__item-link">
        <div className="palladio-news-archive__item-content">
          <div className="palladio-news-archive__item-copy">
            <div className="palladio-tenders__item-pills">
              <span className="palladio-news-archive__pill palladio-news-archive__pill--inline">
                {statusLabel(item.status)}
              </span>
              <span
                className={cn(
                  "palladio-news-archive__pill palladio-news-archive__pill--inline palladio-tenders__type-pill",
                  `palladio-tenders__type-pill--${item.contractType}`,
                )}
              >
                {contractTypeLabels[item.contractType]}
              </span>
            </div>
            <h2 className="palladio-news-archive__item-title">{item.title}</h2>
            <p className="palladio-tenders__item-ref">
              {copy.tableRef} {item.refNumber}
            </p>
            <div className="palladio-tenders__item-meta">
              <time className="palladio-news-archive__item-date" dateTime={item.deadlineIso}>
                {copy.deadlineLabel}: {item.deadline}
              </time>
              {countdown && (
                <span className="palladio-tenders__countdown">{countdown}</span>
              )}
              {item.budget && (
                <span className="palladio-tenders__budget">
                  {copy.budgetLabel}: {item.budget}
                </span>
              )}
            </div>
          </div>
          <span className="palladio-news-archive__item-arrow" aria-hidden>
            <img
              src="/hero/arrow-down.png"
              alt=""
              decoding="async"
              draggable={false}
            />
          </span>
        </div>

        <div className="palladio-news-archive__item-media palladio-tenders__item-aside">
          <div className="palladio-tenders__item-aside-inner">
            {(announcementUrl || documentsUrl || isOpen) && (
              <div className="palladio-tenders__doc-links">
                {announcementUrl && (
                  <a
                    href={announcementUrl}
                    className="palladio-tenders__doc-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText aria-hidden />
                    {copy.announcementPdf}
                  </a>
                )}
                {documentsUrl && (
                  <a
                    href={documentsUrl}
                    className="palladio-tenders__doc-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download aria-hidden />
                    {copy.tenderDocuments}
                  </a>
                )}
                {isOpen && (
                  <a
                    href={ESHDIS_URL}
                    className="palladio-tenders__doc-link palladio-tenders__doc-link--primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink aria-hidden />
                    {copy.submitOffer}
                  </a>
                )}
              </div>
            )}
            <time className="palladio-tenders__published" dateTime={item.dateIso}>
              {copy.publishedLabel}: {item.date}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}

interface TenderTableProps {
  rows: TenderArchiveItem[];
}

function TenderTable({ rows }: TenderTableProps) {
  const copy = deyaaTendersArchiveCopy;

  return (
    <div className="palladio-tenders__table-wrap">
      <table className="palladio-tenders__table">
        <thead>
          <tr>
            <th scope="col">{copy.tableRef}</th>
            <th scope="col">{copy.tableTitle}</th>
            <th scope="col">{copy.tableType}</th>
            <th scope="col">{copy.publishedLabel}</th>
            <th scope="col">{copy.deadlineLabel}</th>
            <th scope="col">{copy.budgetLabel}</th>
            <th scope="col">{copy.tableStatus}</th>
            <th scope="col">{copy.tableDocs}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <TenderTableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TenderTableRow({ item }: { item: TenderArchiveItem }) {
  const copy = deyaaTendersArchiveCopy;
  const countdown =
    item.status === "current" ? deadlineCountdownLabel(item.deadlineIso) : null;
  const { announcementUrl, documentsUrl } = useTenderDocUrls(item);

  return (
    <tr>
      <td className="palladio-tenders__table-ref">{item.refNumber}</td>
      <td className="palladio-tenders__table-title">
        <span>{item.title}</span>
        {item.cpv && <span className="palladio-tenders__table-cpv">CPV {item.cpv}</span>}
      </td>
      <td>
        <span
          className={cn(
            "palladio-news-archive__pill palladio-news-archive__pill--inline palladio-tenders__type-pill",
            `palladio-tenders__type-pill--${item.contractType}`,
          )}
        >
          {contractTypeLabels[item.contractType]}
        </span>
      </td>
      <td>
        <time dateTime={item.dateIso}>{item.date}</time>
      </td>
      <td>
        <time dateTime={item.deadlineIso}>{item.deadline}</time>
        {countdown && (
          <span className="palladio-tenders__table-countdown">{countdown}</span>
        )}
      </td>
      <td>{item.budget ?? "—"}</td>
      <td>
        <span className="palladio-news-archive__pill palladio-news-archive__pill--inline">
          {statusLabel(item.status)}
        </span>
      </td>
      <td>
        <div className="palladio-tenders__table-docs">
          {announcementUrl && (
            <a
              href={announcementUrl}
              className="palladio-tenders__table-doc"
              target="_blank"
              rel="noopener noreferrer"
              title={copy.announcementPdf}
            >
              <FileText aria-hidden />
            </a>
          )}
          {documentsUrl && (
            <a
              href={documentsUrl}
              className="palladio-tenders__table-doc"
              target="_blank"
              rel="noopener noreferrer"
              title={copy.tenderDocuments}
            >
              <Download aria-hidden />
            </a>
          )}
          {item.status === "current" && (
            <a
              href={ESHDIS_URL}
              className="palladio-tenders__table-doc palladio-tenders__table-doc--primary"
              target="_blank"
              rel="noopener noreferrer"
              title={copy.submitOffer}
            >
              <ExternalLink aria-hidden />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

function renderCardRows(rows: TenderArchiveItem[], startIndex = 0) {
  return rows.map((item, i) => (
    <TenderListRow key={item.id} item={item} index={startIndex + i} />
  ));
}

export function TendersArchivePage() {
  const copy = deyaaTendersArchiveCopy;
  const heroRef = useRef<HTMLElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get("status") as TenderFilterSlug | null) ?? "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TenderTypeFilter>("all");
  const [yearFilter, setYearFilter] = useState<TenderYearFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const { data: tenders = [], isLoading, error } = useTenders();

  const items = useMemo(() => {
    const fromDb = mapTendersToItems(tenders);
    return fromDb.length > 0 ? sortTenders(fromDb) : deyaaTendersFallback;
  }, [tenders]);

  const years = useMemo(() => getAvailableYears(items), [items]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (activeFilter === "current") {
      result = result.filter((item) => item.status === "current");
    } else if (activeFilter === "past") {
      result = result.filter((item) => item.status !== "current");
    }

    if (typeFilter !== "all") {
      result = result.filter((item) => item.contractType === typeFilter);
    }

    if (yearFilter !== "all") {
      result = result.filter((item) => item.dateIso.startsWith(yearFilter));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.refNumber.includes(q) ||
          (item.cpv?.toLowerCase().includes(q) ?? false),
      );
    }

    return result;
  }, [items, activeFilter, typeFilter, yearFilter, searchQuery]);

  const effectiveView: ViewMode =
    activeFilter === "past" ? "table" : viewMode;

  const showSectionLabels =
    effectiveView === "cards" && activeFilter === "all" && filteredItems.length > 0;
  const currentItems = showSectionLabels
    ? filteredItems.filter((item) => item.status === "current")
    : [];
  const pastItems = showSectionLabels
    ? filteredItems.filter((item) => item.status !== "current")
    : [];

  const hasActiveRefinements =
    typeFilter !== "all" || yearFilter !== "all" || searchQuery.trim().length > 0;

  const listReady =
    !isLoading && filteredItems.length > 0 && effectiveView === "cards";

  useAnnouncementsArchiveEntrance({ heroRef, filtersRef });

  usePalladioNewsArchiveHover(listRef, filteredItems.length, listReady);

  const showLoadError = Boolean(error) && items.length === 0 && !isLoading;

  const setFilter = (slug: TenderFilterSlug) => {
    if (slug === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ status: slug });
  };

  const clearRefinements = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setYearFilter("all");
  };

  const renderList = (rows: TenderArchiveItem[], startIndex = 0) => {
    if (effectiveView === "table") {
      return <TenderTable rows={rows} />;
    }
    return renderCardRows(rows, startIndex);
  };

  return (
    <>
      <main className="palladio-news-archive palladio-news-archive--tenders">
        <section
          ref={heroRef}
          className="palladio-news-archive__hero"
          aria-labelledby="tenders-heading"
        >
          <AnnouncementsHeroPipes />
          <div className="palladio-news-archive__hero-inner">
            <h1 id="tenders-heading" className="palladio-news-archive__title">
              {copy.title}
            </h1>
            <div className="palladio-news-archive__hero-grid">
              <div className="palladio-news-archive__hero-spacer" aria-hidden />
              <div
                className="palladio-news-archive__hero-spacer palladio-news-archive__hero-spacer--wide"
                aria-hidden
              />
              <div className="palladio-tenders__hero-copy">
                <p className="palladio-news-archive__hero-desc">{copy.description}</p>
                <div className="palladio-tenders__portal-links">
                  <a
                    href={ESHDIS_URL}
                    className="palladio-tenders__portal-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {copy.eshdhsTitle}
                    <ArrowUpRight aria-hidden />
                  </a>
                  <a
                    href={DIAVGEIA_URL}
                    className="palladio-tenders__portal-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {copy.diavgeiaTitle}
                    <ArrowUpRight aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={filtersRef}
          className="palladio-news-archive__filters palladio-tenders__filters"
          aria-label="Φίλτρα και αναζήτηση διαγωνισμών"
        >
          <div className="palladio-tenders__toolbar-top">
            <label className="palladio-tenders__search">
              <Search className="palladio-tenders__search-icon" aria-hidden />
              <input
                type="search"
                className="palladio-tenders__search-input"
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchLabel}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>

            <div
              className="palladio-tenders__view-toggle"
              role="group"
              aria-label="Τρόπος εμφάνισης"
            >
              <button
                type="button"
                className={cn(
                  "palladio-news-archive__pill palladio-tenders__view-btn",
                  effectiveView === "cards" && "is-active",
                )}
                aria-pressed={effectiveView === "cards"}
                onClick={() => setViewMode("cards")}
                disabled={activeFilter === "past"}
              >
                <LayoutGrid aria-hidden />
                {copy.viewCards}
              </button>
              <button
                type="button"
                className={cn(
                  "palladio-news-archive__pill palladio-tenders__view-btn",
                  effectiveView === "table" && "is-active",
                )}
                aria-pressed={effectiveView === "table"}
                onClick={() => setViewMode("table")}
              >
                <List aria-hidden />
                {copy.viewTable}
              </button>
            </div>
          </div>

          <div className="palladio-news-archive__filters-inner">
            <span className="palladio-news-archive__filters-label">{copy.filtersLabel}</span>
            <div className="palladio-news-archive__filter-pills">
              {tenderFilters.map((filter) => (
                <button
                  key={filter.slug}
                  type="button"
                  className={cn(
                    "palladio-news-archive__pill",
                    activeFilter === filter.slug && "is-active",
                  )}
                  onClick={() => setFilter(filter.slug)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="palladio-tenders__filter-row">
            <span className="palladio-news-archive__filters-label">{copy.typeFilterLabel}</span>
            <div className="palladio-news-archive__filter-pills">
              {tenderTypeFilters.map((filter) => (
                <button
                  key={filter.slug}
                  type="button"
                  className={cn(
                    "palladio-news-archive__pill",
                    typeFilter === filter.slug && "is-active",
                  )}
                  aria-pressed={typeFilter === filter.slug}
                  onClick={() => setTypeFilter(filter.slug)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {years.length > 1 && (
            <div className="palladio-tenders__filter-row">
              <span className="palladio-news-archive__filters-label">{copy.yearFilterLabel}</span>
              <div className="palladio-news-archive__filter-pills">
                <button
                  type="button"
                  className={cn(
                    "palladio-news-archive__pill",
                    yearFilter === "all" && "is-active",
                  )}
                  aria-pressed={yearFilter === "all"}
                  onClick={() => setYearFilter("all")}
                >
                  Όλα
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={cn(
                      "palladio-news-archive__pill",
                      yearFilter === year && "is-active",
                    )}
                    aria-pressed={yearFilter === year}
                    onClick={() => setYearFilter(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="palladio-tenders__results-bar">
            <p className="palladio-tenders__results-count">
              <span className="palladio-tenders__results-label">{copy.kpiShowing}:</span>
              {copy.resultsCount(filteredItems.length)}
            </p>
            {hasActiveRefinements && (
              <button
                type="button"
                className="palladio-tenders__clear-filters"
                onClick={clearRefinements}
              >
                <X aria-hidden />
                {copy.clearFilters}
              </button>
            )}
          </div>
        </section>

        <section className="palladio-news-archive__list-section" aria-label="Λίστα διαγωνισμών">
          {showLoadError && (
            <p className="palladio-news-archive__status palladio-news-archive__status--error">
              {copy.error}
            </p>
          )}
          {isLoading && (
            <p className="palladio-news-archive__status">{copy.loading}</p>
          )}

          {effectiveView === "table" ? (
            <div className="palladio-tenders__table-section">
              {!isLoading && showSectionLabels && currentItems.length > 0 && (
                <>
                  <header className="palladio-tenders__section-head">
                    <h2 className="palladio-tenders__section-title">{copy.sectionCurrent}</h2>
                    <span className="palladio-tenders__section-count">
                      {String(currentItems.length).padStart(2, "0")}
                    </span>
                  </header>
                  {renderList(currentItems)}
                </>
              )}
              {!isLoading && showSectionLabels && pastItems.length > 0 && (
                <>
                  <header className="palladio-tenders__section-head">
                    <h2 className="palladio-tenders__section-title">{copy.sectionPast}</h2>
                    <span className="palladio-tenders__section-count">
                      {String(pastItems.length).padStart(2, "0")}
                    </span>
                  </header>
                  {renderList(pastItems)}
                </>
              )}
              {!isLoading && !showSectionLabels && filteredItems.length > 0 && (
                renderList(filteredItems)
              )}
            </div>
          ) : (
            <div className="palladio-news-archive__list-wrap">
              <div ref={listRef} className="palladio-news-archive__list">
                <div className="palladio-news-archive__hover-bg" aria-hidden />
                {!isLoading && showSectionLabels && currentItems.length > 0 && (
                  <>
                    <header className="palladio-tenders__section-head palladio-tenders__section-head--in-list">
                      <h2 className="palladio-tenders__section-title">{copy.sectionCurrent}</h2>
                      <span className="palladio-tenders__section-count">
                        {String(currentItems.length).padStart(2, "0")}
                      </span>
                    </header>
                    {renderList(currentItems, 0)}
                  </>
                )}
                {!isLoading && showSectionLabels && pastItems.length > 0 && (
                  <>
                    <header className="palladio-tenders__section-head palladio-tenders__section-head--in-list">
                      <h2 className="palladio-tenders__section-title">{copy.sectionPast}</h2>
                      <span className="palladio-tenders__section-count">
                        {String(pastItems.length).padStart(2, "0")}
                      </span>
                    </header>
                    {renderList(pastItems, currentItems.length)}
                  </>
                )}
                {!isLoading && !showSectionLabels && filteredItems.length > 0 && (
                  renderList(filteredItems)
                )}
              </div>
            </div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <p className="palladio-news-archive__status">{copy.empty}</p>
          )}
        </section>
      </main>

      <DeyaaContactSection
        id="section-05-tenders"
        downloadsId="section-05-tenders-downloads"
        sectionIndex="05"
        downloadsTitle="Χρήσιμα έγγραφα και κατεβάσιμα"
        downloadsDescription="Καταστάσεις, έντυπα αιτήσεων και τεχνικά στοιχεία. Όλα τα διαθέσιμα αρχεία σε έναν χώρο για άμεση λήψη."
        downloadsCtaLabel="Μετάβαση στα έγγραφα"
        downloadsHref="/services#item-documents"
      />
    </>
  );
}
