import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BoardMemberPortrait } from "@/components/about/BoardMemberPortrait";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { BoardMember } from "@/data/aboutContent";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface BoardMembersFlatCarouselProps {
  members: BoardMember[];
  className?: string;
  /** Hero — γυαλί για μέλη χωρίς φωτο, πρόεδρος με εικόνα */
  heroGlassCards?: boolean;
}

const INFO_EASE = [0.22, 1, 0.36, 1] as const;

function FlatMemberInfo({
  member,
  animated = true,
}: {
  member: BoardMember;
  animated?: boolean;
}) {
  const content = (
    <>
      <p className="about-administration__flat-info-kicker">{member.role}</p>
      <h3 className="about-administration__flat-info-name">{member.name}</h3>
      <p className="about-administration__flat-info-position">{member.position}</p>
      {member.hoverDetail ? (
        <p className="about-administration__flat-info-detail">{member.hoverDetail}</p>
      ) : null}
    </>
  );

  if (!animated) {
    return <div className="about-administration__flat-info">{content}</div>;
  }

  return (
    <motion.div
      className="about-administration__flat-info"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.38, ease: INFO_EASE }}
    >
      {content}
    </motion.div>
  );
}

export function BoardMembersFlatCarousel({
  members,
  className,
  heroGlassCards = false,
}: BoardMembersFlatCarouselProps) {
  const { t } = useI18n();
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const syncIndex = useCallback((carouselApi: CarouselApi) => {
    setSelectedIndex(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    syncIndex(api);
    api.on("select", syncIndex);
    api.on("reInit", syncIndex);
    api.on("scroll", syncIndex);

    return () => {
      api.off("select", syncIndex);
      api.off("reInit", syncIndex);
      api.off("scroll", syncIndex);
    };
  }, [api, syncIndex]);

  if (!members.length) return null;

  const activeMember = members[selectedIndex] ?? members[0];

  return (
    <section
      className={cn("about-administration__flat-carousel", className)}
      aria-roledescription="carousel"
      aria-label={t("about.hero.dialogTitle")}
    >
      <div className="about-administration__flat-carousel-stage">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: members.length > 1,
            containScroll: false,
            dragFree: false,
            skipSnaps: false,
          }}
          className="about-administration__flat-carousel-root"
        >
          <CarouselContent className="-ml-0 about-administration__flat-carousel-track">
            {members.map((member, index) => {
              const isPresident = Boolean(member.image);
              const isActive = index === selectedIndex;

              return (
                <CarouselItem
                  key={member.name}
                  className="basis-auto pl-0 about-administration__flat-slide"
                >
                  <article
                    className={cn(
                      "about-administration__flat-card",
                      isActive && "about-administration__flat-card--active",
                      heroGlassCards &&
                        (isPresident
                          ? "about-administration__flat-card--president"
                          : "about-administration__flat-card--glass"),
                    )}
                  >
                    <div className="about-administration__portrait about-administration__portrait--flat">
                      <BoardMemberPortrait member={member} />
                    </div>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="about-administration__flat-info-wrap" aria-live="polite">
        {reduceMotion ? (
          <FlatMemberInfo member={activeMember} animated={false} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <FlatMemberInfo key={activeMember.name} member={activeMember} />
          </AnimatePresence>
        )}
      </div>

      <div className="about-administration__flat-carousel-footer">
        <div className="about-administration__flat-dots" role="tablist" aria-label={t("about.hero.dotsAria")}>
          {members.map((member, index) => (
            <button
              key={member.name}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`${member.name}, ${member.role}`}
              className={cn(
                "about-administration__flat-dot",
                index === selectedIndex && "about-administration__flat-dot--active",
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
        <p className="about-administration__flat-counter">
          <span className="about-administration__flat-counter-current">{selectedIndex + 1}</span>
          <span aria-hidden> / </span>
          <span>{members.length}</span>
        </p>
      </div>
    </section>
  );
}
