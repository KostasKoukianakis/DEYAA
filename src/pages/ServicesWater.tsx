import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, CheckCircle } from "lucide-react";

export default function ServicesWater() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <div className="flex items-center gap-4">
            <Droplets className="h-10 w-10 text-primary-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ύδρευση</h1>
              <p className="text-primary-foreground/80 mt-1">Υπηρεσίες παροχής νερού</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <p className="text-lg text-muted-foreground">
              Η ΔΕΥΑΑ είναι υπεύθυνη για την παροχή καθαρού πόσιμου νερού σε όλους τους κατοίκους 
              της περιοχής. Το δίκτυο ύδρευσης καλύπτει το σύνολο της περιοχής ευθύνης μας και 
              παρέχει νερό υψηλής ποιότητας που ελέγχεται καθημερινά.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Νέα Σύνδεση Ύδρευσης</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Αίτηση στα γραφεία της ΔΕΥΑΑ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Τίτλος ιδιοκτησίας ή μισθωτήριο</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Άδεια οικοδομής (για νέες κατασκευές)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Δελτίο αστυνομικής ταυτότητας</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Αλλαγή Στοιχείων</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Αίτηση αλλαγής στοιχείων</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Αποδεικτικό νέας ιδιοκτησίας/μίσθωσης</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>Εξόφληση τυχόν οφειλών</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ποιότητα Νερού</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Το νερό που παρέχει η ΔΕΥΑΑ ελέγχεται καθημερινά σε διαπιστευμένα εργαστήρια 
                για να διασφαλιστεί η τήρηση όλων των προτύπων ποιότητας. Οι παράμετροι που 
                ελέγχονται περιλαμβάνουν:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span>Μικροβιολογικοί δείκτες</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span>Χημικές παράμετροι</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span>pH και αγωγιμότητα</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span>Υπολειμματικό χλώριο</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
