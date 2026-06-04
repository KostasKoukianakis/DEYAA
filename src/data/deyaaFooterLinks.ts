export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterMenuColumn {
  id: string;
  label: string;
  links: FooterLinkItem[];
}

/** Public site navigation — each href appears once across menu columns. */
export const footerMenuColumns: FooterMenuColumn[] = [
  {
    id: "about",
    label: "Η ΔΕΥΑΑ",
    links: [
      { label: "Σχετικά", href: "/about" },
      { label: "Αποστολή", href: "/about/mission" },
      { label: "Διοίκηση", href: "/about/administration" },
      { label: "Διαγωνισμοί", href: "/tenders" },
    ],
  },
  {
    id: "sections",
    label: "Ενότητες",
    links: [
      { label: "Αρχική", href: "/" },
      { label: "Ανακοινώσεις", href: "/announcements" },
      { label: "Επικοινωνία", href: "/contact" },
      { label: "Κατάσταση προβλημάτων", href: "/problems" },
    ],
  },
  {
    id: "services",
    label: "Υπηρεσίες",
    links: [
      { label: "Όλες οι υπηρεσίες", href: "/services" },
      { label: "Ύδρευση", href: "/services/water" },
      { label: "Αποχέτευση", href: "/services/sewerage" },
      { label: "Δικαιολογητικά", href: "/services/documents" },
      { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
      { label: "Πληρωμή λογαριασμών", href: "/e-services/payment" },
      { label: "Δήλωση ένδειξης", href: "/e-services/meter-reading" },
      { label: "Υπολογισμός λογαριασμού", href: "/bill-calculator" },
      { label: "Αναφορά προβλήματος", href: "/problem-reporting" },
    ],
  },
];

/** Legal / policy links only — not duplicated in menu columns. */
export const footerLegalLinks: FooterLinkItem[] = [
  { label: "Πολιτική Απορρήτου", href: "/privacy" },
];

if (import.meta.env.DEV) {
  const seen = new Set<string>();
  for (const column of footerMenuColumns) {
    for (const link of column.links) {
      if (seen.has(link.href)) {
        throw new Error(`[deyaaFooterLinks] Duplicate footer href: ${link.href}`);
      }
      seen.add(link.href);
    }
  }
  for (const link of footerLegalLinks) {
    if (seen.has(link.href)) {
      throw new Error(`[deyaaFooterLinks] Legal link duplicates menu href: ${link.href}`);
    }
  }
}
