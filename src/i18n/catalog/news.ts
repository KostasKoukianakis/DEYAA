import type { I18nText } from "@/i18n/types";

const s = (el: string, en: string, de: string, fr: string): I18nText => ({ el, en, de, fr });

export const newsCatalog = {
  archive: {
    title: s("Ανακοινώσεις", "Announcements", "Mitteilungen", "Annonces"),
    description: s(
      "Όλα τα τελευταία νέα από μια οργάνωση σε συνεχή εξέλιξη. Διαβάστε ενημερώσεις, έργα και ιστορίες για τον πολίτη και το μέλλον.",
      "The latest news from an organisation still taking shape. Read updates, projects, and stories for residents and the years ahead.",
      "Die neuesten Nachrichten einer Organisation im Aufbau. Lesen Sie Updates, Projekte und Geschichten für die Bürgerinnen und Bürger.",
      "Toute l’actualité d’une organisation en mouvement. Lisez les mises à jour, les projets et les récits destinés aux habitants.",
    ),
    filtersLabel: s("Μπορεί να σας ενδιαφέρει", "You may also like", "Das könnte Sie interessieren", "Cela peut vous intéresser"),
    filtersAria: s("Φίλτρα κατηγορίας", "Category filters", "Kategoriefilter", "Filtres de catégorie"),
    listAria: s("Λίστα ανακοινώσεων", "Announcements list", "Liste der Mitteilungen", "Liste des annonces"),
    loading: s("Φόρτωση ανακοινώσεων…", "Loading announcements…", "Mitteilungen werden geladen…", "Chargement des annonces…"),
    empty: s(
      "Δεν βρέθηκαν ανακοινώσεις σε αυτή την κατηγορία.",
      "No announcements were found in this category.",
      "In dieser Kategorie wurden keine Mitteilungen gefunden.",
      "Aucune annonce n’a été trouvée dans cette catégorie.",
    ),
    error: s("Σφάλμα φόρτωσης ανακοινώσεων.", "Could not load announcements.", "Mitteilungen konnten nicht geladen werden.", "Impossible de charger les annonces."),
    originalLanguage: s(
      "Το πλήρες κείμενο δημοσιεύεται στην ελληνική γλώσσα.",
      "The full article is published in Greek.",
      "Der vollständige Text erscheint auf Griechisch.",
      "Le texte intégral est publié en grec.",
    ),
  },
  categories: {
    news: s("Ανακοινώσεις", "Announcements", "Mitteilungen", "Annonces"),
    sustainability: s("Βιωσιμότητα", "Sustainability", "Nachhaltigkeit", "Durabilité"),
    projects: s("Έργα", "Projects", "Projekte", "Projets"),
    tenders: s("Διαγωνισμοί", "Tenders", "Ausschreibungen", "Appels d’offres"),
  },
  detail: {
    breadcrumb: s("Ανακοινώσεις", "Announcements", "Mitteilungen", "Annonces"),
    relatedKicker: s("Ανακοινώσεις", "Announcements", "Mitteilungen", "Annonces"),
    relatedTitle: s("Επόμενα νέα", "Next stories", "Weitere Nachrichten", "À suivre"),
    relatedDescription: s(
      "Μια οργάνωση σε συνεχή εξέλιξη σημαίνει έργα που προλαβαίνουν τις ανάγκες, συνεργασίες που δημιουργούν αξία και στόχους που μιλούν για δέσμευση. Διαβάστε τα τελευταία νέα από τον κόσμο της ΔΕΥΑΑ.",
      "An organisation still taking shape means projects that stay ahead of need, partnerships that create value, and goals that speak of commitment. Read the latest from DEYAA.",
      "Eine Organisation im Aufbau bedeutet Projekte, die den Bedarf vorwegnehmen, Partnerschaften, die Wert schaffen, und Ziele, die Verpflichtung zeigen. Lesen Sie das Neueste der DEYAA.",
      "Une organisation en mouvement, ce sont des projets qui anticipent les besoins, des partenariats qui créent de la valeur et des objectifs d’engagement. Lisez l’actualité de la DEYAA.",
    ),
    contactTitle: s("Επικοινωνήστε μαζί μας", "Get in touch", "Kontaktieren Sie uns", "Contactez-nous"),
    contactCta: s("Μετάβαση στην επικοινωνία", "Go to contact", "Zum Kontakt", "Aller au contact"),
    loading: s("Φόρτωση ανακοίνωσης…", "Loading announcement…", "Mitteilung wird geladen…", "Chargement de l’annonce…"),
    notFound: s("Η ανακοίνωση δεν βρέθηκε.", "The announcement was not found.", "Die Mitteilung wurde nicht gefunden.", "L’annonce est introuvable."),
    backToArchive: s("Όλες οι ανακοινώσεις", "All announcements", "Alle Mitteilungen", "Toutes les annonces"),
    contentAria: s("Κείμενο ανακοίνωσης", "Announcement text", "Text der Mitteilung", "Texte de l’annonce"),
  },
  posts: {
    "news-01": {
      tab: s("01 Εργαστήρια βιωσιμότητας", "01 Sustainability workshops", "01 Nachhaltigkeitsworkshops", "01 Ateliers durabilité"),
      line1: s("Μαζί για ένα μέλλον με λιγότερες εκπομπές:", "Together for a lower-emission future:", "Gemeinsam für eine Zukunft mit weniger Emissionen:", "Ensemble pour un avenir à plus faibles émissions :"),
      line2: s("τα εργαστήριά μας", "our workshops", "unsere Workshops", "nos ateliers"),
      alt: s("Εργαστήρια βιωσιμότητας ΔΕΥΑΑ", "DEYAA sustainability workshops", "DEYAA-Nachhaltigkeitsworkshops", "Ateliers durabilité DEYAA"),
    },
    "news-02": {
      tab: s("02 Ψηφιακές υπηρεσίες", "02 Digital services", "02 Digitale Dienste", "02 Services numériques"),
      line1: s("Νέες ψηφιακές υπηρεσίες:", "New digital services:", "Neue digitale Dienste:", "Nouveaux services numériques :"),
      line2: s("πληρωμές και δηλώσεις online", "payments and declarations online", "Zahlungen und Meldungen online", "paiements et déclarations en ligne"),
      alt: s("Ψηφιακές υπηρεσίες ΔΕΥΑΑ", "DEYAA digital services", "Digitale Dienste der DEYAA", "Services numériques DEYAA"),
    },
    "news-03": {
      tab: s("03 Αναβάθιση δικτύου", "03 Network upgrade", "03 Netzausbau", "03 Modernisation du réseau"),
      line1: s("Αναβάθιση δικτύου ύδρευσης", "Water network upgrade", "Ausbau des Wassernetzes", "Modernisation du réseau d’eau"),
      line2: s("με έμφαση στον πολίτη", "with residents at the centre", "mit dem Bürger im Mittelpunkt", "avec l’habitant au centre"),
      alt: s("Αναβάθιση δικτύου ύδρευσης ΔΕΥΑΑ", "DEYAA water network upgrade", "Ausbau des DEYAA-Wassernetzes", "Modernisation du réseau d’eau DEYAA"),
    },
  },
  fallback: {
    "arch-01": s(
      "Μαζί για ένα μέλλον με λιγότερες εκπομπές: τα εργαστήριά μας",
      "Together for a lower-emission future: our workshops",
      "Gemeinsam für eine Zukunft mit weniger Emissionen: unsere Workshops",
      "Ensemble pour un avenir à plus faibles émissions : nos ateliers",
    ),
    "arch-02": s(
      "Νέες ψηφιακές υπηρεσίες: πληρωμές και δηλώσεις online",
      "New digital services: payments and declarations online",
      "Neue digitale Dienste: Zahlungen und Meldungen online",
      "Nouveaux services numériques : paiements et déclarations en ligne",
    ),
    "arch-03": s(
      "Αναβάθιση δικτύου ύδρευσης με έμφαση στον πολίτη",
      "Water network upgrade with residents at the centre",
      "Ausbau des Wassernetzes mit dem Bürger im Mittelpunkt",
      "Modernisation du réseau d’eau, l’habitant au centre",
    ),
    "arch-04": s(
      "Ενημέρωση για προγραμματισμένη συντήρηση δικτύου στον Αποκόρωνα",
      "Notice of planned network maintenance in Apokoronas",
      "Hinweis zur geplanten Netzwartung in Apokoronas",
      "Information sur une maintenance prévue du réseau à Apokoronas",
    ),
    "arch-05": s(
      "Οδηγίες οικονομίας νερού για το καλοκαίρι 2026",
      "Water-saving guidance for summer 2026",
      "Wasserspartipps für den Sommer 2026",
      "Conseils d’économie d’eau pour l’été 2026",
    ),
    "arch-06": s(
      "Ανακοίνωση ωραρίου λειτουργίας ταμείου τις εορταστικές ημέρες",
      "Cash desk hours during the holiday period",
      "Öffnungszeiten der Kasse an Feiertagen",
      "Horaires de la caisse pendant les fêtes",
    ),
    "arch-07": s(
      "Ολοκλήρωση φάσης αναβάθισης δικτύου αποχέτευσης στη Βρύση",
      "Sewer network upgrade phase completed in Vrysi",
      "Ausbauphase des Abwassernetzes in Vrysi abgeschlossen",
      "Phase de modernisation du réseau d’assainissement achevée à Vrysi",
    ),
  },
} as const;
