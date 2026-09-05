import { deyaaNewsImages } from "@/data/deyaaNewsImages";

export interface DeyaaNewsPost {
  id: string;
  date: string;
  dateIso?: string;
  tabLabel: string;
  titleLines: [string, string];
  href: string;
  image: string;
  imageAlt: string;
}

export const deyaaNewsPosts: DeyaaNewsPost[] = [
  {
    id: "news-01",
    date: "28 Απριλίου 2026",
    dateIso: "2026-04-28",
    tabLabel: "01 Εργαστήρια βιωσιμότητας",
    titleLines: [
      "Μαζί για ένα μέλλον με λιγότερες εκπομπές:",
      "τα εργαστήριά μας",
    ],
    href: "/announcements/arch-01",
    image: deyaaNewsImages.workshops,
    imageAlt: "Εργαστήρια βιωσιμότητας ΔΕΥΑΑ",
  },
  {
    id: "news-02",
    date: "13 Απριλίου 2026",
    dateIso: "2026-04-13",
    tabLabel: "02 Ψηφιακές υπηρεσίες",
    titleLines: [
      "Νέες ψηφιακές υπηρεσίες:",
      "πληρωμές και δηλώσεις online",
    ],
    href: "/announcements/arch-02",
    image: deyaaNewsImages.digital,
    imageAlt: "Ψηφιακές υπηρεσίες ΔΕΥΑΑ",
  },
  {
    id: "news-03",
    date: "23 Ιανουαρίου 2026",
    dateIso: "2026-01-23",
    tabLabel: "03 Αναβάθιση δικτύου",
    titleLines: [
      "Αναβάθιση δικτύου ύδρευσης",
      "με έμφαση στον πολίτη",
    ],
    href: "/announcements/arch-03",
    image: deyaaNewsImages.waterNetwork,
    imageAlt: "Αναβάθιση δικτύου ύδρευσης ΔΕΥΑΑ",
  },
];
