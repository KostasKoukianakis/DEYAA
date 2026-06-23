import { useRef, type RefObject } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { deyaaNewsPosts, type DeyaaNewsPost } from "@/data/deyaaNewsPosts";
import { usePalladioNewsTimeline } from "@/hooks/usePalladioNewsTimeline";
import { usePalladioNewsEntrance } from "@/hooks/usePalladioNewsEntrance";

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
 */
export function DeyaaNewsSection({
  id = "section-04",
  endId = "end-news",
  endRef: endRefProp,
  className,
  sectionLabel = "Νέα",
  sectionIndex = "04",
  headline = "Τα νέα της ΔΕΥΑΑ",
  description = "Η συνεχής εξέλιξη της ΔΕΥΑΑ σημαίνει έργα που προλαβαίνουν τις ανάγκες, συνεργασίες που δημιουργούν αξία και στόχους που μιλούν για δέσμευση και όραμα. Μάθετε τα τελευταία νέα από τον κόσμο μας.",
  posts = deyaaNewsPosts,
}: DeyaaNewsSectionProps) {
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
  });
  usePalladioNewsEntrance(sectionRef);

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className={cn("palladio-news relative", className)}
        aria-label={sectionLabel}
      >
        <div className="palladio-news__sticky">
          <div className="palladio-news__inner relative">
            <div className="palladio-news__anchor">
              <span className="palladio-news__anchor-label">{sectionLabel}</span>
              <span className="palladio-news__anchor-index">[{sectionIndex}]</span>
            </div>

            <div className="palladio-news__intro">
              <h2 className="palladio-news__headline">{headline}</h2>
              <p className="palladio-news__description">
                {description.split(/\s+/).map((word, index) => (
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
                {posts.map((post) => (
                  <span key={post.id} className="palladio-news__tab">
                    {post.tabLabel}
                  </span>
                ))}
              </div>
            </div>

            <div className="palladio-news__posts">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  ref={postRefs[index]}
                  className={cn("palladio-news__post", `palladio-news__post--${index + 1}`)}
                  style={{ zIndex: 100 + index }}
                >
                  <div className="palladio-news__post-copy">
                    <time className="palladio-news__post-date" dateTime={post.date}>
                      {post.date}
                    </time>
                    <h3 className="palladio-news__post-title">
                      <Link to={post.href} className="palladio-news__post-link">
                        <span>{post.titleLines[0]}</span>
                        <span>{post.titleLines[1]}</span>
                      </Link>
                    </h3>
                  </div>

                  <div className="palladio-news__post-media">
                    <Link to={post.href} className="palladio-news__post-media-link">
                      <img
                        src={post.image}
                        alt={post.imageAlt}
                        className="palladio-news__post-image"
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
