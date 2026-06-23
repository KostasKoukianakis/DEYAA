import ydreyshImage from "@/assets/YDREYSH.webp";
import apoxetefshImage from "@/assets/APOXETEFSH.webp";
import dikaiologhtikaImage from "@/assets/DIKAIOLOGHTIKA.webp";
import type { ServiceDecorIconId } from "@/components/PalladioServiceDecorIcon";

export interface ServiceContentBullet {
  label: string;
  text: string;
}

export interface ServiceContentBlock {
  id: string;
  title: string;
  /** Faded decor icon — semantic Lucide icon per accordion block */
  decorIconId: ServiceDecorIconId;
  paragraphs?: string[];
  introBeforeBullets?: string;
  bullets?: ServiceContentBullet[];
}

export interface DeyaaServicesHubSection {
  id: "water" | "sewerage" | "documents";
  title: string;
  lead: string;
  leadHighlights?: string[];
  image: string;
  blocks: ServiceContentBlock[];
}

/** Palladio /services/ — DEYAA municipal services tabs */
export const deyaaServicesHubSections: DeyaaServicesHubSection[] = [
  {
    id: "water",
    title: "Ύδρευση",
    lead:
      "Η ΔΕΥΑΑ είναι υπεύθυνη για την παροχή καθαρού πόσιμου νερού σε όλους τους κατοίκους του Αποκόρωνα. Το δίκτυο ύδρευσης καλύπτει την περιοχή ευθύνης μας και παρέχει νερό υψηλής ποιότητας που ελέγχεται καθημερινά.",
    leadHighlights: ["πόσιμου νερού", "υψηλής ποιότητας"],
    image: ydreyshImage,
    blocks: [
      {
        id: "water-connection",
        title: "Νέα σύνδεση ύδρευσης",
        decorIconId: "plug",
        paragraphs: [
          "Για νέα σύνδεση στο δίκτυο ύδρευσης, υποβάλλετε αίτηση στα γραφεία μας με τα απαιτούμενα δικαιολογητικά. Το τεχνικό τμήμα ελέγχει τη δυνατότητα σύνδεσης και προγραμματίζει την εγκατάσταση.",
        ],
        introBeforeBullets: "Τι θα χρειαστείτε:",
        bullets: [
          { label: "Αίτηση", text: "υποβολή αίτησης στα γραφεία της ΔΕΥΑΑ." },
          { label: "Τίτλος ιδιοκτησίας", text: "τίτλος ιδιοκτησίας ή μισθωτήριο συμβόλαιο." },
          { label: "Άδεια οικοδομής", text: "για νέες κατασκευές, σύμφωνα με την ισχύουσα νομοθεσία." },
          { label: "Ταυτότητα", text: "δελτίο αστυνομικής ταυτότητας του αιτούντος." },
        ],
      },
      {
        id: "water-details",
        title: "Αλλαγή στοιχείων",
        decorIconId: "clipboard-list",
        paragraphs: [
          "Σε περίπτωση μεταβίβασης, αλλαγής επωνυμίας ή διόρθωσης στοιχείων καταναλωτή, υποβάλλεται σχετική αίτηση με τα αποδεικτικά έγγραφα.",
        ],
        introBeforeBullets: "Η διαδικασία περιλαμβάνει:",
        bullets: [
          { label: "Αίτηση αλλαγής", text: "συμπλήρωση και υποβολή εντύπου αλλαγής στοιχείων." },
          { label: "Αποδεικτικά", text: "νέος τίτλος ιδιοκτησίας ή μισθωτήριο, όπου απαιτείται." },
          { label: "Εξόφληση", text: "εξόφληση τυχόν εκκρεμών οφειλών πριν την οριστική ενημέρωση." },
        ],
      },
      {
        id: "water-quality",
        title: "Ποιότητα νερού",
        decorIconId: "flask-conical",
        paragraphs: [
          "Το νερό που παρέχει η ΔΕΥΑΑ ελέγχεται σε διαπιστευμένα εργαστήρια για να διασφαλίζεται η τήρηση όλων των προτύπων ποιότητας.",
        ],
        introBeforeBullets: "Οι βασικοί έλεγχοι περιλαμβάνουν:",
        bullets: [
          { label: "Μικροβιολογικοί δείκτες", text: "συνεχής παρακολούθηση της ασφάλειας του πόσιμου νερού." },
          { label: "Χημικές παράμετροι", text: "έλεγχος συμμόρφωσης με τις ισχύουσες οριακές τιμές." },
          { label: "pH & αγωγιμότητα", text: "παρακολούθηση βασικών φυσικοχημικών μεγεθών." },
          { label: "Υπολειμματικό χλώριο", text: "διασφάλιση απολύμανσης και προστασίας του δικτύου." },
        ],
      },
      {
        id: "water-maintenance",
        title: "Συντήρηση & επισκευές",
        decorIconId: "wrench",
        paragraphs: [
          "Τα συνεργεία μας συντηρούν το δίκτυο ύδρευσης και ανταποκρίνονται άμεσα σε βλάβες και διαρροές, με στόχο τη συνεχή και αξιόπιστη παροχή.",
        ],
        introBeforeBullets: "Υπηρεσίες που παρέχουμε:",
        bullets: [
          { label: "Συντήρηση δικτύου", text: "προληπτικοί έλεγχοι και συντήρηση αγωγών και εξοπλισμού." },
          { label: "Επισκευή διαρροών", text: "άμεση κινητοποίηση συνεργείων για αποκατάσταση βλαβών." },
          { label: "Υδρομέτρα", text: "αντικατάσταση ή έλεγχος υδρομέτρων όπου απαιτείται." },
          { label: "24/7", text: "επείγουσες επεμβάσεις για σοβαρές διαρροές — 28253-40213." },
        ],
      },
    ],
  },
  {
    id: "sewerage",
    title: "Αποχέτευση",
    lead:
      "Η ΔΕΥΑΑ διαχειρίζεται το δίκτυο αποχέτευσης της περιοχής — από τη συλλογή και μεταφορά έως την επεξεργασία λυμάτων — με σύγχρονες μεθόδους και σεβασμό στο περιβάλλον.",
    leadHighlights: ["επεξεργασία λυμάτων", "σύγχρονες μεθόδους"],
    image: apoxetefshImage,
    blocks: [
      {
        id: "sewerage-connection",
        title: "Νέα σύνδεση αποχέτευσης",
        decorIconId: "plug",
        paragraphs: [
          "Η σύνδεση στο δημόσιο δίκτυο αποχέτευσης απαιτεί τεχνική μελέτη και έγκριση, ώστε να διασφαλίζεται η ορθή λειτουργία του δικτύου.",
        ],
        introBeforeBullets: "Απαιτούμενα δικαιολογητικά:",
        bullets: [
          { label: "Αίτηση σύνδεσης", text: "υποβολή αίτησης στα γραφεία της ΔΕΥΑΑ." },
          { label: "Τοπογραφικό", text: "τοπογραφικό διάγραμμα της ακίνητης περιουσίας." },
          { label: "Άδεια οικοδομής", text: "όπου απαιτείται για νέες κατασκευές." },
          { label: "Εγγύηση", text: "κατάθεση εγγύησης σύμφωνα με την ισχύουσα τιμολογιακή πολιτική." },
        ],
      },
      {
        id: "sewerage-repairs",
        title: "Βλάβες & αποφράξεις",
        decorIconId: "wrench",
        paragraphs: [
          "Σε περίπτωση βλάβης ή απόφραξης, τα συνεργεία μας κινητοποιούνται για άμεση επέμβαση και αποκατάσταση της ομαλής λειτουργίας του δικτύου.",
        ],
        introBeforeBullets: "Πώς να ενημερώσετε:",
        bullets: [
          { label: "Τηλεφωνικά", text: "καλέστε το 28253-40213 για άμεση εξυπηρέτηση." },
          { label: "24/7", text: "επείγουσες περιπτώσεις αντιμετωπίζονται όλο το εικοσιτετράωρο." },
          { label: "Online αναφορά", text: "μέσω της φόρμας αναφοράς προβλήματος στις Ηλεκτρονικές Υπηρεσίες." },
          { label: "Συντήρηση", text: "προγραμματισμένες εργασίες συντήρησης για πρόληψη αποφράξεων." },
        ],
      },
      {
        id: "sewerage-treatment",
        title: "Επεξεργασία λυμάτων",
        decorIconId: "factory",
        paragraphs: [
          "Οι εγκαταστάσεις επεξεργασίας λυμάτων της ΔΕΥΑΑ λειτουργούν με σύγχρονες τεχνολογίες για την προστασία του υδροφορέα και του περιβάλλοντος.",
        ],
        introBeforeBullets: "Βασικές διαδικασίες:",
        bullets: [
          { label: "Βιολογική επεξεργασία", text: "φυσικοχημικές διεργασίες για την απομάκρυνση ρύπων." },
          { label: "Χημική επεξεργασία", text: "συμπληρωματικοί έλεγχοι όπου απαιτείται." },
          { label: "Έλεγχοι ποιότητας", text: "τακτική παρακολούθηση εξερχόμενων λυμάτων." },
          { label: "Βιώσιμη διαχείριση", text: "συνεχής βελτίωση της απόδοσης των εγκαταστάσεων." },
        ],
      },
      {
        id: "sewerage-rules",
        title: "Κανόνες χρήσης δικτύου",
        decorIconId: "shield-alert",
        paragraphs: [
          "Η ορθή χρήση του δικτύου αποχέτευσης προστατεύει την υγεία, το περιβάλλον και την απρόσκοπτη λειτουργία των εγκαταστάσεων.",
        ],
        introBeforeBullets: "Απαγορεύεται η απόρριψη:",
        bullets: [
          { label: "Λιπών & ελαίων", text: "προκαλούν αποφράξεις και βλάβες στο δίκτυο." },
          { label: "Χημικών ουσιών", text: "επηρεάζουν την επεξεργασία και το περιβάλλον." },
          { label: "Μπαταριών & φαρμάκων", text: "απαιτούν ειδική συλλογή και διαχείριση." },
          { label: "Οικοδομικών υλικών", text: "προκαλούν φραγμούς και σοβαρές βλάβες." },
        ],
      },
    ],
  },
  {
    id: "documents",
    title: "Δικαιολογητικά",
    lead:
      "Κατεβάστε τα απαραίτητα έντυπα για τις υπηρεσίες της ΔΕΥΑΑ. Μπορείτε να τα υποβάλετε αυτοπροσώπως στα γραφεία μας ή ηλεκτρονικά, σύμφωνα με τις οδηγίες κάθε υπηρεσίας.",
    leadHighlights: ["απαραίτητα έντυπα", "ηλεκτρονικά"],
    image: dikaiologhtikaImage,
    blocks: [
      {
        id: "documents-how",
        title: "Πώς χρησιμοποιείτε τα έντυπα",
        decorIconId: "file-text",
        paragraphs: [
          "Κάθε έντυπο αντιστοιχεί σε συγκεκριμένη διαδικασία — σύνδεση, αλλαγή στοιχείων, δήλωση ή άλλη αίτηση. Συμπληρώστε τα στοιχεία με ακρίβεια και συνοδεύστε την αίτηση με τα απαιτούμενα δικαιολογητικά.",
        ],
        introBeforeBullets: "Βήματα υποβολής:",
        bullets: [
          { label: "Λήψη", text: "κατεβάστε το έντυπο από τη λίστα παρακάτω." },
          { label: "Συμπλήρωση", text: "συμπληρώστε όλα τα υποχρεωτικά πεδία." },
          { label: "Υποβολή", text: "αυτοπροσώπως στα γραφεία ή ηλεκτρονικά, όπου επιτρέπεται." },
          { label: "Παρακολούθηση", text: "κρατήστε αντίγραφο της αίτησης για το αρχείο σας." },
        ],
      },
      {
        id: "documents-support",
        title: "Υποστήριξη πολιτών",
        decorIconId: "headset",
        paragraphs: [
          "Για διευκρινίσεις σχετικά με τα απαιτούμενα δικαιολογητικά ή τη διαδικασία υποβολής, η εξυπηρέτηση πολιτών είναι στη διάθεσή σας.",
        ],
        introBeforeBullets: "Επικοινωνία:",
        bullets: [
          { label: "Τηλέφωνο", text: "28253-40213 — Δευτέρα–Παρασκευή." },
          { label: "Email", text: "info@deyaa.gr για γραπτές διευκρινίσεις." },
          { label: "Γραφεία", text: "Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008." },
          { label: "e-Services", text: "για online διαδικασίες, επισκεφθείτε τις Ηλεκτρονικές Υπηρεσίες." },
        ],
      },
    ],
  },
];

export const deyaaServicesHubCopy = {
  headline: "Υπηρεσίες",
  heroIntro:
    "Οι λύσεις μας κάνουν τη διαφορά επειδή αναλαμβάνουμε την ευθύνη να λειτουργούν — με συνέπεια, ευελιξία και βιώσιμες υπηρεσίες. Έτσι μπορούμε να σας στηρίξουμε.",
};

export type DeyaaServiceTabId = DeyaaServicesHubSection["id"];

export function getServiceTabHash(id: DeyaaServiceTabId): string {
  return `#item-${id}`;
}

export function getServiceTabIdFromHash(hash: string): DeyaaServiceTabId | null {
  const raw = hash.replace(/^#/, "");
  const id = raw.startsWith("item-") ? raw.slice("item-".length) : raw;
  return deyaaServicesHubSections.some((section) => section.id === id)
    ? (id as DeyaaServiceTabId)
    : null;
}
