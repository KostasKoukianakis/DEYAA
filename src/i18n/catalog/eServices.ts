import type { I18nText } from "@/i18n/types";

const s = (el: string, en: string, de: string, fr: string): I18nText => ({ el, en, de, fr });

export const eServicesCatalog = {
  hub: {
    headline: s("e-Services", "e-Services", "e-Services", "e-Services"),
    bannerLead: s(
      "Η ψηφιακή εξυπηρέτηση στην υπηρεσία σας",
      "Digital service at your disposal",
      "Digitaler Service zu Ihrer Verfügung",
      "Le service numérique à votre disposition",
    ),
    bannerBody: s(
      "Διαφορετικές διαδικασίες, ένας στόχος: να φέρουμε τις βασικές υπηρεσίες της ΔΕΥΑΑ πιο κοντά σας — με ασφάλεια, διαφάνεια και σεβασμό στον χρόνο σας.",
      "Different procedures, one aim: to bring DEYAA’s core services closer to you — with security, transparency, and respect for your time.",
      "Unterschiedliche Verfahren, ein Ziel: die zentralen Dienste der DEYAA näher zu Ihnen zu bringen — sicher, transparent und mit Respekt für Ihre Zeit.",
      "Des démarches différentes, un même objectif : rapprocher de vous les services essentiels de la DEYAA — en toute sécurité, avec transparence et respect de votre temps.",
    ),
    statementTitle0: s(
      "Η απάντησή μας στις καθημερινές",
      "Our answer to everyday",
      "Unsere Antwort auf den täglichen",
      "Notre réponse aux besoins quotidiens",
    ),
    statementTitle1: s(
      "ανάγκες ύδρευσης",
      "water-supply needs",
      "Bedarf an Wasserversorgung",
      "d’alimentation en eau",
    ),
    statementBody0: s(
      "Από την online πληρωμή λογαριασμού μέχρι τη δήλωση ένδειξης και την αναφορά βλάβης: κάθε υπηρεσία σχεδιάστηκε για να εξυπηρετεί τον πολίτη.",
      "From paying a bill online to submitting a meter reading and reporting a fault: every service was designed to serve the resident.",
      "Von der Online-Zahlung der Rechnung bis zur Zählerstandsmeldung und Störungsmeldung: jeder Dienst wurde für die Bürgerinnen und Bürger gestaltet.",
      "Du paiement de facture en ligne à la déclaration de relevé et au signalement de panne : chaque service a été conçu pour servir l’habitant.",
    ),
    statementBody1: s(
      "Φροντίζουμε κάθε λεπτομέρεια — από την ασφάλεια συναλλαγών μέχρι την άμεση επιβεβαίωση, με διαδικασίες απλές και διαφανείς.",
      "We take care of every detail — from transaction security to instant confirmation, with procedures that are simple and transparent.",
      "Wir achten auf jedes Detail — von der Sicherheit der Transaktionen bis zur sofortigen Bestätigung, mit einfachen und transparenten Verfahren.",
      "Nous soignons chaque détail — de la sécurité des transactions à la confirmation immédiate, avec des procédures simples et transparentes.",
    ),
    catalogCta: s("Επικοινωνία", "Contact", "Kontakt", "Contact"),
  },
  sections: {
    payment: {
      navLabel: s("Πληρωμή λογαριασμών", "Pay bills", "Rechnungen bezahlen", "Payer les factures"),
      title: s("Πληρωμή λογαριασμών", "Pay bills", "Rechnungen bezahlen", "Payer les factures"),
      lead: s(
        "Εξοφλήστε τον λογαριασμό νερού online με ασφάλεια, χωρίς αναμονή. Η διαδικασία είναι απλή, διαφανής και ολοκληρώνεται σε λίγα λεπτά — με άμεση ενημέρωση και ψηφιακή απόδειξη.",
        "Pay your water bill online securely, without waiting. The process is simple, transparent, and finished in a few minutes — with immediate confirmation and a digital receipt.",
        "Begleichen Sie Ihre Wasserrechnung online sicher und ohne Wartezeit. Das Verfahren ist einfach, transparent und in wenigen Minuten abgeschlossen — mit sofortiger Bestätigung und digitalem Beleg.",
        "Réglez votre facture d’eau en ligne en toute sécurité, sans attendre. La procédure est simple, transparente et se termine en quelques minutes — avec confirmation immédiate et reçu numérique.",
      ),
      tags: {
        0: s("Online πληρωμή", "Online payment", "Online-Zahlung", "Paiement en ligne"),
        1: s("Ασφάλεια", "Security", "Sicherheit", "Sécurité"),
        2: s("Ψηφιακή απόδειξη", "Digital receipt", "Digitaler Beleg", "Reçu numérique"),
      },
      accordions: {
        "payment-online": {
          title: s("Online εξόφληση", "Online settlement", "Online-Begleichung", "Règlement en ligne"),
          body: s(
            "Η ηλεκτρονική πληρωμή σας επιτρέπει να εξοφλήσετε τον λογαριασμό από οποιαδήποτε συσκευή, χωρίς επίσκεψη στα γραφεία μας.",
            "Electronic payment lets you settle the bill from any device, without visiting our offices.",
            "Die elektronische Zahlung ermöglicht es Ihnen, die Rechnung von jedem Gerät aus zu begleichen, ohne unsere Büros aufzusuchen.",
            "Le paiement électronique vous permet de régler la facture depuis n’importe quel appareil, sans vous rendre à nos bureaux.",
          ),
          bullets: [
            {
              label: s("Αριθμός παροχής:", "Supply number:", "Anschlussnummer:", "Numéro de branchement :"),
              text: s(
                "εισάγετε τον αριθμό παροχής σας για άμεση ανάκτηση του τρέχοντος λογαριασμού.",
                "enter your supply number to retrieve the current bill immediately.",
                "geben Sie Ihre Anschlussnummer ein, um die aktuelle Rechnung sofort abzurufen.",
                "saisissez votre numéro de branchement pour récupérer immédiatement la facture en cours.",
              ),
            },
            {
              label: s("Ασφαλής πύλη:", "Secure gateway:", "Sicheres Portal:", "Portail sécurisé :"),
              text: s(
                "οι συναλλαγές πραγματοποιούνται μέσω κρυπτογραφημένης σύνδεσης με τραπεζικούς συνεργάτες.",
                "transactions are processed over an encrypted connection with banking partners.",
                "Transaktionen erfolgen über eine verschlüsselte Verbindung mit Bankpartnern.",
                "les transactions s’effectuent via une connexion chiffrée avec des partenaires bancaires.",
              ),
            },
            {
              label: s("Ψηφιακή απόδειξη:", "Digital receipt:", "Digitaler Beleg:", "Reçu numérique :"),
              text: s(
                "λάβετε άμεση επιβεβαίωση και αποθηκεύστε την απόδειξη πληρωμής.",
                "receive immediate confirmation and save the payment receipt.",
                "erhalten Sie eine sofortige Bestätigung und speichern Sie den Zahlungsbeleg.",
                "recevez une confirmation immédiate et enregistrez le reçu de paiement.",
              ),
            },
          ],
        },
        "payment-methods": {
          title: s("Τρόποι πληρωμής", "Payment methods", "Zahlungsarten", "Moyens de paiement"),
          body: s(
            "Υποστηρίζουμε τις πιο διαδεδομένες ηλεκτρονικές μεθόδους πληρωμής για να επιλέξετε αυτή που σας εξυπηρετεί.",
            "We support the most widely used electronic payment methods so you can choose the one that suits you.",
            "Wir unterstützen die gängigsten elektronischen Zahlungsmethoden, damit Sie die passende wählen können.",
            "Nous prenons en charge les moyens de paiement électroniques les plus répandus, pour que vous choisissiez celui qui vous convient.",
          ),
          bullets: [
            {
              label: s("Κάρτα:", "Card:", "Karte:", "Carte :"),
              text: s(
                "χρεωστική ή πιστωτική κάρτα μέσω ασφαλούς τραπεζικής πύλης.",
                "debit or credit card through a secure banking gateway.",
                "Debit- oder Kreditkarte über ein sicheres Bankportal.",
                "carte de débit ou de crédit via un portail bancaire sécurisé.",
              ),
            },
            {
              label: s("e-banking:", "e-banking:", "e-banking:", "e-banking :"),
              text: s(
                "πληρωμή μέσω διαδικτυακής τραπεζικής, όπου υποστηρίζεται.",
                "payment via online banking, where supported.",
                "Zahlung über Online-Banking, soweit unterstützt.",
                "paiement par banque en ligne, lorsque c’est pris en charge.",
              ),
            },
          ],
        },
        "payment-support": {
          title: s(
            "Υποστήριξη & διευκρινίσεις",
            "Support & clarifications",
            "Unterstützung & Auskünfte",
            "Assistance et précisions",
          ),
          body: s(
            "Για ερωτήσεις σχετικά με ποσά, δόσεις ή καθυστερημένους λογαριασμούς, η εξυπηρέτηση πολιτών είναι στη διάθεσή σας.",
            "For questions about amounts, instalments, or overdue bills, citizen services is at your disposal.",
            "Bei Fragen zu Beträgen, Ratenzahlungen oder überfälligen Rechnungen steht Ihnen der Bürgerservice zur Verfügung.",
            "Pour toute question sur les montants, les échéances ou les factures en retard, le service aux habitants est à votre disposition.",
          ),
          bullets: [
            {
              label: s("Τηλέφωνο:", "Phone:", "Telefon:", "Téléphone :"),
              text: s(
                "28253-40213 για άμεση βοήθεια στις ηλεκτρονικές υπηρεσίες.",
                "28253-40213 for immediate help with e-Services.",
                "28253-40213 für sofortige Hilfe bei den E-Services.",
                "28253-40213 pour une aide immédiate sur les e-Services.",
              ),
            },
          ],
        },
      },
    },
    "meter-reading": {
      navLabel: s("Δήλωση ένδειξης", "Meter reading", "Zählerstand", "Relevé de compteur"),
      title: s("Δήλωση ένδειξης", "Meter reading", "Zählerstand", "Relevé de compteur"),
      lead: s(
        "Καταχωρήστε την ένδειξη του υδρομέτρου σας ηλεκτρονικά — γρήγορα, ακριβώς και χωρίς μετακίνηση. Η ψηφιακή δήλωση μειώνει λάθη και επιταχύνει την έκδοση του επόμενου λογαριασμού.",
        "Submit your water-meter reading electronically — quickly, accurately, and without travelling. The digital declaration reduces errors and speeds up the next bill.",
        "Melden Sie Ihren Wasserzählerstand elektronisch — schnell, genau und ohne Anfahrt. Die digitale Meldung verringert Fehler und beschleunigt die nächste Rechnung.",
        "Déclarez le relevé de votre compteur d’eau par voie électronique — rapidement, précisément et sans vous déplacer. La déclaration numérique réduit les erreurs et accélère l’émission de la prochaine facture.",
      ),
      tags: {
        0: s("Ένδειξη μετρητή", "Meter reading", "Zählerstand", "Relevé de compteur"),
        1: s("Χωρίς μετακίνηση", "No travel required", "Ohne Anfahrt", "Sans déplacement"),
        2: s("Γρήγορη καταχώρηση", "Fast submission", "Schnelle Erfassung", "Saisie rapide"),
      },
      accordions: {
        "meter-how": {
          title: s(
            "Πώς δηλώνετε την ένδειξη",
            "How to submit the reading",
            "So melden Sie den Stand",
            "Comment déclarer le relevé",
          ),
          body: s(
            "Η διαδικασία είναι απλή και ολοκληρώνεται σε λίγα βήματα από τον υπολογιστή ή το κινητό σας.",
            "The process is simple and completed in a few steps from your computer or phone.",
            "Das Verfahren ist einfach und in wenigen Schritten am Computer oder Mobiltelefon abgeschlossen.",
            "La procédure est simple et se termine en quelques étapes depuis votre ordinateur ou votre téléphone.",
          ),
          bullets: [
            {
              label: s("Αριθμός παροχής:", "Supply number:", "Anschlussnummer:", "Numéro de branchement :"),
              text: s(
                "εισάγετε τον αριθμό παροχής και την τρέχουσα ένδειξη του μετρητή.",
                "enter the supply number and the current meter reading.",
                "geben Sie die Anschlussnummer und den aktuellen Zählerstand ein.",
                "saisissez le numéro de branchement et le relevé actuel du compteur.",
              ),
            },
            {
              label: s("Επιβεβαίωση:", "Confirmation:", "Bestätigung:", "Confirmation :"),
              text: s(
                "ελέγξτε τα στοιχεία και υποβάλετε τη δήλωση — λαμβάνετε αριθμό αναφοράς.",
                "check the details and submit the declaration — you receive a reference number.",
                "prüfen Sie die Angaben und senden Sie die Meldung — Sie erhalten eine Referenznummer.",
                "vérifiez les données et envoyez la déclaration — vous recevez un numéro de référence.",
              ),
            },
          ],
        },
        "meter-when": {
          title: s("Πότε να δηλώσετε", "When to submit", "Wann Sie melden sollten", "Quand déclarer"),
          body: s(
            "Η έγκαιρη καταχώρηση βοηθά στην ορθή χρέωση και αποφεύγει εκτιμήσεις κατανάλωσης.",
            "Submitting on time helps ensure correct billing and avoids estimated consumption.",
            "Die rechtzeitige Erfassung hilft bei der korrekten Abrechnung und vermeidet Verbrauchsschätzungen.",
            "Une saisie dans les délais favorise une facturation exacte et évite les estimations de consommation.",
          ),
          bullets: [
            {
              label: s("Περίοδος:", "Period:", "Zeitraum:", "Période :"),
              text: s(
                "δηλώστε την ένδειξη εντός της προβλεπόμενης περιόδου που αναγράφεται στον λογαριασμό.",
                "submit the reading within the period shown on the bill.",
                "melden Sie den Stand innerhalb des auf der Rechnung angegebenen Zeitraums.",
                "déclarez le relevé dans la période indiquée sur la facture.",
              ),
            },
            {
              label: s("Ακρίβεια:", "Accuracy:", "Genauigkeit:", "Exactitude :"),
              text: s(
                "καταχωρήστε την ακριβή ένδειξη χωρίς εκτίμηση για αποφυγή διορθώσεων.",
                "enter the exact reading without estimating, to avoid later corrections.",
                "erfassen Sie den genauen Stand ohne Schätzung, um Korrekturen zu vermeiden.",
                "saisissez le relevé exact, sans estimation, pour éviter des corrections.",
              ),
            },
          ],
        },
        "meter-issues": {
          title: s("Προβλήματα μετρητή", "Meter problems", "Zählerprobleme", "Problèmes de compteur"),
          body: s(
            "Αν ο μετρητής δεν λειτουργεί σωστά ή δεν μπορείτε να διαβάσετε την ένδειξη, ενημερώστε μας.",
            "If the meter is not working correctly or you cannot read the display, let us know.",
            "Wenn der Zähler nicht richtig funktioniert oder Sie den Stand nicht ablesen können, informieren Sie uns.",
            "Si le compteur ne fonctionne pas correctement ou si vous ne pouvez pas lire le relevé, prévenez-nous.",
          ),
          bullets: [
            {
              label: s("Αναφορά βλάβης:", "Fault report:", "Störungsmeldung:", "Signalement de panne :"),
              text: s(
                "χρησιμοποιήστε τη φόρμα αναφοράς προβλήματος για άμεση ενημέρωση των συνεργείων.",
                "use the problem-report form so crews are notified immediately.",
                "nutzen Sie das Störungsmeldeformular, damit die Teams sofort informiert werden.",
                "utilisez le formulaire de signalement pour informer immédiatement les équipes.",
              ),
            },
          ],
        },
      },
    },
    "problem-report": {
      navLabel: s("Αναφορά προβλήματος", "Report a problem", "Störung melden", "Signaler un problème"),
      title: s("Αναφορά προβλήματος", "Report a problem", "Störung melden", "Signaler un problème"),
      lead: s(
        "Διαρροή, βλάβη ή διακοπή; Ενημερώστε μας άμεσα ώστε τα συνεργεία μας να κινητοποιηθούν στοχευμένα. Η online αναφορά επιταχύνει την ανταπόκριση και μας βοηθά να εντοπίσουμε το σημείο με ακρίβεια.",
        "A leak, a fault, or an outage? Tell us immediately so our crews can respond where it matters. An online report speeds up the response and helps us pinpoint the location.",
        "Leckage, Störung oder Unterbrechung? Informieren Sie uns umgehend, damit unsere Teams gezielt ausrücken. Die Online-Meldung beschleunigt die Reaktion und hilft uns, den Ort genau zu bestimmen.",
        "Fuite, panne ou coupure ? Prévenez-nous immédiatement pour que nos équipes interviennent de façon ciblée. Le signalement en ligne accélère la réponse et nous aide à localiser le point avec précision.",
      ),
      tags: {
        0: s("24/7", "24/7", "24/7", "24/7"),
        1: s("Διαρροές", "Leaks", "Leckagen", "Fuites"),
        2: s("Βλάβες", "Faults", "Störungen", "Pannes"),
      },
      accordions: {
        "report-types": {
          title: s("Τύποι προβλημάτων", "Types of problems", "Arten von Störungen", "Types de problèmes"),
          body: s(
            "Μπορείτε να αναφέρετε οποιοδήποτε θέμα σχετίζεται με το δίκτυο ύδρευσης ή αποχέτευσης στην περιοχή μας.",
            "You can report any issue related to the water or sewerage network in our area.",
            "Sie können jedes Anliegen zum Wasser- oder Abwassernetz in unserem Gebiet melden.",
            "Vous pouvez signaler tout sujet lié au réseau d’eau ou d’assainissement dans notre zone.",
          ),
          bullets: [
            {
              label: s("Διαρροές:", "Leaks:", "Leckagen:", "Fuites :"),
              text: s(
                "διαρροή σε αγωγό, υδρομέτρο ή δημόσιο δίκτυο.",
                "a leak on a pipe, water meter, or the public network.",
                "Leckage an einer Leitung, einem Wasserzähler oder im öffentlichen Netz.",
                "fuite sur une canalisation, un compteur d’eau ou le réseau public.",
              ),
            },
            {
              label: s("Διακοπές:", "Outages:", "Unterbrechungen:", "Coupures :"),
              text: s(
                "έλλειψη νερού ή πτώση πίεσης σε συγκεκριμένη περιοχή.",
                "no water or a drop in pressure in a specific area.",
                "Wassermangel oder Druckabfall in einem bestimmten Gebiet.",
                "manque d’eau ou baisse de pression dans un secteur donné.",
              ),
            },
            {
              label: s("Βλάβες:", "Faults:", "Störungen:", "Pannes :"),
              text: s(
                "φθορά εξοπλισμού ή φρεάτιο που χρειάζεται επέμβαση.",
                "damaged equipment or a manhole that needs attention.",
                "beschädigte Anlagen oder ein Schacht, der Eingreifen erfordert.",
                "équipement endommagé ou regard nécessitant une intervention.",
              ),
            },
          ],
        },
        "report-process": {
          title: s("Διαδικασία αναφοράς", "Reporting process", "Meldeverfahren", "Procédure de signalement"),
          body: s(
            "Συμπληρώστε τη φόρμα με όσο περισσότερες πληροφορίες γίνεται — τοποθεσία, περιγραφή, στοιχεία επικοινωνίας.",
            "Fill in the form with as much information as possible — location, description, contact details.",
            "Füllen Sie das Formular mit möglichst vielen Angaben aus — Ort, Beschreibung, Kontaktdaten.",
            "Remplissez le formulaire avec le plus d’informations possible — lieu, description, coordonnées.",
          ),
          bullets: [
            {
              label: s("Αριθμός αναφοράς:", "Reference number:", "Referenznummer:", "Numéro de dossier :"),
              text: s(
                "λάβετε επιβεβαίωση με αριθμό παρακολούθησης της αίτησής σας.",
                "you receive confirmation with a tracking number for your request.",
                "Sie erhalten eine Bestätigung mit einer Vorgangsnummer für Ihren Antrag.",
                "vous recevez une confirmation avec un numéro de suivi de votre demande.",
              ),
            },
            {
              label: s("24/7:", "24/7:", "24/7:", "24/7 :"),
              text: s(
                "η φόρμα είναι διαθέσιμη όλο το εικοσιτετράωρο.",
                "the form is available around the clock.",
                "das Formular ist rund um die Uhr verfügbar.",
                "le formulaire est disponible 24 heures sur 24.",
              ),
            },
          ],
        },
        "report-urgent": {
          title: s("Επείγοντα περιστατικά", "Emergencies", "Notfälle", "Urgences"),
          body: s(
            "Για σοβαρές διαρροές ή επείγοντα περιστατικά, καλέστε άμεσα την εξυπηρέτηση πολιτών.",
            "For serious leaks or emergencies, call citizen services immediately.",
            "Bei schweren Leckagen oder Notfällen rufen Sie umgehend den Bürgerservice an.",
            "Pour les fuites graves ou les urgences, appelez immédiatement le service aux habitants.",
          ),
          bullets: [
            {
              label: s("Τηλέφωνο:", "Phone:", "Telefon:", "Téléphone :"),
              text: s(
                "28253-40213 για άμεση κινητοποίηση συνεργείων.",
                "28253-40213 for immediate dispatch of crews.",
                "28253-40213 für den sofortigen Einsatz der Teams.",
                "28253-40213 pour une mobilisation immédiate des équipes.",
              ),
            },
          ],
        },
      },
    },
    "bill-calculator": {
      navLabel: s(
        "Υπολογισμός λογαριασμού",
        "Bill calculator",
        "Rechnungrechner",
        "Calculateur de facture",
      ),
      title: s(
        "Υπολογισμός λογαριασμού",
        "Bill calculator",
        "Rechnungrechner",
        "Calculateur de facture",
      ),
      lead: s(
        "Εκτιμήστε το κόστος κατανάλωσης πριν λάβετε τον τελικό λογαριασμό — με διαφάνεια και σαφήνεια. Ο υπολογιστής βοηθά να προγραμματίσετε τον προϋπολογισμό σας και να κατανοήσετε τη χρέωση.",
        "Estimate the cost of consumption before you receive the final bill — with transparency and clarity. The calculator helps you plan your budget and understand the charge.",
        "Schätzen Sie die Verbrauchskosten, bevor Sie die endgültige Rechnung erhalten — transparent und klar. Der Rechner hilft Ihnen, Ihr Budget zu planen und die Abrechnung zu verstehen.",
        "Estimez le coût de la consommation avant de recevoir la facture finale — avec transparence et clarté. Le calculateur vous aide à prévoir votre budget et à comprendre la facturation.",
      ),
      tags: {
        0: s("Εκτίμηση", "Estimate", "Schätzung", "Estimation"),
        1: s("Διαφάνεια", "Transparency", "Transparenz", "Transparence"),
        2: s("Προϋπολογισμός", "Budget", "Budget", "Budget"),
      },
      accordions: {
        "calc-how": {
          title: s("Πώς λειτουργεί", "How it works", "So funktioniert es", "Comment ça fonctionne"),
          body: s(
            "Εισάγετε την κατανάλωση ή τη διαφορά ενδείξεων και λάβετε εκτίμηση βάσει της ισχύουσας τιμολογιακής πολιτικής.",
            "Enter consumption or the difference between readings and receive an estimate based on the current tariff policy.",
            "Geben Sie den Verbrauch oder die Zählerdifferenz ein und erhalten Sie eine Schätzung gemäß der geltenden Tarifpolitik.",
            "Saisissez la consommation ou l’écart de relevés et obtenez une estimation selon la politique tarifaire en vigueur.",
          ),
          bullets: [
            {
              label: s("Κατανάλωση:", "Consumption:", "Verbrauch:", "Consommation :"),
              text: s(
                "υπολογίστε με βάση κυβικά μέτρα νερού ή διαφορά ενδείξεων.",
                "calculate from cubic metres of water or the difference between readings.",
                "berechnen Sie anhand von Kubikmetern Wasser oder der Zählerdifferenz.",
                "calculez à partir des mètres cubes d’eau ou de l’écart de relevés.",
              ),
            },
            {
              label: s("Εκτίμηση:", "Estimate:", "Schätzung:", "Estimation :"),
              text: s(
                "το αποτέλεσμα είναι ενδεικτικό — ο τελικός λογαριασμός μπορεί να διαφέρει.",
                "the result is indicative — the final bill may differ.",
                "das Ergebnis ist unverbindlich — die endgültige Rechnung kann abweichen.",
                "le résultat est indicatif — la facture finale peut différer.",
              ),
            },
          ],
        },
        "calc-transparency": {
          title: s("Διαφάνεια χρέωσης", "Billing transparency", "Transparente Abrechnung", "Transparence de la facturation"),
          body: s(
            "Πιστεύουμε στη σαφή ενημέρωση των πολιτών για το πώς υπολογίζεται η χρέωση.",
            "We believe residents should be clearly informed about how the charge is calculated.",
            "Wir setzen auf klare Information der Bürgerinnen und Bürger darüber, wie die Abrechnung berechnet wird.",
            "Nous croyons à une information claire des habitants sur le calcul de la facturation.",
          ),
          bullets: [
            {
              label: s("Τιμολόγηση:", "Tariffs:", "Tarifierung:", "Tarification :"),
              text: s(
                "βάσει ισχύουσων τιμών και κατηγοριών κατανάλωσης.",
                "based on current rates and consumption categories.",
                "auf Grundlage der geltenden Preise und Verbrauchskategorien.",
                "selon les tarifs et catégories de consommation en vigueur.",
              ),
            },
            {
              label: s("Σταθερές χρεώσεις:", "Fixed charges:", "Grundgebühren:", "Charges fixes :"),
              text: s(
                "συμπεριλαμβάνονται όπου εφαρμόζονται σύμφωνα με την πολιτική της ΔΕΥΑΑ.",
                "included where they apply according to DEYAA policy.",
                "werden einbezogen, soweit sie gemäß der DEYAA-Politik gelten.",
                "incluses lorsqu’elles s’appliquent selon la politique de la DEYAA.",
              ),
            },
          ],
        },
        "calc-next": {
          title: s("Επόμενα βήματα", "Next steps", "Nächste Schritte", "Étapes suivantes"),
          body: s(
            "Μετά την εκτίμηση, μπορείτε να προχωρήσετε σε πληρωμή ή δήλωση ένδειξης.",
            "After the estimate, you can proceed to payment or submit a meter reading.",
            "Nach der Schätzung können Sie zur Zahlung oder zur Zählerstandsmeldung übergehen.",
            "Après l’estimation, vous pouvez passer au paiement ou à la déclaration de relevé.",
          ),
          bullets: [
            {
              label: s("Πληρωμή:", "Payment:", "Zahlung:", "Paiement :"),
              text: s(
                "μεταβείτε στην online πληρωμή για άμεση εξόφληση.",
                "go to online payment for immediate settlement.",
                "wechseln Sie zur Online-Zahlung für die sofortige Begleichung.",
                "passez au paiement en ligne pour un règlement immédiat.",
              ),
            },
            {
              label: s("Ένδειξη:", "Reading:", "Zählerstand:", "Relevé :"),
              text: s(
                "δηλώστε την τρέχουσα ένδειξη για ακριβή χρέωση.",
                "submit the current reading for accurate billing.",
                "melden Sie den aktuellen Stand für eine genaue Abrechnung.",
                "déclarez le relevé actuel pour une facturation exacte.",
              ),
            },
          ],
        },
      },
    },
  },
  handoff: {
    alert: s(
      "Για την ολοκλήρωση της διαδικασίας θα μεταφερθείτε στην επίσημη πλατφόρμα services.deyaa.gr. Στις περισσότερες υπηρεσίες απαιτείται σύνδεση με Taxisnet για την ταυτοποίησή σας ως καταναλωτή.",
      "To complete the process you will be taken to the official platform services.deyaa.gr. Most services require a Taxisnet sign-in to identify you as a consumer.",
      "Zum Abschluss des Verfahrens werden Sie zur offiziellen Plattform services.deyaa.gr weitergeleitet. Für die meisten Dienste ist eine Anmeldung mit Taxisnet erforderlich, um Sie als Verbraucherin oder Verbraucher zu identifizieren.",
      "Pour terminer la démarche, vous serez redirigé vers la plateforme officielle services.deyaa.gr. La plupart des services exigent une connexion Taxisnet pour vous identifier en tant que consommateur.",
    ),
    needTitle: s("Τι θα χρειαστείτε", "What you will need", "Was Sie benötigen", "Ce dont vous aurez besoin"),
    stepsTitle: s(
      "Βήματα στην πλατφόρμα",
      "Steps on the platform",
      "Schritte auf der Plattform",
      "Étapes sur la plateforme",
    ),
    choose: s(
      "Στην πλατφόρμα, επιλέξτε: {label}",
      "On the platform, choose: {label}",
      "Auf der Plattform wählen Sie: {label}",
      "Sur la plateforme, choisissez : {label}",
    ),
    payment: {
      portalMenuLabel: s("Γρήγορη πληρωμή", "Quick payment", "Schnelle Zahlung", "Paiement rapide"),
      ctaLabel: s(
        "Συνέχεια στην πλατφόρμα πληρωμών",
        "Continue to the payments platform",
        "Weiter zur Zahlungsplattform",
        "Continuer vers la plateforme de paiement",
      ),
      step0: s(
        "Θα μεταφερθείτε στην επίσημη πλατφόρμα ηλεκτρονικών υπηρεσιών της ΔΕΥΑΑ.",
        "You will be taken to DEYAA’s official e-Services platform.",
        "Sie werden zur offiziellen E-Services-Plattform der DEYAA weitergeleitet.",
        "Vous serez redirigé vers la plateforme officielle des e-Services de la DEYAA.",
      ),
      step1: s(
        "Συνδεθείτε με Taxisnet (ή επιλέξτε σύνδεση επισκέπτη, αν διατίθεται).",
        "Sign in with Taxisnet (or choose guest access, if available).",
        "Melden Sie sich mit Taxisnet an (oder wählen Sie den Gastzugang, falls verfügbar).",
        "Connectez-vous avec Taxisnet (ou choisissez l’accès invité, s’il est proposé).",
      ),
      step2: s(
        "Επιλέξτε «Γρήγορη πληρωμή» ή «Οι οφειλές μου».",
        "Choose “Quick payment” or “My debts”.",
        "Wählen Sie «Schnelle Zahlung» oder «Meine Forderungen».",
        "Choisissez « Paiement rapide » ou « Mes dettes ».",
      ),
      step3: s(
        "Ολοκληρώστε την πληρωμή και αποθηκεύστε την απόδειξη.",
        "Complete the payment and save the receipt.",
        "Schließen Sie die Zahlung ab und speichern Sie den Beleg.",
        "Terminez le paiement et enregistrez le reçu.",
      ),
      req0: s(
        "Αριθμός παροχής (αναγράφεται στον λογαριασμό)",
        "Supply number (shown on the bill)",
        "Anschlussnummer (auf der Rechnung angegeben)",
        "Numéro de branchement (indiqué sur la facture)",
      ),
      req1: s(
        "Πιστωτική ή χρεωστική κάρτα (για online πληρωμή)",
        "Credit or debit card (for online payment)",
        "Kredit- oder Debitkarte (für die Online-Zahlung)",
        "Carte de crédit ou de débit (pour le paiement en ligne)",
      ),
      req2: s(
        "Λογαριασμός Taxisnet (για πλήρη πρόσβαση στις οφειλές σας)",
        "Taxisnet account (for full access to your debts)",
        "Taxisnet-Konto (für den vollen Zugriff auf Ihre Forderungen)",
        "Compte Taxisnet (pour un accès complet à vos dettes)",
      ),
    },
    meter: {
      portalMenuLabel: s("Καταχώριση μέτρησης", "Submit a reading", "Messung erfassen", "Saisir un relevé"),
      ctaLabel: s(
        "Συνέχεια στην καταχώριση μέτρησης",
        "Continue to meter-reading submission",
        "Weiter zur Messungserfassung",
        "Continuer vers la saisie du relevé",
      ),
      step0: s(
        "Θα μεταφερθείτε στην επίσημη πλατφόρμα ηλεκτρονικών υπηρεσιών της ΔΕΥΑΑ.",
        "You will be taken to DEYAA’s official e-Services platform.",
        "Sie werden zur offiziellen E-Services-Plattform der DEYAA weitergeleitet.",
        "Vous serez redirigé vers la plateforme officielle des e-Services de la DEYAA.",
      ),
      step1: s(
        "Συνδεθείτε με Taxisnet.",
        "Sign in with Taxisnet.",
        "Melden Sie sich mit Taxisnet an.",
        "Connectez-vous avec Taxisnet.",
      ),
      step2: s(
        "Επιλέξτε «Καταχώριση μέτρησης».",
        "Choose “Submit a reading”.",
        "Wählen Sie «Messung erfassen».",
        "Choisissez « Saisir un relevé ».",
      ),
      step3: s(
        "Εισάγετε την ένδειξη του υδρομέτρου και υποβάλετε τη δήλωση.",
        "Enter the water-meter reading and submit the declaration.",
        "Geben Sie den Wasserzählerstand ein und senden Sie die Meldung.",
        "Saisissez le relevé du compteur d’eau et envoyez la déclaration.",
      ),
      req0: s("Αριθμός παροχής", "Supply number", "Anschlussnummer", "Numéro de branchement"),
      req1: s(
        "Τρέχουσα ένδειξη υδρομέτρου (μόνο τα μαύρα ψηφία)",
        "Current water-meter reading (black digits only)",
        "Aktueller Wasserzählerstand (nur die schwarzen Ziffern)",
        "Relevé actuel du compteur d’eau (chiffres noirs uniquement)",
      ),
      req2: s("Λογαριασμός Taxisnet", "Taxisnet account", "Taxisnet-Konto", "Compte Taxisnet"),
    },
  },
  paymentPage: {
    breadcrumb: s("Πληρωμή", "Payment", "Zahlung", "Paiement"),
    title: s("Πληρωμή Λογαριασμών", "Pay bills", "Rechnungen bezahlen", "Payer les factures"),
    needTitle: s("Τι θα χρειαστείτε", "What you will need", "Was Sie benötigen", "Ce dont vous aurez besoin"),
    altTitle: s("Εναλλακτικοί τρόποι", "Other ways to pay", "Alternative Wege", "Autres moyens"),
    infoTitle: s("Χρήσιμες πληροφορίες", "Useful information", "Nützliche Hinweise", "Informations utiles"),
    req0: s("Αριθμός παροχής", "Supply number", "Anschlussnummer", "Numéro de branchement"),
    req1: s("Κάρτα για online πληρωμή", "Card for online payment", "Karte für die Online-Zahlung", "Carte pour le paiement en ligne"),
    req2: s("Λογαριασμός Taxisnet", "Taxisnet account", "Taxisnet-Konto", "Compte Taxisnet"),
    altCashierTitle: s("Ταμείο", "Cash desk", "Kasse", "Caisse"),
    altCashierText: s("Βάμος, Δευ–Παρ", "Vamos, Mon–Fri", "Vamos, Mo–Fr", "Vamos, lun–ven"),
    altBankTitle: s("Τράπεζες", "Banks", "Banken", "Banques"),
    altBankText: s("Κωδικός πληρωμής", "Payment code", "Zahlungscode", "Code de paiement"),
    altPhoneTitle: s("Τηλέφωνο", "Phone", "Telefon", "Téléphone"),
    altPhoneText: s("28253-40213", "28253-40213", "28253-40213", "28253-40213"),
    info0: s(
      "Ψηφιακή απόδειξη μετά την πληρωμή",
      "Digital receipt after payment",
      "Digitaler Beleg nach der Zahlung",
      "Reçu numérique après le paiement",
    ),
    info1: s(
      "e-banking, όπου υποστηρίζεται",
      "e-banking, where supported",
      "e-banking, soweit unterstützt",
      "e-banking, lorsque c’est pris en charge",
    ),
    contactInstallments: s(
      "Επικοινωνία για δόσεις",
      "Contact us about instalments",
      "Kontakt für Ratenzahlungen",
      "Contact pour les échéances",
    ),
    readyPill: s("Έτοιμοι για πληρωμή", "Ready to pay", "Bereit zur Zahlung", "Prêts à payer"),
    chooseNote: s("Επιλέξτε {label}", "Choose {label}", "Wählen Sie {label}", "Choisissez {label}"),
    platformLabel: s("Επίσημη πλατφόρμα", "Official platform", "Offizielle Plattform", "Plateforme officielle"),
    platformMeta: s(
      "24/7 · Κρυπτογραφημένη σύνδεση",
      "24/7 · Encrypted connection",
      "24/7 · Verschlüsselte Verbindung",
      "24/7 · Connexion chiffrée",
    ),
    cta: s(
      "Συνέχεια στην πλατφόρμα πληρωμών",
      "Continue to the payments platform",
      "Weiter zur Zahlungsplattform",
      "Continuer vers la plateforme de paiement",
    ),
  },
  meterPage: {
    breadcrumb: s("Δήλωση Ένδειξης", "Meter reading", "Zählerstand", "Relevé de compteur"),
    title: s("Δήλωση Ένδειξης", "Meter reading", "Zählerstand", "Relevé de compteur"),
    needTitle: s("Τι θα χρειαστείτε", "What you will need", "Was Sie benötigen", "Ce dont vous aurez besoin"),
    howTitle: s("Πώς δηλώνετε", "How to submit", "So melden Sie", "Comment déclarer"),
    infoTitle: s("Χρήσιμες πληροφορίες", "Useful information", "Nützliche Hinweise", "Informations utiles"),
    req0: s("Αριθμός παροχής", "Supply number", "Anschlussnummer", "Numéro de branchement"),
    req1: s(
      "Τρέχουσα ένδειξη υδρομέτρου",
      "Current water-meter reading",
      "Aktueller Wasserzählerstand",
      "Relevé actuel du compteur d’eau",
    ),
    req2: s("Λογαριασμός Taxisnet", "Taxisnet account", "Taxisnet-Konto", "Compte Taxisnet"),
    howSupplyTitle: s("Παροχή", "Supply", "Anschluss", "Branchement"),
    howSupplyText: s("Από τον λογαριασμό", "From the bill", "Von der Rechnung", "Sur la facture"),
    howReadingTitle: s("Ένδειξη", "Reading", "Zählerstand", "Relevé"),
    howReadingText: s("Μόνο μαύρα ψηφία", "Black digits only", "Nur schwarze Ziffern", "Chiffres noirs uniquement"),
    howPhoneTitle: s("Τηλέφωνο", "Phone", "Telefon", "Téléphone"),
    howPhoneText: s("28253-40213", "28253-40213", "28253-40213", "28253-40213"),
    info0: s(
      "Έγκαιρη καταχώρηση για ορθή χρέωση",
      "Submit on time for correct billing",
      "Rechtzeitige Erfassung für korrekte Abrechnung",
      "Saisie dans les délais pour une facturation exacte",
    ),
    info1: s(
      "Αποφεύγετε εκτιμήσεις κατανάλωσης",
      "Avoid estimated consumption",
      "Vermeiden Sie Verbrauchsschätzungen",
      "Évitez les estimations de consommation",
    ),
    faultLink: s(
      "Αναφορά βλάβης μετρητή",
      "Report a meter fault",
      "Zählerstörung melden",
      "Signaler une panne de compteur",
    ),
    readyPill: s("Έτοιμοι για δήλωση", "Ready to submit", "Bereit zur Meldung", "Prêts à déclarer"),
    chooseNote: s("Επιλέξτε {label}", "Choose {label}", "Wählen Sie {label}", "Choisissez {label}"),
    platformLabel: s("Επίσημη πλατφόρμα", "Official platform", "Offizielle Plattform", "Plateforme officielle"),
    platformMeta: s(
      "24/7 · Κρυπτογραφημένη σύνδεση",
      "24/7 · Encrypted connection",
      "24/7 · Verschlüsselte Verbindung",
      "24/7 · Connexion chiffrée",
    ),
    cta: s(
      "Συνέχεια στην καταχώριση μέτρησης",
      "Continue to meter-reading submission",
      "Weiter zur Messungserfassung",
      "Continuer vers la saisie du relevé",
    ),
  },
  bill: {
    breadcrumb: s("Υπολογισμός", "Calculator", "Rechner", "Calculateur"),
    title: s(
      "Υπολογισμός Λογαριασμού",
      "Bill calculator",
      "Rechnungrechner",
      "Calculateur de facture",
    ),
    inputsTitle: s("Τι εισάγετε", "What you enter", "Was Sie eingeben", "Ce que vous saisissez"),
    pricingTitle: s("Τιμολογιακή πολιτική", "Tariff policy", "Tarifpolitik", "Politique tarifaire"),
    infoTitle: s("Χρήσιμες πληροφορίες", "Useful information", "Nützliche Hinweise", "Informations utiles"),
    side0: s("Κατανάλωση σε m³", "Consumption in m³", "Verbrauch in m³", "Consommation en m³"),
    side1: s("Κατηγορία χρήσης", "Usage category", "Nutzungskategorie", "Catégorie d’usage"),
    side2: s("Τριμηνιαία περίοδος", "Quarterly period", "Quartalszeitraum", "Période trimestrielle"),
    categories: {
      residential: s("Οικιακή Χρήση", "Residential use", "Haushaltsnutzung", "Usage domestique"),
      commercial: s("Επαγγελματική Χρήση", "Commercial use", "Gewerbliche Nutzung", "Usage professionnel"),
      industrial: s("Βιομηχανική Χρήση", "Industrial use", "Industrielle Nutzung", "Usage industriel"),
      agricultural: s("Γεωργική Χρήση", "Agricultural use", "Landwirtschaftliche Nutzung", "Usage agricole"),
    },
    pricing: {
      fixedTitle: s("Σταθερή", "Fixed", "Grundgebühr", "Fixe"),
      fixedText: s("15,00 € / τρίμηνο", "15,00 € / quarter", "15,00 € / Quartal", "15,00 € / trimestre"),
      waterTitle: s("Ύδρευση", "Water", "Wasser", "Eau"),
      waterText: s(
        "0,45 € / m³ (οικιακή)",
        "0,45 € / m³ (residential)",
        "0,45 € / m³ (Haushalt)",
        "0,45 € / m³ (domestique)",
      ),
      sewerTitle: s("Αποχέτευση", "Sewerage", "Abwasser", "Assainissement"),
      sewerText: s(
        "0,30 € / m³ (οικιακή)",
        "0,30 € / m³ (residential)",
        "0,30 € / m³ (Haushalt)",
        "0,30 € / m³ (domestique)",
      ),
    },
    info0: s(
      "Ενδεικτική εκτίμηση — όχι τελικό ποσό",
      "Indicative estimate — not the final amount",
      "Unverbindliche Schätzung — kein Endbetrag",
      "Estimation indicative — pas le montant final",
    ),
    info1: s(
      "Λογαριασμοί εκδίδονται τριμηνιαίως",
      "Bills are issued quarterly",
      "Rechnungen werden vierteljährlich ausgestellt",
      "Les factures sont émises trimestriellement",
    ),
    payLink: s("Πληρωμή λογαριασμού", "Pay the bill", "Rechnung bezahlen", "Payer la facture"),
    meterLink: s("Δήλωση ένδειξης", "Meter reading", "Zählerstand", "Relevé de compteur"),
    estimatePill: s(
      "Εκτίμηση κατανάλωσης",
      "Consumption estimate",
      "Verbrauchsschätzung",
      "Estimation de consommation",
    ),
    consumptionLabel: s("Κατανάλωση (m³)", "Consumption (m³)", "Verbrauch (m³)", "Consommation (m³)"),
    consumptionPlaceholder: s("π.χ. 25.5", "e.g. 25.5", "z. B. 25.5", "ex. 25.5"),
    categoryLabel: s("Κατηγορία χρήσης", "Usage category", "Nutzungskategorie", "Catégorie d’usage"),
    calculate: s(
      "Υπολογισμός λογαριασμού",
      "Calculate the bill",
      "Rechnung berechnen",
      "Calculer la facture",
    ),
    calculating: s("Υπολογισμός...", "Calculating...", "Berechnung...", "Calcul..."),
    calculateHint: s(
      "Εκτίμηση τριμηνιαίας χρέωσης",
      "Estimate of the quarterly charge",
      "Schätzung der Quartalsabrechnung",
      "Estimation de la facturation trimestrielle",
    ),
    estimateNote: s(
      "Ενδεικτική εκτίμηση — το τελικό ποσό μπορεί να διαφέρει.",
      "Indicative estimate — the final amount may differ.",
      "Unverbindliche Schätzung — der Endbetrag kann abweichen.",
      "Estimation indicative — le montant final peut différer.",
    ),
    usageVeryLow: s("Πολύ χαμηλή", "Very low", "Sehr niedrig", "Très faible"),
    usageLow: s("Χαμηλή", "Low", "Niedrig", "Faible"),
    usageMid: s("Μέση", "Medium", "Mittel", "Moyenne"),
    usageHigh: s("Υψηλή", "High", "Hoch", "Élevée"),
    usageVeryHigh: s("Πολύ υψηλή", "Very high", "Sehr hoch", "Très élevée"),
    fixedCharge: s("Σταθερή χρέωση", "Fixed charge", "Grundgebühr", "Charge fixe"),
    waterCharge: s("Ύδρευση", "Water", "Wasser", "Eau"),
    sewerCharge: s("Αποχέτευση", "Sewerage", "Abwasser", "Assainissement"),
    total: s("Σύνολο", "Total", "Summe", "Total"),
    highUsageAlert: s(
      "Υψηλή κατανάλωση — εξετάστε τρόπους εξοικονόμησης νερού.",
      "High consumption — consider ways to save water.",
      "Hoher Verbrauch — prüfen Sie Möglichkeiten zum Wassersparen.",
      "Consommation élevée — envisagez des moyens d’économiser l’eau.",
    ),
    nextStep: s("Επόμενο βήμα", "Next step", "Nächster Schritt", "Étape suivante"),
    afterEstimate: s(
      "Μετά την εκτίμηση, συνεχίστε στην online πληρωμή",
      "After the estimate, continue to online payment",
      "Nach der Schätzung fahren Sie mit der Online-Zahlung fort",
      "Après l’estimation, continuez vers le paiement en ligne",
    ),
  },
  problem: {
    title: s("Αναφορά Προβλήματος", "Report a problem", "Störung melden", "Signaler un problème"),
    tagline: s(
      "Σημειώστε το σημείο στον χάρτη και υποβάλετε την αναφορά online.",
      "Mark the point on the map and submit the report online.",
      "Markieren Sie den Punkt auf der Karte und senden Sie die Meldung online.",
      "Indiquez le point sur la carte et envoyez le signalement en ligne.",
    ),
    breadcrumb: s("Αναφορά", "Report", "Meldung", "Signalement"),
    typeLabel: s("Τύπος *", "Type *", "Art *", "Type *"),
    typePlaceholder: s("Επιλέξτε τύπο", "Select a type", "Art auswählen", "Choisissez un type"),
    urgencyLabel: s("Επείγον *", "Urgency *", "Dringlichkeit *", "Urgence *"),
    urgencyPlaceholder: s(
      "Επιλέξτε επείγον",
      "Select urgency",
      "Dringlichkeit auswählen",
      "Choisissez l’urgence",
    ),
    types: {
      water_interruption: s("Διακοπή ύδρευσης", "Water supply interruption", "Wasserunterbrechung", "Coupure d’eau"),
      sewer_issue: s("Πρόβλημα αποχέτευσης", "Sewerage issue", "Abwasserproblem", "Problème d’assainissement"),
      water_quality: s("Ποιότητα νερού", "Water quality", "Wasserqualität", "Qualité de l’eau"),
      meter_issue: s("Πρόβλημα μετρητή", "Meter issue", "Zählerproblem", "Problème de compteur"),
      billing_issue: s("Πρόβλημα χρέωσης", "Billing issue", "Abrechnungsproblem", "Problème de facturation"),
      other: s("Άλλο πρόβλημα", "Other issue", "Anderes Problem", "Autre problème"),
    },
    urgency: {
      low: {
        label: s("Χαμηλή", "Low", "Niedrig", "Faible"),
        description: s("Μπορεί να περιμένει", "Can wait", "Kann warten", "Peut attendre"),
      },
      medium: {
        label: s("Μεσαία", "Medium", "Mittel", "Moyenne"),
        description: s("Χρειάζεται προσοχή", "Needs attention", "Erfordert Aufmerksamkeit", "Nécessite une attention"),
      },
      high: {
        label: s("Υψηλή", "High", "Hoch", "Élevée"),
        description: s("Επείγον", "Urgent", "Dringend", "Urgent"),
      },
      critical: {
        label: s("Κρίσιμη", "Critical", "Kritisch", "Critique"),
        description: s("Άμεση παρέμβαση", "Immediate intervention", "Sofortiges Eingreifen", "Intervention immédiate"),
      },
    },
    metrics: {
      critical: s("2 ώρες", "2 hours", "2 Stunden", "2 heures"),
      high: s("24 ώρες", "24 hours", "24 Stunden", "24 heures"),
      medium: s("48 ώρες", "48 hours", "48 Stunden", "48 heures"),
    },
    metricLabels: {
      critical: s("Κρίσιμα", "Critical", "Kritisch", "Critiques"),
      high: s("Υψηλή", "High", "Hoch", "Élevée"),
      medium: s("Μεσαία", "Medium", "Mittel", "Moyenne"),
    },
    supportName: s("Εξυπηρέτηση ΔΕΥΑΑ", "DEYAA customer service", "DEYAA-Kundendienst", "Service clients DEYAA"),
    supportHandle: s("24/7 online υποβολή", "24/7 online submission", "24/7 Online-Meldung", "Dépôt en ligne 24/7"),
    supportNoTaxisnet: s("Χωρίς Taxisnet", "No Taxisnet required", "Ohne Taxisnet", "Sans Taxisnet"),
    supportFaults: s("Βλάβες 24/7", "Faults 24/7", "Störungen 24/7", "Pannes 24/7"),
    supportService: s("Εξυπηρέτηση", "Customer service", "Kundendienst", "Service clients"),
    supportEmail: s("Email", "Email", "E-Mail", "E-mail"),
    slaAria: s("Χρόνοι ανταπόκρισης", "Response times", "Reaktionszeiten", "Délais de réponse"),
    faultsAria: s("Βλάβες 24/7", "Faults 24/7", "Störungen 24/7", "Pannes 24/7"),
    mapHint: s(
      "Περιοχή εξυπηρέτησης ΔΕΥΑΑ",
      "DEYAA service area",
      "Zuständigkeitsgebiet der DEYAA",
      "Zone de service de la DEYAA",
    ),
    fields: {
      description: s("Περιγραφή *", "Description *", "Beschreibung *", "Description *"),
      descriptionPlaceholder: s(
        "Τι συμβαίνει και πού ακριβώς;",
        "What is happening and where exactly?",
        "Was ist passiert und wo genau?",
        "Que se passe-t-il et où exactement ?",
      ),
      name: s("Όνομα *", "Name *", "Name *", "Nom *"),
      phone: s("Τηλέφωνο *", "Phone *", "Telefon *", "Téléphone *"),
      email: s("Email", "Email", "E-Mail", "E-mail"),
      photos: s("Φωτογραφίες", "Photos", "Fotos", "Photos"),
      photosN: s(
        "{count} επιλεγμένες",
        "{count} selected",
        "{count} ausgewählt",
        "{count} sélectionnées",
      ),
      photosAdd: s("Προσθήκη φωτογραφιών", "Add photos", "Fotos hinzufügen", "Ajouter des photos"),
      photosHint: s("PNG, JPG · έως 10MB", "PNG, JPG · up to 10MB", "PNG, JPG · bis 10MB", "PNG, JPG · jusqu’à 10MB"),
    },
    submit: s("Υποβολή αναφοράς", "Submit report", "Meldung senden", "Envoyer le signalement"),
    submitting: s("Υποβολή...", "Submitting...", "Senden...", "Envoi..."),
    successTitle: s(
      "Ευχαριστούμε για την αναφορά",
      "Thank you for the report",
      "Danke für Ihre Meldung",
      "Merci pour votre signalement",
    ),
    protocolLabel: s("Αριθμός πρωτοκόλλου", "Reference number", "Vorgangsnummer", "Numéro de dossier"),
    successNote: s(
      "Θα ενημερωθείτε για την εξέλιξη μέσω SMS και email. Για επείγοντα καλέστε 28253-40208.",
      "You will be updated on progress by SMS and email. For emergencies call 28253-40208.",
      "Über den Fortschritt werden Sie per SMS und E-Mail informiert. In Notfällen rufen Sie 28253-40208 an.",
      "Vous serez informé de l’évolution par SMS et e-mail. Pour les urgences, appelez le 28253-40208.",
    ),
    newReport: s("Νέα αναφορά", "New report", "Neue Meldung", "Nouveau signalement"),
    mapPlaceholder: s("Διεύθυνση ή περιοχή", "Address or area", "Adresse oder Gebiet", "Adresse ou secteur"),
    mapSearch: s(
      "Αναζήτηση διεύθυνσης...",
      "Search for an address...",
      "Adresse suchen...",
      "Rechercher une adresse...",
    ),
    mapLoading: s("Φόρτωση χάρτη...", "Loading map...", "Karte wird geladen...", "Chargement de la carte..."),
    mapLabel: s("Τοποθεσία", "Location", "Standort", "Emplacement"),
    mapSelected: s("Επιλεγμένη τοποθεσία:", "Selected location:", "Ausgewählter Standort:", "Emplacement sélectionné :"),
    mapCoords: s(
      "Συντεταγμένες: {lat}, {lng}",
      "Coordinates: {lat}, {lng}",
      "Koordinaten: {lat}, {lng}",
      "Coordonnées : {lat}, {lng}",
    ),
    mapMoveHint: s(
      "Κάντε κλικ στον χάρτη ή σύρετε τον δείκτη για να αλλάξετε την τοποθεσία",
      "Click the map or drag the pin to change the location",
      "Klicken Sie auf die Karte oder ziehen Sie die Markierung, um den Standort zu ändern",
      "Cliquez sur la carte ou faites glisser le repère pour changer l’emplacement",
    ),
    validation: {
      problemType: {
        title: s(
          "Επιλέξτε τύπο προβλήματος",
          "Select a problem type",
          "Wählen Sie die Art des Problems",
          "Choisissez le type de problème",
        ),
        description: s(
          "Δηλώστε τι είδους πρόβλημα αναφέρετε (π.χ. διακοπή ύδρευσης, αποχέτευση, ποιότητα νερού) ώστε να κατευθυνθεί σωστά η αναφορά.",
          "Say what kind of problem you are reporting (for example a water outage, sewerage, or water quality) so the report is routed correctly.",
          "Geben Sie an, welche Art von Problem Sie melden (z. B. Wasserunterbrechung, Abwasser, Wasserqualität), damit die Meldung richtig zugeordnet wird.",
          "Indiquez le type de problème que vous signalez (par exemple coupure d’eau, assainissement, qualité de l’eau) afin que le dossier soit bien orienté.",
        ),
      },
      urgency: {
        title: s(
          "Επιλέξτε επίπεδο επείγοντος",
          "Select an urgency level",
          "Wählen Sie die Dringlichkeitsstufe",
          "Choisissez le niveau d’urgence",
        ),
        description: s(
          "Βοηθήστε μας να προτεραιοποιήσουμε την αναφορά σας, επιλέγοντας πόσο άμεση είναι η ανάγκη παρέμβασης.",
          "Help us prioritise your report by choosing how soon intervention is needed.",
          "Helfen Sie uns, Ihre Meldung zu priorisieren, indem Sie angeben, wie rasch ein Eingreifen nötig ist.",
          "Aidez-nous à prioriser votre signalement en indiquant à quel point l’intervention est urgente.",
        ),
      },
      location: {
        title: s(
          "Σημειώστε το σημείο στον χάρτη",
          "Mark the point on the map",
          "Markieren Sie den Punkt auf der Karte",
          "Indiquez le point sur la carte",
        ),
        description: s(
          "Κάντε κλικ στον χάρτη ή αναζητήστε διεύθυνση για να δηλώσετε πού βρίσκεται το πρόβλημα. Χωρίς τοποθεσία δεν μπορούμε να στείλουμε συνεργείο.",
          "Click the map or search for an address to say where the problem is. Without a location we cannot send a crew.",
          "Klicken Sie auf die Karte oder suchen Sie eine Adresse, um den Ort des Problems anzugeben. Ohne Standort können wir kein Team schicken.",
          "Cliquez sur la carte ou recherchez une adresse pour indiquer où se trouve le problème. Sans emplacement, nous ne pouvons pas envoyer une équipe.",
        ),
      },
      description: {
        title: s(
          "Συμπληρώστε την περιγραφή",
          "Fill in the description",
          "Füllen Sie die Beschreibung aus",
          "Remplissez la description",
        ),
        description: s(
          "Περιγράψτε τι συμβαίνει και, αν είναι δυνατόν, που ακριβώς εντοπίζεται το πρόβλημα, ώστε να στείλουμε το κατάλληλο συνεργείο.",
          "Describe what is happening and, if possible, exactly where the problem is, so we can send the right crew.",
          "Beschreiben Sie, was vorfällt, und möglichst genau, wo das Problem liegt, damit wir das passende Team schicken können.",
          "Décrivez ce qui se passe et, si possible, l’endroit exact du problème, afin que nous envoyions l’équipe adaptée.",
        ),
      },
      name: {
        title: s(
          "Συμπληρώστε το όνομά σας",
          "Fill in your name",
          "Geben Sie Ihren Namen an",
          "Indiquez votre nom",
        ),
        description: s(
          "Το πεδίο «Όνομα» είναι υποχρεωτικό για να μπορέσουμε να επικοινωνήσουμε μαζί σας σχετικά με την αναφορά.",
          "The “Name” field is required so we can contact you about the report.",
          "Das Feld «Name» ist Pflicht, damit wir Sie zur Meldung kontaktieren können.",
          "Le champ « Nom » est obligatoire pour que nous puissions vous contacter au sujet du signalement.",
        ),
      },
      phone: {
        title: s(
          "Συμπληρώστε το τηλέφωνό σας",
          "Fill in your phone number",
          "Geben Sie Ihre Telefonnummer an",
          "Indiquez votre téléphone",
        ),
        description: s(
          "Ο αριθμός τηλεφώνου είναι απαραίτητος ώστε η ΔΕΥΑΑ να επικοινωνήσει μαζί σας για διευκρινίσεις ή ενημέρωση.",
          "A phone number is required so DEYAA can contact you for clarification or updates.",
          "Die Telefonnummer ist erforderlich, damit die DEYAA Sie für Rückfragen oder Informationen erreichen kann.",
          "Le numéro de téléphone est indispensable pour que la DEYAA puisse vous joindre pour des précisions ou des mises à jour.",
        ),
      },
      submitError: {
        title: s(
          "Η υποβολή της αναφοράς απέτυχε",
          "The report could not be submitted",
          "Das Senden der Meldung ist fehlgeschlagen",
          "L’envoi du signalement a échoué",
        ),
        description: s(
          "Δεν ήταν δυνατή η καταχώριση της αναφοράς. Ελέγξτε τη σύνδεσή σας, επαληθεύστε ξανά το reCAPTCHA και δοκιμάστε μία ακόμη φορά.",
          "The report could not be recorded. Check your connection, complete reCAPTCHA again, and try once more.",
          "Die Meldung konnte nicht erfasst werden. Prüfen Sie Ihre Verbindung, bestätigen Sie reCAPTCHA erneut und versuchen Sie es noch einmal.",
          "L’enregistrement du signalement a échoué. Vérifiez votre connexion, validez à nouveau le reCAPTCHA et réessayez.",
        ),
      },
    },
  },
} as const;
