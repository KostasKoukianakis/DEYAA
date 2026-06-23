export type TenderStatus = "current" | "past" | "cancelled";

export type TenderContractType = "works" | "supplies" | "services" | "other";

export interface TenderArchiveItem {
  id: string;
  title: string;
  description: string;
  date: string;
  dateIso: string;
  deadline: string;
  deadlineIso: string;
  budget: string | null;
  status: TenderStatus;
  announcementPdfPath: string | null;
  tenderDocumentsPath: string | null;
  refNumber: string;
  contractType: TenderContractType;
  cpv: string | null;
}

export const ESHDIS_URL = "https://www.promitheus.gov.gr/";
export const DIAVGEIA_URL = "https://diavgeia.gov.gr/";

export const deyaaTendersArchiveCopy = {
  title: "Διαγωνισμοί",
  description:
    "Προκηρύξεις, διακηρύξεις και τεύχη δημοπράτησης. Όλα τα απαραίτητα έγγραφα για συμμετοχή σε διαγωνισμούς της ΔΕΥΑΑ, με διαφάνεια και άμεση πρόσβαση.",
  filtersLabel: "Κατάσταση",
  typeFilterLabel: "Τύπος σύμβασης",
  yearFilterLabel: "Έτος",
  searchPlaceholder: "Αναζήτηση διαγωνισμού…",
  searchLabel: "Αναζήτηση",
  loading: "Φόρτωση διαγωνισμών…",
  empty: "Δεν βρέθηκαν διαγωνισμοί με τα επιλεγμένα κριτήρια.",
  error: "Σφάλμα φόρτωσης διαγωνισμών.",
  sectionCurrent: "Τρέχοντες διαγωνισμοί",
  sectionPast: "Αρχείο διαγωνισμών",
  publishedLabel: "Δημοσίευση",
  deadlineLabel: "Λήξη προσφορών",
  budgetLabel: "Προϋπολογισμός",
  announcementPdf: "Διακήρυξη",
  tenderDocuments: "Τεύχη",
  clarifications: "Διευκρινίσεις",
  submitOffer: "ΕΣΗΔΗΣ",
  eshdhsEyebrow: "Ηλεκτρονική υποβολή",
  eshdhsTitle: "ΕΣΗΔΗΣ",
  eshdhsDesc: "Υποβολή προσφορών μέσω promitheus.gov.gr",
  eshdhsCta: "Άνοιγμα πύλης",
  diavgeiaTitle: "Διαύγεια",
  diavgeiaDesc: "Δημοσιεύσεις και ΑΔΑ στο εθνικό σύστημα διαφάνειας",
  diavgeiaCta: "diavgeia.gov.gr",
  howToTitle: "Πώς συμμετέχω",
  howToSteps: [
    {
      step: "01",
      title: "Λήψη εγγράφων",
      desc: "Κατεβάστε τη διακήρυξη και τα τεύχη από την κάρτα του διαγωνισμού.",
    },
    {
      step: "02",
      title: "Εγγραφή στο ΕΣΗΔΗΣ",
      desc: "Δημιουργήστε λογαριασμό οικονομικού φορέα στο promitheus.gov.gr.",
    },
    {
      step: "03",
      title: "Υποβολή προσφοράς",
      desc: "Ανεβάστε την προσφορά σας ηλεκτρονικά πριν την καταληκτική ημερομηνία.",
    },
  ],
  kpiOpen: "Ανοιχτοί",
  kpiClosed: "Αρχείο",
  kpiTotalBudget: "Εκτιμ. αξία (ανοιχτοί)",
  kpiShowing: "Εμφάνιση",
  resultsCount: (n: number) =>
    n === 1 ? "1 διαγωνισμός" : `${n} διαγωνισμοί`,
  viewCards: "Κάρτες",
  viewTable: "Πίνακας",
  tableRef: "Αρ.",
  tableTitle: "Τίτλος",
  tableType: "Τύπος",
  tableStatus: "Κατάσταση",
  tableDocs: "Έγγραφα",
  daysLeft: "Ημέρες μέχρι λήξη",
  statusOpen: "Ανοιχτός",
  statusClosed: "Ολοκληρωμένος",
  statusCancelled: "Ακυρώθηκε",
  clearFilters: "Καθαρισμός",
};

export const contractTypeLabels: Record<TenderContractType, string> = {
  works: "Έργο",
  supplies: "Προμήθεια",
  services: "Υπηρεσία",
  other: "Γενικό",
};

