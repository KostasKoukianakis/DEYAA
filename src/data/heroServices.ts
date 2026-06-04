import {
  AlertCircle,
  Bell,
  CreditCard,
  Droplets,
  HeartHandshake,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";

export interface HeroServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon: LucideIcon;
}

/** Palladio footer row — DEYAA e-services (inspired by deyach.gr) */
export const heroServices: HeroServiceItem[] = [
  {
    id: "social-tariff",
    title: "Κοινωνικό Τιμολόγιο",
    description:
      "Ενημερωθείτε για τις εκπτώσεις, τους δικαιούχους και τα δικαιολογητικά για να ενταχθείτε στο κοινωνικό τιμολόγιο.",
    href: "/services/documents",
    icon: HeartHandshake,
  },
  {
    id: "fault-report",
    title: "Online Δήλωση Βλαβών",
    description:
      "Δηλώστε εύκολα και γρήγορα τη βλάβη σας online — χωρίς αναμονή στην τηλεφωνική γραμμή.",
    href: "/problem-reporting",
    icon: AlertCircle,
  },
  {
    id: "water-quality",
    title: "Ποιότητα Νερού",
    description:
      "Ενημερωθείτε για την ποιότητα του πόσιμου νερού και τις τακτικές αναλύσεις της ΔΕΥΑΑ.",
    href: "/services/water",
    icon: Droplets,
  },
  {
    id: "payment",
    title: "i-Bill",
    description:
      "Άμεση εξόφληση των λογαριασμών σας μόνο με τη χρήση του κωδικού πληρωμής.",
    href: "/e-services/payment",
    secondaryHref: "/e-services/payment",
    secondaryLabel: "Οδηγίες χρήσης i-Bill",
    icon: CreditCard,
  },
  {
    id: "e-services",
    title: "e-Services",
    description:
      "Πληροφορίες και πληρωμή λογαριασμών, με εγγραφή στην ηλεκτρονική εφαρμογή.",
    href: "/e-services",
    secondaryHref: "/e-services",
    secondaryLabel: "Οδηγίες χρήσης e-Services",
    icon: MonitorSmartphone,
  },
  {
    id: "announcements",
    title: "Συμβαίνει τώρα",
    description:
      "Ενημερωθείτε για τις πιο πρόσφατες διακοπές υδροδότησης και τις τελευταίες ανακοινώσεις μας.",
    href: "/announcements",
    icon: Bell,
  },
];
