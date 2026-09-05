import { deyaaNewsImageList, deyaaNewsImages } from "@/data/deyaaNewsImages";

export interface AnnouncementArchiveItem {
  id: string;
  title: string;
  date: string;
  dateIso: string;
  category: string;
  categorySlug: string;
  href: string;
  image: string;
  imageAlt: string;
}

/** Static fallback when Supabase posts are empty */
export const deyaaAnnouncementsFallback: AnnouncementArchiveItem[] = [
  {
    id: "arch-01",
    title: "Μαζί για ένα μέλλος με λιγότερες εκπομπές: τα εργαστήριά μας",
    date: "28 Απριλίου 2026",
    dateIso: "2026-04-28",
    category: "Βιωσιμότητα",
    categorySlug: "sustainability",
    href: "/announcements/arch-01",
    image: deyaaNewsImages.workshops,
    imageAlt: "Εργαστήρια βιωσιμότητας ΔΕΥΑΑ",
  },
  {
    id: "arch-02",
    title: "Νέες ψηφιακές υπηρεσίες: πληρωμές και δηλώσεις online",
    date: "13 Απριλίου 2026",
    dateIso: "2026-04-13",
    category: "Ανακοινώσεις",
    categorySlug: "news",
    href: "/announcements/arch-02",
    image: deyaaNewsImages.digital,
    imageAlt: "Ψηφιακές υπηρεσίες ΔΕΥΑΑ",
  },
  {
    id: "arch-03",
    title: "Αναβάθιση δικτύου ύδρευσης με έμφαση στον πολίτη",
    date: "23 Ιανουαρίου 2026",
    dateIso: "2026-01-23",
    category: "Έργα",
    categorySlug: "projects",
    href: "/announcements/arch-03",
    image: deyaaNewsImages.waterNetwork,
    imageAlt: "Αναβάθιση δικτύου ύδρευσης ΔΕΥΑΑ",
  },
  {
    id: "arch-04",
    title: "Ενημέρωση για προγραμματισμένη συντήρηση δικτύου στον Αποκόρωνα",
    date: "15 Ιανουαρίου 2026",
    dateIso: "2026-01-15",
    category: "Ανακοινώσεις",
    categorySlug: "news",
    href: "/announcements/arch-04",
    image: deyaaNewsImages.maintenance,
    imageAlt: "Προγραμματισμένη συντήρηση δικτύου ΔΕΥΑΑ",
  },
  {
    id: "arch-05",
    title: "Οδηγίες οικονομίας νερού για το καλοκαίρι 2026",
    date: "10 Δεκεμβρίου 2025",
    dateIso: "2025-12-10",
    category: "Βιωσιμότητα",
    categorySlug: "sustainability",
    href: "/announcements/arch-05",
    image: deyaaNewsImages.summerSaving,
    imageAlt: "Οδηγίες οικονομίας νερού ΔΕΥΑΑ",
  },
  {
    id: "arch-06",
    title: "Ανακοίνωση ωραρίου λειτουργίας ταμείου τις εορταστικές ημέρες",
    date: "20 Νοεμβρίου 2025",
    dateIso: "2025-11-20",
    category: "Ανακοινώσεις",
    categorySlug: "news",
    href: "/announcements/arch-06",
    image: deyaaNewsImages.holidayHours,
    imageAlt: "Ωράριο ταμείου ΔΕΥΑΑ",
  },
  {
    id: "arch-07",
    title: "Ολοκλήρωση φάσης αναβάθισης δικτύου αποχέτευσης στη Βρύση",
    date: "5 Οκτωβρίου 2025",
    dateIso: "2025-10-05",
    category: "Έργα",
    categorySlug: "projects",
    href: "/announcements/arch-07",
    image: deyaaNewsImages.vrysiSewer,
    imageAlt: "Αναβάθιση αποχέτευσης στη Βρύση",
  },
];

/** Map DB category labels to Palladio-style filter slugs */
export function categoryToSlug(category: string): string {
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("βιωσι") || normalized.includes("sustain")) return "sustainability";
  if (normalized.includes("έργ") || normalized.includes("εργ") || normalized.includes("project")) {
    return "projects";
  }
  if (normalized.includes("διαγων") || normalized.includes("tender")) return "tenders";
  return "news";
}

export function slugToLabel(slug: string): string {
  switch (slug) {
    case "sustainability":
      return "Βιωσιμότητα";
    case "projects":
      return "Έργα";
    case "tenders":
      return "Διαγωνισμοί";
    default:
      return "Ανακοινώσεις";
  }
}

export function pickFallbackImage(index: number): string {
  return deyaaNewsImageList[index % deyaaNewsImageList.length];
}
