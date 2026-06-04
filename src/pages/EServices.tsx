import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, CreditCard, Gauge } from "lucide-react";

const eservices = [
  {
    icon: CreditCard,
    title: "Πληρωμή Λογαριασμών",
    description: "Εξοφλήστε τον λογαριασμό νερού σας online με ασφάλεια.",
    href: "/e-services/payment",
  },
  {
    icon: Gauge,
    title: "Δήλωση Ένδειξης Μετρητή",
    description: "Καταχωρήστε την ένδειξη του υδρομέτρου σας ηλεκτρονικά.",
    href: "/e-services/meter-reading",
  },
];

export default function EServices() {
  return (
    <Layout>
      <PageHero
        title="Ηλεκτρονικές Υπηρεσίες"
        description="Εξυπηρέτηση από το σπίτι σας"
        breadcrumbs={[{ label: "Αρχική", href: "/" }, { label: "Ηλεκτρονικές Υπηρεσίες" }]}
      />

      <div className="container page-section">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-8">
            Μέσω των ηλεκτρονικών υπηρεσιών της ΔΕΥΑΑ μπορείτε να διεκπεραιώσετε τις 
            βασικές σας συναλλαγές χωρίς να χρειαστεί να επισκεφθείτε τα γραφεία μας.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {eservices.map((service) => (
              <Link key={service.title} to={service.href}>
                <Card className="card-hover h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                      <service.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <span className="inline-flex items-center text-primary font-medium">
                      Μετάβαση <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
