export interface DeyaaNewsPost {
  id: string;
  date: string;
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
    tabLabel: "01 Εργαστήρια βιωσιμότητας",
    titleLines: [
      "Μαζί για ένα μέλλον με λιγότερες εκπομπές:",
      "τα εργαστήριά μας",
    ],
    href: "/announcements",
    image: "/hero/sustain_water.webp",
    imageAlt: "Εργαστήρια βιωσιμότητας ΔΕΥΑΑ",
  },
  {
    id: "news-02",
    date: "13 Απριλίου 2026",
    tabLabel: "02 Ψηφιακές υπηρεσίες",
    titleLines: [
      "Νέες ψηφιακές υπηρεσίες:",
      "πληρωμές και δηλώσεις online",
    ],
    href: "/announcements",
    image: "/hero/homepageimage.webp",
    imageAlt: "Ψηφιακές υπηρεσίες ΔΕΥΑΑ",
  },
  {
    id: "news-03",
    date: "23 Ιανουαρίου 2026",
    tabLabel: "03 Αναβάθιση δικτύου",
    titleLines: [
      "Αναβάθιση δικτύου ύδρευσης",
      "με έμφαση στον πολίτη",
    ],
    href: "/announcements",
    image: "/hero/koyrnas.webp",
    imageAlt: "Αναβάθιση δικτύου ύδρευσης ΔΕΥΑΑ",
  },
];
