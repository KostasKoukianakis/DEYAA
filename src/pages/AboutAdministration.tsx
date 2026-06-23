import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { administrationIntro, boardMembers } from "@/data/aboutContent";

export default function AboutAdministration() {
  return (
    <Layout>
      <PageHero
        title="Διοίκηση"
        description="Διοικητικό Συμβούλιο"
        icon={Users}
        breadcrumbs={[
          { label: "Αρχική", href: "/" },
          { label: "Η ΔΕΥΑΑ", href: "/about" },
          { label: "Διοίκηση" },
        ]}
      />

      <div className="container page-section">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-8">{administrationIntro}</p>

          <h2 className="text-2xl font-bold mb-6">Μέλη Διοικητικού Συμβουλίου</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardMembers.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                  <p className="text-muted-foreground text-sm mt-1">{member.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Οργανωτική Δομή</h3>
              <p className="text-muted-foreground text-sm">
                Η ΔΕΥΑΑ αποτελείται από τις εξής Διευθύνσεις:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Διεύθυνση Διοικητικών & Οικονομικών Υπηρεσιών</li>
                <li>• Διεύθυνση Τεχνικών Υπηρεσιών</li>
                <li>• Τμήμα Ύδρευσης</li>
                <li>• Τμήμα Αποχέτευσης</li>
                <li>• Τμήμα Εξυπηρέτησης Πολιτών</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
