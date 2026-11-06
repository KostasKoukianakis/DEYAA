export const WATER_QUALITY_CATEGORIES = [
  "analysis",
  "monitoring",
  "statistics",
  "lab_report",
  "education",
] as const;

export type WaterQualityCategory = (typeof WATER_QUALITY_CATEGORIES)[number];

export interface WaterQualityRecordView {
  id: string;
  title: string;
  summary: string;
  category: WaterQualityCategory;
  location: string | null;
  samplingDate: string | null;
  publishedAt: string | null;
  filePath: string | null;
  fileName: string | null;
  isPublished: boolean;
}

export const waterQualityFallbackRecords: WaterQualityRecordView[] = [
  {
    id: "wq-fallback-analysis",
    title: "Μικροβιολογικός και χημικός έλεγχος — Αποκόρωνας",
    summary:
      "Αποτελέσματα τακτικού ελέγχου πόσιμου νερού στα δίκτυα της ΔΕΥΑΑ. Οι πλήρεις εκθέσεις θα αναρτώνται από το dashboard μόλις παραληφθούν από το εργαστήριο.",
    category: "analysis",
    location: "Αποκόρωνας",
    samplingDate: "2026-09-01",
    publishedAt: "2026-09-15T09:00:00.000Z",
    filePath: null,
    fileName: null,
    isPublished: true,
  },
  {
    id: "wq-fallback-monitoring",
    title: "Πρόγραμμα παρακολούθησης πόσιμου νερού 2026",
    summary:
      "Ετήσιο πρόγραμμα δειγματοληψιών σύμφωνα με την ΚΥΑ Δ1/ΓΠ οικ.27829/2023 και τις απαιτήσεις εποπτείας της ΡΑΑΕΥ.",
    category: "monitoring",
    location: null,
    samplingDate: null,
    publishedAt: "2026-01-20T09:00:00.000Z",
    filePath: null,
    fileName: null,
    isPublished: true,
  },
  {
    id: "wq-fallback-statistics",
    title: "Στατιστικά μετρήσεων ποιότητας νερού",
    summary:
      "Συγκεντρωτικά στοιχεία φυσικοχημικών και μικροβιολογικών παραμέτρων ανά περίοδο ελέγχου.",
    category: "statistics",
    location: "Αποκόρωνας",
    samplingDate: null,
    publishedAt: "2026-06-30T09:00:00.000Z",
    filePath: null,
    fileName: null,
    isPublished: true,
  },
  {
    id: "wq-fallback-lab",
    title: "Εκθέσεις διαπιστευμένων εργαστηρίων",
    summary:
      "Εργαστηριακές εκθέσεις ελέγχου νερού ανθρώπινης κατανάλωσης. Τα PDF αναρτώνται από τη διαχείριση της ιστοσελίδας.",
    category: "lab_report",
    location: null,
    samplingDate: null,
    publishedAt: "2026-07-10T09:00:00.000Z",
    filePath: null,
    fileName: null,
    isPublished: true,
  },
  {
    id: "wq-fallback-education",
    title: "Ασφάλεια πόσιμου νερού — ενημερωτικό υλικό",
    summary:
      "Πληροφορίες για το τι ελέγχεται στο νερό του δικτύου, τι σημαίνουν οι βασικές παράμετροι και πώς ενημερώνεται ο καταναλωτής.",
    category: "education",
    location: null,
    samplingDate: null,
    publishedAt: "2026-03-22T09:00:00.000Z",
    filePath: null,
    fileName: null,
    isPublished: true,
  },
];
