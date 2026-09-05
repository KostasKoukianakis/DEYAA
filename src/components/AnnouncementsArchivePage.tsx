import { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnnouncementsHeroPipes } from "@/components/AnnouncementsHeroPipes";
import { DeyaaContactSection } from "@/components/DeyaaContactSection";
import { usePublishedPosts } from "@/hooks/usePosts";
import {
  AnnouncementArchiveItem,
  categoryToSlug,
  pickFallbackImage,
} from "@/data/deyaaAnnouncementsArchive";
import { useAnnouncementsArchiveEntrance } from "@/hooks/useAnnouncementsArchiveEntrance";
import { usePalladioNewsArchiveHover } from "@/hooks/usePalladioNewsArchiveHover";
import { newsOrganicMaskDataUri } from "@/lib/newsOrganicMask";
import { useI18n } from "@/i18n";
import { categorySlugLabel, getLocalizedArchiveFallback } from "@/i18n/localized";

function mapPostsToArchiveItems(
  posts: Array<{
    id: string;
    title: string;
    category: string;
    published_at: string | null;
    created_at: string;
    featured_image: string | null;
  }>,
  formatDate: (iso: string) => string,
): AnnouncementArchiveItem[] {
  return posts.map((post, index) => {
    const dateIso = post.published_at ?? post.created_at;
    const categorySlug = categoryToSlug(post.category);
    return {
      id: post.id,
      title: post.title,
      date: formatDate(dateIso),
      dateIso,
      category: categorySlugLabel(categorySlug),
      categorySlug,
      href: `/announcements/${post.id}`,
      image: post.featured_image ?? pickFallbackImage(index),
      imageAlt: post.title,
    };
  });
}

export function AnnouncementsArchivePage() {
  const { t, locale, formatDate } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("category");

  const { data: posts = [], isLoading, error } = usePublishedPosts();

  const items = useMemo(() => {
    const fromDb = mapPostsToArchiveItems(posts, formatDate);
    return fromDb.length > 0 ? fromDb : getLocalizedArchiveFallback();
  }, [posts, formatDate, locale]);

  const filters = useMemo(() => {
    const slugs = [...new Set(items.map((item) => item.categorySlug))];
    return slugs.map((slug) => ({ slug, label: categorySlugLabel(slug) }));
  }, [items, locale]);

  const filteredItems = useMemo(() => {
    if (!activeFilter) return items;
    return items.filter((item) => item.categorySlug === activeFilter);
  }, [items, activeFilter]);

  const organicMaskUris = useMemo(
    () =>
      filteredItems.map((_, index) =>
        newsOrganicMaskDataUri(filteredItems.length, index),
      ),
    [filteredItems.length],
  );

  const listReady = !isLoading && filteredItems.length > 0;

  useAnnouncementsArchiveEntrance({ heroRef, filtersRef });

  usePalladioNewsArchiveHover(listRef, filteredItems.length, listReady);

  const showLoadError = Boolean(error) && items.length === 0 && !isLoading;

  const setFilter = (slug: string | null) => {
    if (!slug) {
      setSearchParams({});
      return;
    }
    setSearchParams({ category: slug });
  };

  return (
    <>
    <main className="palladio-news-archive">
      <section
        ref={heroRef}
        className="palladio-news-archive__hero"
        aria-labelledby="announcements-heading"
      >
        <AnnouncementsHeroPipes />
        <div className="palladio-news-archive__hero-inner">
          <h1 id="announcements-heading" className="palladio-news-archive__title">
            {t("news.archive.title")}
          </h1>
          <div className="palladio-news-archive__hero-grid">
            <div className="palladio-news-archive__hero-spacer" aria-hidden />
            <div className="palladio-news-archive__hero-spacer palladio-news-archive__hero-spacer--wide" aria-hidden />
            <p className="palladio-news-archive__hero-desc">{t("news.archive.description")}</p>
          </div>
        </div>
      </section>

      <section
        ref={filtersRef}
        className="palladio-news-archive__filters"
        aria-label={t("news.archive.filtersAria")}
      >
        <div className="palladio-news-archive__filters-inner">
          <span className="palladio-news-archive__filters-label">{t("news.archive.filtersLabel")}</span>
          <div className="palladio-news-archive__filter-pills">
            {filters.map((filter) => (
              <button
                key={filter.slug}
                type="button"
                className={cn(
                  "palladio-news-archive__pill",
                  activeFilter === filter.slug && "is-active",
                )}
                data-filter={filter.slug}
                onClick={() =>
                  setFilter(activeFilter === filter.slug ? null : filter.slug)
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="palladio-news-archive__list-section" aria-label={t("news.archive.listAria")}>
        {showLoadError && (
          <p className="palladio-news-archive__status palladio-news-archive__status--error">
            {t("news.archive.error")}
          </p>
        )}
        {isLoading && (
          <p className="palladio-news-archive__status">{t("news.archive.loading")}</p>
        )}

        <div id="news-list" className="palladio-news-archive__list-wrap">
          <div ref={listRef} id="hover-bg-container" className="palladio-news-archive__list">
            <div className="palladio-news-archive__hover-bg" aria-hidden />
            {!isLoading &&
              filteredItems.map((item, index) => (
                <article
                  key={item.id}
                  className={cn(
                    "palladio-news-archive__item",
                    `palladio-news-archive__item--${item.categorySlug}`,
                    `palladio-news-archive__item--mod-${index % 3}`,
                  )}
                  data-id={item.id}
                  data-index={index}
                  style={{
                    ["--news-organic-mask" as string]: `url("${organicMaskUris[index]}")`,
                  }}
                >
                  <Link to={item.href} className="palladio-news-archive__item-link">
                    <div className="palladio-news-archive__item-content">
                      <div className="palladio-news-archive__item-copy">
                        <span className="palladio-news-archive__pill palladio-news-archive__pill--inline">
                          {item.category}
                        </span>
                        <h2 className="palladio-news-archive__item-title">{item.title}</h2>
                        <time
                          className="palladio-news-archive__item-date"
                          dateTime={item.dateIso}
                        >
                          {item.date}
                        </time>
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

                    <div className="palladio-news-archive__item-media palladio-news-archive__item-media--organic">
                      <div className="palladio-news-archive__item-media-frame">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="palladio-news-archive__item-image"
                          decoding="async"
                          loading={index < 2 ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
          </div>
        </div>

        {!isLoading && filteredItems.length === 0 && (
          <p className="palladio-news-archive__status">{t("news.archive.empty")}</p>
        )}
      </section>

    </main>

      <DeyaaContactSection id="section-05" sectionIndex="05" className="relative z-20" />
    </>
  );
}
