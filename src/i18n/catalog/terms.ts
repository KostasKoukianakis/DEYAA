import type { I18nText, I18nTextList } from "@/i18n/types";

const s = (el: string, en: string, de: string, fr: string): I18nText => ({ el, en, de, fr });
const sl = (el: string[], en: string[], de: string[], fr: string[]): I18nTextList => ({ el, en, de, fr });

export const termsCatalog = {
  pageTitle: s("Όροι χρήσης", "Terms of use", "Nutzungsbedingungen", "Conditions d’utilisation"),
  kicker: s("Ιστότοπος", "Website", "Website", "Site"),
  title: s("Όροι", "Terms", "Bedingungen", "Conditions"),
  titleTail: s("χρήσης", "of use", "der Nutzung", "d’utilisation"),
  lede: s(
    "Κανόνες για την πλοήγηση, το περιεχόμενο και τις ηλεκτρονικές υπηρεσίες της ΔΕΥΑΑ Αποκορώνου. Τα προσωπικά δεδομένα καλύπτονται χωριστά στην πολιτική απορρήτου.",
    "Rules for browsing, content and e-services of DEYAA of Apokoronas. Personal data is covered separately in the privacy policy.",
    "Regeln für die Nutzung der Website und der E-Services der DEYAA Apokoronas. Personenbezogene Daten stehen in der Datenschutzrichtlinie.",
    "Règles de navigation, de contenu et d’e-services de la DEYAA d’Apokoronas. Les données personnelles sont traitées dans la politique de confidentialité.",
  ),
  updated: s(
    "Τελευταία ενημέρωση: 5 Σεπτεμβρίου 2026",
    "Last updated: 5 September 2026",
    "Zuletzt aktualisiert: 5. September 2026",
    "Dernière mise à jour : 5 septembre 2026",
  ),
  tocAria: s("Περιεχόμενα όρων χρήσης", "Terms contents", "Inhalt der Nutzungsbedingungen", "Sommaire des conditions"),
  privacyLink: s("Πολιτική απορρήτου", "Privacy policy", "Datenschutzrichtlinie", "Politique de confidentialité"),
  contactPage: s("Επικοινωνία", "Contact", "Kontakt", "Contact"),

  toc: {
    accept: s("Αποδοχή", "Acceptance", "Annahme", "Acceptation"),
    purpose: s("Σκοπός", "Purpose", "Zweck", "Objet"),
    content: s("Περιεχόμενο", "Content", "Inhalte", "Contenu"),
    use: s("Ορθή χρήση", "Fair use", "Nutzung", "Usage"),
    ip: s("Πνευματικά", "Copyright", "Urheberrecht", "Droits"),
    services: s("e-Services", "e-Services", "E-Services", "e-Services"),
    liability: s("Ευθύνη", "Liability", "Haftung", "Responsabilité"),
    data: s("Δεδομένα", "Data", "Daten", "Données"),
    law: s("Δίκαιο", "Law", "Recht", "Droit"),
  },

  s1: {
    title: s("Αποδοχή των όρων", "Acceptance of these terms", "Annahme dieser Bedingungen", "Acceptation des conditions"),
    p1: s(
      "Με την είσοδό σας στον ιστότοπο deyaa.gr και στις συναφείς σελίδες της Δημοτικής Επιχείρησης Ύδρευσης Αποχέτευσης Αποκορώνου («ΔΕΥΑΑ», «Επιχείρηση») αποδέχεστε τους παρόντες όρους. Αν δεν συμφωνείτε, μην χρησιμοποιείτε τον ιστότοπο.",
      "By entering deyaa.gr and the related pages of the Municipal Water and Sewerage Company of Apokoronas (“DEYAA”, “the Company”) you accept these terms. If you do not agree, do not use the site.",
      "Mit dem Aufruf von deyaa.gr und den zugehörigen Seiten der Städtischen Wasser- und Abwasserbetriebe von Apokoronas („DEYAA“) akzeptieren Sie diese Bedingungen. Wenn Sie nicht einverstanden sind, nutzen Sie die Website nicht.",
      "En accédant à deyaa.gr et aux pages liées de l’entreprise municipale d’eau et d’assainissement d’Apokoronas (« DEYAA »), vous acceptez ces conditions. Si vous n’êtes pas d’accord, n’utilisez pas le site.",
    ),
    p2: s(
      "Οι όροι αφορούν τη δημόσια ενημέρωση, την επικοινωνία, το ενημερωτικό δελτίο, τις αναφορές βλαβών και την παραπομπή στις ηλεκτρονικές υπηρεσίες καταναλωτή. Δεν αντικαθιστούν τη σύμβαση υδροληψίας / αποχέτευσης ούτε τον κανονισμό λειτουργίας της Επιχείρησης.",
      "These terms cover public information, contact, the newsletter, fault reports and the redirect to consumer e-services. They do not replace a water / sewerage contract or the Company’s operating rules.",
      "Die Bedingungen gelten für öffentliche Information, Kontakt, Newsletter, Störungsmeldungen und die Weiterleitung zu den Verbraucherdiensten. Sie ersetzen weder den Versorgungsvertrag noch die Betriebsordnung.",
      "Ces conditions couvrent l’information publique, le contact, la lettre d’information, les signalements et le renvoi vers les e-services. Elles ne remplacent ni le contrat d’eau / d’assainissement ni le règlement de l’Entreprise.",
    ),
  },

  s2: {
    title: s("Σκοπός του ιστοτόπου", "Purpose of the site", "Zweck der Website", "Objet du site"),
    p1: s(
      "Ο ιστότοπος ενημερώνει τους δημότες και τους καταναλωτές για την ύδρευση, την αποχέτευση, τις ανακοινώσεις, τα δικαιολογητικά και τις διαθέσιμες ηλεκτρονικές υπηρεσίες. Το περιεχόμενο μπορεί να αλλάξει χωρίς προηγούμενη ειδοποίηση όταν το απαιτεί η λειτουργία της Επιχείρησης.",
      "The site informs residents and consumers about water supply, sewerage, announcements, supporting documents and available e-services. Content may change without prior notice when the Company’s operations require it.",
      "Die Website informiert Einwohner und Verbraucher über Wasser, Abwasser, Mitteilungen, Unterlagen und digitale Dienste. Inhalte können ohne Vorankündigung geändert werden, soweit der Betrieb es erfordert.",
      "Le site informe les habitants et les abonnés sur l’eau, l’assainissement, les annonces, les justificatifs et les e-services. Le contenu peut changer sans préavis lorsque le fonctionnement l’exige.",
    ),
    address: s(
      "ΔΕΥΑΑ Αποκορώνου — Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159, Βάμος, 73008 — Χανιά, Κρήτη. Τηλ. 28253-40213 · info@deyaa.gr",
      "DEYAA of Apokoronas — Kalives–Georgioupoli Provincial Road 159, Vamos 73008 — Chania, Crete. Tel. 28253-40213 · info@deyaa.gr",
      "DEYAA Apokoronas — Provinzialstraße Kalives–Georgioupoli 159, Vamos 73008 — Chania, Kreta. Tel. 28253-40213 · info@deyaa.gr",
      "DEYAA d’Apokoronas — route provinciale Kalives–Georgioupoli 159, Vamos 73008 — La Canée, Crète. Tél. 28253-40213 · info@deyaa.gr",
    ),
  },

  s3: {
    title: s("Πληροφορίες και ακρίβεια", "Information and accuracy", "Informationen und Richtigkeit", "Informations et exactitude"),
    p1: s(
      "Καταβάλλουμε προσπάθεια το περιεχόμενο να είναι επίκαιρο και ακριβές. Δεν αποτελεί δεσμευτική γνωμοδότηση, προσφορά ή τεχνική μελέτη. Για λογαριασμούς, οφειλές, παροχές και εργασίες πεδίου ισχύουν τα επίσημα στοιχεία της Επιχείρησης και ό,τι επιβεβαιώνεται γραπτώς ή μέσω της πλατφόρμας services.deyaa.gr.",
      "We try to keep content current and accurate. It is not a binding opinion, offer or engineering study. For bills, debts, connections and field work, the Company’s official records apply, and whatever is confirmed in writing or on services.deyaa.gr.",
      "Wir bemühen uns um aktuelle und zutreffende Inhalte. Sie sind keine verbindliche Auskunft, kein Angebot und kein Gutachten. Für Rechnungen, Forderungen, Anschlüsse und Einsätze gelten die amtlichen Unterlagen des Unternehmens sowie schriftliche oder über services.deyaa.gr bestätigte Angaben.",
      "Nous nous efforçons de tenir le contenu à jour. Il ne constitue ni avis contraignant, ni offre, ni étude technique. Pour les factures, dettes, branchements et interventions, seuls les dossiers officiels et les confirmations écrites ou via services.deyaa.gr font foi.",
    ),
    p2: s(
      "Ανακοινώσεις διακοπών, ποιότητας νερού ή εργασιών μπορεί να αλλάξουν λόγω έκτακτης ανάγκης. Σε επείγον περιστατικό καλέστε τα τηλέφωνα βλαβών που αναγράφονται στον ιστότοπο.",
      "Notices about outages, water quality or works may change in an emergency. For urgent incidents call the fault numbers shown on the site.",
      "Hinweise zu Ausfällen, Wasserqualität oder Arbeiten können sich im Notfall ändern. Bei Dringlichkeit rufen Sie die auf der Website genannten Störungsnummern an.",
      "Les avis de coupure, de qualité de l’eau ou de travaux peuvent changer en urgence. En cas d’incident, appelez les numéros de panne indiqués sur le site.",
    ),
  },

  s4: {
    title: s("Ορθή χρήση", "Fair use", "Zulässige Nutzung", "Usage loyal"),
    p1: s(
      "Η πλοήγηση γίνεται με δική σας ευθύνη και μόνο για νόμιμους σκοπούς, σύμφωνα με τη νομοθεσία για τις ηλεκτρονικές επικοινωνίες. Απαγορεύεται κάθε χρήση που βλάπτει άλλους επισκέπτες, το προσωπικό ή τα συστήματα της Επιχείρησης.",
      "You browse at your own risk and only for lawful purposes, under electronic-communications law. Any use that harms other visitors, staff or the Company’s systems is forbidden.",
      "Die Nutzung erfolgt auf eigene Verantwortung und nur zu rechtmäßigen Zwecken nach dem Recht der elektronischen Kommunikation. Jede Nutzung, die andere Besucher, Personal oder Systeme schädigt, ist untersagt.",
      "Vous naviguez à vos risques et uniquement à des fins licites, conformément au droit des communications électroniques. Tout usage qui nuit aux visiteurs, au personnel ou aux systèmes est interdit.",
    ),
    items: sl(
      [
        "αποστολή κακόβουλου λογισμικού, ανεπιθύμητης αλληλογραφίας ή αυτοματοποιημένων αιτημάτων που επιβαρύνουν τον διακομιστή",
        "πρόσβαση χωρίς δικαίωμα σε περιοχές διαχείρισης, δεδομένα άλλων καταναλωτών ή υποδομές",
        "παραποίηση στοιχείων ταυτότητας, ΑΦΜ ή παροχής σε φόρμες και στην πλατφόρμα e-Services",
        "αναπαραγωγή του περιεχομένου για εμπορική εκμετάλλευση χωρίς άδεια",
      ],
      [
        "sending malware, unsolicited mail or automated requests that overload the server",
        "unauthorised access to admin areas, other consumers’ data or infrastructure",
        "falsifying identity, tax numbers or connection details on forms and on the e-Services platform",
        "reproducing content for commercial use without permission",
      ],
      [
        "Versand von Schadsoftware, unerwünschter Post oder automatisierten Anfragen, die den Server belasten",
        "unbefugter Zugriff auf Verwaltungsbereiche, Daten anderer Kunden oder Infrastruktur",
        "Fälschung von Identität, Steuernummer oder Anschlussdaten in Formularen und auf der E-Service-Plattform",
        "gewerbliche Vervielfältigung der Inhalte ohne Erlaubnis",
      ],
      [
        "envoi de logiciels malveillants, de courrier non sollicité ou de requêtes automatisées qui saturent le serveur",
        "accès non autorisé aux zones d’administration, aux données d’autres abonnés ou aux infrastructures",
        "falsification d’identité, de n° fiscal ou de branchement sur les formulaires et la plateforme e-Services",
        "reproduction commerciale du contenu sans autorisation",
      ],
    ),
  },

  s5: {
    title: s("Πνευματική ιδιοκτησία", "Intellectual property", "Geistiges Eigentum", "Propriété intellectuelle"),
    p1: s(
      "Το σήμα, τα κείμενα, οι εικόνες, τα σύμβολα και ο κώδικας του ιστοτόπου ανήκουν στη ΔΕΥΑΑ, εκτός αν αναφέρεται άλλος δικαιούχος. Απαγορεύεται η αντιγραφή, τροποποίηση, δημοσίευση ή εμπορική χρήση χωρίς γραπτή άδεια.",
      "The mark, texts, images, symbols and code of this site belong to DEYAA unless another owner is named. Copying, changing, publishing or commercial use without written permission is forbidden.",
      "Marke, Texte, Bilder, Zeichen und Code dieser Website gehören der DEYAA, soweit kein anderer Rechteinhaber genannt ist. Kopie, Änderung, Veröffentlichung oder gewerbliche Nutzung ohne schriftliche Erlaubnis sind untersagt.",
      "La marque, les textes, images, signes et le code de ce site appartiennent à la DEYAA, sauf autre titulaire indiqué. La copie, la modification, la publication ou l’usage commercial sans autorisation écrite sont interdits.",
    ),
    p2: s(
      "Επιτρέπεται η σύντομη παράθεση για ενημέρωση των δημοτών, με αναφορά στην πηγή. Τα σήματα τρίτων (Taxisnet, τράπεζες, πάροχοι) παραμένουν ιδιοκτησία τους.",
      "Short quotation for public information is allowed, with source credit. Third-party marks (Taxisnet, banks, providers) remain theirs.",
      "Kurze Zitate zur Bürgerinformation sind mit Quellenangabe zulässig. Marken Dritter (Taxisnet, Banken, Anbieter) bleiben deren Eigentum.",
      "La courte citation pour l’information des habitants est permise, avec mention de la source. Les marques tierces (Taxisnet, banques, prestataires) restent les leurs.",
    ),
  },

  s6: {
    title: s("Ηλεκτρονικές υπηρεσίες και σύνδεσμοι", "E-services and links", "E-Services und Links", "E-services et liens"),
    p1: s(
      "Πληρωμές, δήλωση ένδειξης και πολλά αιτήματα ολοκληρώνονται στο services.deyaa.gr, συχνά με σύνδεση Taxisnet. Εκεί ισχύουν οι όροι και η πολιτική εκείνης της πλατφόρμας, καθώς και οι όροι της ΑΑΔΕ / Taxisnet για την ταυτοποίηση.",
      "Payments, meter readings and many requests are completed on services.deyaa.gr, often with a Taxisnet sign-in. That platform’s terms and privacy notice apply there, as do AADE / Taxisnet rules for identification.",
      "Zahlungen, Zählerstände und viele Anträge werden auf services.deyaa.gr abgeschlossen, oft mit Taxisnet-Anmeldung. Dort gelten die Bedingungen jener Plattform sowie die Regeln von AADE / Taxisnet zur Identifizierung.",
      "Paiements, relevés et de nombreuses demandes se terminent sur services.deyaa.gr, souvent via Taxisnet. Les conditions de cette plateforme s’y appliquent, ainsi que les règles AADE / Taxisnet pour l’identification.",
    ),
    p2: s(
      "Σύνδεσμοι προς gov.gr, τράπεζες, χάρτες ή άλλους φορείς δίνονται για διευκόλυνση. Δεν συνιστούν έγκριση του περιεχομένου τους. Δεν ευθυνόμαστε για τη διαθεσιμότητα, την ακρίβεια ή την πολιτική απορρήτου τρίτων ιστοτόπων.",
      "Links to gov.gr, banks, maps or other bodies are provided for convenience. They are not an endorsement. We are not responsible for the availability, accuracy or privacy practices of third-party sites.",
      "Links zu gov.gr, Banken, Karten oder anderen Stellen dienen der Erleichterung. Sie sind keine Billigung. Für Verfügbarkeit, Richtigkeit oder Datenschutz Dritter haften wir nicht.",
      "Les liens vers gov.gr, les banques, les cartes ou d’autres organismes sont fournis pour faciliter la démarche. Ils ne valent pas approbation. Nous ne répondons pas de la disponibilité, de l’exactitude ou de la confidentialité des sites tiers.",
    ),
  },

  s7: {
    title: s("Διαθεσιμότητα και ευθύνη", "Availability and liability", "Verfügbarkeit und Haftung", "Disponibilité et responsabilité"),
    p1: s(
      "Καταβάλλουμε προσπάθεια ο ιστότοπος να λειτουργεί συνεχώς και να προστατεύεται από κακόβουλες επιθέσεις. Δεν εγγυόμαστε αδιάλειπτη διαθεσιμότητα, ούτε ότι η μετάδοση μέσω διαδικτύου είναι απολύτως ασφαλής μέχρι να φτάσει σε εμάς.",
      "We try to keep the site running and protected from hostile attacks. We do not guarantee uninterrupted availability, or that transmission over the internet is completely secure until it reaches us.",
      "Wir bemühen uns um einen durchgehenden, gegen Angriffe geschützten Betrieb. Eine ununterbrochene Verfügbarkeit oder die vollständige Sicherheit der Übertragung bis zum Eingang bei uns können wir nicht garantieren.",
      "Nous nous efforçons d’assurer un fonctionnement continu et protégé. Nous ne garantissons ni une disponibilité ininterrompue, ni la sécurité totale de la transmission tant que les données ne nous sont pas parvenues.",
    ),
    p2: s(
      "Η ασφάλεια της συσκευής, του δικτύου και του λογαριασμού email που χρησιμοποιείτε είναι δική σας ευθύνη. Στο μέτρο που επιτρέπει ο νόμος, η Επιχείρηση δεν ευθύνεται για έμμεσες ζημίες από διακοπή, σφάλμα περιεχομένου ή χρήση τρίτων υπηρεσιών στις οποίες παραπέμπουμε.",
      "The security of your device, network and email account is your responsibility. To the extent the law allows, the Company is not liable for indirect loss from an outage, a content error, or third-party services we link to.",
      "Die Sicherheit Ihres Geräts, Netzes und E-Mail-Kontos liegt bei Ihnen. Soweit gesetzlich zulässig, haftet das Unternehmen nicht für mittelbare Schäden durch Ausfall, Inhaltsfehler oder verlinkte Drittdienste.",
      "La sécurité de votre appareil, de votre réseau et de votre messagerie vous incombe. Dans la mesure permise par la loi, l’Entreprise n’est pas responsable des préjudices indirects dus à une interruption, une erreur de contenu ou un service tiers vers lequel nous renvoyons.",
    ),
  },

  s8: {
    title: s("Προσωπικά δεδομένα", "Personal data", "Personenbezogene Daten", "Données personnelles"),
    p1: s(
      "Η συλλογή και επεξεργασία δεδομένων προσωπικού χαρακτήρα — φόρμες, ενημερωτικό δελτίο, cookies, αναφορές βλαβών, μητρώο καταναλωτή — ρυθμίζεται στην πολιτική απορρήτου, που αποτελεί χωριστό κείμενο και πρέπει να διαβάζεται μαζί με τους παρόντες όρους.",
      "Collection and processing of personal data — forms, newsletter, cookies, fault reports, consumer register — is set out in the privacy policy, a separate document that should be read together with these terms.",
      "Erhebung und Verarbeitung personenbezogener Daten — Formulare, Newsletter, Cookies, Störungsmeldungen, Kundenregister — stehen in der Datenschutzrichtlinie, einem eigenen Text, der zusammen mit diesen Bedingungen zu lesen ist.",
      "La collecte et le traitement des données — formulaires, lettre d’information, cookies, signalements, fichier abonnés — sont décrits dans la politique de confidentialité, document distinct à lire avec les présentes conditions.",
    ),
  },

  s9: {
    title: s("Αλλαγές και εφαρμοστέο δίκαιο", "Changes and governing law", "Änderungen und anwendbares Recht", "Modifications et droit applicable"),
    p1: s(
      "Μπορούμε να τροποποιούμε τους όρους όταν αλλάζει η νομοθεσία ή οι υπηρεσίες. Η νέα έκδοση ισχύει από την ημερομηνία στην κορυφή της σελίδας. Η συνέχιση της χρήσης μετά την ανάρτηση συνιστά αποδοχή, εκτός αν ο νόμος απαιτεί ρητή συγκατάθεση.",
      "We may change these terms when the law or our services change. The new version applies from the date at the top of the page. Continued use after publication is acceptance, unless the law requires explicit consent.",
      "Wir können die Bedingungen anpassen, wenn sich Recht oder Dienste ändern. Die neue Fassung gilt ab dem Datum oben auf der Seite. Die weitere Nutzung nach der Veröffentlichung gilt als Annahme, soweit das Gesetz keine ausdrückliche Zustimmung verlangt.",
      "Nous pouvons modifier ces conditions lorsque le droit ou les services changent. La nouvelle version s’applique à compter de la date en haut de page. La poursuite de l’usage après publication vaut acceptation, sauf si la loi exige un consentement exprès.",
    ),
    p2: s(
      "Εφαρμοστέο είναι το ελληνικό δίκαιο. Για διαφορές που δεν επιλύονται φιλικά αρμόδια είναι τα δικαστήρια Χανίων, εκτός αν αναγκαστική διάταξη ορίζει διαφορετικά (ιδίως για καταναλωτές).",
      "Greek law applies. Disputes that are not settled amicably fall to the courts of Chania, unless a mandatory rule says otherwise (especially for consumers).",
      "Es gilt griechisches Recht. Nicht einvernehmlich geklärte Streitigkeiten gehören vor die Gerichte von Chania, soweit keine zwingende Vorschrift etwas anderes bestimmt (insbesondere für Verbraucher).",
      "Le droit grec s’applique. Les litiges non réglés à l’amiable relèvent des tribunaux de La Canée, sauf règle impérative contraire (notamment pour les consommateurs).",
    ),
    p3: s(
      "Για παρατηρήσεις επί του περιεχομένου ή τεχνικά προβλήματα: info@deyaa.gr ή η σελίδα Επικοινωνία, εργάσιμες ημέρες.",
      "For comments on the content or technical problems: info@deyaa.gr or the Contact page, on working days.",
      "Für Hinweise zum Inhalt oder technische Probleme: info@deyaa.gr oder die Kontaktseite an Werktagen.",
      "Pour des remarques sur le contenu ou un problème technique : info@deyaa.gr ou la page Contact, les jours ouvrables.",
    ),
  },
};
