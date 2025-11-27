import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, Target, Users, Building } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Η ΔΕΥΑΑ</h1>
          <p className="text-primary-foreground/80 mt-2">Γνωρίστε την επιχείρηση</p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-lg text-muted-foreground">
            Η Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αττικής (ΔΕΥΑΑ) είναι νομικό πρόσωπο ιδιωτικού δικαίου 
            με κοινωφελή χαρακτήρα, που ιδρύθηκε με σκοπό την παροχή υπηρεσιών ύδρευσης και αποχέτευσης 
            στους κατοίκους της περιοχής.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Link to="/about/mission">
            <Card className="card-hover h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Αποστολή</h3>
                  <p className="text-muted-foreground text-sm">
                    Οι στόχοι και το όραμα της ΔΕΥΑΑ για την παροχή υψηλής ποιότητας υπηρεσιών.
                  </p>
                  <span className="inline-flex items-center text-primary text-sm mt-3">
                    Περισσότερα <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/about/administration">
            <Card className="card-hover h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Διοίκηση</h3>
                  <p className="text-muted-foreground text-sm">
                    Τα μέλη του Διοικητικού Συμβουλίου και η οργανωτική δομή της επιχείρησης.
                  </p>
                  <span className="inline-flex items-center text-primary text-sm mt-3">
                    Περισσότερα <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
