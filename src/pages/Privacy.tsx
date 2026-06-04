import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="page-section">
        <div className="container max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Πολιτική Απορρήτου & Cookies
          </h1>
          <p className="mt-4 text-muted-foreground">
            Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου (ΔΕΥΑΑ)
          </p>

          <div className="prose prose-slate mt-10 max-w-none space-y-8 text-foreground/90">
            <section>
              <h2 className="font-display text-xl font-bold">1. Υπεύθυνος επεξεργασίας</h2>
              <p>
                Υπεύθυνος επεξεργασίας των προσωπικών δεδομένων που συλλέγονται μέσω του
                ιστοτόπου είναι η ΔΕΥΑΑ. Για θέματα προστασίας δεδομένων μπορείτε να
                επικοινωνήσετε μέσω της σελίδας{" "}
                <a href="/contact" className="text-primary underline-offset-2 hover:underline">
                  Επικοινωνία
                </a>
                .
              </p>
            </section>

            <section id="cookies">
              <h2 className="font-display text-xl font-bold">2. Cookies</h2>
              <p>
                Ο ιστότοπος χρησιμοποιεί cookies σύμφωνα με τον Κανονισμό (ΕΕ) 2016/679 και τον
                Ν. 4624/2019. Τα απαραίτητα cookies είναι αναγκαία για τη λειτουργία του
                ιστόπου. Τα αναλυτικά cookies χρησιμοποιούνται μόνο με τη ρητή συγκατάθεσή
                σας.
              </p>
              <p>
                Μπορείτε να αλλάξετε ή να ανακαλέσετε τη συγκατάθεσή σας ανά πάσα στιγμή μέσω
                του κουμπιού «Cookies» κάτω δεξιά στην οθόνη.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold">3. Δικαιώματα</h2>
              <p>
                Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής, περιορισμού επεξεργασίας,
                φορητότητας και εναντίωσης, καθώς και δικαίωμα υποβολής καταγγελίας στην
                Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr).
              </p>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}