export const deyaaTendersFallback: TenderArchiveItem[] = [
  {
    id: "tender-01",
    title: "Προμήθεια υλικών δικτύου ύδρευσης και αποχέτευσης",
    description:
      "Ανοικτός ηλεκτρονικός διαγωνισμός για την προμήθεια σωλήνων, εξαρτημάτων και εξοπλισμού δικτύου ύδρευσης–αποχέτευσης.",
    date: "15 Μαΐου 2026",
    dateIso: "2026-05-15",
    deadline: "30 Ιουνίου 2026",
    deadlineIso: "2026-06-30",
    budget: "125.000 €",
    status: "current",
    announcementPdfPath: null,
    tenderDocumentsPath: null,
    refNumber: "12-2026",
    contractType: "supplies",
    cpv: "44160000-9",
  },
  {
    id: "tender-02",
    title: "Υπηρεσία συντήρησης αντλιοστασίων και υποσταθμών",
    description:
      "Ανάθεση υπηρεσιών συντήρησης, επισκευής και τεχνικής υποστήριξης αντλιοστασίων ύδρευσης και λιμενικών εγκαταστάσεων.",
    date: "2 Μαΐου 2026",
    dateIso: "2026-05-02",
    deadline: "15 Ιουνίου 2026",
    deadlineIso: "2026-06-15",
    budget: "89.500 €",
    status: "current",
    announcementPdfPath: null,
    tenderDocumentsPath: null,
    refNumber: "09-2026",
    contractType: "services",
    cpv: "50532000-1",
  },
  {
    id: "tender-03",
    title: "Μελέτη και επίβλεψη αναβάθισης δικτύου ομβρίων υδάτων",
    description:
      "Ανάθεση μελέτης, επίβλεψης και διαχείρισης έργου για την αντιμετώπιση πλημμυρικών φαινομένων σε κεντρικές περιοχές.",
    date: "20 Απριλίου 2026",
    dateIso: "2026-04-20",
    deadline: "10 Ιουνίου 2026",
    deadlineIso: "2026-06-10",
    budget: "42.300 €",
    status: "current",
    announcementPdfPath: null,
    tenderDocumentsPath: null,
    refNumber: "07-2026",
    contractType: "works",
    cpv: "71320000-7",
  },
  {
    id: "tender-04",
    title: "Παροχή υπηρεσιών παραγωγής και αποστολής λογαριασμών",
    description:
      "Ολοκληρωμένος διαγωνισμός για την εκτύπωση, εμφακέλωση και αποστολή λογαριασμών ύδρευσης–αποχέτευσης.",
    date: "12 Ιανουαρίου 2026",
    dateIso: "2026-01-12",
    deadline: "28 Φεβρουαρίου 2026",
    deadlineIso: "2026-02-28",
    budget: "338.262 €",
    status: "past",
    announcementPdfPath: null,
    tenderDocumentsPath: null,
    refNumber: "03-2026",
    contractType: "services",
    cpv: "79810000-5",
  },
  {
    id: "tender-05",
    title: "Προμήθεια χημικών απολυμάντων και αναλωσίμων εργαστηρίου",
    description:
      "Ολοκληρωμένος διαγωνισμός προμηθειών για τις ανάγκες του εργαστηρίου ποιοτικού ελέγχου νερού.",
    date: "5 Νοεμβρίου 2025",
    dateIso: "2025-11-05",
    deadline: "20 Δεκεμβρίου 2025",
    deadlineIso: "2025-12-20",
    budget: "18.750 €",
    status: "past",
    announcementPdfPath: null,
    tenderDocumentsPath: null,
    refNumber: "18-2025",
    contractType: "supplies",
    cpv: "24300000-8",
  },
];

export function inferContractType(title: string): TenderContractType {
  const t = title.toLowerCase();
  if (
    t.includes("έργ") ||
    t.includes("εργ") ||
    t.includes("κατασκευ") ||
    t.includes("μελέτ") ||
    t.includes("μελετη")
  ) {
    return "works";
  }
  if (t.includes("υπηρεσ") || t.includes("συντήρη") || t.includes("παροχή")) {
    return "services";
  }
  if (t.includes("προμήθ") || t.includes("προμηθ")) {
    return "supplies";
  }
  return "other";
}

export function parseBudgetEuros(budget: string | null): number {
  if (!budget) return 0;
  const digits = budget.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

export function formatBudgetTotal(total: number): string {
  if (total <= 0) return "—";
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(total);
}

export function statusLabel(
  status: TenderStatus,
  copy = deyaaTendersArchiveCopy,
): string {
  switch (status) {
    case "current":
      return copy.statusOpen;
    case "past":
      return copy.statusClosed;
    case "cancelled":
      return copy.statusCancelled;
    default:
      return copy.statusOpen;
  }
}

export type TenderFilterSlug = "all" | "current" | "past";

export const tenderFilters: Array<{ slug: TenderFilterSlug; label: string }> = [
  { slug: "all", label: "Όλοι" },
  { slug: "current", label: "Ανοιχτοί" },
  { slug: "past", label: "Αρχείο" },
];

export type TenderTypeFilter = "all" | TenderContractType;

export const tenderTypeFilters: Array<{ slug: TenderTypeFilter; label: string }> = [
  { slug: "all", label: "Όλοι οι τύποι" },
  { slug: "works", label: "Έργα" },
  { slug: "supplies", label: "Προμήθειες" },
  { slug: "services", label: "Υπηρεσίες" },
];

export type TenderYearFilter = "all" | string;

export function getAvailableYears(items: TenderArchiveItem[]): string[] {
  const years = new Set(items.map((item) => item.dateIso.slice(0, 4)));
  return [...years].sort((a, b) => Number(b) - Number(a));
}
