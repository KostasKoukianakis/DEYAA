/** Official DEYAA citizen services portal (Taxisnet-backed transactions). */
export const DEYAA_SERVICES_PORTAL_BASE =
  import.meta.env.VITE_DEYAA_SERVICES_PORTAL_URL ?? "https://services.deyaa.gr/";

export interface DeyaaPortalServiceHandoff {
  id: string;
  portalUrl: string;
  /** Label shown on services.deyaa.gr after login — helps users find the right tile. */
  portalMenuLabel: string;
  ctaLabel: string;
  steps: string[];
  requirements: string[];
}

export const deyaaPortalHandoffs: Record<string, DeyaaPortalServiceHandoff> = {
  payment: {
    id: "payment",
    portalUrl: DEYAA_SERVICES_PORTAL_BASE,
    portalMenuLabel: "Γρήγορη πληρωμή",
    ctaLabel: "Συνέχεια στην πλατφόρμα πληρωμών",
    steps: [
      "Θα μεταφερθείτε στην επίσημη πλατφόρμα ηλεκτρονικών υπηρεσιών της ΔΕΥΑΑ.",
      "Συνδεθείτε με Taxisnet (ή επιλέξτε σύνδεση επισκέπτη, αν διατίθεται).",
      "Επιλέξτε «Γρήγορη πληρωμή» ή «Οι οφειλές μου».",
      "Ολοκληρώστε την πληρωμή και αποθηκεύστε την απόδειξη.",
    ],
    requirements: [
      "Αριθμός παροχής (αναγράφεται στον λογαριασμό)",
      "Πιστωτική ή χρεωστική κάρτα (για online πληρωμή)",
      "Λογαριασμός Taxisnet (για πλήρη πρόσβαση στις οφειλές σας)",
    ],
  },
  "meter-reading": {
    id: "meter-reading",
    portalUrl: DEYAA_SERVICES_PORTAL_BASE,
    portalMenuLabel: "Καταχώριση μέτρησης",
    ctaLabel: "Συνέχεια στην καταχώριση μέτρησης",
    steps: [
      "Θα μεταφερθείτε στην επίσημη πλατφόρμα ηλεκτρονικών υπηρεσιών της ΔΕΥΑΑ.",
      "Συνδεθείτε με Taxisnet.",
      "Επιλέξτε «Καταχώριση μέτρησης».",
      "Εισάγετε την ένδειξη του υδρομέτρου και υποβάλετε τη δήλωση.",
    ],
    requirements: [
      "Αριθμός παροχής",
      "Τρέχουσα ένδειξη υδρομέτρου (μόνο τα μαύρα ψηφία)",
      "Λογαριασμός Taxisnet",
    ],
  },
};

export function getPortalHandoff(serviceId: string): DeyaaPortalServiceHandoff | undefined {
  return deyaaPortalHandoffs[serviceId];
}
