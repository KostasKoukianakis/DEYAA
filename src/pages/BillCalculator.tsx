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
import { useI18n } from "@/i18n";
import { getLocalizedEServiceSections } from "@/i18n/localized";

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
  { value: "residential", multiplier: 1.0 },
  { value: "commercial", multiplier: 1.5 },
  { value: "industrial", multiplier: 2.0 },
  { value: "agricultural", multiplier: 0.8 },
] as const;

const SIDE_INPUTS = ["eServices.bill.side0", "eServices.bill.side1", "eServices.bill.side2"] as const;

const PRICING_LINES = [
  { icon: Receipt, titleKey: "eServices.bill.pricing.fixedTitle", textKey: "eServices.bill.pricing.fixedText" },
  { icon: Droplets, titleKey: "eServices.bill.pricing.waterTitle", textKey: "eServices.bill.pricing.waterText" },
  { icon: Layers, titleKey: "eServices.bill.pricing.sewerTitle", textKey: "eServices.bill.pricing.sewerText" },
] as const;

const CALC_INFO = ["eServices.bill.info0", "eServices.bill.info1"] as const;

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

function getConsumptionLevel(m3: number, t: (path: string) => string): string {
  if (m3 <= 10) return t("eServices.bill.usageVeryLow");
  if (m3 <= 20) return t("eServices.bill.usageLow");
  if (m3 <= 35) return t("eServices.bill.usageMid");
  if (m3 <= 50) return t("eServices.bill.usageHigh");
  return t("eServices.bill.usageVeryHigh");
}

function CalculatorSideCards() {
  const { t } = useI18n();
  return (
    <div className="pe-payment-dash__side-cards">
      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.bill.inputsTitle")}</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__checklist pe-payment-dash__checklist--compact pe-payment-dash__checklist--oneline">
          {SIDE_INPUTS.map((key) => (
            <li key={key}>
              <CheckCircle aria-hidden />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.bill.pricingTitle")}</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__line-list">
          {PRICING_LINES.map(({ icon: Icon, titleKey, textKey }) => (
            <li key={titleKey}>
              <Icon aria-hidden />
              <span>
                <strong>{t(titleKey)}</strong> · {t(textKey)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.bill.infoTitle")}</h2>
          <Info className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__infolist pe-payment-dash__infolist--compact pe-payment-dash__infolist--oneline">
          {CALC_INFO.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
          <li>
            <Link to="/e-services/payment" className="pe-payment-dash__infolist-link">
              {t("eServices.bill.payLink")}
            </Link>
          </li>
          <li>
            <Link to="/e-services/meter-reading" className="pe-payment-dash__infolist-link">
              {t("eServices.bill.meterLink")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function BillCalculator() {
  const { t } = useI18n();
  const pageRef = useRef<HTMLElement>(null);
  usePaymentDashEntrance(pageRef);

  const [consumption, setConsumption] = useState("");
  const [category, setCategory] = useState("residential");
  const [calculation, setCalculation] = useState<BillCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const localizedLead = getLocalizedEServiceSections().find((s) => s.id === "bill-calculator")?.lead;
  const breadcrumbs = [
    { label: t("nav.home"), href: "/" },
    { label: t("footer.eServices"), href: "/e-services" },
    { label: t("eServices.bill.breadcrumb") },
  ];

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
      title={t("eServices.bill.title")}
      description={localizedLead ?? section.lead}
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
                <span className="pe-payment-dash__pill">{t("eServices.bill.estimatePill")}</span>
                <Calculator className="pe-payment-dash__card-corner" aria-hidden />
              </div>

              <div className="pe-calc-dash__form">
                <div className="pe-calc-dash__field">
                  <Label htmlFor="consumption" className="pe-calc-dash__label">
                    {t("eServices.bill.consumptionLabel")}
                  </Label>
                  <Input
                    id="consumption"
                    type="number"
                    min="0"
                    step="0.1"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    placeholder={t("eServices.bill.consumptionPlaceholder")}
                    className="pe-calc-dash__input"
                  />
                </div>

                <div className="pe-calc-dash__field">
                  <Label htmlFor="category" className="pe-calc-dash__label">
                    {t("eServices.bill.categoryLabel")}
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="pe-calc-dash__select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RATE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {t(`eServices.bill.categories.${cat.value}`)}
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
                        {isCalculating ? t("eServices.bill.calculating") : t("eServices.bill.calculate")}
                      </span>
                      <span className="pe-calc-dash__cta-hint">
                        {t("eServices.bill.calculateHint")}
                      </span>
                    </span>
                  </button>
                </div>

                <p className="pe-calc-dash__note">
                  {t("eServices.bill.estimateNote")}
                </p>
              </div>

              {calculation && (
                <div className="pe-calc-dash__results" aria-live="polite">
                  <div className="pe-calc-dash__results-head">
                    <span className="pe-calc-dash__results-level">
                      {getConsumptionLevel(calculation.consumption, t)}
                    </span>
                    <span className="pe-calc-dash__results-consumption">
                      {calculation.consumption} m³
                    </span>
                  </div>

                  <dl className="pe-calc-dash__breakdown">
                    <div>
                      <dt>{t("eServices.bill.fixedCharge")}</dt>
                      <dd>{calculation.fixedCharge.toFixed(2)} €</dd>
                    </div>
                    <div>
                      <dt>{t("eServices.bill.waterCharge")}</dt>
                      <dd>{calculation.waterCharge.toFixed(2)} €</dd>
                    </div>
                    <div>
                      <dt>{t("eServices.bill.sewerCharge")}</dt>
                      <dd>{calculation.sewerCharge.toFixed(2)} €</dd>
                    </div>
                  </dl>

                  <div className="pe-calc-dash__total">
                    <span>{t("eServices.bill.total")}</span>
                    <strong>{calculation.total.toFixed(2)} €</strong>
                  </div>

                  <div className="pe-calc-dash__meta">
                    <span>{(calculation.total / calculation.consumption).toFixed(2)} € / m³</span>
                    <span>{(calculation.consumption / 3).toFixed(1)} m³ / μήνα</span>
                  </div>

                  {calculation.consumption > 35 && (
                    <p className="pe-calc-dash__alert">
                      <AlertTriangle aria-hidden />
                      {t("eServices.bill.highUsageAlert")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pe-payment-dash__card pe-payment-dash__card--action">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__pill">{t("eServices.bill.nextStep")}</span>
                <ArrowUpRight className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <div className="pe-payment-dash__action-wrap">
                <Link
                  to="/e-services/payment"
                  className="palladio-button button outline white"
                >
                  {t("eServices.bill.payLink")}
                </Link>
                <p className="pe-payment-dash__card-note">
                  {t("eServices.bill.afterEstimate")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EServiceSubpageLayout>
  );
}
