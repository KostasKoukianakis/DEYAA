import type { I18nText } from "@/i18n/types";

const s = (el: string, en: string, de: string, fr: string): I18nText => ({ el, en, de, fr });

export const aboutCatalog = {
  sections: {
    "about-hero": s("Αρχική", "Home", "Start", "Accueil"),
    "about-history": s("Ιστορία", "History", "Geschichte", "Histoire"),
    "about-vision": s("Όραμα / Αποστολή", "Vision / Mission", "Vision / Auftrag", "Vision / Mission"),
  },
  hero: {
    titleBefore: s(
      "Η ομάδα που καθοδηγεί τη",
      "The team that guides",
      "Das Führungsteam der",
      "L’équipe qui guide",
    ),
    brand: s("ΔΕΥΑΑ", "DEYAA", "DEYAA", "DEYAA"),
    lead: s(
      "Στο επίκεντρο της αξιόπιστης ύδρευσης και αποχέτευσης για τον Αποκόρωνα.",
      "At the heart of reliable water supply and sewerage for Apokoronas.",
      "Im Mittelpunkt einer zuverlässigen Wasser- und Abwasserversorgung für Apokoronas.",
      "Au cœur d’une alimentation en eau et d’un assainissement fiables pour Apokoronas.",
    ),
    dialogTitle: s(
      "Μέλη Διοικητικού Συμβουλίου",
      "Members of the Board of Directors",
      "Mitglieder des Verwaltungsrats",
      "Membres du conseil d’administration",
    ),
    dialogDesc: s(
      "Όλα τα μέλη του Διοικητικού Συμβουλίου ({count})",
      "All members of the Board of Directors ({count})",
      "Alle Mitglieder des Verwaltungsrats ({count})",
      "Tous les membres du conseil d’administration ({count})",
    ),
    carouselAria: s(
      "Καρουζέλ μελών Διοικητικού Συμβουλίου",
      "Board of Directors members carousel",
      "Karussell der Verwaltungsratsmitglieder",
      "Carrousel des membres du conseil d’administration",
    ),
    prev: s("Προηγούμενο", "Previous", "Zurück", "Précédent"),
    next: s("Επόμενο", "Next", "Weiter", "Suivant"),
    memberN: s("Μέλος {n}", "Member {n}", "Mitglied {n}", "Membre {n}"),
    remainingAria: s(
      "Εμφάνιση {count} επιπλέον μελών του Διοικητικού Συμβουλίου",
      "Show {count} more members of the Board of Directors",
      "{count} weitere Mitglieder des Verwaltungsrats anzeigen",
      "Afficher {count} membres supplémentaires du conseil d’administration",
    ),
    dotsAria: s("Επιλογή μέλους", "Select a member", "Mitglied auswählen", "Choisir un membre"),
  },
  history: {
    aria: s("Ιστορία", "History", "Geschichte", "Histoire"),
    label: s("Ιστορία", "History", "Geschichte", "Histoire"),
    intro: s(
      "Η Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου (ΔΕΥΑΑ) συστάθηκε το 2024 και αναλαμβάνει τη διαχείριση δικτύων ύδρευσης, αποχέτευσης, βιολογικών καθαρισμών και μεγάλων έργων υποδομής σε όλη την επικράτεια του Δήμου Αποκορώνου.",
      "The Municipal Water and Sewerage Company of Apokoronas (DEYAA) was established in 2024 and is responsible for water networks, sewerage, wastewater treatment plants, and major infrastructure projects across the Municipality of Apokoronas.",
      "Die Städtischen Wasser- und Abwasserbetriebe von Apokoronas (DEYAA) wurden 2024 gegründet und übernehmen die Bewirtschaftung der Wasser- und Abwassernetze, der Kläranlagen und großer Infrastrukturvorhaben im gesamten Gebiet der Gemeinde Apokoronas.",
      "L’entreprise municipale d’eau et d’assainissement d’Apokoronas (DEYAA) a été créée en 2024 et prend en charge les réseaux d’eau, l’assainissement, les stations d’épuration et les grands projets d’infrastructure sur l’ensemble du territoire de la municipalité d’Apokoronas.",
    ),
    journeyLine1: s("Το ταξίδι", "Our journey", "Unsere Reise", "Notre parcours"),
    journeyLine2: s("μας μέχρι σήμερα.", "to this day.", "bis heute.", "jusqu’à aujourd’hui."),
    milestones: {
      "long-effort": {
        year: s("Χρόνια", "Years", "Jahre", "Années"),
        title: s(
          "Μακρά προσπάθεια για ίδια ΔΕΥΑ",
          "A long effort for our own DEYA",
          "Langer Einsatz für eine eigene DEYA",
          "Un long effort pour une DEYA à nous",
        ),
        description: s(
          "Η τοπική κοινωνία διεκδικούσε επί χρόνια αυτόνομη διαχείριση ύδρευσης και αποχέτευσης, με έμφαση στην προστασία του νερού και των υποδομών του τόπου.",
          "The local community had for years sought autonomous water and sewerage management, with an emphasis on protecting the water and the area’s infrastructure.",
          "Die örtliche Gemeinschaft setzte sich jahrelang für eine eigenständige Wasser- und Abwasserbewirtschaftung ein, mit dem Schwerpunkt auf dem Schutz des Wassers und der Infrastruktur vor Ort.",
          "La communauté locale revendiquait depuis des années une gestion autonome de l’eau et de l’assainissement, en mettant l’accent sur la protection de l’eau et des infrastructures du territoire.",
        ),
        chapter: s(
          "Από την απόφαση\nστην ίδρυση",
          "From the decision\nto founding",
          "Von der Entscheidung\nzur Gründung",
          "De la décision\nà la fondation",
        ),
      },
      "council-approval": {
        year: s("30 Ιαν 2024", "30 Jan 2024", "30. Jan. 2024", "30 janv. 2024"),
        title: s(
          "Έγκριση από το Δημοτικό Συμβούλιο",
          "Approval by the Municipal Council",
          "Genehmigung durch den Gemeinderat",
          "Approbation par le conseil municipal",
        ),
        description: s(
          "Το Δημοτικό Συμβούλιο Αποκορώνου ενέκρινε κατά πλειοψηφία (15 ναι, 8 παρών, 2 όχι) την ίδρυση και λειτουργία της ΔΕΥΑΑ.",
          "The Municipal Council of Apokoronas approved by majority (15 yes, 8 present, 2 no) the founding and operation of DEYAA.",
          "Der Gemeinderat von Apokoronas genehmigte mit Mehrheit (15 Ja, 8 anwesend, 2 Nein) die Gründung und den Betrieb der DEYAA.",
          "Le conseil municipal d’Apokoronas a approuvé à la majorité (15 oui, 8 présents, 2 non) la création et le fonctionnement de la DEYAA.",
        ),
      },
      "fek-founding": {
        year: s("26 Απρ 2024", "26 Apr 2024", "26. Apr. 2024", "26 avr. 2024"),
        title: s(
          "Επίσημη ίδρυση στο ΦΕΚ",
          "Official founding in the ΦΕΚ",
          "Offizielle Gründung im ΦΕΚ",
          "Fondation officielle au ΦΕΚ",
        ),
        description: s(
          "Δημοσιεύτηκε στο ΦΕΚ 2506 Β'/26.04.2024 η απόφαση ίδρυσης — νομικό πρόσωπο ιδιωτικού δικαίου με κοινωφελή χαρακτήρα, σύμφωνα με τον Ν. 1060/80.",
          "The founding decision was published in ΦΕΚ 2506 Β'/26.04.2024 — a private-law legal entity of public benefit, in accordance with Ν. 1060/80.",
          "Die Gründungsentscheidung wurde im ΦΕΚ 2506 Β'/26.04.2024 veröffentlicht — eine juristische Person des Privatrechts mit gemeinnützigem Charakter, gemäß Ν. 1060/80.",
          "La décision de création a été publiée au ΦΕΚ 2506 Β'/26.04.2024 — une personne morale de droit privé à caractère d’utilité publique, conformément à la Ν. 1060/80.",
        ),
      },
      "board-vamos": {
        year: s("22 Μαΐ 2024", "22 May 2024", "22. Mai 2024", "22 mai 2024"),
        title: s(
          "Συγκρότηση Δ.Σ. και έδρα στον Βάμο",
          "Board formed and seat in Vamos",
          "Konstituierung des Verwaltungsrats und Sitz in Vamos",
          "Constitution du C.A. et siège à Vamos",
        ),
        description: s(
          "Συγκροτήθηκε το ενδεκαμελές Διοικητικό Συμβούλιο (πρόεδρος Ι. Αθητάκης), με συμμετοχή του ιδρύματος «Αγία Σοφία» και έδρα στο πρώην Δημαρχείο Βάμου.",
          "The eleven-member Board of Directors was formed (chair I. Αθητάκης), with participation of the «Αγία Σοφία» foundation and its seat in the former Town Hall of Vamos.",
          "Der elfköpfige Verwaltungsrat wurde gebildet (Vorsitzender I. Αθητάκης), mit Beteiligung der Stiftung «Αγία Σοφία» und Sitz im ehemaligen Rathaus von Vamos.",
          "Le conseil d’administration de onze membres a été constitué (président I. Αθητάκης), avec la participation de la fondation «Αγία Σοφία» et son siège à l’ancien hôtel de ville de Vamos.",
        ),
        chapter: s(
          "Ύδρευση &\nαποχέτευση",
          "Water supply &\nsewerage",
          "Wasser &\nAbwasser",
          "Eau &\nassainissement",
        ),
      },
      "georgioupolis-wwtp": {
        year: s("2014–σήμερα", "2014–today", "2014–heute", "2014–aujourd’hui"),
        title: s(
          "Αποχέτευση Γεωργιούπολης",
          "Georgioupoli sewerage",
          "Abwasser Georgioupoli",
          "Assainissement de Georgioupoli",
        ),
        description: s(
          "Ολοκληρωμένο έργο ~26 εκ. €: ΕΕΛ δυναμικότητας 19.286 ι.κ., δίκτυο αποχέτευσης ~42 χλμ. και υποθαλάσσιος αγωγός διάθεσης για Γεωργιούπολη, Καβρό, Βρύσες και τον κόλπο Αλμυρού.",
          "A completed project of ~26 million €: WWTP with a capacity of 19,286 ι.κ., a sewerage network of ~42 km, and a submarine outfall for Georgioupoli, Kavros, Vryses, and Almyros Bay.",
          "Abgeschlossenes Vorhaben von ~26 Mio. €: Kläranlage mit einer Kapazität von 19.286 ι.κ., Abwassernetz von ~42 km und Unterwasserableitung für Georgioupoli, Kavros, Vryses und die Bucht von Almyros.",
          "Ouvrage achevé d’environ 26 millions € : STEP d’une capacité de 19 286 ι.κ., réseau d’assainissement d’environ 42 km et émissaire sous-marin pour Georgioupoli, Kavros, Vryses et la baie d’Almyros.",
        ),
      },
      "kalives-eel-upgrade": {
        year: s("2024", "2024", "2024", "2024"),
        title: s(
          "Αναβάθμιση ΕΕΛ Καλυβών",
          "Kalives WWTP upgrade",
          "Ausbau der KA Kalives",
          "Modernisation de la STEP de Kalives",
        ),
        description: s(
          "Προμήθεια και εγκατάσταση νέου εξοπλισμού επεξεργασίας (MBR 200 m³/η, αφυδάτωση ιλύος, προεπεξεργασία) για την αντιμετώπιση υπερφόρτωσης και δυσοσμίας.",
          "Supply and installation of new treatment equipment (MBR 200 m³/η, sludge dewatering, pretreatment) to address overload and odour.",
          "Beschaffung und Einbau neuer Aufbereitungsanlagen (MBR 200 m³/η, Schlammentwässerung, Vorbehandlung) gegen Überlastung und Geruchsbelästigung.",
          "Fourniture et installation de nouveaux équipements de traitement (MBR 200 m³/η, déshydratation des boues, prétraitement) pour faire face à la surcharge et aux odeurs.",
        ),
      },
      "org-setup": {
        year: s("2024", "2024", "2024", "2024"),
        title: s(
          "Οργάνωση & αδειοδοτήσεις",
          "Organisation & permits",
          "Organisation & Genehmigungen",
          "Organisation et autorisations",
        ),
        description: s(
          "Συστάθηκαν διοικητικές δομές, Οργανισμός Εσωτερικής Υπηρεσίας, Κανονισμός Λειτουργίας, πρώτος προϋπολογισμός και διαδικασίες λειτουργίας των υποδομών από το μηδέν.",
          "Administrative structures were established, along with Internal Service Rules, Operating Regulations, the first budget, and operating procedures for the infrastructure from the ground up.",
          "Es wurden Verwaltungsstrukturen, eine interne Dienstordnung, eine Betriebsordnung, der erste Haushalt und Betriebsabläufe für die Infrastruktur von Grund auf eingerichtet.",
          "Des structures administratives ont été mises en place, ainsi qu’un règlement intérieur, un règlement de fonctionnement, un premier budget et des procédures d’exploitation des infrastructures, à partir de zéro.",
        ),
        chapter: s(
          "Έργα &\nαδειοδότηση",
          "Projects &\npermitting",
          "Projekte &\nGenehmigung",
          "Travaux &\nautorisations",
        ),
      },
      "almyrida-permit": {
        year: s("2025", "2025", "2025", "2025"),
        title: s(
          "Βιολογικός Αλμυρίδας — άδεια",
          "Almyrida WWTP — permit",
          "Kläranlage Almyrida — Genehmigung",
          "STEP d’Almyrida — autorisation",
        ),
        description: s(
          "Θετική περιβαλλοντική γνωμοδότηση για έργο 14,7 εκ. €: δίκτυο αποχέτευσης ~27 χλμ., 9 αντλιοστάσια και σύγχρονη μονάδα επεξεργασίας (4.800–6.200 ι.κ.).",
          "A positive environmental opinion for a 14.7 million € project: a sewerage network of ~27 km, 9 pumping stations, and a modern treatment plant (4,800–6,200 ι.κ.).",
          "Positive Umweltstellungnahme für ein Vorhaben von 14,7 Mio. €: Abwassernetz von ~27 km, 9 Pumpwerke und eine moderne Aufbereitungsanlage (4.800–6.200 ι.κ.).",
          "Avis environnemental favorable pour un projet de 14,7 millions € : réseau d’assainissement d’environ 27 km, 9 stations de pompage et une unité de traitement moderne (4 800–6 200 ι.κ.).",
        ),
      },
      "billing-reform": {
        year: s("2025", "2025", "2025", "2025"),
        title: s(
          "Δίκαιη τιμολόγηση νερού",
          "Fair water pricing",
          "Faire Wasserpreise",
          "Tarification équitable de l’eau",
        ),
        description: s(
          "Μείωση χρέωσης σε 0,30€/κ.μ. για πάνω από 7.000 οικιακά υδρόμετρα και έκπτωση 5% για συνεπείς καταναλωτές.",
          "A charge reduction to 0.30€/m³ for more than 7,000 household meters and a 5% discount for customers who pay on time.",
          "Senkung der Gebühr auf 0,30€/m³ für mehr als 7.000 Haushaltszähler und 5 % Rabatt für pünktliche Kundinnen und Kunden.",
          "Baisse de la tarification à 0,30€/m³ pour plus de 7 000 compteurs domestiques et une remise de 5 % pour les usagers en règle.",
        ),
        chapter: s("Το νερό\nσήμερα", "Water\ntoday", "Das Wasser\nheute", "L’eau\naujourd’hui"),
      },
      "billing-normalization": {
        year: s("2025–26", "2025–26", "2025–26", "2025–26"),
        title: s(
          "Ομαλοποίηση καταμετρήσεων",
          "Normalisation of meter readings",
          "Normalisierung der Zählerablesungen",
          "Normalisation des relevés",
        ),
        description: s(
          "Ολοκληρώθηκε η μετάβαση από την παλιά υπηρεσία ύδρευσης του Δήμου: τακτικές μετρήσεις, τετραμηνιαία τιμολόγηση και έκδοση λογαριασμών.",
          "The transition from the former municipal water service was completed: regular readings, four-monthly billing, and issue of bills.",
          "Der Übergang vom früheren Wasseramt der Gemeinde ist abgeschlossen: regelmäßige Ablesungen, viermonatliche Abrechnung und Ausstellung von Rechnungen.",
          "La transition depuis l’ancien service des eaux de la municipalité est achevée : relevés réguliers, facturation tous les quatre mois et émission des factures.",
        ),
      },
      today: {
        year: s("Σήμερα", "Today", "Heute", "Aujourd’hui"),
        title: s(
          "Ψηφιακές υπηρεσίες & νέα ιστοσελίδα",
          "Digital services & new website",
          "Digitale Dienste & neue Website",
          "Services numériques et nouveau site",
        ),
        description: s(
          "Πληρωμές, καταχώρηση ενδείξεων, αιτήματα και αναφορές βλαβών μέσω της ψηφιακής πλατφόρμας deyaa.gr.",
          "Payments, meter submissions, requests, and fault reports through the digital platform deyaa.gr.",
          "Zahlungen, Zählerstandsmeldungen, Anträge und Störungsmeldungen über die digitale Plattform deyaa.gr.",
          "Paiements, saisie des index, demandes et signalements de pannes via la plateforme numérique deyaa.gr.",
        ),
      },
    },
  },
  vision: {
    aria: s(
      "Όραμα, Αποστολή και Αξίες",
      "Vision, mission, and values",
      "Vision, Auftrag und Werte",
      "Vision, mission et valeurs",
    ),
    label: s(
      "Όραμα / Αποστολή / Δομή",
      "Vision / Mission / Structure",
      "Vision / Auftrag / Struktur",
      "Vision / Mission / Structure",
    ),
    collabAria: s(
      "Συνεργασίες και οικοσύστημα",
      "Partnerships and ecosystem",
      "Partnerschaften und Ökosystem",
      "Partenariats et écosystème",
    ),
    orbitAria: s(
      "Δίκτυο συνεργασιών",
      "Partnership network",
      "Partnerschaftsnetz",
      "Réseau de partenariats",
    ),
    titleLine1: s(
      "Συνεργασίες που διαμορφώνουν",
      "Partnerships that shape",
      "Partnerschaften, die",
      "Des partenariats qui façonnent",
    ),
    titleLine2: s(
      "το μέλλον του νερού.",
      "the future of water.",
      "die Zukunft des Wassers prägen.",
      "l’avenir de l’eau.",
    ),
    lead: s(
      "Καμία υπηρεσία κοινής ωφέλειας δεν λειτουργεί μόνη της. Η ΔΕΥΑΑ στηρίζεται σε ένα ενεργό δίκτυο δήμου, πολιτών, εργαζομένων και συνεργατών με τους οποίους μοιραζόμαστε όραμα, δέσμευση και ευθύνη. Μόνο μέσα από ανοιχτή συνεργασία γεννιούνται λύσεις που αναβαθμίζουν τις υπηρεσίες και προστατεύουν τον τόπο.",
      "No public utility works alone. DEYAA rests on an active network of municipality, residents, staff, and partners with whom we share vision, commitment, and responsibility. Only through open collaboration do solutions emerge that raise the quality of services and protect the place.",
      "Kein Träger der Daseinsvorsorge arbeitet allein. Die DEYAA stützt sich auf ein aktives Netz aus Gemeinde, Bürgerinnen und Bürgern, Beschäftigten und Partnern, mit denen wir Vision, Engagement und Verantwortung teilen. Nur durch offene Zusammenarbeit entstehen Lösungen, die die Dienste verbessern und den Ort schützen.",
      "Aucun service public ne fonctionne seul. La DEYAA s’appuie sur un réseau actif de municipalité, d’habitants, de personnels et de partenaires avec lesquels nous partageons vision, engagement et responsabilité. Ce n’est que par une collaboration ouverte que naissent des solutions qui améliorent les services et protègent le territoire.",
    ),
    partners: {
      municipality: s("Δήμος Αποκορώνου", "Municipality of Apokoronas", "Gemeinde Apokoronas", "Municipalité d’Apokoronas"),
      citizens: s("Πολίτες", "Residents", "Bürgerinnen und Bürger", "Habitants"),
      board: s("Διοίκηση", "Board", "Leitung", "Direction"),
      staff: s("Εργαζόμενοι", "Staff", "Beschäftigte", "Personnels"),
      environment: s("Περιβάλλον", "Environment", "Umwelt", "Environnement"),
      digital: s("Ψηφιακές Υπηρεσίες", "Digital services", "Digitale Dienste", "Services numériques"),
    },
    tabVision: s("Όραμα", "Vision", "Vision", "Vision"),
    tabMission: s("Αποστολή", "Mission", "Auftrag", "Mission"),
    tabValues: s("Αξίες", "Values", "Werte", "Valeurs"),
    visionText: s(
      "Να αποτελέσουμε πρότυπο οργανισμό παροχής υπηρεσιών κοινής ωφέλειας, με σεβασμό στον πολίτη και το περιβάλλον, αξιοποιώντας τις νέες τεχνολογίες και τις βέλτιστες πρακτικές του κλάδου.",
      "To become a model public-utility organisation, with respect for residents and the environment, making use of new technologies and best practices in the sector.",
      "Ein vorbildlicher Träger der Daseinsvorsorge zu sein, mit Respekt gegenüber den Bürgerinnen und Bürgern und der Umwelt, unter Nutzung neuer Technologien und bewährter Verfahren der Branche.",
      "Devenir un organisme modèle de service public, dans le respect des habitants et de l’environnement, en tirant parti des nouvelles technologies et des meilleures pratiques du secteur.",
    ),
    missionText: s(
      "Η ΔΕΥΑΑ έχει ως αποστολή την παροχή υψηλής ποιότητας υπηρεσιών ύδρευσης και αποχέτευσης στους πολίτες της περιοχής, διασφαλίζοντας την προστασία της δημόσιας υγείας και του περιβάλλοντος. Δεσμευόμαστε για τη συνεχή βελτίωση των υποδομών μας και την εφαρμογή σύγχρονων μεθόδων διαχείρισης υδάτινων πόρων.",
      "DEYAA’s mission is to provide high-quality water supply and sewerage services to the people of the area, safeguarding public health and the environment. We are committed to the continuous improvement of our infrastructure and to modern methods of water-resource management.",
      "Auftrag der DEYAA ist die Bereitstellung hochwertiger Wasser- und Abwasserdienste für die Menschen der Region, unter Schutz der öffentlichen Gesundheit und der Umwelt. Wir verpflichten uns zur stetigen Verbesserung unserer Infrastruktur und zur Anwendung zeitgemäßer Methoden der Wasserbewirtschaftung.",
      "La mission de la DEYAA est de fournir des services d’eau et d’assainissement de haute qualité aux habitants de la région, en assurant la protection de la santé publique et de l’environnement. Nous nous engageons à améliorer en continu nos infrastructures et à appliquer des méthodes modernes de gestion des ressources en eau.",
    ),
    valuesLead: s(
      "Οι αξίες μας καθοδηγούν κάθε απόφαση — από την ποιότητα του νερού μέχρι τη σχέση εμπιστοσύνης με τον πολίτη.",
      "Our values guide every decision — from water quality to a relationship of trust with residents.",
      "Unsere Werte leiten jede Entscheidung — von der Wasserqualität bis zur Vertrauensbeziehung mit den Bürgerinnen und Bürgern.",
      "Nos valeurs orientent chaque décision — de la qualité de l’eau jusqu’à la relation de confiance avec les habitants.",
    ),
    values: {
      quality: {
        title: s("Ποιότητα", "Quality", "Qualität", "Qualité"),
        description: s(
          "Παροχή νερού υψηλής ποιότητας που πληροί τα αυστηρότερα πρότυπα ασφαλείας.",
          "Supplying high-quality water that meets the strictest safety standards.",
          "Bereitstellung von hochwertigem Wasser, das die strengsten Sicherheitsstandards erfüllt.",
          "Fourniture d’une eau de haute qualité qui répond aux normes de sécurité les plus strictes.",
        ),
      },
      environment: {
        title: s("Περιβαλλοντική Ευαισθησία", "Environmental care", "Umweltverantwortung", "Sensibilité environnementale"),
        description: s(
          "Προστασία του περιβάλλοντος μέσω βιώσιμων πρακτικών διαχείρισης νερού.",
          "Protecting the environment through sustainable water-management practices.",
          "Schutz der Umwelt durch nachhaltige Praktiken der Wasserbewirtschaftung.",
          "Protection de l’environnement par des pratiques durables de gestion de l’eau.",
        ),
      },
      innovation: {
        title: s("Καινοτομία", "Innovation", "Innovation", "Innovation"),
        description: s(
          "Εφαρμογή σύγχρονων τεχνολογιών για βελτίωση των υπηρεσιών μας.",
          "Applying modern technologies to improve our services.",
          "Einsatz zeitgemäßer Technologien zur Verbesserung unserer Dienste.",
          "Mise en œuvre de technologies modernes pour améliorer nos services.",
        ),
      },
      reliability: {
        title: s("Αξιοπιστία", "Reliability", "Zuverlässigkeit", "Fiabilité"),
        description: s(
          "Συνεχής παροχή υπηρεσιών χωρίς διακοπές, 24 ώρες το 24ωρο.",
          "Uninterrupted service, 24 hours a day.",
          "Ununterbrochene Leistung, 24 Stunden am Tag.",
          "Fourniture continue des services, 24 heures sur 24.",
        ),
      },
    },
  },
  missionAreas: {
    aria: s(
      "Όραμα, Αποστολή, Αξίες και Οργανωτική Δομή",
      "Vision, mission, values, and organisational structure",
      "Vision, Auftrag, Werte und Organisationsstruktur",
      "Vision, mission, valeurs et structure organisationnelle",
    ),
    vision: {
      title: s("Όραμα", "Vision", "Vision", "Vision"),
      kicker: s("Όραμα", "Vision", "Vision", "Vision"),
      lead: s(
        "Να αποτελέσουμε πρότυπο οργανισμό παροχής υπηρεσιών κοινής ωφέλειας, με σεβασμό στον πολίτη και το περιβάλλον, αξιοποιώντας τις νέες τεχνολογίες και τις βέλτιστες πρακτικές του κλάδου.",
        "To become a model public-utility organisation, with respect for residents and the environment, making use of new technologies and best practices in the sector.",
        "Ein vorbildlicher Träger der Daseinsvorsorge zu sein, mit Respekt gegenüber den Bürgerinnen und Bürgern und der Umwelt, unter Nutzung neuer Technologien und bewährter Verfahren der Branche.",
        "Devenir un organisme modèle de service public, dans le respect des habitants et de l’environnement, en tirant parti des nouvelles technologies et des meilleures pratiques du secteur.",
      ),
      footnote: s(
        "* Στόχοι οργανισμού κοινής ωφέλειας",
        "* Goals of a public-utility organisation",
        "* Ziele eines Trägers der Daseinsvorsorge",
        "* Objectifs d’un organisme de service public",
      ),
      stats: [
        {
          label: s("Δέσμευση ποιότητας", "Quality commitment", "Qualitätsverpflichtung", "Engagement qualité"),
          description: s(
            "Παροχή υπηρεσιών με σεβασμό στον πολίτη και το περιβάλλον",
            "Providing services with respect for residents and the environment",
            "Dienste mit Respekt gegenüber den Bürgerinnen und Bürgern und der Umwelt",
            "Fourniture de services dans le respect des habitants et de l’environnement",
          ),
        },
        {
          label: s("Λειτουργία δικτύου", "Network operation", "Netzbetrieb", "Fonctionnement du réseau"),
          description: s(
            "Συνεχής επίβλεψη υποδομών ύδρευσης και αποχέτευσης",
            "Continuous oversight of water and sewerage infrastructure",
            "Ständige Aufsicht über Wasser- und Abwasserinfrastruktur",
            "Surveillance continue des infrastructures d’eau et d’assainissement",
          ),
        },
        {
          label: s("Ψηφιακός εκσυγχρονισμός", "Digital modernisation", "Digitale Modernisierung", "Modernisation numérique"),
          description: s(
            "Επένδυση σε τεχνολογίες και βέλτιστες πρακτικές",
            "Investment in technologies and best practices",
            "Investition in Technologien und bewährte Verfahren",
            "Investissement dans les technologies et les meilleures pratiques",
          ),
        },
      ],
    },
    mission: {
      title: s("Αποστολή", "Mission", "Auftrag", "Mission"),
      kicker: s("Αποστολή", "Mission", "Auftrag", "Mission"),
      lead: s(
        "Η ΔΕΥΑΑ έχει ως αποστολή την παροχή υψηλής ποιότητας υπηρεσιών ύδρευσης και αποχέτευσης στους πολίτες της περιοχής, διασφαλίζοντας την προστασία της δημόσιας υγείας και του περιβάλλοντος. Δεσμευόμαστε για τη συνεχή βελτίωση των υποδομών μας και την εφαρμογή σύγχρονων μεθόδων διαχείρισης υδάτινων πόρων.",
        "DEYAA’s mission is to provide high-quality water supply and sewerage services to the people of the area, safeguarding public health and the environment. We are committed to the continuous improvement of our infrastructure and to modern methods of water-resource management.",
        "Auftrag der DEYAA ist die Bereitstellung hochwertiger Wasser- und Abwasserdienste für die Menschen der Region, unter Schutz der öffentlichen Gesundheit und der Umwelt. Wir verpflichten uns zur stetigen Verbesserung unserer Infrastruktur und zur Anwendung zeitgemäßer Methoden der Wasserbewirtschaftung.",
        "La mission de la DEYAA est de fournir des services d’eau et d’assainissement de haute qualité aux habitants de la région, en assurant la protection de la santé publique et de l’environnement. Nous nous engageons à améliorer en continu nos infrastructures et à appliquer des méthodes modernes de gestion des ressources en eau.",
      ),
      stats: [
        {
          label: s("Βασικές υπηρεσίες", "Core services", "Kernleistungen", "Services essentiels"),
          description: s(
            "Ύδρευση και αποχέτευση για όλη την επικράτεια του Δήμου",
            "Water supply and sewerage for the whole municipal territory",
            "Wasser und Abwasser für das gesamte Gemeindegebiet",
            "Eau et assainissement pour l’ensemble du territoire municipal",
          ),
        },
        {
          label: s("Συνέχεια παροχής", "Continuity of supply", "Versorgungskontinuität", "Continuité de service"),
          description: s(
            "Σταθερή λειτουργία δικτύων με προληπτική συντήρηση",
            "Steady network operation with preventive maintenance",
            "Stabiler Netzbetrieb mit vorbeugender Instandhaltung",
            "Fonctionnement stable des réseaux grâce à une maintenance préventive",
          ),
        },
        {
          label: s("Βελτίωση υποδομών", "Infrastructure improvement", "Infrastrukturverbesserung", "Amélioration des infrastructures"),
          description: s(
            "Συνεχής αναβάθμιση δικτύων και εγκαταστάσεων",
            "Ongoing upgrade of networks and facilities",
            "Stetiger Ausbau von Netzen und Anlagen",
            "Modernisation continue des réseaux et des installations",
          ),
        },
      ],
    },
    values: {
      title: s("Αξίες", "Values", "Werte", "Valeurs"),
      kicker: s("Αξίες", "Values", "Werte", "Valeurs"),
      lead: s(
        "Οι αξίες μας καθοδηγούν κάθε απόφαση — από την ποιότητα του νερού μέχρι τη σχέση εμπιστοσύνης με τον πολίτη.",
        "Our values guide every decision — from water quality to a relationship of trust with residents.",
        "Unsere Werte leiten jede Entscheidung — von der Wasserqualität bis zur Vertrauensbeziehung mit den Bürgerinnen und Bürgern.",
        "Nos valeurs orientent chaque décision — de la qualité de l’eau jusqu’à la relation de confiance avec les habitants.",
      ),
      stats: [
        {
          label: s("Βασικές αξίες", "Core values", "Grundwerte", "Valeurs essentielles"),
          description: s(
            "Ποιότητα, Διαφάνεια, Καινοτομία και Βιωσιμότητα",
            "Quality, transparency, innovation, and sustainability",
            "Qualität, Transparenz, Innovation und Nachhaltigkeit",
            "Qualité, transparence, innovation et durabilité",
          ),
        },
        {
          label: s("Δημόσια υπηρεσία", "Public service", "Öffentlicher Dienst", "Service public"),
          description: s(
            "Υπευθυνότητα απέναντι στους πολίτες και το περιβάλλον",
            "Responsibility towards residents and the environment",
            "Verantwortung gegenüber den Bürgerinnen und Bürgern und der Umwelt",
            "Responsabilité envers les habitants et l’environnement",
          ),
        },
        {
          label: s("Εμπιστοσύνη πολιτών", "Public trust", "Vertrauen der Bürger", "Confiance des habitants"),
          description: s(
            "Συνεχής βελτίωση εξυπηρέτησης και διαφάνειας",
            "Continuous improvement of service and transparency",
            "Stetige Verbesserung von Service und Transparenz",
            "Amélioration continue du service et de la transparence",
          ),
        },
      ],
    },
    water: {
      title: s("Ύδρευση & Αποχέτευση", "Water & sewerage", "Wasser & Abwasser", "Eau et assainissement"),
      kicker: s("Ύδρευση & Αποχέτευση", "Water & sewerage", "Wasser & Abwasser", "Eau et assainissement"),
      lead: s(
        "Από την παραγωγή και μεταφορά πόσιμου νερού μέχρι τη συλλογή, επεξεργασία και διάθεση λυμάτων — ολόκληρος ο κύκλος του νερού.",
        "From the production and conveyance of drinking water to the collection, treatment, and disposal of wastewater — the full water cycle.",
        "Von der Gewinnung und Fortleitung von Trinkwasser bis zur Sammlung, Aufbereitung und Ableitung von Abwasser — der gesamte Wasserkreislauf.",
        "De la production et du transport de l’eau potable jusqu’à la collecte, le traitement et l’évacuation des eaux usées — le cycle complet de l’eau.",
      ),
      footnote: s(
        "* Ενδεικτικά στοιχεία λειτουργίας",
        "* Indicative operating figures",
        "* Orientierende Betriebskennzahlen",
        "* Données de fonctionnement indicatives",
      ),
      stats: [
        {
          label: s("Ποιότητα νερού", "Water quality", "Wasserqualität", "Qualité de l’eau"),
          description: s(
            "Συμμόρφωση με πρότυπα πόσιμου νερού",
            "Compliance with drinking-water standards",
            "Einhaltung der Trinkwasserstandards",
            "Conformité aux normes de l’eau potable",
          ),
        },
        {
          label: s("Επένδυση υποδομών", "Infrastructure investment", "Infrastrukturinvestition", "Investissement d’infrastructure"),
          description: s(
            "Αναβάθμιση δικτύων ύδρευσης και αποχέτευσης",
            "Upgrade of water and sewerage networks",
            "Ausbau der Wasser- und Abwassernetze",
            "Modernisation des réseaux d’eau et d’assainissement",
          ),
        },
        {
          label: s("Τοπική κάλυψη", "Local coverage", "Örtliche Abdeckung", "Couverture locale"),
          description: s(
            "Δίκτυα που εξυπηρετούν τις τοπικές κοινότητες",
            "Networks that serve the local communities",
            "Netze, die die örtlichen Gemeinschaften versorgen",
            "Des réseaux au service des communautés locales",
          ),
        },
      ],
    },
    structure: {
      title: s("Οργανωτική Δομή", "Organisational structure", "Organisationsstruktur", "Structure organisationnelle"),
      kicker: s("Οργανωτική Δομή", "Organisational structure", "Organisationsstruktur", "Structure organisationnelle"),
      lead: s(
        "Εξειδικευμένες διευθύνσεις και τμήματα που συνεργάζονται για την απρόσκοπτη λειτουργία των υπηρεσιών.",
        "Specialised directorates and departments working together for uninterrupted services.",
        "Fachdirektionen und Abteilungen, die für einen reibungslosen Betrieb der Dienste zusammenarbeiten.",
        "Des directions et services spécialisés qui coopèrent pour un fonctionnement ininterrompu des services.",
      ),
      stats: [
        {
          label: s("Τμήματα λειτουργίας", "Operating departments", "Betriebsabteilungen", "Services opérationnels"),
          description: s(
            "Τεχνικές υπηρεσίες, ύδρευση, αποχέτευση, εξυπηρέτηση",
            "Technical services, water supply, sewerage, customer service",
            "Technische Dienste, Wasser, Abwasser, Kundendienst",
            "Services techniques, eau, assainissement, accueil",
          ),
        },
        {
          label: s("Μόνιμες συμβάσεις", "Permanent contracts", "Unbefristete Verträge", "Contrats permanents"),
          description: s(
            "Σταθερή ομάδα με εξειδίκευση στον κλάδο",
            "A stable team with sector expertise",
            "Ein festes Team mit Branchenkompetenz",
            "Une équipe stable, spécialisée dans le secteur",
          ),
        },
        {
          label: s("Γυναίκες στελέχη", "Women in leadership", "Frauen in Leitungsfunktionen", "Femmes cadres"),
          description: s(
            "Ισότιμη συμμετοχή στη διοίκηση και τα τμήματα",
            "Equal participation in management and departments",
            "Gleichberechtigte Mitwirkung in Leitung und Abteilungen",
            "Participation égale à la direction et dans les services",
          ),
        },
      ],
    },
  },
  structure: {
    aria: s("Οργανωτική Δομή", "Organisational structure", "Organisationsstruktur", "Structure organisationnelle"),
    label: s("Οργανωτική Δομή", "Organisational structure", "Organisationsstruktur", "Structure organisationnelle"),
    titleLine1: s("Μία επιχείρηση,", "One utility,", "Ein Unternehmen,", "Une entreprise,"),
    titleLine2: s("πέντε κατευθύνσεις.", "five directions.", "fünf Richtungen.", "cinq orientations."),
    lead: s(
      "Η ΔΕΥΑΑ αποτελείται από εξειδικευμένες διευθύνσεις και τμήματα που συνεργάζονται για την απρόσκοπτη λειτουργία των υπηρεσιών ύδρευσης και αποχέτευσης.",
      "DEYAA is made up of specialised directorates and departments that work together for the uninterrupted operation of water supply and sewerage services.",
      "Die DEYAA besteht aus Fachdirektionen und Abteilungen, die für den reibungslosen Betrieb der Wasser- und Abwasserdienste zusammenarbeiten.",
      "La DEYAA est composée de directions et de services spécialisés qui coopèrent pour le fonctionnement ininterrompu des services d’eau et d’assainissement.",
    ),
    departments: [
      {
        title: s(
          "Διεύθυνση Διοικητικών & Οικονομικών Υπηρεσιών",
          "Directorate of Administrative & Financial Services",
          "Direktion Verwaltung & Finanzen",
          "Direction des services administratifs et financiers",
        ),
        description: s(
          "Διοίκηση, λογιστήριο, ανθρώπινο δυναμικό και οικονομικός προγραμματισμός.",
          "Administration, accounting, human resources, and financial planning.",
          "Verwaltung, Rechnungswesen, Personal und Finanzplanung.",
          "Administration, comptabilité, ressources humaines et planification financière.",
        ),
      },
      {
        title: s(
          "Διεύθυνση Τεχνικών Υπηρεσιών",
          "Directorate of Technical Services",
          "Direktion Technische Dienste",
          "Direction des services techniques",
        ),
        description: s(
          "Σχεδιασμός, κατασκευή και συντήρηση υδραυλικών υποδομών.",
          "Design, construction, and maintenance of hydraulic infrastructure.",
          "Planung, Bau und Unterhalt hydraulischer Infrastruktur.",
          "Conception, construction et entretien des infrastructures hydrauliques.",
        ),
      },
      {
        title: s("Τμήμα Ύδρευσης", "Water Supply Department", "Abteilung Wasserversorgung", "Service de l’eau"),
        description: s(
          "Παραγωγή, μεταφορά και διανομή πόσιμου νερού.",
          "Production, conveyance, and distribution of drinking water.",
          "Gewinnung, Fortleitung und Verteilung von Trinkwasser.",
          "Production, transport et distribution de l’eau potable.",
        ),
      },
      {
        title: s("Τμήμα Αποχέτευσης", "Sewerage Department", "Abteilung Abwasser", "Service de l’assainissement"),
        description: s(
          "Συλλογή, μεταφορά και επεξεργασία λυμάτων.",
          "Collection, conveyance, and treatment of wastewater.",
          "Sammlung, Fortleitung und Aufbereitung von Abwasser.",
          "Collecte, transport et traitement des eaux usées.",
        ),
      },
      {
        title: s(
          "Τμήμα Εξυπηρέτησης Πολιτών",
          "Citizen Service Department",
          "Abteilung Bürgerdienst",
          "Service aux habitants",
        ),
        description: s(
          "Υποστήριξη πολιτών, λογαριασμοί και ψηφιακές υπηρεσίες.",
          "Resident support, billing, and digital services.",
          "Unterstützung der Bürgerinnen und Bürger, Rechnungen und digitale Dienste.",
          "Accompagnement des habitants, factures et services numériques.",
        ),
      },
    ],
  },
  board: {
    presidentRole: s("Πρόεδρος Δ.Σ.", "Chair of the Board", "Vorsitzender des Verwaltungsrats", "Président du C.A."),
    memberRole: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
    councillor: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
    workersRep: s(
      "Εκπρόσωπος Εργαζομένων",
      "Employees’ representative",
      "Vertreter der Beschäftigten",
      "Représentant des salariés",
    ),
    foundationRep: s(
      "Εκπρόσωπος Ιδρύματος «Αγία Σοφία»",
      "Representative of the «Αγία Σοφία» Foundation",
      "Vertreter der Stiftung «Αγία Σοφία»",
      "Représentant de la fondation «Αγία Σοφία»",
    ),
    citizensRep: s(
      "Εκπρόσωπος Δημοτών",
      "Residents’ representative",
      "Vertreter der Bürgerinnen und Bürger",
      "Représentant des habitants",
    ),
    members: {
      "Ιωάννης Αθητάκης": {
        role: s("Πρόεδρος Δ.Σ.", "Chair of the Board", "Vorsitzender des Verwaltungsrats", "Président du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Προεδρεύει του Δ.Σ. και καθοδηγεί τον στρατηγικό σχεδιασμό για ύδρευση, αποχέτευση και έργα υποδομής στον Δήμο Αποκορώνου.",
          "Chairs the Board and guides strategic planning for water supply, sewerage, and infrastructure projects in the Municipality of Apokoronas.",
          "Leitet den Verwaltungsrat und führt die strategische Planung für Wasser, Abwasser und Infrastrukturvorhaben in der Gemeinde Apokoronas.",
          "Préside le C.A. et oriente la planification stratégique pour l’eau, l’assainissement et les projets d’infrastructure dans la municipalité d’Apokoronas.",
        ),
      },
      "Μαρία Τσιλεδάκη": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Συμμετέχει στη χάραξη πολιτικής για τη βιώσιμη διαχείριση του νερού και την αναβάθμιση των δικτύων της ΔΕΥΑΑ.",
          "Takes part in shaping policy for sustainable water management and the upgrade of DEYAA’s networks.",
          "Wirkt an der Politikgestaltung für eine nachhaltige Wasserbewirtschaftung und den Ausbau der DEYAA-Netze mit.",
          "Participe à l’élaboration de la politique de gestion durable de l’eau et à la modernisation des réseaux de la DEYAA.",
        ),
      },
      "Αργυρώ Καυκαλά": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Εκπροσωπεί το Δημοτικό Συμβούλιο στις αποφάσεις για την ποιότητα υπηρεσιών ύδρευσης και αποχέτευσης.",
          "Represents the Municipal Council in decisions on the quality of water and sewerage services.",
          "Vertritt den Gemeinderat bei Entscheidungen zur Qualität der Wasser- und Abwasserdienste.",
          "Représente le conseil municipal dans les décisions sur la qualité des services d’eau et d’assainissement.",
        ),
      },
      "Σταύρος Σταυρουλάκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Συνεισφέρει στον προγραμματισμό έργων και στη διαφάνεια στη λειτουργία της επιχείρησης.",
          "Contributes to project planning and to transparency in the operation of the utility.",
          "Trägt zur Vorhabenplanung und zur Transparenz im Betrieb des Unternehmens bei.",
          "Contribue à la programmation des travaux et à la transparence du fonctionnement de l’entreprise.",
        ),
      },
      "Γεώργιος Γυπαράκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Μέλος του Δ.Σ. με εστίαση στη σύνδεση της ΔΕΥΑΑ με τις ανάγκες της τοπικής κοινωνίας.",
          "A Board member focused on connecting DEYAA with the needs of the local community.",
          "Mitglied des Verwaltungsrats mit Fokus auf die Verbindung der DEYAA mit den Bedürfnissen der örtlichen Gemeinschaft.",
          "Membre du C.A. axé sur le lien entre la DEYAA et les besoins de la communauté locale.",
        ),
      },
      "Ιωάννης Κουκουράκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Συμμετέχει στις αποφάσεις για τη λειτουργία και ανάπτυξη των υποδομών νερού στον Αποκόρωνα.",
          "Takes part in decisions on the operation and development of water infrastructure in Apokoronas.",
          "Wirkt an Entscheidungen zum Betrieb und Ausbau der Wasserinfrastruktur in Apokoronas mit.",
          "Participe aux décisions sur le fonctionnement et le développement des infrastructures d’eau à Apokoronas.",
        ),
      },
      "Πέτρος Μπενάκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Εκπροσωπεί τους δημότες στο Δ.Σ. για θέματα ύδρευσης, αποχέτευσης και δημοτικών υπηρεσιών.",
          "Represents residents on the Board on matters of water supply, sewerage, and municipal services.",
          "Vertritt die Bürgerinnen und Bürger im Verwaltungsrat in Fragen von Wasser, Abwasser und kommunalen Diensten.",
          "Représente les habitants au C.A. sur les questions d’eau, d’assainissement et de services municipaux.",
        ),
      },
      "Σταύρος Ψαρουδάκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s("Δημοτικός Σύμβουλος", "Municipal councillor", "Gemeinderatsmitglied", "Conseiller municipal"),
        hoverDetail: s(
          "Συμμετέχει στις αποφάσεις για την οργάνωση και τον εκσυγχρονισμό των υπηρεσιών της ΔΕΥΑΑ.",
          "Takes part in decisions on the organisation and modernisation of DEYAA’s services.",
          "Wirkt an Entscheidungen zur Organisation und Modernisierung der DEYAA-Dienste mit.",
          "Participe aux décisions sur l’organisation et la modernisation des services de la DEYAA.",
        ),
      },
      "Νικόλαος Λαγαράκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s(
          "Εκπρόσωπος Εργαζομένων",
          "Employees’ representative",
          "Vertreter der Beschäftigten",
          "Représentant des salariés",
        ),
        hoverDetail: s(
          "Εκπροσωπεί τους εργαζόμενους της ΔΕΥΑΑ και τη συμμετοχή τους στη λειτουργία της επιχείρησης.",
          "Represents DEYAA’s employees and their participation in the operation of the utility.",
          "Vertritt die Beschäftigten der DEYAA und ihre Mitwirkung am Betrieb des Unternehmens.",
          "Représente les salariés de la DEYAA et leur participation au fonctionnement de l’entreprise.",
        ),
      },
      "Μιχαήλ Βλαβογιλάκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s(
          "Εκπρόσωπος Ιδρύματος «Αγία Σοφία»",
          "Representative of the «Αγία Σοφία» Foundation",
          "Vertreter der Stiftung «Αγία Σοφία»",
          "Représentant de la fondation «Αγία Σοφία»",
        ),
        hoverDetail: s(
          "Μεταφέρει στο Δ.Σ. την εμπειρία και τις ανάγκες του Ιδρύματος σε θέματα ύδρευσης και αποχέτευσης.",
          "Brings to the Board the Foundation’s experience and needs on water supply and sewerage.",
          "Bringt die Erfahrung und die Bedürfnisse der Stiftung in Fragen von Wasser und Abwasser in den Verwaltungsrat ein.",
          "Porte au C.A. l’expérience et les besoins de la Fondation en matière d’eau et d’assainissement.",
        ),
      },
      "Ανδρέας Βροντάκης": {
        role: s("Μέλος Δ.Σ.", "Board member", "Mitglied des Verwaltungsrats", "Membre du C.A."),
        position: s(
          "Εκπρόσωπος Δημοτών",
          "Residents’ representative",
          "Vertreter der Bürgerinnen und Bürger",
          "Représentant des habitants",
        ),
        hoverDetail: s(
          "Εκπροσωπεί τους πολίτες και συμβάλλει στη διασύνδεση της ΔΕΥΑΑ με την καθημερινότητα του Δήμου.",
          "Represents residents and helps connect DEYAA with everyday life in the Municipality.",
          "Vertritt die Bürgerinnen und Bürger und trägt zur Verbindung der DEYAA mit dem Alltag der Gemeinde bei.",
          "Représente les habitants et contribue à relier la DEYAA au quotidien de la municipalité.",
        ),
      },
    },
  },
  administration: {
    label: s("Διοίκηση", "Board", "Vorstand", "Direction"),
    membersShort: s("Μέλη Δ.Σ.", "Board members", "Verwaltungsrat", "Membres du C.A."),
    seeAll: s("Δείτε όλα", "See all", "Alle anzeigen", "Tout voir"),
    headline: s(
      "Η ομάδα που καθοδηγεί τη ΔΕΥΑΑ",
      "The team that guides DEYAA",
      "Das Team, das die DEYAA führt",
      "L’équipe qui guide la DEYAA",
    ),
    intro: s(
      "Το ενδεκαμελές Διοικητικό Συμβούλιο χαράσσει την πολιτική και τις αποφάσεις που διαμορφώνουν τις υπηρεσίες μας — με διαφάνεια, συνεργασία και υπευθυνότητα απέναντι στους πολίτες.",
      "The eleven-member Board of Directors sets the policy and the decisions that shape our services — with transparency, collaboration, and responsibility towards residents.",
      "Der elfköpfige Verwaltungsrat bestimmt die Politik und die Entscheidungen, die unsere Dienste prägen — mit Transparenz, Zusammenarbeit und Verantwortung gegenüber den Bürgerinnen und Bürgern.",
      "Le conseil d’administration de onze membres définit la politique et les décisions qui façonnent nos services — avec transparence, collaboration et responsabilité envers les habitants.",
    ),
    introDetail: s(
      "Τα μέλη του Δ.Σ. ορίζονται από το Δημοτικό Συμβούλιο και εκπροσωπούν τους πολίτες, τους φορείς του Δήμου και τους εργαζόμενους.",
      "Board members are appointed by the Municipal Council and represent residents, municipal bodies, and employees.",
      "Die Mitglieder des Verwaltungsrats werden vom Gemeinderat bestellt und vertreten die Bürgerinnen und Bürger, die Einrichtungen der Gemeinde und die Beschäftigten.",
      "Les membres du C.A. sont désignés par le conseil municipal et représentent les habitants, les institutions de la municipalité et les salariés.",
    ),
  },
} as const;
