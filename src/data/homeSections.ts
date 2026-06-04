export const homeSections = [
  { id: "section-01", index: "01", label: "Αρχική" },
  { id: "section-02", index: "02", label: "Βιωσιμότητα" },
  { id: "section-03", index: "03", label: "Υπηρεσίες" },
  { id: "section-04", index: "04", label: "Νέα" },
  { id: "section-05", index: "05", label: "Επικοινωνία" },
] as const;

export type HomeSection = (typeof homeSections)[number];
