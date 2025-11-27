import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, Droplets, Waves, FileText } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Ύδρευση",
    description: "Υπηρεσίες παροχής πόσιμου νερού, σύνδεσης, και συντήρησης δικτύου.",
    href: "/services/water",
  },
  {
    icon: Waves,
    title: "Αποχέτευση",
    description: "Συλλογή και επεξεργασία λυμάτων, σύνδεση αποχέτευσης.",
    href: "/services/sewerage",
  },
  {
    icon: FileText,
    title: "Δικαιολογητικά",
    description: "Έντυπα αιτήσεων και απαιτούμενα δικαιολογητικά.",
    href: "/services/documents",
  },
];

export default function Services() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Υπηρεσίες</h1>
          <p className="text-primary-foreground/80 mt-2">Οι υπηρεσίες που παρέχουμε</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.title} to={service.href}>
              <Card className="card-hover h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <span className="inline-flex items-center text-primary text-sm">
                    Περισσότερα <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
