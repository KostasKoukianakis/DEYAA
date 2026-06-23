import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Calculator,
  CheckCircle,
  ChevronRight,
  Droplets,
  Info,
  Layers,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EServiceSubpageLayout } from "@/components/EServiceSubpageLayout";
import { usePaymentDashEntrance } from "@/hooks/usePaymentDashEntrance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deyaaEServiceSections } from "@/data/deyaaEServicesHub";

const section = deyaaEServiceSections.find((s) => s.id === "bill-calculator")!;

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
] as const;

const SIDE_INPUTS = ["Κατανάλωση σε m³", "Κατηγορία χρήσης", "Τριμηνιαία περίοδος"] as const;

const PRICING_LINES = [
  { icon: Receipt, title: "Σταθερή", text: "15,00 € / τρίμηνο" },
  { icon: Droplets, title: "Ύδρευση", text: "0,45 € / m³ (οικιακή)" },
  { icon: Layers, title: "Αποχέτευση", text: "0,30 € / m³ (οικιακή)" },
] as const;

const CALC_INFO = [
  "Ενδεικτική εκτίμηση — όχι τελικό ποσό",
  "Λογαριασμοί εκδίδονται τριμηνιαίως",
] as const;

const breadcrumbs = [
  { label: "Αρχική", href: "/" },
  { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
  { label: "Υπολογισμός" },
];

const calculateBill = (consumption: number, category: string): BillCalculation => {
  const categoryMultiplier =
    RATE_CATEGORIES.find((cat) => cat.value === category)?.multiplier || 1.0;
  const fixedCharge = 15.0;
  const waterCharge = consumption * 0.45 * categoryMultiplier;
  const sewerCharge = consumption * 0.3 * categoryMultiplier;

  return {
    consumption,
    fixedCharge,
    waterCharge,
    sewerCharge,
    total: fixedCharge + waterCharge + sewerCharge,
    category,
  };
};

function getConsumptionLevel(m3: number): string {
  if (m3 <= 10) return "Πολύ χαμηλή";
  if (m3 <= 20) return "Χαμηλή";
  if (m3 <= 35) return "Μέση";
  if (m3 <= 50) return "Υψηλή";
  return "Πολύ υψηλή";
}

function CalculatorSideCards() {
  return (
    <div className="pe-payment-dash__side-cards">
      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">Τι εισάγετε</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__checklist pe-payment-dash__checklist--compact pe-payment-dash__checklist--oneline">
          {SIDE_INPUTS.map((item) => (
            <li key={item}>
              <CheckCircle aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">Τιμολογιακή πολιτική</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__line-list">
          {PRICING_LINES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon aria-hidden />
              <span>
                <strong>{title}</strong> · {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">Χρήσιμες πληροφορίες</h2>
          <Info className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__infolist pe-payment-dash__infolist--compact pe-payment-dash__infolist--oneline">
          {CALC_INFO.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            <Link to="/e-services/payment" className="pe-payment-dash__infolist-link">
              Πληρωμή λογαριασμού
            </Link>
          </li>
          <li>
            <Link to="/e-services/meter-reading" className="pe-payment-dash__infolist-link">
              Δήλωση ένδειξης
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function BillCalculator() {
  const pageRef = useRef<HTMLElement>(null);
  usePaymentDashEntrance(pageRef);

  const [consumption, setConsumption] = useState("");
  const [category, setCategory] = useState("residential");
  const [calculation, setCalculation] = useState<BillCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!consumption || parseFloat(consumption) <= 0) return;

    setIsCalculating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCalculation(calculateBill(parseFloat(consumption), category));
    setIsCalculating(false);
  };

  const centerArt = (
    <div
      className="pe-payment-dash__col pe-payment-dash__col--center dash-board__center-art"
      aria-hidden
      style={{ backgroundImage: `url(${section.image})` }}
    />
  );

  return (
    <EServiceSubpageLayout
      pageRef={pageRef}
      className="pe-payment-entrance pe-payment-entrance-pending"
      title="Υπολογισμός Λογαριασμού"
      description={section.lead}
      heroMode="minimal"
      breadcrumbs={breadcrumbs}
      heroAside={<CalculatorSideCards />}
      heroCenter={centerArt}
    >
      <div className="pe-payment-dash pe-payment-dash--board">
        <div className="pe-payment-dash__grid">
          <div className="pe-payment-dash__col pe-payment-dash__col--left">
            <div className="pe-payment-dash__card pe-payment-dash__card--calc">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__pill">Εκτίμηση κατανάλωσης</span>
                <Calculator className="pe-payment-dash__card-corner" aria-hidden />
              </div>

              <div className="pe-calc-dash__form">
                <div className="pe-calc-dash__field">
                  <Label htmlFor="consumption" className="pe-calc-dash__label">
                    Κατανάλωση (m³)
                  </Label>
                  <Input
                    id="consumption"
                    type="number"
                    min="0"
                    step="0.1"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    placeholder="π.χ. 25.5"
                    className="pe-calc-dash__input"
                  />
                </div>

                <div className="pe-calc-dash__field">
                  <Label htmlFor="category" className="pe-calc-dash__label">
                    Κατηγορία χρήσης
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="pe-calc-dash__select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RATE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pe-calc-dash__submit-wrap">
                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={!consumption || isCalculating}
                    className="pe-calc-dash__cta"
                  >
                    <span className="pe-calc-dash__cta-icon" aria-hidden>
                      <Calculator />
                    </span>
                    <span className="pe-calc-dash__cta-copy">
                      <span className="pe-calc-dash__cta-label">
                        {isCalculating ? "Υπολογισμός..." : "Υπολογισμός λογαριασμού"}
                      </span>
                      <span className="pe-calc-dash__cta-hint">
                        Εκτίμηση τριμηνιαίας χρέωσης
                      </span>
                    </span>
                  </button>
                </div>

                <p className="pe-calc-dash__note">
                  Ενδεικτική εκτίμηση — το τελικό ποσό μπορεί να διαφέρει.
                </p>
              </div>

              {calculation && (
                <div className="pe-calc-dash__results" aria-live="polite">
                  <div className="pe-calc-dash__results-head">
                    <span className="pe-calc-dash__results-level">
                      {getConsumptionLevel(calculation.consumption)}
                    </span>
                    <span className="pe-calc-dash__results-consumption">
                      {calculation.consumption} m³
                    </span>
                  </div>

                  <dl className="pe-calc-dash__breakdown">
                    <div>
                      <dt>Σταθερή χρέωση</dt>
                      <dd>{calculation.fixedCharge.toFixed(2)} €</dd>
                    </div>
                    <div>
                      <dt>Ύδρευση</dt>
                      <dd>{calculation.waterCharge.toFixed(2)} €</dd>
                    </div>
                    <div>
                      <dt>Αποχέτευση</dt>
                      <dd>{calculation.sewerCharge.toFixed(2)} €</dd>
                    </div>
                  </dl>

                  <div className="pe-calc-dash__total">
                    <span>Σύνολο</span>
                    <strong>{calculation.total.toFixed(2)} €</strong>
                  </div>

                  <div className="pe-calc-dash__meta">
                    <span>{(calculation.total / calculation.consumption).toFixed(2)} € / m³</span>
                    <span>{(calculation.consumption / 3).toFixed(1)} m³ / μήνα</span>
                  </div>

                  {calculation.consumption > 35 && (
                    <p className="pe-calc-dash__alert">
                      <AlertTriangle aria-hidden />
                      Υψηλή κατανάλωση — εξετάστε τρόπους εξοικονόμησης νερού.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pe-payment-dash__card pe-payment-dash__card--action">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__pill">Επόμενο βήμα</span>
                <ArrowUpRight className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <div className="pe-payment-dash__action-wrap">
                <Link
                  to="/e-services/payment"
                  className="palladio-button button outline white"
                >
                  Πληρωμή λογαριασμού
                </Link>
                <p className="pe-payment-dash__card-note">
                  Μετά την εκτίμηση, συνεχίστε στην <strong>online πληρωμή</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EServiceSubpageLayout>
  );
}
