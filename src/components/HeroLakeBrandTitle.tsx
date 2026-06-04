import { cn } from "@/lib/utils";

interface HeroLakeBrandTitleProps {
  className?: string;
  /** Λειτουργική γραμμή κάτω από τον τίτλο */
  showTagline?: boolean;
}

/**
 * ΔΕΥΑ + ΑΠΟΚΟΡΩΝΟΝΟΝ — λίμνη Κουρνά
 * Λευκό ΔΕΥΑ πάνω από την επιφάνεια, πετρώδες ΑΠΟΚΟΡΩΝΟΝΟΝ ημι-βυθισμένο.
 */
export function HeroLakeBrandTitle({
  className,
  showTagline = true,
}: HeroLakeBrandTitleProps) {
  return (
    <div className={cn("hero-lake-brand", className)}>
      {showTagline ? (
        <p className="hero-lake-brand__tagline">Ύδρευση &amp; Αποχέτευση</p>
      ) : null}

      <h1 className="hero-lake-brand__heading">
        <span className="hero-lake-brand__deya">ΔΕΥΑ</span>
        <span className="hero-lake-brand__submerged">
          <span className="hero-lake-brand__waterline" aria-hidden />
          <span className="hero-lake-brand__stone">ΑΠΟΚΟΡΩΝΟΝΟΝ</span>
          <span className="hero-lake-brand__underwater" aria-hidden />
        </span>
      </h1>
    </div>
  );
}
