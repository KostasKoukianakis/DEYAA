export type OfficialDocumentCategory =
  | "Ύδρευση"
  | "Αποχέτευση"
  | "Γενικά"
  | "Οικονομικά"
  | "Διαγωνισμοί";

export interface OfficialDocumentSeed {
  sourceUrl: string;
  fileName: string;
  publicPath: string;
  storagePath: string;
  title: string;
  description: string;
  category: OfficialDocumentCategory;
  iconName: string;
  displayOrder: number;
  /** Official publication date from deyaa.gr, ISO date. */
  publishedAt: string;
}

/** Official PDFs copied from https://www.deyaa.gr/?page_id=27 */
export const deyaaOfficialDocuments: OfficialDocumentSeed[] = [
  {
    sourceUrl:
      "https://www.deyaa.gr/wp-content/uploads/2026/09/06_-%CE%A0%CE%A1%CE%9F%CE%A3%CE%9A%CE%9B%CE%97%CE%A3%CE%97-%CE%9C%CE%A0%CE%95-%CE%93%CE%95%CE%A9%CE%A1%CE%93%CE%99%CE%9F%CE%A5%CE%A0%CE%9F%CE%9B%CE%97%CE%A3-_26PROC019720398.pdf",
    fileName: "prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
    publicPath: "/documents/prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
    storagePath: "forms/prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
    title: "Πρόσκληση ΜΠΕ Γεωργιούπολης (26PROC019720398)",
    description:
      "Ανανέωση περιβαλλοντικών όρων με τροποποίηση του έργου αποχέτευσης και εγκατάστασης επεξεργασίας λυμάτων Γεωργιούπολης και ευρύτερης περιοχής των Π.Ε. Χανίων και Ρεθύμνου.",
    category: "Αποχέτευση",
    iconName: "Waves",
    displayOrder: 1,
    publishedAt: "2026-09-04",
  },
  {
    sourceUrl: "https://www.deyaa.gr/wp-content/uploads/2025/12/2.pdf",
    fileName: "prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    publicPath: "/documents/prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    storagePath: "forms/prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    title: "Πρόσκληση — Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη)",
    description:
      "Πρόσκληση ενδιαφέροντος για την επιλογή αναδόχου κατασκευής του έργου «Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων». Ορθή επανάληψη.",
    category: "Ύδρευση",
    iconName: "Droplets",
    displayOrder: 2,
    publishedAt: "2025-12-22",
  },
  {
    sourceUrl:
      "https://www.deyaa.gr/wp-content/uploads/2025/12/09_%CE%A0%CE%A1%CE%9F%CE%A3%CE%9A%CE%9B%CE%97%CE%A3%CE%97-%CE%91%CF%80%CE%BF%CE%BA%CE%B1%CF%84%CE%B1%CF%83%CF%84%CE%AC%CF%83%CE%B5%CE%B9%CF%82-%CF%84%CE%BF%CE%BC%CF%8E%CE%BD-%CE%BF%CE%B4%CE%BF%CF%83%CF%84%CF%81%CF%8E%CE%BC%CE%B1%CF%84%CE%BF%CF%82-25PROC018188246.pdf",
    fileName: "prosklisi-apokatastaseis-tomon-odostromatos-25PROC018188246.pdf",
    publicPath: "/documents/prosklisi-apokatastaseis-tomon-odostromatos-25PROC018188246.pdf",
    storagePath: "forms/prosklisi-apokatastaseis-tomon-odostromatos-25PROC018188246.pdf",
    title: "Πρόσκληση αποκαταστάσεις τομών οδοστρώματος (25PROC018188246)",
    description:
      "Πρόσκληση ενδιαφέροντος για αποκαταστάσεις τομών οδοστρώματος, όπως δημοσιεύθηκε στα συνοδευτικά έγγραφα της ΔΕΥΑΑ.",
    category: "Γενικά",
    iconName: "FileText",
    displayOrder: 3,
    publishedAt: "2025-12-22",
  },
  {
    sourceUrl:
      "https://www.deyaa.gr/wp-content/uploads/2025/12/%CF%80%CF%81%CE%BF%CF%83%CE%BA%CE%BB%CE%B7%CF%83%CE%B7-%CE%BC%CE%B5-%CE%BA%CE%B7%CE%BC%CE%B4%CE%B7%CF%82.pdf",
    fileName: "prosklisi-me-kimdis-armenon-orhi.pdf",
    publicPath: "/documents/prosklisi-me-kimdis-armenon-orhi.pdf",
    storagePath: "forms/prosklisi-me-kimdis-armenon-orhi.pdf",
    title: "Πρόσκληση με ΚΗΜΔΗΣ — Έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη)",
    description:
      "Συνοδευτική πρόσκληση με ανάρτηση ΚΗΜΔΗΣ για τα επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη).",
    category: "Ύδρευση",
    iconName: "FileCheck",
    displayOrder: 4,
    publishedAt: "2025-12-22",
  },
  {
    sourceUrl:
      "https://www.deyaa.gr/wp-content/uploads/2025/12/%CE%A0%CE%A1%CE%9F%CE%A3%CE%9A%CE%9B%CE%97%CE%A3%CE%97-%CE%9C%CE%95-%CE%9A%CE%97%CE%9C%CE%94%CE%97%CE%A3.pdf",
    fileName: "prosklisi-me-kimdis-armenon.pdf",
    publicPath: "/documents/prosklisi-me-kimdis-armenon.pdf",
    storagePath: "forms/prosklisi-me-kimdis-armenon.pdf",
    title: "Πρόσκληση με ΚΗΜΔΗΣ — Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων",
    description:
      "Πρόσκληση ενδιαφέροντος με ΚΗΜΔΗΣ για την επιλογή αναδόχου κατασκευής του έργου «Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων».",
    category: "Ύδρευση",
    iconName: "FileCheck",
    displayOrder: 5,
    publishedAt: "2025-12-18",
  },
  {
    sourceUrl:
      "https://www.deyaa.gr/wp-content/uploads/2025/12/%CF%80%CF%81%CE%BF%CF%83%CE%BA%CE%BB%CE%B7%CF%83%CE%B7-%CE%BC%CE%B5-%CE%BA%CE%B7%CE%B4%CE%BC%CE%B7%CF%82.pdf",
    fileName: "prosklisi-me-kidmis-armenon.pdf",
    publicPath: "/documents/prosklisi-me-kidmis-armenon.pdf",
    storagePath: "forms/prosklisi-me-kidmis-armenon.pdf",
    title: "Πρόσκληση με ΚΗΜΔΗΣ — Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (συνοδευτικό)",
    description:
      "Δεύτερο συνοδευτικό έντυπο πρόσκλησης με ΚΗΜΔΗΣ για τα επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων.",
    category: "Ύδρευση",
    iconName: "FileText",
    displayOrder: 6,
    publishedAt: "2025-12-18",
  },
];

export function getOfficialDocumentPublishedAt(fileName: string | null | undefined): string | null {
  if (!fileName) return null;
  return deyaaOfficialDocuments.find((doc) => doc.fileName === fileName)?.publishedAt ?? null;
}
