import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, CheckCircle, AlertTriangle } from "lucide-react";

export default function ServicesSewerage() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <div className="flex items-center gap-4">
            <Waves className="h-10 w-10 text-primary-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Αποχέτευση</h1>
              <p className="text-primary-foreground/80 mt-1">Υπηρεσίες αποχέτευσης</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <p className="text-lg text-muted-foreground">
              Η ΔΕΥΑΑ διαχειρίζεται το δίκτυο αποχέτευσης της περιοχής, συμπεριλαμβανομένης 
              της συλλογής, μεταφοράς και επεξεργασίας των λυμάτων σε σύγχρονες εγκαταστάσεις 
              επεξεργασίας.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Νέα Σύνδεση Αποχέτευσης</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Αίτηση σύνδεσης</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Τοπογραφικό διάγραμμα</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Άδεια οικοδομής</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Κατάθεση εγγύησης</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Βλάβες & Αποφράξεις</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Σε περίπτωση βλάβης στο δίκτυο αποχέτευσης:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Τηλεφωνήστε στο 210 000 0000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Εξυπηρέτηση 24/7 για επείγοντα</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Απαγορεύσεις
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Απαγορεύεται η απόρριψη στο δίκτυο αποχέτευσης:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li>• Λιπών και ελαίων</li>
                <li>• Χημικών ουσιών</li>
                <li>• Μπαταριών</li>
                <li>• Πλαστικών αντικειμένων</li>
                <li>• Φαρμάκων</li>
                <li>• Οικοδομικών υλικών</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
