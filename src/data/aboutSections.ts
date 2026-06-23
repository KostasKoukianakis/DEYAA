export const aboutSections = [
  { id: "about-hero", index: "00", label: "Αρχική" },
  { id: "about-history", index: "01", label: "Ιστορία" },
  { id: "about-vision", index: "02", label: "Όραμα / Αποστολή" },
] as const;

export type AboutSection = (typeof aboutSections)[number];
