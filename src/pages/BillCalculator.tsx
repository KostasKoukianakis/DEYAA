import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Calculator, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface BillCalculation {
  consumption: number;
  fixedCharge: number;
  waterCharge: number;
  sewerCharge: number;
  total: number;
  category: string;
}

const RATE_CATEGORIES = [
  { value: "residential", label: "Οικιακή Χρήση", multiplier: 1.0 },
  { value: "commercial", label: "Επαγγελματική Χρήση", multiplier: 1.5 },
  { value: "industrial", label: "Βιομηχανική Χρήση", multiplier: 2.0 },
  { value: "agricultural", label: "Γεωργική Χρήση", multiplier: 0.8 },
];

const calculateBill = (consumption: number, category: string): BillCalculation => {
  const categoryMultiplier = RATE_CATEGORIES.find(cat => cat.value === category)?.multiplier || 1.0;

  // Σταθερή χρέωση (ανά τρίμηνο)
  const fixedCharge = 15.00;

  // Χρέωση ύδρευσης (ανά κυβικό μέτρο)
  const waterRate = 0.45 * categoryMultiplier;
  const waterCharge = consumption * waterRate;

  // Χρέωση αποχέτευσης (ανά κυβικό μέτρο)
  const sewerRate = 0.30 * categoryMultiplier;
  const sewerCharge = consumption * sewerRate;

  const total = fixedCharge + waterCharge + sewerCharge;

  return {
    consumption,
    fixedCharge,
    waterCharge,
    sewerCharge,
    total,
    category,
  };
};

export default function BillCalculator() {
  const [consumption, setConsumption] = useState<string>("");
  const [category, setCategory] = useState<string>("residential");
  const [calculation, setCalculation] = useState<BillCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!consumption || parseFloat(consumption) <= 0) return;

    setIsCalculating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = calculateBill(parseFloat(consumption), category);
    setCalculation(result);
    setIsCalculating(false);
  };

  const getConsumptionLevel = (m3: number): string => {
    if (m3 <= 10) return "Πολύ Χαμηλή";
    if (m3 <= 20) return "Χαμηλή";
    if (m3 <= 35) return "Μέση";
    if (m3 <= 50) return "Υψηλή";
    return "Πολύ Υψηλή";
  };

  const getConsumptionColor = (m3: number): string => {
    if (m3 <= 10) return "bg-green-100 text-green-800";
    if (m3 <= 20) return "bg-blue-100 text-blue-800";
    if (m3 <= 35) return "bg-yellow-100 text-yellow-800";
    if (m3 <= 50) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Layout>
      <PageHero
        title="Υπολογισμός Λογαριασμού"
        description="Εκτίμηση χρέωσης ύδρευσης και αποχέτευσης"
        icon={Calculator}
        breadcrumbs={[
          { label: "Αρχική", href: "/" },
          { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
          { label: "Υπολογισμός" },
        ]}
      />
      <div className="container page-section">
        <div className="max-w-4xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Εισαγωγή Δεδομένων
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="consumption">Κατανάλωση (κυβικά μέτρα)</Label>
                <Input
                  id="consumption"
                  type="number"
                  min="0"
                  step="0.1"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  placeholder="π.χ. 25.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Εισάγετε την κατανάλωση σε κυβικά μέτρα για τον τελευταίο τριμηνιαίο λογαριασμό
                </p>
              </div>

              <div>
                <Label htmlFor="category">Κατηγορία Χρήσης</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label} ({cat.multiplier}x τιμή)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!consumption || isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? "Υπολογισμός..." : "Υπολογισμός Λογαριασμού"}
              </Button>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Αυτός είναι ένας εκτιμώμενος υπολογισμός. Το πραγματικό ποσό μπορεί να διαφέρει ανάλογα με διάφορους παράγοντες όπως χρεώσεις, εκπτώσεις κ.λπ.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {calculation && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Αποτελέσματα Υπολογισμού</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Κατανάλωση:</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getConsumptionColor(calculation.consumption)}>
                          {getConsumptionLevel(calculation.consumption)}
                        </Badge>
                        <span className="font-medium">{calculation.consumption} m³</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Σταθερή χρέωση:</span>
                        <span className="font-medium">{calculation.fixedCharge.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Χρέωση ύδρευσης:</span>
                        <span className="font-medium">{calculation.waterCharge.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Χρέωση αποχέτευσης:</span>
                        <span className="font-medium">{calculation.sewerCharge.toFixed(2)} €</span>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Σύνολο:</span>
                          <span className="text-blue-600">{calculation.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ανάλυση Κατανάλωσης</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {(calculation.total / calculation.consumption).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">€ ανά m³</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {(calculation.consumption / 3).toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">m³ ανά μήνα</div>
                      </div>
                    </div>

                    {calculation.consumption > 35 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Η κατανάλωσή σας είναι υψηλή. Εξετάστε τρόπους εξοικονόμησης νερού ή επικοινωνήστε μαζί μας για συμβουλές.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Συμβουλές για εξοικονόμηση:</p>
                      <ul className="space-y-1">
                        <li>• Ελέγξτε για διαρροές σε βρύσες και τουαλέτες</li>
                        <li>• Χρησιμοποιήστε οικονομικούς αερατόρες</li>
                        <li>• Μην αφήνετε το νερό να τρέχει άσκοπα</li>
                        <li>• Συλλέξτε το νερό από την αποχέτευση για πότισμα</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!calculation && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Υπολογίστε το Λογαριασμό σας
                  </h3>
                  <p className="text-gray-600">
                    Εισάγετε τα στοιχεία κατανάλωσής σας για να λάβετε μια εκτίμηση του λογαριασμού σας.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Τιμολογιακή Πολιτική</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Σταθερή χρέωση:</span>
                  <span>15,00 €/τρίμηνο</span>
                </div>
                <div className="flex justify-between">
                  <span>Ύδρευση (οικιακή):</span>
                  <span>0,45 €/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Αποχέτευση (οικιακή):</span>
                  <span>0,30 €/m³</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>ΦΠΑ (13%):</span>
                  <span>Προστίθεται στο σύνολο</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Συχνές Ερωτήσεις</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Πότε εκδίδονται οι λογαριασμοί;</h4>
                <p className="text-sm text-gray-600">Οι λογαριασμοί εκδίδονται τριμηνιαίως.</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Πώς μπορώ να πληρώσω;</h4>
                <p className="text-sm text-gray-600">Μέσω e-banking, στα γραφεία μας ή στα ΚΕΠ.</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Τι γίνεται σε περίπτωση καθυστέρησης;</h4>
                <p className="text-sm text-gray-600">Προσαύξηση 0,5% ανά μήνα.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
}

