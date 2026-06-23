import { useRef } from "react";
import { EServiceSubpageLayout } from "@/components/EServiceSubpageLayout";
import { usePaymentDashEntrance } from "@/hooks/usePaymentDashEntrance";
import {
  ArrowUpRight,
  Building2,
  CheckCircle,
  ChevronRight,
  Info,
  Landmark,
  Phone,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { deyaaEServiceSections } from "@/data/deyaaEServicesHub";
import { getPortalHandoff } from "@/data/deyaaExternalServices";

const section = deyaaEServiceSections.find((s) => s.id === "payment")!;
const handoff = getPortalHandoff("payment")!;

const breadcrumbs = [
  { label: "Αρχική", href: "/" },
  { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
  { label: "Πληρωμή" },
];

const SIDE_REQUIREMENTS = [
  "Αριθμός παροχής",
  "Κάρτα για online πληρωμή",
  "Λογαριασμός Taxisnet",
] as const;

const ALT_PAYMENT = [
  {
    icon: Building2,
    title: "Ταμείο",
    text: "Βάμος, Δευ–Παρ",
  },
  {
    icon: Landmark,
    title: "Τράπεζες",
    text: "Κωδικός πληρωμής",
  },
  {
    icon: Phone,
    title: "Τηλέφωνο",
    text: "28253-40213",
    href: "tel:2825340213",
  },
] as const;

const PAYMENT_INFO = [
  "Ψηφιακή απόδειξη μετά την πληρωμή",
  "e-banking, όπου υποστηρίζεται",
] as const;

function PaymentSideCards() {
  return (
    <div className="pe-payment-dash__side-cards">
      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">Τι θα χρειαστείτε</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__checklist pe-payment-dash__checklist--compact pe-payment-dash__checklist--oneline">
          {SIDE_REQUIREMENTS.map((item) => (
            <li key={item}>
              <CheckCircle aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">Εναλλακτικοί τρόποι</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__line-list">
          {ALT_PAYMENT.map(({ icon: Icon, title, text, href }) => (
            <li key={title}>
              <Icon aria-hidden />
              {href ? (
                <a href={href} className="pe-payment-dash__line-link">
                  <strong>{title}</strong> · {text}
                </a>
              ) : (
                <span>
                  <strong>{title}</strong> · {text}
                </span>
              )}
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
          {PAYMENT_INFO.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            <Link to="/contact" className="pe-payment-dash__infolist-link">
              Επικοινωνία για δόσεις
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function EServicesPayment() {
  const pageRef = useRef<HTMLElement>(null);
  usePaymentDashEntrance(pageRef);

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
      title="Πληρωμή Λογαριασμών"
      description={section.lead}
      heroMode="minimal"
      breadcrumbs={breadcrumbs}
      heroAside={<PaymentSideCards />}
      heroCenter={centerArt}
    >
      <div className="pe-payment-dash pe-payment-dash--board">
        <div className="pe-payment-dash__grid">
          <div className="pe-payment-dash__col pe-payment-dash__col--left">
            <div className="pe-payment-dash__card pe-payment-dash__card--action">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__pill">Έτοιμοι για πληρωμή</span>
                <ArrowUpRight className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <div className="pe-payment-dash__action-wrap">
                <a
                  href={handoff.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="palladio-button button outline white"
                >
                  {handoff.ctaLabel}
                </a>
                <p className="pe-payment-dash__card-note">
                  Επιλέξτε <strong>{handoff.portalMenuLabel}</strong>
                </p>
              </div>
            </div>

            <div className="pe-payment-dash__card pe-payment-dash__card--stat">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__card-label">Επίσημη πλατφόρμα</span>
                <Shield className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <p className="pe-payment-dash__stat-value">services.deyaa.gr</p>
              <p className="pe-payment-dash__stat-meta">24/7 · Κρυπτογραφημένη σύνδεση</p>
            </div>
          </div>
        </div>
      </div>
    </EServiceSubpageLayout>
  );
}
