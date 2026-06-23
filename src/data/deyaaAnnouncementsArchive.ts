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
    image: "/hero/sustain_water.webp",
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
    image: "/hero/homepageimage.webp",
    imageAlt: "Ψηφιακές υπηρεσίες ΔΕΥΑΑ",
  },
  {
    href: "/announcements/arch-03",
    image: "/hero/koyrnas.webp",
    imageAlt: "Αναβάθιση δικτύου ύδρευσης",
  },
  {
    href: "/announcements/arch-04",
    image: "/hero/deksameni.webp",
    imageAlt: "Συντήρηση δικτύου ΔΕΥΑΑ",
  },
  {
    href: "/announcements/arch-05",
    image: "/hero/03_c.webp",
    imageAlt: "Οικονομία νερού",
  },
  {
    href: "/announcements/arch-06",
    image: "/hero/03_d.webp",
    imageAlt: "Ωράριο ταμείου ΔΕΥΑΑ",
  },
];

export const deyaaAnnouncementsArchiveCopy = {
  title: "Ανακοινώσεις",
  description:
    "Όλα τα τελευταία νέα από μια οργάνωση σε συνεχή εξέλιξη. Διαβάστε ενημερώσεις, έργα και ιστορίες για τον πολίτη και το μέλλον.",
  filtersLabel: "Μπορεί να σας ενδιαφέρει",
  loading: "Φόρτωση ανακοινώσεων…",
  empty: "Δεν βρέθηκαν ανακοινώσεις σε αυτή την κατηγορία.",
  error: "Σφάλμα φόρτωσης ανακοινώσεων.",
};

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

const defaultImages = [
  "/hero/homepageimage.webp",
  "/hero/koyrnas.webp",
  "/hero/deksameni.webp",
  "/hero/sustain_water.webp",
  "/hero/03_c.webp",
  "/hero/03_d.webp",
];

export function pickFallbackImage(index: number): string {
  return defaultImages[index % defaultImages.length];
}
