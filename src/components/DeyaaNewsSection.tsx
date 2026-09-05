import { useMemo, useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HOME_NEWS_POST_LIMIT, mapPublishedPostsToNewsPosts } from "@/data/deyaaAnnouncementDetails";
import { type DeyaaNewsPost } from "@/data/deyaaNewsPosts";
import { usePalladioNewsTimeline } from "@/hooks/usePalladioNewsTimeline";
import { usePalladioNewsEntrance } from "@/hooks/usePalladioNewsEntrance";
import { usePublishedPosts } from "@/hooks/usePosts";
import { useI18n } from "@/i18n";
import { getLocalizedNewsPosts } from "@/i18n/localized";

interface DeyaaNewsSectionProps {
  id?: string;
  endId?: string;
  endRef?: RefObject<HTMLElement | null>;
  className?: string;
  sectionLabel?: string;
  sectionIndex?: string;
  headline?: string;
  description?: string;
  posts?: DeyaaNewsPost[];
}

/**
 * Palladio #news [04] — sticky viewport, scrub timeline expands each news panel.
 * Homepage reads the latest published posts from the dashboard CMS.
 */
export function DeyaaNewsSection({
  id = "section-04",
  endId = "end-news",
  endRef: endRefProp,
  className,
  sectionLabel,
  sectionIndex = "04",
  headline,
  description,
  posts,
}: DeyaaNewsSectionProps) {
  const { t, locale } = useI18n();
  const resolvedLabel = sectionLabel ?? t("home.news.label");
  const resolvedHeadline = headline ?? t("home.news.headline");
  const resolvedDescription = description ?? t("home.news.description");
  const { data: cmsPosts = [], isFetched, isError } = usePublishedPosts();

  const resolvedPosts = useMemo(() => {
    if (posts) return posts.slice(0, HOME_NEWS_POST_LIMIT);
    if (cmsPosts.length > 0) return mapPublishedPostsToNewsPosts(cmsPosts, HOME_NEWS_POST_LIMIT);
    if (!isFetched && !isError) return [];
    if (isError) return getLocalizedNewsPosts();
    return [];
  }, [posts, cmsPosts, isFetched, isError, locale]);

  const postsKey = resolvedPosts.map((post) => post.id).join("-");
  const sectionRef = useRef<HTMLElement>(null);
  const localEndRef = useRef<HTMLElement>(null);
  const endRef = endRefProp ?? localEndRef;
  const lineRef = useRef<HTMLSpanElement>(null);
  const post1Ref = useRef<HTMLElement>(null);
  const post2Ref = useRef<HTMLElement>(null);
  const post3Ref = useRef<HTMLElement>(null);
  const postRefs = [post1Ref, post2Ref, post3Ref];

  usePalladioNewsTimeline({
    sectionRef,
    endRef,
    lineRef,
    postRefs,
    postCount: resolvedPosts.length,
  });
  usePalladioNewsEntrance(sectionRef, postsKey);

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className={cn("palladio-news relative", className)}
        aria-label={resolvedLabel}
      >
        <div className="palladio-news__sticky">
          <div className="palladio-news__inner relative">
            <div className="palladio-news__anchor">
              <span className="palladio-news__anchor-label">{resolvedLabel}</span>
              <span className="palladio-news__anchor-index">[{sectionIndex}]</span>
            </div>

            <div className="palladio-news__intro">
              <h2 className="palladio-news__headline">{resolvedHeadline}</h2>
              <p className="palladio-news__description">
                {resolvedDescription.split(/\s+/).map((word, index) => (
                  <span key={index} className="palladio-news__description-word">
                    {index > 0 ? " " : null}
                    {word}
                  </span>
                ))}
              </p>
            </div>

            <div className="palladio-news__timeline-ui">
              <div className="palladio-news__line-wrap">
                <span ref={lineRef} className="palladio-news__line" aria-hidden />
              </div>
              <div className="palladio-news__tabs">
                {resolvedPosts.map((post) => (
                  <span key={post.id} className="palladio-news__tab">
                    {post.tabLabel}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "palladio-news__posts",
                resolvedPosts.length > 0 && `palladio-news__posts--count-${resolvedPosts.length}`,
              )}
            >
              {resolvedPosts.map((post, index) => (
                <article
                  key={post.id}
                  ref={postRefs[index]}
                  className={cn("palladio-news__post", `palladio-news__post--${(index % 3) + 1}`)}
                  style={{ zIndex: 100 + index }}
                >
                  <div className="palladio-news__post-copy">
                    <time className="palladio-news__post-date" dateTime={post.dateIso ?? post.date}>
                      {post.date}
                    </time>
                    <h3 className="palladio-news__post-title">
                      <Link to={post.href} className="palladio-news__post-link">
                        <span>{post.titleLines[0]}</span>
                        {post.titleLines[1] ? <span>{post.titleLines[1]}</span> : null}
                      </Link>
                    </h3>
                  </div>

                  <div className="palladio-news__post-media">
                    <Link to={post.href} className="palladio-news__post-media-link">
                      <img
                        src={post.image}
                        alt={post.imageAlt}
                        className="palladio-news__post-image"
                        width={1536}
                        height={1024}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id={endId} ref={endRef} className="palladio-news__end" aria-hidden />
    </>
  );
}
