import { orgDepartments } from "@/data/aboutContent";
import { cn } from "@/lib/utils";

interface AboutStructureSectionProps {
  className?: string;
}

/** Palladio /group/ locations-style organizational structure */
export function AboutStructureSection({ className }: AboutStructureSectionProps) {
  return (
    <section
      id="about-structure"
      className={cn("about-structure palladio-about", className)}
      aria-label="Οργανωτική Δομή"
    >
      <div className="about-structure__layout">
        <div className="about-structure__copy">
          <div className="palladio-about__anchor-row">
            <span className="palladio-about__anchor-label">Οργανωτική Δομή</span>
            <span className="palladio-about__anchor-index">[03]</span>
          </div>

          <h2 className="about-structure__title">
            Μία επιχείρηση,
            <br />
            πέντε κατευθύνσεις.
          </h2>
          <p className="about-structure__lead">
            Η ΔΕΥΑΑ αποτελείται από εξειδικευμένες διευθύνσεις και τμήματα που συνεργάζονται
            για την απρόσκοπτη λειτουργία των υπηρεσιών ύδρευσης και αποχέτευσης.
          </p>
        </div>

        <ul className="about-structure__list">
          {orgDepartments.map((dept, index) => (
            <li key={dept.title} className="about-structure__item">
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
