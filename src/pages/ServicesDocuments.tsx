import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const documents = [
  {
    title: "Αίτηση Νέας Σύνδεσης Ύδρευσης",
    description: "Για νέες παροχές νερού σε οικίες και επιχειρήσεις.",
    category: "Ύδρευση",
  },
  {
    title: "Αίτηση Νέας Σύνδεσης Αποχέτευσης",
    description: "Για σύνδεση στο δίκτυο αποχέτευσης.",
    category: "Αποχέτευση",
  },
  {
    title: "Αίτηση Αλλαγής Στοιχείων Καταναλωτή",
    description: "Για αλλαγή ονόματος ή στοιχείων παροχής.",
    category: "Γενικά",
  },
  {
    title: "Αίτηση Διακοπής Υδροδότησης",
    description: "Για προσωρινή ή μόνιμη διακοπή παροχής.",
    category: "Ύδρευση",
  },
  {
    title: "Αίτηση Ελέγχου Μετρητή",
    description: "Για έλεγχο ορθής λειτουργίας του υδρομέτρου.",
    category: "Ύδρευση",
  },
  {
    title: "Αίτηση Ρύθμισης Οφειλών",
    description: "Για διακανονισμό εξόφλησης οφειλών.",
    category: "Οικονομικά",
  },
];

export default function ServicesDocuments() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <div className="flex items-center gap-4">
            <FileText className="h-10 w-10 text-primary-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Δικαιολογητικά</h1>
              <p className="text-primary-foreground/80 mt-1">Έντυπα και αιτήσεις</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-8">
            Κατεβάστε τα απαραίτητα έντυπα για τις υπηρεσίες της ΔΕΥΑΑ. Μπορείτε να τα 
            υποβάλετε αυτοπροσώπως στα γραφεία μας ή ηλεκτρονικά μέσω email.
          </p>

          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.title}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
