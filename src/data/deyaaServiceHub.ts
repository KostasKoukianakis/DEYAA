import ydreyshImage from "@/assets/YDREYSH.webp";
import apoxetefshImage from "@/assets/APOXETEFSH.webp";
import dikaiologhtikaImage from "@/assets/DIKAIOLOGHTIKA.webp";

export interface DeyaaServiceHubItem {
  id: string;
  title: string;
  body: string;
  href: string;
  image: string;
}

/** Palladio Innovation Hub — 3 core DEYAA service domains */
export const deyaaServiceHubItems: DeyaaServiceHubItem[] = [
  {
    id: "water",
    title: "Ύδρευση",
    body: "Παροχή καθαρού πόσιμου νερού υψηλής ποιότητας σε όλα τα νοικοκυριά και επιχειρήσεις του Αποκόρωνα. Συνεχής παρακολούθηση, ποιοτικοί έλεγχοι και επέκταση δικτύων για σταθερή πρόσβαση στο νερό.",
    href: "/services#item-water",
    image: ydreyshImage,
  },
  {
    id: "sewerage",
    title: "Αποχέτευση",
    body: "Συλλογή, μεταφορά και επεξεργασία λυμάτων με σύγχρονες μεθόδους. Προστασία του υδροφορέα και βιώσιμη διαχείριση των αποβλήτων για τις γενιές που έρχονται.",
    href: "/services#item-sewerage",
    image: apoxetefshImage,
  },
  {
    id: "documents",
    title: "Δικαιολογητικά",
    body: "Έντυπα αιτήσεων, απαιτούμενα δικαιολογητικά και ψηφιακές διαδικασίες — όλα σε ένα σημείο. Λιγότερη γραφειοκρατία, περισσότερη αποτελεσματικότητα για τον πολίτη.",
    href: "/services#item-documents",
    image: dikaiologhtikaImage,
  },
];
