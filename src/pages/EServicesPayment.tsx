import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, Shield, Clock, CheckCircle } from "lucide-react";

export default function EServicesPayment() {
  return (
    <Layout>
      <PageHero
        title="Πληρωμή Λογαριασμών"
        description="Online εξόφληση λογαριασμού νερού"
        icon={CreditCard}
        breadcrumbs={[
          { label: "Αρχική", href: "/" },
          { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
          { label: "Πληρωμή" },
        ]}
      />

      <div className="container page-section">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Ασφαλείς Συναλλαγές</h3>
                <p className="text-sm text-muted-foreground">Κρυπτογραφημένη σύνδεση SSL</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">24/7 Διαθεσιμότητα</h3>
                <p className="text-sm text-muted-foreground">Πληρωμή οποιαδήποτε στιγμή</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Άμεση Ενημέρωση</h3>
                <p className="text-sm text-muted-foreground">Αυτόματη απόδειξη πληρωμής</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Πληρωμή μέσω Τράπεζας</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Για την πληρωμή του λογαριασμού σας, θα μεταφερθείτε στην ασφαλή πλατφόρμα 
                πληρωμών της συνεργαζόμενης τράπεζας. Θα χρειαστείτε:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Τον αριθμό παροχής (αναγράφεται στον λογαριασμό)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Πιστωτική ή χρεωστική κάρτα</span>
                </li>
              </ul>
              <Button size="lg">
                Μετάβαση στην Πληρωμή
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Εναλλακτικοί Τρόποι Πληρωμής</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-medium text-foreground w-32">Ταμείο ΔΕΥΑΑ:</span>
                  <span>Λεωφ. Παραδείγματος 123, Αθήνα (Δευ-Παρ 08:00-14:00)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-foreground w-32">Τράπεζες:</span>
                  <span>Όλες οι τράπεζες με τον κωδικό πληρωμής</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-foreground w-32">ΕΛΤΑ:</span>
                  <span>Σε όλα τα ταχυδρομεία πανελλαδικά</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
