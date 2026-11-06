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
      { label: "Αποστολή", href: "/about#about-vision" },
      { label: "Διοίκηση", href: "/about#about-hero" },
    ],
  },
  {
    id: "sections",
    label: "Ενότητες",
    links: [
      { label: "Αρχική", href: "/" },
      { label: "Ανακοινώσεις", href: "/announcements" },
      { label: "Ποιότητα νερού", href: "/water-quality" },
      { label: "Επικοινωνία", href: "/contact" },
    ],
  },
  {
    id: "services",
    label: "Υπηρεσίες",
    links: [
      { label: "Όλες οι υπηρεσίες", href: "/services" },
      { label: "Ύδρευση", href: "/services#item-water" },
      { label: "Αποχέτευση", href: "/services#item-sewerage" },
      { label: "Δικαιολογητικά", href: "/services#item-documents" },
      { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
      { label: "Πληρωμή λογαριασμών", href: "/e-services/payment" },
      { label: "Δήλωση ένδειξης", href: "/e-services/meter-reading" },
      { label: "Υπολογισμός λογαριασμού", href: "/e-services/bill-calculator" },
      { label: "Αναφορά προβλήματος", href: "/e-services/problem-reporting" },
    ],
  },
];

/** Legal / policy links only — not duplicated in menu columns. */
export const footerLegalLinks: FooterLinkItem[] = [
  { label: "Πολιτική Απορρήτου", href: "/privacy" },
  { label: "Όροι Χρήσης", href: "/terms" },
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
