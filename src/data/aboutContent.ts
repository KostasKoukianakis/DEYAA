import {
  Building2,
  HardHat,
  Landmark,
  Leaf,
  Lightbulb,
  Shield,
  Smartphone,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AboutTimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  /** Alternate marker above/below the timeline axis */
  align: "top" | "bottom";
  /** Optional chapter label spanning multiple milestones */
  chapter?: string;
  /** Scene image (right side, fades left) while this chapter is in view — set on chapter start only */
  chapterBackgroundImage?: string;
}

export interface AboutValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface BoardMember {
  name: string;
  role: string;
  position: string;
  image?: string;
  /** Fallback portrait gradient when no image is set */
  accent?: "ocean" | "sky" | "deep" | "teal" | "slate";
  /** Short DEYAA context shown on card hover */
  hoverDetail?: string;
}

export interface OrgDepartment {
  title: string;
  description: string;
}

export interface AboutCollaborationPartner {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface AboutMissionStat {
  value: string;
  unit?: string;
  label: string;
  description: string;
  delta?: string;
}

export interface AboutMissionArea {
  id: string;
  title: string;
  kicker: string;
  lead: string;
  stats: AboutMissionStat[];
  footnote?: string;
}

export const aboutHistoryIntro =
  "Η Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου (ΔΕΥΑΑ) συστάθηκε το 2024 και αναλαμβάνει τη διαχείριση δικτύων ύδρευσης, αποχέτευσης, βιολογικών καθαρισμών και μεγάλων έργων υποδομής σε όλη την επικράτεια του Δήμου Αποκορώνου.";

export const aboutTimelineMilestones: AboutTimelineMilestone[] = [
  {
    id: "long-effort",
    year: "Χρόνια",
    title: "Μακρά προσπάθεια για ίδια ΔΕΥΑ",
    description:
      "Η τοπική κοινωνία διεκδικούσε επί χρόνια αυτόνομη διαχείριση ύδρευσης και αποχέτευσης, με έμφαση στην προστασία του νερού και των υποδομών του τόπου.",
    align: "top",
    chapter: "Από την απόφαση\nστην ίδρυση",
    chapterBackgroundImage: "/hero/deksameni.webp",
  },
  {
    id: "council-approval",
    year: "30 Ιαν 2024",
    title: "Έγκριση από το Δημοτικό Συμβούλιο",
    description:
      "Το Δημοτικό Συμβούλιο Αποκορώνου ενέκρινε κατά πλειοψηφία (15 ναι, 8 παρών, 2 όχι) την ίδρυση και λειτουργία της ΔΕΥΑΑ.",
    align: "bottom",
  },
  {
    id: "fek-founding",
    year: "26 Απρ 2024",
    title: "Επίσημη ίδρυση στο ΦΕΚ",
    description:
      "Δημοσιεύτηκε στο ΦΕΚ 2506 Β'/26.04.2024 η απόφαση ίδρυσης — νομικό πρόσωπο ιδιωτικού δικαίου με κοινωφελή χαρακτήρα, σύμφωνα με τον Ν. 1060/80.",
    align: "top",
  },
  {
    id: "board-vamos",
    year: "22 Μαΐ 2024",
    title: "Συγκρότηση Δ.Σ. και έδρα στον Βάμο",
    description:
      "Συγκροτήθηκε το ενδεκαμελές Διοικητικό Συμβούλιο (πρόεδρος Ι. Αθητάκης), με συμμετοχή του ιδρύματος «Αγία Σοφία» και έδρα στο πρώην Δημαρχείο Βάμου.",
    align: "bottom",
    chapter: "Ύδρευση &\nαποχέτευση",
    chapterBackgroundImage: "/hero/map_pipes.webp",
  },
  {
    id: "georgioupolis-wwtp",
    year: "2014–σήμερα",
    title: "Αποχέτευση Γεωργιούπολης",
    description:
      "Ολοκληρωμένο έργο ~26 εκ. €: ΕΕΛ δυναμικότητας 19.286 ι.κ., δίκτυο αποχέτευσης ~42 χλμ. και υποθαλάσσιος αγωγός διάθεσης για Γεωργιούπολη, Καβρό, Βρύσες και τον κόλπο Αλμυρού.",
    align: "top",
  },
  {
    id: "kalives-eel-upgrade",
    year: "2024",
    title: "Αναβάθμιση ΕΕΛ Καλυβών",
    description:
      "Προμήθεια και εγκατάσταση νέου εξοπλισμού επεξεργασίας (MBR 200 m³/η, αφυδάτωση ιλύος, προεπεξεργασία) για την αντιμετώπιση υπερφόρτωσης και δυσοσμίας.",
    align: "bottom",
  },
  {
    id: "org-setup",
    year: "2024",
    title: "Οργάνωση & αδειοδοτήσεις",
    description:
      "Συστάθηκαν διοικητικές δομές, Οργανισμός Εσωτερικής Υπηρεσίας, Κανονισμός Λειτουργίας, πρώτος προϋπολογισμός και διαδικασίες λειτουργίας των υποδομών από το μηδέν.",
    align: "top",
    chapter: "Έργα &\nαδειοδότηση",
    chapterBackgroundImage: "/hero/tank-frames/frame_0120.webp",
  },
  {
    id: "almyrida-permit",
    year: "2025",
    title: "Βιολογικός Αλμυρίδας — άδεια",
    description:
      "Θετική περιβαλλοντική γνωμοδότηση για έργο 14,7 εκ. €: δίκτυο αποχέτευσης ~27 χλμ., 9 αντλιοστάσια και σύγχρονη μονάδα επεξεργασίας (4.800–6.200 ι.κ.).",
    align: "bottom",
  },
  {
    id: "billing-reform",
    year: "2025",
    title: "Δίκαιη τιμολόγηση νερού",
    description:
      "Μείωση χρέωσης σε 0,30€/κ.μ. για πάνω από 7.000 οικιακά υδρόμετρα και έκπτωση 5% για συνεπείς καταναλωτές.",
    align: "top",
    chapter: "Το νερό\nσήμερα",
    chapterBackgroundImage: "/hero/sustain_water.webp",
  },
  {
    id: "billing-normalization",
    year: "2025–26",
    title: "Ομαλοποίηση καταμετρήσεων",
    description:
      "Ολοκληρώθηκε η μετάβαση από την παλιά υπηρεσία ύδρευσης του Δήμου: τακτικές μετρήσεις, τετραμηνιαία τιμολόγηση και έκδοση λογαριασμών.",
    align: "bottom",
  },
  {
    id: "today",
    year: "Σήμερα",
    title: "Ψηφιακές υπηρεσίες & νέα ιστοσελίδα",
    description:
      "Πληρωμές, καταχώρηση ενδείξεων, αιτήματα και αναφορές βλαβών μέσω της ψηφιακής πλατφόρμας deyaa.gr.",
    align: "top",
  },
];

/** Chapter scene backgrounds — one entry per unique chapter (first milestone that opens it). */
export function getAboutTimelineChapterScenes() {
  const seen = new Set<string>();
  return aboutTimelineMilestones.flatMap((m) => {
    if (!m.chapter || !m.chapterBackgroundImage || seen.has(m.chapter)) return [];
    seen.add(m.chapter);
    return {
      chapter: m.chapter,
      chapterId: m.id,
      image: m.chapterBackgroundImage,
    };
  });
}

export const aboutVisionText =
  "Να αποτελέσουμε πρότυπο οργανισμό παροχής υπηρεσιών κοινής ωφέλειας, με σεβασμό στον πολίτη και το περιβάλλον, αξιοποιώντας τις νέες τεχνολογίες και τις βέλτιστες πρακτικές του κλάδου.";

export const aboutMissionText =
  "Η ΔΕΥΑΑ έχει ως αποστολή την παροχή υψηλής ποιότητας υπηρεσιών ύδρευσης και αποχέτευσης στους πολίτες της περιοχής, διασφαλίζοντας την προστασία της δημόσιας υγείας και του περιβάλλοντος. Δεσμευόμαστε για τη συνεχή βελτίωση των υποδομών μας και την εφαρμογή σύγχρονων μεθόδων διαχείρισης υδάτινων πόρων.";

export const aboutCollaborationTitleLines = [
  "Συνεργασίες που διαμορφώνουν",
  "το μέλλον του νερού.",
] as const;

/** @deprecated use aboutCollaborationTitleLines */
export const aboutCollaborationTitle = aboutCollaborationTitleLines.join(" ");

export const aboutCollaborationLead =
  "Καμία υπηρεσία κοινής ωφέλειας δεν λειτουργεί μόνη της. Η ΔΕΥΑΑ στηρίζεται σε ένα ενεργό δίκτυο δήμου, πολιτών, εργαζομένων και συνεργατών με τους οποίους μοιραζόμαστε όραμα, δέσμευση και ευθύνη. Μόνο μέσα από ανοιχτή συνεργασία γεννιούνται λύσεις που αναβαθμίζουν τις υπηρεσίες και προστατεύουν τον τόπο.";

export const aboutCollaborationPartners: AboutCollaborationPartner[] = [
  { id: "municipality", label: "Δήμος Αποκορώνου", icon: Building2 },
  { id: "citizens", label: "Πολίτες", icon: Users },
  { id: "board", label: "Διοίκηση", icon: Landmark },
  { id: "staff", label: "Εργαζόμενοι", icon: HardHat },
  { id: "environment", label: "Περιβάλλον", icon: Leaf },
  { id: "digital", label: "Ψηφιακές Υπηρεσίες", icon: Smartphone },
];

export const aboutValues: AboutValue[] = [
  {
    icon: Shield,
    title: "Ποιότητα",
    description:
      "Παροχή νερού υψηλής ποιότητας που πληροί τα αυστηρότερα πρότυπα ασφαλείας.",
  },
  {
    icon: Leaf,
    title: "Περιβαλλοντική Ευαισθησία",
    description:
      "Προστασία του περιβάλλοντος μέσω βιώσιμων πρακτικών διαχείρισης νερού.",
  },
  {
    icon: Lightbulb,
    title: "Καινοτομία",
    description: "Εφαρμογή σύγχρονων τεχνολογιών για βελτίωση των υπηρεσιών μας.",
  },
  {
    icon: Target,
    title: "Αξιοπιστία",
    description: "Συνεχής παροχή υπηρεσιών χωρίς διακοπές, 24 ώρες το 24ωρο.",
  },
];

export const boardMembers: BoardMember[] = [
  {
    name: "Ιωάννης Αθητάκης",
    role: "Πρόεδρος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    image: "/hero/proedros.webp",
    accent: "ocean",
    hoverDetail:
      "Προεδρεύει του Δ.Σ. και καθοδηγεί τον στρατηγικό σχεδιασμό για ύδρευση, αποχέτευση και έργα υποδομής στον Δήμο Αποκορώνου.",
  },
  {
    name: "Μαρία Τσιλεδάκη",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "sky",
    hoverDetail:
      "Συμμετέχει στη χάραξη πολιτικής για τη βιώσιμη διαχείριση του νερού και την αναβάθμιση των δικτύων της ΔΕΥΑΑ.",
  },
  {
    name: "Αργυρώ Καυκαλά",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "deep",
    hoverDetail:
      "Εκπροσωπεί το Δημοτικό Συμβούλιο στις αποφάσεις για την ποιότητα υπηρεσιών ύδρευσης και αποχέτευσης.",
  },
  {
    name: "Σταύρος Σταυρουλάκης",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "teal",
    hoverDetail:
      "Συνεισφέρει στον προγραμματισμό έργων και στη διαφάνεια στη λειτουργία της επιχείρησης.",
  },
  {
    name: "Γεώργιος Γυπαράκης",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "slate",
    hoverDetail:
      "Μέλος του Δ.Σ. με εστίαση στη σύνδεση της ΔΕΥΑΑ με τις ανάγκες της τοπικής κοινωνίας.",
  },
  {
    name: "Ιωάννης Κουκουράκης",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "ocean",
    hoverDetail:
      "Συμμετέχει στις αποφάσεις για τη λειτουργία και ανάπτυξη των υποδομών νερού στον Αποκόρωνα.",
  },
  {
    name: "Πέτρος Μπενάκης",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "sky",
    hoverDetail:
      "Εκπροσωπεί τους δημότες στο Δ.Σ. για θέματα ύδρευσης, αποχέτευσης και δημοτικών υπηρεσιών.",
  },
  {
    name: "Σταύρος Ψαρουδάκης",
    role: "Μέλος Δ.Σ.",
    position: "Δημοτικός Σύμβουλος",
    accent: "deep",
    hoverDetail:
      "Συμμετέχει στις αποφάσεις για την οργάνωση και τον εκσυγχρονισμό των υπηρεσιών της ΔΕΥΑΑ.",
  },
  {
    name: "Νικόλαος Λαγαράκης",
    role: "Μέλος Δ.Σ.",
    position: "Εκπρόσωπος Εργαζομένων",
    accent: "teal",
    hoverDetail:
      "Εκπροσωπεί τους εργαζόμενους της ΔΕΥΑΑ και τη συμμετοχή τους στη λειτουργία της επιχείρησης.",
  },
  {
    name: "Μιχαήλ Βλαβογιλάκης",
    role: "Μέλος Δ.Σ.",
    position: "Εκπρόσωπος Ιδρύματος «Αγία Σοφία»",
    accent: "slate",
    hoverDetail:
      "Μεταφέρει στο Δ.Σ. την εμπειρία και τις ανάγκες του Ιδρύματος σε θέματα ύδρευσης και αποχέτευσης.",
  },
  {
    name: "Ανδρέας Βροντάκης",
    role: "Μέλος Δ.Σ.",
    position: "Εκπρόσωπος Δημοτών",
    accent: "ocean",
    hoverDetail:
      "Εκπροσωπεί τους πολίτες και συμβάλλει στη διασύνδεση της ΔΕΥΑΑ με την καθημερινότητα του Δήμου.",
  },
];

export const orgDepartments: OrgDepartment[] = [
  {
    title: "Διεύθυνση Διοικητικών & Οικονομικών Υπηρεσιών",
    description: "Διοίκηση, λογιστήριο, ανθρώπινο δυναμικό και οικονομικός προγραμματισμός.",
  },
  {
    title: "Διεύθυνση Τεχνικών Υπηρεσιών",
    description: "Σχεδιασμός, κατασκευή και συντήρηση υδραυλικών υποδομών.",
  },
  {
    title: "Τμήμα Ύδρευσης",
    description: "Παραγωγή, μεταφορά και διανομή πόσιμου νερού.",
  },
  {
    title: "Τμήμα Αποχέτευσης",
    description: "Συλλογή, μεταφορά και επεξεργασία λυμάτων.",
  },
  {
    title: "Τμήμα Εξυπηρέτησης Πολιτών",
    description: "Υποστήριξη πολιτών, λογαριασμοί και ψηφιακές υπηρεσίες.",
  },
];

export const aboutMissionAreas: AboutMissionArea[] = [
  {
    id: "vision",
    title: "Όραμα",
    kicker: "Όραμα",
    lead: aboutVisionText,
    footnote: "* Στόχοι οργανισμού κοινής ωφέλειας",
    stats: [
      {
        value: "100",
        unit: "%",
        label: "Δέσμευση ποιότητας",
        description: "Παροχή υπηρεσιών με σεβασμό στον πολίτη και το περιβάλλον",
      },
      {
        value: "24/7",
        label: "Λειτουργία δικτύου",
        description: "Συνεχής επίβλεψη υποδομών ύδρευσης και αποχέτευσης",
      },
      {
        value: "+15",
        unit: "%*",
        label: "Ψηφιακός εκσυγχρονισμός",
        description: "Επένδυση σε τεχνολογίες και βέλτιστες πρακτικές",
        delta: "+ 15 %*",
      },
    ],
  },
  {
    id: "mission",
    title: "Αποστολή",
    kicker: "Αποστολή",
    lead: aboutMissionText,
    stats: [
      {
        value: "2",
        label: "Βασικές υπηρεσίες",
        description: "Ύδρευση και αποχέτευση για όλη την επικράτεια του Δήμου",
      },
      {
        value: "98",
        unit: "%",
        label: "Συνέχεια παροχής",
        description: "Σταθερή λειτουργία δικτύων με προληπτική συντήρηση",
      },
      {
        value: "+22",
        unit: "%*",
        label: "Βελτίωση υποδομών",
        description: "Συνεχής αναβάθμιση δικτύων και εγκαταστάσεων",
        delta: "+ 22 %*",
      },
    ],
  },
  {
    id: "values",
    title: "Αξίες",
    kicker: "Αξίες",
    lead:
      "Οι αξίες μας καθοδηγούν κάθε απόφαση — από την ποιότητα του νερού μέχρι τη σχέση εμπιστοσύνης με τον πολίτη.",
    stats: [
      {
        value: "4",
        label: "Βασικές αξίες",
        description: "Ποιότητα, Διαφάνεια, Καινοτομία και Βιωσιμότητα",
      },
      {
        value: "100",
        unit: "%",
        label: "Δημόσια υπηρεσία",
        description: "Υπευθυνότητα απέναντι στους πολίτες και το περιβάλλον",
      },
      {
        value: "+12",
        unit: "%*",
        label: "Εμπιστοσύνη πολιτών",
        description: "Συνεχής βελτίωση εξυπηρέτησης και διαφάνειας",
        delta: "+ 12 %*",
      },
    ],
  },
  {
    id: "water",
    title: "Ύδρευση & Αποχέτευση",
    kicker: "Ύδρευση & Αποχέτευση",
    lead:
      "Από την παραγωγή και μεταφορά πόσιμου νερού μέχρι τη συλλογή, επεξεργασία και διάθεση λυμάτων — ολόκληρος ο κύκλος του νερού.",
    footnote: "* Ενδεικτικά στοιχεία λειτουργίας",
    stats: [
      {
        value: "97",
        unit: "%",
        label: "Ποιότητα νερού",
        description: "Συμμόρφωση με πρότυπα πόσιμου νερού",
      },
      {
        value: "+18",
        unit: "%*",
        label: "Επένδυση υποδομών",
        description: "Αναβάθμιση δικτύων ύδρευσης και αποχέτευσης",
        delta: "+ 18 %*",
      },
      {
        value: "61",
        unit: "%",
        label: "Τοπική κάλυψη",
        description: "Δίκτυα που εξυπηρετούν τις τοπικές κοινότητες",
      },
    ],
  },
  {
    id: "structure",
    title: "Οργανωτική Δομή",
    kicker: "Οργανωτική Δομή",
    lead:
      "Εξειδικευμένες διευθύνσεις και τμήματα που συνεργάζονται για την απρόσκοπτη λειτουργία των υπηρεσιών.",
    stats: [
      {
        value: "5",
        label: "Τμήματα λειτουργίας",
        description: "Τεχνικές υπηρεσίες, ύδρευση, αποχέτευση, εξυπηρέτηση",
      },
      {
        value: "91",
        unit: "%",
        label: "Μόνιμες συμβάσεις",
        description: "Σταθερή ομάδα με εξειδίκευση στον κλάδο",
      },
      {
        value: "53",
        unit: "%",
        label: "Γυναίκες στελέχη",
        description: "Ισότιμη συμμετοχή στη διοίκηση και τα τμήματα",
      },
    ],
  },
];

/** Top 3 mission blocks shown in the about page figures panel */
export const aboutMissionAreasFeatured: AboutMissionArea[] = aboutMissionAreas.filter(
  (area) => area.id === "vision" || area.id === "mission" || area.id === "water",
);

export const administrationHeadline = "Η ομάδα που καθοδηγεί τη ΔΕΥΑΑ";

export const administrationLead =
  "Στο επίκεντρο της αξιόπιστης ύδρευσης και αποχέτευσης για τον Αποκόρωνα.";

export const administrationIntro =
  "Το ενδεκαμελές Διοικητικό Συμβούλιο χαράσσει την πολιτική και τις αποφάσεις που διαμορφώνουν τις υπηρεσίες μας — με διαφάνεια, συνεργασία και υπευθυνότητα απέναντι στους πολίτες.";

export const administrationIntroDetail =
  "Τα μέλη του Δ.Σ. ορίζονται από το Δημοτικό Συμβούλιο και εκπροσωπούν τους πολίτες, τους φορείς του Δήμου και τους εργαζόμενους.";
