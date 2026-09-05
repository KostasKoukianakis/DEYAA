import type { I18nText } from "@/i18n/types";

const s = (el: string, en: string, de: string, fr: string): I18nText => ({ el, en, de, fr });

export const servicesCatalog = {
  page: {
    headline: s("Υπηρεσίες", "Services", "Dienste", "Services"),
    heroIntro: s(
      "Οι λύσεις μας κάνουν τη διαφορά επειδή αναλαμβάνουμε την ευθύνη να λειτουργούν — με συνέπεια, ευελιξία και βιώσιμες υπηρεσίες. Έτσι μπορούμε να σας στηρίξουμε.",
      "Our solutions make a difference because we take responsibility for making them work — with consistency, flexibility, and sustainable services. That is how we can support you.",
      "Unsere Lösungen machen den Unterschied, weil wir die Verantwortung dafür übernehmen, dass sie funktionieren — mit Beständigkeit, Flexibilität und nachhaltigen Diensten. So können wir Sie unterstützen.",
      "Nos solutions font la différence parce que nous prenons la responsabilité de les faire fonctionner — avec constance, souplesse et des services durables. C’est ainsi que nous pouvons vous accompagner.",
    ),
    tabsAria: s(
      "Κατηγορίες υπηρεσιών",
      "Service categories",
      "Dienstkategorien",
      "Catégories de services",
    ),
    waterAlt: s("Ύδρευση", "Water supply", "Wasserversorgung", "Alimentation en eau"),
    sewerageAlt: s("Αποχέτευση", "Sewerage", "Abwasser", "Assainissement"),
    documentsAlt: s("Δικαιολογητικά", "Documents", "Unterlagen", "Justificatifs"),
    availableForms: s("Διαθέσιμα έντυπα", "Available forms", "Verfügbare Formulare", "Formulaires disponibles"),
  },
  sections: {
    water: {
      title: s("Ύδρευση", "Water supply", "Wasserversorgung", "Alimentation en eau"),
      lead: s(
        "Η ΔΕΥΑΑ είναι υπεύθυνη για την παροχή καθαρού πόσιμου νερού σε όλους τους κατοίκους του Αποκόρωνα. Το δίκτυο ύδρευσης καλύπτει την περιοχή ευθύνης μας και παρέχει νερό υψηλής ποιότητας που ελέγχεται καθημερινά.",
        "DEYAA is responsible for supplying clean drinking water to all residents of Apokoronas. The water network covers our area of responsibility and provides high quality water that is tested every day.",
        "Die DEYAA ist für die Versorgung aller Einwohner von Apokoronas mit sauberem Trinkwasser zuständig. Das Wassernetz deckt unser Zuständigkeitsgebiet ab und liefert täglich geprüftes Wasser hoher Qualität.",
        "La DEYAA est responsable de l’approvisionnement en eau potable propre de tous les habitants d’Apokoronas. Le réseau d’eau couvre notre zone de compétence et fournit une eau de haute qualité contrôlée chaque jour.",
      ),
      leadHighlights: {
        0: s("πόσιμου νερού", "drinking water", "Trinkwasser", "eau potable"),
        1: s("υψηλής ποιότητας", "high quality", "hoher Qualität", "haute qualité"),
      },
      blocks: {
        "water-connection": {
          title: s("Νέα σύνδεση ύδρευσης", "New water connection", "Neuer Wasseranschluss", "Nouveau branchement d’eau"),
          paragraph: s(
            "Για νέα σύνδεση στο δίκτυο ύδρευσης, υποβάλλετε αίτηση στα γραφεία μας με τα απαιτούμενα δικαιολογητικά. Το τεχνικό τμήμα ελέγχει τη δυνατότητα σύνδεσης και προγραμματίζει την εγκατάσταση.",
            "For a new connection to the water network, submit an application at our offices with the required documents. The technical department checks whether a connection is possible and schedules the installation.",
            "Für einen neuen Anschluss an das Wassernetz stellen Sie in unseren Büros einen Antrag mit den erforderlichen Unterlagen. Die technische Abteilung prüft die Anschlussmöglichkeit und plant die Installation.",
            "Pour un nouveau branchement au réseau d’eau, déposez une demande à nos bureaux avec les justificatifs requis. Le service technique vérifie la faisabilité du branchement et programme l’installation.",
          ),
          intro: s("Τι θα χρειαστείτε:", "What you will need:", "Was Sie benötigen:", "Ce dont vous aurez besoin :"),
          bullets: [
            {
              label: s("Αίτηση", "Application", "Antrag", "Demande"),
              text: s(
                "υποβολή αίτησης στα γραφεία της ΔΕΥΑΑ.",
                "submit an application at the DEYAA offices.",
                "Antragstellung in den Büros der DEYAA.",
                "dépôt d’une demande aux bureaux de la DEYAA.",
              ),
            },
            {
              label: s("Τίτλος ιδιοκτησίας", "Proof of ownership", "Eigentumsnachweis", "Titre de propriété"),
              text: s(
                "τίτλος ιδιοκτησίας ή μισθωτήριο συμβόλαιο.",
                "title deed or tenancy agreement.",
                "Eigentumstitel oder Mietvertrag.",
                "titre de propriété ou contrat de location.",
              ),
            },
            {
              label: s("Άδεια οικοδομής", "Building permit", "Baugenehmigung", "Permis de construire"),
              text: s(
                "για νέες κατασκευές, σύμφωνα με την ισχύουσα νομοθεσία.",
                "for new buildings, in accordance with current legislation.",
                "für Neubauten, gemäß der geltenden Gesetzgebung.",
                "pour les constructions neuves, conformément à la législation en vigueur.",
              ),
            },
            {
              label: s("Ταυτότητα", "Identity document", "Ausweis", "Pièce d’identité"),
              text: s(
                "δελτίο αστυνομικής ταυτότητας του αιτούντος.",
                "the applicant’s national identity card.",
                "Personalausweis der antragstellenden Person.",
                "carte d’identité nationale du demandeur.",
              ),
            },
          ],
        },
        "water-details": {
          title: s("Αλλαγή στοιχείων", "Change of details", "Änderung der Daten", "Modification des coordonnées"),
          paragraph: s(
            "Σε περίπτωση μεταβίβασης, αλλαγής επωνυμίας ή διόρθωσης στοιχείων καταναλωτή, υποβάλλεται σχετική αίτηση με τα αποδεικτικά έγγραφα.",
            "In the event of a transfer, a change of name, or a correction of consumer details, submit the relevant application with supporting documents.",
            "Bei Übertragung, Namensänderung oder Berichtigung von Verbraucherdaten ist ein entsprechender Antrag mit Nachweisunterlagen einzureichen.",
            "En cas de transfert, de changement de dénomination ou de correction des données du consommateur, déposez la demande correspondante avec les pièces justificatives.",
          ),
          intro: s(
            "Η διαδικασία περιλαμβάνει:",
            "The process includes:",
            "Das Verfahren umfasst:",
            "La procédure comprend :",
          ),
          bullets: [
            {
              label: s("Αίτηση αλλαγής", "Change request", "Änderungsantrag", "Demande de modification"),
              text: s(
                "συμπλήρωση και υποβολή εντύπου αλλαγής στοιχείων.",
                "complete and submit the change-of-details form.",
                "Ausfüllen und Einreichen des Formulars zur Datenänderung.",
                "remplir et déposer le formulaire de modification des données.",
              ),
            },
            {
              label: s("Αποδεικτικά", "Supporting documents", "Nachweise", "Justificatifs"),
              text: s(
                "νέος τίτλος ιδιοκτησίας ή μισθωτήριο, όπου απαιτείται.",
                "a new title deed or tenancy agreement, where required.",
                "neuer Eigentumstitel oder Mietvertrag, soweit erforderlich.",
                "nouveau titre de propriété ou contrat de location, le cas échéant.",
              ),
            },
            {
              label: s("Εξόφληση", "Settlement of arrears", "Begleichung", "Régularisation"),
              text: s(
                "εξόφληση τυχόν εκκρεμών οφειλών πριν την οριστική ενημέρωση.",
                "settle any outstanding debts before the record is updated.",
                "Begleichung etwaiger offener Forderungen vor der endgültigen Aktualisierung.",
                "régler d’éventuelles dettes en souffrance avant la mise à jour définitive.",
              ),
            },
          ],
        },
        "water-quality": {
          title: s("Ποιότητα νερού", "Water quality", "Wasserqualität", "Qualité de l’eau"),
          paragraph: s(
            "Το νερό που παρέχει η ΔΕΥΑΑ ελέγχεται σε διαπιστευμένα εργαστήρια για να διασφαλίζεται η τήρηση όλων των προτύπων ποιότητας.",
            "The water DEYAA supplies is tested in accredited laboratories to ensure that all quality standards are met.",
            "Das von der DEYAA gelieferte Wasser wird in akkreditierten Laboren geprüft, damit alle Qualitätsstandards eingehalten werden.",
            "L’eau fournie par la DEYAA est contrôlée dans des laboratoires accrédités afin de garantir le respect de toutes les normes de qualité.",
          ),
          intro: s(
            "Οι βασικοί έλεγχοι περιλαμβάνουν:",
            "The main checks include:",
            "Die wichtigsten Kontrollen umfassen:",
            "Les contrôles essentiels comprennent :",
          ),
          bullets: [
            {
              label: s("Μικροβιολογικοί δείκτες", "Microbiological indicators", "Mikrobiologische Indikatoren", "Indicateurs microbiologiques"),
              text: s(
                "συνεχής παρακολούθηση της ασφάλειας του πόσιμου νερού.",
                "continuous monitoring of drinking-water safety.",
                "laufende Überwachung der Trinkwassersicherheit.",
                "suivi continu de la sécurité de l’eau potable.",
              ),
            },
            {
              label: s("Χημικές παράμετροι", "Chemical parameters", "Chemische Parameter", "Paramètres chimiques"),
              text: s(
                "έλεγχος συμμόρφωσης με τις ισχύουσες οριακές τιμές.",
                "checks for compliance with the applicable limit values.",
                "Prüfung der Einhaltung der geltenden Grenzwerte.",
                "contrôle de conformité aux valeurs limites en vigueur.",
              ),
            },
            {
              label: s("pH & αγωγιμότητα", "pH & conductivity", "pH & Leitfähigkeit", "pH et conductivité"),
              text: s(
                "παρακολούθηση βασικών φυσικοχημικών μεγεθών.",
                "monitoring of key physicochemical values.",
                "Überwachung grundlegender physikalisch-chemischer Größen.",
                "suivi des grandeurs physico-chimiques essentielles.",
              ),
            },
            {
              label: s("Υπολειμματικό χλώριο", "Residual chlorine", "Restchlor", "Chlore résiduel"),
              text: s(
                "διασφάλιση απολύμανσης και προστασίας του δικτύου.",
                "ensuring disinfection and protection of the network.",
                "Sicherstellung der Desinfektion und des Netzschutzes.",
                "garantie de la désinfection et de la protection du réseau.",
              ),
            },
          ],
        },
        "water-maintenance": {
          title: s(
            "Συντήρηση & επισκευές",
            "Maintenance & repairs",
            "Wartung & Reparaturen",
            "Entretien et réparations",
          ),
          paragraph: s(
            "Τα συνεργεία μας συντηρούν το δίκτυο ύδρευσης και ανταποκρίνονται άμεσα σε βλάβες και διαρροές, με στόχο τη συνεχή και αξιόπιστη παροχή.",
            "Our crews maintain the water network and respond promptly to faults and leaks, with the aim of continuous, reliable supply.",
            "Unsere Teams warten das Wassernetz und reagieren umgehend auf Störungen und Leckagen, damit die Versorgung ununterbrochen und zuverlässig bleibt.",
            "Nos équipes entretiennent le réseau d’eau et interviennent rapidement en cas de pannes et de fuites, pour une fourniture continue et fiable.",
          ),
          intro: s(
            "Υπηρεσίες που παρέχουμε:",
            "Services we provide:",
            "Leistungen, die wir erbringen:",
            "Services que nous proposons :",
          ),
          bullets: [
            {
              label: s("Συντήρηση δικτύου", "Network maintenance", "Netzwartung", "Entretien du réseau"),
              text: s(
                "προληπτικοί έλεγχοι και συντήρηση αγωγών και εξοπλισμού.",
                "preventive inspections and maintenance of pipes and equipment.",
                "vorbeugende Prüfungen sowie Wartung von Leitungen und Anlagen.",
                "contrôles préventifs et entretien des canalisations et des équipements.",
              ),
            },
            {
              label: s("Επισκευή διαρροών", "Leak repairs", "Leckagenbeseitigung", "Réparation des fuites"),
              text: s(
                "άμεση κινητοποίηση συνεργείων για αποκατάσταση βλαβών.",
                "immediate dispatch of crews to restore service after faults.",
                "sofortiger Einsatz von Teams zur Störungsbeseitigung.",
                "mobilisation immédiate des équipes pour rétablir le service.",
              ),
            },
            {
              label: s("Υδρομέτρα", "Water meters", "Wasserzähler", "Compteurs d’eau"),
              text: s(
                "αντικατάσταση ή έλεγχος υδρομέτρων όπου απαιτείται.",
                "replacement or inspection of water meters where required.",
                "Austausch oder Prüfung von Wasserzählern, soweit erforderlich.",
                "remplacement ou contrôle des compteurs d’eau lorsque c’est nécessaire.",
              ),
            },
            {
              label: s("24/7", "24/7", "24/7", "24/7"),
              text: s(
                "επείγουσες επεμβάσεις για σοβαρές διαρροές — 28253-40213.",
                "emergency response for serious leaks — 28253-40213.",
                "Noteinsätze bei schweren Leckagen — 28253-40213.",
                "interventions d’urgence pour les fuites graves — 28253-40213.",
              ),
            },
          ],
        },
      },
    },
    sewerage: {
      title: s("Αποχέτευση", "Sewerage", "Abwasser", "Assainissement"),
      lead: s(
        "Η ΔΕΥΑΑ διαχειρίζεται το δίκτυο αποχέτευσης της περιοχής — από τη συλλογή και μεταφορά έως την επεξεργασία λυμάτων — με σύγχρονες μεθόδους και σεβασμό στο περιβάλλον.",
        "DEYAA manages the area’s sewerage network — from collection and transport through to wastewater treatment — using modern methods and with respect for the environment.",
        "Die DEYAA betreibt das Abwassernetz der Region — von der Sammlung und dem Transport bis zur Abwasserbehandlung — mit modernen Verfahren und Respekt für die Umwelt.",
        "La DEYAA gère le réseau d’assainissement de la région — de la collecte et du transport jusqu’au traitement des eaux usées — avec des méthodes modernes et dans le respect de l’environnement.",
      ),
      leadHighlights: {
        0: s("επεξεργασία λυμάτων", "wastewater treatment", "Abwasserbehandlung", "traitement des eaux usées"),
        1: s("σύγχρονες μεθόδους", "modern methods", "modernen Verfahren", "méthodes modernes"),
      },
      blocks: {
        "sewerage-connection": {
          title: s(
            "Νέα σύνδεση αποχέτευσης",
            "New sewerage connection",
            "Neuer Abwasseranschluss",
            "Nouveau branchement d’assainissement",
          ),
          paragraph: s(
            "Η σύνδεση στο δημόσιο δίκτυο αποχέτευσης απαιτεί τεχνική μελέτη και έγκριση, ώστε να διασφαλίζεται η ορθή λειτουργία του δικτύου.",
            "Connection to the public sewerage network requires a technical study and approval, so that the network continues to operate correctly.",
            "Der Anschluss an das öffentliche Abwassernetz erfordert eine technische Studie und eine Genehmigung, damit das Netz ordnungsgemäß funktioniert.",
            "Le raccordement au réseau public d’assainissement nécessite une étude technique et une approbation, afin de garantir le bon fonctionnement du réseau.",
          ),
          intro: s(
            "Απαιτούμενα δικαιολογητικά:",
            "Required documents:",
            "Erforderliche Unterlagen:",
            "Justificatifs requis :",
          ),
          bullets: [
            {
              label: s("Αίτηση σύνδεσης", "Connection application", "Anschlussantrag", "Demande de raccordement"),
              text: s(
                "υποβολή αίτησης στα γραφεία της ΔΕΥΑΑ.",
                "submit an application at the DEYAA offices.",
                "Antragstellung in den Büros der DEYAA.",
                "dépôt d’une demande aux bureaux de la DEYAA.",
              ),
            },
            {
              label: s("Τοπογραφικό", "Site plan", "Lageplan", "Plan topographique"),
              text: s(
                "τοπογραφικό διάγραμμα της ακίνητης περιουσίας.",
                "topographic plan of the property.",
                "Lageplan der Liegenschaft.",
                "plan topographique du bien immobilier.",
              ),
            },
            {
              label: s("Άδεια οικοδομής", "Building permit", "Baugenehmigung", "Permis de construire"),
              text: s(
                "όπου απαιτείται για νέες κατασκευές.",
                "where required for new buildings.",
                "soweit für Neubauten erforderlich.",
                "lorsque cela est requis pour les constructions neuves.",
              ),
            },
            {
              label: s("Εγγύηση", "Guarantee deposit", "Kaution", "Garantie"),
              text: s(
                "κατάθεση εγγύησης σύμφωνα με την ισχύουσα τιμολογιακή πολιτική.",
                "a guarantee deposit in accordance with the current tariff policy.",
                "Kaution gemäß der geltenden Tarifpolitik.",
                "dépôt de garantie conformément à la politique tarifaire en vigueur.",
              ),
            },
          ],
        },
        "sewerage-repairs": {
          title: s("Βλάβες & αποφράξεις", "Faults & blockages", "Störungen & Verstopfungen", "Pannes et obstructions"),
          paragraph: s(
            "Σε περίπτωση βλάβης ή απόφραξης, τα συνεργεία μας κινητοποιούνται για άμεση επέμβαση και αποκατάσταση της ομαλής λειτουργίας του δικτύου.",
            "In the event of a fault or blockage, our crews are dispatched for immediate intervention and restoration of normal network operation.",
            "Bei einer Störung oder Verstopfung rücken unsere Teams zur sofortigen Intervention aus und stellen den normalen Netzbetrieb wieder her.",
            "En cas de panne ou d’obstruction, nos équipes sont mobilisées pour une intervention immédiate et le rétablissement du fonctionnement normal du réseau.",
          ),
          intro: s("Πώς να ενημερώσετε:", "How to notify us:", "So benachrichtigen Sie uns:", "Comment nous informer :"),
          bullets: [
            {
              label: s("Τηλεφωνικά", "By phone", "Telefonisch", "Par téléphone"),
              text: s(
                "καλέστε το 28253-40213 για άμεση εξυπηρέτηση.",
                "call 28253-40213 for immediate assistance.",
                "rufen Sie 28253-40213 für sofortige Hilfe an.",
                "appelez le 28253-40213 pour une assistance immédiate.",
              ),
            },
            {
              label: s("24/7", "24/7", "24/7", "24/7"),
              text: s(
                "επείγουσες περιπτώσεις αντιμετωπίζονται όλο το εικοσιτετράωρο.",
                "emergencies are handled around the clock.",
                "Notfälle werden rund um die Uhr bearbeitet.",
                "les urgences sont traitées 24 heures sur 24.",
              ),
            },
            {
              label: s("Online αναφορά", "Online report", "Online-Meldung", "Signalement en ligne"),
              text: s(
                "μέσω της φόρμας αναφοράς προβλήματος στις Ηλεκτρονικές Υπηρεσίες.",
                "via the problem-report form in e-Services.",
                "über das Störungsmeldeformular in den E-Services.",
                "via le formulaire de signalement dans les e-Services.",
              ),
            },
            {
              label: s("Συντήρηση", "Maintenance", "Wartung", "Entretien"),
              text: s(
                "προγραμματισμένες εργασίες συντήρησης για πρόληψη αποφράξεων.",
                "scheduled maintenance to prevent blockages.",
                "geplante Wartungsarbeiten zur Vorbeugung von Verstopfungen.",
                "travaux d’entretien programmés pour prévenir les obstructions.",
              ),
            },
          ],
        },
        "sewerage-treatment": {
          title: s("Επεξεργασία λυμάτων", "Wastewater treatment", "Abwasserbehandlung", "Traitement des eaux usées"),
          paragraph: s(
            "Οι εγκαταστάσεις επεξεργασίας λυμάτων της ΔΕΥΑΑ λειτουργούν με σύγχρονες τεχνολογίες για την προστασία του υδροφορέα και του περιβάλλοντος.",
            "DEYAA’s wastewater treatment plants operate with modern technologies to protect the aquifer and the environment.",
            "Die Abwasserbehandlungsanlagen der DEYAA arbeiten mit modernen Technologien zum Schutz des Grundwassers und der Umwelt.",
            "Les stations d’épuration de la DEYAA fonctionnent avec des technologies modernes pour protéger la nappe phréatique et l’environnement.",
          ),
          intro: s("Βασικές διαδικασίες:", "Main processes:", "Wesentliche Verfahren:", "Procédés essentiels :"),
          bullets: [
            {
              label: s("Βιολογική επεξεργασία", "Biological treatment", "Biologische Behandlung", "Traitement biologique"),
              text: s(
                "φυσικοχημικές διεργασίες για την απομάκρυνση ρύπων.",
                "physicochemical processes to remove pollutants.",
                "physikalisch-chemische Verfahren zur Schadstoffentfernung.",
                "procédés physico-chimiques pour l’élimination des polluants.",
              ),
            },
            {
              label: s("Χημική επεξεργασία", "Chemical treatment", "Chemische Behandlung", "Traitement chimique"),
              text: s(
                "συμπληρωματικοί έλεγχοι όπου απαιτείται.",
                "supplementary treatment where required.",
                "ergänzende Behandlungen, soweit erforderlich.",
                "traitements complémentaires lorsque c’est nécessaire.",
              ),
            },
            {
              label: s("Έλεγχοι ποιότητας", "Quality checks", "Qualitätskontrollen", "Contrôles de qualité"),
              text: s(
                "τακτική παρακολούθηση εξερχόμενων λυμάτων.",
                "regular monitoring of treated effluent.",
                "regelmäßige Überwachung des behandelten Abwassers.",
                "suivi régulier des eaux usées en sortie.",
              ),
            },
            {
              label: s("Βιώσιμη διαχείριση", "Sustainable management", "Nachhaltige Bewirtschaftung", "Gestion durable"),
              text: s(
                "συνεχής βελτίωση της απόδοσης των εγκαταστάσεων.",
                "continuous improvement of plant performance.",
                "laufende Verbesserung der Anlagenleistung.",
                "amélioration continue des performances des installations.",
              ),
            },
          ],
        },
        "sewerage-rules": {
          title: s(
            "Κανόνες χρήσης δικτύου",
            "Network use rules",
            "Nutzungsregeln des Netzes",
            "Règles d’utilisation du réseau",
          ),
          paragraph: s(
            "Η ορθή χρήση του δικτύου αποχέτευσης προστατεύει την υγεία, το περιβάλλον και την απρόσκοπτη λειτουργία των εγκαταστάσεων.",
            "Correct use of the sewerage network protects health, the environment, and the uninterrupted operation of the plants.",
            "Die richtige Nutzung des Abwassernetzes schützt die Gesundheit, die Umwelt und den ungestörten Betrieb der Anlagen.",
            "Une utilisation correcte du réseau d’assainissement protège la santé, l’environnement et le fonctionnement ininterrompu des installations.",
          ),
          intro: s(
            "Απαγορεύεται η απόρριψη:",
            "It is forbidden to dispose of:",
            "Untersagt ist die Entsorgung von:",
            "Il est interdit de jeter :",
          ),
          bullets: [
            {
              label: s("Λιπών & ελαίων", "Fats & oils", "Fette & Öle", "Graisses et huiles"),
              text: s(
                "προκαλούν αποφράξεις και βλάβες στο δίκτυο.",
                "they cause blockages and damage to the network.",
                "sie verursachen Verstopfungen und Schäden am Netz.",
                "elles provoquent des obstructions et des dommages au réseau.",
              ),
            },
            {
              label: s("Χημικών ουσιών", "Chemical substances", "Chemikalien", "Substances chimiques"),
              text: s(
                "επηρεάζουν την επεξεργασία και το περιβάλλον.",
                "they affect treatment and the environment.",
                "sie beeinträchtigen die Behandlung und die Umwelt.",
                "elles affectent le traitement et l’environnement.",
              ),
            },
            {
              label: s("Μπαταριών & φαρμάκων", "Batteries & medicines", "Batterien & Medikamente", "Piles et médicaments"),
              text: s(
                "απαιτούν ειδική συλλογή και διαχείριση.",
                "they require special collection and disposal.",
                "sie erfordern eine besondere Sammlung und Entsorgung.",
                "ils nécessitent une collecte et une gestion spécifiques.",
              ),
            },
            {
              label: s("Οικοδομικών υλικών", "Construction materials", "Baumaterialien", "Matériaux de construction"),
              text: s(
                "προκαλούν φραγμούς και σοβαρές βλάβες.",
                "they cause blockages and serious damage.",
                "sie verursachen Verstopfungen und schwere Schäden.",
                "ils provoquent des bouchons et des dégâts graves.",
              ),
            },
          ],
        },
      },
    },
    documents: {
      title: s("Δικαιολογητικά", "Documents", "Unterlagen", "Justificatifs"),
      lead: s(
        "Κατεβάστε τα απαραίτητα έντυπα για τις υπηρεσίες της ΔΕΥΑΑ. Μπορείτε να τα υποβάλετε αυτοπροσώπως στα γραφεία μας ή ηλεκτρονικά, σύμφωνα με τις οδηγίες κάθε υπηρεσίας.",
        "Download the required forms for DEYAA services. You can submit them in person at our offices or electronically, according to the instructions for each service.",
        "Laden Sie die erforderlichen Formulare für die Dienste der DEYAA herunter. Sie können sie persönlich in unseren Büros oder elektronisch einreichen, gemäß den Hinweisen jedes Dienstes.",
        "Téléchargez les formulaires nécessaires aux services de la DEYAA. Vous pouvez les déposer en personne à nos bureaux ou électroniquement, selon les consignes de chaque service.",
      ),
      leadHighlights: {
        0: s("απαραίτητα έντυπα", "required forms", "erforderlichen Formulare", "formulaires nécessaires"),
        1: s("ηλεκτρονικά", "electronically", "elektronisch", "électroniquement"),
      },
      blocks: {
        "documents-how": {
          title: s(
            "Πώς χρησιμοποιείτε τα έντυπα",
            "How to use the forms",
            "So verwenden Sie die Formulare",
            "Comment utiliser les formulaires",
          ),
          paragraph: s(
            "Κάθε έντυπο αντιστοιχεί σε συγκεκριμένη διαδικασία — σύνδεση, αλλαγή στοιχείων, δήλωση ή άλλη αίτηση. Συμπληρώστε τα στοιχεία με ακρίβεια και συνοδεύστε την αίτηση με τα απαιτούμενα δικαιολογητικά.",
            "Each form corresponds to a specific process — connection, change of details, declaration, or another application. Complete the fields accurately and attach the required supporting documents.",
            "Jedes Formular gehört zu einem bestimmten Verfahren — Anschluss, Datenänderung, Erklärung oder ein anderer Antrag. Füllen Sie die Angaben genau aus und fügen Sie die erforderlichen Unterlagen bei.",
            "Chaque formulaire correspond à une procédure précise — branchement, modification des données, déclaration ou autre demande. Remplissez les champs avec exactitude et joignez les justificatifs requis.",
          ),
          intro: s("Βήματα υποβολής:", "Submission steps:", "Schritte zur Einreichung:", "Étapes de dépôt :"),
          bullets: [
            {
              label: s("Λήψη", "Download", "Download", "Téléchargement"),
              text: s(
                "κατεβάστε το έντυπο από τη λίστα παρακάτω.",
                "download the form from the list below.",
                "laden Sie das Formular aus der Liste unten herunter.",
                "téléchargez le formulaire dans la liste ci-dessous.",
              ),
            },
            {
              label: s("Συμπλήρωση", "Completion", "Ausfüllen", "Remplissage"),
              text: s(
                "συμπληρώστε όλα τα υποχρεωτικά πεδία.",
                "complete all required fields.",
                "füllen Sie alle Pflichtfelder aus.",
                "remplissez tous les champs obligatoires.",
              ),
            },
            {
              label: s("Υποβολή", "Submission", "Einreichung", "Dépôt"),
              text: s(
                "αυτοπροσώπως στα γραφεία ή ηλεκτρονικά, όπου επιτρέπεται.",
                "in person at the offices or electronically, where permitted.",
                "persönlich in den Büros oder elektronisch, soweit zulässig.",
                "en personne aux bureaux ou électroniquement, lorsque c’est autorisé.",
              ),
            },
            {
              label: s("Παρακολούθηση", "Follow-up", "Nachverfolgung", "Suivi"),
              text: s(
                "κρατήστε αντίγραφο της αίτησης για το αρχείο σας.",
                "keep a copy of the application for your records.",
                "bewahren Sie eine Kopie des Antrags für Ihre Unterlagen auf.",
                "conservez une copie de la demande pour vos archives.",
              ),
            },
          ],
        },
        "documents-support": {
          title: s("Υποστήριξη πολιτών", "Citizen support", "Bürgerberatung", "Accompagnement des habitants"),
          paragraph: s(
            "Για διευκρινίσεις σχετικά με τα απαιτούμενα δικαιολογητικά ή τη διαδικασία υποβολής, η εξυπηρέτηση πολιτών είναι στη διάθεσή σας.",
            "For clarification on the required documents or the submission process, citizen services is at your disposal.",
            "Für Erläuterungen zu den erforderlichen Unterlagen oder zum Einreichungsverfahren steht Ihnen der Bürgerservice zur Verfügung.",
            "Pour toute précision sur les justificatifs requis ou la procédure de dépôt, le service aux habitants est à votre disposition.",
          ),
          intro: s("Επικοινωνία:", "Contact:", "Kontakt:", "Contact :"),
          bullets: [
            {
              label: s("Τηλέφωνο", "Phone", "Telefon", "Téléphone"),
              text: s(
                "28253-40213 — Δευτέρα–Παρασκευή.",
                "28253-40213 — Monday–Friday.",
                "28253-40213 — Montag–Freitag.",
                "28253-40213 — lundi–vendredi.",
              ),
            },
            {
              label: s("Email", "Email", "E-Mail", "E-mail"),
              text: s(
                "info@deyaa.gr για γραπτές διευκρινίσεις.",
                "info@deyaa.gr for written clarifications.",
                "info@deyaa.gr für schriftliche Auskünfte.",
                "info@deyaa.gr pour des précisions écrites.",
              ),
            },
            {
              label: s("Γραφεία", "Offices", "Büros", "Bureaux"),
              text: s(
                "Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008.",
                "Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008.",
                "Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008.",
                "Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008.",
              ),
            },
            {
              label: s("e-Services", "e-Services", "e-Services", "e-Services"),
              text: s(
                "για online διαδικασίες, επισκεφθείτε τις Ηλεκτρονικές Υπηρεσίες.",
                "for online procedures, visit e-Services.",
                "für Online-Verfahren besuchen Sie die E-Services.",
                "pour les démarches en ligne, rendez-vous dans les e-Services.",
              ),
            },
          ],
        },
      },
    },
  },
} as const;
