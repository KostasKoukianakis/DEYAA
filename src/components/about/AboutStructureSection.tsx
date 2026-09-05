import { orgDepartments } from "@/data/aboutContent";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { getLocalizedDepartments } from "@/i18n/localized";

interface AboutStructureSectionProps {
  className?: string;
}

/** Palladio /group/ locations-style organizational structure */
export function AboutStructureSection({ className }: AboutStructureSectionProps) {
  const { t } = useI18n();
  const departments = getLocalizedDepartments();

  return (
    <section
      id="about-structure"
      className={cn("about-structure palladio-about", className)}
      aria-label={t("about.structure.aria")}
    >
      <div className="about-structure__layout">
        <div className="about-structure__copy">
          <div className="palladio-about__anchor-row">
            <span className="palladio-about__anchor-label">{t("about.structure.label")}</span>
            <span className="palladio-about__anchor-index">[03]</span>
          </div>

          <h2 className="about-structure__title">
            {t("about.structure.titleLine1")}
            <br />
            {t("about.structure.titleLine2")}
          </h2>
          <p className="about-structure__lead">
            {t("about.structure.lead")}
          </p>
        </div>

        <ul className="about-structure__list">
          {departments.map((dept, index) => (
            <li key={orgDepartments[index]?.title ?? dept.title} className="about-structure__item">
              <span className="about-structure__item-index">
                {String(index + 1).padStart(3, "0")}
              </span>
              <div>
                <h3 className="about-structure__item-title">{dept.title}</h3>
                <p className="about-structure__item-desc">{dept.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="about-structure__visual" aria-hidden>
        <img
          src="/hero/deksameni.webp"
          alt=""
          className="about-structure__image"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
