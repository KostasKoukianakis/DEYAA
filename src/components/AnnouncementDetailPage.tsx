import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn, fetchPriorityHigh } from "@/lib/utils";
import { usePublishedPost, usePublishedPosts } from "@/hooks/usePosts";
import { useTrackEvent } from "@/hooks/useAnalytics";
import { DeyaaNewsSection } from "@/components/DeyaaNewsSection";
import { DeyaaContactSection } from "@/components/DeyaaContactSection";
import {
  buildRelatedNewsPostsFromFallback,
  buildRelatedNewsPostsFromPublished,
  getFallbackAnnouncementDetail,
  mapPostToDetail,
  type AnnouncementDetail,
} from "@/data/deyaaAnnouncementDetails";
import type { DeyaaNewsPost } from "@/data/deyaaNewsPosts";
import { useI18n } from "@/i18n";

interface AnnouncementDetailViewProps {
  detail: AnnouncementDetail;
  newsPosts: DeyaaNewsPost[];
}

function AnnouncementDetailView({ detail, newsPosts }: AnnouncementDetailViewProps) {
  const { t, locale } = useI18n();

  return (
    <>
      <main className="palladio-news-article">
        <section className="palladio-news-article__hero" aria-labelledby="article-heading">
          <div className="palladio-news-article__hero-inner">
            <div className="palladio-news-article__hero-top">
              <nav className="palladio-news-article__breadcrumb" aria-label="Breadcrumb">
                <Link to="/announcements" className="palladio-news-article__breadcrumb-link">
                  {t("news.detail.breadcrumb")}
                </Link>
                <img
                  src="/hero/arrow-down.png"
                  alt=""
                  className="palladio-news-article__breadcrumb-arrow"
                  aria-hidden
                  decoding="async"
                />
              </nav>

              <h1 id="article-heading" className="palladio-news-article__title">
                {detail.title}
              </h1>
            </div>

            <div className="palladio-news-article__featured">
              <img
                src={detail.image}
                alt={detail.imageAlt}
                className="palladio-news-article__featured-image"
                decoding="async"
                {...fetchPriorityHigh}
              />
            </div>

            <div className="palladio-news-article__meta">
              <time className="palladio-news-article__date" dateTime={detail.dateIso}>
                {detail.date}
              </time>
              <span className="palladio-news-article__pill">{detail.category}</span>
            </div>
          </div>
        </section>

        <section className="palladio-news-article__content" aria-label={t("news.detail.contentAria")}>
          <div className="palladio-news-article__content-inner">
            {locale !== "el" && (
              <p className="palladio-news-article__paragraph">{t("news.archive.originalLanguage")}</p>
            )}
            {detail.bodyHtml ? (
              <>
                {detail.paragraphs.length > 0 && (
                  <p className="palladio-news-article__paragraph palladio-news-article__paragraph--lead">
                    {detail.paragraphs[0]}
                  </p>
                )}
                <div
                  className="palladio-news-article__body palladio-news-article__body--html"
                  dangerouslySetInnerHTML={{ __html: detail.bodyHtml }}
                />
              </>
            ) : (
              <div className="palladio-news-article__body">
                {detail.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={cn(
                      "palladio-news-article__paragraph",
                      index === 0 && "palladio-news-article__paragraph--lead",
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {newsPosts.length > 0 && (
        <DeyaaNewsSection
          key={newsPosts.map((post) => post.id).join("-")}
          id="section-04-article"
          endId="end-news-article"
          sectionIndex="04"
          className="relative z-20"
          posts={newsPosts}
        />
      )}

      <DeyaaContactSection
        id="section-05-article"
        downloadsId="section-05-article-downloads"
        sectionIndex="05"
        className="relative z-20"
      />
    </>
  );
}

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const trackEvent = useTrackEvent();

  const { data: post, isLoading, error } = usePublishedPost(id);
  const { data: allPosts = [], isLoading: isLoadingPosts } = usePublishedPosts();

  const fallbackDetail = id ? getFallbackAnnouncementDetail(id) : null;

  const detail = useMemo(() => {
    if (post) {
      const index = allPosts.findIndex((p) => p.id === post.id);
      return mapPostToDetail(post, Math.max(index, 0));
    }
    return fallbackDetail;
  }, [post, fallbackDetail, allPosts, locale]);

  const newsPosts = useMemo(() => {
    if (!id) return [];
    if (allPosts.length > 0) {
      return buildRelatedNewsPostsFromPublished(allPosts, id);
    }
    if (!isLoadingPosts) {
      return buildRelatedNewsPostsFromFallback(id);
    }
    return [];
  }, [allPosts, id, isLoadingPosts, locale]);

  useEffect(() => {
    if (!post?.id) return;
    trackEvent.mutate({
      event_type: "view",
      entity_type: "post",
      entity_id: post.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id]);

  useEffect(() => {
    if (detail?.title) {
      document.title = `${detail.title} · ΔΕΥΑΑ`;
    }
    return () => {
      document.title = t("meta.title");
    };
  }, [detail?.title, t]);

  if (isLoading && !fallbackDetail) {
    return (
      <main className="palladio-news-article">
        <p className="palladio-news-article__status">{t("news.detail.loading")}</p>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="palladio-news-article">
        <div className="palladio-news-article__hero-inner">
          <p className="palladio-news-article__status">{t("news.detail.notFound")}</p>
          <Link to="/announcements" className="palladio-news-article__back-link">
            {t("news.detail.backToArchive")}
          </Link>
        </div>
      </main>
    );
  }

  if (error && !fallbackDetail && !post) {
    navigate("/announcements", { replace: true });
    return null;
  }

  return <AnnouncementDetailView detail={detail} newsPosts={newsPosts} />;
}
