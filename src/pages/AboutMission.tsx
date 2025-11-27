import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Leaf, Shield, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Ποιότητα",
    description: "Παροχή νερού υψηλής ποιότητας που πληροί τα αυστηρότερα πρότυπα ασφαλείας.",
  },
  {
    icon: Leaf,
    title: "Περιβαλλοντική Ευαισθησία",
    description: "Προστασία του περιβάλλοντος μέσω βιώσιμων πρακτικών διαχείρισης νερού.",
  },
  {
    icon: Lightbulb,
    title: "Καινοτομία",
    description: "Εφαρμογή σύγχρονων τεχνολογιών για βελτίωση των υπηρεσιών μας.",
  },
  {
    icon: Target,
    title: "Αξιοπιστία",
    description: "Συνεχής παροχή υπηρεσιών χωρίς διακοπές, 24 ώρες το 24ωρο.",
  },
];

export default function AboutMission() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Αποστολή</h1>
          <p className="text-primary-foreground/80 mt-2">Το όραμα και οι αξίες μας</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Η Αποστολή μας</h2>
            <p className="text-muted-foreground leading-relaxed">
              Η ΔΕΥΑΑ έχει ως αποστολή την παροχή υψηλής ποιότητας υπηρεσιών ύδρευσης και αποχέτευσης 
              στους πολίτες της περιοχής, διασφαλίζοντας την προστασία της δημόσιας υγείας και του 
              περιβάλλοντος. Δεσμευόμαστε για τη συνεχή βελτίωση των υποδομών μας και την εφαρμογή 
              σύγχρονων μεθόδων διαχείρισης υδάτινων πόρων.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Το Όραμά μας</h2>
            <p className="text-muted-foreground leading-relaxed">
              Να αποτελέσουμε πρότυπο οργανισμό παροχής υπηρεσιών κοινής ωφέλειας, με σεβασμό στον 
              πολίτη και το περιβάλλον, αξιοποιώντας τις νέες τεχνολογίες και τις βέλτιστες πρακτικές 
              του κλάδου.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Οι Αξίες μας</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center mb-4">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
