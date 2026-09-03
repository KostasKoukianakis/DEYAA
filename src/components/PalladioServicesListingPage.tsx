import { useRef } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useEServicesHubEntrance } from "@/hooks/useEServicesHubEntrance";

export interface PalladioServicesListingSection {
  id: string;
  title: string;
  href: string;
  image: string;
  tags?: string[];
}

export interface PalladioServicesListingCopy {
  headline: string;
  bannerLead: string;
  bannerBody: string;
  statementTitleLines: readonly string[];
  statementBody: readonly string[];
  catalogCtaLabel: string;
  catalogCtaHref: string;
}

interface PalladioServicesListingPageProps {
  copy: PalladioServicesListingCopy;
  sections: PalladioServicesListingSection[];
  headingId: string;
  listId: string;
}

function ServicesListItem({
  section,
  isFirst = false,
}: {
  section: PalladioServicesListingSection;
  isFirst?: boolean;
}) {
  return (
    <Link
      to={section.href}
      className={`palladio-eservices__list-item${isFirst ? " palladio-eservices__list-item--first" : ""}`}
    >
      <div className="palladio-eservices__list-content">
        <span className="palladio-eservices__crocino" aria-hidden>
          <span className="palladio-eservices__crocino-line" />
        </span>
        <div className="palladio-eservices__list-copy">
          <h2 className="palladio-eservices__list-title">{section.title}</h2>
          {section.tags && section.tags.length > 0 && (
            <div className="palladio-eservices__list-tags">
              {section.tags.map((tag) => (
                <span key={tag} className="palladio-eservices__list-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="palladio-eservices__list-preview" aria-hidden>
        <img
          src={section.image}
          alt=""
          className="palladio-eservices__list-preview-img"
          loading="lazy"
          decoding="async"
        />
      </div>
    </Link>
  );
}

export function PalladioServicesListingPage({
  copy,
  sections,
  headingId,
  listId,
}: PalladioServicesListingPageProps) {
  const pageRef = useRef<HTMLElement>(null);
  useEServicesHubEntrance(pageRef, listId);

  return (
    <article ref={pageRef} className="palladio-eservices">
      <div className="palladio-eservices__stage">
        <section className="palladio-eservices__hero" aria-labelledby={headingId}>
          <div className="palladio-eservices__hero-title-wrap">
            <h1 id={headingId} className="palladio-eservices__headline">
              {copy.headline}
            </h1>
          </div>

          <div className="palladio-eservices__banner">
            <div className="palladio-eservices__banner-inner">
              <div className="palladio-eservices__banner-grid">
                <p className="palladio-eservices__banner-lead">
                  <span className="palladio-eservices__banner-mark" aria-hidden />
                  {copy.bannerLead}
                </p>
                <p className="palladio-eservices__banner-body">{copy.bannerBody}</p>
                <div className="palladio-eservices__banner-spacer" aria-hidden />
              </div>
            </div>
          </div>

          <div className="palladio-eservices__statement">
            <div className="palladio-eservices__statement-left">
              <p className="palladio-eservices__statement-title">
                {copy.statementTitleLines.map((line) => (
                  <span key={line} className="palladio-eservices__statement-title-line">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div className="palladio-eservices__statement-right">
              <div className="palladio-eservices__statement-copy">
                {copy.statementBody.map((paragraph) => (
                  <p key={paragraph} className="palladio-eservices__statement-text">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Link to={copy.catalogCtaHref} className="palladio-eservices__catalog-btn">
                <Mail className="palladio-eservices__catalog-btn-icon" aria-hidden />
                {copy.catalogCtaLabel}
              </Link>
            </div>
          </div>
        </section>

        <div className="palladio-eservices__list" id={listId}>
          {sections.map((section, index) => (
            <ServicesListItem key={section.id} section={section} isFirst={index === 0} />
          ))}
        </div>
      </div>

      <div className="palladio-eservices__list-spacer" aria-hidden />
    </article>
  );
}
