import type { I18nText } from "@/i18n/types";

const s = (el: string, en: string, de: string, fr: string): I18nText => ({ el, en, de, fr });

export const waterQualityCatalog = {
  title: s("Ποιότητα νερού", "Water quality", "Wasserqualität", "Qualité de l’eau"),
  description: s(
    "Αποτελέσματα αναλύσεων, προγράμματα παρακολούθησης και εκθέσεις εργαστηρίων για το πόσιμο νερό του Αποκόρωνα — σύμφωνα με την ισχύουσα νομοθεσία.",
    "Laboratory results, monitoring programmes and reports for drinking water in Apokoronas — published as required by law.",
    "Analyseergebnisse, Überwachungsprogramme und Laborberichte zum Trinkwasser in Apokoronas — gemäß den gesetzlichen Vorgaben.",
    "Résultats d’analyses, programmes de suivi et rapports de laboratoire sur l’eau potable d’Apokoronas — conformément à la loi.",
  ),
  legal: s(
    "Η δημοσιοποίηση γίνεται σύμφωνα με την ΚΥΑ Δ1/ΓΠ οικ.27829/2023 (Οδηγία 2020/2184) και τις υποχρεώσεις εποπτείας της ΡΑΑΕΥ (Ν.5037/2023).",
    "Publication follows Joint Ministerial Decision Δ1/ΓΠ οικ.27829/2023 (Directive 2020/2184) and RAAEY oversight duties (Law 5037/2023).",
    "Die Veröffentlichung erfolgt gemäß der gemeinsamen Ministerialentscheidung Δ1/ΓΠ οικ.27829/2023 (Richtlinie 2020/2184) und den Aufsichtspflichten der RAAEY (Gesetz 5037/2023).",
    "La publication suit la décision ministérielle Δ1/ΓΠ οικ.27829/2023 (directive 2020/2184) et les obligations de contrôle de la RAAEY (loi 5037/2023).",
  ),
  heroArtAria: s(
    "Σχέδιο εργαστηριακής φιάλης και σταγόνας — έλεγχος ποιότητας νερού",
    "Laboratory flask and droplet drawing — drinking-water quality testing",
    "Zeichnung einer Laborflasche und eines Tropfens — Prüfung der Wasserqualität",
    "Dessin d’une fiole de laboratoire et d’une goutte — contrôle de la qualité de l’eau",
  ),
  tabsAria: s("Κατηγορίες ποιότητας νερού", "Water quality categories", "Kategorien der Wasserqualität", "Catégories de qualité de l’eau"),
  loading: s("Φόρτωση στοιχείων ποιότητας νερού…", "Loading water quality records…", "Wasserqualitätsdaten werden geladen…", "Chargement des données de qualité de l’eau…"),
  empty: s(
    "Δεν υπάρχουν αναρτημένα στοιχεία σε αυτή την κατηγορία.",
    "No records have been published in this category.",
    "In dieser Kategorie sind keine Unterlagen veröffentlicht.",
    "Aucun document n’a été publié dans cette catégorie.",
  ),
  error: s(
    "Δεν ήταν δυνατή η φόρτωση από τη βάση. Εμφανίζονται τα ενημερωτικά κείμενα.",
    "The database could not be loaded. Introductory records are shown instead.",
    "Die Datenbank konnte nicht geladen werden. Es werden einführende Einträge angezeigt.",
    "La base n’a pas pu être chargée. Les textes d’introduction s’affichent.",
  ),
  download: s("Λήψη αρχείου", "Download file", "Datei herunterladen", "Télécharger le fichier"),
  pendingFile: s("Αρχείο υπό ανάρτηση", "File to be uploaded", "Datei folgt", "Fichier à venir"),
  sampling: s("Δειγματοληψία", "Sampling", "Probenahme", "Prélèvement"),
  location: s("Περιοχή", "Area", "Gebiet", "Zone"),
  published: s("Ανάρτηση", "Published", "Veröffentlicht", "Publication"),
  categories: {
    analysis: s("Αναλύσεις", "Analyses", "Analysen", "Analyses"),
    monitoring: s("Παρακολούθηση", "Monitoring", "Überwachung", "Suivi"),
    statistics: s("Στατιστικά", "Statistics", "Statistik", "Statistiques"),
    lab_report: s("Εκθέσεις εργαστηρίων", "Laboratory reports", "Laborberichte", "Rapports de laboratoire"),
    education: s("Ενημερωτικό υλικό", "Public information", "Informationsmaterial", "Information du public"),
  },
  leads: {
    analysis: s(
      "Τα αποτελέσματα τακτικού μικροβιολογικού και χημικού ελέγχου πόσιμου νερού αναρτώνται ανά δίκτυο και περίοδο δειγματοληψίας.",
      "Results of regular microbiological and chemical testing of drinking water are published by network and sampling period.",
      "Ergebnisse der regelmäßigen mikrobiologischen und chemischen Prüfung des Trinkwassers werden je Netz und Probenahmezeitraum veröffentlicht.",
      "Les résultats des contrôles microbiologiques et chimiques réguliers de l’eau potable sont publiés par réseau et période de prélèvement.",
    ),
    monitoring: s(
      "Το ετήσιο πρόγραμμα παρακολούθησης πόσιμου νερού ακολουθεί την ΚΥΑ Δ1/ΓΠ οικ.27829/2023 και τις απαιτήσεις εποπτείας της ΡΑΑΕΥ.",
      "The annual drinking-water monitoring programme follows Joint Ministerial Decision Δ1/ΓΠ οικ.27829/2023 and RAAEY oversight requirements.",
      "Das jährliche Überwachungsprogramm für Trinkwasser folgt der gemeinsamen Ministerialentscheidung Δ1/ΓΠ οικ.27829/2023 und den Aufsichtsanforderungen der RAAEY.",
      "Le programme annuel de suivi de l’eau potable suit la décision ministérielle Δ1/ΓΠ οικ.27829/2023 et les exigences de contrôle de la RAAEY.",
    ),
    statistics: s(
      "Συγκεντρωτικά στατιστικά μετρήσεων φυσικοχημικών και μικροβιολογικών παραμέτρων ανά περίοδο ελέγχου.",
      "Aggregate statistics of physicochemical and microbiological parameters by inspection period.",
      "Zusammengefasste Statistik physikalisch-chemischer und mikrobiologischer Parameter je Kontrollzeitraum.",
      "Statistiques consolidées des paramètres physico-chimiques et microbiologiques par période de contrôle.",
    ),
    lab_report: s(
      "Οι εκθέσεις διαπιστευμένων εργαστηρίων δημοσιεύονται σε PDF μόλις παραληφθούν από τη ΔΕΥΑΑ.",
      "Accredited laboratory reports are published as PDFs as soon as DEYAA receives them.",
      "Berichte akkreditierter Labore werden als PDF veröffentlicht, sobald die DEYAA sie erhält.",
      "Les rapports de laboratoires accrédités sont publiés en PDF dès que la DEYAA les reçoit.",
    ),
    education: s(
      "Ενημερωτικό υλικό για την ασφάλεια του πόσιμου νερού, τις βασικές παραμέτρους και το πώς ενημερώνεται ο καταναλωτής.",
      "Public information on drinking-water safety, the main parameters, and how consumers are informed.",
      "Informationsmaterial zur Trinkwassersicherheit, den wichtigsten Parametern und der Verbraucherinformation.",
      "Information du public sur la sécurité de l’eau potable, les paramètres essentiels et l’information des consommateurs.",
    ),
  },
  leadHighlights: {
    analysis: {
      0: s("μικροβιολογικού και χημικού", "microbiological and chemical", "mikrobiologischen und chemischen", "microbiologiques et chimiques"),
      1: s("πόσιμου νερού", "drinking water", "Trinkwassers", "l’eau potable"),
    },
    monitoring: {
      0: s("πρόγραμμα παρακολούθησης", "monitoring programme", "Überwachungsprogramm", "programme annuel de suivi"),
      1: s("ΚΥΑ Δ1/ΓΠ οικ.27829/2023", "Joint Ministerial Decision Δ1/ΓΠ οικ.27829/2023", "Ministerialentscheidung Δ1/ΓΠ οικ.27829/2023", "décision ministérielle Δ1/ΓΠ οικ.27829/2023"),
    },
    statistics: {
      0: s("στατιστικά μετρήσεων", "statistics of", "Statistik", "Statistiques consolidées"),
      1: s("μικροβιολογικών παραμέτρων", "microbiological parameters", "mikrobiologischer Parameter", "paramètres microbiologiques"),
    },
    lab_report: {
      0: s("εκθέσεις διαπιστευμένων εργαστηρίων", "Accredited laboratory reports", "Berichte akkreditierter Labore", "rapports de laboratoires accrédités"),
      1: s("PDF", "PDFs", "PDF", "PDF"),
    },
    education: {
      0: s("Ενημερωτικό υλικό", "Public information", "Informationsmaterial", "Information du public"),
      1: s("πόσιμου νερού", "drinking-water", "Trinkwassersicherheit", "l’eau potable"),
    },
  },
};
