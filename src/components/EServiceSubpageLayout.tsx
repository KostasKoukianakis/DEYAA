import { ReactNode, RefObject } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LucideIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

export interface EServiceBreadcrumb {
  label: string;
  href?: string;
}

interface EServiceSubpageLayoutProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  image?: string;
  imagePosition?: "left" | "right";
  heroMode?: "default" | "minimal";
  className?: string;
  breadcrumbs: EServiceBreadcrumb[];
  children: ReactNode;
  heroAside?: ReactNode;
  heroCenter?: ReactNode;
  heroCenterMode?: "column" | "backdrop";
  width?: "narrow" | "default" | "wide";
  pageRef?: RefObject<HTMLElement | null>;
}

export function EServiceSubpageLayout({
  title,
  description,
  icon: Icon,
  image,
  imagePosition = "right",
  heroMode = "default",
  className,
  breadcrumbs,
  children,
  heroAside,
  heroCenter,
  heroCenterMode = "column",
  width = "default",
  pageRef,
}: EServiceSubpageLayoutProps) {
  const isMinimalHero = heroMode === "minimal";
  const isDashBoard = isMinimalHero && Boolean(heroAside);
  const isBackdropCenter = heroCenterMode === "backdrop";

  const heroBlock = (
    <header
      className={cn(
        "palladio-eservices__subpage-hero",
        isDashBoard && "palladio-eservices__subpage-hero--board",
      )}
    >
            {!isMinimalHero && image && (
              <img
                src={image}
                alt=""
                aria-hidden
                className={cn(
                  "palladio-eservices__subpage-hero-art",
                  imagePosition === "left" && "palladio-eservices__subpage-hero-art--left",
                )}
              />
            )}
            <nav aria-label="Breadcrumb" className="palladio-eservices__subpage-breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="palladio-eservices__subpage-crumb">
                  {index > 0 && (
                    <ChevronRight className="palladio-eservices__subpage-crumb-sep" aria-hidden />
                  )}
                  {crumb.href ? (
                    <Link to={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span className="palladio-eservices__subpage-crumb-current">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>

            {!isMinimalHero ? (
              <div className="palladio-eservices__subpage-hero-grid">
                <div className="palladio-eservices__subpage-title-row">
                  {Icon && (
                    <div className="palladio-eservices__subpage-icon" aria-hidden>
                      <Icon className="palladio-eservices__subpage-icon-svg" />
                    </div>
                  )}
                  <div>
                    <h1 className="palladio-eservices__subpage-title">{title}</h1>
                    {description && (
                      <p className="palladio-eservices__subpage-lead palladio-eservices__subpage-lead--mobile">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                {description && (
                  <p className="palladio-eservices__subpage-lead palladio-eservices__subpage-lead--desktop">
                    {description}
                  </p>
                )}
              </div>
            ) : (
              title && (
                <div
                  className={cn(
                    "palladio-eservices__dash-hero-row",
                    heroAside && "palladio-eservices__dash-hero-row--with-aside",
                  )}
                >
                  <div className="palladio-eservices__dash-hero-head">
                    <h1 className="palladio-eservices__dash-hero-title">{title}</h1>
                    {description && (
                      <p className="palladio-eservices__dash-hero-lead">{description}</p>
                    )}
                  </div>
                  {heroAside && (
                    <aside className="palladio-eservices__dash-hero-aside">{heroAside}</aside>
                  )}
                </div>
              )
            )}
    </header>
  );

  const bodyBlock = (
    <div
      className={cn(
        "palladio-eservices__subpage-body",
        isDashBoard && "palladio-eservices__subpage-body--board",
      )}
    >
      <div
        className={cn(
          "palladio-eservices__subpage-inner",
          width === "narrow" && "palladio-eservices__subpage-inner--narrow",
          width === "wide" && "palladio-eservices__subpage-inner--wide",
        )}
      >
        {children}
      </div>
    </div>
  );

  return (
    <Layout>
      <article
        ref={pageRef}
        className={cn(
          "palladio-eservices palladio-eservices--subpage",
          isMinimalHero && "palladio-eservices--dash-hero",
          isDashBoard && "palladio-eservices--dash-board",
          className,
        )}
      >
        <div className="palladio-eservices__stage palladio-eservices__stage--subpage">
          {isDashBoard ? (
            <div className="palladio-eservices__dash-board">
              {heroCenter && isBackdropCenter && (
                <div className="dash-board__backdrop" aria-hidden>
                  {heroCenter}
                </div>
              )}

              <nav aria-label="Breadcrumb" className="palladio-eservices__subpage-breadcrumbs dash-board__crumbs">
                {breadcrumbs.map((crumb, index) => (
                  <span key={`${crumb.label}-${index}`} className="palladio-eservices__subpage-crumb">
                    {index > 0 && (
                      <ChevronRight className="palladio-eservices__subpage-crumb-sep" aria-hidden />
                    )}
                    {crumb.href ? (
                      <Link to={crumb.href}>{crumb.label}</Link>
                    ) : (
                      <span className="palladio-eservices__subpage-crumb-current">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>

              {title && (
                <div className="palladio-eservices__dash-hero-head dash-board__head">
                  <h1 className="palladio-eservices__dash-hero-title">{title}</h1>
                  {description && (
                    <p className="palladio-eservices__dash-hero-lead">{description}</p>
                  )}
                </div>
              )}

              {heroCenter && !isBackdropCenter && heroCenter}

              {!isBackdropCenter && heroAside && (
                <aside className="palladio-eservices__dash-hero-aside dash-board__aside">{heroAside}</aside>
              )}

              <div className="palladio-eservices__dash-board__main">{children}</div>

              {isBackdropCenter && heroAside && (
                <aside className="palladio-eservices__dash-hero-aside dash-board__aside">{heroAside}</aside>
              )}
            </div>
          ) : (
            <>
              {heroBlock}
              {bodyBlock}
            </>
          )}
        </div>
        <div className="palladio-eservices__subpage-spacer" aria-hidden />
      </article>
    </Layout>
  );
}
